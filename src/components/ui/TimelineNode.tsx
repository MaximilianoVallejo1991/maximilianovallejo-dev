import { useState } from "react";
import { motion } from "motion/react";
import { fadeInItem } from "./SectionWrapper";
import type { Milestone } from "../../data/content";

interface TimelineNodeProps {
  milestone: Milestone;
  isLast: boolean;
  index: number;
}

export default function TimelineNode({ milestone, isLast, index }: TimelineNodeProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.li
      {...fadeInItem(index)}
      className="relative flex gap-4 pb-8"
    >
      {/* Connector line */}
      {!isLast && (
        <div className="absolute left-[11px] top-8 h-full w-px bg-border" aria-hidden="true" />
      )}

      {/* Dot */}
      <div className="relative z-10 mt-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-accent bg-surface">
        <div className="h-2 w-2 rounded-full bg-accent" />
      </div>

      {/* Content */}
      <div className="flex-1">
        <span className="font-body text-xs font-semibold uppercase tracking-wider text-accent">
          {milestone.year}
        </span>
        <h4 className="mt-0.5 font-heading text-base font-semibold text-primary">
          {milestone.title}
        </h4>
        <p className="mt-1 font-body text-sm leading-relaxed text-muted">
          {milestone.description}
        </p>

        {/* Optional thumbnail */}
        {milestone.photoUrl && !imgError && (
          <img
            src={milestone.photoUrl}
            alt={milestone.title}
            loading="lazy"
            className="mt-3 h-16 w-16 rounded-md object-cover"
            onError={() => setImgError(true)}
          />
        )}
      </div>
    </motion.li>
  );
}
