import type { ExperienceBranch, Milestone } from "../data/content";
import { parseYearStart } from "./mergeMilestonesByYear";

/** Pixels per year on the shared temporal scale (desktop + mobile). */
export const YEAR_HEIGHT_PX = 100;

/** Legibility floor for a same-year milestone pair — never collapse to 0px.
 * Deliberately close to (but still distinguishable from) a real 1-year gap:
 * real milestone text needs close to a full YEAR_HEIGHT_PX-scale row of
 * room, confirmed by measuring rendered same-year pairs in the browser. */
export const SAME_YEAR_SPACER_HEIGHT_PX = 100;

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
  /** Real, floor-adjusted pixel height of this branch's rendered content
   * (sum of every spacer's height, including any leading/trailing spacers
   * synthesized to share the globalMinYear/CURRENT_YEAR origin — see
   * getBranchLayout). This is the authoritative value for sizing this
   * branch's container; it is NOT the same as year-telescoping math once
   * same-year floors or a branch's own internal date ranges are involved. */
  height: number;
  items: TimelineItem[];
}

/**
 * Resolves a year string to a numeric year for POSITIONING purposes
 * (sorting, a milestone's own yearStart).
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
 * Appends one spacer TimelineItem PER YEAR crossed between `outgoingYear`
 * and `yearTo`, instead of a single item spanning the whole gap. This is
 * what makes hover-illumination a simple count ("light the next N spacer
 * items") rather than a year-math distance check, and it's what lets a
 * single spacer element stay either fully lit or fully unlit — every
 * element already represents exactly one step on the scale.
 *
 * A same-year pair (yearTo === outgoingYear, or a degenerate/negative
 * diff clamped to it) still needs *some* visible room, so it gets exactly
 * one step at the legibility floor instead of zero steps.
 */
function pushSpacerSteps(
  items: TimelineItem[],
  idPrefix: string,
  indexLabel: number | string,
  outgoingYear: number,
  yearTo: number,
): void {
  const diff = Math.max(0, yearTo - outgoingYear);

  if (diff === 0) {
    items.push({
      type: "spacer",
      id: `${idPrefix}:spacer:${indexLabel}:0:${outgoingYear}-${yearTo}`,
      yearFrom: outgoingYear,
      yearTo,
      height: SAME_YEAR_SPACER_HEIGHT_PX,
    });
    return;
  }

  for (let step = 0; step < diff; step++) {
    const stepFrom = outgoingYear + step;
    const stepTo = stepFrom + 1;
    items.push({
      type: "spacer",
      id: `${idPrefix}:spacer:${indexLabel}:${step}:${stepFrom}-${stepTo}`,
      yearFrom: stepFrom,
      yearTo: stepTo,
      height: YEAR_HEIGHT_PX,
    });
  }
}

/**
 * Turns a chronologically-ordered list of milestones into a flat
 * TimelineItem[] alternating milestone/spacer(s), on the shared
 * YEAR_HEIGHT_PX scale. Generic over any `{ year: string }`-bearing entry
 * ordered by the caller — used for both a single branch (desktop) and the
 * globally merged mobile list. Purely local: every milestone (including
 * open-ended tokens like "Continua"/"Ongoing", which resolveYear/
 * resolveYearEnd naturally clamp to CURRENT_YEAR) is positioned at its own
 * resolved year — no special-casing for "the last milestone". Callers that
 * need every branch to share a common start/end point (see getBranchLayout)
 * add leading spacers around this function's output, not inside it.
 *
 * Each inter-milestone gap becomes MULTIPLE one-year spacer items (see
 * pushSpacerSteps) rather than one item spanning the whole gap — this is
 * what lets hover-illumination light an exact number of years instead of
 * an all-or-nothing whole segment.
 */
export function buildTimelineWithSpacers(
  milestones: Milestone[],
  idPrefix = "item",
): TimelineItem[] {
  const items: TimelineItem[] = [];

  milestones.forEach((milestone, index) => {
    const yearStart = resolveYear(milestone.year);
    items.push({
      type: "milestone",
      id: `${idPrefix}:milestone:${index}:${milestone.year}`,
      data: milestone,
      yearStart,
    });

    const next = milestones[index + 1];
    if (!next) return;

    const outgoingYear = resolveYearEnd(milestone.year);
    const yearTo = resolveYear(next.year);
    pushSpacerSteps(items, idPrefix, index, outgoingYear, yearTo);
  });

  return items;
}

