
-- Add UPDATE policy for admin users to modify loan applications (fixed type casting)
CREATE POLICY "Admin users can update loan applications" 
ON public.loan_applications 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);
