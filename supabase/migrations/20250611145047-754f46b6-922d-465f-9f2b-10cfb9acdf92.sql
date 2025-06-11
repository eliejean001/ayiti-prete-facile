
-- Add DELETE policy for admin users to remove loan applications
CREATE POLICY "Admin users can delete loan applications" 
ON public.loan_applications 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);
