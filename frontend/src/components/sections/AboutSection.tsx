// "Sobre el ingeniero" section
import { Trans, useTranslation } from "react-i18next";
import { BUSINESS } from "../../data/config";
import BrandPhoto from "../ui/BrandPhoto";
import Section from "../ui/Section";
import Eyebrow from "../ui/Eyebrow";
import Text from "../Text";

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
      id="sobre-mi"
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
          <Eyebrow>{t("about.eyebrow")}</Eyebrow>
          <Text variant="sectionTitle" as={Heading} className="text-brand">
            {t("about.title")}
          </Text>
          <Text variant="bodyLarge">
            <Trans
              t={t}
              i18nKey="about.bio"
              values={{ engineerYears: BUSINESS.engineerYears }}
            />
          </Text>
          <Text variant="bodyLarge">{t("about.presence")}</Text>
        </div>
      </div>
    </Section>
  );
}
