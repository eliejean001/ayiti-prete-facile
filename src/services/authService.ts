import bcrypt from 'bcryptjs';
import { supabase } from "@/integrations/supabase/client";

// Check if user is authenticated via session storage
export const isAuthenticated = (): boolean => {
  return sessionStorage.getItem('adminAuthenticated') === 'true';
};

// Authenticate admin against database with secure password and role check
export const authenticateAdmin = async (username: string, password: string): Promise<boolean> => {
  try {
    // Get admin user from Supabase
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', username)
      .maybeSingle();

    if (error || !adminUser) {
      console.error("Authentication error:", error || "Admin user not found");
      return false;
    }

    // Check password
    const passwordMatches = await bcrypt.compare(password, adminUser.password_hash);
    if (!passwordMatches) {
      return false;
    }

    // Check if user is actually an admin
    if (adminUser.role !== 'admin') {
      console.warn("Access denied: not an admin");
      return false;
    }

    // Store session
    sessionStorage.setItem('adminAuthenticated', 'true');
    sessionStorage.setItem('adminEmail', username);
    return true;

  } catch (error) {
    console.error("Authentication error:", error);
    return false;
  }
};

// Logout function - clears authentication state
export const logoutAdmin = (): void => {
  sessionStorage.removeItem('adminAuthenticated');
  sessionStorage.removeItem('adminEmail');
};
