/// <reference types="vitest/config" />
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { FontaineTransform } from "fontaine";
import { defineConfig } from "vite";
import businessDetails from "./businessDetails.ts";
import preloadFonts from "./preloadFonts.ts";
import preloadPreviewSite from "./preloadPreviewSite.ts";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    businessDetails(),
    preloadFonts(),
    preloadPreviewSite(),
    // Fallback fonts resized to the brand fonts' proportions, so text barely moves when Barlow and Inter arrive.
    // Roboto first: most visitors are on Android phones.
    FontaineTransform.vite({
      fallbacks: [
        "Roboto",
        "Arial",
        "Helvetica Neue",
        "Segoe UI",
        "Noto Sans",
        "Liberation Sans",
      ],
    }),
  ],
  test: { environment: "jsdom" },
});
