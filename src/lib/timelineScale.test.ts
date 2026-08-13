import { describe, expect, it } from "vitest";
import {
  YEAR_HEIGHT_PX,
  SAME_YEAR_SPACER_HEIGHT_PX,
  CURRENT_YEAR,
  resolveYear,
  buildTimelineWithSpacers,
  getBranchLayout,
  getTimelineHeight,
  getSpacersToHighlight,
  getMilestonesToHighlight,
  type TimelineItem,
} from "./timelineScale";
import { es } from "../data/content.es";
import { mergeMilestonesByYear } from "./mergeMilestonesByYear";
import type { Milestone } from "../data/content";

const PRESENT_LABEL = es.experience.presentLabel;

describe("resolveYear", () => {
  it("resolves a plain 4-digit year", () => {
    expect(resolveYear("2021")).toBe(2021);
  });

  it("resolves a range to its start year", () => {
    expect(resolveYear("2021–2022")).toBe(2021);
  });

  it("clamps 'Continua' to the current year (not literal Infinity)", () => {
    const resolved = resolveYear("Continua");
    expect(resolved).toBe(2026);
    expect(Number.isFinite(resolved)).toBe(true);
  });

  it("clamps 'Ongoing' to the current year", () => {
    expect(resolveYear("Ongoing")).toBe(2026);
  });

  it("clamps unparseable input to the current year", () => {
    expect(resolveYear("garbage")).toBe(2026);
  });

  it("honors an explicit currentYear override", () => {
    expect(resolveYear("Ongoing", 2030)).toBe(2030);
  });
});

const spacersOf = (items: TimelineItem[]) =>
  items.filter((i): i is Extract<TimelineItem, { type: "spacer" }> => i.type === "spacer");

const milestonesOf = (items: TimelineItem[]) =>
  items.filter((i): i is Extract<TimelineItem, { type: "milestone" }> => i.type === "milestone");

