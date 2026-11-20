// Tests for the business details: the WhatsApp number must be one wa.me can open.
import { describe, expect, it } from "vitest";
import { BUSINESS } from "./config";

describe("Business details", () => {
  it("has a Venezuelan WhatsApp number in international format, digits only", () => {
    // Arrange
    const venezuelanMobile = /^58\d{10}$/;

    // Act
    const number = BUSINESS.whatsapp;

    // Assert
    expect(number).toMatch(venezuelanMobile);
  });
});
