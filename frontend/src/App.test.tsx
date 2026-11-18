import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "./App";
import { BUSINESS } from "./config";
import { createI18n } from "./i18n";

afterEach(() => {
  cleanup();
  window.history.replaceState({}, "", "/");
});

describe("app", () => {
  it("shows the deep-blue holding page with only the logo to visitors", () => {
    // Arrange
    window.history.replaceState({}, "", "/");

    // Act
    render(<App />);

    // Assert
    expect(screen.getByRole("main").className).toContain("bg-brand-deep");
    expect(screen.getByRole("img", { name: BUSINESS.name })).toBeTruthy();
    expect(screen.queryByRole("heading")).toBeNull();
  });

  it("shows the teaser with ?preview, so it can be reviewed before launch", () => {
    // Arrange
    window.history.replaceState({}, "", "/?preview");
    createI18n();

    // Act
    render(<App />);

    // Assert
    expect(screen.getByRole("heading", { level: 1 })).toBeTruthy();
  });
});
