// The home page's sections, shared by the header and the footer; each section's "Ver más" link leads to its full page.

export const NAV_LINKS = [
  { to: "/#servicios", label: "nav.services" },
  { to: "/#proyectos", label: "nav.projects" },
  { to: "/#sobre-mi", label: "nav.about" },
] as const;
