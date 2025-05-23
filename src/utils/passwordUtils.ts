
import bcrypt from 'bcryptjs';

// Hash a password securely using bcrypt
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

// Compare a password with a hash to verify if they match
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

// Utility function to set up initial admin user
export const setupInitialAdmin = async (email: string, password: string) => {
  const { supabase } = await import('@/integrations/supabase/client');
  
  // Hash the provided password
  const passwordHash = await hashPassword(password);
  
  // Check if admin user already exists
  const { data: existingAdmin } = await supabase
    .from('admin_users')
    .select('id')
    .eq('email', email)
    .maybeSingle();
  
  if (existingAdmin) {
    // Admin already exists, update password if needed
    await supabase
      .from('admin_users')
      .update({ password_hash: passwordHash })
      .eq('email', email);
  } else {
    // Create new admin user
    await supabase
      .from('admin_users')
      .insert({ email, password_hash: passwordHash });
  }
  
  return true;
};
