-- Add dob column and make age nullable
ALTER TABLE public.requests ADD COLUMN IF NOT EXISTS dob DATE;
ALTER TABLE public.requests ALTER COLUMN age DROP NOT NULL;
