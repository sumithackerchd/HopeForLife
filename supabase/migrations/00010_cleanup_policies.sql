DROP POLICY IF EXISTS "Admins have full access to profiles." ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;

DROP POLICY IF EXISTS "Authenticated users can insert their own donations" ON public.donations;
DROP POLICY IF EXISTS "Users can view their own donations" ON public.donations;
DROP POLICY IF EXISTS "Admins have full access to donations" ON public.donations;
DROP POLICY IF EXISTS "Completed donations are viewable by everyone" ON public.donations;
DROP POLICY IF EXISTS "Users can update their own donations" ON public.donations;
DROP POLICY IF EXISTS "Users can delete their own donations" ON public.donations;