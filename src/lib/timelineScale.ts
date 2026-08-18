import type { ExperienceBranch, Milestone } from "../data/content";
import { parseYearStart } from "./mergeMilestonesByYear";

/** Pixels per year on the shared temporal scale (desktop + mobile). */
export const YEAR_HEIGHT_PX = 100;

/** Legibility floor for a same-year milestone pair — never collapse to 0px.
 * Deliberately close to (but still distinguishable from) a real 1-year gap:
 * real milestone text needs close to a full YEAR_HEIGHT_PX-scale row of
 * room, confirmed by measuring rendered same-year pairs in the browser. */
export const SAME_YEAR_SPACER_HEIGHT_PX = 100;

/**
 * Year ranges with NO milestone in ANY branch — real dead stretches on the
 * shared scale, not just one branch's own gap. `[from, to)`: every one-year
 * step fully inside the range (stepFrom >= from && stepTo <= to) renders at
 * COMPRESSED_YEAR_HEIGHT_PX instead of the normal YEAR_HEIGHT_PX.
 *
 * This lives in the CORE year->height mapping (yearStepHeight, used by
 * every branch's own pushSpacerSteps call, including leading spacers and
 * the merged mobile list) rather than as a per-branch special case — that's
 * what keeps it safe: since the SAME compressed height applies to every
 * branch whenever THEY cross this range too, a year outside the range still
 * lands at the exact same pixel offset in every column. Compressing one
 * branch's own gap independently would have desynced the shared temporal
 * scale (see BRANCH_RAIL_CX / DIAGONAL_CONNECTORS, which both assume it).
 *
 * Must stay in sync with the real milestone data (data/content.*.ts) — if a
 * milestone is ever added inside one of these ranges, it would render
 * compressed too and this range should shrink to exclude it.
 */
const COMPRESSED_YEAR_RANGES: ReadonlyArray<{ from: number; to: number }> = [
  // No branch has anything between 2000 (soft's "Scout") and 2007 (study's
  // first técnico) — 6 fully empty years.
  { from: 2000, to: 2007 },
  // No branch has anything between 2011 (study's "Ciclo Básico Ingeniería
  // Química") and 2015 (soft's "Instructor Scout") — 4 fully empty years.
  { from: 2011, to: 2015 },
];
/** Height per compressed year-step — small, not zero: a bare rail with
 * literally no vertical run would read as a broken/overlapping connector,
 * not "fast-forwarded". */
const COMPRESSED_YEAR_HEIGHT_PX = 16;

/** Height for the one-year step `stepFrom -> stepTo`: the normal
 * YEAR_HEIGHT_PX, or COMPRESSED_YEAR_HEIGHT_PX if the whole step falls
 * inside a COMPRESSED_YEAR_RANGES entry. */
function yearStepHeight(stepFrom: number, stepTo: number): number {
  const isCompressed = COMPRESSED_YEAR_RANGES.some(
    (range) => stepFrom >= range.from && stepTo <= range.to,
  );
  return isCompressed ? COMPRESSED_YEAR_HEIGHT_PX : YEAR_HEIGHT_PX;
}

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
      height: yearStepHeight(stepFrom, stepTo),
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
 * The cumulative `top` (px, shared temporal scale) of every item in
 * `items`, in the same order — exactly the running total that
 * Experience.tsx's render loop assigns to each TimelineNode/Spacer's own
 * `top` prop. Exposed standalone so other callers (e.g. a cross-branch
 * decorative connector) can look up "where does milestone X land" without
 * duplicating that accumulation logic.
 */
export function getCumulativeOffsets(items: TimelineItem[]): number[] {
  const offsets: number[] = [];
  let cumulative = 0;
  for (const item of items) {
    offsets.push(cumulative);
    if (item.type === "spacer") cumulative += item.height;
  }
  return offsets;
}

