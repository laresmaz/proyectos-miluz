// The home page's sections, shared by the header and the footer; each section's "Ver más" link leads to its full page.
import type { MouseEvent } from "react";
import { useLocation } from "react-router";

export const NAV_LINKS = [
  { to: "/#servicios", label: "nav.services" },
  { to: "/#proyectos", label: "nav.projects" },
  { to: "/#sobre-mi", label: "nav.about" },
] as const;

// Returns a click handler that, on the home page, glides to the link's section instead of jumping; elsewhere the link navigates as usual.
export function useGlideToSection() {
  const { pathname } = useLocation();
  return (event: MouseEvent, to: string) => {
    const section = document.getElementById(to.slice(2));
    const newTab =
      event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0;
    if (pathname !== "/" || !section || newTab) return;
    event.preventDefault();
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    section.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    // Keeps the address shareable without a router navigation, whose own scroll would cut the glide short.
    window.history.replaceState(window.history.state, "", to);
  };
}
