// Tests for the site shell: every URL opens its page, the nav moves between them and unknown URLs get a 404.
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BUSINESS, readableWhatsapp } from "./data/config";
import { createI18n } from "./lib/i18n";
import es from "./locales/site/es.json";
import { routes } from "./routes";

// Renders the site at a URL, as a Spanish-speaking visitor would open it.
function openSite(path: string) {
  vi.spyOn(navigator, "languages", "get").mockReturnValue(["es-VE"]);
  createI18n();
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(<RouterProvider router={router} />);
  return router;
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
    { path: "/", heading: es.home.hero.title },
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

  it("takes the nav to the home page's sections, from any page", async () => {
    // Arrange
    const router = openSite("/proyectos");

    // Act
    await userEvent.click(
      within(screen.getByRole("banner")).getByRole("link", {
        name: es.nav.projects,
      }),
    );

    // Assert
    expect(pageHeading()).toBe(es.home.hero.title);
    expect(router.state.location.hash).toBe("#proyectos");
  });

  it("has a home section for every nav link", () => {
    // Arrange
    openSite("/");

    // Act
    const targets = within(screen.getByRole("banner"))
      .getAllByRole("link")
      .map((link) => link.getAttribute("href") ?? "")
      .filter((href) => href.startsWith("/#"));

    // Assert
    expect(targets).toEqual(["/#servicios", "/#proyectos", "/#sobre-mi"]);
    targets.forEach((href) =>
      expect(document.getElementById(href.slice(2))).not.toBeNull(),
    );
  });

  it("goes home from the logo", async () => {
    // Arrange
    openSite("/proyectos");

    // Act
    await userEvent.click(screen.getByRole("link", { name: BUSINESS.name }));

    // Assert
    expect(pageHeading()).toBe(es.home.hero.title);
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
    expect(pageHeading()).toBe(es.home.hero.title);
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
        `WhatsApp: ${readableWhatsapp(BUSINESS.whatsapp)}`,
      );
      expect(button !== null).toBe(enabled);
      expect(number !== null).toBe(enabled);
    },
  );

  it.each([
    { path: "/", inSection: true },
    { path: "/servicios", inSection: true },
    { path: "/sobre-mi", inSection: true },
    { path: "/proyectos", inSection: false },
  ])(
    "draws the footer's mountains inside $path's last section when it has cranes, so they walk behind them",
    ({ path, inSection }) => {
      // Arrange
      // With WhatsApp on, / ends in the deep-blue call to action instead, which runs straight into the footer.
      BUSINESS.whatsappEnabled = false;
      const url = path;

      // Act
      openSite(url);

      // Assert
      const sections = screen.getByRole("main").querySelectorAll("section");
      const last = sections[sections.length - 1];
      const footer = screen.getByRole("contentinfo");
      const endsInDivider =
        last?.lastElementChild?.getAttribute("aria-hidden") === "true";
      const footerDivider =
        footer.firstElementChild?.getAttribute("aria-hidden") === "true";
      expect(endsInDivider).toBe(inSection);
      expect(footerDivider).toBe(!inSection);
    },
  );
});

describe("page titles", () => {
  it.each([
    { path: "/", meta: es.meta.home },
    {
      path: "/servicios/plomeria",
      meta: {
        title: es.services.items.plomeria.metaTitle,
        description: es.services.items.plomeria.metaDescription,
      },
    },
    { path: "/sobre-mi", meta: es.meta.about },
  ])(
    "names $path in the browser tab and in search results",
    ({ path, meta }) => {
      // Arrange
      document.head.innerHTML =
        '<title></title><meta name="description" content="">';
      const expected = meta.title
        .replace("{{name}}", BUSINESS.name)
        .replace("{{city}}", BUSINESS.city);

      // Act
      openSite(path);

      // Assert
      expect(document.title).toBe(expected);
      expect(
        document
          .querySelector('meta[name="description"]')
          ?.getAttribute("content"),
      ).toBe(
        meta.description.replace(
          "{{engineerYears}}",
          String(BUSINESS.engineerYears),
        ),
      );
    },
  );
});