describe("buildTimelineWithSpacers", () => {
  const branches = es.experience.branches;

  it("builds one spacer PER YEAR crossed, not one per milestone pair (soft: gaps of 7,2,3,4 -> 16 segments)", () => {
    const soft = branches.find((b) => b.branchKey === "soft")!;
    const items = buildTimelineWithSpacers(soft.milestones);
    expect(milestonesOf(items)).toHaveLength(5);
    expect(spacersOf(items)).toHaveLength(7 + 2 + 3 + 4);
  });

  it("every spacer segment is exactly YEAR_HEIGHT_PX tall — no single element spans more than one year", () => {
    const soft = branches.find((b) => b.branchKey === "soft")!;
    const items = buildTimelineWithSpacers(soft.milestones);
    for (const spacer of spacersOf(items)) {
      expect(spacer.height).toBe(YEAR_HEIGHT_PX);
    }
  });

  it("splits a multi-year gap into that many consecutive one-year segments (trade: 2019->2022 is a 3-year gap -> 3 segments)", () => {
    const trade = branches.find((b) => b.branchKey === "trade")!;
    const items = buildTimelineWithSpacers(trade.milestones);
    const gapSegments = spacersOf(items).filter((s) => s.yearFrom >= 2019 && s.yearTo <= 2022);
    expect(gapSegments).toHaveLength(3);
    expect(gapSegments.map((s) => s.yearFrom)).toEqual([2019, 2020, 2021]);
    expect(gapSegments.every((s) => s.height === YEAR_HEIGHT_PX)).toBe(true);
  });

  it("resolves a same-year pair ('2021' -> '2021–2022') to exactly one legibility-floor segment, not zero", () => {
    const study = branches.find((b) => b.branchKey === "study")!;
    const items = buildTimelineWithSpacers(study.milestones);
    const sameYearSegments = spacersOf(items).filter((s) => s.yearFrom === s.yearTo);
    expect(sameYearSegments).toHaveLength(1);
    expect(sameYearSegments[0].height).toBe(SAME_YEAR_SPACER_HEIGHT_PX);
    expect(sameYearSegments[0].yearFrom).toBe(2021);
  });

  it("positions an open-ended last milestone ('Continua') directly at CURRENT_YEAR, connected by real per-year segments (not anchored earlier)", () => {
    const study = branches.find((b) => b.branchKey === "study")!;
    const items = buildTimelineWithSpacers(study.milestones);
    const milestones = milestonesOf(items);
    const continua = milestones[milestones.length - 1];
    expect(continua.data.year).toBe("Continua");
    expect(continua.yearStart).toBe(CURRENT_YEAR);

    // 2022 -> 2026 is a 4-year gap -> 4 consecutive one-year segments lead into it.
    const lastFour = spacersOf(items).slice(-4);
    expect(lastFour.map((s) => s.yearFrom)).toEqual([2022, 2023, 2024, 2025]);
    expect(lastFour.every((s) => s.height === YEAR_HEIGHT_PX)).toBe(true);
  });

  it("never emits anything after the last milestone (no implicit trailing spacer)", () => {
    const trade = branches.find((b) => b.branchKey === "trade")!;
    const items = buildTimelineWithSpacers(trade.milestones);
    expect(items[items.length - 1].type).toBe("milestone");
  });

  it("never produces a negative or Infinity height", () => {
    for (const branch of branches) {
      const items = buildTimelineWithSpacers(branch.milestones);
      for (const spacer of spacersOf(items)) {
        expect(spacer.height).toBeGreaterThanOrEqual(0);
        expect(Number.isFinite(spacer.height)).toBe(true);
      }
    }
  });

  it("is generic over merged (mobile) entries: splits every gap into per-year segments (22 segments across 15 gaps)", () => {
    const merged = mergeMilestonesByYear(branches).map((m) => m.milestone);
    const items = buildTimelineWithSpacers(merged);
    expect(milestonesOf(items)).toHaveLength(16);
    expect(spacersOf(items)).toHaveLength(22);
    // merged order: study 2007, soft 2008, trade 2008, ... -> the segment right
    // after the first (2007->2008) one is the cross-branch same-year floor.
    expect(spacersOf(items)[1].height).toBe(SAME_YEAR_SPACER_HEIGHT_PX);
    expect(spacersOf(items)[1].yearFrom).toBe(2008);
    expect(spacersOf(items)[1].yearTo).toBe(2008);
  });

  it("positions the merged list's open-ended entry ('Continua') at CURRENT_YEAR too", () => {
    const merged = mergeMilestonesByYear(branches).map((m) => m.milestone);
    const items = buildTimelineWithSpacers(merged);
    const last = items[items.length - 1];
    expect(last.type).toBe("milestone");
    if (last.type !== "milestone") throw new Error("unreachable");
    expect(last.data.year).toBe("Continua");
    expect(last.yearStart).toBe(CURRENT_YEAR);
  });
});

