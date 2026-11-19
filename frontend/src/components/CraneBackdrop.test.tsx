// Tests for the drifting cranes: decorative only, small ones painted first so big ones sit on top.
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import CraneBackdrop from "./CraneBackdrop";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

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

  it.each([
    { browser: "a visitor's browser", userAgent: "Mozilla/5.0", still: false },
    { browser: "Chromatic", userAgent: "Mozilla/5.0 Chromatic", still: true },
  ])("holds the cranes still only in $browser", ({ userAgent, still }) => {
    // Arrange
    vi.spyOn(navigator, "userAgent", "get").mockReturnValue(userAgent);

    // Act
    const { container } = render(<CraneBackdrop />);

    // Assert
    const names = [...container.querySelectorAll<HTMLElement>(".crane")].map(
      (crane) => crane.style.animationName,
    );
    expect(names.every((name) => (name === "none") === still)).toBe(true);
  });

  it.each([
    { tone: "dark" as const, opacities: [0.07, 0.07, 0.07, 0.13, 0.1] },
    { tone: "light" as const, opacities: [0.13, 0.13, 0.26] },
  ])("uses the mockup's cranes for $tone sections", ({ tone, opacities }) => {
    // Arrange
    const props = { tone };

    // Act
    const { container } = render(<CraneBackdrop {...props} />);

    // Assert
    const shown = [...container.querySelectorAll<HTMLElement>(".crane")].map(
      (crane) => Number(crane.style.opacity),
    );
    expect(shown).toEqual(opacities);
  });

  it("staggers the cranes of stacked sections, so they don't line up band after band", () => {
    // Arrange
    const delays = (offset: number) => {
      const { container, unmount } = render(<CraneBackdrop offset={offset} />);
      const shown = [...container.querySelectorAll<HTMLElement>(".crane")].map(
        (crane) => crane.style.animationDelay,
      );
      unmount();
      return shown;
    };

    // Act
    const first = delays(0);
    const second = delays(1);

    // Assert
    expect(second).not.toEqual(first);
    expect(second.every((delay) => delay.startsWith("-"))).toBe(true);
  });

  it("reserves each crane's height before the image decodes, so the page doesn't jump", () => {
    // Arrange
    const { container } = render(<CraneBackdrop />);

    // Act
    const cranes = [...container.querySelectorAll("img.crane")];

    // Assert: width and height attributes in crane.svg's 352 × 312 proportions.
    for (const crane of cranes) {
      const width = Number(crane.getAttribute("width"));
      const height = Number(crane.getAttribute("height"));
      expect(width).toBeGreaterThan(0);
      expect(height).toBe(Math.round((width * 312) / 352));
    }
  });
});
