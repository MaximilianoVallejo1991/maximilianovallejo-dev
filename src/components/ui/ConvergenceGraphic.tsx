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
}

/** Top padding so the smallest-offset circle isn't clipped by the viewBox edge. */
const CIRCLE_MARGIN = 16;
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
}: ConvergenceGraphicProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const minOffset = Math.min(...branchEndOffsets);
  const maxOffset = Math.max(...branchEndOffsets);
  const terminalCx = BRANCH_GRAPHIC_VIEWBOX_WIDTH / 2;
  const terminalCy = CIRCLE_MARGIN + (maxOffset - minOffset) + TERMINAL_GAP;
  const viewBoxHeight = terminalCy + CIRCLE_MARGIN;

  const circles = branchEndOffsets.map((offset, index) => {
    const branchName = BRANCH_ACCENT_ORDER[index];
    return {
      cx: BRANCH_RAIL_CX[index] ?? terminalCx,
      cy: CIRCLE_MARGIN + (offset - minOffset),
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
        const isActive = hoveredIndex === index || activeIndex === index || allActive;
        // Only delay the click-driven "wave reaching the bottom" glow —
        // plain hover should still respond instantly.
        const isSweepActive = (activeIndex === index || allActive) && hoveredIndex !== index;
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
      <circle cx={terminalCx} cy={terminalCy} r={18} className="fill-surface stroke-accent" />
      <circle cx={terminalCx} cy={terminalCy} r={8} className="fill-accent" />
    </svg>
  );
}
