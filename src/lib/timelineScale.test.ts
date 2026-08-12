import { describe, expect, it } from "vitest";
import {
  YEAR_HEIGHT_PX,
  resolveYear,
  buildTimelineWithSpacers,
  getBranchLayout,
  getSpacersToHighlight,
  type TimelineItem,
} from "./timelineScale";
import { es } from "../data/content.es";
import { mergeMilestonesByYear } from "./mergeMilestonesByYear";
import type { Milestone } from "../data/content";

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
  const globalMinYear = 2007; // study branch's first year (min across soft=2008, trade=2008, study=2007)

  it("builds N-1 spacers for a branch with N milestones (soft: 5 milestones -> 4 spacers)", () => {
    const soft = branches.find((b) => b.branchKey === "soft")!;
    const items = buildTimelineWithSpacers(soft.milestones, globalMinYear);
    expect(milestonesOf(items)).toHaveLength(5);
    expect(spacersOf(items)).toHaveLength(4);
  });

  it("computes proportional spacer heights for the soft branch (700, 200, 300, 400)", () => {
    const soft = branches.find((b) => b.branchKey === "soft")!;
    const items = buildTimelineWithSpacers(soft.milestones, globalMinYear);
    expect(spacersOf(items).map((s) => s.height)).toEqual([700, 200, 300, 400]);
  });

  it("resolves the same-year pair ('2021' -> '2021–2022') to a 0px spacer", () => {
    const study = branches.find((b) => b.branchKey === "study")!;
    const items = buildTimelineWithSpacers(study.milestones, globalMinYear);
    const spacers = spacersOf(items);
    // study: 2007,2009,2010,2011,2021,2021–2022,Continua -> 6 inline spacers
    // + 1 trailing spacer after the anchored open-ended "Continua" = 7.
    // index 4 is 2021 -> 2021–2022.
    expect(spacers).toHaveLength(7);
    expect(spacers[4].height).toBe(0);
  });

  it("anchors the open-ended last milestone ('Continua') at the previous milestone's end year, not CURRENT_YEAR", () => {
    const study = branches.find((b) => b.branchKey === "study")!;
    const items = buildTimelineWithSpacers(study.milestones, globalMinYear);
    const milestones = milestonesOf(items);
    const continua = milestones[milestones.length - 1];
    expect(continua.data.year).toBe("Continua");
    // "2021–2022" (the previous milestone) ends in 2022 -> Continua anchors there.
    expect(continua.yearStart).toBe(2022);
  });

  it("collapses the inline spacer before the anchored open-ended milestone to 0px (both sides resolve to 2022)", () => {
    const study = branches.find((b) => b.branchKey === "study")!;
    const items = buildTimelineWithSpacers(study.milestones, globalMinYear);
    const spacers = spacersOf(items);
    // Second-to-last spacer: "2021–2022" -> anchored "Continua" (2022 -> 2022).
    const inlineBeforeContinua = spacers[spacers.length - 2];
    expect(inlineBeforeContinua.yearFrom).toBe(2022);
    expect(inlineBeforeContinua.yearTo).toBe(2022);
    expect(inlineBeforeContinua.height).toBe(0);
  });

  it("emits a trailing spacer after the anchored open-ended milestone, from its anchor year to CURRENT_YEAR", () => {
    const study = branches.find((b) => b.branchKey === "study")!;
    const items = buildTimelineWithSpacers(study.milestones, globalMinYear);
    const last = items[items.length - 1];
    expect(last.type).toBe("spacer");
    if (last.type !== "spacer") throw new Error("unreachable");
    expect(last.yearFrom).toBe(2022);
    expect(last.yearTo).toBe(2026);
    expect(last.height).toBe(400);
    expect(Number.isFinite(last.height)).toBe(true);
  });

  it("does NOT emit a trailing spacer for a branch whose last milestone resolves to a concrete, non-clamped year", () => {
    const trade = branches.find((b) => b.branchKey === "trade")!;
    const items = buildTimelineWithSpacers(trade.milestones, globalMinYear);
    const last = items[items.length - 1];
    expect(last.type).toBe("milestone");
  });

  it("never produces a negative or Infinity height", () => {
    for (const branch of branches) {
      const items = buildTimelineWithSpacers(branch.milestones, globalMinYear);
      for (const spacer of spacersOf(items)) {
        expect(spacer.height).toBeGreaterThanOrEqual(0);
        expect(Number.isFinite(spacer.height)).toBe(true);
      }
    }
  });

  it("shares the exact same YEAR_HEIGHT_PX scale used for a single-year gap", () => {
    const trade = branches.find((b) => b.branchKey === "trade")!;
    const items = buildTimelineWithSpacers(trade.milestones, globalMinYear);
    // trade: 2019 -> 2022 is a 3-year gap
    const spacers = spacersOf(items);
    expect(spacers[2].height).toBe(3 * YEAR_HEIGHT_PX);
  });

  it("is generic over merged (mobile) entries: cross-branch 2008/2008 adjacency resolves to a 0px spacer", () => {
    const merged = mergeMilestonesByYear(branches).map((m) => m.milestone);
    const items = buildTimelineWithSpacers(merged, globalMinYear);
    expect(milestonesOf(items)).toHaveLength(16);
    // 15 inline spacers (N-1) + 1 trailing spacer after the merged list's
    // last entry, which is "study"'s open-ended "Continua" (sorts last
    // globally: parseYearStart("Continua") = Infinity).
    expect(spacersOf(items)).toHaveLength(16);
    // merged order: study 2007, soft 2008, trade 2008, ... -> spacer[1] is soft(2008) -> trade(2008)
    expect(spacersOf(items)[1].height).toBe(0);
  });

  it("also anchors and trails the open-ended milestone when it's the last entry of a generic (merged) list", () => {
    const merged = mergeMilestonesByYear(branches).map((m) => m.milestone);
    const items = buildTimelineWithSpacers(merged, globalMinYear);
    const last = items[items.length - 1];
    expect(last.type).toBe("spacer");
    if (last.type !== "spacer") throw new Error("unreachable");
    expect(last.yearTo).toBe(2026);
  });
});

