// The yellow WhatsApp button with the logo, the main call to action wherever it appears.
import type { ReactNode } from "react";
import { whatsappUrl } from "../../data/config";
import WhatsAppIcon from "./WhatsAppIcon";

// Opens the chat, with `message` already typed when given; `large` for a page's only button, `onLight` for white backgrounds.
export default function WhatsAppButton({
  children,
  message,
  large = false,
  onLight = false,
}: {
  children: ReactNode;
  message?: string;
  large?: boolean;
  onLight?: boolean;
}) {
  return (
    <a
      href={whatsappUrl(message)}
      className={`inline-flex items-center gap-2.5 rounded-lg bg-crane font-bold text-brand focus-visible:outline-2 focus-visible:outline-offset-2 ${large ? "min-h-13 px-7 text-[17px]" : "min-h-12 px-6"} ${onLight ? "focus-visible:outline-brand" : "focus-visible:outline-white"}`}
    >
      <WhatsAppIcon />
      {children}
    </a>
  );
}
