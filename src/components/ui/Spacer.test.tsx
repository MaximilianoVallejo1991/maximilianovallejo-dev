import { describe, expect, it, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Spacer } from "./Spacer";
import { buildTimelineWithSpacers } from "../../lib/timelineScale";
import type { Milestone } from "../../data/content";

describe("Spacer", () => {
  it("renders with the given height and data-year-from/data-year-to attributes", () => {
    const { getByTestId } = render(
      <Spacer height={200} dataYearFrom={2007} dataYearTo={2009} id="study:spacer:0" />,
    );
    const el = getByTestId("spacer");
    expect(el).toHaveAttribute("data-year-from", "2007");
    expect(el).toHaveAttribute("data-year-to", "2009");
    expect(el.style.height).toBe("200px");
  });

  it("renders whatever height it's given without omitting the element, even 0px (Spacer itself doesn't know about the same-year floor — that lives in timelineScale.ts)", () => {
    const { getByTestId } = render(
      <Spacer height={0} dataYearFrom={2021} dataYearTo={2021} id="study:spacer:4" />,
    );
    const el = getByTestId("spacer");
    expect(el.style.height).toBe("0px");
    expect(el).toHaveAttribute("data-year-from", "2021");
    expect(el).toHaveAttribute("data-year-to", "2021");
  });

  it("renders a wide invisible hit-target containing one precisely-offset inner visual line (not a bare 2px border, which is impractical to hover)", () => {
    const { getByTestId } = render(
      <Spacer height={100} dataYearFrom={2019} dataYearTo={2020} id="trade:spacer:2" />,
    );
    const el = getByTestId("spacer");
    expect(el.className).toMatch(/\bw-6\b/);
    expect(el.children).toHaveLength(1);
    const line = getByTestId("spacer-line");
    expect(line.className).toMatch(/left-\[11px\]/);
  });

  it("calls onHover with the hover-plan maps (spacer steps + milestone steps) on mouse enter, and empty maps on mouse leave", () => {
    const makeMilestone = (year: string, overrides: Partial<Milestone> = {}): Milestone => ({
      year,
      title: `m-${year}`,
      description: "",
      ...overrides,
    });
    const milestones = [
      makeMilestone("2010"),
      makeMilestone("2012", { hoverIllumination: { upwardsYears: 2 } }),
    ];
    const items = buildTimelineWithSpacers(milestones);
    const spacer = items.find((i) => i.type === "spacer")!;

    const onHover = vi.fn();
    const { getByTestId } = render(
      <Spacer
        id={spacer.id}
        height={100}
        dataYearFrom={2010}
        dataYearTo={2011}
        items={items}
        onHover={onHover}
      />,
    );

    fireEvent.mouseEnter(getByTestId("spacer"));
    const [spacerSteps, milestoneSteps] = onHover.mock.calls[0];
    expect(spacerSteps.get(spacer.id)).toBe(0); // the hovered segment lights first
    // "2010" lights up via baseline adjacency (it directly borders this
    // segment); "2012" lights up via its own upwardsYears reach.
    const m2010 = items.find((i) => i.type === "milestone" && i.data.year === "2010")!.id;
    const m2012 = items.find((i) => i.type === "milestone" && i.data.year === "2012")!.id;
    expect(milestoneSteps.has(m2010)).toBe(true);
    expect(milestoneSteps.has(m2012)).toBe(true);

    fireEvent.mouseLeave(getByTestId("spacer"));
    const [emptySpacerSteps, emptyMilestoneSteps] = onHover.mock.calls[1];
    expect(emptySpacerSteps.size).toBe(0);
    expect(emptyMilestoneSteps.size).toBe(0);
  });

  it("does not call onHover when items or id are missing (defensive, mirrors TimelineNode's own guard)", () => {
    const onHover = vi.fn();
    const { getByTestId } = render(
      <Spacer height={100} dataYearFrom={2010} dataYearTo={2011} onHover={onHover} />,
    );
    fireEvent.mouseEnter(getByTestId("spacer"));
    expect(onHover).not.toHaveBeenCalled();
  });
});
