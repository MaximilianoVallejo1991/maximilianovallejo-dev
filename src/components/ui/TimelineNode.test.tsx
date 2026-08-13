import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import TimelineNode from "./TimelineNode";
import type { Milestone } from "../../data/content";

const milestone: Milestone = {
  year: "2020",
  title: "Test milestone",
  description: "Test description",
};

describe("TimelineNode", () => {
  it("renders an icon inside the dot when icon is set", () => {
    const { getByTestId } = render(
      <TimelineNode milestone={milestone} index={0} icon="compass" />,
    );
    const dot = getByTestId("timeline-dot");
    expect(dot.querySelector("svg")).not.toBeNull();
  });

  it("renders no icon and does not crash when icon is absent", () => {
    const { getByTestId } = render(<TimelineNode milestone={milestone} index={0} />);
    const dot = getByTestId("timeline-dot");
    expect(dot.querySelector("svg")).toBeNull();
  });

  it("renders no internal connector line (owned by the parent <ol> rail instead)", () => {
    const { container } = render(<TimelineNode milestone={milestone} index={0} />);
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
  });

  it("is positioned absolutely at the given top, not left to normal document flow", () => {
    const { container } = render(<TimelineNode milestone={milestone} index={0} top={340} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toMatch(/\babsolute\b/);
    expect(root.style.top).toBe("340px");
  });

  it("defaults top to 0px when not provided", () => {
    const { container } = render(<TimelineNode milestone={milestone} index={0} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.top).toBe("0px");
  });
});
