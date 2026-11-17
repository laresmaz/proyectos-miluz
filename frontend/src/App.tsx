// Root component: shows a deep-blue holding page while the deploy pipeline is tested.
// TODO: render <Teaser /> (from ./pages/Teaser) again at launch.
import logo from "./assets/logo.svg";
import { BUSINESS } from "./config";

// Renders the current page; the logo is there because Lighthouse fails on a page that paints nothing.
function App() {
  return (
    <main className="grid min-h-dvh place-items-center bg-brand-deep">
      <img src={logo} alt={BUSINESS.name} width={112} height={112} />
    </main>
  );
}

export default App;
