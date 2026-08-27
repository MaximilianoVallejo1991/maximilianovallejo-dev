import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { fadeInItem, hoverLift } from "./SectionWrapper";
import Tag from "./Tag";
import type { Project } from "../../data/content";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const [imgError, setImgError] = useState(false);
  const prefersReduced = useReducedMotion();

  return (
    <motion.article
      {...fadeInItem(index)}
      whileHover={prefersReduced ? undefined : hoverLift}
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-border bg-surface transition-[border-color,opacity] duration-300 hover:z-10 hover:border-accent/40 group-hover/grid:!opacity-40 hover:!opacity-100"
    >
      {/* Screenshot / fallback */}
      <div className="aspect-video w-full overflow-hidden bg-border/30">
        {imgError ? (
          <div className="flex h-full w-full items-center justify-center bg-border/20 font-heading text-sm font-medium text-muted">
            {project.title}
          </div>
        ) : (
          <img
            src={project.screenshot}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        )}
      </div>

      <div className="p-5">
        <h3 className="font-heading text-lg font-semibold text-primary">
          {project.title}
        </h3>

        {/* Reveal — collapsed to 0 height at rest, unfolds downward on hover
            via the grid-template-rows 0fr->1fr trick (no JS, no fixed heights,
            no margin hacks that fight layout). */}
        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none group-hover:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <p className="mt-2 font-body text-sm leading-relaxed text-muted">
              {project.description}
            </p>

            {/* Tech tags */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.techTags.map((tag) => (
                <Tag key={tag} label={tag} />
              ))}
            </div>

            {/* Links */}
            <div className="mt-4 flex gap-4 font-body text-sm">
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent no-underline transition-colors duration-200 hover:underline"
              >
                GitHub &rarr;
              </a>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-accent no-underline transition-colors duration-200 hover:underline"
                >
                  Live &rarr;
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
