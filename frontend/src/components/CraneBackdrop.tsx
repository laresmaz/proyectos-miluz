// Crane backdrop: yellow triangle cranes drifting slowly behind a section's content
// The parent needs `relative isolate overflow-hidden` so the cranes stay behind and inside it.
import isChromatic from "chromatic/isChromatic";
import crane from "../assets/crane.svg";

// Size, start, opacity and speed per crane
const DARK = [
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

// Light sections: fewer cranes, and stronger, since yellow fades on white.
const LIGHT = [
  {
    width: 140,
    left: "64%",
    opacity: 0.13,
    duration: 150,
    delay: -90,
    bottom: 0,
  },
  {
    width: 100,
    left: "36%",
    opacity: 0.13,
    duration: 165,
    delay: -20,
    bottom: 0,
  },
  {
    width: 480,
    left: "6%",
    opacity: 0.26,
    duration: 90,
    delay: -55,
    bottom: -8,
  },
];

// Renders every crane; the drift animation lives in index.css and stops with reduced motion.
// offset staggers stacked sections: each step moves every crane's start
export default function CraneBackdrop({
  tone = "dark",
  offset = 0,
}: {
  tone?: "dark" | "light";
  offset?: number;
}) {
  // Frozen in Chromatic, so every screenshot catches the cranes in the same place.
  const still = isChromatic();
  return (
    <>
      {(tone === "light" ? LIGHT : DARK).map(
        ({ width, left, opacity, duration, delay, bottom }) => (
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
              left: `${(parseFloat(left) + offset * 29) % 100}%`,
              bottom,
              opacity,
              animationName: still ? "none" : undefined,
              animationDuration: `${duration}s`,
              animationDelay: `${delay - offset * 37}s`,
            }}
          />
        ),
      )}
    </>
  );
}
