import { describe, expect, it, beforeAll } from "vitest";
import { render, waitFor } from "@testing-library/react";
import Hero from "./Hero";
import { LanguageProvider } from "../../i18n/LanguageContext";
import { es } from "../../data/content.es";
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

function renderHero() {
  return render(
    <LanguageProvider>
      <Hero />
    </LanguageProvider>,
  );
}

/*
 * See Hero.test.tsx: Motion sets `opacity` via the `opacity` presentation
 * ATTRIBUTE (not `style.opacity`) on SVG elements like our `<g>` wrappers.
 */
function readOpacity(el: Element): string {
  const styleOpacity = (el as HTMLElement).style?.opacity;
  if (styleOpacity) return styleOpacity;
  return el.getAttribute("opacity") ?? "";
}

describe("Hero — line-stagger reveal suppressed under prefers-reduced-motion: reduce", () => {
  it("all three desktop lines fade in together (no relative stagger offset) instead of sequentially", async () => {
    const { container } = renderHero();
    const desktopSvg = container.querySelector(".hidden.md\\:block svg")!;
    const greetingWrapper = Array.from(desktopSvg.querySelectorAll("text")).find(
      (t) => t.textContent === es.hero.greeting,
    )!.parentElement as HTMLElement;
    const nameWrapper = Array.from(desktopSvg.querySelectorAll("text")).find(
      (t) => t.textContent === es.hero.name,
    )!.parentElement as HTMLElement;
    const subtitleWrapper = Array.from(desktopSvg.querySelectorAll("text")).find(
      (t) => t.textContent === es.hero.subtitle,
    )!.parentElement as HTMLElement;

    // Under reduce, all three share delay: 0 — the moment the first one
    // reaches full opacity, the other two (no longer offset behind it)
    // should already match too (same duration, same start time).
    await waitFor(
      () => {
        expect(readOpacity(greetingWrapper)).toBe("1");
      },
      { timeout: 3000 },
    );
    expect(readOpacity(nameWrapper)).toBe("1");
    expect(readOpacity(subtitleWrapper)).toBe("1");
  });

  it("suppresses the y offset (no rise transform, opacity-only reveal)", () => {
    const { container } = renderHero();
    const desktopSvg = container.querySelector(".hidden.md\\:block svg")!;
    const greetingWrapper = Array.from(desktopSvg.querySelectorAll("text")).find(
      (t) => t.textContent === es.hero.greeting,
    )!.parentElement as HTMLElement;

    // initial={{ y: prefersReduced ? 0 : 12 }} — no vertical transform to animate from.
    expect(greetingWrapper.style.transform === "" || greetingWrapper.style.transform === "none").toBe(
      true,
    );
  });
});
