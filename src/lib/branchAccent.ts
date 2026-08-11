export type BranchAccentKey = "soft" | "trade" | "study" | "accent";

export interface BranchAccentClasses {
  ring: string; // dot border
  fill: string; // dot core + legend chip
  text: string; // year label
  stroke: string; // SVG path/circle
}

export const BRANCH_ACCENT: Record<BranchAccentKey, BranchAccentClasses> = {
  accent: { ring: "border-accent", fill: "bg-accent", text: "text-accent", stroke: "stroke-accent" },
  soft: { ring: "border-branch-soft", fill: "bg-branch-soft", text: "text-branch-soft", stroke: "stroke-branch-soft" },
  trade: { ring: "border-branch-trade", fill: "bg-branch-trade", text: "text-branch-trade", stroke: "stroke-branch-trade" },
  study: { ring: "border-branch-study", fill: "bg-branch-study", text: "text-branch-study", stroke: "stroke-branch-study" },
};
