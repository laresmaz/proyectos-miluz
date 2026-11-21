// Sunrise glow: warm light rising from the bottom of a band, behind the cranes and the Ávila divider
export default function SunriseGlow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-[-2] h-1/2 bg-linear-to-t from-sunrise/45 to-transparent"
    />
  );
}
