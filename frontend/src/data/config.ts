// Business details shown on the site identical in every language.
// businessDetails.ts also fills the name and city into index.html and the web manifest at build time.
export const BUSINESS = {
  name: "Proyectos Miluz 10, C.A.",
  city: "Caracas, Venezuela",
  rif: "J-31280442-4",
  // The company's track record, and the engineer's own years, quoted across the site and the teaser.
  years: 30,
  works: 1000,
  engineerYears: 50,
  // International format, digits only (e.g. 584141234567)
  whatsapp: "584242558776",
  // Only ?teaser and ?preview show WhatsApp; the logo page at / has none.
  whatsappEnabled: true,
};

// Writes a WhatsApp number the way people read it out, e.g. +58 424 255 8776.
export function readableWhatsapp(number: string): string {
  return `+${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5, 8)} ${number.slice(8)}`;
}
