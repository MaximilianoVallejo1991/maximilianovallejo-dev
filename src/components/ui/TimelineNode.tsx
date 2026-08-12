import { useState } from "react";
import { motion } from "motion/react";
import { fadeInItem } from "./SectionWrapper";
import type { Milestone } from "../../data/content";
import type { BranchAccentKey } from "../../lib/branchAccent";
import { BRANCH_ACCENT } from "../../lib/branchAccent";
import { getSpacersToHighlight, type TimelineItem } from "../../lib/timelineScale";
import IconMap from "./IconMap";

interface TimelineNodeProps {
  milestone: Milestone;
  index: number;
  accentKey?: BranchAccentKey;
  icon?: string;
  /** Full item list of the branch/merged list this milestone belongs to — required to resolve which spacers light up on hover. */
  items?: TimelineItem[];
  /** Called with the spacer ids to illuminate on hover, or `[]` on mouse leave. */
  onHover?: (spacerIds: string[]) => void;
}

export default function TimelineNode({
  milestone,
  index,
  accentKey = "accent",
  icon,
  items,
  onHover,
}: TimelineNodeProps) {
  const [imgError, setImgError] = useState(false);
  const accent = BRANCH_ACCENT[accentKey];

  const handleMouseEnter = () => {
    if (!onHover || !items) return;
    onHover(getSpacersToHighlight(milestone, items));
  };

  const handleMouseLeave = () => {
    if (!onHover) return;
    onHover([]);
  };

  return (
    <motion.li
      {...fadeInItem(index)}
      className="group relative flex gap-4"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dot — only this element gets the hover ring/glow, never the whole card */}
      <div
        data-testid="timeline-dot"
        className={`relative z-10 mt-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 bg-surface transition-shadow duration-200 ${accent.ring} ${accent.ringGlow}`}
      >
        {icon ? (
          <IconMap name={icon} className={`h-3 w-3 ${accent.text}`} />
        ) : (
          <div className={`h-2 w-2 rounded-full ${accent.fill}`} />
        )}
      </div>

      {/* Content — text elements highlight individually on hover, the card itself never does */}
      <div className="flex-1">
        <span
          className={`font-body text-xs font-semibold uppercase tracking-wider ${accent.text} group-hover:font-bold`}
        >
          {milestone.year}
        </span>
        <h4
          className={`mt-0.5 font-heading text-base font-semibold text-primary transition-colors duration-200 ${accent.hoverText}`}
        >
          {milestone.title}
        </h4>
        <p className="mt-1 font-body text-sm leading-relaxed text-muted transition-colors duration-200 group-hover:text-primary">
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
