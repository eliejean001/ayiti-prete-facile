
import { AdminUser } from "../types/loan";
import { supabase } from "@/integrations/supabase/client";

// Hardcoded admin user for now
const adminUser: AdminUser = {
  username: "admin",
  password: "A9y!t1L0@n#2025" // Stronger password with mixed case, numbers and symbols
};

export const authenticateAdmin = (username: string, password: string): boolean => {
  return username === adminUser.username && password === adminUser.password;
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem("adminAuthenticated") === "true";
};

export const loginAdmin = (): void => {
  localStorage.setItem("adminAuthenticated", "true");
};

export const logoutAdmin = (): void => {
  localStorage.removeItem("adminAuthenticated");
};
