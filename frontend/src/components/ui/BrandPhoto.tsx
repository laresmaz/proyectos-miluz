// Brand photo: a 4:3 image (or square, for the before/after pairs) with a loading skeleton and fallback when it fails
import { useState } from "react";
import fallback from "../../assets/fallback-photo.svg";

type BrandPhotoProps = {
  src: string;
  alt: string;
  eager?: boolean;
  square?: boolean;
  onDark?: boolean;
};

// Photo widths on screen: half a project card for squares, half the page for the rest, and full width on phones.
const SIZES = "(min-width: 1024px) 600px, 100vw";
const SQUARE_SIZES = "(min-width: 1024px) 190px, (min-width: 640px) 25vw, 50vw";

// Renders the photo; only the first photo on a page should be eager, so it isn't held back behind the rest.
export default function BrandPhoto(props: BrandPhotoProps) {
  return <Photo key={props.src} {...props} />;
}

// Tracks one photo's loading and fallback
function Photo({
  src,
  alt,
  eager = false,
  square = false,
  onDark = false,
}: BrandPhotoProps) {
  const [shown, setShown] = useState(src);
  const [loading, setLoading] = useState(true);
  const widths = webpWidths(shown);

  // Swaps in the fallback once
  const onError = () => {
    if (shown !== fallback) setShown(fallback);
    else setLoading(false);
  };

  return (
    <div
      aria-busy={loading}
      className={`relative overflow-hidden bg-brand-mist ${square ? "" : "rounded-[10px]"} ${loading ? "motion-safe:animate-pulse" : ""}`}
    >
      <img
        src={widths?.src ?? shown}
        srcSet={widths?.srcSet}
        sizes={widths && (square ? SQUARE_SIZES : SIZES)}
        alt={alt}
        width={800}
        height={square ? 800 : 600}
        loading={eager ? "eager" : "lazy"}
        onLoad={() => setLoading(false)}
        onError={onError}
        className={`w-full object-cover transition-opacity duration-300 ${square ? "aspect-square" : "aspect-4/3"} ${loading ? "opacity-0" : "opacity-100"}`}
      />
      <div className="absolute inset-0 bg-brand/20 mix-blend-multiply" />
      <div
        className={`absolute right-0 bottom-0 [clip-path:polygon(100%_0,100%_100%,0_100%)] ${onDark ? "bg-crane" : "bg-brand"} ${square ? "size-8" : "size-14"}`}
      />
    </div>
  );
}

// Finds the resized copies of a WebP photo, named <name>-<width>.webp by the resize script; other images have none.
function webpWidths(src: string) {
  if (!src.endsWith(".webp")) return undefined;
  const base = src.slice(0, -".webp".length);
  return {
    src: `${base}-960.webp`,
    srcSet: [480, 960, 1600].map((w) => `${base}-${w}.webp ${w}w`).join(", "),
  };
}
