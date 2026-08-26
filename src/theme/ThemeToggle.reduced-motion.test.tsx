import { describe, expect, it, beforeAll, beforeEach } from "vitest";
import { render, fireEvent, waitFor } from "@testing-library/react";
import ThemeToggle from "./ThemeToggle";
import { ThemeProvider } from "./ThemeContext";
import { LanguageProvider } from "../i18n/LanguageContext";
import { setPrefersReducedMotion } from "../test/setup";

/*
 * `useReducedMotion()` freezes its value on the FIRST render in a test file
 * (see the gotcha documented in src/test/setup.ts) — so the reduce
 * preference is set once, before any component in this file ever mounts.
 */
beforeAll(() => {
  setPrefersReducedMotion(true);
});

beforeEach(() => {
  localStorage.clear();
  document.documentElement.className = "";
});

function renderToggle() {
  return render(
    <LanguageProvider>
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    </LanguageProvider>,
  );
}

describe("ThemeToggle — rotation gated under prefers-reduced-motion: reduce, crossfade still allowed", () => {
  /*
   * Per design.md: gating happens on the `transition` (duration: 0 under
   * reduce), not on the animate target values — rotate/scale still end up
   * at the same final values, they just aren't tweened there. jsdom has no
   * real paint/rAF timeline to measure "instant vs 0.28s", so these tests
   * assert the reachable end-state (crossfade completes, rotate/scale
   * present) rather than a timing difference — the duration:0 vs
   * duration:0.28 wiring itself is asserted by source (Nav/ThemeToggle
   * both read `transition={prefersReduced ? *_INSTANT : *_TRANSITION}`).
   */
  it("still completes the crossfade under reduce (icon swap isn't suppressed, only the tween)", async () => {
    const { container, getByRole } = renderToggle();
    const button = getByRole("button");
    const wrappers = () =>
      Array.from(container.querySelectorAll<HTMLElement>("button > span > span"));

    expect(wrappers()[0].style.opacity).toBe("0"); // sun hidden (light theme)
    expect(wrappers()[1].style.opacity).toBe("1"); // moon shown (light theme)

    fireEvent.click(button);

    await waitFor(() => {
      expect(wrappers()[0].style.opacity).toBe("1"); // sun shown (dark theme)
      expect(wrappers()[1].style.opacity).toBe("0"); // moon hidden (dark theme)
    });
  });

  it("still reaches the same target rotate/scale values as the animated version", async () => {
    const { container, getByRole } = renderToggle();
    const button = getByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      const wrappers = Array.from(
        container.querySelectorAll<HTMLElement>("button > span > span"),
      );
      expect(wrappers[1].style.transform).toContain("scale(0.6)");
      expect(wrappers[1].style.transform).toContain("rotate(-90deg)");
    });
  });
});
