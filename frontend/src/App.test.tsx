// Tests for the root page choice: visitors get the teaser, and ?preview the new site.
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { loadPage } from "./App";
import { createI18n } from "./lib/i18n";
import es from "./locales/es.json";
import site from "./locales/site/es.json";

// Renders the page for a URL, as a Spanish-speaking visitor would open it.
async function openApp(path: string) {
  window.history.replaceState({}, "", path);
  vi.spyOn(navigator, "languages", "get").mockReturnValue(["es-VE"]);
  createI18n();
  const Page = await loadPage();
  render(<Page />);
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
    async (path) => {
      // Arrange
      const url = path;

      // Act
      await openApp(url);

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
    await openApp(url);

    // Assert
    expect(screen.getByRole("navigation")).toBeTruthy();
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      site.home.hero.title,
    );
  });
});
