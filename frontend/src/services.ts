// The seven services in display order
import fallback from "./assets/fallback-photo.svg";

// TODO add real photos
export const SERVICES = [
  { slug: "obras-civiles", image: fallback },
  { slug: "plomeria", image: fallback },
  { slug: "electricidad", image: fallback },
  { slug: "albanileria", image: fallback },
  { slug: "drywall", image: fallback },
  { slug: "concreto-armado", image: fallback },
  { slug: "muros-y-tanques", image: fallback },
] as const;
