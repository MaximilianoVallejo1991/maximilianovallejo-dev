import { useState } from "react";
import { motion } from "motion/react";
import { fadeInItem } from "./SectionWrapper";
import type { Milestone } from "../../data/content";
import type { BranchAccentKey } from "../../lib/branchAccent";
import { BRANCH_ACCENT } from "../../lib/branchAccent";
import { getHighlightPlanFromMilestone, type TimelineItem } from "../../lib/timelineScale";
import IconMap from "./IconMap";

interface TimelineNodeProps {
  milestone: Milestone;
  index: number;
  accentKey?: BranchAccentKey;
  icon?: string;
  /** Full item list of the branch/merged list this milestone belongs to — required to resolve which spacers light up on hover. */
  items?: TimelineItem[];
  /** Called with the hover animation plan (spacer id -> delay step) on hover, or an empty map on mouse leave. */
  onHover?: (spacerSteps: Map<string, number>) => void;
  /**
   * Pixel offset from the top of the parent `<ol>` (which must be
   * `position: relative`) on the shared temporal scale — same coordinate
   * space as `Spacer`'s `top`. This element is `position: absolute` so
   * its real text height can never push a sibling's position; the caller
   * (Experience.tsx) supplies the exact year-based offset.
   */
  top?: number;
  /**
   * Defined (as a CSS transition-delay in ms) when a hovered SPACER (not
   * this node) claims this milestone — i.e. this node's own
   * hoverIllumination range reaches that connector segment, or it's the
   * segment's direct neighbor. Native CSS `:hover`/`group-hover` can only
   * react to the cursor being over THIS element, so illuminating a node
   * from a sibling spacer's hover needs an explicit prop instead.
   * `undefined` means not externally highlighted.
   */
  highlightDelayMs?: number;
}

export default function TimelineNode({
  milestone,
  index,
  accentKey = "accent",
  icon,
  items,
  onHover,
  top = 0,
  highlightDelayMs,
}: TimelineNodeProps) {
  const [imgError, setImgError] = useState(false);
  const accent = BRANCH_ACCENT[accentKey];
  const highlighted = highlightDelayMs !== undefined;
  // Only ever applied alongside the *active* (highlighted) classes below —
  // the real :hover-driven group-hover transitions stay instant/CSS-timed.
  const activeStyle = highlighted ? { transitionDelay: `${highlightDelayMs}ms` } : undefined;

  const handleMouseEnter = () => {
    if (!onHover || !items) return;
    onHover(getHighlightPlanFromMilestone(milestone, items));
  };

  const handleMouseLeave = () => {
    if (!onHover) return;
    onHover(new Map());
  };

  return (
    <motion.li
      {...fadeInItem(index)}
      className="group absolute inset-x-0 flex gap-4"
      style={{ top: `${top}px` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dot — only this element gets the hover ring/glow, never the whole card */}
      <div
        data-testid="timeline-dot"
        className={`relative z-10 mt-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 bg-surface transition-shadow duration-200 ${accent.ring} ${accent.ringGlow} ${highlighted ? accent.activeRingGlow : ""}`}
        style={activeStyle}
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
          className={`font-body text-xs font-semibold uppercase tracking-wider ${accent.text} group-hover:font-bold ${highlighted ? "font-bold" : ""}`}
        >
          {milestone.year}
        </span>
        <h4
          className={`mt-0.5 font-heading text-base font-semibold text-primary transition-colors duration-200 ${accent.hoverText} ${highlighted ? accent.activeHoverText : ""}`}
          style={activeStyle}
        >
          {milestone.title}
        </h4>
        <p
          className={`mt-1 font-body text-sm leading-relaxed text-muted transition-colors duration-200 group-hover:text-primary ${highlighted ? "text-primary" : ""}`}
          style={activeStyle}
        >
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
