// Services page: the seven services in the zigzag layout (DISENO.md sections 4 and 6).
import { useTranslation } from "react-i18next";

// Renders the services page; only its heading until the zigzag is built.
export default function Services() {
  const { t } = useTranslation();
  return (
    <h1 className="mx-auto max-w-300 px-6 py-16 font-display text-5xl font-bold text-brand uppercase">
      {t("nav.services")}
    </h1>
  );
}
