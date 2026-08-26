import { describe, expect, it, beforeAll, beforeEach, afterEach, vi } from "vitest";
import { act, fireEvent, render } from "@testing-library/react";
import SkillCarousel from "./SkillCarousel";
import type { Skill } from "../../data/content";
import { setPrefersReducedMotion } from "../../test/setup";

/*
 * `useReducedMotion()` freezes its value on the FIRST render in a test
 * file (see the gotcha documented in src/test/setup.ts) — so the reduce
 * preference is set once, before any component in this file ever mounts,
 * rather than per-test.
 */
beforeAll(() => {
  setPrefersReducedMotion(true);
});

const skills: Skill[] = [
  { name: "React", icon: "react" },
  { name: "TypeScript", icon: "typescript" },
  { name: "Next.js", icon: "nextjs" },
];

let ioCallback: ((entries: Pick<IntersectionObserverEntry, "isIntersecting">[]) => void) | null =
  null;

beforeEach(() => {
  ioCallback = null;
  class IntersectionObserverStub {
    constructor(cb: (entries: Pick<IntersectionObserverEntry, "isIntersecting">[]) => void) {
      ioCallback = cb;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  // @ts-expect-error -- test-only stub, not a spec-complete IntersectionObserver
  globalThis.IntersectionObserver = IntersectionObserverStub;
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

function getActiveIndex(container: HTMLElement): number {
  const dots = Array.from(
    container.querySelectorAll<HTMLButtonElement>('button[aria-label^="Go to skill"]'),
  );
  return dots.findIndex((d) => d.style.width === "1.5rem");
}

function bringIntoView() {
  act(() => {
    ioCallback?.([{ isIntersecting: true }]);
  });
}

describe("SkillCarousel — autoplay suppressed under prefers-reduced-motion: reduce", () => {
  it("does not advance slides on its interval", () => {
    const { container } = render(<SkillCarousel skills={skills} autoplay autoplayDelay={1} />);
    bringIntoView();
    expect(getActiveIndex(container)).toBe(0);

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(getActiveIndex(container)).toBe(0);
  });

  it("manual arrow navigation still advances", () => {
    const { container, getByLabelText } = render(
      <SkillCarousel skills={skills} autoplay autoplayDelay={1} />,
    );
    bringIntoView();

    fireEvent.click(getByLabelText("Siguiente habilidad"));
    expect(getActiveIndex(container)).toBe(1);
  });

  it("manual dot navigation still advances", () => {
    const { container } = render(<SkillCarousel skills={skills} autoplay autoplayDelay={1} />);
    bringIntoView();

    const dots = container.querySelectorAll<HTMLButtonElement>(
      'button[aria-label^="Go to skill"]',
    );
    fireEvent.click(dots[2]);
    expect(getActiveIndex(container)).toBe(2);
  });

  it("manual keyboard navigation still advances", () => {
    const { container } = render(<SkillCarousel skills={skills} autoplay autoplayDelay={1} />);
    bringIntoView();

    const root = container.querySelector('[role="group"]') as HTMLElement;
    fireEvent.keyDown(root, { key: "ArrowRight" });
    expect(getActiveIndex(container)).toBe(1);
  });

  it("manual wheel navigation still advances", () => {
    const { container } = render(<SkillCarousel skills={skills} autoplay autoplayDelay={1} />);
    bringIntoView();

    const root = container.querySelector('[role="group"]') as HTMLElement;
    fireEvent.mouseEnter(root); // wheel handler only acts while hovered
    const viewport = root.firstElementChild as HTMLElement;
    fireEvent.wheel(viewport, { deltaY: 100 });
    expect(getActiveIndex(container)).toBe(1);
  });

  it("manual touch (swipe) navigation still advances", () => {
    const { container } = render(<SkillCarousel skills={skills} autoplay autoplayDelay={1} />);
    bringIntoView();

    const root = container.querySelector('[role="group"]') as HTMLElement;
    fireEvent.touchStart(root, { touches: [{ clientX: 200 }] });
    fireEvent.touchMove(root, { touches: [{ clientX: 100 }] });
    fireEvent.touchEnd(root);
    expect(getActiveIndex(container)).toBe(1);
  });
});
