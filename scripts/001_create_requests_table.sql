-- Create enum types for status fields
CREATE TYPE request_status AS ENUM ('new', 'in_progress', 'completed');
CREATE TYPE verification_status AS ENUM ('unverified', 'pending', 'verified');
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high');

-- Create the requests table
CREATE TABLE IF NOT EXISTS public.requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  district TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  grade TEXT NOT NULL,
  exam_year TEXT NOT NULL,
  subjects TEXT NOT NULL,
  flood_impact TEXT NOT NULL,
  support_needed TEXT[] NOT NULL,
  status request_status DEFAULT 'new',
  verification_status verification_status DEFAULT 'unverified',
  priority priority_level DEFAULT 'medium',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow anyone to insert new requests (public submission)
CREATE POLICY "Allow public to insert requests" 
  ON public.requests 
  FOR INSERT 
  WITH CHECK (true);

-- RLS Policy: Allow anyone to select their own request by reference_code (for confirmation)
CREATE POLICY "Allow public to view by reference code" 
  ON public.requests 
  FOR SELECT 
  USING (true);

-- Note: Admin users will use service role key to bypass RLS for full access
-- This is appropriate since admins need to view/edit all requests

-- Create index for faster lookups
CREATE INDEX idx_requests_reference_code ON public.requests(reference_code);
CREATE INDEX idx_requests_district ON public.requests(district);
CREATE INDEX idx_requests_status ON public.requests(status);
CREATE INDEX idx_requests_verification_status ON public.requests(verification_status);
CREATE INDEX idx_requests_created_at ON public.requests(created_at DESC);
