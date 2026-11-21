// A full-width band with its background and drifting cranes, optionally ending in the Ávila divider with a sunrise behind it
import type { ComponentProps } from "react";
import AvilaDivider from "./AvilaDivider";
import CraneBackdrop from "./CraneBackdrop";
import SunriseGlow from "./SunriseGlow";

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
      {sunrise && <SunriseGlow />}
      {withCranes && <CraneBackdrop tone={tone} offset={offset} />}
      {children}
      {dividerInto && <AvilaDivider topBg={bg} fill={dividerInto} />}
    </section>
  );
}
