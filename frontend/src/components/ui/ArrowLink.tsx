// The text link with a yellow underline and an arrow, leading on to a fuller page ("Ver más →").
import type { ReactNode } from "react";
import { Link } from "react-router";

// Renders the link to `to`, with the arrow hidden from screen readers.
export default function ArrowLink({
  to,
  children,
}: {
  to: string;
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      className="inline-flex border-b-2 border-crane py-2.5 font-bold text-brand hover:text-brand-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      {children}
      <span aria-hidden="true">&nbsp;→</span>
    </Link>
  );
}