describe("getBranchLayout", () => {
  const branches = es.experience.branches;
  const globalMinYear = 2007;

  it("does NOT prepend a leading spacer for the branch already starting at globalMinYear (study, 2007)", () => {
    const study = branches.find((b) => b.branchKey === "study")!;
    const layout = getBranchLayout(study, globalMinYear, PRESENT_LABEL);
    expect(layout.items[0].type).toBe("milestone");
  });

  it("prepends a one-year leading spacer for a branch starting one year after globalMinYear (soft, 2008)", () => {
    const soft = branches.find((b) => b.branchKey === "soft")!;
    const layout = getBranchLayout(soft, globalMinYear, PRESENT_LABEL);
    const first = layout.items[0];
    expect(first.type).toBe("spacer");
    if (first.type !== "spacer") throw new Error("unreachable");
    expect(first.yearFrom).toBe(2007);
    expect(first.yearTo).toBe(2008);
    expect(first.height).toBe(YEAR_HEIGHT_PX);
    // and only one segment, since the leading gap is exactly 1 year
    expect(layout.items[1].type).toBe("milestone");
  });

  it("does NOT append a synthetic present-label milestone when the branch already ends open-ended (study)", () => {
    const study = branches.find((b) => b.branchKey === "study")!;
    const layout = getBranchLayout(study, globalMinYear, PRESENT_LABEL);
    const milestones = milestonesOf(layout.items);
    expect(milestones[milestones.length - 1].data.year).toBe("Continua");
  });

  it("appends a synthetic present-label milestone when the branch ends on a concrete year (trade, 2022), connected by per-year segments", () => {
    const trade = branches.find((b) => b.branchKey === "trade")!;
    const layout = getBranchLayout(trade, globalMinYear, PRESENT_LABEL);
    const milestones = milestonesOf(layout.items);
    const last = milestones[milestones.length - 1];
    expect(last.data.year).toBe(PRESENT_LABEL);
    expect(last.data.title).toBe(PRESENT_LABEL);
    expect(last.yearStart).toBe(CURRENT_YEAR);

    // 2022 -> 2026 is a 4-year gap -> 4 one-year segments lead into it.
    const lastFour = spacersOf(layout.items).slice(-4);
    expect(lastFour).toHaveLength(4);
    expect(lastFour.every((s) => s.height === YEAR_HEIGHT_PX)).toBe(true);
    expect(lastFour[lastFour.length - 1].yearTo).toBe(CURRENT_YEAR);
  });

  it("computes the real (sum-of-segments) height for soft — 19 one-year segments * 100px", () => {
    const soft = branches.find((b) => b.branchKey === "soft")!;
    const layout = getBranchLayout(soft, globalMinYear, PRESENT_LABEL);
    // leading 1 + 7 + 2 + 3 + 4 + 2 (to present) = 19 segments
    expect(layout.height).toBe(1900);
  });

  it("computes the real (sum-of-segments) height for trade", () => {
    const trade = branches.find((b) => b.branchKey === "trade")!;
    const layout = getBranchLayout(trade, globalMinYear, PRESENT_LABEL);
    // leading 1 + 9 + 2 + 3 + 4 (to present) = 19 segments
    expect(layout.height).toBe(1900);
  });

  it("computes the real (sum-of-segments) height for study, including its same-year floor segment", () => {
    const study = branches.find((b) => b.branchKey === "study")!;
    const layout = getBranchLayout(study, globalMinYear, PRESENT_LABEL);
    // no leading + 2+1+1+10+1(floor)+4 (to Continua@2026) = 19 segments
    expect(layout.height).toBe(1900);
  });

  it("carries the branchKey through and matches the source branch", () => {
    const soft = branches.find((b) => b.branchKey === "soft")!;
    const layout = getBranchLayout(soft, globalMinYear, PRESENT_LABEL);
    expect(layout.branchKey).toBe("soft");
  });
});

describe("getTimelineHeight", () => {
  const makeMilestone = (year: string): Milestone => ({ year, title: year, description: "" });

  it("sums spacer heights only, ignoring milestone entries — same total regardless of segment count", () => {
    const items = buildTimelineWithSpacers([
      makeMilestone("2010"),
      makeMilestone("2012"),
      makeMilestone("2013"),
    ]);
    // 2010->2012 = 2 segments (200), 2012->2013 = 1 segment (100)
    expect(getTimelineHeight(items)).toBe(300);
  });

  it("returns 0 for a single-milestone list (no spacers)", () => {
    const items = buildTimelineWithSpacers([makeMilestone("2010")]);
    expect(getTimelineHeight(items)).toBe(0);
  });
});

