// Tests for the project card: its details line only shows what is known about the project.
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createI18n } from "../../lib/i18n";
import siteEs from "../../locales/site/es.json";
import type { Project } from "../../data/projects";
import ProjectCard from "./ProjectCard";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("project card", () => {
  it("leaves the year out of the details when it isn't known", () => {
    // Arrange
    vi.spyOn(navigator, "languages", "get").mockReturnValue(["es-VE"]);
    createI18n().addResourceBundle("es", "site", siteEs);
    const project: Project = {
      slug: "edificio-altamar",
      title: "Edificio Altamar",
      serviceType: "obras-civiles",
      location: "Puerto La Cruz",
      isPublished: true,
      images: [],
    };

    // Act
    render(<ProjectCard project={project} />);

    // Assert
    expect(screen.getByText(/Puerto La Cruz/).textContent).toBe(
      "Obras civiles · Puerto La Cruz",
    );
  });
});
