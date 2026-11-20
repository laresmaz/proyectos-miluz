import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { BUSINESS } from "../../data/config";
import BrandPhoto from "../ui/BrandPhoto";
import Section from "../ui/Section";
import WhatsAppIcon from "../ui/WhatsAppIcon";
import Text from "../Text";

// Renders the hero, ending in the Ávila divider down into the trust strip
export default function Hero() {
  const { t } = useTranslation("site");

  return (
    <Section bg="var(--color-brand-deep)" dividerInto="var(--color-brand)">
      <div className="mx-auto flex max-w-300 flex-wrap items-center gap-14 px-6 pt-24 pb-26">
        <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-7">
          <Text variant="eyebrow" className="text-crane">
            {t("home.hero.eyebrow")}
          </Text>
          <div className="flex flex-col gap-5">
            <Text variant="heroTitle" className="text-white">
              {t("home.hero.title")}
            </Text>
            <Text variant="lead" className="max-w-140 text-haze">
              {t("home.hero.subtitle")}
            </Text>
          </div>
          <div className="flex flex-wrap gap-3.5">
            {BUSINESS.whatsappEnabled && (
              <a
                href={`https://wa.me/${BUSINESS.whatsapp}`}
                className="inline-flex min-h-12 items-center gap-2.5 rounded-lg bg-crane px-6 font-bold text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <WhatsAppIcon />
                {t("home.hero.whatsapp")}
              </a>
            )}
            <Link
              to="/proyectos"
              className="inline-flex min-h-12 items-center rounded-lg border-2 border-white px-6 font-bold text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {t("home.hero.projects")}
            </Link>
          </div>
        </div>
        <div className="min-w-0 flex-[1_1_420px]">
          <BrandPhoto
            src="/photos/hero.webp"
            alt={t("home.hero.photoAlt")}
            eager
            onDark
          />
        </div>
      </div>
    </Section>
  );
}
