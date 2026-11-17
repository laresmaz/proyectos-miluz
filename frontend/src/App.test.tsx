// Tests for the root component: what visitors see while the site is not launched.
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "./App";
import { BUSINESS } from "./config";

afterEach(cleanup);

describe("app", () => {
  it("shows the deep-blue holding page with only the logo, instead of the teaser", () => {
    // Arrange
    const page = <App />;

    // Act
    render(page);

    // Assert
    expect(screen.getByRole("main").className).toContain("bg-brand-deep");
    expect(screen.getByRole("img", { name: BUSINESS.name })).toBeTruthy();
    expect(screen.queryByRole("heading")).toBeNull();
  });
});
