// The full site with its router, in its own chunk so teaser visitors don't download it.
import { createBrowserRouter, RouterProvider } from "react-router";
import { routes } from "./routes";

const router = createBrowserRouter(routes);

// Renders the page for the current URL.
export default function Site() {
  return <RouterProvider router={router} />;
}
