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
  getHighlightPlanFromMilestone,
  getHighlightPlanFromSpacer,
  getBranchSweepPlan,
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

  it("builds one spacer PER YEAR crossed, not one per milestone pair (soft: gaps of 15,2,3,4 -> 24 segments)", () => {
    const soft = branches.find((b) => b.branchKey === "soft")!;
    const items = buildTimelineWithSpacers(soft.milestones);
    expect(milestonesOf(items)).toHaveLength(5);
    expect(spacersOf(items)).toHaveLength(15 + 2 + 3 + 4);
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

  it("is generic over merged (mobile) entries: splits every gap into per-year segments (28 segments across 15 gaps)", () => {
    const merged = mergeMilestonesByYear(branches).map((m) => m.milestone);
    const items = buildTimelineWithSpacers(merged);
    expect(milestonesOf(items)).toHaveLength(16);
    expect(spacersOf(items)).toHaveLength(28);
    // Cross-branch same-year adjacencies (e.g. soft/trade both landing on
    // 2017) still resolve to the legibility floor, not 0px.
    const sameYearSegments = spacersOf(items).filter((s) => s.yearFrom === s.yearTo);
    expect(sameYearSegments.length).toBeGreaterThan(0);
    for (const segment of sameYearSegments) {
      expect(segment.height).toBe(SAME_YEAR_SPACER_HEIGHT_PX);
    }
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
  // soft ("Scout") is the earliest real milestone across all branches (2000).
  const globalMinYear = 2000;

  it("does NOT prepend a leading spacer for the branch already starting at globalMinYear (soft, 2000)", () => {
    const soft = branches.find((b) => b.branchKey === "soft")!;
    const layout = getBranchLayout(soft, globalMinYear, PRESENT_LABEL);
    expect(layout.items[0].type).toBe("milestone");
  });

  it("prepends a multi-year leading spacer, split into one-year segments, for a branch starting after globalMinYear (study, 2007 vs globalMinYear 2000)", () => {
    const study = branches.find((b) => b.branchKey === "study")!;
    const layout = getBranchLayout(study, globalMinYear, PRESENT_LABEL);
    const leading = layout.items.slice(0, 7);
    expect(leading.every((item) => item.type === "spacer")).toBe(true);
    expect(leading.map((item) => (item.type === "spacer" ? item.yearFrom : null))).toEqual([
      2000, 2001, 2002, 2003, 2004, 2005, 2006,
    ]);
    expect(layout.items[7].type).toBe("milestone"); // study's real first milestone, 2007
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

  it("computes the real (sum-of-segments) height for soft — 26 one-year segments * 100px, no leading gap needed", () => {
    const soft = branches.find((b) => b.branchKey === "soft")!;
    const layout = getBranchLayout(soft, globalMinYear, PRESENT_LABEL);
    // 15 + 2 + 3 + 4 + 2 (to present) = 26 segments
    expect(layout.height).toBe(2600);
  });

  it("computes the real (sum-of-segments) height for trade, including its 8-year leading gap", () => {
    const trade = branches.find((b) => b.branchKey === "trade")!;
    const layout = getBranchLayout(trade, globalMinYear, PRESENT_LABEL);
    // leading 8 + 9 + 2 + 3 + 4 (to present) = 26 segments
    expect(layout.height).toBe(2600);
  });

  it("computes the real (sum-of-segments) height for study, including its 7-year leading gap and same-year floor segment", () => {
    const study = branches.find((b) => b.branchKey === "study")!;
    const layout = getBranchLayout(study, globalMinYear, PRESENT_LABEL);
    // leading 7 + 2+1+1+10+1(floor)+4 (to Continua@2026) = 26 segments
    expect(layout.height).toBe(2600);
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

  it("returns an empty array for a segment buried in the middle of a large gap, touching no milestone directly and unreached by any hoverIllumination config", () => {
    const milestones = [makeMilestone("2000"), makeMilestone("2010")];
    const items = buildTimelineWithSpacers(milestones);
    const spacer = spacersOf(items)[5]; // deep in the middle of a 10-year gap
    const result = getMilestonesToHighlight(spacer.id, items);
    expect(result).toEqual([]);
  });

  it("always includes the directly-bordering milestone via baseline adjacency, even when it has no hoverIllumination config at all — a segment should never light up 'orphaned' from the nodes it sits between", () => {
    const milestones = [makeMilestone("2010"), makeMilestone("2012")];
    const items = buildTimelineWithSpacers(milestones);
    const firstSegment = spacersOf(items)[0]; // 2010->2011, directly after the "2010" milestone
    const result = getMilestonesToHighlight(firstSegment.id, items);
    const [first] = milestonesOf(items);
    expect(result).toEqual([first.id]);
  });

  it("baseline adjacency covers the exact case that motivated it: a segment right before a synthetic 'present' milestone (no hoverIllumination) still lights that milestone up", () => {
    const soft = es.experience.branches.find((b) => b.branchKey === "soft")!;
    const layout = getBranchLayout(soft, 2000, es.experience.presentLabel);
    const spacers = spacersOf(layout.items);
    const lastSegment = spacers[spacers.length - 1]; // right before the synthetic present-label milestone
    const milestones = milestonesOf(layout.items);
    const presentMilestone = milestones[milestones.length - 1];
    expect(presentMilestone.data.hoverIllumination).toBeUndefined();

    const result = getMilestonesToHighlight(lastSegment.id, layout.items);
    expect(result).toContain(presentMilestone.id);
  });
});

describe("getHighlightPlanFromMilestone", () => {
  const makeMilestone = (year: string, overrides: Partial<Milestone> = {}): Milestone => ({
    year,
    title: `milestone-${year}`,
    description: "",
    ...overrides,
  });

  it("assigns increasing delay steps radiating outward from the node (nearest segment first)", () => {
    const milestones = [
      makeMilestone("2010", { hoverIllumination: { downwardsYears: 3 } }),
      makeMilestone("2015"),
    ];
    const items = buildTimelineWithSpacers(milestones);
    const plan = getHighlightPlanFromMilestone(milestones[0], items);

    const spacers = spacersOf(items);
    expect(plan.get(spacers[0].id)).toBe(0); // 2010-2011, nearest
    expect(plan.get(spacers[1].id)).toBe(1); // 2011-2012
    expect(plan.get(spacers[2].id)).toBe(2); // 2012-2013, farthest within budget
    expect(plan.get(spacers[3].id)).toBeUndefined(); // 2013-2014, out of range
  });

  it("returns an empty plan when hoverIllumination is absent", () => {
    const milestones = [makeMilestone("2010"), makeMilestone("2015")];
    const items = buildTimelineWithSpacers(milestones);
    expect(getHighlightPlanFromMilestone(milestones[0], items).size).toBe(0);
  });
});

describe("getHighlightPlanFromSpacer", () => {
  const makeMilestone = (year: string, overrides: Partial<Milestone> = {}): Milestone => ({
    year,
    title: `milestone-${year}`,
    description: "",
    ...overrides,
  });

  it("lights the whole path from the hovered segment up to the claiming node, arriving at the node last", () => {
    const milestones = [
      makeMilestone("2010"),
      makeMilestone("2015", { hoverIllumination: { upwardsYears: 4 } }),
    ];
    const items = buildTimelineWithSpacers(milestones);
    const spacers = spacersOf(items);
    // gap is 2010->2015 (5 segments): 2011-2012,2012-2013,2013-2014,2014-2015
    // are within upwardsYears:4 of "2015" (distances 4,3,2,1); hover the
    // 3rd-from-node segment (2012-2013, distance=3 from "2015").
    const hovered = spacers.find((s) => s.yearFrom === 2012)!;
    const plan = getHighlightPlanFromSpacer(hovered.id, items);

    // Path from the hovered segment to the node: 2012-2013 (step 0, hovered),
    // 2013-2014 (step 1, closer to the node), then the node itself (step 3,
    // since 2014-2015 — the segment right before the node — is step 2).
    const closer = spacers.find((s) => s.yearFrom === 2013)!;
    const farther = spacers.find((s) => s.yearFrom === 2011)!; // on the far side of the hover point, not part of this path

    expect(plan.spacers.get(hovered.id)).toBe(0);
    expect(plan.spacers.get(closer.id)).toBe(1);
    expect(plan.spacers.has(farther.id)).toBe(false);

    const node = milestonesOf(items).find((m) => m.data.year === "2015")!;
    expect(plan.milestones.get(node.id)).toBe(3);
  });

  it("baseline-adjacent milestones always get delay step 0, regardless of hoverIllumination", () => {
    const milestones = [makeMilestone("2010"), makeMilestone("2012")];
    const items = buildTimelineWithSpacers(milestones);
    const firstSegment = spacersOf(items)[0];
    const plan = getHighlightPlanFromSpacer(firstSegment.id, items);
    const [before] = milestonesOf(items);
    expect(plan.milestones.get(before.id)).toBe(0);
  });

  it("takes the minimum delay when a segment/node is reachable via more than one path", () => {
    const milestones = [
      makeMilestone("2010", { hoverIllumination: { downwardsYears: 5 } }),
      makeMilestone("2012", { hoverIllumination: { upwardsYears: 1 } }),
    ];
    const items = buildTimelineWithSpacers(milestones);
    // gap is 2010->2012 (2 segments). "2012"'s upwardsYears:1 reaches only
    // the nearest segment (2011-2012) at distance 1 from itself; "2010"'s
    // downwardsYears:5 reaches both, at distances 1 and 2 from itself.
    const nearSecondNode = spacersOf(items).find((s) => s.yearFrom === 2011)!;
    const plan = getHighlightPlanFromSpacer(nearSecondNode.id, items);
    const second = milestonesOf(items)[1];
    // Reached directly (baseline adjacency, step 0) rather than via the
    // longer path from "2010" (which would compute step 1) — minimum wins.
    expect(plan.milestones.get(second.id)).toBe(0);
  });

  it("returns just the hovered segment itself (step 0) when no milestone claims it beyond baseline adjacency", () => {
    const milestones = [makeMilestone("2000"), makeMilestone("2010")];
    const items = buildTimelineWithSpacers(milestones);
    const buried = spacersOf(items)[5]; // deep in the middle, touches no milestone directly
    const plan = getHighlightPlanFromSpacer(buried.id, items);
    expect(Array.from(plan.spacers.entries())).toEqual([[buried.id, 0]]);
    expect(plan.milestones.size).toBe(0);
  });
});

describe("getBranchSweepPlan", () => {
  const makeMilestone = (year: string): Milestone => ({ year, title: year, description: "" });

  it("assigns the first item delay 0 and the last item close to the full duration, proportional to real position", () => {
    const milestones = [makeMilestone("2000"), makeMilestone("2005"), makeMilestone("2010")];
    const items = buildTimelineWithSpacers(milestones); // 10 one-year segments total, height 1000
    const plan = getBranchSweepPlan(items, 1000, 1000);

    const firstMilestone = milestonesOf(items)[0];
    expect(plan.milestones.get(firstMilestone.id)).toBe(0);

    const midSpacer = spacersOf(items)[4]; // 2004-2005, top=400 of 1000
    expect(plan.spacers.get(midSpacer.id)).toBe(400);

    const lastMilestone = milestonesOf(items)[2];
    expect(plan.milestones.get(lastMilestone.id)).toBe(1000); // top = full height
  });

  it("scales to a fixed total duration regardless of how many years the branch spans (a 3-year and a 30-year branch both finish in the same time)", () => {
    const short = buildTimelineWithSpacers([makeMilestone("2000"), makeMilestone("2003")]);
    const long = buildTimelineWithSpacers([makeMilestone("2000"), makeMilestone("2030")]);

    const shortPlan = getBranchSweepPlan(short, 300, 900);
    const longPlan = getBranchSweepPlan(long, 3000, 900);

    const shortLast = milestonesOf(short)[1];
    const longLast = milestonesOf(long)[1];
    expect(shortPlan.milestones.get(shortLast.id)).toBe(900);
    expect(longPlan.milestones.get(longLast.id)).toBe(900);
  });

  it("does not crash and returns 0 delays for a degenerate zero-height branch", () => {
    const items = buildTimelineWithSpacers([makeMilestone("2000")]);
    const plan = getBranchSweepPlan(items, 0, 900);
    const milestone = milestonesOf(items)[0];
    expect(plan.milestones.get(milestone.id)).toBe(0);
  });
});
