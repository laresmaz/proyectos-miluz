// Lighthouse CI budgets
// Visitors are mostly on slow mobile data in Venezuela
module.exports = {
  ci: {
    collect: {
      // CD sets LIGHTHOUSE_URL to audit the live site; otherwise CI serves the local build.
      ...(process.env.LIGHTHOUSE_URL
        ? { url: [process.env.LIGHTHOUSE_URL] }
        : { staticDistDir: "./dist" }),
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.95 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "categories:accessibility": ["error", { minScore: 1 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "total-byte-weight": ["error", { maxNumericValue: 200 * 1024 }],
      },
    },
  },
};
