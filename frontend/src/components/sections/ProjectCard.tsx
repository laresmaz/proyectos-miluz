// Project card from the before/after photos with their labels, then the title and its details.
import { useTranslation } from "react-i18next";
import type { Project } from "../../data/projects";
import BrandPhoto from "../ui/BrandPhoto";
import Text from "../Text";

// Badge colors from the mockup: Antes in white on brand blue, Después in brand blue on crane yellow.
const BADGES = {
  antes: { label: "projects.before", className: "bg-brand text-white" },
  despues: { label: "projects.after", className: "bg-crane text-brand" },
} as const;

// Renders one project; the photos without a before/after pair are left for its own page.
export default function ProjectCard({ project }: { project: Project }) {
  const { t } = useTranslation("site");
  const pair = (["antes", "despues"] as const)
    .map((kind) => project.images.find((image) => image.kind === kind))
    .filter((image) => image !== undefined);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-card">
      <div className="grid grid-cols-2 gap-0.5 bg-brand-mist">
        {pair.map((image) => {
          const badge = BADGES[image.kind as keyof typeof BADGES];
          return (
            <figure key={image.id} className="relative">
              <BrandPhoto src={image.url} alt={image.altText} square />
              <figcaption
                className={`absolute bottom-2.5 left-2.5 rounded px-2 py-1 text-xs font-bold ${badge.className}`}
              >
                {t(badge.label)}
              </figcaption>
            </figure>
          );
        })}
      </div>
      <div className="flex flex-col gap-1.5 p-5">
        <Text variant="bodyLarge" as="h3" className="font-bold text-brand">
          {project.title}
        </Text>
        <Text variant="small" as="p" className="text-ink-soft">
          {t(`services.items.${project.serviceType}.title`)} ·{" "}
          {project.location} · {project.year}
        </Text>
      </div>
    </article>
  );
}
