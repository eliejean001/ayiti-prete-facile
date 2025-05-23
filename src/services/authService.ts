
import bcrypt from 'bcryptjs';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Check if user is authenticated via session storage
export const isAuthenticated = (): boolean => {
  return sessionStorage.getItem('adminAuthenticated') === 'true';
};

// Authenticate admin against database with secure password hashing
export const authenticateAdmin = async (username: string, password: string): Promise<boolean> => {
  try {
    // Query the admin_users table for the provided username (email)
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', username)
      .maybeSingle();
    
    if (error || !adminUser) {
      console.error("Authentication error:", error || "Admin user not found");
      return false;
    }
    
    // Compare password using bcrypt
    const passwordMatches = await bcrypt.compare(password, adminUser.password_hash);
    
    if (passwordMatches) {
      // Store auth token in session storage (will replace with JWT later)
      sessionStorage.setItem('adminAuthenticated', 'true');
      sessionStorage.setItem('adminEmail', username);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Authentication error:", error);
    return false;
  }
};

// Logout function - clears authentication state
export const logoutAdmin = (): void => {
  // Clear admin auth from session storage
  sessionStorage.removeItem('adminAuthenticated');
  sessionStorage.removeItem('adminEmail');
};
