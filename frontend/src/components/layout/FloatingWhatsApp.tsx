// Floating WhatsApp button from the mockup: always in the bottom-right corner of the site's pages.
import { useTranslation } from "react-i18next";
import { BUSINESS } from "../../data/config";
import WhatsAppIcon from "../ui/WhatsAppIcon";

export default function FloatingWhatsApp() {
  const { t } = useTranslation("site");
  if (!BUSINESS.whatsappEnabled) return null;
  return (
    <a
      href={`https://wa.me/${BUSINESS.whatsapp}`}
      aria-label={t("nav.whatsappFloating")}
      className="fixed right-6 bottom-6 z-50 inline-flex min-h-14 items-center gap-2.5 rounded-full bg-whatsapp px-5.5 font-bold text-brand-deep shadow-float focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <WhatsAppIcon />
      {t("nav.whatsapp")}
    </a>
  );
}
