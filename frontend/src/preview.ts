// Preview switch: ?preview opens the new site before launch, the browser tab remembers it, ?preview=false turns it off.

// True when this tab last opened ?preview (any value but false); storage can be blocked, so the URL alone still works then.
export function isPreview(): boolean {
  const value = new URLSearchParams(window.location.search).get("preview");
  try {
    if (value === "false") sessionStorage.removeItem("preview");
    else if (value !== null) sessionStorage.setItem("preview", "1");
    return sessionStorage.getItem("preview") === "1";
  } catch {
    return value !== null && value !== "false";
  }
}
