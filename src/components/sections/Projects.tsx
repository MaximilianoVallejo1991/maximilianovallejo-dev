import { useContent } from "../../hooks/useContent";
import SectionWrapper from "../ui/SectionWrapper";
import ProjectCard from "../ui/ProjectCard";
import { motion } from "motion/react";
import { fadeInItem } from "../ui/SectionWrapper";

export default function Projects() {
  const content = useContent();
  const { projects } = content;

  return (
    <SectionWrapper id="projects" className="mx-auto max-w-6xl px-4 py-20 md:py-28">
      <motion.h2
        {...fadeInItem(0)}
        className="font-heading text-3xl font-bold text-primary md:text-4xl"
      >
        {content.navLinks.find((l) => l.href === "#projects")?.label}
      </motion.h2>

      <div className="group/grid mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i + 1} />
        ))}
      </div>
    </SectionWrapper>
  );
}
