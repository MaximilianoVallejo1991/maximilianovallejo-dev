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
 *
 * Gotcha (important for anyone adding a new reduced-motion test):
 * `useReducedMotion()` (motion/react) does NOT read `matchMedia` on every
 * render. It lazily initializes a MODULE-LEVEL singleton exactly once per
 * test file and never re-reads it afterwards (it only listens for a live
 * "change" event, which this stub's `addEventListener` intentionally
 * no-ops). That means within a single test file, the FIRST render that
 * mounts any component calling `useReducedMotion()` freezes the value for
 * the rest of that file, regardless of later `setPrefersReducedMotion`
 * calls. Consequence: a test file that needs BOTH a reduced-motion and a
 * no-preference scenario for a `useReducedMotion()` consumer MUST split
 * them into separate test files (Vitest gives each file its own isolated
 * module registry, so each file gets its own fresh singleton). Call
 * `setPrefersReducedMotion(true)` once, before the first render in that
 * file (e.g. top-level or in `beforeAll`), rather than per-test.
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
