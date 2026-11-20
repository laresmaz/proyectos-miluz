// Tests for the Lighthouse summary: median numbers per run set, and the table comparing them with main.
import { describe, expect, it } from "vitest";
import {
  noticeLine,
  summarize,
  summarizePages,
  summaryTable,
} from "./lighthouseSummary.ts";

// Builds a minimal Lighthouse result with the fields the summary reads.
function lhr(
  perf: number,
  lcp: number,
  cls: number,
  bytes: number,
  url = "http://localhost:4173/",
) {
  return {
    requestedUrl: url,
    categories: { performance: { score: perf }, accessibility: { score: 1 } },
    audits: {
      "largest-contentful-paint": { numericValue: lcp },
      "cumulative-layout-shift": { numericValue: cls },
      "total-byte-weight": { numericValue: bytes },
    },
  };
}

const runs = [
  lhr(0.82, 2300, 0, 196608),
  lhr(0.85, 2100, 0, 196608),
  lhr(0.83, 2200, 0.01, 196608),
];

describe("Lighthouse summary", () => {
  it("takes the median of the runs for every metric", () => {
    // Arrange
    const results = runs;

    // Act
    const summary = summarize(results);

    // Assert
    expect(summary).toEqual({
      performance: 83,
      accessibility: 100,
      lcpMs: 2200,
      cls: 0,
      kib: 192,
    });
  });

  it("summarizes each page on its own, keyed by its path", () => {
    // Arrange
    const results = [
      ...runs,
      lhr(0.97, 2560, 0, 380000, "http://localhost:4173/?preview"),
    ];

    // Act
    const pages = summarizePages(results);

    // Assert
    expect(Object.keys(pages)).toEqual(["/", "/?preview"]);
    expect(pages["/"].performance).toBe(83);
    expect(pages["/?preview"].performance).toBe(97);
  });

  it("names the page in its table heading", () => {
    // Arrange
    const current = summarize(runs);

    // Act
    const table = summaryTable("/?preview", current, null);

    // Assert
    expect(table).toContain("### Lighthouse /?preview (median of 3 runs");
  });

  it("shows each metric with its change against main", () => {
    // Arrange
    const current = summarize(runs);
    const main = {
      performance: 85,
      accessibility: 100,
      lcpMs: 2000,
      cls: 0,
      kib: 190.5,
    };

    // Act
    const table = summaryTable("/", current, main);

    // Assert
    expect(table).toContain("| Performance | 83 | ≥ 95 | -2 |");
    expect(table).toContain(
      "| Main content (LCP) | 2.2 s | ≤ 2.6 s | +0.2 s |",
    );
    expect(table).toContain("| Download | 192 KiB | ≤ 500 KiB | +1.5 KiB |");
  });

  it("says there is nothing to compare with when main has no saved numbers yet", () => {
    // Arrange
    const current = summarize(runs);

    // Act
    const table = summaryTable("/", current, null);

    // Assert
    expect(table).toContain("| Performance | 83 | ≥ 95 | — |");
    expect(table).toContain("No numbers from main yet");
  });

  it("puts every metric in one GitHub notice line", () => {
    // Arrange
    const current = summarize(runs);

    // Act
    const line = noticeLine("/", current);

    // Assert
    expect(line).toBe(
      "::notice title=Lighthouse /::perf 83 · a11y 100 · LCP 2.2 s · CLS 0 · 192 KiB",
    );
  });

  it("shows no change for a metric that main's saved numbers don't have yet", () => {
    // Arrange
    const current = summarize(runs);
    const olderMain = {
      performance: 85,
      accessibility: 100,
      lcpMs: 2000,
      kib: 190.5,
    };

    // Act
    const table = summaryTable("/", current, olderMain as never);

    // Assert
    expect(table).toContain("| Layout shift (CLS) | 0 | ≤ 0.1 | — |");
    expect(table).not.toContain("NaN");
  });
});
