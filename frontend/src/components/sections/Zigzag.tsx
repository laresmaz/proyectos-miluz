// Zigzag: photo and text bands alternating white and mist
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { BUSINESS } from "../../data/config";
import BrandPhoto from "../ui/BrandPhoto";
import Section from "../ui/Section";
import Eyebrow from "../ui/Eyebrow";
import Text from "../Text";

export type ZigzagItem = {
  id: string;
  label: string;
  title: string;
  text: string;
  includes: string[];
  image: string;
  alt: string;
  href: string;
  whatsapp: string;
};

const LINK =
  "inline-flex border-b-2 border-crane py-2.5 font-bold text-brand hover:text-brand-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

export default function Zigzag({
  items,
  heading: Heading = "h2",
  dividerInto,
}: {
  items: ZigzagItem[];
  heading?: "h2" | "h3";
  dividerInto?: string;
}) {
  const { t } = useTranslation("site");

  return items.map((item, i) => (
    <Section
      key={item.id}
      bg={i % 2 === 1 ? "var(--color-brand-mist)" : "var(--color-white)"}
      tone="light"
      offset={i}
      dividerInto={i === items.length - 1 ? dividerInto : undefined}
    >
      <article
        className={`mx-auto flex max-w-300 flex-col gap-8 px-6 py-18 lg:items-center lg:gap-14 ${i % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"}`}
      >
        <div className="min-w-0 lg:flex-1">
          <BrandPhoto src={item.image} alt={item.alt} />
        </div>
        <div className="flex min-w-0 flex-col items-start gap-4 lg:flex-1">
          <Eyebrow>{item.label}</Eyebrow>
          <Text variant="blockTitle" as={Heading} className="text-brand">
            {item.title}
          </Text>
          <Text variant="bodyLarge">{item.text}</Text>
          <ul className="mt-1 flex flex-col gap-1.5">
            {item.includes.map((included) => (
              <Text
                key={included}
                variant="body"
                as="li"
                className="flex gap-2.5"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  aria-hidden="true"
                  className="mt-1.75 shrink-0 fill-brand"
                >
                  <polygon points="2,1 11,6 2,11" />
                </svg>
                {included}
              </Text>
            ))}
          </ul>
          <div className="mt-2 flex flex-wrap gap-x-6">
            <Link to={item.href} className={LINK}>
              {t("services.seeMore")}
              <span className="sr-only">: {item.title}</span>
              <span aria-hidden="true">&nbsp;→</span>
            </Link>
            {BUSINESS.whatsappEnabled && (
              <a
                href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(item.whatsapp)}`}
                className={LINK}
              >
                {t("services.whatsapp")}
                <span className="sr-only">: {item.title}</span>
                <span aria-hidden="true">&nbsp;→</span>
              </a>
            )}
          </div>
        </div>
      </article>
    </Section>
  ));
}
