-- Migration: Add Moderation Columns to Marketplace
-- Run this in your Supabase SQL Editor

-- 1. Add status and is_vetted columns
ALTER TABLE marketplace_listings 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS is_vetted BOOLEAN DEFAULT false;

-- 2. Update existing items to 'published' so they don't disappear
UPDATE marketplace_listings SET status = 'published' WHERE status = 'pending';

-- 3. Update RLS: Ensure only published items are viewable by non-admins
-- Drop old select policy
DROP POLICY IF EXISTS "Marketplace items are viewable by everyone" ON marketplace_listings;

-- New policy: Everyone can see published or vetted items. 
-- Authors can see their own items regardless of status.
CREATE POLICY "Marketplace items visibility" 
ON marketplace_listings FOR SELECT 
USING (
    status = 'published' 
    OR is_vetted = true 
    OR auth.uid() = user_id
    OR (auth.jwt() ->> 'email') LIKE '%martin%'
    OR (auth.jwt() ->> 'email') LIKE '%innov8edge%'
);

-- Policy for admins to update status
CREATE POLICY "Admins can update all items" 
ON marketplace_listings FOR UPDATE 
USING (
    (auth.jwt() ->> 'email') LIKE '%martin%'
    OR (auth.jwt() ->> 'email') LIKE '%innov8edge%'
);
