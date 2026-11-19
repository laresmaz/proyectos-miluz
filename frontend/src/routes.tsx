// The site's URLs and their pages, shared by the app and the tests.
import type { RouteObject } from "react-router";
import type { SiteRouteHandle } from "./components/layout/SiteFooter";
import SiteLayout from "./components/layout/SiteLayout";
import About from "./pages/About";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Projects from "./pages/Projects";
import ServiceDetail from "./pages/ServiceDetail";
import Services from "./pages/Services";

// Every page shares the header and footer from SiteLayout.
export const routes: RouteObject[] = [
  {
    element: <SiteLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
        handle: { lastSection: "var(--color-brand)" } satisfies SiteRouteHandle,
      },
      { path: "/servicios", element: <Services /> },
      { path: "/servicios/:slug", element: <ServiceDetail /> },
      { path: "/proyectos", element: <Projects /> },
      {
        path: "/sobre-mi",
        element: <About />,
        handle: {
          lastSection: "var(--color-brand-mist)",
        } satisfies SiteRouteHandle,
      },
      { path: "*", element: <NotFound /> },
    ],
  },
];
