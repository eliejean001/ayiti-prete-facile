
import bcrypt from 'bcryptjs';
import { supabase } from "@/integrations/supabase/client";

// Check if user is authenticated via session storage
export const isAuthenticated = (): boolean => {
  return sessionStorage.getItem('adminAuthenticated') === 'true';
};

// Authenticate admin with email and password
export const authenticateAdmin = async (email: string, password: string): Promise<boolean> => {
  try {
    console.log('🔐 Starting admin authentication for:', email);
    
    // Get admin user by email and select required fields
    const { data, error } = await supabase
      .from('admin_users')
      .select('id, email, password_hash, role')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error("❌ Database error during authentication:", error);
      return false;
    }
    
    if (!data) {
      console.error("❌ Admin user not found for email:", email);
      return false;
    }

    const adminUser = data as {
      id: string;
      email: string;
      password_hash: string;
      role: string;
    };

    console.log("✅ Found admin user:", {
      id: adminUser.id,
      email: adminUser.email,
      role: adminUser.role,
      hashLength: adminUser.password_hash.length,
      hashPrefix: adminUser.password_hash.substring(0, 7)
    });

    // Confirm admin role first
    if (adminUser.role !== 'admin') {
      console.warn("❌ User does not have 'admin' role. Role:", adminUser.role);
      return false;
    }

    // Compare password with bcrypt hash
    console.log('🔍 Comparing password with stored hash...');
    const passwordMatches = await bcrypt.compare(password, adminUser.password_hash);

    console.log('🔐 Password comparison result:', passwordMatches);

    if (!passwordMatches) {
      console.warn("❌ Password does not match stored hash");
      return false;
    }

    // Save session
    sessionStorage.setItem('adminAuthenticated', 'true');
    sessionStorage.setItem('adminEmail', email);
    sessionStorage.setItem('adminId', adminUser.id);
    
    console.log("✅ Authentication successful for:", email);
    return true;

  } catch (error) {
    console.error("❌ Unexpected error during authentication:", error);
    return false;
  }
};

// Clear login state
export const logoutAdmin = (): void => {
  sessionStorage.removeItem('adminAuthenticated');
  sessionStorage.removeItem('adminEmail');
  sessionStorage.removeItem('adminId');
  console.log('🚪 Admin logged out successfully');
};

// Get current admin info
export const getCurrentAdmin = () => {
  return {
    isAuthenticated: isAuthenticated(),
    email: sessionStorage.getItem('adminEmail'),
    id: sessionStorage.getItem('adminId')
  };
};
