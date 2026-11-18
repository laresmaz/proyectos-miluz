// Zigzag: photo and text blocks on alternating white and mist bands
import { Link } from "react-router";
import BrandPhoto from "./BrandPhoto";

export type ZigzagItem = {
  id: string;
  label: string;
  title: string;
  text: string;
  image: string;
  alt: string;
  href: string;
  linkLabel: string;
};

// Renders one band per item; on phones the photo always comes first.
export default function Zigzag({ items }: { items: ZigzagItem[] }) {
  return items.map((item, i) => (
    <div key={item.id} className={i % 2 === 1 ? "bg-brand-mist" : "bg-white"}>
      <article
        className={`mx-auto flex max-w-300 flex-col gap-8 px-6 py-16 lg:items-center lg:gap-16 ${i % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"}`}
      >
        <div className="lg:w-1/2">
          <BrandPhoto src={item.image} alt={item.alt} />
        </div>
        <div className="lg:w-1/2">
          <p className="text-sm font-semibold tracking-wide text-brand-medium uppercase">
            <span aria-hidden="true">▸ </span>
            {item.label}
          </p>
          <h2 className="mt-2 font-display text-4xl font-semibold text-brand uppercase">
            {item.title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed">{item.text}</p>
          <Link
            to={item.href}
            className="mt-6 inline-flex min-h-11 items-center font-semibold text-brand hover:text-brand-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {item.linkLabel}
            {/* Seven identical "Ver más" links need the title to tell them apart for screen readers. */}
            <span className="sr-only">: {item.title}</span>
            <span aria-hidden="true">&nbsp;→</span>
          </Link>
        </div>
      </article>
    </div>
  ));
}
