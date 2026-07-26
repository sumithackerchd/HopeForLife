import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { amount, currency, gateway, donation_id } = await req.json();

    // Universal adapter logic
    let checkoutUrl = '';
    
    switch (gateway) {
      case 'stripe':
        // const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!);
        // create checkout session
        checkoutUrl = `https://checkout.stripe.com/pay/cs_test_mock_${donation_id}`;
        break;
      case 'razorpay':
        // razorpay logic
        checkoutUrl = `https://checkout.razorpay.com/mock/${donation_id}`;
        break;
      case 'paypal':
        // paypal logic
        checkoutUrl = `https://paypal.com/checkoutnow?token=mock_${donation_id}`;
        break;
      default:
        throw new Error('Unsupported payment gateway');
    }

    return new Response(
      JSON.stringify({ url: checkoutUrl }),
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
