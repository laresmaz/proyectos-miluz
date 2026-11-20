// Services page: the seven services in the zigzag layout
import { useTranslation } from "react-i18next";
import Zigzag from "../components/sections/Zigzag";
import { BUSINESS } from "../config";
import { useServiceItems } from "../services";
import { usePageMeta } from "../usePageMeta";
import Text from "../components/Text";

// Renders the heading and one zigzag band per service; the last band carries the footer's mountains.
export default function Services() {
  const { t } = useTranslation("site");
  usePageMeta(
    t("meta.services.title", { name: BUSINESS.name, city: BUSINESS.city }),
    t("meta.services.description"),
  );
  return (
    <>
      <Text
        variant="pageTitle"
        className="mx-auto max-w-300 px-6 pt-16 text-brand"
      >
        {t("nav.services")}
      </Text>
      <Zigzag items={useServiceItems()} dividerInto="var(--color-brand-deep)" />
    </>
  );
}
