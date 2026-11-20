// Stories for the Ávila divider: try the mountain shapes against the section colors they will sit between.
import type { Meta, StoryObj } from "@storybook/react-vite";
import AvilaDivider from "../src/components/ui/AvilaDivider";

const meta = {
  title: "Decoration/AvilaDivider",
  component: AvilaDivider,
  parameters: { layout: "fullscreen" },
  argTypes: { topBg: { control: "color" }, fill: { control: "color" } },
  // The divider's sky is transparent, so paint the upper section behind it as a page would.
  decorators: [
    (Story, { args }) => (
      <div style={{ background: args.topBg }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AvilaDivider>;

export default meta;
type Story = StoryObj<typeof meta>;

// The teaser: deep-blue page above, brand-blue footer below.
export const DeepToBrand: Story = {
  args: { topBg: "var(--color-brand-deep)", fill: "var(--color-brand)" },
};

// The full site's alternating sections: white above, Azul niebla below.
export const WhiteToMist: Story = {
  args: { topBg: "var(--color-white)", fill: "var(--color-brand-mist)" },
};
