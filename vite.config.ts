import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production' || process.env.NODE_ENV === 'production';

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: false, // Disable HMR completely for cloud deployment
      proxy: {
        "/api": {
          target: "http://localhost:3011",
          changeOrigin: true,
          secure: false,
          ws: false
        },
      },
    },
    build: {
      outDir: "dist",
      minify: false,
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
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
  };
});
