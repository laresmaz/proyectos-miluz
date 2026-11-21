// Home projects: the first three published works, with a link to the full portfolio.
import { useTranslation } from "react-i18next";
import { PROJECTS } from "../../data/projects";
import ProjectCard from "../sections/ProjectCard";
import ArrowLink from "../ui/ArrowLink";
import Section from "../ui/Section";
import Eyebrow from "../ui/Eyebrow";
import Text from "../Text";

export default function FeaturedProjects() {
  const { t } = useTranslation("site");
  const featured = PROJECTS.filter((p) => p.isPublished).slice(0, 3);

  return (
    <Section id="proyectos" bg="var(--color-white)" withCranes={false}>
      <div className="mx-auto flex max-w-300 flex-col gap-10 px-6 py-22">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-3">
            <Eyebrow>{t("home.projects.eyebrow")}</Eyebrow>
            <Text variant="sectionTitle" className="text-brand">
              {t("home.projects.title")}
            </Text>
          </div>
          <ArrowLink to="/proyectos">{t("home.projects.all")}</ArrowLink>
        </div>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
            <li key={project.slug}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
