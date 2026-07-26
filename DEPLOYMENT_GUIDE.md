# Edge Function Deployment Guide

To resolve the `404 Not Found` and `CORS Error` on `/functions/v1/payment_adapter`, you must deploy the Edge Function to your remote Supabase project. The `payment_adapter` code is already written correctly in your repository, but Supabase requires Edge Functions to be explicitly pushed to their servers via the CLI.

## Prerequisites
Make sure you have the Supabase CLI installed. If not, install it via npm:
```bash
npm install -g supabase
```

## Deployment Steps

### 1. Log in to Supabase CLI
```bash
npx supabase login
```
*(You will be prompted to generate and paste an Access Token from your Supabase dashboard).*

### 2. Link your local project to your remote Supabase project
```bash
npx supabase link --project-ref dkctyxhkolgdqehkqsae
```
*(Enter your database password when prompted).*

### 3. Set the required secrets for the Edge Function
The `payment_adapter` function requires your Supabase URL and Service Role Key to bypass RLS and insert donations securely.
```bash
npx supabase secrets set SUPABASE_URL=https://dkctyxhkolgdqehkqsae.supabase.co --project-ref dkctyxhkolgdqehkqsae

npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here --project-ref dkctyxhkolgdqehkqsae
```
*(Note: You can find your `SERVICE_ROLE_KEY` in the Supabase Dashboard under Settings > API. Do NOT expose this key in your frontend `.env` file).*

### 4. Deploy the Edge Function
Because guest donations don't have a signed-in user token, you **must** deploy the function with the `--no-verify-jwt` flag so it doesn't block anonymous requests:
```bash
npx supabase functions deploy payment_adapter --project-ref dkctyxhkolgdqehkqsae --no-verify-jwt
```

## Verification
Once deployed, your frontend endpoint:
`supabase.functions.invoke('payment_adapter', { ... })`
will correctly resolve to `https://dkctyxhkolgdqehkqsae.supabase.co/functions/v1/payment_adapter` and return `200 OK`.
