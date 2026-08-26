import { describe, expect, it, beforeAll } from "vitest";
import { render, fireEvent, waitFor } from "@testing-library/react";
import Hero from "./Hero";
import { LanguageProvider } from "../../i18n/LanguageContext";
import LanguageSwitch from "../../i18n/LanguageSwitch";
import { es } from "../../data/content.es";
import { en } from "../../data/content.en";

/*
 * This file never calls `setPrefersReducedMotion` — the default matchMedia
 * stub returns `matches: false`, so `useReducedMotion()` is locked to
 * `false` for every render in this file (see the gotcha documented in
 * src/test/setup.ts). Reduced-motion scenarios live in
 * `Hero.reduced-motion.test.tsx`.
 */

beforeAll(() => {
  // jsdom does not implement IntersectionObserver; Hero's in-view effect
  // needs a stub present to mount without throwing.
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

/*
 * Motion renders `opacity` differently depending on element type: on HTML
 * elements it's set via `style.opacity`, but on SVG elements (our `<g>`
 * wrappers) it's set via the `opacity` presentation ATTRIBUTE instead —
 * `style.opacity` stays empty/stale for SVG. Read whichever is present.
 */
function readOpacity(el: Element): string {
  const styleOpacity = (el as HTMLElement).style?.opacity;
  if (styleOpacity) return styleOpacity;
  return el.getAttribute("opacity") ?? "";
}

function renderHero() {
  return render(
    <LanguageProvider>
      <LanguageSwitch />
      <Hero />
    </LanguageProvider>,
  );
}

describe("Hero — line-stagger coordinate lock (regression guard)", () => {
  it("desktop <text> x/y attributes are unchanged from main, in ES (default locale)", () => {
    const { container } = renderHero();
    const desktopSvg = container.querySelector(".hidden.md\\:block svg")!;
    const greeting = Array.from(desktopSvg.querySelectorAll("text")).find(
      (t) => t.textContent === es.hero.greeting,
    )!;
    const name = Array.from(desktopSvg.querySelectorAll("text")).find(
      (t) => t.textContent === es.hero.name,
    )!;
    const subtitle = Array.from(desktopSvg.querySelectorAll("text")).find(
      (t) => t.textContent === es.hero.subtitle,
    )!;

    expect(greeting.getAttribute("x")).toBe("500");
    expect(greeting.getAttribute("y")).toBe("308");
    expect(name.getAttribute("x")).toBe("500");
    expect(name.getAttribute("y")).toBe("356");
    expect(subtitle.getAttribute("x")).toBe("500");
    expect(subtitle.getAttribute("y")).toBe("400");
  });

  it("mobile <text> x/y attributes are unchanged from main, in ES (default locale)", () => {
    const { container } = renderHero();
    const mobileSvg = container.querySelector(".md\\:hidden svg")!;
    const greeting = Array.from(mobileSvg.querySelectorAll("text")).find(
      (t) => t.textContent === es.hero.mobileGreeting,
    )!;
    const name = Array.from(mobileSvg.querySelectorAll("text")).find(
      (t) => t.textContent === es.hero.mobileName,
    )!;
    const subtitle = Array.from(mobileSvg.querySelectorAll("text")).find(
      (t) => t.textContent === es.hero.mobileSubtitle,
    )!;

    expect(greeting.getAttribute("x")).toBe("195");
    expect(greeting.getAttribute("y")).toBe("274");
    expect(name.getAttribute("x")).toBe("195");
    expect(name.getAttribute("y")).toBe("296");
    expect(subtitle.getAttribute("x")).toBe("195");
    expect(subtitle.getAttribute("y")).toBe("314");
  });

  it("desktop <text> x/y attributes are unchanged from main, in EN", () => {
    const { container, getByLabelText } = renderHero();
    fireEvent.click(getByLabelText("Switch to English"));

    const desktopSvg = container.querySelector(".hidden.md\\:block svg")!;
    const greeting = Array.from(desktopSvg.querySelectorAll("text")).find(
      (t) => t.textContent === en.hero.greeting,
    )!;
    const name = Array.from(desktopSvg.querySelectorAll("text")).find(
      (t) => t.textContent === en.hero.name,
    )!;
    const subtitle = Array.from(desktopSvg.querySelectorAll("text")).find(
      (t) => t.textContent === en.hero.subtitle,
    )!;

    expect(greeting.getAttribute("x")).toBe("500");
    expect(greeting.getAttribute("y")).toBe("308");
    expect(name.getAttribute("x")).toBe("500");
    expect(name.getAttribute("y")).toBe("356");
    expect(subtitle.getAttribute("x")).toBe("500");
    expect(subtitle.getAttribute("y")).toBe("400");
  });

  it("mobile <text> x/y attributes are unchanged from main, in EN", () => {
    const { container, getByLabelText } = renderHero();
    fireEvent.click(getByLabelText("Switch to English"));

    const mobileSvg = container.querySelector(".md\\:hidden svg")!;
    const greeting = Array.from(mobileSvg.querySelectorAll("text")).find(
      (t) => t.textContent === en.hero.mobileGreeting,
    )!;
    const name = Array.from(mobileSvg.querySelectorAll("text")).find(
      (t) => t.textContent === en.hero.mobileName,
    )!;
    const subtitle = Array.from(mobileSvg.querySelectorAll("text")).find(
      (t) => t.textContent === en.hero.mobileSubtitle,
    )!;

    expect(greeting.getAttribute("x")).toBe("195");
    expect(greeting.getAttribute("y")).toBe("274");
    expect(name.getAttribute("x")).toBe("195");
    expect(name.getAttribute("y")).toBe("296");
    expect(subtitle.getAttribute("x")).toBe("195");
    expect(subtitle.getAttribute("y")).toBe("314");
  });
});

describe("Hero — line-stagger reveal (no reduced-motion preference)", () => {
  it("wraps each desktop text line in a motion.g that starts hidden (opacity 0) and eventually reveals it", async () => {
    const { container } = renderHero();
    const desktopSvg = container.querySelector(".hidden.md\\:block svg")!;
    const greetingText = Array.from(desktopSvg.querySelectorAll("text")).find(
      (t) => t.textContent === es.hero.greeting,
    )!;
    const wrapper = greetingText.parentElement as HTMLElement | SVGGElement;
    expect(wrapper.tagName.toLowerCase()).toBe("g");
    expect(readOpacity(wrapper)).toBe("0");

    await waitFor(
      () => {
        expect(readOpacity(wrapper)).toBe("1");
      },
      { timeout: 3000 },
    );
  });

  it("reveals greeting before name (staggered, increasing delay) on desktop", async () => {
    const { container } = renderHero();
    const desktopSvg = container.querySelector(".hidden.md\\:block svg")!;
    const greetingWrapper = Array.from(desktopSvg.querySelectorAll("text")).find(
      (t) => t.textContent === es.hero.greeting,
    )!.parentElement as HTMLElement;
    const nameWrapper = Array.from(desktopSvg.querySelectorAll("text")).find(
      (t) => t.textContent === es.hero.name,
    )!.parentElement as HTMLElement;

    await waitFor(
      () => {
        expect(readOpacity(greetingWrapper)).toBe("1");
      },
      { timeout: 3000 },
    );
    // At the moment greeting first finishes, name (180ms further behind)
    // should not have finished yet.
    expect(readOpacity(nameWrapper)).not.toBe("1");

    await waitFor(
      () => {
        expect(readOpacity(nameWrapper)).toBe("1");
      },
      { timeout: 3000 },
    );
  });

  it("eventually reveals all three mobile lines too", async () => {
    const { container } = renderHero();
    const mobileSvg = container.querySelector(".md\\:hidden svg")!;
    const wrappers = ["mobileGreeting", "mobileName", "mobileSubtitle"].map(
      (key) =>
        Array.from(mobileSvg.querySelectorAll("text")).find(
          (t) => t.textContent === es.hero[key as keyof typeof es.hero],
        )!.parentElement as HTMLElement,
    );

    for (const w of wrappers) {
      await waitFor(() => expect(readOpacity(w)).toBe("1"), { timeout: 3000 });
    }
  });
});
