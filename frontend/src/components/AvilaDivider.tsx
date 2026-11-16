// Ávila divider: the mountain silhouette in triangles that separates two sections

// [center x, base width, height]
const BACK = [
  [90, 520, 78],
  [430, 560, 96],
  [800, 520, 112],
  [1150, 560, 94],
  [1440, 480, 72],
];
const FRONT = [
  [-20, 360, 46],
  [210, 420, 62],
  [470, 380, 54],
  [690, 420, 70],
  [905, 300, 88],
  [1015, 300, 82], // the two peaks of the Silla de Caracas
  [1210, 420, 60],
  [1420, 380, 48],
];

// Turns [center, width, height] into the points of a triangle
const triangle = ([cx, w, h]: number[]) =>
  `${cx - w / 2},120 ${cx},${120 - h} ${cx + w / 2},120`;

export default function AvilaDivider({
  topBg,
  fill,
}: {
  topBg: string;
  fill: string;
}) {
  // Solid blend instead of 45 % opacity, so the back layer hides whatever is behind it, like the cranes.
  const backFill = `color-mix(in srgb, ${fill} 45%, ${topBg})`;
  return (
    <div aria-hidden="true" className="-mb-px leading-none">
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="block h-[clamp(64px,8vw,120px)] w-full"
      >
        {BACK.map((t) => (
          <polygon key={`b${t[0]}`} fill={backFill} points={triangle(t)} />
        ))}
        {FRONT.map((t) => (
          <polygon key={`f${t[0]}`} fill={fill} points={triangle(t)} />
        ))}
        {/* Covers the hairline gap some browsers leave between the triangles and the next section. */}
        <rect x="0" y="116" width="1440" height="4" fill={fill} />
      </svg>
    </div>
  );
}
