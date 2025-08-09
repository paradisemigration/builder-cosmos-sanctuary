import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isProduction =
    mode === "production" || process.env.NODE_ENV === "production";

  return {
    root: "./client",
    server: {
      host: "::",
      port: 8080,
      hmr: false,
      open: false,
      cors: true,
      proxy: {
        "/api": {
          target: "http://localhost:3011",
          changeOrigin: true,
          secure: false,
          ws: false,
        },
      },
    },
    preview: {
      host: "::",
      port: 8080,
      cors: true,
    },
    build: {
      outDir: "../dist",
      emptyOutDir: true,
      minify: false,
      sourcemap: false,
    },
    define: {
      "process.env.NODE_ENV": JSON.stringify(
        isProduction ? "production" : "development",
      ),
    },
    optimizeDeps: {
      exclude: ["@vite/client"],
    },
    plugins: [
      react({
        jsxRuntime: "automatic",
        jsxImportSource: "react",
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./client"),
        "@shared": path.resolve(__dirname, "./shared"),
      },
    },
    esbuild: {
      target: "es2020",
      legalComments: "none",
      jsx: "automatic",
      jsxDev: false,
    },
  };
});
