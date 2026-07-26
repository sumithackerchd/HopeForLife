-- 1. Create is_admin helper function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_role text;
BEGIN
  SELECT role INTO v_role FROM public.profiles WHERE id = auth.uid();
  RETURN coalesce(v_role = 'admin', false);
END;
$$;

-- 2. Create tables
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  avatar_url text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now() not null
);

CREATE TABLE IF NOT EXISTS public.campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  beneficiary text not null,
  hospital text,
  goal_amount decimal(12,2) not null default 0.00,
  current_raised_amount decimal(12,2) not null default 0.00,
  category text,
  story text,
  cover_image text,
  status text default 'draft' check (status in ('draft', 'published', 'archived')),
  seo_title text,
  seo_description text,
  seo_keywords text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

CREATE TABLE IF NOT EXISTS public.donations (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references public.campaigns(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  donor_name text,
  email text,
  amount decimal(12,2) not null,
  currency text default 'INR',
  message text,
  is_anonymous boolean default false,
  payment_status text default 'pending' check (payment_status in ('pending', 'completed', 'failed', 'refunded')),
  payment_gateway text,
  transaction_id text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

CREATE TABLE IF NOT EXISTS public.medical_reports (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references public.campaigns(id) on delete cascade not null,
  title text not null,
  file_url text not null,
  verified boolean default false,
  created_at timestamptz default now() not null
);

CREATE TABLE IF NOT EXISTS public.updates (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references public.campaigns(id) on delete cascade not null,
  title text not null,
  content text not null,
  created_at timestamptz default now() not null
);

CREATE TABLE IF NOT EXISTS public.settings (
  id integer primary key default 1,
  target_amount decimal(12,2) not null default 1000000.00,
  raised_amount decimal(12,2) not null default 0.00,
  hero_title text not null default 'Help Us Save A Life',
  hero_subtitle text,
  child_name text,
  about_text text,
  currency text default 'INR',
  updated_at timestamptz default now() not null
);

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  status text default 'subscribed' check (status in ('subscribed', 'unsubscribed')),
  created_at timestamptz default now() not null
);

CREATE TABLE IF NOT EXISTS public.payment_logs (
  id uuid primary key default gen_random_uuid(),
  donation_id uuid references public.donations(id) on delete cascade,
  status text,
  raw_response jsonb,
  created_at timestamptz default now() not null
);

CREATE TABLE IF NOT EXISTS public.webhook_logs (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  payload jsonb,
  processed boolean default false,
  error_message text,
  created_at timestamptz default now() not null
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(status);
CREATE INDEX IF NOT EXISTS idx_donations_campaign_id ON public.donations(campaign_id);
CREATE INDEX IF NOT EXISTS idx_donations_user_id ON public.donations(user_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON public.donations(payment_status);
CREATE INDEX IF NOT EXISTS idx_medical_reports_campaign_id ON public.medical_reports(campaign_id);
CREATE INDEX IF NOT EXISTS idx_updates_campaign_id ON public.updates(campaign_id);
CREATE INDEX IF NOT EXISTS idx_payment_logs_donation_id ON public.payment_logs(donation_id);

-- 4. Secure RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own, admins can read/update all
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
CREATE POLICY "Admins can manage all profiles" ON public.profiles FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Campaigns: public can read published, admins can manage all
DROP POLICY IF EXISTS "Published campaigns are viewable by everyone" ON public.campaigns;
CREATE POLICY "Published campaigns are viewable by everyone" ON public.campaigns FOR SELECT USING (status = 'published');
DROP POLICY IF EXISTS "Admins can manage campaigns" ON public.campaigns;
CREATE POLICY "Admins can manage campaigns" ON public.campaigns FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Donations: anyone can insert, users can read their own, admins can manage all
DROP POLICY IF EXISTS "Anyone can insert donations" ON public.donations;
CREATE POLICY "Anyone can insert donations" ON public.donations FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Users can view own donations" ON public.donations;
CREATE POLICY "Users can view own donations" ON public.donations FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can manage donations" ON public.donations;
CREATE POLICY "Admins can manage donations" ON public.donations FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Medical Reports: public can read verified, admins can manage all
DROP POLICY IF EXISTS "Verified medical reports are viewable by everyone" ON public.medical_reports;
CREATE POLICY "Verified medical reports are viewable by everyone" ON public.medical_reports FOR SELECT USING (verified = true);
DROP POLICY IF EXISTS "Admins can manage medical reports" ON public.medical_reports;
CREATE POLICY "Admins can manage medical reports" ON public.medical_reports FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Updates: public can read, admins can manage all
DROP POLICY IF EXISTS "Updates are viewable by everyone" ON public.updates;
CREATE POLICY "Updates are viewable by everyone" ON public.updates FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage updates" ON public.updates;
CREATE POLICY "Admins can manage updates" ON public.updates FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Settings: public can read, admins can manage all
DROP POLICY IF EXISTS "Settings are viewable by everyone" ON public.settings;
CREATE POLICY "Settings are viewable by everyone" ON public.settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage settings" ON public.settings;
CREATE POLICY "Admins can manage settings" ON public.settings FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Newsletter: anyone can insert, admins can manage all
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins can manage subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins can manage subscribers" ON public.newsletter_subscribers FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Logs: Admins only
DROP POLICY IF EXISTS "Admins can manage payment logs" ON public.payment_logs;
CREATE POLICY "Admins can manage payment logs" ON public.payment_logs FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "Admins can manage webhook logs" ON public.webhook_logs;
CREATE POLICY "Admins can manage webhook logs" ON public.webhook_logs FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 5. Storage Buckets & Policies
INSERT INTO storage.buckets (id, name, public) VALUES ('campaign-images', 'campaign-images', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('medical-reports', 'medical-reports', true) ON CONFLICT DO NOTHING;

DROP POLICY IF EXISTS "Campaign images viewable by everyone" ON storage.objects;
CREATE POLICY "Campaign images viewable by everyone" ON storage.objects FOR SELECT USING (bucket_id = 'campaign-images');
DROP POLICY IF EXISTS "Campaign images updatable by admins" ON storage.objects;
CREATE POLICY "Campaign images updatable by admins" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'campaign-images' AND public.is_admin());
DROP POLICY IF EXISTS "Campaign images modifiable by admins" ON storage.objects;
CREATE POLICY "Campaign images modifiable by admins" ON storage.objects FOR UPDATE USING (bucket_id = 'campaign-images' AND public.is_admin());
DROP POLICY IF EXISTS "Campaign images deletable by admins" ON storage.objects;
CREATE POLICY "Campaign images deletable by admins" ON storage.objects FOR DELETE USING (bucket_id = 'campaign-images' AND public.is_admin());

DROP POLICY IF EXISTS "Medical reports viewable by everyone" ON storage.objects;
CREATE POLICY "Medical reports viewable by everyone" ON storage.objects FOR SELECT USING (bucket_id = 'medical-reports');
DROP POLICY IF EXISTS "Medical reports updatable by admins" ON storage.objects;
CREATE POLICY "Medical reports updatable by admins" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'medical-reports' AND public.is_admin());
DROP POLICY IF EXISTS "Medical reports modifiable by admins" ON storage.objects;
CREATE POLICY "Medical reports modifiable by admins" ON storage.objects FOR UPDATE USING (bucket_id = 'medical-reports' AND public.is_admin());
DROP POLICY IF EXISTS "Medical reports deletable by admins" ON storage.objects;
CREATE POLICY "Medical reports deletable by admins" ON storage.objects FOR DELETE USING (bucket_id = 'medical-reports' AND public.is_admin());