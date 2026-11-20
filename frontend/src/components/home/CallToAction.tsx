import { useTranslation } from "react-i18next";
import logo from "../../assets/logo.svg";
import { BUSINESS } from "../../config";
import Section from "../ui/Section";
import WhatsAppIcon from "../ui/WhatsAppIcon";
import Text from "../Text";

// Its only job is the WhatsApp button call to action
export default function CallToAction() {
  const { t } = useTranslation("site");

  return (
    <Section bg="var(--color-brand-deep)">
      <div className="mx-auto flex max-w-225 flex-col items-center gap-5.5 px-6 pt-22 pb-24 text-center">
        <img src={logo} alt="" width={72} height={72} />
        <Text variant="sectionTitle" className="text-white">
          {t("home.cta.title")}
        </Text>
        <Text variant="lead" className="text-haze">
          {t("home.cta.text")}
        </Text>
        <a
          href={`https://wa.me/${BUSINESS.whatsapp}`}
          className="inline-flex min-h-12 items-center gap-2.5 rounded-lg bg-crane px-6 font-bold text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <WhatsAppIcon />
          {t("home.cta.whatsapp")}
        </a>
      </div>
    </Section>
  );
}
