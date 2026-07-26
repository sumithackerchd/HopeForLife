-- Drop the recursive policy
DROP POLICY IF EXISTS "Admins have full access to profiles." ON profiles;

-- Make sure we have the correct user policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON profiles;

-- Recreate basic user policies
CREATE POLICY "Users can view their own profile."
    ON profiles FOR SELECT
    USING ( auth.uid() = id );

CREATE POLICY "Users can insert their own profile."
    ON profiles FOR INSERT
    WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update their own profile."
    ON profiles FOR UPDATE
    USING ( auth.uid() = id );

-- Create a secure helper function to check if the current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
DECLARE
  v_role text;
BEGIN
  -- We query the profile bypassing RLS by doing it inside a SECURITY DEFINER function
  SELECT role INTO v_role FROM public.profiles WHERE id = auth.uid();
  RETURN coalesce(v_role = 'admin', false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Use the helper function for admin policy to avoid infinite recursion
CREATE POLICY "Admins have full access to profiles."
    ON profiles FOR ALL
    USING ( public.is_admin() );