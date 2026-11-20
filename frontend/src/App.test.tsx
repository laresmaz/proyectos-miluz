// Tests for the root component: visitors get the teaser, and ?preview the new site.
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { BUSINESS } from "./data/config";
import { createI18n } from "./lib/i18n";
import es from "./locales/es.json";
import site from "./locales/site/es.json";

// Renders the app at a URL, as a Spanish-speaking visitor would open it.
function openApp(path: string) {
  window.history.replaceState({}, "", path);
  vi.spyOn(navigator, "languages", "get").mockReturnValue(["es-VE"]);
  createI18n();
  render(<App />);
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  sessionStorage.clear();
  window.history.replaceState({}, "", "/");
});

describe("app", () => {
  it.each(["/", "/proyectos", "/?preview=false"])(
    "shows visitors the teaser at %s",
    (path) => {
      // Arrange
      const url = path;

      // Act
      openApp(url);

      // Assert
      expect(screen.getByRole("heading", { level: 1 }).textContent).toContain(
        es.teaser.headlineAccent,
      );
      expect(screen.queryByRole("navigation")).toBeNull();
    },
  );

  it("shows the new site with ?preview, so it can be reviewed before launch", async () => {
    // Arrange
    const url = "/?preview";

    // Act
    openApp(url);

    // Assert
    expect(await screen.findByRole("navigation")).toBeTruthy();
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      site.home.hero.title,
    );
  });

  it("shows the logo while the site's code is still loading, instead of a blank page", async () => {
    // Arrange: a fresh copy of the app, since an earlier test already loaded the site's code.
    vi.resetModules();
    const { default: FreshApp } = await import("./App");
    window.history.replaceState({}, "", "/?preview");
    createI18n();

    // Act
    render(<FreshApp />);
    const whileLoading = screen.queryByRole("img", { name: BUSINESS.name });

    // Assert
    expect(whileLoading).toBeTruthy();
    expect(await screen.findByRole("navigation")).toBeTruthy();
  });
});
