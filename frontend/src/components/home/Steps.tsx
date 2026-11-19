// "Cómo trabajamos": four numbered step cards on a mist band.
import { useTranslation } from "react-i18next";
import { BUSINESS } from "../../config";
import Section from "../Section";
import Eyebrow from "../Eyebrow";

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
    >
      <div className="mx-auto flex max-w-300 flex-col gap-10 px-6 py-22">
        <div className="flex max-w-180 flex-col gap-3">
          <Eyebrow>{t("home.steps.eyebrow")}</Eyebrow>
          <h2 className="font-display text-[clamp(34px,4vw,52px)] leading-[1.02] font-bold text-brand uppercase">
            {t("home.steps.title")}
          </h2>
        </div>
        <ol className="flex flex-wrap gap-5">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="flex min-w-0 flex-[1_1_240px] flex-col gap-3.5 rounded-xl bg-white p-7 shadow-[0_1px_2px_rgba(5,5,74,0.08)]"
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
              <h3 className="font-display text-[26px] font-bold text-brand uppercase">
                {step.title}
              </h3>
              <p className="leading-[1.6] text-[#5A5F7A]">
                {BUSINESS.whatsappEnabled
                  ? step.text
                  : (step.textWithoutWhatsapp ?? step.text)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