describe("getSpacersToHighlight", () => {
  const makeMilestone = (year: string, overrides: Partial<Milestone> = {}): Milestone => ({
    year,
    title: `milestone-${year}`,
    description: "",
    ...overrides,
  });

  it("returns an empty array when hoverIllumination is absent", () => {
    const milestones = [makeMilestone("2000"), makeMilestone("2010")];
    const items = buildTimelineWithSpacers(milestones);
    const result = getSpacersToHighlight(milestones[1], items);
    expect(result).toEqual([]);
  });

  it("lights exactly N one-year segments, crossing into an earlier gap once the nearer one is exhausted", () => {
    const milestones = [
      makeMilestone("2000"),
      makeMilestone("2005"),
      makeMilestone("2010", { hoverIllumination: { upwardsYears: 7, downwardsYears: 1 } }),
      makeMilestone("2012"),
    ];
    const items = buildTimelineWithSpacers(milestones);
    const target = milestones[2];
    const result = getSpacersToHighlight(target, items);

    const spacers = spacersOf(items);
    const idFor = (yearFrom: number) => spacers.find((s) => s.yearFrom === yearFrom)!.id;

    // Upward: the 5 segments of 2005->2010 (2005..2009) fully fit within 7,
    // leaving 2 more that reach into 2000->2005's nearest segments (2003, 2004).
    for (const y of [2009, 2008, 2007, 2006, 2005, 2004, 2003]) {
      expect(result).toContain(idFor(y));
    }
    expect(result).not.toContain(idFor(2002));
    expect(result).not.toContain(idFor(2001));
    expect(result).not.toContain(idFor(2000));

    // Downward: only the nearest 1 of the 2 segments in 2010->2012.
    expect(result).toContain(idFor(2010));
    expect(result).not.toContain(idFor(2011));

    expect(result).toHaveLength(7 + 1);
  });

  it("counts a same-year legibility-floor segment as exactly one step", () => {
    const milestones = [
      makeMilestone("2015"),
      makeMilestone("2015", { hoverIllumination: { upwardsYears: 1 } }),
    ];
    const items = buildTimelineWithSpacers(milestones);
    const target = milestones[1];
    const result = getSpacersToHighlight(target, items);
    const spacer = spacersOf(items)[0];
    expect(spacer.height).toBe(SAME_YEAR_SPACER_HEIGHT_PX);
    expect(result).toEqual([spacer.id]);
  });

  it("caps at the segments that actually exist when more years are requested than are available", () => {
    const milestones = [
      makeMilestone("2010"),
      makeMilestone("2012", { hoverIllumination: { upwardsYears: 100 } }),
    ];
    const items = buildTimelineWithSpacers(milestones);
    const result = getSpacersToHighlight(milestones[1], items);
    expect(result).toHaveLength(2);
  });

  it("returns no upward matches when the milestone is the first item (no preceding spacer)", () => {
    const milestones = [
      makeMilestone("2010", { hoverIllumination: { upwardsYears: 10, downwardsYears: 0 } }),
      makeMilestone("2012"),
    ];
    const items = buildTimelineWithSpacers(milestones);
    const result = getSpacersToHighlight(milestones[0], items);
    expect(result).toEqual([]);
  });
});

describe("getMilestonesToHighlight", () => {
  const makeMilestone = (year: string, overrides: Partial<Milestone> = {}): Milestone => ({
    year,
    title: `milestone-${year}`,
    description: "",
    ...overrides,
  });

  it("is the exact reverse of getSpacersToHighlight: a spacer claimed by a milestone reports that milestone back", () => {
    const milestones = [
      makeMilestone("2000"),
      makeMilestone("2005"),
      makeMilestone("2010", { hoverIllumination: { upwardsYears: 7, downwardsYears: 1 } }),
      makeMilestone("2012"),
    ];
    const items = buildTimelineWithSpacers(milestones);
    const target = milestones[2];
    const claimedSpacerIds = getSpacersToHighlight(target, items);
    const targetItem = items.find(
      (i): i is Extract<TimelineItem, { type: "milestone" }> =>
        i.type === "milestone" && i.data === target,
    )!;

    for (const spacerId of claimedSpacerIds) {
      expect(getMilestonesToHighlight(spacerId, items)).toContain(targetItem.id);
    }
  });

  it("returns multiple milestone ids when two neighbors' ranges both reach the same spacer", () => {
    const milestones = [
      makeMilestone("2010", { hoverIllumination: { downwardsYears: 3 } }),
      makeMilestone("2012", { hoverIllumination: { upwardsYears: 3 } }),
    ];
    const items = buildTimelineWithSpacers(milestones);
    const spacer = spacersOf(items)[0]; // the single 2010->2011 segment (2 total: 2010-2011,2011-2012)
    const result = getMilestonesToHighlight(spacer.id, items);
    const [first, second] = milestonesOf(items);
    expect(result).toContain(first.id);
    expect(result).toContain(second.id);
    expect(result).toHaveLength(2);
  });

  it("returns an empty array for a spacer no milestone's hoverIllumination reaches", () => {
    const milestones = [makeMilestone("2000"), makeMilestone("2010")];
    const items = buildTimelineWithSpacers(milestones);
    const spacer = spacersOf(items)[5]; // deep in the middle of a 10-year gap, unclaimed
    const result = getMilestonesToHighlight(spacer.id, items);
    expect(result).toEqual([]);
  });

  it("ignores milestones without a hoverIllumination config entirely", () => {
    const milestones = [makeMilestone("2010"), makeMilestone("2012")];
    const items = buildTimelineWithSpacers(milestones);
    const spacer = spacersOf(items)[0];
    expect(getMilestonesToHighlight(spacer.id, items)).toEqual([]);
  });
});
