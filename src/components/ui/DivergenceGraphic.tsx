import { useState } from "react";
import {
  BRANCH_ACCENT,
  BRANCH_ACCENT_ORDER,
  BRANCH_RAIL_CX,
  BRANCH_GRAPHIC_VIEWBOX_WIDTH,
} from "../../lib/branchAccent";

/** Vertical gap between the origin node and where the branches start. */
const ORIGIN_GAP = 60;
/** Bottom padding so the branch-start circles aren't clipped by the viewBox edge. */
const CIRCLE_MARGIN = 16;
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

  const originCx = BRANCH_GRAPHIC_VIEWBOX_WIDTH / 2;
  const originCy = CIRCLE_MARGIN;
  const branchCy = originCy + ORIGIN_GAP;
  const viewBoxHeight = branchCy + CIRCLE_MARGIN;

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
