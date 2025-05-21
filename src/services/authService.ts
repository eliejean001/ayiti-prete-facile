
import { AdminUser } from "../types/loan";

// Hardcoded admin user for now
const adminUser: AdminUser = {
  username: "admin",
  password: "adminpassword123"
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
