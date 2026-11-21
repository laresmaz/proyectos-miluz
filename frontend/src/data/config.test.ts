// Tests for the business details: the WhatsApp number must be one wa.me can open, and chat links open it.
import { describe, expect, it } from "vitest";
import { BUSINESS, whatsappUrl } from "./config";

describe("Business details", () => {
  it("has a Venezuelan WhatsApp number in international format, digits only", () => {
    // Arrange
    const venezuelanMobile = /^58\d{10}$/;

    // Act
    const number = BUSINESS.whatsapp;

    // Assert
    expect(number).toMatch(venezuelanMobile);
  });

  it.each([
    { message: undefined, expected: `https://wa.me/${BUSINESS.whatsapp}` },
    {
      message: "Hola, ¿cuánto cuesta? 50% & más",
      expected: `https://wa.me/${BUSINESS.whatsapp}?text=Hola%2C%20%C2%BFcu%C3%A1nto%20cuesta%3F%2050%25%20%26%20m%C3%A1s`,
    },
  ])(
    "opens the business chat, with the message typed in when there is one ($message)",
    ({ message, expected }) => {
      // Arrange
      const typed = message;

      // Act
      const url = whatsappUrl(typed);

      // Assert
      expect(url).toBe(expected);
    },
  );
});
