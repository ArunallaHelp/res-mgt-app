-- Add tags to managers table
ALTER TABLE public.managers ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Create manager_groups table
CREATE TABLE IF NOT EXISTS public.manager_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create manager_group_members table
CREATE TABLE IF NOT EXISTS public.manager_group_members (
  group_id UUID REFERENCES public.manager_groups(id) ON DELETE CASCADE,
  manager_id UUID REFERENCES public.managers(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (group_id, manager_id)
);

-- Enable Row Level Security
ALTER TABLE public.manager_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manager_group_members ENABLE ROW LEVEL SECURITY;

-- Policies for manager_groups
-- Allow all authenticated users to view groups (for now, can be restricted later)
CREATE POLICY "Allow authenticated to view groups"
  ON public.manager_groups
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow all authenticated users to insert/update/delete groups (assuming admin is authenticated)
CREATE POLICY "Allow authenticated to manage groups"
  ON public.manager_groups
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies for manager_group_members
CREATE POLICY "Allow authenticated to view group members"
  ON public.manager_group_members
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated to manage group members"
  ON public.manager_group_members
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
