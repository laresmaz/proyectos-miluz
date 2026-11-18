// Projects page: the portfolio with before and after photos.
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import ProjectCard from "../components/ProjectCard";
import { PROJECTS, type Project } from "../projects";
import { SERVICES } from "../services";

// Renders the published projects, or a "coming soon" note while there are none; tests pass their own projects.
export default function Projects({
  projects = PROJECTS,
}: {
  projects?: Project[];
}) {
  const { t } = useTranslation("site");
  const [params, setParams] = useSearchParams();
  const selected = params.get("servicio");

  const published = projects.filter((project) => project.isPublished);
  const filters = SERVICES.filter(({ slug }) =>
    published.some((project) => project.serviceType === slug),
  );
  const shown = published.filter(
    (project) => !selected || project.serviceType === selected,
  );

  return (
    <div className="mx-auto max-w-300 px-6 py-16">
      <h1 className="font-display text-5xl font-bold text-brand uppercase">
        {t("nav.projects")}
      </h1>
      {published.length === 0 ? (
        <p className="mt-6 text-lg">{t("projects.empty")}</p>
      ) : (
        <>
          <div
            role="group"
            aria-label={t("projects.filter")}
            className="mt-8 flex flex-wrap gap-2"
          >
            <FilterButton
              label={t("projects.all")}
              pressed={!selected}
              onClick={() => setParams({})}
            />
            {filters.map(({ slug }) => (
              <FilterButton
                key={slug}
                label={t(`services.items.${slug}.title`)}
                pressed={selected === slug}
                onClick={() => setParams({ servicio: slug })}
              />
            ))}
          </div>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((project) => (
              <li key={project.slug}>
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

// One service filter; aria-pressed tells screen readers which one is on.
function FilterButton({
  label,
  pressed,
  onClick,
}: {
  label: string;
  pressed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`min-h-11 rounded-full border-2 border-brand px-4 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${pressed ? "bg-brand text-white" : "text-brand hover:bg-brand-mist"}`}
    >
      {label}
    </button>
  );
}
