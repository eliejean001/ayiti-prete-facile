import bcrypt from 'bcryptjs';
import { supabase } from "@/integrations/supabase/client";

// Check if user is authenticated via session storage
export const isAuthenticated = (): boolean => {
  return sessionStorage.getItem('adminAuthenticated') === 'true';
};

// Authenticate admin against database with secure password and role check
export const authenticateAdmin = async (email: string, password: string): Promise<boolean> => {
  try {
    // Get admin user by email (trim + lowercase for safety)
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('id, email, password_hash, role')
      .eq('email', email.trim().toLowerCase())
      .maybeSingle();

    if (error || !adminUser) {
      console.error("Authentication error:", error || "Admin user not found");
      return false;
    }

    // Debug log (optional - remove in production)
    console.log("Checking password for:", adminUser.email);

    // Check password using bcrypt
    const passwordMatches = await bcrypt.compare(password, adminUser.password_hash);
    if (!passwordMatches) {
      console.warn("Incorrect password for:", adminUser.email);
      return false;
    }

    // Check if user has admin role
    if (adminUser.role !== 'admin') {
      console.warn("Access denied: not an admin");
      return false;
    }

    // Store session
    sessionStorage.setItem('adminAuthenticated', 'true');
    sessionStorage.setItem('adminEmail', email.trim().toLowerCase());
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