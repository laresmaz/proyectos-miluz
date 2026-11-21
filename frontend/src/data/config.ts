// Business details shown on the site identical in every language.
// businessDetails.ts also fills the name, city and address into index.html and the web manifest at build time.
export const BUSINESS = {
  name: "Proyectos Miluz 10, C.A.",
  city: "Caracas, Venezuela",
  rif: "J-31280442-4",
  // The company's track record, and the engineer's own years, quoted across the site and the teaser.
  years: 30,
  works: 800,
  engineerYears: 50,
  // International format, digits only (e.g. 584141234567)
  whatsapp: "584242558776",
  // The live address, without a trailing slash; link previews need absolute URLs.
  url: "https://www.proyectosmiluz.com",
  // Named as the founder in the business data search engines read.
  engineer: "Miguel Lares",
};

// Opens a chat with the business, with the visitor's first message already typed when given.
export function whatsappUrl(message?: string): string {
  const chat = `https://wa.me/${BUSINESS.whatsapp}`;
  return message ? `${chat}?text=${encodeURIComponent(message)}` : chat;
}

// Writes a WhatsApp number the way people read it out, e.g. (+58) 424 255 8776.
export function readableWhatsapp(number: string): string {
  return `(+${number.slice(0, 2)}) ${number.slice(2, 5)} ${number.slice(5, 8)} ${number.slice(8)}`;
}
