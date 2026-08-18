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
 * in BRANCH_GRAPHIC_VIEWBOX_WIDTH units.
 *
 * Derived analytically, not measured, from the grid's own layout formula
 * (see Experience.tsx's `gap-x-[2.857%]` column gap): with a PERCENTAGE
 * column gap, each column's start is a pure fraction of the grid's width —
 * `frac_i = i * ((1 - 2*gap) / 3 + gap)` for gap = 0.02857 — so scaling that
 * fraction by the 900-unit viewBox is exact at ANY viewport width, unlike
 * the old fixed-32px-gap calibration (only exact at the one width it was
 * measured against, drifting worse per column further from the left edge).
 *
 * The one irreducible piece is the rail's own `left-[11px]` offset within
 * each column (fixed, to line up with the dot's real on-screen size — that
 * shouldn't scale with viewport) — converted to viewBox units against the
 * MIDDLE of the practical desktop width range (768-1152px content, i.e.
 * ~928px) rather than one endpoint, so residual error stays small and
 * symmetric across the whole supported range instead of growing toward one
 * side. Not derivable without DOM measurement (banned in these graphics —
 * see the no-ResizeObserver guard test); good enough that the residual
 * (a couple px at worst) is imperceptible.
 */
export const BRANCH_RAIL_CX = [10.7, 319.2, 627.8];

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
