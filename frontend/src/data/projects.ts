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
  year?: number;
  isPublished: boolean;
  images: ProjectImage[];
};

// Builds a project's before/after pair under its planned file names; BrandPhoto shows the placeholder until photos.sh writes them.
const plannedPhotos = (slug: string, title: string) =>
  (["antes", "despues"] as const).map((kind) => ({
    id: `${slug}-${kind}`,
    url: `/photos/${slug}-${kind}.webp`,
    altText: `${title}, ${kind === "antes" ? "antes" : "después"}`,
    kind,
  }));

// Real works from the engineer's CV, in Spanish only like the data model; years are left out until he confirms them.
export const PROJECTS: Project[] = [
  {
    slug: "refuerzo-clinica-lara",
    title: "Refuerzo estructural de la Clínica Lara",
    serviceType: "concreto-armado",
    location: "Cabudare, Lara",
    isPublished: true,
    images: plannedPhotos(
      "refuerzo-clinica-lara",
      "Refuerzo estructural de la Clínica Lara",
    ),
  },
  {
    slug: "edificio-altamar",
    title: "Edificio Altamar",
    serviceType: "obras-civiles",
    location: "Puerto La Cruz, Anzoátegui",
    isPublished: true,
    images: plannedPhotos("edificio-altamar", "Edificio Altamar"),
  },
  {
    slug: "oficinas-digitel-cubo-negro",
    title: "Oficinas de Digitel en el Cubo Negro",
    serviceType: "obras-civiles",
    location: "Caracas",
    isPublished: true,
    images: plannedPhotos(
      "oficinas-digitel-cubo-negro",
      "Oficinas de Digitel en el Cubo Negro",
    ),
  },
];
