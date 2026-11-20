// Tests for the build plugin that starts downloading the site's code early, only for ?preview visitors.
/// <reference lib="dom" />
import { afterEach, describe, expect, it } from "vitest";
import { previewPreloadTag } from "./preloadPreviewSite.ts";

const bundle = ["assets/index-M4R9oEtG.js", "assets/Site-PcQZwCHR.js"];

// Runs the inline script the plugin adds to index.html, as the browser would at that URL, and returns the preloaded files.
function preloadsAt(url: string): string[] {
  window.history.replaceState({}, "", url);
  new Function(previewPreloadTag(bundle)[0].children as string)();
  return [...document.querySelectorAll('link[rel="modulepreload"]')].map(
    (link) => link.getAttribute("href") ?? "",
  );
}

afterEach(() => {
  document.head.innerHTML = "";
  sessionStorage.clear();
  window.history.replaceState({}, "", "/");
});

describe("preview site preloading", () => {
  it("starts downloading the site's code for ?preview visitors", () => {
    // Arrange
    const url = "/?preview";

    // Act
    const preloads = preloadsAt(url);

    // Assert
    expect(preloads).toEqual(["/assets/Site-PcQZwCHR.js"]);
  });

  it("does the same for a tab that remembers ?preview from earlier", () => {
    // Arrange
    sessionStorage.setItem("preview", "1");

    // Act
    const preloads = preloadsAt("/servicios");

    // Assert
    expect(preloads).toEqual(["/assets/Site-PcQZwCHR.js"]);
  });

  it.each(["/", "/?preview=false"])(
    "leaves holding page visitors alone at %s",
    (url) => {
      // Arrange
      sessionStorage.setItem("preview", url === "/" ? "" : "1");

      // Act
      const preloads = preloadsAt(url);

      // Assert
      expect(preloads).toEqual([]);
    },
  );

  it("adds nothing when the build has no site chunk", () => {
    // Arrange
    const files = ["assets/index-M4R9oEtG.js"];

    // Act
    const tags = previewPreloadTag(files);

    // Assert
    expect(tags).toEqual([]);
  });
});
