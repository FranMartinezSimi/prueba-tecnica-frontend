import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
/// <reference types="vitest" />

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // @ts-expect-error - el tipo de test existe cuando vitest está instalado
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./setupTests.ts",
  },
});
