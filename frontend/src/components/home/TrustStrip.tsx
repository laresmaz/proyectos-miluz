// Trust strip from the mockup: the years of experience and works done, counting up once the strip scrolls into view (DISENO.md section 5).
import { useEffect, useRef, useState, type RefObject } from "react";
import { useTranslation } from "react-i18next";
import { BUSINESS } from "../../data/config";
import Section from "../ui/Section";

// Where each number starts counting and where it ends.
const STATS = [
  {
    from: 20,
    to: BUSINESS.years,
    label: "home.trust.years",
    full: "home.trust.yearsFull",
  },
  {
    from: 0,
    to: BUSINESS.works,
    label: "home.trust.works",
    full: "home.trust.worksFull",
  },
] as const;

const DURATION_MS = 2500;

export default function TrustStrip() {
  const { t, i18n } = useTranslation("site");
  const strip = useRef<HTMLDivElement>(null);
  const progress = useCountUp(strip);
  // The dot groups thousands in Spanish (1.000), the comma in English.
  const format = (n: number) =>
    String(n).replace(
      /\B(?=(\d{3})+$)/g,
      i18n.resolvedLanguage === "en" ? "," : ".",
    );

  return (
    <Section
      aria-label={t("home.trust.label")}
      bg="var(--color-brand)"
      withCranes={false}
    >
      <div
        ref={strip}
        className="mx-auto flex max-w-225 flex-wrap items-center justify-center gap-x-20 gap-y-8 px-6 py-12 lg:py-[3.5dvh]"
      >
        {STATS.map(({ from, to, label, full }) => (
          <div
            key={label}
            className="flex flex-[0_1_320px] flex-col items-center gap-2 text-center"
          >
            <span
              aria-hidden="true"
              data-count
              className="font-display text-[clamp(64px,8vw,96px)] leading-none lg:text-[clamp(48px,min(8vw,9dvh),96px)] font-bold text-crane tabular-nums"
            >
              +{format(Math.round(from + (to - from) * progress))}
            </span>
            <span className="sr-only">{t(full, { number: format(to) })}</span>
            <span
              aria-hidden="true"
              className="text-lg font-semibold tracking-[0.04em] text-white uppercase"
            >
              {t(label)}
            </span>
          </div>
        ))}
      </div>
    </Section>
  );
}

function useCountUp(target: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(() =>
    shouldSkipAnimation() ? 1 : 0,
  );

  useEffect(() => {
    if (shouldSkipAnimation() || !target.current) return;
    let frame = 0;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / DURATION_MS);
        setProgress(1 - (1 - t) ** 3);
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
    observer.observe(target.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target]);

  return progress;
}

// True when the numbers should show their final value without counting.
function shouldSkipAnimation() {
  return (
    typeof IntersectionObserver === "undefined" ||
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  );
}
