// Home page: hero, trust strip, services, how we work, featured projects
import { BUSINESS } from "../config";

// Renders the home page; only its heading until the sections are built.
export default function Home() {
  return (
    <h1 className="mx-auto max-w-300 px-6 py-16 font-display text-5xl font-bold text-brand uppercase">
      {BUSINESS.name}
    </h1>
  );
}
