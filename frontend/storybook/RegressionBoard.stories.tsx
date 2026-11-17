// Regression board: the only stories Chromatic snapshots
// Each page is shot at phone and desktop width; CraneBackdrop freezes its cranes when it runs in Chromatic.
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";
import { I18nextProvider } from "react-i18next";
import { createI18n } from "../src/i18n";
import Teaser from "../src/pages/Teaser";

const meta = {
  title: "Regression board/Teaser",
  component: Teaser,
  parameters: {
    layout: "fullscreen",
    chromatic: {
      disableSnapshot: false,
      viewports: [375, 1440],
    },
  },
  // Always Spanish, so snapshots don't depend on the language of the browser taking them.
  decorators: [
    (Story) => {
      const i18n = createI18n();
      i18n.changeLanguage("es");
      return (
        <I18nextProvider i18n={i18n}>
          <Story />
        </I18nextProvider>
      );
    },
  ],
} satisfies Meta<typeof Teaser>;

export default meta;
type Story = StoryObj<typeof meta>;

// Everything downloaded: brand fonts, logo and cranes.
export const FullyLoaded: Story = {};

// The first paint on slow mobile data: the brand fonts haven't arrived, so the resized fallback fonts show.
// Compare it with FullyLoaded: the closer they match, the less the text jumps when the fonts land.
export const WorstFirstRender: Story = {
  decorators: [
    (Story) => (
      <div
        style={
          {
            "--font-sans": '"Inter fallback", system-ui, sans-serif',
            "--font-display": '"Barlow Condensed fallback", sans-serif',
          } as CSSProperties
        }
      >
        <Story />
      </div>
    ),
  ],
};
