-- ============================================================
-- Innov8Edge Academy: Lesson Videos Table
-- Run this in: Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- 1. Create the table
CREATE TABLE IF NOT EXISTS lesson_videos (
  lesson_id   TEXT PRIMARY KEY,                        -- matches curriculum id: '1', '2', etc.
  video_url   TEXT NOT NULL,                           -- YouTube, Vimeo, or direct MP4 URL
  updated_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE lesson_videos ENABLE ROW LEVEL SECURITY;

-- 3. Allow ALL authenticated users to read
CREATE POLICY "lesson_videos_read"
  ON lesson_videos
  FOR SELECT
  TO authenticated
  USING (true);

-- 4. Allow admins to insert / update / delete
--    Admin = any user whose email contains 'innov8edge' or 'martin' or 'admin'
CREATE POLICY "lesson_videos_admin_write"
  ON lesson_videos
  FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'email' ILIKE '%innov8edge%'
    OR auth.jwt() ->> 'email' ILIKE '%martin%'
    OR auth.jwt() ->> 'email' ILIKE '%admin%'
  )
  WITH CHECK (
    auth.jwt() ->> 'email' ILIKE '%innov8edge%'
    OR auth.jwt() ->> 'email' ILIKE '%martin%'
    OR auth.jwt() ->> 'email' ILIKE '%admin%'
  );

-- 5. Verification query (run after to confirm it worked)
SELECT 'lesson_videos table created successfully' AS status;
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'lesson_videos';