/**
 * Finds a milestone's own `top` (px) within `items` by year — years are
 * stable across locales (unlike titles, which translate), so this is the
 * safe way to anchor a decorative cross-branch connector to a specific
 * real-world milestone regardless of language. Returns `null` if no
 * milestone with that year exists.
 */
export function findMilestoneTopByYear(items: TimelineItem[], year: string): number | null {
  const offsets = getCumulativeOffsets(items);
  const index = items.findIndex((item) => item.type === "milestone" && item.data.year === year);
  return index === -1 ? null : offsets[index];
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

/** Milliseconds of CSS transition-delay per step of "distance" in the
 * traveling-light hover animation — the farther a segment/node is from
 * where the animation originates, the later it lights up. */
export const HIGHLIGHT_STEP_DELAY_MS = 70;

export interface SpacerDistanceStep {
  id: string;
  /** 1-indexed distance (in one-year segments) from the milestone that claims it. */
  distance: number;
}

/**
 * Returns the spacer ids a milestone's (optional) hoverIllumination config
 * reaches, each tagged with its distance (in year-segments) from that
 * milestone — `upwardsYears`/`downwardsYears` walked step by step, exactly
 * as getSpacersToHighlight does, but keeping the step count instead of
 * discarding it. This is what lets the hover animation "travel" outward
 * from the node one year at a time instead of snapping everything on at
 * once.
 */
export function getSpacersWithDistance(
  milestone: Milestone,
  items: TimelineItem[],
): SpacerDistanceStep[] {
  if (!milestone.hoverIllumination) return [];

  const targetIndex = items.findIndex(
    (item) => item.type === "milestone" && item.data === milestone,
  );
  if (targetIndex === -1) return [];

  const { upwardsYears = 0, downwardsYears = 0 } = milestone.hoverIllumination;
  const steps: SpacerDistanceStep[] = [];

  let distance = 0;
  let remainingUp = upwardsYears;
  for (let i = targetIndex - 1; i >= 0 && remainingUp > 0; i--) {
    const item = items[i];
    if (item.type !== "spacer") continue;
    distance += 1;
    steps.push({ id: item.id, distance });
    remainingUp -= 1;
  }

  distance = 0;
  let remainingDown = downwardsYears;
  for (let i = targetIndex + 1; i < items.length && remainingDown > 0; i++) {
    const item = items[i];
    if (item.type !== "spacer") continue;
    distance += 1;
    steps.push({ id: item.id, distance });
    remainingDown -= 1;
  }

  return steps;
}

/**
 * Returns the spacer ids that should be illuminated when hovering a
 * milestone, per its (optional) hoverIllumination config. Data-only — no
 * event handlers or styling are wired here (deferred behavior). A thin
 * wrapper over getSpacersWithDistance for callers that only need ids.
 */
export function getSpacersToHighlight(
  milestone: Milestone,
  items: TimelineItem[],
): string[] {
  return getSpacersWithDistance(milestone, items).map((s) => s.id);
}

/**
 * Hover-from-a-NODE animation plan: every reached spacer, mapped to its
 * delay step (0-indexed — the nearest segment lights first, each next one
 * `HIGHLIGHT_STEP_DELAY_MS` later), radiating outward from the node.
 */
export function getHighlightPlanFromMilestone(
  milestone: Milestone,
  items: TimelineItem[],
): Map<string, number> {
  const plan = new Map<string, number>();
  for (const step of getSpacersWithDistance(milestone, items)) {
    plan.set(step.id, step.distance - 1);
  }
  return plan;
}

export interface SpacerHighlightPlan {
  /** spacer id -> delay step (0 = lights first, i.e. the hovered segment itself) */
  spacers: Map<string, number>;
  /** milestone id -> delay step (0 = lights immediately, i.e. baseline adjacency) */
  milestones: Map<string, number>;
}

/**
 * Hover-from-a-SPACER animation plan: the reverse of
 * getHighlightPlanFromMilestone. The hovered segment itself always lights
 * first (step 0); from there:
 *
 * 1. Baseline adjacency — the milestone(s) immediately bordering this
 *    segment light up immediately too (step 0), regardless of any
 *    hoverIllumination config — a segment should never look "orphaned"
 *    from the nodes it sits between.
 * 2. Extended reach — for every OTHER milestone whose hoverIllumination
 *    range also covers this segment, the WHOLE path between the hovered
 *    segment and that milestone lights up, one step at a time, arriving
 *    at the milestone last — "marking the path" rather than lighting the
 *    hovered segment in isolation.
 */
export function getHighlightPlanFromSpacer(
  spacerId: string,
  items: TimelineItem[],
): SpacerHighlightPlan {
  const spacers = new Map<string, number>([[spacerId, 0]]);
  const milestones = new Map<string, number>();

  const spacerIndex = items.findIndex((item) => item.type === "spacer" && item.id === spacerId);
  if (spacerIndex === -1) return { spacers, milestones };

  const before = items[spacerIndex - 1];
  if (before?.type === "milestone") milestones.set(before.id, 0);
  const after = items[spacerIndex + 1];
  if (after?.type === "milestone") milestones.set(after.id, 0);

  for (const item of items) {
    if (item.type !== "milestone" || !item.data.hoverIllumination) continue;
    const claimed = getSpacersWithDistance(item.data, items);
    const hoveredStep = claimed.find((s) => s.id === spacerId);
    if (!hoveredStep) continue;

    for (const step of claimed) {
      if (step.distance > hoveredStep.distance) continue; // only between the hover point and this node
      const delay = hoveredStep.distance - step.distance;
      const existing = spacers.get(step.id);
      if (existing === undefined || delay < existing) spacers.set(step.id, delay);
    }

    const arrivalDelay = hoveredStep.distance;
    const existingMilestoneDelay = milestones.get(item.id);
    if (existingMilestoneDelay === undefined || arrivalDelay < existingMilestoneDelay) {
      milestones.set(item.id, arrivalDelay);
    }
  }

  return { spacers, milestones };
}

/**
 * The reverse of getSpacersToHighlight: given a spacer's id, returns the
 * ids of the milestone(s) that should light up when this connector segment
 * is hovered. A thin wrapper over getHighlightPlanFromSpacer for callers
 * that only need ids (see that function's doc for the two sources —
 * baseline adjacency + extended reach — this combines).
 */
export function getMilestonesToHighlight(spacerId: string, items: TimelineItem[]): string[] {
  return Array.from(getHighlightPlanFromSpacer(spacerId, items).milestones.keys());
}

/**
 * Full-branch "sweep" plan: every item in `items` (spacer or milestone)
 * gets a delay proportional to its own `top` as a FRACTION of `totalHeight`
 * — first item near delay 0, last item near delay `totalDurationMs` — so
 * clicking a branch's label (or its divergence-graphic line) lights the
 * whole column top-to-bottom in one smooth wave that always takes the same
 * total time, regardless of how many years that particular branch spans.
 * This is deliberately proportional-to-height rather than reusing
 * HIGHLIGHT_STEP_DELAY_MS (a fixed ms-per-year): a fixed per-year rate
 * would make a 26-year branch take ~10x longer to sweep than a 3-year one,
 * which reads as broken, not smooth.
 */
export function getBranchSweepPlan(
  items: TimelineItem[],
  totalHeight: number,
  totalDurationMs: number,
): SpacerHighlightPlan {
  const offsets = getCumulativeOffsets(items);
  const spacers = new Map<string, number>();
  const milestones = new Map<string, number>();

  items.forEach((item, index) => {
    const delay = totalHeight > 0 ? Math.round((offsets[index] / totalHeight) * totalDurationMs) : 0;
    if (item.type === "spacer") spacers.set(item.id, delay);
    else milestones.set(item.id, delay);
  });

  return { spacers, milestones };
}
