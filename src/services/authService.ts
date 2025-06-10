
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

    // Create a custom JWT token for the admin user to work with RLS
    console.log('🔑 Creating admin session...');
    
    // Sign in the admin user with Supabase using their admin ID as the user ID
    // This creates a proper auth session that RLS policies can use
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: `admin-${adminUser.id}@internal.admin`,
      password: 'temp-password-will-be-overridden'
    });

    // If that fails (user doesn't exist in auth.users), we'll work around it by setting manual session
    if (signInError) {
      console.log('🔧 Admin user not in auth.users, using manual session approach...');
      
      // Set a manual session that includes the admin user ID
      await supabase.auth.setSession({
        access_token: createTempJWT(adminUser.id),
        refresh_token: 'manual-admin-refresh'
      });
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

// Create a temporary JWT for admin session (simplified version)
const createTempJWT = (adminId: string): string => {
  // This is a simplified approach - in production you'd want proper JWT signing
  const payload = {
    sub: adminId,
    aud: 'authenticated',
    role: 'authenticated',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
  };
  
  // For now, we'll use a base64 encoded payload (not secure for production)
  return btoa(JSON.stringify(payload));
};

// Clear login state
export const logoutAdmin = async (): Promise<void> => {
  // Sign out from Supabase auth
  await supabase.auth.signOut();
  
  // Clear session storage
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
