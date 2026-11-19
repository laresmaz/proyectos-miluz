import { useTranslation } from "react-i18next";
import { Link, useMatches } from "react-router";
import logo from "../../assets/logo.svg";
import { BUSINESS } from "../../config";
import AvilaDivider from "../AvilaDivider";
import { NAV_LINKS } from "./navLinks";

// The route tell the footer the background of its last section, so the mountains rise out of it.
export type SiteRouteHandle = { lastSection?: string };

// Renders the footer
export default function SiteFooter() {
  const { t } = useTranslation("site");
  const lastMatch = useMatches().at(-1);
  const sky =
    (lastMatch?.handle as SiteRouteHandle | undefined)?.lastSection ??
    "var(--color-white)";

  return (
    <footer>
      <div style={{ background: sky }}>
        <AvilaDivider topBg={sky} fill="var(--color-brand-deep)" />
      </div>
      <div className="bg-brand-deep px-6 py-12 text-white">
        <div className="mx-auto flex max-w-300 flex-wrap justify-between gap-8">
          <div className="flex flex-[1_1_260px] flex-col gap-3">
            <div className="flex items-center gap-3">
              <img src={logo} alt="" width={40} height={40} />
              <span className="font-display text-[22px] font-bold uppercase">
                {BUSINESS.name}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[#B8BCE0]">
              {t("footer.tagline")}
            </p>
          </div>
          <div className="flex flex-[1_1_180px] flex-col gap-2 text-[15px]">
            <p className="mb-1 text-[13px] font-bold tracking-[0.08em] text-crane uppercase">
              {t("footer.contact")}
            </p>
            {BUSINESS.whatsappEnabled && (
              <span>{t("footer.whatsapp", { number: BUSINESS.whatsapp })}</span>
            )}
            <span>{BUSINESS.city}</span>
          </div>
          <div className="flex flex-[1_1_180px] flex-col items-start gap-2 text-[15px]">
            <p className="mb-1 text-[13px] font-bold tracking-[0.08em] text-crane uppercase">
              {t("footer.links")}
            </p>
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="rounded hover:text-crane focus-visible:outline-2 focus-visible:outline-crane"
              >
                {t(label)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
