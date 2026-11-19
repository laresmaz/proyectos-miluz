// "Sobre el ingeniero" section
import { Trans, useTranslation } from "react-i18next";
import BrandPhoto from "./BrandPhoto";
import Section from "./Section";

// Renders the section; the about page makes its heading the h1 and loads the photo first, the home page uses it as an h2 further down.
export default function AboutSection({
  heading: Heading = "h2",
  dividerInto,
}: {
  heading?: "h1" | "h2";
  dividerInto?: string;
}) {
  const { t } = useTranslation("site");
  const isPage = Heading === "h1";

  return (
    <Section
      bg="var(--color-brand-mist)"
      tone="light"
      offset={5}
      dividerInto={dividerInto}
    >
      <div className="mx-auto flex max-w-275 flex-wrap items-center gap-14 px-6 py-22">
        <div className="max-w-105 min-w-0 flex-[1_1_320px]">
          {/* TODO The file doesn't exist yet, so the fallback photo shows until it's uploaded there. */}
          <BrandPhoto
            src="/photos/ingeniero-en-obra.webp"
            alt={t("about.photoAlt")}
            eager={isPage}
          />
        </div>
        <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-4.5">
          <p className="text-sm font-bold tracking-[0.1em] text-brand-medium uppercase">
            <span aria-hidden="true">▸ </span>
            {t("about.eyebrow")}
          </p>
          <Heading className="font-display text-[clamp(34px,4vw,52px)] leading-[1.02] font-bold text-brand uppercase">
            {t("about.title")}
          </Heading>
          <p className="text-lg leading-[1.65]">
            <Trans t={t} i18nKey="about.bio" />
          </p>
          <p className="text-lg leading-[1.65]">{t("about.presence")}</p>
        </div>
      </div>
    </Section>
  );
}
