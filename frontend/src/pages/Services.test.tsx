// Tests for the services: the zigzag index, each service's page, and the WhatsApp button behind its flag.
import { cleanup, render, screen, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BUSINESS } from "../data/config";
import { createI18n } from "../lib/i18n";
import es from "../locales/site/es.json";
import { routes } from "../routes";
import { SERVICES } from "../data/services";

// Renders the site at a URL, as a Spanish-speaking visitor would open it.
function openSite(path: string) {
  vi.spyOn(navigator, "languages", "get").mockReturnValue(["es-VE"]);
  createI18n();
  render(
    <RouterProvider
      router={createMemoryRouter(routes, { initialEntries: [path] })}
    />,
  );
}

// The zigzag's service blocks, which come before the project cards on the home page.
const serviceBlocks = () =>
  screen.getAllByRole("article").slice(0, SERVICES.length);

const whatsappEnabledInConfig = BUSINESS.whatsappEnabled;

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  BUSINESS.whatsappEnabled = whatsappEnabledInConfig;
});

describe("services on the home page", () => {
  it("lists every service in order, each linking to its own page", () => {
    // Arrange
    const expected = SERVICES.map(({ slug }) => es.services.items[slug].title);

    // Act
    openSite("/");

    // Assert
    const blocks = serviceBlocks();
    expect(
      blocks.map((b) => within(b).getByRole("heading").textContent),
    ).toEqual(expected);
    const links = blocks.map((b) =>
      within(b)
        .getByRole("link", { name: new RegExp(es.services.seeMore) })
        .getAttribute("href"),
    );
    expect(links).toEqual(SERVICES.map(({ slug }) => `/servicios/${slug}`));
  });

  it("keeps each service block to its Ver más link, even with WhatsApp on", () => {
    // Arrange
    BUSINESS.whatsappEnabled = true;

    // Act
    openSite("/");

    // Assert
    serviceBlocks().forEach((block) =>
      expect(within(block).getAllByRole("link")).toHaveLength(1),
    );
  });

  it("alternates the image side from one block to the next on desktop", () => {
    // Arrange
    openSite("/");

    // Act
    const blocks = serviceBlocks();

    // Assert
    blocks.forEach((block, i) =>
      expect(block.className.includes("lg:flex-row-reverse")).toBe(i % 2 === 1),
    );
  });
});

describe("service page", () => {
  it.each(SERVICES.map(({ slug }) => slug))(
    "shows the full %s service with what it includes",
    (slug) => {
      // Arrange
      const texts = es.services.items[slug];

      // Act
      openSite(`/servicios/${slug}`);

      // Assert
      expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
        texts.title,
      );
      const included = within(
        screen.getByRole("list", { name: es.services.includes }),
      )
        .getAllByRole("listitem")
        .map((item) => item.textContent);
      expect(included).toEqual(texts.includes);
      expect(screen.getByRole("img", { name: texts.alt })).toBeTruthy();
    },
  );

  it("offers integral maintenance for offices and buildings as its own service", () => {
    // Arrange
    const url = "/servicios/mantenimiento-integral";

    // Act
    openSite(url);

    // Assert
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Mantenimiento integral",
    );
  });

  it("leads back to the home page's services section", () => {
    // Arrange
    const url = "/servicios/plomeria";

    // Act
    openSite(url);

    // Assert
    expect(
      screen
        .getByRole("link", { name: new RegExp(es.services.all) })
        .getAttribute("href"),
    ).toBe("/#servicios");
  });

  it("shows the 404 page for a service that doesn't exist", () => {
    // Arrange
    const url = "/servicios/no-existe";

    // Act
    openSite(url);

    // Assert
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      es.notFound.title,
    );
  });

  it("asks on WhatsApp with the service's message when WhatsApp is on", () => {
    // Arrange
    BUSINESS.whatsappEnabled = true;

    // Act
    openSite("/servicios/plomeria");

    // Assert
    const link = screen.getByRole("link", { name: es.services.whatsapp });
    expect(link.getAttribute("href")).toBe(
      `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(es.services.items.plomeria.whatsapp)}`,
    );
  });

  it("hides the WhatsApp button while WhatsApp is off", () => {
    // Arrange
    BUSINESS.whatsappEnabled = false;

    // Act
    openSite("/servicios/plomeria");

    // Assert
    expect(
      screen.queryByRole("link", { name: es.services.whatsapp }),
    ).toBeNull();
  });
});
