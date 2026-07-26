-- Drop recursive policies
DROP POLICY IF EXISTS "Admins can update settings" ON platform_settings;
DROP POLICY IF EXISTS "Admins have full access to donations" ON donations;
DROP POLICY IF EXISTS "Admins can manage reports" ON medical_reports;
DROP POLICY IF EXISTS "Admins can manage updates" ON updates;
DROP POLICY IF EXISTS "Admins can manage blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Medical reports updatable by admins." ON storage.objects;
DROP POLICY IF EXISTS "Updates images updatable by admins." ON storage.objects;

-- Recreate policies using the secure is_admin() helper function
CREATE POLICY "Admins can update settings"
    ON platform_settings FOR UPDATE
    USING ( public.is_admin() );

CREATE POLICY "Admins have full access to donations"
    ON donations FOR ALL
    USING ( public.is_admin() );

CREATE POLICY "Admins can manage reports"
    ON medical_reports FOR ALL
    USING ( public.is_admin() );

CREATE POLICY "Admins can manage updates"
    ON updates FOR ALL
    USING ( public.is_admin() );

CREATE POLICY "Admins can manage blog posts"
    ON blog_posts FOR ALL
    USING ( public.is_admin() );

CREATE POLICY "Medical reports updatable by admins."
    ON storage.objects FOR INSERT
    WITH CHECK ( bucket_id = 'medical-reports' AND public.is_admin() );

CREATE POLICY "Updates images updatable by admins."
    ON storage.objects FOR INSERT
    WITH CHECK ( bucket_id = 'updates' AND public.is_admin() );