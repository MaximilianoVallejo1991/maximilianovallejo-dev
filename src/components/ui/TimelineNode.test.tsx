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

  it("applies the always-on (non-group-hover) accent classes to the dot and title when highlighted=true, so a hovered SIBLING spacer can light this node up", () => {
    const { getByTestId, getByText } = render(
      <TimelineNode milestone={milestone} index={0} highlighted />,
    );
    const dotTokens = getByTestId("timeline-dot").className.split(/\s+/);
    expect(dotTokens).toContain("ring-2"); // the bare, always-on token — not "group-hover:ring-2"
    const titleTokens = getByText("Test milestone").className.split(/\s+/);
    expect(titleTokens).toContain("text-accent"); // bare — not "group-hover:text-accent"
  });

  it("does not apply the always-on accent classes when highlighted is false (default)", () => {
    const { getByTestId, getByText } = render(<TimelineNode milestone={milestone} index={0} />);
    const dotTokens = getByTestId("timeline-dot").className.split(/\s+/);
    expect(dotTokens).not.toContain("ring-2");
    const titleTokens = getByText("Test milestone").className.split(/\s+/);
    expect(titleTokens).not.toContain("text-accent");
  });
});
