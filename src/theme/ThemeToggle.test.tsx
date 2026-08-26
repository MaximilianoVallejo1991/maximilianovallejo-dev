import { describe, expect, it, beforeEach } from "vitest";
import { render, fireEvent, waitFor } from "@testing-library/react";
import ThemeToggle from "./ThemeToggle";
import { ThemeProvider } from "./ThemeContext";
import { LanguageProvider } from "../i18n/LanguageContext";

/*
 * This file never calls `setPrefersReducedMotion` — the default matchMedia
 * stub returns `matches: false`, so `useReducedMotion()` is locked to
 * `false` for every render in this file (see the gotcha documented in
 * src/test/setup.ts). Reduced-motion scenarios live in
 * `ThemeToggle.reduced-motion.test.tsx`.
 *
 * localStorage persists across tests within a file (jsdom's window is
 * per-file, not per-test) and ThemeProvider reads it as its lazy initial
 * state — clear it before every test so each one starts from the same
 * "light" default instead of inheriting the previous test's toggle.
 */
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

describe("ThemeToggle — icon crossfade", () => {
  it("mounts both sun and moon icons simultaneously (always-mounted crossfade, no AnimatePresence)", () => {
    const { container } = renderToggle();
    expect(container.querySelectorAll("svg")).toHaveLength(2);
  });

  it("both icon wrapper elements are absolutely positioned and differentiated by opacity at rest", () => {
    const { container } = renderToggle();
    const wrappers = Array.from(container.querySelectorAll("button > span > span"));
    expect(wrappers).toHaveLength(2);
    for (const w of wrappers) {
      expect((w as HTMLElement).className).toContain("absolute");
    }
    const opacities = wrappers.map((w) => (w as HTMLElement).style.opacity);
    // Default theme is light (isDark=false). Per the pre-existing component's
    // own semantics (preserved unchanged by this change): the sun icon is
    // shown while isDark, the moon is shown while !isDark — i.e. moon
    // shown / sun hidden at rest (light theme).
    expect(opacities).toContain("1");
    expect(opacities).toContain("0");
  });

  it("crossfades moon -> sun on toggle (light -> dark)", async () => {
    const { container, getByRole } = renderToggle();
    const button = getByRole("button");
    const wrappersBefore = Array.from(
      container.querySelectorAll<HTMLElement>("button > span > span"),
    );
    expect(wrappersBefore[0].style.opacity).toBe("0"); // sun hidden (light theme)
    expect(wrappersBefore[1].style.opacity).toBe("1"); // moon shown (light theme)

    fireEvent.click(button);

    // The crossfade is an actual tween (duration 0.28s), not an instant
    // style swap — wait for it to settle at its target values.
    await waitFor(() => {
      const wrappersAfter = Array.from(
        container.querySelectorAll<HTMLElement>("button > span > span"),
      );
      expect(wrappersAfter[0].style.opacity).toBe("1"); // sun shown (dark theme)
      expect(wrappersAfter[1].style.opacity).toBe("0"); // moon hidden (dark theme)
    });
  });

  it("crossfades sun -> moon symmetrically on a second toggle (dark -> light)", async () => {
    const { container, getByRole } = renderToggle();
    const button = getByRole("button");

    fireEvent.click(button); // light -> dark
    await waitFor(() => {
      const wrappers = Array.from(container.querySelectorAll<HTMLElement>("button > span > span"));
      expect(wrappers[0].style.opacity).toBe("1");
    });

    fireEvent.click(button); // dark -> light
    await waitFor(() => {
      const wrappers = Array.from(container.querySelectorAll<HTMLElement>("button > span > span"));
      expect(wrappers[0].style.opacity).toBe("0"); // sun hidden again
      expect(wrappers[1].style.opacity).toBe("1"); // moon shown again
    });
  });

  it("applies rotate/scale transform under no-preference (full morph, not just opacity)", async () => {
    const { container, getByRole } = renderToggle();
    const button = getByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      const wrappers = Array.from(container.querySelectorAll<HTMLElement>("button > span > span"));
      // The now-hidden moon should carry the rotate/scale transform, not just opacity 0.
      expect(wrappers[1].style.transform).toContain("rotate");
      expect(wrappers[1].style.transform).toContain("scale");
    });
  });
});
