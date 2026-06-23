-- Marketplace Listings Table
CREATE TABLE IF NOT EXISTS marketplace_listings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL, -- 'agent_squad', 'prompt_template', 'workflow'
    content JSONB NOT NULL, -- The actual data (e.g., the agent squad array)
    stars INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0,
    tags TEXT[],
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Marketplace items are viewable by everyone" 
ON marketplace_listings FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own marketplace items" 
ON marketplace_listings FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own marketplace items" 
ON marketplace_listings FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own marketplace items" 
ON marketplace_listings FOR DELETE 
USING (auth.uid() = user_id);

-- RPC for incrementing stars
CREATE OR REPLACE FUNCTION increment_marketplace_stars(listing_id UUID)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE marketplace_listings
  SET stars = stars + 1
  WHERE id = listing_id;
$$;

-- RPC for incrementing downloads
CREATE OR REPLACE FUNCTION increment_marketplace_downloads(listing_id UUID)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE marketplace_listings
  SET downloads = downloads + 1
  WHERE id = listing_id;
$$;
