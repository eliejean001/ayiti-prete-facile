import bcrypt from 'bcryptjs';
import { supabase } from "@/integrations/supabase/client";

// Check if user is authenticated via session storage
export const isAuthenticated = (): boolean => {
  return sessionStorage.getItem('adminAuthenticated') === 'true';
};

// Authenticate admin against database with secure password and role check
export const authenticateAdmin = async (username: string, password: string): Promise<boolean> => {
  try {
    // Explicitly select needed fields
    const { data, error } = await supabase
      .from('admin_users')
      .select('id, email, password_hash, role')
      .eq('email', username)
      .maybeSingle();

    if (error || !data) {
      console.error("Authentication error:", error || "Admin user not found");
      return false;
    }

    // Force types so TS doesn't complain
    const adminUser = data as {
      id: string;
      email: string;
      password_hash: string;
      role: string;
    };

    // Check password against bcrypt-hashed value
    const passwordMatches = await bcrypt.compare(password, adminUser.password_hash);
    if (!passwordMatches) {
      console.warn("Password does not match");
      return false;
    }

    // Ensure the role is admin
    if (adminUser.role !== 'admin') {
      console.warn("Access denied: not an admin");
      return false;
    }

    // Set session
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
