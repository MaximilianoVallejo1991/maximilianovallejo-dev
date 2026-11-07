import { useState } from "react";
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

  // Which card is tap-opened on touch devices (see ProjectCard) — lifted
  // here, not local to each card, so an open card can dim its siblings the
  // same way `group-hover/grid:opacity-40` already dims them on real hover.
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  return (
    <SectionWrapper
      id="skills-projects"
      // Extra bottom padding (vs. pt-20/pt-28 on top) — same fix as
      // Certifications.tsx and Experience.tsx: gives more scroll room
      // before the mandatory snap pulls you into the next section. Bumped
      // further than those (pb-64/md:pb-72) because this grid grew from 3
      // to 6 cards and the last row was getting cut off right as you tried
      // to scroll a bit more to read it — instead the snap just advanced
      // you straight into Trayectoria.
      className="min-h-screen mx-auto max-w-6xl px-4 pt-20 pb-64 md:pt-28 md:pb-72"
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
            <ProjectCard
              key={project.slug}
              project={project}
              index={i + 1}
              isOpen={openSlug === project.slug}
              dimmed={openSlug !== null && openSlug !== project.slug}
              onToggle={() =>
                setOpenSlug((prev) => (prev === project.slug ? null : project.slug))
              }
            />
          ))}
        </div>

        {/* On-demand scroll room, mobile only matters in practice: the open
            card's reveal panel is `position: absolute` so it never grows the
            page's natural scroll height — and ProjectCard's tap-to-center
            scroll (see its handleTap) can only move the open card as far up
            as there's actual document height below it to scroll into. The
            bottom padding above already covers normal browsing, but the
            *last* row had nowhere near enough slack below it to fully come
            up, so it opened stuck low with its reveal clipped by the
            section's end. Expanding only while something's open keeps this
            invisible during normal scroll-through instead of permanently
            padding out the page.
            Grows WITHOUT a transition on open: ProjectCard's scrollTo runs
            one frame after the tap, and `window.scrollTo` clamps its target
            to whatever's scrollable *at that instant* — if this were still
            mid-transition (animating from h-0), the extra room wouldn't
            exist yet and the scroll would get clamped short, stranding the
            card low with the fix silently doing nothing. Only shrinks
            smoothly, on close, since nothing time-sensitive depends on
            that direction. */}
        <div
          aria-hidden="true"
          className={openSlug ? "h-80" : "h-0 transition-[height] duration-500 ease-out"}
        />
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
