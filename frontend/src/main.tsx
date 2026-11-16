// Entry point: sets up translations, then mounts the app.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./fonts";
import "./index.css";
import App from "./App.tsx";
import { createI18n } from "./i18n";

createI18n();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
