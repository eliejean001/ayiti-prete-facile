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
      console.error("Authentication error:", error || "Admin user not found");
      return false;
    }

    // Define types to avoid TS issues
    const adminUser = data as {
      id: string;
      email: string;
      password_hash: string;
      role: string;
    };

    // Compare passwords
    const passwordMatches = await bcrypt.compare(password, adminUser.password_hash);
    if (!passwordMatches) {
      console.warn("Password does not match");
      return false;
    }

    // Confirm user has 'admin' role
    if (adminUser.role !== 'admin') {
      console.warn("Access denied: not an admin");
      return false;
    }

    // Save session
    sessionStorage.setItem('adminAuthenticated', 'true');
    sessionStorage.setItem('adminEmail', email);
    return true;

  } catch (error) {
    console.error("Authentication error:", error);
    return false;
  }
};

// Clear login state
export const logoutAdmin = (): void => {
  sessionStorage.removeItem('adminAuthenticated');
  sessionStorage.removeItem('adminEmail');
};
