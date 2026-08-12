import { BRANCH_ACCENT } from "../../lib/branchAccent";

interface ConvergenceGraphicProps {
  /** One end-offset (px, shared temporal scale) per branch, in branch array order. */
  branchEndOffsets: number[];
}

/** Fixed column x-positions, one per branch slot (matches the 3-column grid). */
const BRANCH_CX = [150, 450, 750];
/** Branch accent, in the same fixed order as BRANCH_CX (soft, trade, study). */
const BRANCH_ACCENT_ORDER: Array<keyof typeof BRANCH_ACCENT> = ["soft", "trade", "study"];
/** Top padding so the smallest-offset circle isn't clipped by the viewBox edge. */
const CIRCLE_MARGIN = 16;
/** Vertical gap between the lowest (max-offset) endpoint and the terminal node. */
const TERMINAL_GAP = 60;
const VIEWBOX_WIDTH = 900;

/**
 * Renders the branch-convergence SVG purely from `branchEndOffsets` — no
 * ResizeObserver, no getBoundingClientRect. Circle/path geometry is derived
 * by normalizing all offsets to the smallest one, so equal-height and
 * wildly-different-height branches both render without overlap or clipping.
 */
export default function ConvergenceGraphic({ branchEndOffsets }: ConvergenceGraphicProps) {
  const minOffset = Math.min(...branchEndOffsets);
  const maxOffset = Math.max(...branchEndOffsets);
  const terminalCx = VIEWBOX_WIDTH / 2;
  const terminalCy = CIRCLE_MARGIN + (maxOffset - minOffset) + TERMINAL_GAP;
  const viewBoxHeight = terminalCy + CIRCLE_MARGIN;

  const circles = branchEndOffsets.map((offset, index) => {
    const branchName = BRANCH_ACCENT_ORDER[index];
    return {
      cx: BRANCH_CX[index] ?? terminalCx,
      cy: CIRCLE_MARGIN + (offset - minOffset),
      // SVG `fill` (circle) needs the fill-* utility, not BRANCH_ACCENT.fill
      // (which is bg-* for HTML elements); `stroke` (path) matches directly.
      // Falls back to the generic accent color for any branch beyond the
      // known 3-column order (defensive — content currently has exactly 3).
      svgFill: branchName ? `fill-branch-${branchName}` : "fill-accent",
      stroke: BRANCH_ACCENT[branchName ?? "accent"].stroke,
    };
  });

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${viewBoxHeight}`}
      aria-hidden="true"
      focusable="false"
      className="hidden md:block w-full h-auto"
      fill="none"
    >
      {circles.map((c, index) => (
        <path
          key={`path-${index}`}
          d={`M${c.cx} ${c.cy} C${c.cx} ${(c.cy + terminalCy) / 2} ${terminalCx} ${(c.cy + terminalCy) / 2} ${terminalCx} ${terminalCy}`}
          className={c.stroke}
          strokeWidth={2.5}
          strokeLinecap="round"
          fill="none"
        />
      ))}

      {circles.map((c, index) => (
        <circle key={`circle-${index}`} cx={c.cx} cy={c.cy} r={7} className={c.svgFill} />
      ))}

      {/* Terminal */}
      <circle cx={terminalCx} cy={terminalCy} r={18} className="fill-surface stroke-accent" />
      <circle cx={terminalCx} cy={terminalCy} r={8} className="fill-accent" />
    </svg>
  );
}
