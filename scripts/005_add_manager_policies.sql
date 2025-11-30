-- Allow managers to view their own profile based on email
CREATE POLICY "Allow managers to view own profile" 
  ON public.managers 
  FOR SELECT 
  USING (email = (select auth.jwt() ->> 'email'));

-- Allow managers to update their own profile based on email
CREATE POLICY "Allow managers to update own profile" 
  ON public.managers 
  FOR UPDATE 
  USING (email = (select auth.jwt() ->> 'email'));
