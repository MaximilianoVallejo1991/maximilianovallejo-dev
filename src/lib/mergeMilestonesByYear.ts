import type { ExperienceBranch, Milestone } from "../data/content";
import type { BranchAccentKey } from "./branchAccent";

export interface MergedMilestone {
  milestone: Milestone;
  branchKey: string;
  branchLabel: string;
  accentKey: BranchAccentKey;
}

/** First 4-digit run in the year string; Infinity when absent ("Continua"/"Ongoing" sort last). */
export function parseYearStart(year: string): number {
  const match = year.match(/\d{4}/);
  return match ? Number(match[0]) : Number.POSITIVE_INFINITY;
}

interface DecoratedMilestone extends MergedMilestone {
  yearStart: number;
  branchIndex: number;
}

export function mergeMilestonesByYear(
  branches: ExperienceBranch[],
): MergedMilestone[] {
  const decorated: DecoratedMilestone[] = branches.flatMap(
    (branch, branchIndex) =>
      branch.milestones.map((milestone) => ({
        milestone,
        branchKey: branch.branchKey,
        branchLabel: branch.branchLabel,
        accentKey: branch.accentKey,
        yearStart: parseYearStart(milestone.year),
        branchIndex,
      })),
  );

  decorated.sort((a, b) => {
    if (a.yearStart !== b.yearStart) return a.yearStart < b.yearStart ? -1 : 1;
    return a.branchIndex - b.branchIndex;
  });

  return decorated.map(({ milestone, branchKey, branchLabel, accentKey }) => ({
    milestone,
    branchKey,
    branchLabel,
    accentKey,
  }));
}
