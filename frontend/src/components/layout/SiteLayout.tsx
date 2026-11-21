import { useTranslation } from "react-i18next";
import { Outlet, ScrollRestoration } from "react-router";
import siteEn from "../../locales/site/en.json";
import siteEs from "../../locales/site/es.json";
import FloatingWhatsApp from "./FloatingWhatsApp";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

export default function SiteLayout() {
  useSiteTexts();
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-ink">
      <SiteHeader />
      <main>
        <Outlet />
      </main>
      <SiteFooter />
      <FloatingWhatsApp />
      <ScrollRestoration />
    </div>
  );
}

// Adds the site's texts as the "site" namespace before any page renders
function useSiteTexts() {
  const { i18n } = useTranslation();
  if (!i18n.hasResourceBundle("es", "site")) {
    i18n.addResourceBundle("es", "site", siteEs);
    i18n.addResourceBundle("en", "site", siteEn);
  }
}
