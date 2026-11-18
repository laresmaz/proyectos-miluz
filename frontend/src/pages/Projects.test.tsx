import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import fallback from "../assets/fallback-photo.svg";
import SiteLayout from "../components/SiteLayout";
import { createI18n } from "../i18n";
import es from "../locales/site/es.json";
import type { Project } from "../projects";
import { SAMPLE_PROJECTS } from "../projects.sample";
import { routes } from "../routes";
import Projects from "./Projects";

// Opens the portfolio at a URL with the given projects, as a Spanish-speaking visitor.
function openPortfolio(projects: Project[], path = "/proyectos") {
  vi.spyOn(navigator, "languages", "get").mockReturnValue(["es-VE"]);
  createI18n();
  const portfolio = [
    {
      element: <SiteLayout />,
      children: [
        { path: "/proyectos", element: <Projects projects={projects} /> },
      ],
    },
  ];
  render(
    <RouterProvider
      router={createMemoryRouter(portfolio, { initialEntries: [path] })}
    />,
  );
}

// Reads the titles of the project cards on screen.
const cardTitles = () =>
  screen
    .getAllByRole("article")
    .map((card) => within(card).getByRole("heading").textContent);

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("portfolio", () => {
  it("shows only published projects, each with its before and after photos", () => {
    // Arrange
    const published = SAMPLE_PROJECTS.filter((p) => p.isPublished);

    // Act
    openPortfolio(SAMPLE_PROJECTS);

    // Assert
    expect(cardTitles()).toEqual(published.map((p) => p.title));
    for (const project of published) {
      for (const image of project.images) {
        expect(screen.getByRole("img", { name: image.altText })).toBeTruthy();
      }
    }
  });

  it("labels each photo pair Antes and Después and names the service, place and year", () => {
    // Arrange
    const project = SAMPLE_PROJECTS[0];

    // Act
    openPortfolio([project]);

    // Assert
    const card = screen.getByRole("article");
    const captions = within(card)
      .getAllByRole("figure")
      .map((figure) => figure.querySelector("figcaption")?.textContent);
    expect(captions).toEqual([es.projects.before, es.projects.after]);
    expect(
      within(card).getByText(
        `${es.services.items.plomeria.title} · ${project.location} · ${project.year}`,
      ),
    ).toBeTruthy();
  });

  it("offers a filter only for services that have published projects", () => {
    // Arrange
    const expected = [
      es.projects.all,
      es.services.items.plomeria.title,
      es.services.items.drywall.title,
    ];

    // Act
    openPortfolio(SAMPLE_PROJECTS);

    // Assert
    const filters = within(
      screen.getByRole("group", { name: es.projects.filter }),
    ).getAllByRole("button");
    expect(filters.map((button) => button.textContent)).toEqual(expected);
  });

  it("narrows the projects to one service and back to all", async () => {
    // Arrange
    openPortfolio(SAMPLE_PROJECTS);
    const drywall = screen.getByRole("button", {
      name: es.services.items.drywall.title,
    });

    // Act
    await userEvent.click(drywall);
    const narrowed = cardTitles();
    await userEvent.click(
      screen.getByRole("button", { name: es.projects.all }),
    );

    // Assert
    expect(narrowed).toEqual(["Divisiones de oficina en Chacao"]);
    expect(drywall.getAttribute("aria-pressed")).toBe("false");
    expect(cardTitles()).toHaveLength(2);
  });

  it("opens already filtered from a shared ?servicio= link", () => {
    // Arrange
    const link = "/proyectos?servicio=plomeria";

    // Act
    openPortfolio(SAMPLE_PROJECTS, link);

    // Assert
    expect(cardTitles()).toEqual(["Baño completo en Los Palos Grandes"]);
    expect(
      screen
        .getByRole("button", { name: es.services.items.plomeria.title })
        .getAttribute("aria-pressed"),
    ).toBe("true");
  });

  it("says the projects are coming while none are published", () => {
    // Arrange
    const projects: Project[] = [];

    // Act
    openPortfolio(projects);

    // Assert
    expect(screen.getByText(es.projects.empty)).toBeTruthy();
    expect(screen.queryAllByRole("article")).toHaveLength(0);
  });

  it("shows the three example projects, whose photos fall back until the real ones are uploaded", () => {
    // Arrange
    vi.spyOn(navigator, "languages", "get").mockReturnValue(["es-VE"]);
    createI18n();
    render(
      <RouterProvider
        router={createMemoryRouter(routes, { initialEntries: ["/proyectos"] })}
      />,
    );
    const photos = screen
      .getAllByRole("img")
      .filter((img) => img.getAttribute("src")?.startsWith("/photos/"));

    // Act
    photos.forEach((photo) => fireEvent.error(photo));

    // Assert
    expect(screen.getAllByRole("article")).toHaveLength(3);
    expect(photos).toHaveLength(6);
    expect(
      photos.every((photo) => photo.getAttribute("src") === fallback),
    ).toBe(true);
  });
});
