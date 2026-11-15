// Globe button that toggles the site between Spanish and English.
import { useTranslation } from "react-i18next";

// Each language is named in itself, so a visitor can find theirs whatever the page shows.
const OTHER_LANGUAGE = {
  es: { code: "en", name: "English" },
  en: { code: "es", name: "Español" },
} as const;

// Shows the language you can switch to; the hidden prefix keeps the visible name inside the accessible name.
export default function LanguageSwitch({ className = "" }: { className?: string }) {
  const { t, i18n } = useTranslation();
  const other = OTHER_LANGUAGE[i18n.resolvedLanguage === "en" ? "en" : "es"];

  return (
    <button
      type="button"
      onClick={() => i18n.changeLanguage(other.code)}
      className={`inline-flex min-h-11 min-w-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-white hover:text-crane focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crane ${className}`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
      </svg>
      <span className="sr-only">{t("languageSwitch.label")}: </span>
      <span lang={other.code}>{other.name}</span>
    </button>
  );
}
