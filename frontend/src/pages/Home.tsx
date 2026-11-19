// Home page: hero, trust strip, services, how we work, featured projects
import Hero from "../components/home/Hero";
import TrustStrip from "../components/home/TrustStrip";

// Renders the home sections built so far, in the mockup's order.
export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
    </>
  );
}
