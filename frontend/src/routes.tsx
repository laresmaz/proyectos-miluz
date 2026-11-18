// The site's URLs and their pages, shared by the app and the tests.
import type { RouteObject } from "react-router";
import SiteLayout from "./components/SiteLayout";
import About from "./pages/About";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Projects from "./pages/Projects";
import Services from "./pages/Services";

// Every page shares the nav and footer from SiteLayout.
export const routes: RouteObject[] = [
  {
    element: <SiteLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/servicios", element: <Services /> },
      { path: "/proyectos", element: <Projects /> },
      { path: "/sobre-mi", element: <About /> },
      { path: "*", element: <NotFound /> },
    ],
  },
];
