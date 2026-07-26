import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { amount, currency, donor_name, email, message, is_anonymous, gateway, user_id } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase environment variables not set');
    }

    // Initialize Supabase with the Service Role Key to bypass RLS for this internal operation
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Create the donation record with service role key (bypasses RLS).
    // Marking it as completed here for the mock flow. In a real scenario, this would be 'pending',
    // and a webhook from Stripe/Razorpay would later update it to 'completed'.
    const { data: donation, error } = await supabase
      .from('donations')
      .insert({
        amount,
        currency,
        donor_name,
        email,
        message,
        is_anonymous,
        payment_gateway: gateway,
        payment_status: 'completed',
        user_id
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    // Universal adapter logic
    let checkoutUrl = '';
    
    switch (gateway) {
      case 'stripe':
        checkoutUrl = `https://checkout.stripe.com/pay/cs_test_mock_${donation.id}`;
        break;
      case 'razorpay':
        checkoutUrl = `https://checkout.razorpay.com/mock/${donation.id}`;
        break;
      case 'paypal':
        checkoutUrl = `https://paypal.com/checkoutnow?token=mock_${donation.id}`;
        break;
      default:
        throw new Error('Unsupported payment gateway');
    }

    return new Response(
      JSON.stringify({ url: checkoutUrl, donation }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});
