// Tests for the preview switch: ?preview opens the new site and the tab keeps it while browsing.
import { afterEach, describe, expect, it } from "vitest";
import { isPreview } from "./preview";

afterEach(() => {
  sessionStorage.clear();
  window.history.replaceState({}, "", "/");
});

describe("preview switch", () => {
  it("keeps the preview after leaving the ?preview URL, so links inside the site keep it", () => {
    // Arrange
    window.history.replaceState({}, "", "/?preview");
    isPreview();

    // Act
    window.history.replaceState({}, "", "/proyectos");
    const preview = isPreview();

    // Assert
    expect(preview).toBe(true);
  });

  it("turns the preview off for the tab with ?preview=false", () => {
    // Arrange
    window.history.replaceState({}, "", "/?preview");
    isPreview();

    // Act
    window.history.replaceState({}, "", "/?preview=false");
    const off = isPreview();
    window.history.replaceState({}, "", "/");
    const afterwards = isPreview();

    // Assert
    expect(off).toBe(false);
    expect(afterwards).toBe(false);
  });

  it("gives visitors without ?preview the normal site", () => {
    // Arrange
    window.history.replaceState({}, "", "/proyectos");

    // Act
    const preview = isPreview();

    // Assert
    expect(preview).toBe(false);
  });
});
