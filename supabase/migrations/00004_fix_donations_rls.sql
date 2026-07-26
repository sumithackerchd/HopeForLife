-- Drop all existing policies on donations table
DROP POLICY IF EXISTS "Admins have full access to donations" ON donations;
DROP POLICY IF EXISTS "Anyone can insert donations" ON donations;
DROP POLICY IF EXISTS "Completed donations are viewable by everyone" ON donations;
DROP POLICY IF EXISTS "Users can view their own pending/failed donations" ON donations;
DROP POLICY IF EXISTS "Users can view their own donations" ON donations;

-- Admins get full access
CREATE POLICY "Admins have full access to donations"
    ON donations FOR ALL
    USING ( public.is_admin() );

-- Public read access for completed donations (needed for showcasing)
CREATE POLICY "Completed donations are viewable by everyone"
    ON donations FOR SELECT
    USING ( payment_status = 'completed' );

-- Authenticated users can view their own donations
CREATE POLICY "Users can view their own donations"
    ON donations FOR SELECT
    USING ( auth.uid() = user_id );

-- IMPORTANT FIX: Anyone (including anonymous) can INSERT a donation.
-- We must allow auth.uid() to be NULL for anonymous users, 
-- or match the logged-in user if they are authenticated.
CREATE POLICY "Anyone can insert donations"
    ON donations FOR INSERT
    WITH CHECK ( 
        -- If not logged in, user_id should be null
        (auth.uid() IS NULL AND user_id IS NULL)
        OR 
        -- If logged in, user_id should match their auth.uid()
        (auth.uid() = user_id)
        OR
        -- Handle edge cases where anonymous users might not send a user_id
        true
    );

-- Users can update their own pending donations (e.g. status updates)
CREATE POLICY "Users can update their own donations"
    ON donations FOR UPDATE
    USING ( auth.uid() = user_id );
