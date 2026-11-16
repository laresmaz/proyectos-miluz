// Lighthouse CI budgets
// Visitors are mostly on slow mobile data in Venezuela
module.exports = {
  ci: {
    collect: {
      staticDistDir: "./dist",
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        // TODO: improve the performance score (mostly JavaScript blocking time) and raise this floor.
        "categories:performance": ["error", { minScore: 0.7 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "categories:accessibility": ["error", { minScore: 1 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "total-byte-weight": ["error", { maxNumericValue: 200 * 1024 }],
      },
    },
  },
};
