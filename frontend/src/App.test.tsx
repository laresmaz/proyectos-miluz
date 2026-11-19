// Tests for the root component: visitors get the teaser, ?preview opens the new site before launch.
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { createI18n } from "./i18n";
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
  it.each(["/", "/?preview=false"])(
    "shows the teaser to visitors at %s",
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
});
