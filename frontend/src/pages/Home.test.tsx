// Tests for the home page: the hero, and the trust strip whose numbers count up once it scrolls into view.
import { act, cleanup, render, screen, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BUSINESS, readableWhatsapp, whatsappUrl } from "../data/config";
import { createI18n } from "../lib/i18n";
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

// The works figure as the strip writes it in Spanish, with a dot between thousands.
const works = String(BUSINESS.works).replace(/\B(?=(\d{3})+$)/g, ".");

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
});

describe("home hero", () => {
  it("leads with the headline, WhatsApp and a way to the projects", () => {
    // Arrange
    const heading = es.home.hero.title;

    // Act
    openHome();

    // Assert
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(heading);
    expect(
      screen
        .getByRole("link", { name: es.home.hero.whatsapp })
        .getAttribute("href"),
    ).toBe(whatsappUrl());
    expect(
      screen
        .getByRole("link", { name: es.home.hero.projects })
        .getAttribute("href"),
    ).toBe("/proyectos");
  });
});

describe("trust strip", () => {
  it("counts up to the years and works in the business details, also quoted in the hero", () => {
    // Arrange
    prefersReducedMotion(true);

    // Act
    openHome();

    // Assert
    expect(shownNumbers()).toEqual([`+${BUSINESS.years}`, `+${works}`]);
    expect(
      screen.getByText(
        es.home.hero.subtitle.replace("{{years}}", String(BUSINESS.years)),
      ),
    ).toBeTruthy();
  });

  it("gives screen readers the final numbers from the start", () => {
    // Arrange
    const region = () =>
      screen.getByRole("region", { name: es.home.trust.label });

    // Act
    openHome();

    // Assert
    expect(
      within(region()).getByText(
        `Más de ${BUSINESS.years} años de experiencia`,
      ),
    ).toBeTruthy();
    expect(
      within(region()).getByText(`Más de ${works} obras realizadas`),
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
    expect(before).toEqual(["+20", "+0"]);
    expect(shownNumbers()).toEqual([`+${BUSINESS.years}`, `+${works}`]);
  });

  it("shows the final numbers straight away when the visitor asks for reduced motion", () => {
    // Arrange
    prefersReducedMotion(true);

    // Act
    openHome();

    // Assert
    expect(shownNumbers()).toEqual([`+${BUSINESS.years}`, `+${works}`]);
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

  it("writes the WhatsApp number out under the call-to-action button, for visitors who'd rather dial it", () => {
    // Arrange
    const number = readableWhatsapp(BUSINESS.whatsapp);

    // Act
    openHome();

    // Assert
    const cta = screen
      .getByRole("heading", { level: 2, name: es.home.cta.title })
      .closest("section") as HTMLElement;
    expect(within(cta).getByText(`Llámenos al ${number}`)).toBeTruthy();
  });

  it("ends with the WhatsApp call to action", () => {
    // Arrange
    const heading = es.home.cta.title;

    // Act
    openHome();

    // Assert
    expect(
      screen.getByRole("heading", { level: 2, name: heading }),
    ).toBeTruthy();
    expect(
      screen
        .getByRole("link", { name: es.home.cta.whatsapp })
        .getAttribute("href"),
    ).toBe(whatsappUrl());
  });
});