describe("getBranchLayout", () => {
  const branches = es.experience.branches;
  const globalMinYear = 2007;

  it("computes topOffset=0 for the branch starting at globalMinYear (study, 2007)", () => {
    const study = branches.find((b) => b.branchKey === "study")!;
    const layout = getBranchLayout(study, globalMinYear);
    expect(layout.topOffset).toBe(0);
  });

  it("computes topOffset=100px for a branch starting one year after globalMinYear (soft, 2008)", () => {
    const soft = branches.find((b) => b.branchKey === "soft")!;
    const layout = getBranchLayout(soft, globalMinYear);
    expect(layout.topOffset).toBe(100);
  });

  it("computes endOffset from the last TimelineItem (trailing spacer's yearTo for open-ended branches)", () => {
    const study = branches.find((b) => b.branchKey === "study")!;
    const layout = getBranchLayout(study, globalMinYear);
    // study ends on 'Continua' -> anchored at 2022 + trailing spacer to
    // CURRENT_YEAR(2026) -> endOffset derives from the trailing spacer's
    // yearTo, not from resolveYear() on the milestone itself -> (2026-2007)*100
    expect(layout.endOffset).toBe(1900);
    expect(layout.height).toBe(1900);
  });

  it("computes endOffset and height for the trade branch (2022 last year)", () => {
    const trade = branches.find((b) => b.branchKey === "trade")!;
    const layout = getBranchLayout(trade, globalMinYear);
    expect(layout.endOffset).toBe(1500);
    expect(layout.height).toBe(1400); // 1500 - topOffset(100)
  });

  it("carries the branchKey through and matches the source branch", () => {
    const soft = branches.find((b) => b.branchKey === "soft")!;
    const layout = getBranchLayout(soft, globalMinYear);
    expect(layout.branchKey).toBe("soft");
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
    const items = buildTimelineWithSpacers(milestones, 2000);
    const result = getSpacersToHighlight(milestones[1], items);
    expect(result).toEqual([]);
  });

  it("collects spacer ids within upwardsYears and downwardsYears range around the milestone", () => {
    const milestones = [
      makeMilestone("2000"),
      makeMilestone("2005"),
      makeMilestone("2008"),
      makeMilestone("2010", { hoverIllumination: { upwardsYears: 5, downwardsYears: 4 } }),
      makeMilestone("2012"),
      makeMilestone("2015"),
      makeMilestone("2020"),
    ];
    const items = buildTimelineWithSpacers(milestones, 2000);
    const target = milestones[3];
    const result = getSpacersToHighlight(target, items);

    // Upward: 2005->2008 (in range, yearFrom=2005 >= 2010-5) and 2008->2010 (yearFrom=2008 >= 2005) match;
    // 2000->2005 does not (yearFrom=2000 < 2005).
    // Downward: 2010->2012 matches (yearTo=2012 <= 2010+4=2014); 2012->2015 does not (yearTo=2015 > 2014).
    expect(result).toHaveLength(3);

    const spacers = buildTimelineWithSpacers(milestones, 2000).filter(
      (i): i is Extract<TimelineItem, { type: "spacer" }> => i.type === "spacer",
    );
    const idFor = (yearFrom: number, yearTo: number) =>
      spacers.find((s) => s.yearFrom === yearFrom && s.yearTo === yearTo)!.id;

    expect(result).toContain(idFor(2005, 2008));
    expect(result).toContain(idFor(2008, 2010));
    expect(result).toContain(idFor(2010, 2012));
    expect(result).not.toContain(idFor(2000, 2005));
    expect(result).not.toContain(idFor(2012, 2015));
  });

  it("returns no upward matches when the milestone is the first item (no preceding spacer)", () => {
    const milestones = [
      makeMilestone("2010", { hoverIllumination: { upwardsYears: 10, downwardsYears: 0 } }),
      makeMilestone("2012"),
    ];
    const items = buildTimelineWithSpacers(milestones, 2010);
    const result = getSpacersToHighlight(milestones[0], items);
    expect(result).toEqual([]);
  });
});
