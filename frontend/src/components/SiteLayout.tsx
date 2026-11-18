// Site layout: the nav, the current page and the footer, shared by every page of the site.
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, Outlet, ScrollRestoration } from "react-router";
import logo from "../assets/logo.svg";
import { BUSINESS } from "../config";
import AvilaDivider from "./AvilaDivider";
import LanguageSwitch from "./LanguageSwitch";
import Text from "./Text";

// Read once at load: a static page only needs the year it was opened in.
const YEAR = new Date().getFullYear();

// Nav entries in the order DISENO.md lists them; Contacto waits for the WhatsApp number.
const NAV_LINKS = [
  { to: "/servicios", label: "nav.services" },
  { to: "/proyectos", label: "nav.projects" },
  { to: "/sobre-mi", label: "nav.about" },
] as const;

// Renders the nav, the page for the current URL and the footer.
export default function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-ink">
      <SiteNav />
      <main className="flex-auto">
        <Outlet />
      </main>
      <SiteFooter />
      <ScrollRestoration />
    </div>
  );
}

// Logo home link and page links; below lg the links fold into a menu button.
function SiteNav() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-brand-deep text-white">
      <nav
        aria-label={t("nav.label")}
        className="mx-auto flex max-w-300 flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-3"
      >
        <Link
          to="/"
          className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crane"
        >
          <img src={logo} alt={BUSINESS.name} width={48} height={48} />
        </Link>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen(!open)}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 font-semibold hover:text-crane focus-visible:outline-2 focus-visible:outline-crane lg:hidden"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
          {t("nav.menu")}
        </button>
        <ul
          id="site-menu"
          className={`${open ? "flex" : "hidden"} w-full flex-col gap-1 pb-2 lg:flex lg:w-auto lg:flex-row lg:items-center lg:gap-2 lg:pb-0`}
        >
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex min-h-11 items-center rounded-lg px-3 font-semibold hover:text-crane focus-visible:outline-2 focus-visible:outline-crane ${isActive ? "text-crane" : ""}`
                }
              >
                {t(label)}
              </NavLink>
            </li>
          ))}
          <li>
            <LanguageSwitch />
          </li>
        </ul>
      </nav>
    </header>
  );
}

// Ávila divider into the brand-blue footer with the copyright line.
function SiteFooter() {
  const { t } = useTranslation();

  return (
    <footer>
      <AvilaDivider topBg="var(--color-white)" fill="var(--color-brand)" />
      <div className="bg-brand px-6 pt-5 pb-7 text-white">
        <div className="mx-auto max-w-300">
          <Text variant="small">
            {t("footer.copyright", {
              year: YEAR,
              name: BUSINESS.name,
              city: BUSINESS.city,
            })}
          </Text>
        </div>
      </div>
    </footer>
  );
}
