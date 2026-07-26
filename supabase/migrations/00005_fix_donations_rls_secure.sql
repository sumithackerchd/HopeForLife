-- Drop all previous policies on donations to avoid conflicts
DROP POLICY IF EXISTS "Admins have full access to donations" ON donations;
DROP POLICY IF EXISTS "Anyone can insert donations" ON donations;
DROP POLICY IF EXISTS "Completed donations are viewable by everyone" ON donations;
DROP POLICY IF EXISTS "Users can view their own pending/failed donations" ON donations;
DROP POLICY IF EXISTS "Users can view their own donations" ON donations;
DROP POLICY IF EXISTS "Users can update their own donations" ON donations;
DROP POLICY IF EXISTS "Authenticated users can insert their own donations" ON donations;

-- 1. Authenticated users can insert their own donations
CREATE POLICY "Authenticated users can insert their own donations"
    ON donations FOR INSERT
    WITH CHECK ( auth.uid() = user_id );

-- 3. Authenticated users can view only their own donations
CREATE POLICY "Users can view their own donations"
    ON donations FOR SELECT
    USING ( auth.uid() = user_id );

-- 4. Admins can view and manage all donations
CREATE POLICY "Admins have full access to donations"
    ON donations FOR ALL
    USING ( public.is_admin() );

-- Public read access for completed donations (to show raised amounts)
CREATE POLICY "Completed donations are viewable by everyone"
    ON donations FOR SELECT
    USING ( payment_status = 'completed' );

-- Update
CREATE POLICY "Users can update their own donations"
    ON donations FOR UPDATE
    USING ( auth.uid() = user_id );

-- Delete
CREATE POLICY "Users can delete their own donations"
    ON donations FOR DELETE
    USING ( auth.uid() = user_id );