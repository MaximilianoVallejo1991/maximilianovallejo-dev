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
      className="group relative cursor-pointer rounded-xl border border-border bg-surface transition-[border-color,opacity,border-radius,box-shadow] duration-300 hover:z-10 hover:rounded-b-none hover:border-accent/40 hover:shadow-xl group-hover/grid:!opacity-40 hover:!opacity-100"
    >
      {/* Screenshot / fallback */}
      <div className="relative z-20 aspect-video w-full overflow-hidden rounded-t-xl bg-border/30">
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

      <div className="relative z-20 bg-surface p-5">
        <h3 className="font-heading text-lg font-semibold text-primary">
          {project.title}
        </h3>
      </div>

      {/* Reveal — positioned absolute so it overlays on hover instead of
          growing the card's box height. Growing in-flow would grow the
          grid row and push whatever comes after the grid (e.g. the
          Skills section) down the page; taking it out of flow keeps
          surrounding layout perfectly still.
          Width is deliberately 100%+2px (-left-px/-right-px) instead of
          a plain inset-x-0: a `position: absolute` box and the article's
          own normal-flow border resolve their fractional grid width
          through different rounding paths in Chromium, so even an
          identical CSS width can land the two borders 1 physical pixel
          apart — visible as a narrower reveal panel. Overshooting by a
          hair guarantees the reveal is never narrower than the card
          above it, whichever way that rounding goes.
          Sits at a lower z-index than the image/title above, and starts
          translated up underneath them — so as it slides down into view
          it reads as sliding out from behind the image, not just fading
          in below the title. Border color/width match the card's own
          border exactly (same accent tint on hover) so the outline reads
          as one continuous edge instead of two stacked pieces. */}
      <div className="pointer-events-none absolute -left-px top-full z-10 w-[calc(100%+2px)] -translate-y-28 rounded-b-xl border-x border-b border-border bg-surface p-5 pt-3 opacity-0 transition-[opacity,transform,border-color] duration-300 ease-out motion-reduce:transition-none group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:border-accent/40 group-hover:opacity-100">
        <p className="font-body text-sm leading-relaxed text-muted">
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
    </motion.article>
  );
}
