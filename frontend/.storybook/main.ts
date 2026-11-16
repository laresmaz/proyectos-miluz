// Storybook config: finds the stories in frontend/storybook and builds them with the app's Vite setup.
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../storybook/**/*.stories.tsx"],
  framework: "@storybook/react-vite",
};

export default config;
