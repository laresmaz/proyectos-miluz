// Tests for the build plugin that preloads the fonts the first screen needs.
import { describe, expect, it } from "vitest";
import { fontPreloadTags } from "./preloadFonts.ts";

const bundle = [
  "assets/index-CX4wuU6T.css",
  "assets/barlow-condensed-latin-700-normal-v1xN8_Wq.woff2",
  "assets/barlow-condensed-latin-700-normal-AbCd.woff",
  "assets/barlow-condensed-latin-ext-700-normal-Zz.woff2",
  "assets/inter-latin-wght-normal-Dx4kXJAl.woff2",
  "assets/inter-latin-ext-wght-normal-HA_RiXHX.woff2",
];

describe("font preloading", () => {
  it("preloads only the Latin woff2 files of the fonts on the first screen", () => {
    // Arrange
    const files = bundle;

    // Act
    const hrefs = fontPreloadTags(files).map((tag) => tag.attrs?.href);

    // Assert
    expect(hrefs).toEqual([
      "/assets/barlow-condensed-latin-700-normal-v1xN8_Wq.woff2",
      "/assets/inter-latin-wght-normal-Dx4kXJAl.woff2",
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
