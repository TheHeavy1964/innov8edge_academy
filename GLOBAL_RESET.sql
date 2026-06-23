-- ============================================
-- GLOBAL PLATFORM RESET SCRIPT (V1 Launch)
-- ============================================

-- 1. Reset all lesson progress across all tracks
-- Verified table name: lesson_progress
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename  = 'lesson_progress') THEN
        TRUNCATE TABLE lesson_progress CASCADE;
    END IF;
END $$;

-- 2. Clear community marketplace submissions (Preserve Vetted official templates)
-- Verified table name: marketplace_listings
DELETE FROM marketplace_listings 
WHERE is_vetted = false;

-- 3. Reset engagement metrics for official vetted items
UPDATE marketplace_listings
SET stars = 0, downloads = 0
WHERE is_vetted = true;

-- Verification Query
SELECT 
    (SELECT count(*) FROM lesson_progress) as remaining_progress,
    (SELECT count(*) FROM marketplace_listings WHERE is_vetted = false) as community_items,
    (SELECT count(*) FROM marketplace_listings WHERE is_vetted = true) as official_items;
