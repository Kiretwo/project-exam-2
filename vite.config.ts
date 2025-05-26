import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // ← map “@” to your src folder
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/styles/utils/variables.scss" as vars;
          @use "@/styles/utils/mixins.scss" as mixins;
        `,
        quietDeps: true,
        silenceDeprecations: ["color-functions", "global-builtin"],
      },
    },
  },
});
