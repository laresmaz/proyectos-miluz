// About page: the engineer's photo and career (DISENO.md section 5, "Sobre el ingeniero").
import { useTranslation } from "react-i18next";

// Renders the about page; only its heading until the bio is in.
export default function About() {
  const { t } = useTranslation();
  return (
    <h1 className="mx-auto max-w-300 px-6 py-16 font-display text-5xl font-bold text-brand uppercase">
      {t("nav.about")}
    </h1>
  );
}
