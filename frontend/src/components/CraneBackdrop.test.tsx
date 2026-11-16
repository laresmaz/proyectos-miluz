// Tests for the drifting cranes: decorative only, small ones painted first so big ones sit on top.
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import CraneBackdrop from "./CraneBackdrop";

afterEach(cleanup);

// Reads a crane's rendered width in pixels.
const widthOf = (crane: Element) =>
  parseInt((crane as HTMLElement).style.width);

describe("crane backdrop", () => {
  it("hides every crane from screen readers", () => {
    // Arrange
    const { container } = render(<CraneBackdrop />);

    // Act
    const cranes = [...container.querySelectorAll(".crane")];

    // Assert
    expect(cranes.length).toBeGreaterThan(0);
    expect(
      cranes.every((crane) => crane.getAttribute("aria-hidden") === "true"),
    ).toBe(true);
  });

  it("draws the small background cranes before the big ones", () => {
    // Arrange
    const { container } = render(<CraneBackdrop />);

    // Act
    const widths = [...container.querySelectorAll(".crane")].map(widthOf);

    // Assert
    const firstBig = widths.findIndex((width) => width >= 300);
    expect(widths.slice(0, firstBig).every((width) => width <= 150)).toBe(true);
    expect(widths.slice(firstBig).every((width) => width >= 300)).toBe(true);
  });
});
