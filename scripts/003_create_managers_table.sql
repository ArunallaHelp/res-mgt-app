-- Create the managers table
CREATE TABLE IF NOT EXISTS public.managers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Personal Information
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  district TEXT NOT NULL,
  nearest_town TEXT NOT NULL,
  
  -- Professional Information
  job_role TEXT NOT NULL,
  other_role TEXT,
  experience_years TEXT NOT NULL,
  highest_qualification TEXT NOT NULL,
  other_qualification TEXT,
  professional_skills TEXT[] NOT NULL,
  other_skill TEXT,
  
  -- Support Type
  support_types TEXT[] NOT NULL,
  
  -- Subjects & Levels
  grade_levels TEXT[] NOT NULL,
  subjects TEXT NOT NULL,
  other_subject TEXT,
  
  -- Availability
  available_days TEXT[] NOT NULL,
  available_time_slots TEXT[] NOT NULL,
  
  -- Teaching Mode
  teaching_mode TEXT NOT NULL,
  
  -- Support Method (Flattened array of all selected methods)
  support_methods TEXT[] NOT NULL,
  
  -- Additional Information
  volunteering_experience TEXT,
  preferences_limitations TEXT,
  comments TEXT,
  
  -- System Fields
  is_teacher BOOLEAN DEFAULT FALSE,
  verification_status verification_status DEFAULT 'unverified',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.managers ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow anyone to insert new manager applications
CREATE POLICY "Allow public to insert managers" 
  ON public.managers 
  FOR INSERT 
  WITH CHECK (true);

-- Create indexes for faster lookups
CREATE INDEX idx_managers_email ON public.managers(email);
CREATE INDEX idx_managers_phone ON public.managers(phone);
CREATE INDEX idx_managers_district ON public.managers(district);
CREATE INDEX idx_managers_created_at ON public.managers(created_at DESC);
CREATE INDEX idx_managers_verification_status ON public.managers(verification_status);
