import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    middlewareMode: false,
  },
  build: {
    outDir: "dist/spa",
    minify: false,
  },
  plugins: [
    react(),
    {
      name: "api-server",
      configureServer(server) {
        server.middlewares.use("/api", async (req, res, next) => {
          try {
            // Import the API server
            const { default: apiApp } = await import("./server/api.js");
            apiApp(req, res, next);
          } catch (error) {
            console.error("API Error:", error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "Internal Server Error" }));
          }
        });
      },
    },
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
    logOverride: { "this-is-undefined-in-esm": "silent" },
    loader: "jsx",
    jsx: "automatic",
  },
});
