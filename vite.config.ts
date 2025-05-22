
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Add support for environment variables
  define: {
    // Ensure we handle environment variables properly
    'import.meta.env.VITE_MONCASH_CLIENT_ID': JSON.stringify(process.env.VITE_MONCASH_CLIENT_ID || ""),
    'import.meta.env.VITE_MONCASH_CLIENT_SECRET': JSON.stringify(process.env.VITE_MONCASH_CLIENT_SECRET || ""),
  },
}));
