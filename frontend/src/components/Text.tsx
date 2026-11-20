// Text component: the site's type styles from DISENO.md in one place, so every page sizes text the same way.
import type { ElementType, HTMLAttributes } from "react";

// Font and size kept apart so size can change per screen width; color stays with the caller because it depends on the background.
const VARIANTS = {
  display: {
    tag: "h1",
    font: "font-display font-bold uppercase",
    size: "text-[clamp(56px,9vw,128px)] leading-[0.92]",
  },
  heroTitle: {
    tag: "h1",
    font: "font-display font-bold uppercase",
    size: "text-[clamp(44px,6vw,76px)] leading-[0.98]",
  },
  pageTitle: {
    tag: "h1",
    font: "font-display font-bold uppercase",
    size: "text-5xl",
  },
  sectionTitle: {
    tag: "h2",
    font: "font-display font-bold uppercase",
    size: "text-[clamp(34px,4vw,52px)] leading-[1.02]",
  },
  blockTitle: {
    tag: "h2",
    font: "font-display font-bold uppercase",
    size: "text-[44px] leading-[1.05]",
  },
  cardTitle: {
    tag: "h3",
    font: "font-display font-bold uppercase",
    size: "text-[26px]",
  },
  eyebrow: {
    tag: "p",
    font: "font-bold tracking-[0.1em] uppercase",
    size: "text-sm",
  },
  label: {
    tag: "p",
    font: "font-bold tracking-[0.08em] uppercase",
    size: "text-[13px]",
  },
  lead: { tag: "p", font: "", size: "text-xl leading-[1.55]" },
  bodyLarge: { tag: "p", font: "", size: "text-lg leading-[1.6]" },
  body: { tag: "p", font: "", size: "leading-[1.6]" },
  small: { tag: "span", font: "", size: "text-sm" },
} satisfies Record<string, { tag: ElementType; font: string; size: string }>;

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
  const { tag, font, size } = VARIANTS[variant];
  const Tag = as ?? tag;
  return <Tag className={`${font} ${size} ${className}`} {...rest} />;
}
