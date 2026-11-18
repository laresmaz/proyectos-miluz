// Tests for the site shell: every URL opens its page, the nav moves between them and unknown URLs get a 404.
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BUSINESS } from "./config";
import { createI18n } from "./i18n";
import es from "./locales/es.json";
import { routes } from "./routes";

// Renders the site at a URL, as a Spanish-speaking visitor would open it.
function openSite(path: string) {
  vi.spyOn(navigator, "languages", "get").mockReturnValue(["es-VE"]);
  createI18n();
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(<RouterProvider router={router} />);
}

// Reads the page's main heading.
const pageHeading = () => screen.getByRole("heading", { level: 1 }).textContent;

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("site shell", () => {
  it.each([
    { path: "/", heading: BUSINESS.name },
    { path: "/servicios", heading: es.nav.services },
    { path: "/proyectos", heading: es.nav.projects },
    { path: "/sobre-mi", heading: es.nav.about },
    { path: "/no-existe", heading: es.notFound.title },
  ])("opens $path on its own page", ({ path, heading }) => {
    // Arrange
    const url = path;

    // Act
    openSite(url);

    // Assert
    expect(pageHeading()).toBe(heading);
  });

  it("moves between pages from the nav", async () => {
    // Arrange
    openSite("/");

    // Act
    await userEvent.click(screen.getByRole("link", { name: es.nav.projects }));

    // Assert
    expect(pageHeading()).toBe(es.nav.projects);
  });

  it("goes home from the logo", async () => {
    // Arrange
    openSite("/proyectos");

    // Act
    await userEvent.click(screen.getByRole("link", { name: BUSINESS.name }));

    // Assert
    expect(pageHeading()).toBe(BUSINESS.name);
  });

  it("opens and closes the mobile menu", async () => {
    // Arrange
    openSite("/");
    const menuButton = screen.getByRole("button", { name: es.nav.menu });

    // Act
    await userEvent.click(menuButton);
    const openState = menuButton.getAttribute("aria-expanded");
    await userEvent.click(menuButton);

    // Assert
    expect(openState).toBe("true");
    expect(menuButton.getAttribute("aria-expanded")).toBe("false");
  });

  it("offers a way back home from a page that doesn't exist", async () => {
    // Arrange
    openSite("/no-existe");

    // Act
    await userEvent.click(screen.getByRole("link", { name: es.notFound.back }));

    // Assert
    expect(pageHeading()).toBe(BUSINESS.name);
  });
});
