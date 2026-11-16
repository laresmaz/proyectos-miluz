/// <reference types="vitest/config" />
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import businessDetails from "./businessDetails.ts";

export default defineConfig({
  plugins: [react(), tailwindcss(), businessDetails()],
  test: { environment: "jsdom" },
});
