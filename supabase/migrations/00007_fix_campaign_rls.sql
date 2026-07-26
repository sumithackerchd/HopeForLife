DROP POLICY IF EXISTS "Admins can manage campaigns" ON public.campaigns;

CREATE POLICY "Admins can manage campaigns" ON public.campaigns FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());