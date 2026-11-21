// Tests for the site shell: every URL opens its page, the nav moves between them and unknown URLs get a 404.
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BUSINESS, readableWhatsapp, whatsappUrl } from "./data/config";
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

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("site shell", () => {
  it.each([
    { path: "/", heading: es.home.hero.title },
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

  it.each([
    { reduce: false, behavior: "smooth" },
    { reduce: true, behavior: "auto" },
  ])(
    "glides to the section on the home page instead of jumping, unless the visitor asks for less motion ($behavior)",
    async ({ reduce, behavior }) => {
      // Arrange
      vi.stubGlobal("matchMedia", (query: string) => ({
        matches: reduce && query.includes("reduce"),
      }));
      const glide = vi.fn();
      Element.prototype.scrollIntoView = glide;
      openSite("/");

      // Act
      await userEvent.click(
        within(screen.getByRole("banner")).getByRole("link", {
          name: es.nav.projects,
        }),
      );

      // Assert
      expect(glide).toHaveBeenCalledWith({ behavior });
      expect(glide.mock.contexts[0]).toBe(document.getElementById("proyectos"));
    },
  );

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

  it("sends /servicios to the home page's services section", () => {
    // Arrange
    const url = "/servicios";

    // Act
    const router = openSite(url);

    // Assert
    expect(pageHeading()).toBe(es.home.hero.title);
    expect(router.state.location.pathname + router.state.location.hash).toBe(
      "/#servicios",
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

  it("offers WhatsApp in the header and writes the number in the footer", () => {
    // Arrange
    const number = `WhatsApp: ${readableWhatsapp(BUSINESS.whatsapp)}`;

    // Act
    openSite("/proyectos");

    // Assert
    const button = within(screen.getByRole("banner")).getByRole("link", {
      name: es.nav.whatsapp,
    });
    expect(button.getAttribute("href")).toBe(whatsappUrl());
    expect(
      within(screen.getByRole("contentinfo")).getByText(number),
    ).toBeTruthy();
  });

  it("keeps a floating WhatsApp button on every page", () => {
    // Arrange
    const name = es.nav.whatsappFloating;

    // Act
    openSite("/proyectos");

    // Assert
    expect(screen.getByRole("link", { name }).getAttribute("href")).toBe(
      whatsappUrl(),
    );
  });

  it.each([
    { path: "/sobre-mi", inSection: true },
    { path: "/proyectos", inSection: false },
  ])(
    "draws the footer's mountains inside $path's last section when it has cranes, so they walk behind them",
    ({ path, inSection }) => {
      // Arrange
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

  it("runs the home page's call to action straight into the footer, with no mountains between them", () => {
    // Arrange
    const url = "/";

    // Act
    openSite(url);

    // Assert
    const sections = screen.getByRole("main").querySelectorAll("section");
    const last = sections[sections.length - 1];
    const footer = screen.getByRole("contentinfo");
    expect(last.lastElementChild?.getAttribute("aria-hidden")).not.toBe("true");
    expect(footer.firstElementChild?.getAttribute("aria-hidden")).not.toBe(
      "true",
    );
  });
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
