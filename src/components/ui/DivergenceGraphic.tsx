import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  BRANCH_ACCENT,
  BRANCH_ACCENT_ORDER,
  BRANCH_RAIL_CX,
  BRANCH_GRAPHIC_VIEWBOX_WIDTH,
} from "../../lib/branchAccent";

/** Vertical gap between the origin node and where the branches start. */
const ORIGIN_GAP = 60;
/** Starting radius of the pulsing "click me" ring around the origin node —
 * see its own render comment below. */
const PULSE_RING_R = 20;
/** How large (as a multiple of PULSE_RING_R) the pulse grows before fading
 * out — must stay in sync with the `scale` in its `animate` prop below. */
const PULSE_MAX_SCALE = 1.7;
/** Top padding so the origin node isn't clipped by the viewBox edge. Must
 * be >= the tallest thing centered here — not the static node's own radius
 * (18) but the pulsing ring around it, which grows to PULSE_RING_R *
 * PULSE_MAX_SCALE (34) before fading out, plus a little slack for its
 * stroke. Getting this wrong doesn't fail loudly: the ring just quietly
 * clips against the viewBox's top edge mid-animation. */
const ORIGIN_CIRCLE_MARGIN = PULSE_RING_R * PULSE_MAX_SCALE + 2;
/** Bottom padding below the branch-start circles (r=7) — set to EXACTLY
 * their own radius (not ORIGIN_CIRCLE_MARGIN's more generous 16), so each
 * circle's own edge sits flush on the viewBox's bottom edge. This has to be
 * exact, not "radius plus a little buffer": since this SVG is
 * viewBox-scaled (`w-full h-auto`) while the HTML connector rendered just
 * below it in Experience.tsx is fixed-px, any extra buffer here would scale
 * into a real, viewport-width-dependent gap between them instead of a
 * flush touch at every width. */
const BRANCH_CIRCLE_BOTTOM_MARGIN = 7;
/** Invisible stroke width for the hover hit-target — a 2.5px line is
 * impractical to hover precisely with a real mouse. */
const HIT_STROKE_WIDTH = 20;

interface DivergenceGraphicProps {
  /** Branch index (matching BRANCH_ACCENT_ORDER / experience.branches
   * order) currently toggled "active" — stays lit even without hovering.
   * `null`/undefined when no branch is active. */
  activeIndex?: number | null;
  /** True when ALL branches should render lit (each in its own accent
   * color) — the origin node was clicked, sweeping every branch at once. */
  allActive?: boolean;
  /** Called with the branch index when its line (or wide hit-target) is
   * clicked — the caller decides what "clicking a branch" means (e.g.
   * toggling a full top-to-bottom sweep of that column). This SVG stays
   * `aria-hidden` since the same action is also reachable via each
   * column's own accessible branch-label button — click here is a bonus
   * pointer-only affordance, not the only way to trigger it. */
  onBranchClick?: (index: number) => void;
  /** Called when the origin node (or its wide hit-target) is clicked —
   * the caller decides what "clicking the origin" means (e.g. sweeping
   * every branch at once). Also reachable via the accessible origin-label
   * button rendered alongside this graphic, same reasoning as onBranchClick. */
  onOriginClick?: () => void;
}

/**
 * Renders the branch-divergence SVG — the mirror image of
 * ConvergenceGraphic, placed ABOVE the 3-column grid instead of below it.
 * A single origin node fans out into one straight line per branch, idle in
 * the same neutral gray as the rail (`stroke-border`) and lighting up to
 * that branch's accent color on hover OR while `activeIndex` matches it.
 * No per-branch offset data is needed: every branch's own leading spacer
 * (see getBranchLayout) already anchors all 3 columns to the exact same
 * start height, so this is a fixed, symmetric 3-way fan rather than
 * something driven by real layout numbers the way ConvergenceGraphic is.
 */
export default function DivergenceGraphic({
  activeIndex,
  allActive,
  onBranchClick,
  onOriginClick,
}: DivergenceGraphicProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const originCx = BRANCH_GRAPHIC_VIEWBOX_WIDTH / 2;
  const originCy = ORIGIN_CIRCLE_MARGIN;
  const branchCy = originCy + ORIGIN_GAP;
  const viewBoxHeight = branchCy + BRANCH_CIRCLE_BOTTOM_MARGIN;

  const circles = BRANCH_ACCENT_ORDER.map((branchName, index) => ({
    cx: BRANCH_RAIL_CX[index] ?? originCx,
    cy: branchCy,
    svgFill: `fill-branch-${branchName}`,
    stroke: BRANCH_ACCENT[branchName].stroke,
  }));

  return (
    <svg
      viewBox={`0 0 ${BRANCH_GRAPHIC_VIEWBOX_WIDTH} ${viewBoxHeight}`}
      aria-hidden="true"
      focusable="false"
      className="hidden md:block w-full h-auto"
      fill="none"
    >
      {circles.map((c, index) => (
        <g key={`line-${index}`}>
          <line
            x1={originCx}
            y1={originCy}
            x2={c.cx}
            y2={c.cy}
            className={
              hoveredIndex === index || activeIndex === index || allActive
                ? c.stroke
                : "stroke-border"
            }
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          {/* Wide invisible hit-target — the visible line above is too thin to hover/click precisely. */}
          <line
            x1={originCx}
            y1={originCy}
            x2={c.cx}
            y2={c.cy}
            stroke="transparent"
            strokeWidth={HIT_STROKE_WIDTH}
            className={onBranchClick ? "cursor-pointer" : undefined}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex((current) => (current === index ? null : current))}
            onClick={() => onBranchClick?.(index)}
          />
        </g>
      ))}

      {circles.map((c, index) => (
        <circle key={`circle-${index}`} cx={c.cx} cy={c.cy} r={7} className={c.svgFill} />
      ))}

      {/* Origin */}
      {/* Pulsing ring, hinting the origin node is clickable before the
          user's first hover/click ever happens — a static circle with only
          a hover state gives no clue it does anything. Paused once the
          user has already swept everything (`allActive`, so it doesn't
          keep pulsing under an already-lit ring) and skipped entirely for
          prefers-reduced-motion (purely decorative, not informational).
          `originX`/`originY` (framer-motion's own fractional transform
          origin, not raw CSS `transform-origin`) scale it from its own
          center regardless of this SVG's viewBox coordinate system. */}
      {onOriginClick && !allActive && !prefersReducedMotion && (
        <motion.circle
          cx={originCx}
          cy={originCy}
          r={PULSE_RING_R}
          className="pointer-events-none fill-none stroke-accent"
          strokeWidth={2}
          style={{ originX: 0.5, originY: 0.5 }}
          initial={{ opacity: 0.6, scale: 0.85 }}
          animate={{ opacity: 0, scale: PULSE_MAX_SCALE }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <circle cx={originCx} cy={originCy} r={18} className="fill-surface stroke-accent" />
      <circle cx={originCx} cy={originCy} r={8} className="fill-accent" />
      {/* Wide invisible hit-target — same reasoning as the per-branch ones above. */}
      <circle
        cx={originCx}
        cy={originCy}
        r={22}
        fill="transparent"
        className={onOriginClick ? "cursor-pointer" : undefined}
        onClick={onOriginClick}
      />
    </svg>
  );
}
