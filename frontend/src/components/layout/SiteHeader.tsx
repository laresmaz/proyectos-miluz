// Site header
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink } from "react-router";
import logo from "../../assets/logo.svg";
import { BUSINESS } from "../../data/config";
import LanguageSwitch from "./LanguageSwitch";
import WhatsAppIcon from "../ui/WhatsAppIcon";
import { NAV_LINKS } from "./navLinks";

export default function SiteHeader() {
  const { t } = useTranslation("site");
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-brand-mist bg-white">
      <nav
        aria-label={t("nav.label")}
        className="mx-auto flex max-w-300 flex-wrap items-center justify-between gap-x-5 gap-y-2 px-6 py-3.5"
      >
        <Link
          to="/"
          className="flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <img src={logo} alt="" width={48} height={48} />
          <span className="font-display text-2xl leading-none font-bold text-brand uppercase">
            {BUSINESS.name}
          </span>
        </Link>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen(!open)}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 font-semibold hover:text-brand-medium focus-visible:outline-2 focus-visible:outline-brand lg:hidden"
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
          className={`${open ? "flex" : "hidden"} w-full flex-col gap-1 pb-2 lg:flex lg:w-auto lg:flex-row lg:items-center lg:gap-5 lg:pb-0`}
        >
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex min-h-11 items-center rounded px-1 text-[15px] font-semibold hover:text-brand-medium focus-visible:outline-2 focus-visible:outline-brand ${isActive ? "text-brand" : "text-ink"}`
                }
              >
                {t(label)}
              </NavLink>
            </li>
          ))}
          <li>
            <LanguageSwitch onLight />
          </li>
          {BUSINESS.whatsappEnabled && (
            <li>
              <a
                href={`https://wa.me/${BUSINESS.whatsapp}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand px-4.5 text-[15px] font-bold text-white hover:bg-brand-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <WhatsAppIcon />
                {t("nav.whatsapp")}
              </a>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
