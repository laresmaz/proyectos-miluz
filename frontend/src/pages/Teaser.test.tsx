// Tests for the teaser page: content in both languages, the WhatsApp link behind its flag and the language switch.
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nextProvider } from "react-i18next";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BUSINESS, readableWhatsapp } from "../data/config";
import { SERVICES } from "../data/services";
import { createI18n } from "../lib/i18n";
import en from "../locales/en.json";
import es from "../locales/es.json";
import Teaser from "./Teaser";

// Renders the teaser as a visitor whose browser uses the given language would see it.
function renderTeaser(browserLanguage: string) {
  vi.spyOn(navigator, "languages", "get").mockReturnValue([browserLanguage]);
  render(
    <I18nextProvider i18n={createI18n()}>
      <Teaser />
    </I18nextProvider>,
  );
}

const whatsappEnabledInConfig = BUSINESS.whatsappEnabled;

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  localStorage.clear();
  BUSINESS.whatsappEnabled = whatsappEnabledInConfig;
});

describe("teaser page", () => {
  it.each([
    { browser: "es-VE", texts: es },
    { browser: "en-US", texts: en },
  ])(
    "shows the headline and every service from the site's list, in order, in $browser",
    ({ browser, texts }) => {
      // Arrange
      const services = SERVICES.map(({ slug }) => texts.teaser.services[slug]);

      // Act
      renderTeaser(browser);

      // Assert
      expect(screen.getByRole("heading", { level: 1 }).textContent).toContain(
        texts.teaser.headlineAccent,
      );
      const shown = screen
        .getAllByRole("listitem")
        .map((item) => item.textContent);
      expect(shown).toEqual(services);
    },
  );

  it("quotes the company's years of experience from the business details", () => {
    // Arrange
    const years = `${BUSINESS.years} años`;

    // Act
    renderTeaser("es-VE");

    // Assert
    expect(screen.getByText(new RegExp(years))).toBeTruthy();
  });

  it("sends the visitor to the business WhatsApp chat when WhatsApp is on", () => {
    // Arrange
    BUSINESS.whatsappEnabled = true;

    // Act
    renderTeaser("es-VE");

    // Assert
    const button = screen.getByRole("link", { name: es.teaser.whatsapp });
    expect(button.getAttribute("href")).toBe(
      `https://wa.me/${BUSINESS.whatsapp}`,
    );
    expect(
      screen.getByText(`WhatsApp: ${readableWhatsapp(BUSINESS.whatsapp)}`),
    ).toBeTruthy();
  });

  it("hides the WhatsApp button and number while WhatsApp is off", () => {
    // Arrange
    BUSINESS.whatsappEnabled = false;

    // Act
    renderTeaser("es-VE");

    // Assert
    expect(screen.queryByRole("link", { name: es.teaser.whatsapp })).toBeNull();
    expect(screen.queryByText(/WhatsApp:/)).toBeNull();
  });

  it("names the business in the logo for screen readers", () => {
    // Arrange
    renderTeaser("es-VE");

    // Act
    const logo = screen.getByRole("img", { name: BUSINESS.name });

    // Assert
    expect(logo).toBeTruthy();
  });

  it("switches the page to English from the language button", async () => {
    // Arrange
    document.head.innerHTML =
      '<title>Spanish title from index.html</title><meta name="description" content="">';
    renderTeaser("es-VE");
    const languageButton = screen.getByRole("button", {
      name: /Cambiar idioma/,
    });

    // Act
    await userEvent.click(languageButton);

    // Assert
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain(
      en.teaser.headlineAccent,
    );
    expect(
      screen.getByRole("button", { name: /Change language/ }).textContent,
    ).toContain("Español");
    expect(document.title).toBe(
      en.teaser.metaTitle
        .replace("{{name}}", BUSINESS.name)
        .replace("{{city}}", BUSINESS.city),
    );
    expect(
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute("content"),
    ).toBe(en.teaser.metaDescription);
  });
});
