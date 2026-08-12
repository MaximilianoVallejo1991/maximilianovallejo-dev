import type { ExperienceBranch, Milestone } from "../data/content";
import { parseYearStart } from "./mergeMilestonesByYear";

/** Pixels per year on the shared temporal scale (desktop + mobile). */
export const YEAR_HEIGHT_PX = 100;

/** Clamp target for open-ended milestones ("Continua" / "Ongoing"). */
export const CURRENT_YEAR = 2026;

export type TimelineItem =
  | { type: "milestone"; id: string; data: Milestone; yearStart: number }
  | {
      type: "spacer";
      id: string;
      yearFrom: number;
      yearTo: number;
      height: number;
    };

export interface BranchLayout {
  branchKey: string;
  /** (branchFirstYear - globalMinYear) * YEAR_HEIGHT_PX */
  topOffset: number;
  /** (branchLastYear - globalMinYear) * YEAR_HEIGHT_PX */
  endOffset: number;
  /** endOffset - topOffset */
  height: number;
  items: TimelineItem[];
}

/**
 * Resolves a year string to a numeric year for POSITIONING purposes
 * (sorting, topOffset, a milestone's own yearStart).
 * Ranges ("2021–2022") resolve to their START year. Open-ended tokens
 * ("Continua" / "Ongoing") clamp to currentYear rather than leaking
 * Number.POSITIVE_INFINITY into layout math.
 */
export function resolveYear(
  yearStr: string,
  currentYear: number = CURRENT_YEAR,
): number {
  const start = parseYearStart(yearStr);
  return Number.isFinite(start) ? start : currentYear;
}

/**
 * Resolves the END year of a milestone's year string — used only to compute
 * the OUTGOING spacer boundary for range milestones ("2021–2022" ends in
 * 2022, even though it positions/sorts at its start year, 2021). Simple
 * years and open-ended tokens resolve the same as resolveYear.
 */
function resolveYearEnd(
  yearStr: string,
  currentYear: number = CURRENT_YEAR,
): number {
  const matches = yearStr.match(/\d{4}/g);
  if (!matches || matches.length === 0) return currentYear;
  return Number(matches[matches.length - 1]);
}

/**
 * Turns a chronologically-ordered list of milestones into a flat
 * TimelineItem[] alternating milestone/spacer, on the shared YEAR_HEIGHT_PX
 * scale. Generic over any `{ year: string }`-bearing entry ordered by the
 * caller — used for both a single branch (desktop) and the globally merged
 * mobile list.
 *
 * Open-ended last entry ("Continua"/"Ongoing", detected via `parseYearStart`
 * returning a non-finite value): rather than positioning that milestone's
 * own node at the clamped CURRENT_YEAR (which would visually sit at the
 * bottom of the scale instead of at its true start), it is ANCHORED at the
 * previous item's end year, and a TRAILING spacer is appended after it
 * running from that anchor to CURRENT_YEAR. This moves the "time since"
 * gap to where it visually belongs: after the open-ended node, leading
 * toward "now".
 */
