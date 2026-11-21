// Tests for language selection: browser default, Spanish fallback, remembered choice and <html lang>.
import { afterEach, describe, expect, it, vi } from "vitest";
import en from "../locales/en.json";
import es from "../locales/es.json";
import { createI18n } from "./i18n";

// Pretends the visitor's browser is set to the given languages.
function stubBrowserLanguages(...languages: string[]) {
  vi.spyOn(navigator, "languages", "get").mockReturnValue(languages);
  vi.spyOn(navigator, "language", "get").mockReturnValue(languages[0]);
}

// Lists every nested key of a translation file, so both languages can be compared.
function keysOf(obj: object, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([key, value]) =>
    typeof value === "object" && !Array.isArray(value)
      ? keysOf(value, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  );
}

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

describe("language selection", () => {
  it.each([
    {
      browser: "en-US",
      shown: "en",
      texts: en,
      why: "English for an English browser",
    },
    {
      browser: "en-CA",
      shown: "en",
      texts: en,
      why: "English for an English browser",
    },
    {
      browser: "es-VE",
      shown: "es",
      texts: es,
      why: "Spanish for a Spanish variant",
    },
    {
      browser: "fr-FR",
      shown: "es",
      texts: es,
      why: "Spanish as fallback for an unsupported language",
    },
  ])("shows $why ($browser)", ({ browser, shown, texts }) => {
    // Arrange
    stubBrowserLanguages(browser);

    // Act
    const i18n = createI18n();

    // Assert
    expect(i18n.resolvedLanguage).toBe(shown);
    expect(i18n.t("teaser.headline")).toBe(texts.teaser.headline);
  });

  it("remembers the language the visitor picked on the next visit", async () => {
    // Arrange
    stubBrowserLanguages("es-VE");
    await createI18n().changeLanguage("en");

    // Act
    const nextVisit = createI18n();

    // Assert
    expect(nextVisit.resolvedLanguage).toBe("en");
  });

  it("keeps the page lang attribute in sync with the language", async () => {
    // Arrange
    stubBrowserLanguages("es-VE");
    const i18n = createI18n();

    // Act
    await i18n.changeLanguage("en");

    // Assert
    expect(document.documentElement.lang).toBe("en");
  });

  it("has the same texts in English and Spanish", () => {
    // Arrange
    const spanishKeys = keysOf(es);

    // Act
    const englishKeys = keysOf(en);

    // Assert
    expect(englishKeys).toEqual(spanishKeys);
  });
});
