import bcrypt from 'bcryptjs';
import { supabase } from "@/integrations/supabase/client";

// Check if user is authenticated via session storage
export const isAuthenticated = (): boolean => {
  return sessionStorage.getItem('adminAuthenticated') === 'true';
};

// Authenticate admin with email and password
export const authenticateAdmin = async (email: string, password: string): Promise<boolean> => {
  try {
    // Get admin user by email and select required fields
    const { data, error } = await supabase
      .from('admin_users')
      .select('id, email, password_hash, role')
      .eq('email', email)
      .maybeSingle();

    if (error || !data) {
      console.error("❌ Authentication error:", error || "Admin user not found");
      return false;
    }

    const adminUser = data as {
      id: string;
      email: string;
      password_hash: string;
      role: string;
    };

    // Debug logs
    console.log("✅ Entered email:", email);
    console.log("✅ Entered password:", password);
    console.log("🔐 Hash from DB:", adminUser.password_hash);

    // Compare password with bcrypt hash
    const passwordMatches = await bcrypt.compare(password, adminUser.password_hash);

    if (!passwordMatches) {
      console.warn("❌ Password does not match bcrypt hash");
      return false;
    }

    // Confirm admin role
    if (adminUser.role !== 'admin') {
      console.warn("❌ User does not have 'admin' role");
      return false;
    }

    // Save session
    sessionStorage.setItem('adminAuthenticated', 'true');
    sessionStorage.setItem('adminEmail', email);
    console.log("✅ Authentication successful");
    return true;

  } catch (error) {
    console.error("❌ Unexpected error during login:", error);
    return false;
  }
};

// Clear login state
export const logoutAdmin = (): void => {
  sessionStorage.removeItem('adminAuthenticated');
  sessionStorage.removeItem('adminEmail');
};
