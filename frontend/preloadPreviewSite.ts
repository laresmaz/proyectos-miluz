// Build plugin: for ?preview visitors, starts downloading the site's code with the page instead of after index.js runs.
// shortcut: only needed while the site hides behind ?preview; delete at launch, when the site code stops loading lazily.
import type { HtmlTagDescriptor, Plugin } from "vite";

// Adds the inline script to the built index.html; the chunk's file name is only known after bundling.
export default function preloadPreviewSite(): Plugin {
  return {
    name: "preload-preview-site",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler: (_html, ctx) => previewPreloadTag(Object.keys(ctx.bundle ?? {})),
    },
  };
}

// Builds a script that adds a modulepreload for the site chunk, with the same rule as src/lib/preview.ts, so teaser visitors don't download it.
export function previewPreloadTag(fileNames: string[]): HtmlTagDescriptor[] {
  const site = fileNames.find((name) => /(^|\/)Site-[\w-]+\.js$/.test(name));
  if (!site) return [];
  return [
    {
      tag: "script",
      children: `try{var p=new URLSearchParams(location.search).get("preview");if(p!=="false"&&(p!==null||sessionStorage.getItem("preview")==="1")){var l=document.createElement("link");l.rel="modulepreload";l.href="/${site}";document.head.appendChild(l)}}catch(e){}`,
      injectTo: "head",
    },
  ];
}
