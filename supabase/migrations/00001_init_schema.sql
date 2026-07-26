-- Profiles for extended user info
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  avatar_url text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now() not null
);

-- Platform settings
CREATE TABLE IF NOT EXISTS public.platform_settings (
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

-- Donations table
CREATE TABLE IF NOT EXISTS public.donations (
  id uuid primary key default gen_random_uuid(),
  donor_name text,
  email text,
  amount decimal(12,2) not null,
  currency text default 'INR',
  message text,
  is_anonymous boolean default false,
  payment_gateway text,
  payment_status text default 'pending' check (payment_status in ('pending', 'completed', 'failed')),
  transaction_id text,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz default now() not null
);

-- Medical Reports
CREATE TABLE IF NOT EXISTS public.medical_reports (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  file_url text not null,
  file_type text default 'pdf',
  is_verified boolean default true,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now() not null
);

-- Timeline updates
CREATE TABLE IF NOT EXISTS public.updates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  image_url text,
  published_at timestamptz default now() not null,
  author_id uuid references auth.users(id) on delete set null,
  created_at timestamptz default now() not null
);

-- Blog posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  content text not null,
  featured_image text,
  category text,
  tags text[],
  published boolean default false,
  author_id uuid references auth.users(id) on delete set null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- RLS Policies

-- Profiles: anyone can read, owner can update, admin can do all
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins have full access to profiles." ON public.profiles FOR ALL USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Settings: everyone can read, only admin can update
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Settings are viewable by everyone" ON public.platform_settings FOR SELECT USING (true);
CREATE POLICY "Admins can update settings" ON public.platform_settings FOR UPDATE USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Donations: everyone can insert (with pending), everyone can read completed donations. owner can read their own. admin can do all
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert donations" ON public.donations FOR INSERT WITH CHECK (true);
CREATE POLICY "Completed donations are viewable by everyone" ON public.donations FOR SELECT USING (payment_status = 'completed');
CREATE POLICY "Users can view their own pending/failed donations" ON public.donations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins have full access to donations" ON public.donations FOR ALL USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Medical Reports: everyone can read, only admin can insert/update/delete
ALTER TABLE public.medical_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reports are viewable by everyone" ON public.medical_reports FOR SELECT USING (true);
CREATE POLICY "Admins can manage reports" ON public.medical_reports FOR ALL USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Updates: everyone can read, only admin can insert/update/delete
ALTER TABLE public.updates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Updates are viewable by everyone" ON public.updates FOR SELECT USING (true);
CREATE POLICY "Admins can manage updates" ON public.updates FOR ALL USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Blog Posts: everyone can read published, only admin can read all & manage
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published blog posts are viewable by everyone" ON public.blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Admins can manage blog posts" ON public.blog_posts FOR ALL USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Trigger for updating raised_amount after successful donation
CREATE OR REPLACE FUNCTION update_raised_amount()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.payment_status = 'completed' AND (OLD.payment_status IS NULL OR OLD.payment_status != 'completed') THEN
    UPDATE public.platform_settings
    SET raised_amount = raised_amount + NEW.amount
    WHERE id = 1;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists to prevent errors on multiple runs
DROP TRIGGER IF EXISTS update_raised_amount_trigger ON public.donations;
DROP TRIGGER IF EXISTS update_raised_amount_insert_trigger ON public.donations;

CREATE TRIGGER update_raised_amount_trigger
AFTER UPDATE ON public.donations
FOR EACH ROW
EXECUTE FUNCTION update_raised_amount();

CREATE TRIGGER update_raised_amount_insert_trigger
AFTER INSERT ON public.donations
FOR EACH ROW
WHEN (NEW.payment_status = 'completed')
EXECUTE FUNCTION update_raised_amount();

-- Setup init settings row
INSERT INTO public.platform_settings (id, target_amount, raised_amount, hero_title) VALUES (1, 1500000.00, 0.00, 'Help Us Save A Life') ON CONFLICT DO NOTHING;

-- Storage buckets
insert into storage.buckets (id, name, public) values ('medical-reports', 'medical-reports', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('updates', 'updates', true) on conflict do nothing;

CREATE POLICY "Medical reports viewable by everyone." ON storage.objects FOR SELECT USING (bucket_id = 'medical-reports');
CREATE POLICY "Medical reports updatable by admins." ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'medical-reports' AND exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

CREATE POLICY "Updates images viewable by everyone." ON storage.objects FOR SELECT USING (bucket_id = 'updates');
CREATE POLICY "Updates images updatable by admins." ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'updates' AND exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
