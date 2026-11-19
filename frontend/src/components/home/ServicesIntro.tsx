// Home services intro (the centered heading above the service bands).
import { useTranslation } from "react-i18next";
import Section from "../Section";
import Eyebrow from "../Eyebrow";

export default function ServicesIntro() {
  const { t } = useTranslation("site");
  return (
    <Section bg="var(--color-white)" tone="light">
      <div className="mx-auto flex max-w-190 flex-col gap-4 px-6 pt-24 pb-6 text-center">
        <Eyebrow>{t("home.services.eyebrow")}</Eyebrow>
        <h2 className="font-display text-[clamp(36px,4.5vw,56px)] leading-[1.02] font-bold text-brand uppercase">
          {t("home.services.title")}
        </h2>
        <p className="text-lg leading-[1.6] text-[#5A5F7A]">
          {t("home.services.intro")}
        </p>
      </div>
    </Section>
  );
}
