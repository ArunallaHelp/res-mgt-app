-- Allow all authenticated users to view all managers (needed for Admin Dashboard)
CREATE POLICY "Allow authenticated to view all managers"
  ON public.managers
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow all authenticated users to update managers (needed for Admin to update tags)
-- Note: This is broad, but necessary since we don't have a separate admin role yet.
-- The application logic separates admins and managers.
CREATE POLICY "Allow authenticated to update managers"
  ON public.managers
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
