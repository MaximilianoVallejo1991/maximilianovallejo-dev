export type BranchAccentKey = "soft" | "trade" | "study" | "accent";

export interface BranchAccentClasses {
  ring: string; // dot border
  fill: string; // dot core + legend chip
  text: string; // year label
  stroke: string; // SVG path/circle
  highlightBg: string; // spacer illumination background (10% opacity — subtle tint, not a solid fill)
  ringGlow: string; // dot hover glow (group-hover ring + shadow, full compound literal for Tailwind's static scanner)
  hoverText: string; // title hover text color (group-hover variant, full compound literal)
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
  },
};
