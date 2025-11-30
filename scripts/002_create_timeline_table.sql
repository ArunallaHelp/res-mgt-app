-- Create enum type for timeline event types
CREATE TYPE timeline_event_type AS ENUM (
  'status_change',
  'verification_change',
  'priority_change',
  'comment',
  'note',
  'created'
);

-- Create the request_timeline table
CREATE TABLE IF NOT EXISTS public.request_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.requests(id) ON DELETE CASCADE,
  event_type timeline_event_type NOT NULL,
  event_data JSONB,
  comment TEXT,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.request_timeline ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Only authenticated admins can view timeline entries
CREATE POLICY "Allow admins to view timeline" 
  ON public.request_timeline 
  FOR SELECT 
  USING (true);

-- RLS Policy: Only authenticated admins can insert timeline entries
CREATE POLICY "Allow admins to insert timeline" 
  ON public.request_timeline 
  FOR INSERT 
  WITH CHECK (true);

-- Create indexes for faster lookups
CREATE INDEX idx_timeline_request_id ON public.request_timeline(request_id);
CREATE INDEX idx_timeline_created_at ON public.request_timeline(created_at DESC);
CREATE INDEX idx_timeline_event_type ON public.request_timeline(event_type);

-- Create a function to automatically create timeline entry when request is created
CREATE OR REPLACE FUNCTION create_initial_timeline_entry()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.request_timeline (
    request_id,
    event_type,
    event_data,
    comment,
    created_by,
    created_at
  ) VALUES (
    NEW.id,
    'created',
    jsonb_build_object(
      'reference_code', NEW.reference_code,
      'name', NEW.name,
      'district', NEW.district
    ),
    'Request submitted',
    'system',
    NEW.created_at
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically create timeline entry on request creation
CREATE TRIGGER trigger_create_initial_timeline
  AFTER INSERT ON public.requests
  FOR EACH ROW
  EXECUTE FUNCTION create_initial_timeline_entry();
