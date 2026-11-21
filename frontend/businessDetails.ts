// Build plugin: fills the business details from src/data/config.ts into index.html, adds the business data search engines read,
// and generates the web manifest, so the details are written only once, in config.ts.
import type { Plugin } from "vite";
import { BUSINESS } from "./src/data/config.ts";

type Business = typeof BUSINESS;

// Adds the plugin to Vite: index.html markers on every page load, the manifest in dev and in the build.
export default function businessDetails(): Plugin {
  const manifest = buildManifest(BUSINESS);
  return {
    name: "business-details",
    transformIndexHtml: (html) => ({
      html: fillBusinessDetails(html, BUSINESS),
      tags: [
        {
          tag: "script",
          attrs: { type: "application/ld+json" },
          children: buildLocalBusiness(BUSINESS),
          injectTo: "head",
        },
      ],
    }),
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

// Replaces %BUSINESS_NAME%, %BUSINESS_CITY% and %SITE_URL% in the page shell, escaped so any value is safe inside HTML.
export function fillBusinessDetails(html: string, business: Business): string {
  return html
    .replaceAll("%BUSINESS_NAME%", escapeHtml(business.name))
    .replaceAll("%BUSINESS_CITY%", escapeHtml(business.city))
    .replaceAll("%SITE_URL%", escapeHtml(business.url));
}

// Builds the schema.org data Google reads for local results, as JSON safe to place inside a <script> tag.
export function buildLocalBusiness(business: Business): string {
  const data = {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    name: business.name,
    url: `${business.url}/`,
    logo: `${business.url}/icon-512.png`,
    image: `${business.url}/og-image.jpg`,
    telephone: `+${business.whatsapp}`,
    taxID: business.rif,
    address: {
      "@type": "PostalAddress",
      addressLocality: business.city.split(",")[0],
      addressCountry: "VE",
    },
    areaServed: { "@type": "Country", name: "Venezuela" },
    founder: { "@type": "Person", name: business.engineer },
  };
  // \u003c is "<" to JSON, but the HTML parser can't read it as the start of </script>.
  return JSON.stringify(data).replaceAll("<", "\\u003c");
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
