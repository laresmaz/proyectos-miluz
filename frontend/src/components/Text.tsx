// Text component: the site's type styles from DISENO.md in one place, so every page sizes text the same way.
import type { ElementType, HTMLAttributes } from "react";

// Size, weight and font per style; color stays with the caller because it depends on the background.
const VARIANTS = {
  display: {
    tag: "h1",
    className:
      "font-display text-[clamp(56px,9vw,128px)] leading-[0.92] font-bold uppercase",
  },
  eyebrow: {
    tag: "p",
    className: "text-sm font-bold tracking-[0.12em] uppercase",
  },
  lead: { tag: "p", className: "text-xl leading-[1.55]" },
  small: { tag: "span", className: "text-sm" },
} satisfies Record<string, { tag: ElementType; className: string }>;

type TextProps = HTMLAttributes<HTMLElement> & {
  variant: keyof typeof VARIANTS;
  as?: ElementType;
};

// Renders children in the chosen style, on the style's usual element unless `as` says otherwise.
export default function Text({
  variant,
  as,
  className = "",
  ...rest
}: TextProps) {
  const { tag, className: style } = VARIANTS[variant];
  const Tag = as ?? tag;
  return <Tag className={`${style} ${className}`} {...rest} />;
}
