import { describe, expect, it, beforeAll, afterEach } from "vitest";
import { render, fireEvent, waitFor } from "@testing-library/react";
import Nav from "./Nav";
import { LanguageProvider } from "../../i18n/LanguageContext";
import { ThemeProvider } from "../../theme/ThemeContext";

/*
 * This file never calls `setPrefersReducedMotion` — the default matchMedia
 * stub (src/test/setup.ts) returns `matches: false`, so `useReducedMotion()`
 * is locked to `false` for every render in this file (see the gotcha
 * documented in setup.ts). The reduced-motion scenario for the nav
 * indicator lives in `Nav.reduced-motion.test.tsx`.
 */

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
});

describe("Nav — animated mobile menu (AnimatePresence)", () => {
  function openMenu(container: HTMLElement) {
    const hamburger = container.querySelector('button[aria-expanded]') as HTMLButtonElement;
    fireEvent.click(hamburger);
  }

  it("is not mounted when closed", () => {
    const { container } = renderNav();
    expect(container.querySelector('[aria-expanded="false"]')).not.toBeNull();
    expect(container.querySelectorAll('a[href="#about"]')).toHaveLength(1); // desktop only
  });

  it("mounts and opens with a height/opacity transition when the hamburger is clicked", () => {
    const { container } = renderNav();
    openMenu(container);
    // Mobile list is now mounted alongside the desktop list.
    expect(container.querySelectorAll('a[href="#about"]')).toHaveLength(2);
  });

  it("plays its exit animation instead of disappearing instantly when the menu closes", async () => {
    const { container } = renderNav();
    openMenu(container);
    expect(container.querySelectorAll('a[href="#about"]')).toHaveLength(2);

    // Close it
    openMenu(container);

    // Eventually the exit animation resolves and the mobile copy unmounts,
    // leaving only the desktop link.
    await waitFor(() => {
      expect(container.querySelectorAll('a[href="#about"]')).toHaveLength(1);
    });
  });

  it("closing via a nav link tap plays the exit animation and clears menuOpen", async () => {
    const { container } = renderNav();
    openMenu(container);

    const mobileLinks = Array.from(container.querySelectorAll('a[href="#about"]'));
    expect(mobileLinks).toHaveLength(2);
    const mobileLink = mobileLinks[1] as HTMLAnchorElement;
    fireEvent.click(mobileLink);

    await waitFor(() => {
      expect(container.querySelectorAll('a[href="#about"]')).toHaveLength(1);
    });
    expect(container.querySelector('[aria-expanded="false"]')).not.toBeNull();
  });
});
