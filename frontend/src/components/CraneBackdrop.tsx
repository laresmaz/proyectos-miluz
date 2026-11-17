// Crane backdrop: yellow triangle cranes drifting slowly behind a section's content (DISENO.md section 1).
// The parent needs `relative isolate overflow-hidden` so the cranes stay behind and inside it.
import crane from "../assets/crane.svg";

// Size, start, opacity and speed per crane, from the mockup; small ones first so big ones paint on top.
const CRANES = [
  {
    width: 150,
    left: "22%",
    opacity: 0.07,
    duration: 150,
    delay: -30,
    bottom: 0,
  },
  {
    width: 110,
    left: "70%",
    opacity: 0.07,
    duration: 175,
    delay: -110,
    bottom: 0,
  },
  {
    width: 130,
    left: "46%",
    opacity: 0.07,
    duration: 160,
    delay: -70,
    bottom: 0,
  },
  {
    width: 620,
    left: "64%",
    opacity: 0.13,
    duration: 75,
    delay: -20,
    bottom: 0,
  },
  { width: 420, left: "8%", opacity: 0.1, duration: 95, delay: -65, bottom: 0 },
];

// Renders every crane; the drift animation lives in index.css and stops with reduced motion.
export default function CraneBackdrop() {
  return (
    <>
      {CRANES.map(({ width, left, opacity, duration, delay, bottom }) => (
        <img
          key={`${width}-${left}`}
          src={crane}
          alt=""
          // Matches crane.svg's 352 × 312 box, so the browser reserves the height before the image decodes.
          width={width}
          height={Math.round((width * 312) / 352)}
          className="crane block h-auto"
          aria-hidden="true"
          style={{
            width,
            left,
            bottom,
            opacity,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </>
  );
}
