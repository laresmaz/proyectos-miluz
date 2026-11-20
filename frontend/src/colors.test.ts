// Guards the palette: every color lives in index.css, so components can only use its tokens.
import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const SOURCE_DIRS = ["src", "storybook"];
const RAW_COLOR = /#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/i;

describe("Colors", () => {
  it("come only from the tokens in index.css", () => {
    // Arrange
    const files = SOURCE_DIRS.flatMap((dir) =>
      readdirSync(dir, { recursive: true, encoding: "utf8" })
        .filter((name) => /\.tsx?$/.test(name) && !name.includes(".test."))
        .map((name) => `${dir}/${name}`),
    );

    // Act
    const offenders = files.filter((file) =>
      RAW_COLOR.test(readFileSync(file, "utf8")),
    );

    // Assert
    expect(offenders).toEqual([]);
  });
});
