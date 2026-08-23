-- Check if policy exists and create if not
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'inquiries' AND policyname = 'Allow anonymous inserts to inquiries'
    ) THEN
        CREATE POLICY "Allow anonymous inserts to inquiries"
        ON public.inquiries
        FOR INSERT
        TO anon
        WITH CHECK (true);
    END IF;
END
$$;

-- Ensure table has RLS enabled
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Explicitly grant permissions
GRANT INSERT ON public.inquiries TO anon;
GRANT SELECT, DELETE ON public.inquiries TO authenticated;
GRANT ALL ON public.inquiries TO service_role;
