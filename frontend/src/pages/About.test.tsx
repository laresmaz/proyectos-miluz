import { cleanup, render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createI18n } from "../i18n";
import es from "../locales/site/es.json";
import { routes } from "../routes";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("about page", () => {
  it("introduces the engineer with his experience in bold and his photo", () => {
    // Arrange
    vi.spyOn(navigator, "languages", "get").mockReturnValue(["es-VE"]);
    createI18n();

    // Act
    render(
      <RouterProvider
        router={createMemoryRouter(routes, { initialEntries: ["/sobre-mi"] })}
      />,
    );

    // Assert
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      es.about.title,
    );
    const bold = Array.from(document.querySelectorAll("main strong")).map(
      (node) => node.textContent,
    );
    expect(bold).toContain("más de 50 años");
    expect(screen.getByRole("img", { name: es.about.photoAlt })).toBeTruthy();
  });
});
