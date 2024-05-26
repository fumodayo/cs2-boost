import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
const env = loadEnv("all", process.cwd());
const VITE_SERVER_URL = `${env.VITE_SERVER_URL ?? "http://localhost:3000"}`;
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: VITE_SERVER_URL,
        changeOrigin: true,
      },
    },
  },
});
