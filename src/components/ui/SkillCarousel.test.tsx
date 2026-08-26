import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { act, fireEvent, render } from "@testing-library/react";
import SkillCarousel from "./SkillCarousel";
import type { Skill } from "../../data/content";

/*
 * These tests intentionally never call `setPrefersReducedMotion` — the
 * default matchMedia stub (src/test/setup.ts) returns `matches: false`,
 * so every render in THIS file locks `useReducedMotion()` to `false`
 * (see the gotcha documented in setup.ts). Reduced-motion scenarios for
 * this component live in `SkillCarousel.reduced-motion.test.tsx`.
 */

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

describe("SkillCarousel — autoplay under no reduced-motion preference", () => {
  it("advances slides on its interval once in view", () => {
    const { container } = render(<SkillCarousel skills={skills} autoplay autoplayDelay={1} />);
    bringIntoView();
    expect(getActiveIndex(container)).toBe(0);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(getActiveIndex(container)).toBe(1);
  });

  it("does not advance while not in view", () => {
    const { container } = render(<SkillCarousel skills={skills} autoplay autoplayDelay={1} />);
    // never brought into view
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(getActiveIndex(container)).toBe(0);
  });

  it("does not advance while hovered", () => {
    const { container } = render(<SkillCarousel skills={skills} autoplay autoplayDelay={1} />);
    bringIntoView();
    const root = container.querySelector('[role="group"]') as HTMLElement;
    fireEvent.mouseEnter(root);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(getActiveIndex(container)).toBe(0);
  });
});
