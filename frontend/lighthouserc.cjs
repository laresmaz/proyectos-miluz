// Lighthouse CI budgets
// Visitors are mostly on slow mobile data in Venezuela
module.exports = {
  ci: {
    collect: {
      staticDistDir: "./dist",
      // Median of 3 runs, since single Lighthouse runs swing by a few points.
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.95 }],
        "categories:accessibility": ["error", { minScore: 1 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "total-byte-weight": ["error", { maxNumericValue: 200 * 1024 }],
      },
    },
  },
};
