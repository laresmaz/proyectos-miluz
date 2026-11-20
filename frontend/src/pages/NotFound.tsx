// 404 page: shown for any URL the site doesn't have
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { BUSINESS } from "../data/config";
import { usePageMeta } from "../lib/usePageMeta";
import Text from "../components/Text";

// Renders the not-found message and the link home.
export default function NotFound() {
  const { t } = useTranslation("site");
  usePageMeta(
    t("meta.notFound.title", { name: BUSINESS.name, city: BUSINESS.city }),
    t("meta.notFound.description"),
  );
  return (
    <div className="mx-auto flex max-w-300 flex-col items-start gap-6 px-6 py-16">
      <Text variant="pageTitle" className="text-brand">
        {t("notFound.title")}
      </Text>
      <Link
        to="/"
        className="inline-flex min-h-11 items-center rounded-lg bg-brand px-5 font-semibold text-white hover:bg-brand-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        {t("notFound.back")}
      </Link>
    </div>
  );
}
