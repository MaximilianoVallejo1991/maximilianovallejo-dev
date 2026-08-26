import { describe, expect, it, beforeAll, afterEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import Nav from "./Nav";
import { LanguageProvider } from "../../i18n/LanguageContext";
import { ThemeProvider } from "../../theme/ThemeContext";
import { setPrefersReducedMotion } from "../../test/setup";

beforeAll(() => {
  // jsdom does not implement IntersectionObserver; Nav's scroll-spy effect
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

function renderNav() {
  return render(
    <LanguageProvider>
      <ThemeProvider>
        <Nav />
      </ThemeProvider>
    </LanguageProvider>,
  );
}

function fireScroll(y: number) {
  Object.defineProperty(window, "scrollY", { value: y, configurable: true });
  fireEvent.scroll(window);
}

afterEach(() => {
  Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
});

describe("Nav — scroll-reactive header state", () => {
  it("crosses the threshold: applies the scrolled (blur/shadow) classes once scrollY > 8", () => {
    const { container } = renderNav();
    const header = container.querySelector("header")!;
    expect(header.className).toContain("border-transparent");
    expect(header.className).not.toContain("shadow-sm");

    fireScroll(9);
    expect(header.className).toContain("border-border");
    expect(header.className).toContain("shadow-sm");
    expect(header.className).toContain("backdrop-blur-md");
  });

  it("reverts below the threshold: removes the scrolled classes when scrolling back up", () => {
    const { container } = renderNav();
    const header = container.querySelector("header")!;

    fireScroll(20);
    expect(header.className).toContain("shadow-sm");

    fireScroll(0);
    expect(header.className).toContain("border-transparent");
    expect(header.className).not.toContain("shadow-sm");
  });

  it("no flicker at the boundary: the header height-relevant border is always present (transparent or visible), never removed", () => {
    const { container } = renderNav();
    const header = container.querySelector("header")!;

    // Unscrolled: border-transparent (still a border, so height never jumps)
    expect(header.className).toMatch(/\bborder-transparent\b/);

    fireScroll(9);
    expect(header.className).toMatch(/\bborder-border\b/);
    // Repeated events right at/above the threshold don't remove the border class
    fireScroll(10);
    expect(header.className).toMatch(/\bborder-border\b/);

    fireScroll(3);
    expect(header.className).toMatch(/\bborder-transparent\b/);
  });
});

describe("Nav — active-section indicator", () => {
  it("renders the desktop indicator at the active link (#hero, the default active section)", () => {
    const { getByTestId } = renderNav();
    expect(getByTestId("nav-indicator-desktop")).toBeInTheDocument();
  });

  it("desktop and mobile indicators coexist with distinct layoutId-mirroring identities when both lists are mounted", () => {
    const { container, getByTestId } = renderNav();
    // Desktop list is CSS-hidden (`hidden md:flex`) but always mounted.
    // Opening the mobile menu mounts the mobile list simultaneously.
    const hamburger = container.querySelector('button[aria-expanded]') as HTMLButtonElement;
    fireEvent.click(hamburger);

    const desktopIndicator = getByTestId("nav-indicator-desktop");
    const mobileIndicator = getByTestId("nav-indicator-mobile");
    expect(desktopIndicator).toBeInTheDocument();
    expect(mobileIndicator).toBeInTheDocument();
    expect(desktopIndicator).not.toBe(mobileIndicator);
  });

  it("renders the indicator regardless of the reduced-motion preference (slide is gated on the transition, not on presence)", () => {
    setPrefersReducedMotion(true);
    const { getByTestId } = renderNav();
    expect(getByTestId("nav-indicator-desktop")).toBeInTheDocument();
  });

  it("renders the indicator under no-preference too", () => {
    setPrefersReducedMotion(false);
    const { getByTestId } = renderNav();
    expect(getByTestId("nav-indicator-desktop")).toBeInTheDocument();
  });
});
