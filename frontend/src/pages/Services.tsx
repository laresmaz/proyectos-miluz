// Services page: the seven services in the zigzag layout
import { useTranslation } from "react-i18next";
import Zigzag from "../components/Zigzag";
import { useServiceItems } from "../services";

// Renders the heading and one zigzag band per service; the last band carries the footer's mountains.
export default function Services() {
  const { t } = useTranslation("site");
  return (
    <>
      <h1 className="mx-auto max-w-300 px-6 pt-16 font-display text-5xl font-bold text-brand uppercase">
        {t("nav.services")}
      </h1>
      <Zigzag items={useServiceItems()} dividerInto="var(--color-brand-deep)" />
    </>
  );
}