/** Real, floor-adjusted pixel height needed to contain every
 * absolutely-positioned item in `items` — milestones are points and
 * contribute 0; only spacers occupy vertical space. This is the
 * authoritative "how tall is this rendered content" value, distinct from
 * (and generally larger than) naive year-telescoping once same-year floors
 * or a milestone's own internal date range are involved. */
export function getTimelineHeight(items: TimelineItem[]): number {
  return items.reduce((sum, item) => (item.type === "spacer" ? sum + item.height : sum), 0);
}

/**
 * Computes a branch's rendered timeline: its TimelineItem[] (milestones +
 * spacers) and total real height, on a scale shared across all branches —
 * every branch's items start at `globalMinYear` and end at CURRENT_YEAR,
 * so that all branches can be rendered to the same total container height
 * (see Experience.tsx, which pads every column to the tallest branch's
 * height) and converge visually at the same point.
 *
 * - If the branch's own first milestone starts after globalMinYear, a
 *   leading spacer (globalMinYear -> firstYear) is prepended so every
 *   branch's rail starts at the same origin.
 * - If the branch's own last milestone doesn't already resolve to
 *   CURRENT_YEAR (i.e. isn't an open-ended token like "Continua"), a
 *   synthetic `presentLabel` milestone is appended so every branch ends
 *   with a visible "now" marker, connected by a real, proportional spacer.
 */
export function getBranchLayout(
  branch: ExperienceBranch,
  globalMinYear: number,
  presentLabel: string,
): BranchLayout {
  const milestones = branch.milestones;
  const lastMilestone = milestones[milestones.length - 1];
  const alreadyReachesPresent = resolveYear(lastMilestone.year) === CURRENT_YEAR;

  const effectiveMilestones = alreadyReachesPresent
    ? milestones
    : [...milestones, { year: presentLabel, title: presentLabel, description: "" }];

  const items = buildTimelineWithSpacers(effectiveMilestones, branch.branchKey);

  const firstYear = resolveYear(milestones[0].year);
  if (firstYear > globalMinYear) {
    const leading: TimelineItem[] = [];
    pushSpacerSteps(leading, branch.branchKey, "leading", globalMinYear, firstYear);
    items.unshift(...leading);
  }

  return {
    branchKey: branch.branchKey,
    height: getTimelineHeight(items),
    items,
  };
}

/**
 * Returns the spacer ids that should be illuminated when hovering a
 * milestone, per its (optional) hoverIllumination config. Data-only — no
 * event handlers or styling are wired here (deferred behavior).
 *
 * Since buildTimelineWithSpacers now emits one spacer item per year (see
 * pushSpacerSteps), illumination is a plain COUNT: `upwardsYears` lights
 * the next N spacer items walking backward from the milestone, and
 * `downwardsYears` lights the next N walking forward. No year-math is
 * needed here anymore — every spacer item already represents exactly one
 * step on the scale, so "3 years" and "the 3 nearest spacer items" are the
 * same thing.
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

  const { upwardsYears = 0, downwardsYears = 0 } = milestone.hoverIllumination;
  const ids: string[] = [];

  let remainingUp = upwardsYears;
  for (let i = targetIndex - 1; i >= 0 && remainingUp > 0; i--) {
    const item = items[i];
    if (item.type !== "spacer") continue;
    ids.push(item.id);
    remainingUp -= 1;
  }

  let remainingDown = downwardsYears;
  for (let i = targetIndex + 1; i < items.length && remainingDown > 0; i++) {
    const item = items[i];
    if (item.type !== "spacer") continue;
    ids.push(item.id);
    remainingDown -= 1;
  }

  return ids;
}

/**
 * The reverse of getSpacersToHighlight: given a spacer's id, returns the
 * ids of every milestone whose own hoverIllumination range reaches that
 * spacer — i.e. hovering the connector segment itself should light up
 * whichever node(s) "claim" that year. Reuses getSpacersToHighlight rather
 * than re-deriving the counting logic, so the two directions can never
 * drift out of sync with each other.
 */
export function getMilestonesToHighlight(spacerId: string, items: TimelineItem[]): string[] {
  const ids: string[] = [];
  for (const item of items) {
    if (item.type !== "milestone" || !item.data.hoverIllumination) continue;
    if (getSpacersToHighlight(item.data, items).includes(spacerId)) {
      ids.push(item.id);
    }
  }
  return ids;
}
