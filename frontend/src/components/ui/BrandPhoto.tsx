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
        src={shown}
        alt={alt}
        width={800}
        height={square ? 800 : 600}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined}
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
