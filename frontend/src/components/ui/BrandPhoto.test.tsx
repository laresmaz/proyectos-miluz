// Tests for the brand photo: a skeleton while the photo loads, and the fallback image when it fails.
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import fallback from "../../assets/fallback-photo.svg";
import BrandPhoto from "./BrandPhoto";

afterEach(cleanup);

// Reads whether the photo's frame is still showing the loading skeleton.
const showsSkeleton = () =>
  screen.getByRole("img").parentElement?.getAttribute("aria-busy") === "true";

describe("brand photo", () => {
  it("shows a skeleton until the photo has loaded", () => {
    // Arrange
    render(<BrandPhoto src="/obra.webp" alt="Obra" />);
    const before = showsSkeleton();

    // Act
    fireEvent.load(screen.getByRole("img"));

    // Assert
    expect(before).toBe(true);
    expect(showsSkeleton()).toBe(false);
  });

  it("swaps in the fallback image when the photo fails to load", () => {
    // Arrange
    render(<BrandPhoto src="/missing.webp" alt="Obra" />);

    // Act
    fireEvent.error(screen.getByRole("img"));

    // Assert
    expect(screen.getByRole("img").getAttribute("src")).toBe(fallback);
  });

  it("offers three widths of a WebP photo, so phones download the small one", () => {
    // Arrange
    const src = "/photos/obra.webp";

    // Act
    render(<BrandPhoto src={src} alt="Obra" />);

    // Assert
    const img = screen.getByRole("img");
    expect(img.getAttribute("srcset")).toBe(
      "/photos/obra-480.webp 480w, /photos/obra-960.webp 960w, /photos/obra-1600.webp 1600w",
    );
    expect(img.getAttribute("src")).toBe("/photos/obra-960.webp");
    expect(img.getAttribute("sizes")).toBeTruthy();
  });

  it("drops the widths when it falls back, so the browser doesn't retry them", () => {
    // Arrange
    render(<BrandPhoto src="/missing.webp" alt="Obra" />);

    // Act
    fireEvent.error(screen.getByRole("img"));

    // Assert
    expect(screen.getByRole("img").getAttribute("srcset")).toBeNull();
  });

  it("shows other images, such as the placeholder, as they are", () => {
    // Arrange
    const src = fallback;

    // Act
    render(<BrandPhoto src={src} alt="Obra" />);

    // Assert
    const img = screen.getByRole("img");
    expect(img.getAttribute("src")).toBe(src);
    expect(img.getAttribute("srcset")).toBeNull();
  });

  it("stops at the fallback if that fails too, instead of retrying forever", () => {
    // Arrange
    render(<BrandPhoto src="/missing.webp" alt="Obra" />);
    fireEvent.error(screen.getByRole("img"));

    // Act
    fireEvent.error(screen.getByRole("img"));

    // Assert
    expect(screen.getByRole("img").getAttribute("src")).toBe(fallback);
    expect(showsSkeleton()).toBe(false);
  });

  it("starts over with a skeleton when it's given a new photo, as when moving between service pages", () => {
    // Arrange
    const { rerender } = render(<BrandPhoto src="/missing.webp" alt="Obra" />);
    fireEvent.error(screen.getByRole("img"));

    // Act
    rerender(<BrandPhoto src="/drywall.webp" alt="Drywall" />);

    // Assert
    expect(screen.getByRole("img").getAttribute("src")).toBe(
      "/drywall-960.webp",
    );
    expect(showsSkeleton()).toBe(true);
  });

  // No high fetch priority: on phones the hero photo sits below the heading and would steal bandwidth from it.
  it.each([
    { eager: true, loading: "eager" },
    { eager: false, loading: "lazy" },
  ])(
    "loads the photo $loading when eager is $eager, without jumping the download queue",
    ({ eager, loading }) => {
      // Arrange
      const props = { src: "/obra.webp", alt: "Obra", eager };

      // Act
      render(<BrandPhoto {...props} />);

      // Assert
      const img = screen.getByRole("img");
      expect(img.getAttribute("loading")).toBe(loading);
      expect(img.getAttribute("fetchpriority")).toBeNull();
    },
  );
});
