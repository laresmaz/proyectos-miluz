// Storybook preview: loads the site's CSS so stories get Tailwind, the brand colors and the fonts.
import type { Preview } from "@storybook/react-vite";
import "../src/lib/fonts";
import "../src/index.css";

const preview: Preview = {
  // Chromatic only snapshots the regression board, which turns this back on; every snapshot counts toward the plan's limit.
  // Reduced motion holds the cranes and the counting numbers still, so every snapshot catches them in the same place.
  parameters: {
    chromatic: { disableSnapshot: true, prefersReducedMotion: "reduce" },
  },
};

export default preview;
