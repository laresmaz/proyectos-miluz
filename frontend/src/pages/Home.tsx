import { useTranslation } from "react-i18next";
import AboutSection from "../components/sections/AboutSection";
import CallToAction from "../components/home/CallToAction";
import FeaturedProjects from "../components/home/FeaturedProjects";
import Hero from "../components/home/Hero";
import ServicesIntro from "../components/home/ServicesIntro";
import Steps from "../components/home/Steps";
import TrustStrip from "../components/home/TrustStrip";
import Zigzag from "../components/sections/Zigzag";
import { BUSINESS } from "../data/config";
import { useServiceItems } from "../data/services";
import { usePageMeta } from "../lib/usePageMeta";

// "Sobre el ingeniero" carries the mountains into the deep blue of the call to action, or of the footer while there's no WhatsApp.
export default function Home() {
  const { t } = useTranslation("site");
  usePageMeta(
    t("meta.home.title", { name: BUSINESS.name, city: BUSINESS.city }),
    t("meta.home.description"),
  );

  return (
    <>
      {/* At least a full screen below the header (77px, its height from 360px wide up; a little taller below), so the trust strip ends at or below the bottom edge. */}
      <div className="flex min-h-[calc(100dvh-77px)] flex-col">
        <Hero />
        <TrustStrip />
      </div>
      <ServicesIntro />
      <Zigzag
        items={useServiceItems()}
        heading="h3"
        dividerInto="var(--color-brand-mist)"
      />
      <Steps />
      <FeaturedProjects />
      <AboutSection dividerInto="var(--color-brand-deep)" />
      {BUSINESS.whatsappEnabled && <CallToAction />}
    </>
  );
}
