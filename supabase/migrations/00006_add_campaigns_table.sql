-- Campaigns table
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

-- Add campaign_id to donations
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS campaign_id uuid references public.campaigns(id) on delete set null;

-- RLS for campaigns
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published campaigns are viewable by everyone" ON public.campaigns FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can manage campaigns" ON public.campaigns FOR ALL USING (public.is_admin());

-- Update Donations RLS slightly (if not using Admin is_admin)
-- Already handled by previous migrations which converted this to use public.is_admin()

-- Setup storage bucket for campaigns
insert into storage.buckets (id, name, public) values ('campaigns', 'campaigns', true) on conflict do nothing;
CREATE POLICY "Campaign images viewable by everyone." ON storage.objects FOR SELECT USING (bucket_id = 'campaigns');
CREATE POLICY "Campaign images updatable by admins." ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'campaigns' AND public.is_admin()
);
