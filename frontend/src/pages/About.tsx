// About page: the engineer's introduction from the mockup's "Sobre el ingeniero" section.
import AboutSection from "../components/AboutSection";

// Renders the section as the page, with its heading as the h1 and the footer's mountains at its foot.
export default function About() {
  return <AboutSection heading="h1" dividerInto="var(--color-brand-deep)" />;
}
