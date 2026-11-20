import type { SERVICES } from "./services";

export type ProjectImage = {
  id: string;
  url: string;
  altText: string;
  kind: "antes" | "despues" | "general";
};

export type Project = {
  slug: string;
  title: string;
  serviceType: (typeof SERVICES)[number]["slug"];
  location: string;
  year: number;
  isPublished: boolean;
  images: ProjectImage[];
};

// Builds the before/after pair for an example; the files don't exist yet, so BrandPhoto shows its fallback until they're uploaded.
const examplePhotos = (n: number) =>
  (["antes", "despues"] as const).map((kind) => ({
    id: `ejemplo-${n}-${kind}`,
    url: `/photos/proyecto-ejemplo-${n}-${kind}.webp`,
    altText: `Proyecto de ejemplo ${n}, ${kind === "antes" ? "antes" : "después"}`,
    kind,
  }));

// shortcut: three generic examples, in Spanish only like the Firestore model; replace them with the engineer's real projects before launch.
export const PROJECTS: Project[] = [
  {
    slug: "proyecto-ejemplo-1",
    title: "Proyecto de ejemplo 1",
    serviceType: "obras-civiles",
    location: "Caracas",
    year: 2026,
    isPublished: true,
    images: examplePhotos(1),
  },
  {
    slug: "proyecto-ejemplo-2",
    title: "Proyecto de ejemplo 2",
    serviceType: "plomeria",
    location: "Caracas",
    year: 2026,
    isPublished: true,
    images: examplePhotos(2),
  },
  {
    slug: "proyecto-ejemplo-3",
    title: "Proyecto de ejemplo 3",
    serviceType: "concreto-armado",
    location: "Caracas",
    year: 2026,
    isPublished: true,
    images: examplePhotos(3),
  },
];
