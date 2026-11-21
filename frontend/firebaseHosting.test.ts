// Tests for firebase.json: only the site's own addresses load the app, and every response carries the security headers.
import { describe, expect, it } from "vitest";
import firebase from "./firebase.json";
import { routes } from "./src/routes";

// Turns the router's paths into the globs Firebase matches, leaving out "/" (index.html itself) and the catch-all.
function routeGlobs(): string[] {
  return (routes[0].children ?? [])
    .map(({ path }) => path ?? "")
    .filter((path) => path !== "/" && path !== "*")
    .map((path) => path.replace(/:\w+/g, "*"));
}

describe("Firebase Hosting config", () => {
  it("rewrites only the site's routes to the app, so unknown addresses get a real 404", () => {
    // Arrange
    const expected = routeGlobs().sort();

    // Act
    const sources = firebase.hosting.rewrites.map(({ source }) => source);

    // Assert
    expect(sources.sort()).toEqual(expected);
  });

  it("sends the security headers with every response", () => {
    // Arrange
    const everything = firebase.hosting.headers.find(
      (rule) => "source" in rule && rule.source === "**",
    );

    // Act
    const names = everything?.headers.map(({ key }) => key) ?? [];

    // Assert
    expect(names).toEqual(
      expect.arrayContaining([
        "X-Content-Type-Options",
        "Referrer-Policy",
        "Content-Security-Policy",
      ]),
    );
  });
});
