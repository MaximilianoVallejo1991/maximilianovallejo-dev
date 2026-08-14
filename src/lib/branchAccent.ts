export type BranchAccentKey = "soft" | "trade" | "study" | "accent";

/** Branch order shared by every cross-branch graphic (Convergence/
 * Divergence/diagonal connectors) — must match `experience.branches`'
 * real array order (soft, trade, study) so a graphic's index-based
 * geometry lines up with the actual rendered column each branch occupies. */
export const BRANCH_ACCENT_ORDER: BranchAccentKey[] = ["soft", "trade", "study"];

/** Shared 900-unit-wide viewBox convention for every cross-branch SVG
 * graphic in the Experience section (Convergence/Divergence/diagonal
 * connector overlay), so they all agree on where each column's rail sits. */
export const BRANCH_GRAPHIC_VIEWBOX_WIDTH = 900;

/**
 * Rail x-position per branch column (soft/trade/study, left-to-right),
 * in BRANCH_GRAPHIC_VIEWBOX_WIDTH units. NOT derived from an equal-thirds
 * assumption — that undershoots, because the grid's fixed 32px (`gap-8`)
 * column gaps eat a bigger/smaller fraction of the total width depending
 * on viewport, shifting real column start positions left of a naive guess.
 * Calibrated by measuring the real rendered grid at a common desktop width
 * (1280px window / 1120px grid: real rail x = 11px, 395px, 779px -> scaled
 * to a 900-unit viewBox). Good enough at typical desktop widths; not exact
 * at every viewport size without DOM measurement (see the no-ResizeObserver
 * guard test on these graphics).
 */
export const BRANCH_RAIL_CX = [9, 317, 626];

export interface BranchAccentClasses {
  ring: string; // dot border
  fill: string; // dot core + legend chip
  text: string; // year label
  stroke: string; // SVG path/circle
  highlightBg: string; // spacer illumination background (10% opacity — subtle tint, not a solid fill)
  ringGlow: string; // dot hover glow (group-hover ring + shadow, full compound literal for Tailwind's static scanner)
  hoverText: string; // title hover text color (group-hover variant, full compound literal)
  /** Same visual as ringGlow, unconditional (no group-hover:) — applied via
   * an explicit `highlighted` prop when a hovered SPACER (not this node
   * itself) claims this node, since CSS :hover can't do that. */
  activeRingGlow: string;
  /** Same visual as hoverText, unconditional — see activeRingGlow. */
  activeHoverText: string;
}

export const BRANCH_ACCENT: Record<BranchAccentKey, BranchAccentClasses> = {
  accent: {
    ring: "border-accent",
    fill: "bg-accent",
    text: "text-accent",
    stroke: "stroke-accent",
    highlightBg: "bg-accent/10",
    ringGlow:
      "group-hover:ring-2 group-hover:ring-accent/50 group-hover:ring-offset-2 group-hover:ring-offset-surface group-hover:shadow-lg group-hover:shadow-accent/20",
    hoverText: "group-hover:text-accent",
    activeRingGlow:
      "ring-2 ring-accent/50 ring-offset-2 ring-offset-surface shadow-lg shadow-accent/20",
    activeHoverText: "text-accent",
  },
  soft: {
    ring: "border-branch-soft",
    fill: "bg-branch-soft",
    text: "text-branch-soft",
    stroke: "stroke-branch-soft",
    highlightBg: "bg-branch-soft/10",
    ringGlow:
      "group-hover:ring-2 group-hover:ring-branch-soft/50 group-hover:ring-offset-2 group-hover:ring-offset-surface group-hover:shadow-lg group-hover:shadow-branch-soft/20",
    hoverText: "group-hover:text-branch-soft",
    activeRingGlow:
      "ring-2 ring-branch-soft/50 ring-offset-2 ring-offset-surface shadow-lg shadow-branch-soft/20",
    activeHoverText: "text-branch-soft",
  },
  trade: {
    ring: "border-branch-trade",
    fill: "bg-branch-trade",
    text: "text-branch-trade",
    stroke: "stroke-branch-trade",
    highlightBg: "bg-branch-trade/10",
    ringGlow:
      "group-hover:ring-2 group-hover:ring-branch-trade/50 group-hover:ring-offset-2 group-hover:ring-offset-surface group-hover:shadow-lg group-hover:shadow-branch-trade/20",
    hoverText: "group-hover:text-branch-trade",
    activeRingGlow:
      "ring-2 ring-branch-trade/50 ring-offset-2 ring-offset-surface shadow-lg shadow-branch-trade/20",
    activeHoverText: "text-branch-trade",
  },
  study: {
    ring: "border-branch-study",
    fill: "bg-branch-study",
    text: "text-branch-study",
    stroke: "stroke-branch-study",
    highlightBg: "bg-branch-study/10",
    ringGlow:
      "group-hover:ring-2 group-hover:ring-branch-study/50 group-hover:ring-offset-2 group-hover:ring-offset-surface group-hover:shadow-lg group-hover:shadow-branch-study/20",
    hoverText: "group-hover:text-branch-study",
    activeRingGlow:
      "ring-2 ring-branch-study/50 ring-offset-2 ring-offset-surface shadow-lg shadow-branch-study/20",
    activeHoverText: "text-branch-study",
  },
};
