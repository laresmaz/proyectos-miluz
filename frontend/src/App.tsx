// Root component: visitors get the teaser; ?preview shows the new site for review before launch.
// TODO: at launch (real photos, the engineer's review), drop the check and render the site for everyone.
import { lazy, Suspense } from "react";
import logo from "./assets/logo.svg";
import { BUSINESS } from "./data/config";
import Teaser from "./pages/Teaser";
import { isPreview } from "./lib/preview";

// Loaded only for preview tabs, so visitors don't download the whole site.
const Site = lazy(() => import("./Site"));

// Picks the page from the URL, or from a tab that remembers ?preview.
function App() {
  if (isPreview()) {
    return (
      <Suspense fallback={<Loading />}>
        <Site />
      </Suspense>
    );
  }
  return <Teaser />;
}

// The logo on deep blue while the site's code loads, because Lighthouse fails on a page that paints nothing.
function Loading() {
  return (
    <main className="grid min-h-dvh place-items-center bg-brand-deep">
      <img src={logo} alt={BUSINESS.name} width={224} height={224} />
    </main>
  );
}

export default App;
