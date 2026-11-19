// Sets the browser tab title and the description search results show, for the page on screen.
import { useEffect } from "react";

// Updates both whenever the page or the language changes.
export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", description);
  }, [title, description]);
}
