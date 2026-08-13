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

  it("calls onHover with this spacer's id and the milestone ids that claim it, on mouse enter", () => {
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
    expect(onHover).toHaveBeenCalledWith(
      [spacer.id],
      [items.find((i) => i.type === "milestone" && i.data.year === "2012")!.id],
    );

    fireEvent.mouseLeave(getByTestId("spacer"));
    expect(onHover).toHaveBeenCalledWith([], []);
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
