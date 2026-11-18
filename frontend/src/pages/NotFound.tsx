// 404 page: shown for any URL the site doesn't have
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

// Renders the not-found message and the link home.
export default function NotFound() {
  const { t } = useTranslation("site");
  return (
    <div className="mx-auto flex max-w-300 flex-col items-start gap-6 px-6 py-16">
      <h1 className="font-display text-5xl font-bold text-brand uppercase">
        {t("notFound.title")}
      </h1>
      <Link
        to="/"
        className="inline-flex min-h-11 items-center rounded-lg bg-brand px-5 font-semibold text-white hover:bg-brand-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        {t("notFound.back")}
      </Link>
    </div>
  );
}
