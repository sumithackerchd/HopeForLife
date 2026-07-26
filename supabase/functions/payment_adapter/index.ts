import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function verifySignature(orderId: string, paymentId: string, signature: string, secret: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(orderId + "|" + paymentId);
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, data);
  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  const generatedSignature = signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return generatedSignature === signature;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { action } = body;
    
    const keyId = Deno.env.get('RAZORPAY_KEY_ID');
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

    if (!keyId || !keySecret) {
      throw new Error('Razorpay credentials not configured on the server');
    }

    if (action === 'create_order') {
      const { amount, currency } = body;
      const razorpayAmount = Math.round(amount * 100); // convert to smallest unit (paise/cents)
      
      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${keyId}:${keySecret}`),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: razorpayAmount,
          currency: currency,
          receipt: 'rcpt_' + Date.now(),
        })
      });
      
      const order = await response.json();
      if (order.error) {
        throw new Error(order.error.description);
      }
      
      return new Response(JSON.stringify({
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: keyId,
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });

    } else if (action === 'verify_payment') {
      const { 
        razorpay_order_id, razorpay_payment_id, razorpay_signature,
        amount, currency, donor_name, email, message, is_anonymous, gateway, user_id, campaign_id
      } = body;
      
      const isValid = await verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature, keySecret);
      
      if (!isValid) {
        throw new Error('Invalid payment signature');
      }
      
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      
      if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Supabase environment variables not set');
      }

      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
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
          user_id,
          campaign_id,
          transaction_id: razorpay_payment_id
        })
        .select()
        .single();
        
      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }
      
      return new Response(JSON.stringify({ success: true, donation }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });

    } else {
      throw new Error('Invalid action');
    }

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
