// Tests for the build plugin that preloads the fonts the first screen needs.
import { describe, expect, it } from "vitest";
import { fontPreloadTags } from "./preloadFonts.ts";

const bundle = [
  "assets/index-CX4wuU6T.css",
  "assets/oswald-latin-700-normal-Bq3RqX1p.woff2",
  "assets/oswald-latin-700-normal-AbCd.woff",
  "assets/oswald-latin-ext-700-normal-Zz.woff2",
  "assets/lato-latin-400-normal-C1x2Lp9a.woff2",
  "assets/lato-latin-700-normal-D8k3Qa2b.woff2",
  "assets/lato-latin-900-normal-E5r7Ty1c.woff2",
  "assets/lato-latin-ext-400-normal-F2m6Wq8d.woff2",
];

describe("font preloading", () => {
  it("preloads only the Latin woff2 files of the fonts on the first screen", () => {
    // Arrange
    const files = bundle;

    // Act
    const hrefs = fontPreloadTags(files).map((tag) => tag.attrs?.href);

    // Assert
    expect(hrefs).toEqual([
      "/assets/oswald-latin-700-normal-Bq3RqX1p.woff2",
      "/assets/lato-latin-400-normal-C1x2Lp9a.woff2",
      "/assets/lato-latin-700-normal-D8k3Qa2b.woff2",
    ]);
  });

  it("marks each preload as a cross-origin font so the browser reuses it", () => {
    // Arrange
    const files = bundle;

    // Act
    const [tag] = fontPreloadTags(files);

    // Assert
    expect(tag.attrs).toMatchObject({
      rel: "preload",
      as: "font",
      type: "font/woff2",
      crossorigin: "",
    });
  });
});
