// Storybook preview: loads the site's CSS so stories get Tailwind, the brand colors and the fonts.
import type { Preview } from "@storybook/react-vite";
import "../src/fonts";
import "../src/index.css";

const preview: Preview = {
  // Chromatic only snapshots the regression board, which turns this back on; every snapshot counts toward the plan's limit.
  parameters: { chromatic: { disableSnapshot: true } },
};

export default preview;
