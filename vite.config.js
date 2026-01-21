import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      "/gp": {
        target: "http://172.20.4.40",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  optimizeDeps: {
    include: [
      "tslib",
      "browser-image-compression",
    ],
  },
});
