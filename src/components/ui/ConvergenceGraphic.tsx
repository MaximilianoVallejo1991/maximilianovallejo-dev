import { useState } from "react";
import {
  BRANCH_ACCENT,
  BRANCH_ACCENT_ORDER,
  BRANCH_RAIL_CX,
  BRANCH_GRAPHIC_VIEWBOX_WIDTH,
} from "../../lib/branchAccent";

interface ConvergenceGraphicProps {
  /** One end-offset (px, shared temporal scale) per branch, in branch array order. */
  branchEndOffsets: number[];
  /** Branch index currently toggled "active" (a branch-sweep click reached
   * its bottom) — stays lit even without hovering. */
  activeIndex?: number | null;
  /** True when every branch's line should render lit (each in its own
   * accent color) — the origin sweep reached the bottom on all of them. */
  allActive?: boolean;
  /** CSS transition-delay (ms) applied to the active line(s) — lets this
   * graphic's glow arrive exactly when the corresponding branch-sweep
   * animation above reaches its last node, continuing the wave down to
   * the terminal node instead of snapping on early. Ignored for hover. */
  revealDelayMs?: number;
  /**
   * When `false`, forces every line back to idle even though
   * `activeIndex`/`allActive` still identify a target branch — used for the
   * auto-fade-off animation. `activeIndex`/`allActive` (and thus
   * `revealDelayMs`) must stay pointed at the target the whole time so the
   * fade-OFF transition still waits the same `revealDelayMs` the fade-ON
   * did, instead of snapping off instantly the moment the target clears.
   * Defaults to `true`. Hover always overrides this — it's a direct,
   * real-time interaction, not part of the click-driven sweep.
   */
  lit?: boolean;
}

/** Top padding above the branch endpoint circles (r=7) — set to EXACTLY
 * their own radius (not TERMINAL_BOTTOM_MARGIN's more generous 16), so each
 * circle's own edge sits flush on the viewBox's top edge. This has to be
 * exact, not "radius plus a little buffer": since this SVG is
 * viewBox-scaled (`w-full h-auto`) while the HTML rail rendered just above
 * it in Experience.tsx is fixed-px, any extra buffer here would scale into
 * a real, viewport-width-dependent gap between them instead of a flush
 * touch at every width. */
const BRANCH_CIRCLE_TOP_MARGIN = 7;
/** Outer ring radius of the terminal node — same size as DivergenceGraphic's
 * origin node (top), on purpose: the two are meant to read as a matching
 * pair bookending the timeline, not one bigger than the other. */
const TERMINAL_RING_R = 18;
/** Inner filled dot radius — same 8/18 proportion as the origin node. */
const TERMINAL_DOT_R = 8;
/** Bottom padding around the terminal node — its "container", i.e. the
 * breathing room the node sits in, deliberately more generous than the
 * bare minimum needed to avoid clipping (TERMINAL_RING_R + a couple px)
 * so the node doesn't feel cramped against the viewBox's bottom edge.
 * Must stay >= TERMINAL_RING_R plus a little slack for its stroke —
 * getting that part wrong doesn't fail loudly, the ring just quietly clips
 * against the viewBox's bottom edge (same bug as DivergenceGraphic's
 * ORIGIN_CIRCLE_MARGIN, mirrored — see its own doc). */
const TERMINAL_BOTTOM_MARGIN = TERMINAL_RING_R + 20;
/** Vertical gap between the lowest (max-offset) endpoint and the terminal node. */
const TERMINAL_GAP = 60;
/** Invisible stroke width for the hover hit-target — a 2.5px line is
 * impractical to hover precisely with a real mouse. */
const HIT_STROKE_WIDTH = 20;

/**
 * Renders the branch-convergence SVG purely from `branchEndOffsets` — no
 * ResizeObserver, no getBoundingClientRect. Circle/line geometry is derived
 * by normalizing all offsets to the smallest one, so equal-height and
 * wildly-different-height branches both render without overlap or clipping.
 * Straight lines (not curves), idle in the same neutral gray as the rail
 * (`stroke-border`) and lighting up to that branch's accent color on hover
 * — matching the rest of the section's connector styling.
 */
export default function ConvergenceGraphic({
  branchEndOffsets,
  activeIndex,
  allActive,
  revealDelayMs,
  lit = true,
}: ConvergenceGraphicProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const minOffset = Math.min(...branchEndOffsets);
  const maxOffset = Math.max(...branchEndOffsets);
  const terminalCx = BRANCH_GRAPHIC_VIEWBOX_WIDTH / 2;
  const terminalCy = BRANCH_CIRCLE_TOP_MARGIN + (maxOffset - minOffset) + TERMINAL_GAP;
  const viewBoxHeight = terminalCy + TERMINAL_BOTTOM_MARGIN;

  const circles = branchEndOffsets.map((offset, index) => {
    const branchName = BRANCH_ACCENT_ORDER[index];
    return {
      cx: BRANCH_RAIL_CX[index] ?? terminalCx,
      cy: BRANCH_CIRCLE_TOP_MARGIN + (offset - minOffset),
      // SVG `fill` (circle) needs the fill-* utility, not BRANCH_ACCENT.fill
      // (which is bg-* for HTML elements); `stroke` (line) matches directly.
      // Falls back to the generic accent color for any branch beyond the
      // known 3-column order (defensive — content currently has exactly 3).
      svgFill: branchName ? `fill-branch-${branchName}` : "fill-accent",
      stroke: BRANCH_ACCENT[branchName ?? "accent"].stroke,
    };
  });

  return (
    <svg
      viewBox={`0 0 ${BRANCH_GRAPHIC_VIEWBOX_WIDTH} ${viewBoxHeight}`}
      aria-hidden="true"
      focusable="false"
      className="hidden md:block w-full h-auto"
      fill="none"
    >
      {circles.map((c, index) => {
        const isSweepTarget = activeIndex === index || allActive;
        const isActive = hoveredIndex === index || (isSweepTarget && lit);
        // Only delay the click-driven "wave reaching the bottom" glow —
        // plain hover should still respond instantly. Stays keyed off
        // isSweepTarget (not `isActive`/`lit`), so the delay is still
        // applied when fading back out, not just lighting up.
        const isSweepActive = isSweepTarget && hoveredIndex !== index;
        return (
          <g key={`line-${index}`}>
            <line
              x1={c.cx}
              y1={c.cy}
              x2={terminalCx}
              y2={terminalCy}
              className={`transition-colors duration-300 ${isActive ? c.stroke : "stroke-border"}`}
              style={{ transitionDelay: isSweepActive && revealDelayMs ? `${revealDelayMs}ms` : "0ms" }}
              strokeWidth={2.5}
              strokeLinecap="round"
            />
            {/* Wide invisible hit-target — the visible line above is too thin to hover precisely. */}
            <line
              x1={c.cx}
              y1={c.cy}
              x2={terminalCx}
              y2={terminalCy}
              stroke="transparent"
              strokeWidth={HIT_STROKE_WIDTH}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex((current) => (current === index ? null : current))}
            />
          </g>
        );
      })}

      {circles.map((c, index) => (
        <circle key={`circle-${index}`} cx={c.cx} cy={c.cy} r={7} className={c.svgFill} />
      ))}

      {/* Terminal */}
      <circle
        cx={terminalCx}
        cy={terminalCy}
        r={TERMINAL_RING_R}
        className="fill-surface stroke-accent"
      />
      <circle cx={terminalCx} cy={terminalCy} r={TERMINAL_DOT_R} className="fill-accent" />
    </svg>
  );
}
