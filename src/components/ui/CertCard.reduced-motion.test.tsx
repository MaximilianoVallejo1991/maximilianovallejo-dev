import { describe, expect, it, beforeAll } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import CertCard from "./CertCard";
import type { CertItem } from "../../data/content";
import { setPrefersReducedMotion } from "../../test/setup";

/*
 * `useReducedMotion()` freezes its value on the FIRST render in a test file
 * (see the gotcha documented in src/test/setup.ts) — so the reduce
 * preference is set once, before any component in this file ever mounts.
 */
beforeAll(() => {
  setPrefersReducedMotion(true);
});

const cert: CertItem = {
  title: "Test Cert",
  issuer: "Test Issuer",
  year: "2024",
};

describe("CertCard — hover lift suppressed under prefers-reduced-motion: reduce", () => {
  it("applies no transform on hover", () => {
    const { container } = render(<CertCard cert={cert} index={0} />);
    const article = container.querySelector("article")!;

    fireEvent.pointerEnter(article);
    // whileHover={undefined} under reduce — no transform gesture is wired up.
    expect(article.style.transform === "" || article.style.transform === "none").toBe(true);
  });
});
