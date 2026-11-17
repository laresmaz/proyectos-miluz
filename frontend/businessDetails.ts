// Build plugin: fills the business details from src/config.ts into index.html and generates the web manifest,
// so the name and city are written only once, in config.ts.
import type { Plugin } from "vite";
import { BUSINESS } from "./src/config.ts";

type Business = typeof BUSINESS;

// Adds the plugin to Vite: index.html markers on every page load, the manifest in dev and in the build.
export default function businessDetails(): Plugin {
  const manifest = buildManifest(BUSINESS);
  return {
    name: "business-details",
    transformIndexHtml: (html) => fillBusinessDetails(html, BUSINESS),
    configureServer(server) {
      server.middlewares.use("/site.webmanifest", (_req, res) => {
        res.setHeader("Content-Type", "application/manifest+json");
        res.end(manifest);
      });
    },
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "site.webmanifest",
        source: manifest,
      });
    },
  };
}

// Replaces %BUSINESS_NAME% and %BUSINESS_CITY% in the page shell, escaped so any name is safe inside HTML.
export function fillBusinessDetails(html: string, business: Business): string {
  return html
    .replaceAll("%BUSINESS_NAME%", escapeHtml(business.name))
    .replaceAll("%BUSINESS_CITY%", escapeHtml(business.city));
}

// Builds the web manifest Android reads for the home-screen name and icon.
export function buildManifest(business: Business): string {
  const icon = { src: "/icon-512.png", sizes: "512x512", type: "image/png" };
  return JSON.stringify({
    name: business.name,
    short_name: business.name,
    // Same file for both: the logo already sits inside the safe zone Android crops maskable icons to.
    icons: [
      { ...icon, purpose: "any" },
      { ...icon, purpose: "maskable" },
    ],
    theme_color: "#05054A",
    background_color: "#05054A",
  });
}

// Escapes the characters that could end an HTML attribute or open a tag.
function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
