import { describe, expect, it, beforeAll } from "vitest";
import { render } from "@testing-library/react";
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

  it("renders no accordion toggle anywhere (no button, no aria-expanded)", () => {
    const { container } = renderExperience();
    expect(container.querySelector("button")).toBeNull();
    expect(container.querySelector("[aria-expanded]")).toBeNull();
  });

  it("renders the mobile merged timeline with all 16 milestones in one chronological list", () => {
    const { container } = renderExperience();
    const mobileWrapper = container.querySelector(".md\\:hidden");
    expect(mobileWrapper).not.toBeNull();
    const mobileDots = mobileWrapper!.querySelectorAll('[data-testid="timeline-dot"]');
    expect(mobileDots).toHaveLength(16);
  });

  it("passes branchEndOffsets derived from real content into ConvergenceGraphic (3 endpoint circles)", () => {
    const { container } = renderExperience();
    // ConvergenceGraphic renders one r=7 endpoint circle per branch (soft/trade/study).
    const endpoints = container.querySelectorAll('circle[r="7"]');
    expect(endpoints).toHaveLength(3);
  });
});
