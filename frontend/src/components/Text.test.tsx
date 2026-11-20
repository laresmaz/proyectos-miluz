// Tests for the Text component: each style picks a sensible HTML element, which can be overridden.
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import Text from "./Text";

afterEach(cleanup);

describe("Text", () => {
  it("renders the display style as the page's main heading", () => {
    // Arrange
    const content = "Algo bueno";

    // Act
    render(<Text variant="display">{content}</Text>);

    // Assert
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(content);
  });

  it.each([
    ["pageTitle", 1],
    ["heroTitle", 1],
    ["sectionTitle", 2],
    ["blockTitle", 2],
    ["cardTitle", 3],
  ] as const)(
    "renders the %s style as a level %i heading by default",
    (variant, level) => {
      // Arrange
      const content = "Obras civiles";

      // Act
      render(<Text variant={variant}>{content}</Text>);

      // Assert
      expect(screen.getByRole("heading", { level }).textContent).toBe(content);
    },
  );

  it("keeps the style but changes the element when asked", () => {
    // Arrange
    const content = "Plomería";

    // Act
    render(
      <ul>
        <Text variant="small" as="li">
          {content}
        </Text>
      </ul>,
    );

    // Assert
    const item = screen.getByRole("listitem");
    expect(item.textContent).toBe(content);
    expect(item.className).toContain("text-sm");
  });

  it("adds extra classes such as a color on top of the style", () => {
    // Arrange
    const color = "text-crane";

    // Act
    render(
      <Text variant="eyebrow" className={color}>
        Ingeniería civil
      </Text>,
    );

    // Assert
    const className = screen.getByText("Ingeniería civil").className;
    expect(className).toContain("uppercase");
    expect(className).toContain(color);
  });
});
