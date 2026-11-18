// Services page: the seven services in the zigzag layout
import { useTranslation } from "react-i18next";
import Zigzag from "../components/Zigzag";
import { SERVICES } from "../services";

// Renders the heading and one zigzag block per service, with its short summary.
export default function Services() {
  const { t } = useTranslation("site");
  const items = SERVICES.map(({ slug, image }, i) => ({
    id: slug,
    label: t("services.label", { number: String(i + 1).padStart(2, "0") }),
    title: t(`services.items.${slug}.title`),
    text: t(`services.items.${slug}.summary`),
    image,
    alt: t(`services.items.${slug}.alt`),
    href: `/servicios/${slug}`,
    linkLabel: t("services.seeMore"),
  }));

  return (
    <>
      <h1 className="mx-auto max-w-300 px-6 pt-16 font-display text-5xl font-bold text-brand uppercase">
        {t("nav.services")}
      </h1>
      <Zigzag items={items} />
    </>
  );
}
