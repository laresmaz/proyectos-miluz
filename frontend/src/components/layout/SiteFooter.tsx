import { useTranslation } from "react-i18next";
import { Link, useMatches } from "react-router";
import logo from "../../assets/logo.svg";
import { BUSINESS } from "../../config";
import AvilaDivider from "../ui/AvilaDivider";
import { NAV_LINKS } from "./navLinks";
import Text from "../Text";

// A page whose last section has cranes draws the footer's mountains inside it, so the cranes walk behind them; the footer then skips its own.
export type SiteRouteHandle = { endsWithDivider?: boolean };

// Renders the footer
export default function SiteFooter() {
  const { t } = useTranslation("site");
  const handle = useMatches().at(-1)?.handle as SiteRouteHandle | undefined;

  return (
    // The footer takes any spare height on short pages, so the deep blue runs straight on from the mountains above.
    <footer className="flex flex-auto flex-col">
      {!handle?.endsWithDivider && (
        <AvilaDivider
          topBg="var(--color-white)"
          fill="var(--color-brand-deep)"
        />
      )}
      <div className="flex-auto bg-brand-deep px-6 py-12 text-white">
        <div className="mx-auto flex max-w-300 flex-wrap justify-between gap-8">
          <div className="flex flex-[1_1_260px] flex-col gap-3">
            <div className="flex items-center gap-3">
              <img src={logo} alt="" width={40} height={40} />
              <span className="font-display text-[22px] font-bold uppercase">
                {BUSINESS.name}
              </span>
            </div>
            <Text
              variant="small"
              as="p"
              className="leading-relaxed text-haze-dim"
            >
              {t("footer.tagline")}
            </Text>
          </div>
          <div className="flex flex-[1_1_180px] flex-col gap-2 text-[15px]">
            <Text variant="label" className="mb-1 text-crane">
              {t("footer.contact")}
            </Text>
            {BUSINESS.whatsappEnabled && (
              <span>{t("footer.whatsapp", { number: BUSINESS.whatsapp })}</span>
            )}
            <span>{BUSINESS.city}</span>
          </div>
          <div className="flex flex-[1_1_180px] flex-col items-start gap-2 text-[15px]">
            <Text variant="label" className="mb-1 text-crane">
              {t("footer.links")}
            </Text>
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
