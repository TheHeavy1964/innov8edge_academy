-- ============================================
-- USER METRICS TABLE MIGRATION
-- ============================================

-- Create the user_metrics table
CREATE TABLE IF NOT EXISTS public.user_metrics (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    last_login_date DATE,
    total_learning_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.user_metrics ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Users can view their own metrics"
ON public.user_metrics FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own metrics"
ON public.user_metrics FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own metrics"
ON public.user_metrics FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create a function to automatically create a metric row when a user is created
CREATE OR REPLACE FUNCTION public.handle_new_user_metrics()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_metrics (user_id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger (if not exists)
DROP TRIGGER IF EXISTS on_auth_user_created_metrics ON auth.users;
CREATE TRIGGER on_auth_user_created_metrics
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_metrics();
