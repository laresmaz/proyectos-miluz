// Service page: one service's full text
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router";
import BrandPhoto from "../components/ui/BrandPhoto";
import { BUSINESS } from "../data/config";
import { SERVICES } from "../data/services";
import { usePageMeta } from "../lib/usePageMeta";
import NotFound from "./NotFound";
import Eyebrow from "../components/ui/Eyebrow";
import Text from "../components/Text";

// Renders the service named in the URL, or the 404 page for an unknown one.
export default function ServiceDetail() {
  const { slug } = useParams();
  const index = SERVICES.findIndex((service) => service.slug === slug);
  return index === -1 ? <NotFound /> : <ServicePage index={index} />;
}

// One known service, with its own title and description for the browser tab and search results.
function ServicePage({ index }: { index: number }) {
  const { t } = useTranslation("site");
  const key = `services.items.${SERVICES[index].slug}`;
  usePageMeta(
    t(`${key}.metaTitle`, { name: BUSINESS.name, city: BUSINESS.city }),
    t(`${key}.metaDescription`),
  );
  const includes = t(`${key}.includes`, { returnObjects: true }) as string[];

  return (
    <article className="mx-auto flex max-w-300 flex-col gap-10 px-6 py-16 lg:flex-row lg:gap-16">
      <div className="lg:w-1/2">
        <BrandPhoto src={SERVICES[index].image} alt={t(`${key}.alt`)} eager />
      </div>
      <div className="flex flex-col items-start gap-5 lg:w-1/2">
        <Eyebrow>
          {t("services.label", { number: String(index + 1).padStart(2, "0") })}
        </Eyebrow>
        <Text variant="pageTitle" className="text-brand">
          {t(`${key}.title`)}
        </Text>
        <Text variant="bodyLarge">{t(`${key}.text`)}</Text>
        <Text
          variant="cardTitle"
          as="h2"
          id="service-includes"
          className="text-brand"
        >
          {t("services.includes")}
        </Text>
        <ul
          aria-labelledby="service-includes"
          className="list-inside list-disc space-y-2 marker:text-brand-medium"
        >
          {includes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {BUSINESS.whatsappEnabled && (
          <a
            href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(t(`${key}.whatsapp`))}`}
            className="inline-flex min-h-13 items-center rounded-lg bg-crane px-7 text-[17px] font-bold text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {t("services.whatsapp")}
          </a>
        )}
        <Link
          to="/servicios"
          className="inline-flex min-h-11 items-center font-semibold text-brand hover:text-brand-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <span aria-hidden="true">←&nbsp;</span>
          {t("services.all")}
        </Link>
      </div>
    </article>
  );
}
