// Home page: hero, trust strip, services, how we work, featured projects
import Hero from "../components/home/Hero";
import ServicesIntro from "../components/home/ServicesIntro";
import Steps from "../components/home/Steps";
import TrustStrip from "../components/home/TrustStrip";
import Zigzag from "../components/Zigzag";
import { useServiceItems } from "../services";

// Renders the home sections built so far, in the mockup's order; the last one carries the footer's mountains.
export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <ServicesIntro />
      <Zigzag
        items={useServiceItems()}
        heading="h3"
        dividerInto="var(--color-brand-mist)"
      />
      <Steps dividerInto="var(--color-brand-deep)" />
    </>
  );
}
