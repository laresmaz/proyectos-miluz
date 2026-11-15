// Teaser page: one screen with the logo, the "under construction" headline and the WhatsApp contact.
import { useTranslation } from "react-i18next";
import logo from "../assets/logo.svg";
import LanguageSwitch from "../components/LanguageSwitch";
import Text from "../components/Text";
import { BUSINESS } from "../config";

// Read once at load: a static page only needs the year it was opened in.
const YEAR = new Date().getFullYear();

// Renders the full teaser; values follow the design mockup in .claude/local.
export default function Teaser() {
  const { t } = useTranslation();
  const services = t("teaser.services", { returnObjects: true }) as string[];

  return (
    <div className="flex min-h-screen flex-col bg-brand-deep font-sans text-white">
      <main className="relative isolate flex flex-auto items-center justify-center overflow-hidden px-6 pt-18 pb-10">
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
          <Text variant="lead" className="max-w-140 text-[#C9CDE8]">
            {t("teaser.intro")}
          </Text>
          <a
            href={`https://wa.me/${BUSINESS.whatsapp}`}
            className="inline-flex min-h-13 items-center gap-2.5 rounded-lg bg-crane px-7 text-[17px] font-bold text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 11.5a8.4 8.4 0 0 1-12.3 7.5L3 21l2-5.5A8.4 8.4 0 1 1 21 11.5z" />
            </svg>
            {t("teaser.whatsapp")}
          </a>
          <ul
            aria-label={t("teaser.servicesLabel")}
            className="mt-2 flex flex-wrap justify-center gap-2.5"
          >
            {services.map((service) => (
              <Text
                key={service}
                variant="small"
                as="li"
                className="rounded-full border border-white/28 px-3.5 py-2"
              >
                {service}
              </Text>
            ))}
          </ul>
        </div>
      </main>
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
            {t("teaser.footerWhatsapp", { number: BUSINESS.whatsapp })}
          </Text>
        </div>
      </footer>
    </div>
  );
}
