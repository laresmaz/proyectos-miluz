// Tests for the site shell: every URL opens its page, the nav moves between them and unknown URLs get a 404.
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BUSINESS } from "./config";
import { createI18n } from "./i18n";
import es from "./locales/site/es.json";
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

const whatsappEnabledInConfig = BUSINESS.whatsappEnabled;

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  BUSINESS.whatsappEnabled = whatsappEnabledInConfig;
});

describe("site shell", () => {
  it.each([
    { path: "/", heading: BUSINESS.name },
    { path: "/servicios", heading: es.nav.services },
    { path: "/proyectos", heading: es.nav.projects },
    { path: "/sobre-mi", heading: es.about.title },
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
    await userEvent.click(
      within(screen.getByRole("banner")).getByRole("link", {
        name: es.nav.projects,
      }),
    );

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

describe("site header and footer", () => {
  it("names the business beside the logo in the header and the footer", () => {
    // Arrange
    const url = "/proyectos";

    // Act
    openSite(url);

    // Assert
    const header = screen.getByRole("banner");
    const footer = screen.getByRole("contentinfo");
    expect(within(header).getByText(BUSINESS.name)).toBeTruthy();
    expect(within(footer).getByText(BUSINESS.name)).toBeTruthy();
    expect(within(footer).getByText(BUSINESS.city)).toBeTruthy();
  });

  it.each([true, false])(
    "shows the WhatsApp button and number only when WhatsApp is on (%s)",
    (enabled) => {
      // Arrange
      BUSINESS.whatsappEnabled = enabled;

      // Act
      openSite("/proyectos");

      // Assert
      const button = within(screen.getByRole("banner")).queryByRole("link", {
        name: es.nav.whatsapp,
      });
      const number = within(screen.getByRole("contentinfo")).queryByText(
        `WhatsApp: ${BUSINESS.whatsapp}`,
      );
      expect(button !== null).toBe(enabled);
      expect(number !== null).toBe(enabled);
    },
  );

  it.each([
    { path: "/proyectos", sky: "var(--color-white)" },
    { path: "/sobre-mi", sky: "var(--color-brand-mist)" },
  ])(
    "blends the footer's mountains into the last section of $path",
    ({ path, sky }) => {
      // Arrange
      const url = path;

      // Act
      openSite(url);

      // Assert
      const divider = screen.getByRole("contentinfo")
        .firstElementChild as HTMLElement;
      expect(divider.style.background).toBe(sky);
    },
  );
});
