
import { setupInitialAdmin } from "../utils/passwordUtils";

// This script sets up the initial admin user
// You would run this once or through a protected admin creation flow
export const initializeAdmin = async () => {
  try {
    // Replace with a strong password and your admin email
    await setupInitialAdmin("admin@ayitiloan.com", "StrongSecurePassword2025!");
    console.log("Admin user initialized successfully");
    return true;
  } catch (error) {
    console.error("Failed to initialize admin user:", error);
    return false;
  }
};
