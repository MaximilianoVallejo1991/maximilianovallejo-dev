import { useContent } from "../../hooks/useContent";
import SectionWrapper from "../ui/SectionWrapper";
import SkillCarousel from "../ui/SkillCarousel";
import ProjectCard from "../ui/ProjectCard";
import { motion } from "motion/react";
import { fadeInItem } from "../ui/SectionWrapper";

export default function SkillsProjects() {
  const content = useContent();
  const { skills, projects, navLinks } = content;

  const allSkills = skills.flatMap((cat) => cat.items);

  return (
    <SectionWrapper
      id="skills-projects"
      className="min-h-screen mx-auto max-w-6xl px-4 py-20 md:py-28"
    >
      <div id="skills" className="snap-start scroll-mt-14">
        <motion.h2
          {...fadeInItem(0)}
          className="font-heading text-3xl font-bold text-primary md:text-4xl"
        >
          {navLinks.find((l) => l.href === "#skills")?.label}
        </motion.h2>

        <motion.div {...fadeInItem(1)} className="mt-10">
          <SkillCarousel skills={allSkills} />
        </motion.div>
      </div>

      <div id="projects" className="snap-start mt-16 scroll-mt-14 md:mt-20">
        <motion.h2
          {...fadeInItem(2)}
          className="font-heading text-3xl font-bold text-primary md:text-4xl"
        >
          {navLinks.find((l) => l.href === "#projects")?.label}
        </motion.h2>

        <div className="group/grid mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i + 1} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
