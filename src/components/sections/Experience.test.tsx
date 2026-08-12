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
  it("renders all 16 milestones on desktop (5 soft + 4 trade + 7 study) and 16 on the mobile merged list", () => {
    const { container } = renderExperience();
    // Both the desktop and mobile trees are always mounted (visibility is
    // CSS-only via `hidden md:block` / `md:hidden`), so every milestone dot
    // appears twice in the DOM: 16 desktop + 16 mobile = 32.
    const dots = container.querySelectorAll('[data-testid="timeline-dot"]');
    expect(dots).toHaveLength(32);
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
