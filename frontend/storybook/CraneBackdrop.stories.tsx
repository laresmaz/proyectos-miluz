// Stories for the crane backdrop: watch the cranes drift inside a section, or look at one still crane up close.
import type { Meta, StoryObj } from "@storybook/react-vite";
import crane from "../src/assets/crane.svg";
import CraneBackdrop from "../src/components/ui/CraneBackdrop";

const meta = {
  title: "Decoration/CraneBackdrop",
  component: CraneBackdrop,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof CraneBackdrop>;

export default meta;
type Story = StoryObj<typeof meta>;

// The cranes in a deep-blue section the size of a screen, as on the teaser.
export const InSection: Story = {
  render: () => (
    <section className="relative isolate h-screen overflow-hidden bg-brand-deep">
      <CraneBackdrop />
    </section>
  ),
};

// One still crane at full opacity and large, to check the drawing in crane.svg while editing it.
export const StaticCrane: Story = {
  render: () => (
    <div className="flex h-screen items-center justify-center bg-brand-deep p-8">
      <img src={crane} alt="" className="max-h-full w-auto" />
    </div>
  ),
};
