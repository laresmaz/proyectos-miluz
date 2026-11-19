// Root component: visitors get a deep-blue holding page; ?teaser shows the teaser and ?preview the new site, both for review before launch.
// TODO: at launch (WhatsApp number in, real photos), drop the checks and render the site for everyone.
import { lazy, Suspense } from "react";
import logo from "./assets/logo.svg";
import { BUSINESS } from "./config";
import Teaser from "./pages/Teaser";
import { isPreview } from "./preview";

// Loaded only for preview tabs, so visitors don't download the whole site.
const Site = lazy(() => import("./Site"));

// Picks the page from the URL; ?teaser comes first, so a tab that remembers ?preview can still open it.
function App() {
  if (new URLSearchParams(window.location.search).has("teaser")) {
    return <Teaser />;
  }
  if (isPreview()) {
    return (
      <Suspense fallback={<HoldingPage />}>
        <Site />
      </Suspense>
    );
  }
  return <HoldingPage />;
}

// The logo on deep blue; it also fills the screen while the site's code loads, because Lighthouse fails on a page that paints nothing.
function HoldingPage() {
  return (
    <main className="grid min-h-dvh place-items-center bg-brand-deep">
      <img src={logo} alt={BUSINESS.name} width={224} height={224} />
    </main>
  );
}

export default App;
