import { describe, expect, it, beforeAll } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import Experience from "./Experience";
import { LanguageProvider } from "../../i18n/LanguageContext";

beforeAll(() => {
  // jsdom does not implement IntersectionObserver; SectionWrapper's
  // useInView (motion/react) needs a stub present to mount without throwing.
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

function renderExperience() {
  return render(
    <LanguageProvider>
      <Experience />
    </LanguageProvider>,
  );
}

describe("Experience", () => {
  it("renders 18 milestones on desktop (16 real + synthetic 'present' markers for soft and trade) and 16 on the mobile merged list", () => {
    const { container } = renderExperience();
    // Both the desktop and mobile trees are always mounted (visibility is
    // CSS-only via `hidden md:block` / `md:hidden`). Desktop's getBranchLayout
    // appends a synthetic present-label milestone to any branch that doesn't
    // already end at CURRENT_YEAR (soft, trade — study already ends on its
    // own open-ended "Continua"), so desktop has 2 more dots than the 16 real
    // milestones. Mobile's merged list doesn't synthesize these.
    // 18 desktop + 16 mobile = 34.
    const dots = container.querySelectorAll('[data-testid="timeline-dot"]');
    expect(dots).toHaveLength(34);
  });

  it("renders exactly one connector rail per branch column on desktop (3 branches)", () => {
    const { container } = renderExperience();
    const desktopWrapper = container.querySelector(".hidden.md\\:block");
    expect(desktopWrapper).not.toBeNull();
    const rails = desktopWrapper!.querySelectorAll('[aria-hidden="true"].absolute.inset-y-0');
    expect(rails).toHaveLength(3);
  });

  it("renders no accordion toggle anywhere (no aria-expanded) — the branch-label buttons toggle a full-branch sweep highlight, not a collapse/expand", () => {
    const { container } = renderExperience();
    expect(container.querySelector("[aria-expanded]")).toBeNull();
  });

  it("clicking a branch's label button toggles it active, and clicking it again clears it", () => {
    const { container } = renderExperience();
    // "Hab. Blandas" also appears in the mobile legend row — scope to the
    // desktop <h3> (inside a real <button>), not the mobile <span>.
    const h3 = Array.from(container.querySelectorAll("h3")).find(
      (el) => el.textContent === "Hab. Blandas",
    )!;
    expect(h3).not.toBeUndefined();
    const button = h3.closest("button")!;
    expect(button).not.toBeNull();

    fireEvent.click(button);
    expect(h3.className.split(/\s+/)).toContain("text-branch-soft");

    fireEvent.click(button);
    expect(h3.className.split(/\s+/)).not.toContain("text-branch-soft");
  });

  it("clicking the origin name sweeps every branch's title into its own accent color at once, and clicking it again clears all of them", () => {
    const { container } = renderExperience();
    const originButton = Array.from(container.querySelectorAll("button")).find((b) =>
      b.textContent?.includes("José Maximiliano Vallejo"),
    )!;
    expect(originButton).not.toBeUndefined();

    fireEvent.click(originButton);
    const branchTitles = ["Hab. Blandas", "Oficio", "Estudios Formales"];
    const h3s = branchTitles.map(
      (label) =>
        Array.from(container.querySelectorAll("h3")).find((el) => el.textContent === label)!,
    );
    for (const h3 of h3s) {
      const classes = h3.className.split(/\s+/);
      expect(classes.some((c) => c.startsWith("text-branch-"))).toBe(true);
    }

    fireEvent.click(originButton);
    for (const h3 of h3s) {
      const classes = h3.className.split(/\s+/);
      expect(classes.some((c) => c.startsWith("text-branch-"))).toBe(false);
    }
  });

  it("renders the mobile merged timeline with all 16 milestones in one chronological list", () => {
    const { container } = renderExperience();
    const mobileWrapper = container.querySelector(".md\\:hidden");
    expect(mobileWrapper).not.toBeNull();
    const mobileDots = mobileWrapper!.querySelectorAll('[data-testid="timeline-dot"]');
    expect(mobileDots).toHaveLength(16);
  });

  it("passes branchEndOffsets derived from real content into ConvergenceGraphic, and renders DivergenceGraphic above the columns (3 + 3 = 6 endpoint circles)", () => {
    const { container } = renderExperience();
    // ConvergenceGraphic renders one r=7 endpoint circle per branch below the
    // grid; DivergenceGraphic renders one r=7 branch-start circle per branch
    // above it — 3 + 3 = 6 total.
    const endpoints = container.querySelectorAll('circle[r="7"]');
    expect(endpoints).toHaveLength(6);
  });
});
