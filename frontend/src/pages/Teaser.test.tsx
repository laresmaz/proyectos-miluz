// Tests for the teaser page: content in both languages, the WhatsApp link and the language switch.
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nextProvider } from "react-i18next";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BUSINESS } from "../config";
import { createI18n } from "../i18n";
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

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  localStorage.clear();
});

describe("teaser page", () => {
  it.each([
    { browser: "es-VE", texts: es },
    { browser: "en-US", texts: en },
  ])("shows the headline and all services in $browser", ({ browser, texts }) => {
    // Arrange
    const services = texts.teaser.services;

    // Act
    renderTeaser(browser);

    // Assert
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain(texts.teaser.headlineAccent);
    const shown = screen.getAllByRole("listitem").map((item) => item.textContent);
    expect(shown).toEqual(services);
  });

  it("sends the visitor to the business WhatsApp chat", () => {
    // Arrange
    renderTeaser("es-VE");

    // Act
    const button = screen.getByRole("link", { name: es.teaser.whatsapp });

    // Assert
    expect(button.getAttribute("href")).toBe(`https://wa.me/${BUSINESS.whatsapp}`);
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
    renderTeaser("es-VE");
    const languageButton = screen.getByRole("button", { name: /Cambiar idioma/ });

    // Act
    await userEvent.click(languageButton);

    // Assert
    expect(screen.getByRole("link", { name: en.teaser.whatsapp })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Change language/ }).textContent).toContain("Español");
  });
});
