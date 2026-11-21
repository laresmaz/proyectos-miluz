// Entry point: sets up translations, then mounts the page for this URL.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./lib/fonts";
import "./index.css";
import { loadPage } from "./App.tsx";
import { createI18n } from "./lib/i18n";

createI18n();

void loadPage().then((Page) =>
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <Page />
    </StrictMode>,
  ),
);
