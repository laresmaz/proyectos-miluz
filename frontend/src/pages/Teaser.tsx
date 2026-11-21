// Teaser page: one screen with the logo, the "under construction" headline and the WhatsApp contact.
import { useTranslation } from "react-i18next";
import logo from "../assets/logo.svg";
import AvilaDivider from "../components/ui/AvilaDivider";
import CraneBackdrop from "../components/ui/CraneBackdrop";
import SunriseGlow from "../components/ui/SunriseGlow";
import LanguageSwitch from "../components/layout/LanguageSwitch";
import Text from "../components/Text";
import WhatsAppButton from "../components/ui/WhatsAppButton";
import { BUSINESS, readableWhatsapp } from "../data/config";
import { SERVICES } from "../data/services";
import { usePageMeta } from "../lib/usePageMeta";

// Read once at load: a static page only needs the year it was opened in.
const YEAR = new Date().getFullYear();

// Renders the full teaser; values follow the design mockup in .claude/local.
export default function Teaser() {
  const { t } = useTranslation();

  // Page title change usinng the languageSwitch
  usePageMeta(
    t("teaser.metaTitle", { name: BUSINESS.name, city: BUSINESS.city }),
    t("teaser.metaDescription"),
  );

  return (
    <div className="flex min-h-screen flex-col bg-brand-deep font-sans text-white">
      {/* Cranes share this area with the divider so they stand on its bottom edge, behind the mountains. */}
      <div className="relative isolate flex flex-auto flex-col overflow-hidden">
        <SunriseGlow />
        <CraneBackdrop />
        <main className="relative flex flex-auto items-center justify-center px-6 pt-18 pb-10">
          <LanguageSwitch className="absolute top-4 right-4" />
          <div className="flex max-w-205 flex-col items-center gap-7 text-center">
            <img src={logo} alt={BUSINESS.name} width={112} height={112} />
            <Text variant="eyebrow" className="text-crane">
              {t("teaser.eyebrow", { name: BUSINESS.name })}
            </Text>
            <Text variant="display">
              {t("teaser.headline")}
              <br />
              <span className="text-crane">{t("teaser.headlineAccent")}</span>
            </Text>
            <Text variant="lead" className="max-w-140 text-haze">
              {t("teaser.intro", { years: BUSINESS.years })}
            </Text>
            <WhatsAppButton large>{t("teaser.whatsapp")}</WhatsAppButton>
            <ul
              aria-label={t("teaser.servicesLabel")}
              className="mt-2 flex flex-wrap justify-center gap-2.5"
            >
              {SERVICES.map(({ slug }) => (
                <Text
                  key={slug}
                  variant="small"
                  as="li"
                  className="rounded-full border border-white/28 px-3.5 py-2"
                >
                  {t(`teaser.services.${slug}`)}
                </Text>
              ))}
            </ul>
          </div>
        </main>
        <AvilaDivider
          topBg="var(--color-brand-deep)"
          fill="var(--color-brand)"
        />
      </div>
      <footer className="bg-brand px-6 pt-5 pb-7">
        <div className="mx-auto flex max-w-300 flex-wrap items-center justify-between gap-3">
          <Text variant="small">
            {t("teaser.footer", {
              year: YEAR,
              name: BUSINESS.name,
              city: BUSINESS.city,
            })}
          </Text>
          <Text variant="small">
            {t("teaser.footerWhatsapp", {
              number: readableWhatsapp(BUSINESS.whatsapp),
            })}
          </Text>
        </div>
      </footer>
    </div>
  );
}
