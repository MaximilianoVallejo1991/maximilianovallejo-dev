import { useState } from "react";
import { motion } from "motion/react";
import { fadeInItem } from "./SectionWrapper";
import type { Milestone } from "../../data/content";
import type { BranchAccentKey } from "../../lib/branchAccent";
import { BRANCH_ACCENT } from "../../lib/branchAccent";
import IconMap from "./IconMap";

interface TimelineNodeProps {
  milestone: Milestone;
  isLast: boolean;
  index: number;
  accentKey?: BranchAccentKey;
  icon?: string;
}

export default function TimelineNode({
  milestone,
  isLast,
  index,
  accentKey = "accent",
  icon,
}: TimelineNodeProps) {
  const [imgError, setImgError] = useState(false);
  const accent = BRANCH_ACCENT[accentKey];

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
      <div
        data-testid="timeline-dot"
        className={`relative z-10 mt-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 bg-surface ${accent.ring}`}
      >
        {icon ? (
          <IconMap name={icon} className={`h-3 w-3 ${accent.text}`} />
        ) : (
          <div className={`h-2 w-2 rounded-full ${accent.fill}`} />
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        <span className={`font-body text-xs font-semibold uppercase tracking-wider ${accent.text}`}>
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
