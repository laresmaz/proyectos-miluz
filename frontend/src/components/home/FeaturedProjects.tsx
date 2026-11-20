import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { PROJECTS } from "../../projects";
import ProjectCard from "../sections/ProjectCard";
import Section from "../ui/Section";
import Eyebrow from "../ui/Eyebrow";
import Text from "../Text";

export default function FeaturedProjects() {
  const { t } = useTranslation("site");
  const featured = PROJECTS.filter((p) => p.isPublished).slice(0, 3);

  return (
    <Section bg="var(--color-white)" tone="light" offset={4}>
      <div className="mx-auto flex max-w-300 flex-col gap-10 px-6 py-22">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-3">
            <Eyebrow>{t("home.projects.eyebrow")}</Eyebrow>
            <Text variant="sectionTitle" className="text-brand">
              {t("home.projects.title")}
            </Text>
          </div>
          <Link
            to="/proyectos"
            className="border-b-2 border-crane py-2.5 font-bold text-brand hover:text-brand-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {t("home.projects.all")}
            <span aria-hidden="true">&nbsp;→</span>
          </Link>
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
