import { describe, expect, it } from "vitest";
import { mergeMilestonesByYear, parseYearStart } from "./mergeMilestonesByYear";
import { es } from "../data/content.es";
import type { ExperienceBranch } from "../data/content";

describe("parseYearStart", () => {
  it("parses a plain 4-digit year", () => {
    expect(parseYearStart("2008")).toBe(2008);
  });

  it("parses the first 4-digit run in a year range", () => {
    expect(parseYearStart("2021–2022")).toBe(2021);
  });

  it("returns Infinity for 'Continua'", () => {
    expect(parseYearStart("Continua")).toBe(Number.POSITIVE_INFINITY);
  });

  it("returns Infinity for 'Ongoing'", () => {
    expect(parseYearStart("Ongoing")).toBe(Number.POSITIVE_INFINITY);
  });
});

describe("mergeMilestonesByYear", () => {
  const branches = es.experience.branches;

  it("merges all milestones from all branches (5 + 4 + 7 = 16)", () => {
    const merged = mergeMilestonesByYear(branches);
    expect(merged).toHaveLength(16);
  });

  it("sorts the full list by ascending year", () => {
    const merged = mergeMilestonesByYear(branches);
    const years = merged.map((m) => parseYearStart(m.milestone.year));
    for (let i = 1; i < years.length; i++) {
      expect(years[i]).toBeGreaterThanOrEqual(years[i - 1]);
    }
  });

  it("breaks the 2008 tie by branch (array) order: Scout (soft) precedes Taller Metalmecánico (trade)", () => {
    const merged = mergeMilestonesByYear(branches);
    const scoutIndex = merged.findIndex((m) => m.milestone.title === "Scout");
    const tallerIndex = merged.findIndex(
      (m) => m.milestone.title === "Taller Metalmecánico",
    );
    expect(scoutIndex).toBeGreaterThanOrEqual(0);
    expect(tallerIndex).toBeGreaterThanOrEqual(0);
    expect(scoutIndex).toBeLessThan(tallerIndex);
  });

  it("sorts the 'Continua' milestone last", () => {
    const merged = mergeMilestonesByYear(branches);
    const last = merged[merged.length - 1];
    expect(last.milestone.year).toBe("Continua");
  });

  it("does not corrupt order when multiple branches share an Infinity-year milestone (Infinity - Infinity gotcha)", () => {
    // Number.POSITIVE_INFINITY - Number.POSITIVE_INFINITY === NaN. A comparator
    // that subtracts yearStart values would silently corrupt this ordering.
    const infinityBranches: ExperienceBranch[] = [
      {
        branchKey: "a",
        branchLabel: "A",
        accentKey: "soft",
        icon: "compass",
        milestones: [
          { year: "2020", title: "A-first", description: "" },
          { year: "Continua", title: "A-ongoing", description: "" },
        ],
      },
      {
        branchKey: "b",
        branchLabel: "B",
        accentKey: "trade",
        icon: "anvil",
        milestones: [
          { year: "2019", title: "B-first", description: "" },
          { year: "Ongoing", title: "B-ongoing", description: "" },
        ],
      },
    ];

    expect(() => mergeMilestonesByYear(infinityBranches)).not.toThrow();

    const merged = mergeMilestonesByYear(infinityBranches);
    expect(merged).toHaveLength(4);
    // Dated milestones sort first, ascending.
    expect(merged[0].milestone.title).toBe("B-first"); // 2019
    expect(merged[1].milestone.title).toBe("A-first"); // 2020
    // Both Infinity-year milestones sort last, tie-broken by branch (array) order.
    expect(merged[2].milestone.title).toBe("A-ongoing");
    expect(merged[3].milestone.title).toBe("B-ongoing");
  });
});
