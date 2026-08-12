import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
// Vite raw import — avoids requiring @types/node for this one source-inspection test.
import source from "./ConvergenceGraphic.tsx?raw";
import ConvergenceGraphic from "./ConvergenceGraphic";

describe("ConvergenceGraphic", () => {
  it("positions one endpoint circle per branch at cy derived from branchEndOffsets (normalized to the smallest offset)", () => {
    // soft=1700, trade=1500, study=1900 (real branch endOffsets from getBranchLayout)
    const { container } = render(<ConvergenceGraphic branchEndOffsets={[1700, 1500, 1900]} />);
    const endpoints = Array.from(container.querySelectorAll('circle[r="7"]'));
    expect(endpoints).toHaveLength(3);

    const cys = endpoints.map((c) => Number(c.getAttribute("cy")));
    // Normalized to the minimum offset (1500): soft=+200, trade=+0, study=+400 (plus a fixed top margin)
    expect(cys[1]).toBeLessThan(cys[0]); // trade (min offset) sits above soft
    expect(cys[0]).toBeLessThan(cys[2]); // soft sits above study (max offset)
    expect(cys[2] - cys[1]).toBe(400); // study vs trade: (1900-1500) = 400px on the shared scale
    expect(cys[0] - cys[1]).toBe(200); // soft vs trade: (1700-1500) = 200px
  });

  it("positions the terminal node below the lowest (max-offset) endpoint circle", () => {
    const { container } = render(<ConvergenceGraphic branchEndOffsets={[1700, 1500, 1900]} />);
    const endpoints = Array.from(container.querySelectorAll('circle[r="7"]'));
    const maxEndpointCy = Math.max(...endpoints.map((c) => Number(c.getAttribute("cy"))));
    const terminal = container.querySelector('circle[r="18"]');
    expect(terminal).not.toBeNull();
    const terminalCy = Number(terminal!.getAttribute("cy"));
    expect(terminalCy).toBeGreaterThan(maxEndpointCy);
  });

  it("adapts when all branches end at the same offset (equal-height branches)", () => {
    const { container } = render(<ConvergenceGraphic branchEndOffsets={[1000, 1000, 1000]} />);
    const endpoints = Array.from(container.querySelectorAll('circle[r="7"]'));
    const cys = endpoints.map((c) => Number(c.getAttribute("cy")));
    expect(cys[0]).toBe(cys[1]);
    expect(cys[1]).toBe(cys[2]);
  });

  it("does not use DOM measurement APIs (ResizeObserver / getBoundingClientRect)", () => {
    expect(source).not.toMatch(/new ResizeObserver/);
    expect(source).not.toMatch(/\.getBoundingClientRect\(/);
  });
});
