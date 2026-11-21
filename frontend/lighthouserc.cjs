// Lighthouse CI budgets
// Visitors are mostly on slow mobile data in Venezuela
const BASE = process.env.LIGHTHOUSE_URL ?? "http://localhost/";

module.exports = {
  ci: {
    collect: {
      // CD sets LIGHTHOUSE_URL to audit the live site; otherwise CI serves the local build (lhci swaps in its own port).
      url: [BASE, `${BASE}?preview`],
      ...(process.env.LIGHTHOUSE_URL ? {} : { staticDistDir: "./dist" }),
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.95 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "categories:accessibility": ["error", { minScore: 1 }],
        // TODO: tighten to 2.5 s and 200 KiB once the site is optimised (the teaser at / already meets both).
        "largest-contentful-paint": ["error", { maxNumericValue: 2700 }],
        "total-byte-weight": ["error", { maxNumericValue: 500 * 1024 }],
      },
    },
  },
};
