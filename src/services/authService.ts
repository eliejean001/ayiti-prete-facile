
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

    // Create proper Supabase auth session using the admin's UUID
    console.log('🔑 Creating proper Supabase auth session...');
    
    try {
      // Sign out any existing session first
      await supabase.auth.signOut();
      
      // Sign in with the admin user ID using Supabase's signInWithPassword
      // We'll create a temporary user in Supabase auth for this admin
      const tempEmail = `admin-${adminUser.id}@internal.system`;
      const tempPassword = `admin-session-${adminUser.id}`;
      
      // Try to sign in first, if it fails, create the user
      let authResult = await supabase.auth.signInWithPassword({
        email: tempEmail,
        password: tempPassword
      });
      
      if (authResult.error) {
        console.log('🔧 Creating temporary auth user for admin...');
        // Create the temp auth user
        const signUpResult = await supabase.auth.signUp({
          email: tempEmail,
          password: tempPassword,
          options: {
            data: {
              admin_id: adminUser.id,
              is_admin: true
            }
          }
        });
        
        if (signUpResult.error) {
          console.error('❌ Failed to create temp auth user:', signUpResult.error);
          // Fall back to manual session management
        } else {
          console.log('✅ Created temporary auth user for admin');
          authResult = signUpResult;
        }
      }
      
      if (!authResult.error && authResult.data.user) {
        console.log('✅ Admin authenticated with Supabase auth system');
        console.log('✅ Auth UID set to:', authResult.data.user.id);
      }
      
    } catch (sessionError) {
      console.error('❌ Error setting up Supabase auth session:', sessionError);
      // Continue with session storage fallback
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
