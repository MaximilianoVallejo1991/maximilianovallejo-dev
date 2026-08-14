import { describe, expect, it, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
// Vite raw import — avoids requiring @types/node for this one source-inspection test.
import source from "./DivergenceGraphic.tsx?raw";
import DivergenceGraphic from "./DivergenceGraphic";

// Each branch renders TWO <line>s: the thin visible one and a wide
// invisible hover hit-target layered on top of it (a 2.5px line is
// impractical to hover precisely with a real mouse).
const visibleLines = (container: HTMLElement) =>
  Array.from(container.querySelectorAll("line")).filter(
    (l) => l.getAttribute("stroke") !== "transparent",
  );
const hitLines = (container: HTMLElement) =>
  Array.from(container.querySelectorAll("line")).filter(
    (l) => l.getAttribute("stroke") === "transparent",
  );

describe("DivergenceGraphic", () => {
  it("positions one branch circle per branch, all at the same cy (every branch starts at the same shared height)", () => {
    const { container } = render(<DivergenceGraphic />);
    const branchPoints = Array.from(container.querySelectorAll('circle[r="7"]'));
    expect(branchPoints).toHaveLength(3);
    const cys = branchPoints.map((c) => Number(c.getAttribute("cy")));
    expect(cys[0]).toBe(cys[1]);
    expect(cys[1]).toBe(cys[2]);
  });

  it("positions the origin node above the branch circles", () => {
    const { container } = render(<DivergenceGraphic />);
    const branchPoints = Array.from(container.querySelectorAll('circle[r="7"]'));
    const branchCy = Number(branchPoints[0].getAttribute("cy"));
    const origin = container.querySelector('circle[r="18"]');
    expect(origin).not.toBeNull();
    const originCy = Number(origin!.getAttribute("cy"));
    expect(originCy).toBeLessThan(branchCy);
  });

  it("draws a straight line (not a curve) from the origin to each branch circle", () => {
    const { container } = render(<DivergenceGraphic />);
    const lines = visibleLines(container);
    expect(lines).toHaveLength(3);
    const origin = container.querySelector('circle[r="18"]')!;
    const originCx = origin.getAttribute("cx");
    const originCy = origin.getAttribute("cy");
    for (const line of lines) {
      expect(line.getAttribute("x1")).toBe(originCx);
      expect(line.getAttribute("y1")).toBe(originCy);
    }
    expect(container.querySelectorAll("path")).toHaveLength(0);
  });

  it("idles in the same neutral gray as the rail (stroke-border), not a branch color", () => {
    const { container } = render(<DivergenceGraphic />);
    for (const line of visibleLines(container)) {
      expect(line.getAttribute("class")).toContain("stroke-border");
    }
  });

  it("lights up to that branch's accent color when its hit-target is hovered, and reverts on mouse leave", () => {
    const { container } = render(<DivergenceGraphic />);
    const [firstHit] = hitLines(container);
    fireEvent.mouseEnter(firstHit);
    const [firstVisible] = visibleLines(container);
    expect(firstVisible.getAttribute("class")).not.toContain("stroke-border");
    expect(firstVisible.getAttribute("class")).toMatch(/stroke-branch-\w+/);

    fireEvent.mouseLeave(firstHit);
    expect(firstVisible.getAttribute("class")).toContain("stroke-border");
  });

  it("lights every line in its own branch color when allActive is true, even without hovering", () => {
    const { container } = render(<DivergenceGraphic allActive />);
    const lines = visibleLines(container);
    expect(lines).toHaveLength(3);
    for (const line of lines) {
      expect(line.getAttribute("class")).not.toContain("stroke-border");
      expect(line.getAttribute("class")).toMatch(/stroke-branch-\w+/);
    }
  });

  it("calls onOriginClick when the origin's wide hit-target is clicked, and onBranchClick with the right index when a branch's hit-target is clicked", () => {
    const onOriginClick = vi.fn();
    const onBranchClick = vi.fn();
    const { container } = render(
      <DivergenceGraphic onOriginClick={onOriginClick} onBranchClick={onBranchClick} />,
    );

    const originHit = container.querySelector('circle[r="22"]')!;
    fireEvent.click(originHit);
    expect(onOriginClick).toHaveBeenCalledTimes(1);

    const [, secondHit] = hitLines(container);
    fireEvent.click(secondHit);
    expect(onBranchClick).toHaveBeenCalledWith(1);
  });

  it("does not use DOM measurement APIs (ResizeObserver / getBoundingClientRect)", () => {
    expect(source).not.toMatch(/new ResizeObserver/);
    expect(source).not.toMatch(/\.getBoundingClientRect\(/);
  });
});
