// Root page choice: visitors get the teaser; ?preview shows the new site for review before launch.
// TODO: at launch (real photos, the engineer's review), drop the check and render the site for everyone.
import type { ComponentType } from "react";
import { isPreview } from "./lib/preview";
import Teaser from "./pages/Teaser";

// Resolves the page to render, loading the site's code first for preview tabs so visitors don't download it.
// Loaded before the first render, not behind a Suspense fallback, which React keeps on screen for at least 300 ms.
export async function loadPage(): Promise<ComponentType> {
  return isPreview() ? (await import("./Site")).default : Teaser;
}
