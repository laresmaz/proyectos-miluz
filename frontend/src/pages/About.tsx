// About page: the engineer's introduction from the mockup's "Sobre el ingeniero" section.
import { useTranslation } from "react-i18next";
import AboutSection from "../components/sections/AboutSection";
import { BUSINESS } from "../config";
import { usePageMeta } from "../usePageMeta";

// Renders the section as the page, with its heading as the h1 and the footer's mountains at its foot.
export default function About() {
  const { t } = useTranslation("site");
  usePageMeta(
    t("meta.about.title", { name: BUSINESS.name, city: BUSINESS.city }),
    t("meta.about.description"),
  );
  return <AboutSection heading="h1" dividerInto="var(--color-brand-deep)" />;
}
