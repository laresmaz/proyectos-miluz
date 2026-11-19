// Tests for the home page: the hero, and the trust strip whose numbers count up once it scrolls into view.
import { act, cleanup, render, screen, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BUSINESS } from "../config";
import { createI18n } from "../i18n";
import es from "../locales/site/es.json";
import { routes } from "../routes";

// Callbacks the page registered with the browser's IntersectionObserver, so a test can scroll the strip into view.
let onIntersect: IntersectionObserverCallback[] = [];

// Pretends the visitor's system asks for reduced motion, or not.
function prefersReducedMotion(reduce: boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: reduce && query.includes("reduce"),
  }));
}

// Opens the home page as a Spanish-speaking visitor.
function openHome() {
  vi.spyOn(navigator, "languages", "get").mockReturnValue(["es-VE"]);
  createI18n();
  render(
    <RouterProvider
      router={createMemoryRouter(routes, { initialEntries: ["/"] })}
    />,
  );
}

// Reads the big numbers in the trust strip, as a sighted visitor sees them.
const shownNumbers = () =>
  Array.from(
    screen
      .getByRole("region", { name: es.home.trust.label })
      .querySelectorAll("[data-count]"),
  ).map((n) => n.textContent);

const whatsappEnabledInConfig = BUSINESS.whatsappEnabled;

beforeEach(() => {
  onIntersect = [];
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        onIntersect.push(callback);
      }
      observe() {}
      disconnect() {}
    },
  );
  prefersReducedMotion(false);
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  BUSINESS.whatsappEnabled = whatsappEnabledInConfig;
});

describe("home hero", () => {
  it("leads with the headline and a way to the projects", () => {
    // Arrange
    BUSINESS.whatsappEnabled = false;

    // Act
    openHome();

    // Assert
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      es.home.hero.title,
    );
    expect(
      screen
        .getByRole("link", { name: es.home.hero.projects })
        .getAttribute("href"),
    ).toBe("/proyectos");
    expect(
      screen.queryByRole("link", { name: es.home.hero.whatsapp }),
    ).toBeNull();
  });

  it("offers WhatsApp once it's on", () => {
    // Arrange
    BUSINESS.whatsappEnabled = true;

    // Act
    openHome();

    // Assert
    expect(
      screen
        .getByRole("link", { name: es.home.hero.whatsapp })
        .getAttribute("href"),
    ).toBe(`https://wa.me/${BUSINESS.whatsapp}`);
  });
});

describe("trust strip", () => {
  it("gives screen readers the final numbers from the start", () => {
    // Arrange
    const region = () =>
      screen.getByRole("region", { name: es.home.trust.label });

    // Act
    openHome();

    // Assert
    expect(
      within(region()).getByText("Más de 50 años de experiencia"),
    ).toBeTruthy();
    expect(
      within(region()).getByText("Más de 7.000 obras realizadas"),
    ).toBeTruthy();
  });

  it("waits until the strip scrolls into view, then counts up to the final numbers", () => {
    // Arrange
    vi.useFakeTimers({ toFake: ["requestAnimationFrame", "performance"] });
    openHome();
    const before = shownNumbers();

    // Act
    act(() => {
      onIntersect.forEach((callback) =>
        callback(
          [{ isIntersecting: true } as IntersectionObserverEntry],
          {} as IntersectionObserver,
        ),
      );
      vi.advanceTimersByTime(3000);
    });

    // Assert
    expect(before).toEqual(["+40", "+0"]);
    expect(shownNumbers()).toEqual(["+50", "+7.000"]);
  });

  it("shows the final numbers straight away when the visitor asks for reduced motion", () => {
    // Arrange
    prefersReducedMotion(true);

    // Act
    openHome();

    // Assert
    expect(shownNumbers()).toEqual(["+50", "+7.000"]);
  });
});

describe("home services and how we work", () => {
  it("introduces the services, then shows each one with what it includes", () => {
    // Arrange
    const services = Object.values(es.services.items);

    // Act
    openHome();

    // Assert
    expect(
      screen.getByRole("heading", { level: 2, name: es.home.services.title }),
    ).toBeTruthy();
    const blocks = screen
      .getAllByRole("article")
      .filter((article) => within(article).queryByRole("list"));
    expect(blocks).toHaveLength(services.length);
    blocks.forEach((block, i) => {
      const included = within(block)
        .getAllByRole("listitem")
        .map((item) => item.textContent);
      expect(included).toEqual(services[i].includes);
    });
  });

  it("walks through the four steps of how the engineer works", () => {
    // Arrange
    const steps = es.home.steps.items.map((step) => step.title);

    // Act
    openHome();

    // Assert
    const section = screen
      .getByRole("heading", { level: 2, name: es.home.steps.title })
      .closest("section") as HTMLElement;
    expect(
      within(section)
        .getAllByRole("heading", { level: 3 })
        .map((h) => h.textContent),
    ).toEqual(steps);
  });

  it.each([
    { enabled: true, text: es.home.steps.items[0].text },
    {
      enabled: false,
      text: es.home.steps.items[0].textWithoutWhatsapp as string,
    },
  ])(
    "only names WhatsApp in the first step once it's on ($enabled)",
    ({ enabled, text }) => {
      // Arrange
      BUSINESS.whatsappEnabled = enabled;

      // Act
      openHome();

      // Assert
      expect(screen.getByText(text)).toBeTruthy();
    },
  );
});

describe("home projects, about and call to action", () => {
  it("shows three finished projects with a way to see them all", () => {
    // Arrange
    const heading = es.home.projects.title;

    // Act
    openHome();

    // Assert
    const section = screen
      .getByRole("heading", { level: 2, name: heading })
      .closest("section") as HTMLElement;
    expect(within(section).getAllByRole("article")).toHaveLength(3);
    expect(
      within(section)
        .getByRole("link", { name: new RegExp(es.home.projects.all) })
        .getAttribute("href"),
    ).toBe("/proyectos");
  });

  it("introduces the engineer further down the page", () => {
    // Arrange
    const heading = es.about.title;

    // Act
    openHome();

    // Assert
    expect(
      screen.getByRole("heading", { level: 2, name: heading }),
    ).toBeTruthy();
  });

  it.each([true, false])(
    "ends with the WhatsApp call to action only when WhatsApp is on (%s)",
    (enabled) => {
      // Arrange
      BUSINESS.whatsappEnabled = enabled;

      // Act
      openHome();

      // Assert
      const cta = screen.queryByRole("heading", {
        level: 2,
        name: es.home.cta.title,
      });
      const button = screen.queryByRole("link", { name: es.home.cta.whatsapp });
      expect(cta !== null).toBe(enabled);
      expect(button !== null).toBe(enabled);
    },
  );
});
