// A full-width band with its background and drifting cranes, optionally ending in the Ávila divider with a sunrise behind it
import type { ComponentProps } from "react";
import AvilaDivider from "./AvilaDivider";
import CraneBackdrop from "./CraneBackdrop";

type SectionProps = ComponentProps<"section"> & {
  bg: string;
  tone?: "dark" | "light";
  offset?: number;
  dividerInto?: string;
  withCranes?: boolean;
  sunrise?: boolean;
};

export default function Section({
  bg,
  tone,
  offset,
  dividerInto,
  withCranes = true,
  sunrise = false,
  className = "",
  style,
  children,
  ...rest
}: SectionProps) {
  return (
    <section
      {...rest}
      className={`relative isolate overflow-hidden ${className}`}
      style={{ background: bg, ...style }}
    >
      {sunrise && (
        // Behind the cranes (z -1); the mountains' solid back layer hides it, so it only glows above the peaks.
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[-2] h-1/2 bg-linear-to-t from-sunrise/45 to-transparent"
        />
      )}
      {withCranes && <CraneBackdrop tone={tone} offset={offset} />}
      {children}
      {dividerInto && <AvilaDivider topBg={bg} fill={dividerInto} />}
    </section>
  );
}
