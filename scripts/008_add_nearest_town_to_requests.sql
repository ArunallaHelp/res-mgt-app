-- Add nearest_town column to requests table
ALTER TABLE public.requests ADD COLUMN IF NOT EXISTS nearest_town TEXT;
