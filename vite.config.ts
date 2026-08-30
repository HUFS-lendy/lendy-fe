import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target:
          env.VITE_DEV_API_TARGET ??
          (mode === "development" ? "http://localhost:8081" : undefined),
        changeOrigin: true,
        headers: env.VITE_DEV_API_TARGET?.startsWith("https://")
          ? {
              Origin: env.VITE_DEV_API_TARGET,
              Referer: `${env.VITE_DEV_API_TARGET}/`,
            }
          : undefined,
      },
    },
  },
  };
});
