// Root component: visitors get a deep-blue holding page; ?teaser shows the teaser and ?preview the new site, both for review before launch.
// TODO: at launch (WhatsApp number in, real photos), drop the checks and render the site for everyone.
import { lazy, Suspense } from "react";
import logo from "./assets/logo.svg";
import { BUSINESS } from "./config";
import Teaser from "./pages/Teaser";
import { isPreview } from "./preview";

// Loaded only for preview tabs, so visitors don't download the whole site.
const Site = lazy(() => import("./Site"));

// Picks the page from the URL; the holding page's logo is there because Lighthouse fails on a page that paints nothing.
function App() {
  if (isPreview()) {
    return (
      <Suspense>
        <Site />
      </Suspense>
    );
  }
  if (new URLSearchParams(window.location.search).has("teaser")) {
    return <Teaser />;
  }
  return (
    <main className="grid min-h-dvh place-items-center bg-brand-deep">
      <img src={logo} alt={BUSINESS.name} width={224} height={224} />
    </main>
  );
}

export default App;
