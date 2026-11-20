// Build plugin: preloads the fonts the first screen needs, so they arrive early and the text swaps in sooner.
import type { HtmlTagDescriptor, Plugin } from "vite";

// The headline (Barlow 700) and body text (variable Inter, one file for every weight); other scripts load on demand.
const FIRST_SCREEN_FONTS = [
  /barlow-condensed-latin-700-normal-.*\.woff2$/,
  /inter-latin-wght-normal-.*\.woff2$/,
];

// Adds the preload links to the built index.html; the font file names are only known after bundling.
export default function preloadFonts(): Plugin {
  return {
    name: "preload-fonts",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler: (_html, ctx) => fontPreloadTags(Object.keys(ctx.bundle ?? {})),
    },
  };
}

// Picks the first-screen font files out of the bundle and turns each into a preload link.
export function fontPreloadTags(fileNames: string[]): HtmlTagDescriptor[] {
  return fileNames
    .filter((name) => FIRST_SCREEN_FONTS.some((pattern) => pattern.test(name)))
    .map((name) => ({
      tag: "link",
      attrs: {
        rel: "preload",
        as: "font",
        type: "font/woff2",
        href: `/${name}`,
        crossorigin: "",
      },
      injectTo: "head",
    }));
}
