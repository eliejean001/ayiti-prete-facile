
import { supabase } from '@/integrations/supabase/client';
import { hashPassword } from './passwordUtils';

export interface AdminUser {
  email: string;
  password: string;
}

// Function to check if admin user exists
export const checkAdminExists = async (email: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking admin:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error checking admin existence:', error);
    return false;
  }
};

// Function to create or update admin user
export const createOrUpdateAdmin = async (email: string, password: string): Promise<boolean> => {
  try {
    console.log(`🔧 Setting up admin for ${email}`);
    
    // Hash the password with bcrypt using salt rounds 12 to match existing hashes
    const passwordHash = await hashPassword(password);
    console.log(`🔐 Generated hash for ${email}:`, passwordHash);
    
    // Check if admin already exists
    const exists = await checkAdminExists(email);
    
    if (exists) {
      // Update existing admin
      const { error } = await supabase
        .from('admin_users')
        .update({ 
          password_hash: passwordHash,
          role: 'admin'
        })
        .eq('email', email);
        
      if (error) {
        console.error('❌ Error updating admin:', error);
        return false;
      }
      
      console.log(`✅ Updated admin user: ${email}`);
    } else {
      // Create new admin
      const { error } = await supabase
        .from('admin_users')
        .insert({
          email,
          password_hash: passwordHash,
          role: 'admin'
        });
        
      if (error) {
        console.error('❌ Error creating admin:', error);
        return false;
      }
      
      console.log(`✅ Created new admin user: ${email}`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error in createOrUpdateAdmin:', error);
    return false;
  }
};

// Function to setup default admin accounts
export const setupDefaultAdmins = async (): Promise<AdminUser[]> => {
  const defaultAdmins: AdminUser[] = [
    {
      email: 'fastloan633@gmail.com',
      password: 'AdminPassword2025!'
    },
    {
      email: 'admin@ayitiloan.com',
      password: 'StrongSecurePassword2025!'
    }
  ];
  
  const successfulAdmins: AdminUser[] = [];
  
  for (const admin of defaultAdmins) {
    const success = await createOrUpdateAdmin(admin.email, admin.password);
    if (success) {
      successfulAdmins.push(admin);
    }
  }
  
  return successfulAdmins;
};

// Function to test admin login
export const testAdminLogin = async (email: string, password: string): Promise<boolean> => {
  try {
    console.log(`🧪 Testing login for ${email}`);
    
    // Get admin user from database
    const { data, error } = await supabase
      .from('admin_users')
      .select('id, email, password_hash, role')
      .eq('email', email)
      .maybeSingle();
    
    if (error || !data) {
      console.error('❌ Admin user not found or error:', error);
      return false;
    }
    
    console.log(`📋 Found admin user:`, {
      id: data.id,
      email: data.email,
      role: data.role,
      hashLength: data.password_hash.length
    });
    
    // Test password comparison
    const bcrypt = await import('bcryptjs');
    const passwordMatches = await bcrypt.compare(password, data.password_hash);
    
    console.log(`🔐 Password test result for ${email}:`, passwordMatches);
    
    return passwordMatches && data.role === 'admin';
  } catch (error) {
    console.error('❌ Error testing admin login:', error);
    return false;
  }
};
