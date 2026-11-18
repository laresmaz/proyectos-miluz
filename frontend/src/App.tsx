// Root component
// TODO: at launch, drop the ?preview check and render <Teaser /> for everyone.
import logo from "./assets/logo.svg";
import { BUSINESS } from "./config";
import Teaser from "./pages/Teaser";

// Renders the teaser for ?preview, otherwise the holding page; its logo is there because Lighthouse fails on a page that paints nothing.
function App() {
  if (new URLSearchParams(window.location.search).has("preview")) {
    return <Teaser />;
  }
  return (
    <main className="grid min-h-dvh place-items-center bg-brand-deep">
      <img src={logo} alt={BUSINESS.name} width={224} height={224} />
    </main>
  );
}

export default App;
