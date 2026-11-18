// Example projects for the tests
import fallback from "./assets/fallback-photo.svg";
import type { Project } from "./projects";

// Builds a before/after photo pair for an example project.
const photos = (slug: string) => [
  {
    id: `${slug}-antes`,
    url: fallback,
    altText: `${slug} antes`,
    kind: "antes" as const,
  },
  {
    id: `${slug}-despues`,
    url: fallback,
    altText: `${slug} después`,
    kind: "despues" as const,
  },
];

export const SAMPLE_PROJECTS: Project[] = [
  {
    slug: "bano-los-palos-grandes",
    title: "Baño completo en Los Palos Grandes",
    serviceType: "plomeria",
    location: "Caracas",
    year: 2025,
    isPublished: true,
    images: photos("bano-los-palos-grandes"),
  },
  {
    slug: "oficina-chacao",
    title: "Divisiones de oficina en Chacao",
    serviceType: "drywall",
    location: "Caracas",
    year: 2024,
    isPublished: true,
    images: photos("oficina-chacao"),
  },
  {
    slug: "tanque-borrador",
    title: "Tanque elevado (borrador)",
    serviceType: "muros-y-tanques",
    location: "Caracas",
    year: 2025,
    isPublished: false,
    images: photos("tanque-borrador"),
  },
];
