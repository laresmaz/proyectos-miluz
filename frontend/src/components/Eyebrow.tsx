// Eyebrow: the small blue label with a triangle above a heading ("▸ Servicios"), as in the mockup.
import type { ReactNode } from "react";

export default function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm font-bold tracking-[0.1em] text-brand-medium uppercase">
      <span aria-hidden="true">▸ </span>
      {children}
    </p>
  );
}
