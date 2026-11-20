// Home services intro (the centered heading above the service bands).
import { useTranslation } from "react-i18next";
import Section from "../ui/Section";
import Eyebrow from "../ui/Eyebrow";
import Text from "../Text";

export default function ServicesIntro() {
  const { t } = useTranslation("site");
  return (
    <Section bg="var(--color-white)" tone="light" withCranes={false}>
      <div className="mx-auto flex max-w-190 flex-col gap-4 px-6 pt-24 pb-6 text-center">
        <Eyebrow>{t("home.services.eyebrow")}</Eyebrow>
        <Text variant="sectionTitle" className="text-brand">
          {t("home.services.title")}
        </Text>
        <Text variant="bodyLarge" className="text-ink-soft">
          {t("home.services.intro")}
        </Text>
      </div>
    </Section>
  );
}
