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
      hmr: false, // Completely disable HMR
      open: false,
      cors: true,
      proxy: {
        "/api": {
          target: "http://localhost:3011",
          changeOrigin: true,
          secure: false,
          ws: false
        },
      },
    },
    preview: {
      host: "::",
      port: 8080,
      cors: true,
    },
    build: {
      outDir: "dist",
      minify: false,
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
    define: {
      // Completely disable Vite client in production
      'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
    },
    optimizeDeps: {
      exclude: ['@vite/client']
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
      jsx: "automatic",
      jsxDev: false,
    },
  };
});
