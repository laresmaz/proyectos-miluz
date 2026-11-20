// Translations setup: picks Spanish or English from the browser and remembers the visitor's choice.
import i18next, { type i18n } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import es from "../locales/es.json";

// Builds a ready-to-use translations instance; called once in main.tsx and fresh in each test.
export function createI18n(): i18n {
  const instance = i18next.createInstance();
  instance.on("languageChanged", (lng) => {
    document.documentElement.lang = lng;
  });
  instance
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: { es: { translation: es }, en: { translation: en } },
      supportedLngs: ["es", "en"],
      fallbackLng: "es",
      // A choice saved from the language switch wins over the browser setting.
      detection: {
        order: ["localStorage", "navigator"],
        caches: ["localStorage"],
      },
      // Resources are bundled, so init can finish before the first render.
      initAsync: false,
      interpolation: { escapeValue: false },
    });
  return instance;
}
