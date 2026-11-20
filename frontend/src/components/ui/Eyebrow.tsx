// Eyebrow: the small blue label with a triangle above a heading ("▸ Servicios"), as in the mockup.
import type { ReactNode } from "react";
import Text from "../Text";

export default function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <Text variant="eyebrow" className="text-brand-medium">
      <span aria-hidden="true">▸ </span>
      {children}
    </Text>
  );
}
