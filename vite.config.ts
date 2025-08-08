import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    hmr: false, // Disable HMR for cloud deployment
    proxy: {
      "/api": {
        target: process.env.NODE_ENV === 'production' ? "http://localhost:3011" : "http://localhost:3011",
        changeOrigin: true,
        secure: false,
        ws: true
      },
    },
  },
  build: {
    outDir: "dist",
    minify: false,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
  esbuild: {
    target: "es2020",
    legalComments: "none",
    logOverride: { "this-is-undefined-in-esm": "silent" },
    loader: "tsx",
    jsx: "automatic",
  },
});
