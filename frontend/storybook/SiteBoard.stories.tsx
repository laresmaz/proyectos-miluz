// Regression board for the new site: each story opens one URL, shot by Chromatic at phone and desktop width.
import type { Meta, StoryObj } from "@storybook/react-vite";
import { I18nextProvider } from "react-i18next";
import { createMemoryRouter, RouterProvider } from "react-router";
import { createI18n } from "../src/i18n";
import { routes } from "../src/routes";

const meta = {
  title: "Regression board/Site",
  parameters: {
    layout: "fullscreen",
    chromatic: {
      disableSnapshot: false,
      viewports: [375, 1440],
    },
  },
  // Always Spanish, so snapshots don't depend on the language of the browser taking them.
  render: ({ path }) => {
    const i18n = createI18n();
    i18n.changeLanguage("es");
    return (
      <I18nextProvider i18n={i18n}>
        <RouterProvider
          router={createMemoryRouter(routes, { initialEntries: [path] })}
        />
      </I18nextProvider>
    );
  },
} satisfies Meta<{ path: string }>;

export default meta;
type Story = StoryObj<typeof meta>;

// The seven services in the zigzag, with the nav and footer.
export const Services: Story = { args: { path: "/servicios" } };

// One full service page.
export const ServicePage: Story = { args: { path: "/servicios/plomeria" } };

// The portfolio with the three example projects.
export const Portfolio: Story = { args: { path: "/proyectos" } };

// The engineer's introduction with his photo on the fallback.
export const About: Story = { args: { path: "/sobre-mi" } };