export function buildTimelineWithSpacers(
  milestones: Milestone[],
  // Accepted (not used in per-item math) to keep the call signature uniform
  // across desktop/mobile callers. Item heights are relative between
  // consecutive entries, not anchored — anchoring to globalMinYear happens
  // one level up, in getBranchLayout's topOffset/endOffset.
  _globalMinYear: number,
  idPrefix = "item",
): TimelineItem[] {
  const items: TimelineItem[] = [];

  const lastIndex = milestones.length - 1;
  const lastMilestone = milestones[lastIndex];
  const isLastOpenEnded =
    lastIndex >= 0 && !Number.isFinite(parseYearStart(lastMilestone.year));
  // Anchor year for the open-ended last milestone: the previous item's end
  // year. Falls back to resolveYear when there's no previous item to anchor
  // against (single-milestone, open-ended branch — rare edge case).
  const anchorYear =
    isLastOpenEnded && lastIndex > 0
      ? resolveYearEnd(milestones[lastIndex - 1].year)
      : resolveYear(lastMilestone?.year ?? "");

  milestones.forEach((milestone, index) => {
    const isLast = index === lastIndex;
    const isAnchoredOpenEnded = isLast && isLastOpenEnded;

    const yearStart = isAnchoredOpenEnded ? anchorYear : resolveYear(milestone.year);
    items.push({
      type: "milestone",
      id: `${idPrefix}:milestone:${index}:${milestone.year}`,
      data: milestone,
      yearStart,
    });

    const outgoingYear = isAnchoredOpenEnded ? anchorYear : resolveYearEnd(milestone.year);
    const next = milestones[index + 1];

    if (next) {
      // If `next` is the anchored open-ended last milestone, its resolved
      // position is the anchor year (not CURRENT_YEAR) — this collapses the
      // inline spacer immediately preceding it to 0px, since the trailing
      // spacer after it now carries the "time since" gap instead.
      const nextIsAnchoredOpenEnded = index + 1 === lastIndex && isLastOpenEnded;
      const yearTo = nextIsAnchoredOpenEnded ? anchorYear : resolveYear(next.year);
      const height = Math.max(0, yearTo - outgoingYear) * YEAR_HEIGHT_PX;

      items.push({
        type: "spacer",
        id: `${idPrefix}:spacer:${index}:${outgoingYear}-${yearTo}`,
        yearFrom: outgoingYear,
        yearTo,
        height,
      });
    } else if (isAnchoredOpenEnded) {
      const height = Math.max(0, CURRENT_YEAR - outgoingYear) * YEAR_HEIGHT_PX;
      items.push({
        type: "spacer",
        id: `${idPrefix}:spacer:${index}:trailing:${outgoingYear}-${CURRENT_YEAR}`,
        yearFrom: outgoingYear,
        yearTo: CURRENT_YEAR,
        height,
      });
    }
  });

  return items;
}

/**
 * Computes a branch's position on the shared temporal scale: how far down
 * it starts (topOffset), where it ends (endOffset), its total height, and
 * its TimelineItem[] (milestones + spacers).
 */
export function getBranchLayout(
  branch: ExperienceBranch,
  globalMinYear: number,
): BranchLayout {
  const items = buildTimelineWithSpacers(
    branch.milestones,
    globalMinYear,
    branch.branchKey,
  );

  const firstYear = resolveYear(branch.milestones[0].year);
  // Derive the end year from the last TimelineItem, not from re-resolving
  // the last milestone's raw year string: when the branch ends on an
  // open-ended milestone, buildTimelineWithSpacers appends a trailing
  // spacer whose yearTo is the true end of the scale (CURRENT_YEAR) — the
  // milestone itself is now anchored earlier and no longer carries that.
  const lastItem = items[items.length - 1];
  const lastYear = lastItem.type === "spacer" ? lastItem.yearTo : lastItem.yearStart;

  const topOffset = Math.max(0, firstYear - globalMinYear) * YEAR_HEIGHT_PX;
  const endOffset = Math.max(0, lastYear - globalMinYear) * YEAR_HEIGHT_PX;

  return {
    branchKey: branch.branchKey,
    topOffset,
    endOffset,
    height: endOffset - topOffset,
    items,
  };
}

/**
 * Returns the spacer ids that should be illuminated when hovering a
 * milestone, per its (optional) hoverIllumination config. Data-only — no
 * event handlers or styling are wired here (deferred behavior).
 */
export function getSpacersToHighlight(
  milestone: Milestone,
  items: TimelineItem[],
): string[] {
  if (!milestone.hoverIllumination) return [];

  const targetIndex = items.findIndex(
    (item) => item.type === "milestone" && item.data === milestone,
  );
  if (targetIndex === -1) return [];

  const target = items[targetIndex] as Extract<TimelineItem, { type: "milestone" }>;
  const { upwardsYears = 0, downwardsYears = 0 } = milestone.hoverIllumination;

  const ids: string[] = [];
  items.forEach((item, index) => {
    if (item.type !== "spacer") return;

    // "Upward" = spacers preceding the milestone in render order; "downward"
    // = spacers following it. Position (not just year math) disambiguates
    // same-year adjacent spacers from actually being on the wrong side.
    if (index < targetIndex && upwardsYears > 0) {
      const distance = target.yearStart - Number(item.yearFrom);
      if (distance <= upwardsYears) ids.push(item.id);
    }
    if (index > targetIndex && downwardsYears > 0) {
      const distance = Number(item.yearTo) - target.yearStart;
      if (distance <= downwardsYears) ids.push(item.id);
    }
  });

  return ids;
}
