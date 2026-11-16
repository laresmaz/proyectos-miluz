// Tests for the Ávila divider: decorative only, solid mountains in the next section's color, open sky above them.
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import AvilaDivider from "./AvilaDivider";

afterEach(cleanup);

const colors = { topBg: "#05054A", fill: "#00007E" };

describe("Ávila divider", () => {
  it("is hidden from screen readers", () => {
    // Arrange
    const props = colors;

    // Act
    const { container } = render(<AvilaDivider {...props} />);

    // Assert
    expect(container.firstElementChild?.getAttribute("aria-hidden")).toBe("true");
  });

  it("leaves the sky open so whatever sits behind it, like the cranes, shows between the peaks", () => {
    // Arrange
    const props = colors;

    // Act
    const { container } = render(<AvilaDivider {...props} />);

    // Assert
    expect((container.firstElementChild as HTMLElement).style.background).toBe("");
  });

  it("draws every mountain solid, so nothing behind shows through them", () => {
    // Arrange
    const props = colors;

    // Act
    const { container } = render(<AvilaDivider {...props} />);

    // Assert
    const shapes = [...container.querySelectorAll("polygon, rect")];
    expect(shapes.every((shape) => !shape.hasAttribute("opacity"))).toBe(true);
  });

  it("paints the front mountains in the next section's color and the back ones faded toward the previous one", () => {
    // Arrange
    const props = colors;

    // Act
    const { container } = render(<AvilaDivider {...props} />);

    // Assert
    const fills = new Set([...container.querySelectorAll("polygon, rect")].map((shape) => shape.getAttribute("fill")));
    expect(fills).toEqual(new Set([colors.fill, `color-mix(in srgb, ${colors.fill} 45%, ${colors.topBg})`]));
  });
});
