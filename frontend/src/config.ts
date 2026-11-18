// Business details shown on the site identical in every language.
// businessDetails.ts also fills the name and city into index.html and the web manifest at build time.
export const BUSINESS = {
  name: "Proyectos Miluz 10, C.A.",
  city: "Caracas, Venezuela",
  // International format, digits only (e.g. 584141234567)
  whatsapp: "[número]", //TODO
  // Off until the real number is in, so the teaser never links to a placeholder.
  whatsappEnabled: false,
};
