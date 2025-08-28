-- Allow anonymous users to create guest links (user_id must be NULL)
-- This fixes failures when shortening links while logged out

-- Create policy only if it doesn't already exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'links' 
      AND policyname = 'Anon can create guest links'
  ) THEN
    CREATE POLICY "Anon can create guest links"
    ON public.links
    FOR INSERT
    TO anon
    WITH CHECK (user_id IS NULL);
  END IF;
END $$;

-- Optional: tighten UPDATE to only allow public to update clicks column
-- Keeping broad update for now as per earlier migration to avoid breaking redirects.
