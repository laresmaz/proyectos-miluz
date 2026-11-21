// Tests for the build plugin that fills the business details into index.html and the web manifest.
import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { buildManifest, fillBusinessDetails } from "./businessDetails.ts";
import { BUSINESS } from "./src/data/config.ts";

const business = {
  name: "Pérez & Hijos",
  city: "Valencia, Venezuela",
  rif: "J-12345678-9",
  years: 25,
  works: 400,
  engineerYears: 40,
  whatsapp: "584141234567",
  whatsappEnabled: true,
  url: "https://www.perezhijos.com",
};

// Reads one meta tag's content from the page shell, by its name or property attribute.
const meta = (html: string, key: string) =>
  html.match(
    new RegExp(`<meta\\s+(?:name|property)="${key}"\\s+content="([^"]*)"`),
  )?.[1];

describe("business details in the page shell", () => {
  it("puts the name and city wherever index.html has their markers", () => {
    // Arrange
    const html =
      "<title>%BUSINESS_NAME% · %BUSINESS_CITY%</title><meta content='%BUSINESS_NAME%'>";

    // Act
    const filled = fillBusinessDetails(html, business);

    // Assert
    expect(filled).toBe(
      "<title>Pérez &amp; Hijos · Valencia, Venezuela</title><meta content='Pérez &amp; Hijos'>",
    );
  });

  it("puts the site's address wherever index.html has its marker", () => {
    // Arrange
    const html = '<meta property="og:url" content="%SITE_URL%/">';

    // Act
    const filled = fillBusinessDetails(html, business);

    // Assert
    expect(filled).toBe(
      '<meta property="og:url" content="https://www.perezhijos.com/">',
    );
  });

  it("gives WhatsApp and social link previews the page's title, description and an image that exists", () => {
    // Arrange
    const shell = readFileSync("index.html", "utf8");

    // Act
    const html = fillBusinessDetails(shell, BUSINESS);

    // Assert
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
    expect(meta(html, "og:title")).toBe(title);
    expect(meta(html, "og:description")).toBe(meta(html, "description"));
    expect(meta(html, "og:url")).toBe(`${BUSINESS.url}/`);
    const image = meta(html, "og:image") ?? "";
    expect(image.startsWith(`${BUSINESS.url}/`)).toBe(true);
    expect(existsSync(`public${image.slice(BUSINESS.url.length)}`)).toBe(true);
    expect(meta(html, "og:locale")).toBe("es_VE");
    expect(meta(html, "twitter:card")).toBe("summary_large_image");
  });

  it("escapes characters that would break the HTML", () => {
    // Arrange
    const html = '<meta content="%BUSINESS_NAME%">';

    // Act
    const filled = fillBusinessDetails(html, {
      ...business,
      name: `"Bad" <name>`,
    });

    // Assert
    expect(filled).toBe('<meta content="&quot;Bad&quot; &lt;name&gt;">');
  });

  it("builds a valid manifest named after the business with the icon for both purposes", () => {
    // Arrange
    const details = business;

    // Act
    const manifest = JSON.parse(buildManifest(details));

    // Assert
    expect(manifest.name).toBe(business.name);
    expect(manifest.short_name).toBe(business.name);
    expect(
      manifest.icons.map((icon: { purpose: string }) => icon.purpose),
    ).toEqual(["any", "maskable"]);
  });
});
