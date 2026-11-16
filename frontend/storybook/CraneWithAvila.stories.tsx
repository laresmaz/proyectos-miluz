// Story for the cranes and the Ávila divider together, stacked as on the teaser: deep-blue section, mountains, brand-blue footer.
import type { Meta, StoryObj } from "@storybook/react-vite";
import AvilaDivider from "../src/components/AvilaDivider";
import CraneBackdrop from "../src/components/CraneBackdrop";

const meta = {
  title: "Decoration/CraneWithAvila",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// The cranes stand on the divider's bottom edge and drift behind the mountains, which rise into the footer color.
export const OnTeaser: Story = {
  render: () => (
    <div className="flex h-screen flex-col">
      <section className="relative isolate flex flex-auto flex-col justify-end overflow-hidden bg-brand-deep">
        <CraneBackdrop />
        <AvilaDivider topBg="var(--color-brand-deep)" fill="var(--color-brand)" />
      </section>
      <div className="h-16 bg-brand" />
    </div>
  ),
};
