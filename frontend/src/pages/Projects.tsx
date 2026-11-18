// Projects page: the portfolio with before and after photos, filterable by service.
import { useTranslation } from "react-i18next";

// Renders the projects page; only its heading until the portfolio is built.
export default function Projects() {
  const { t } = useTranslation("site");
  return (
    <h1 className="mx-auto max-w-300 px-6 py-16 font-display text-5xl font-bold text-brand uppercase">
      {t("nav.projects")}
    </h1>
  );
}
