// The site's URLs and their pages, shared by the app and the tests.
import { Navigate, type RouteObject } from "react-router";
import type { SiteRouteHandle } from "./components/layout/SiteFooter";
import SiteLayout from "./components/layout/SiteLayout";
import About from "./pages/About";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Projects from "./pages/Projects";
import ServiceDetail from "./pages/ServiceDetail";

// Every page shares the header and footer from SiteLayout.
export const routes: RouteObject[] = [
  {
    element: <SiteLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
        handle: { endsWithDivider: true } satisfies SiteRouteHandle,
      },
      // The services live on the home page; /servicios stays as an address for links already shared.
      { path: "/servicios", element: <Navigate to="/#servicios" replace /> },
      { path: "/servicios/:slug", element: <ServiceDetail /> },
      { path: "/proyectos", element: <Projects /> },
      {
        path: "/sobre-mi",
        element: <About />,
        handle: { endsWithDivider: true } satisfies SiteRouteHandle,
      },
      { path: "*", element: <NotFound /> },
    ],
  },
];
