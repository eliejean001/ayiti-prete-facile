
import { AdminUser } from "@/types/loan";
import { supabase } from "@/integrations/supabase/client";

// This is the hard-coded admin user for development
const adminUser: AdminUser = {
  username: "admin",
  password: "A9y!t1L0@n#2025"
};

export const authenticateAdmin = async (username: string, password: string): Promise<boolean> => {
  try {
    // Hard-coded admin check for development
    if (username === adminUser.username && password === adminUser.password) {
      // Store auth token in session storage
      sessionStorage.setItem('adminAuthenticated', 'true');
      return true;
    }
    
    // Alternatively, we could check against database admin users
    // For future implementation with database admin users
    return false;
  } catch (error) {
    console.error("Authentication error:", error);
    return false;
  }
};

export const isAuthenticated = (): boolean => {
  // Check if admin is authenticated via session storage
  return sessionStorage.getItem('adminAuthenticated') === 'true';
};

export const logoutAdmin = (): void => {
  // Clear admin auth from session storage
  sessionStorage.removeItem('adminAuthenticated');
};
