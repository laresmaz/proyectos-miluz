// Root component: visitors get the teaser; ?preview opens the new site so it can be reviewed before launch.
// TODO: at launch (WhatsApp number in, real photos), drop the preview check and render the site for everyone.
import { lazy, Suspense } from "react";
import Teaser from "./pages/Teaser";
import { isPreview } from "./preview";

// Loaded only for preview tabs, so visitors don't download the whole site.
const Site = lazy(() => import("./Site"));

// Renders the site for a preview tab, otherwise the teaser.
function App() {
  if (isPreview()) {
    return (
      <Suspense>
        <Site />
      </Suspense>
    );
  }
  return <Teaser />;
}

export default App;
