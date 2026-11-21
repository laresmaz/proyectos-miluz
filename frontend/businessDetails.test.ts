// Tests for the build plugin that fills the business details into index.html and the web manifest.
import { describe, expect, it } from "vitest";
import { buildManifest, fillBusinessDetails } from "./businessDetails.ts";

const business = {
  name: "Pérez & Hijos",
  city: "Valencia, Venezuela",
  rif: "J-12345678-9",
  years: 25,
  works: 400,
  engineerYears: 40,
  whatsapp: "584141234567",
};

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
