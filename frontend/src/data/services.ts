// The services in display order
import { useTranslation } from "react-i18next";
import fallback from "../assets/fallback-photo.svg";
import type { ZigzagItem } from "../components/sections/Zigzag";

// TODO add real photos
export const SERVICES = [
  { slug: "obras-civiles", image: fallback },
  { slug: "plomeria", image: fallback },
  { slug: "electricidad", image: fallback },
  { slug: "albanileria", image: fallback },
  { slug: "drywall", image: fallback },
  { slug: "concreto-armado", image: fallback },
  { slug: "muros-y-tanques", image: fallback },
  { slug: "mantenimiento-integral", image: fallback },
] as const;

// The services as zigzag bands in the visitor's language, shared by the home and services pages.
export function useServiceItems(): ZigzagItem[] {
  const { t } = useTranslation("site");
  return SERVICES.map(({ slug, image }, i) => ({
    id: slug,
    label: t("services.label", { number: String(i + 1).padStart(2, "0") }),
    title: t(`services.items.${slug}.title`),
    text: t(`services.items.${slug}.summary`),
    includes: t(`services.items.${slug}.includes`, {
      returnObjects: true,
    }) as string[],
    image,
    alt: t(`services.items.${slug}.alt`),
    href: `/servicios/${slug}`,
    whatsapp: t(`services.items.${slug}.whatsapp`),
  }));
}
