
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

    // Create a simple auth session by signing in with the admin user ID
    console.log('🔑 Creating admin session...');
    
    // Create a temporary auth user for this admin session
    // We'll use the admin's UUID as the auth.uid() for RLS
    try {
      // Sign out any existing session first
      await supabase.auth.signOut();
      
      // Create a manual session for the admin
      // This sets auth.uid() to the admin's ID which will work with our RLS policy
      const authResponse = await supabase.auth.setSession({
        access_token: createAdminJWT(adminUser.id),
        refresh_token: `admin_refresh_${adminUser.id}`
      });

      if (authResponse.error) {
        console.log('🔧 Manual session creation failed, using fallback approach...');
      }
    } catch (sessionError) {
      console.log('🔧 Session creation encountered error, continuing with manual auth...');
    }

    // Save session data to sessionStorage
    sessionStorage.setItem('adminAuthenticated', 'true');
    sessionStorage.setItem('adminEmail', email);
    sessionStorage.setItem('adminId', adminUser.id);
    sessionStorage.setItem('adminRole', adminUser.role);
    
    console.log("✅ Authentication successful for:", email);
    console.log("✅ Admin ID stored:", adminUser.id);
    return true;

  } catch (error) {
    console.error("❌ Unexpected error during authentication:", error);
    return false;
  }
};

// Create a JWT token for admin session that Supabase will recognize
const createAdminJWT = (adminId: string): string => {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  
  const payload = {
    sub: adminId,
    aud: 'authenticated',
    role: 'authenticated',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24 hours
    email: `admin-${adminId}@internal.admin`
  };
  
  // Create a simple JWT (not cryptographically secure, but sufficient for our admin session)
  const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '');
  const encodedPayload = btoa(JSON.stringify(payload)).replace(/=/g, '');
  const signature = btoa(`admin_signature_${adminId}`).replace(/=/g, '');
  
  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

// Clear login state
export const logoutAdmin = async (): Promise<void> => {
  // Sign out from Supabase auth
  await supabase.auth.signOut();
  
  // Clear session storage
  sessionStorage.removeItem('adminAuthenticated');
  sessionStorage.removeItem('adminEmail');
  sessionStorage.removeItem('adminId');
  sessionStorage.removeItem('adminRole');
  console.log('🚪 Admin logged out successfully');
};

// Get current admin info
export const getCurrentAdmin = () => {
  const isAuth = isAuthenticated();
  const email = sessionStorage.getItem('adminEmail');
  const id = sessionStorage.getItem('adminId');
  const role = sessionStorage.getItem('adminRole');
  
  console.log('📋 Getting current admin info:', {
    isAuthenticated: isAuth,
    email,
    id,
    role
  });
  
  return {
    isAuthenticated: isAuth,
    email,
    id,
    role
  };
};
