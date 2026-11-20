// "Cómo trabajamos": four numbered step cards on a mist band.
import { useTranslation } from "react-i18next";
import { BUSINESS } from "../../data/config";
import Section from "../ui/Section";
import Eyebrow from "../ui/Eyebrow";
import Text from "../Text";

type Step = { title: string; text: string; textWithoutWhatsapp?: string };

export default function Steps({ dividerInto }: { dividerInto?: string }) {
  const { t } = useTranslation("site");
  const steps = t("home.steps.items", { returnObjects: true }) as Step[];

  return (
    <Section
      bg="var(--color-brand-mist)"
      tone="light"
      offset={3}
      dividerInto={dividerInto}
      withCranes={false}
    >
      <div className="mx-auto flex max-w-300 flex-col gap-10 px-6 py-22">
        <div className="flex max-w-180 flex-col gap-3">
          <Eyebrow>{t("home.steps.eyebrow")}</Eyebrow>
          <Text variant="sectionTitle" className="text-brand">
            {t("home.steps.title")}
          </Text>
        </div>
        <ol className="flex flex-wrap gap-5">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="flex min-w-0 flex-[1_1_240px] flex-col gap-3.5 rounded-xl bg-white p-7 shadow-card"
            >
              <div className="relative h-12.5 w-14" aria-hidden="true">
                <svg
                  width="56"
                  height="50"
                  viewBox="0 0 56 50"
                  className="absolute inset-0 fill-brand"
                >
                  <polygon points="28,0 56,50 0,50" />
                </svg>
                <span className="absolute inset-x-0 bottom-1.5 text-center font-display text-[22px] font-bold text-crane">
                  {i + 1}
                </span>
              </div>
              <Text variant="cardTitle" className="text-brand">
                {step.title}
              </Text>
              <Text variant="body" className="text-ink-soft">
                {BUSINESS.whatsappEnabled
                  ? step.text
                  : (step.textWithoutWhatsapp ?? step.text)}
              </Text>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
