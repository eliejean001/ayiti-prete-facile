
import bcrypt from 'bcryptjs';

// Hash a password securely using bcrypt with consistent salt rounds
export const hashPassword = async (password: string): Promise<string> => {
  // Use salt rounds 12 to match existing database hashes
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

// Compare a password with a hash to verify if they match
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

// Test function to verify our known passwords work with the database hashes
export const testKnownPasswords = async () => {
  const testCases = [
    {
      email: 'fastloan633@gmail.com',
      password: 'AdminPassword2025!',
      expectedHash: '$2a$12$ZQWsuLO16i88SWlUTBSyOe7L8Ec8XKmNI8TJ1kPW8/6Vn6X8VJf8u'
    },
    {
      email: 'admin@ayitiloan.com', 
      password: 'StrongSecurePassword2025!',
      expectedHash: '$2a$12$8vn0YLQ/fUHJhD4pHZ4YwOXGVLkNFCwIxD6qB5dMqZ8B4pT6oD5R.'
    }
  ];

  console.log('🧪 Testing known password combinations...');
  
  for (const testCase of testCases) {
    const isValid = await bcrypt.compare(testCase.password, testCase.expectedHash);
    console.log(`🔐 ${testCase.email}: ${isValid ? '✅ VALID' : '❌ INVALID'}`);
  }
};

// Utility function to set up initial admin user (updated to use consistent salt rounds)
export const setupInitialAdmin = async (email: string, password: string) => {
  const { supabase } = await import('@/integrations/supabase/client');
  
  // Hash the provided password with salt rounds 12
  const passwordHash = await hashPassword(password);
  
  console.log(`🔐 Setting up admin ${email} with hash:`, passwordHash);
  
  // Check if admin user already exists
  const { data: existingAdmin } = await supabase
    .from('admin_users')
    .select('id')
    .eq('email', email)
    .maybeSingle();
  
  if (existingAdmin) {
    // Admin already exists, update password
    const { error } = await supabase
      .from('admin_users')
      .update({ 
        password_hash: passwordHash,
        role: 'admin' 
      })
      .eq('email', email);
      
    if (error) {
      console.error('❌ Error updating admin:', error);
      throw error;
    }
    
    console.log(`✅ Updated existing admin: ${email}`);
  } else {
    // Create new admin user
    const { error } = await supabase
      .from('admin_users')
      .insert({ 
        email, 
        password_hash: passwordHash, 
        role: 'admin' 
      });
      
    if (error) {
      console.error('❌ Error creating admin:', error);
      throw error;
    }
    
    console.log(`✅ Created new admin: ${email}`);
  }
  
  return true;
};
