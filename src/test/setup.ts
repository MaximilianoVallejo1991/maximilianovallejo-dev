import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => cleanup());

/*
 * jsdom does not implement `window.matchMedia`. Motion's `useReducedMotion()`
 * (and a couple of direct `matchMedia` call sites — Hero.tsx, ThemeContext.tsx)
 * depend on it being present to mount without throwing.
 *
 * This stub defaults every query to `matches: false`. Tests that need to
 * simulate `prefers-reduced-motion: reduce` call `setPrefersReducedMotion(true)`
 * BEFORE rendering — matchMedia is queried at mount time, so the flag must be
 * set first. It resets to `false` automatically after every test.
 */
let reducedMotionMatches = false;

export function setPrefersReducedMotion(matches: boolean) {
  reducedMotionMatches = matches;
}

function createMatchMediaStub(query: string): MediaQueryList {
  const isReducedMotionQuery = query.includes("prefers-reduced-motion");
  return {
    matches: isReducedMotionQuery ? reducedMotionMatches : false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  } as MediaQueryList;
}

window.matchMedia = ((query: string) => createMatchMediaStub(query)) as typeof window.matchMedia;

afterEach(() => {
  reducedMotionMatches = false;
});
