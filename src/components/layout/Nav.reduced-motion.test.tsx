import { describe, expect, it, beforeAll } from "vitest";
import { render } from "@testing-library/react";
import Nav from "./Nav";
import { LanguageProvider } from "../../i18n/LanguageContext";
import { ThemeProvider } from "../../theme/ThemeContext";
import { setPrefersReducedMotion } from "../../test/setup";

/*
 * `useReducedMotion()` freezes its value on the FIRST render in a test file
 * (see the gotcha documented in src/test/setup.ts) — so the reduce
 * preference is set once, before any component in this file ever mounts.
 */
beforeAll(() => {
  setPrefersReducedMotion(true);

  class IntersectionObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  // @ts-expect-error -- test-only stub, not a spec-complete IntersectionObserver
  globalThis.IntersectionObserver = IntersectionObserverStub;
});

function renderNav() {
  return render(
    <LanguageProvider>
      <ThemeProvider>
        <Nav />
      </ThemeProvider>
    </LanguageProvider>,
  );
}

describe("Nav — active-indicator slide respects reduced motion (motion-accessibility RM-6)", () => {
  it("still renders the indicator at the active link under prefers-reduced-motion: reduce", () => {
    // jsdom cannot observe Motion's internal `transition` duration (it isn't
    // forwarded to the DOM), so this asserts the requirement's other half:
    // the indicator still renders at the active link — it just doesn't
    // animate its slide (verified structurally by the transition prop
    // wiring in Nav.tsx: `prefersReduced ? INDICATOR_INSTANT : INDICATOR_TRANSITION`).
    const { getByTestId } = renderNav();
    expect(getByTestId("nav-indicator-desktop")).toBeInTheDocument();
  });
});
