import { useContent } from "../../hooks/useContent";
import SectionWrapper from "../ui/SectionWrapper";
// Skills section temporarily hidden — re-add when scroll behavior is fixed.
// import SkillCarousel from "../ui/SkillCarousel";
import ProjectCard from "../ui/ProjectCard";
import { motion } from "motion/react";
import { fadeInItem } from "../ui/SectionWrapper";

export default function SkillsProjects() {
  const content = useContent();
  const { projects, navLinks } = content;

  return (
    <SectionWrapper
      id="skills-projects"
      // Extra bottom padding (vs. pt-20/pt-28 on top) — same fix as
      // Certifications.tsx and Experience.tsx: gives more scroll room
      // before the mandatory snap pulls you into the next section.
      className="min-h-screen mx-auto max-w-6xl px-4 pt-20 pb-40 md:pt-28 md:pb-56"
    >
      <div id="projects" className="scroll-mt-14">
        <motion.h2
          {...fadeInItem(0)}
          className="font-heading text-3xl font-bold text-primary md:text-4xl"
        >
          {navLinks.find((l) => l.href === "#projects")?.label}
        </motion.h2>

        {/* mt-24: clears the -80px hoverLift on the top row's cards (see
            SectionWrapper.hoverLift) — anything tighter and hovering a
            top-row card slides it up over this heading. */}
        <div className="group/grid mt-24 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i + 1} />
          ))}
        </div>
      </div>

      {/*
        Skills section temporarily hidden — felt cramped and the carousel
        could glitch while scrolling. Re-enable once that's addressed.

        <div id="skills" className="snap-start mt-16 scroll-mt-14 md:mt-20">
          <motion.h2
            {...fadeInItem(1)}
            className="font-heading text-3xl font-bold text-primary md:text-4xl"
          >
            {navLinks.find((l) => l.href === "#skills")?.label}
          </motion.h2>

          <motion.div {...fadeInItem(2)} className="mt-10">
            <SkillCarousel skills={content.skills.flatMap((cat) => cat.items)} />
          </motion.div>
        </div>
      */}
    </SectionWrapper>
  );
}
