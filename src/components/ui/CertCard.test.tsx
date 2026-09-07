import { describe, expect, it } from "vitest";
import { render, fireEvent, waitFor } from "@testing-library/react";
import CertCard from "./CertCard";
import type { CertItem } from "../../data/content";

/*
 * This file never calls `setPrefersReducedMotion` — the default matchMedia
 * stub returns `matches: false`, so `useReducedMotion()` is locked to
 * `false` for every render in this file (see the gotcha documented in
 * src/test/setup.ts). Reduced-motion scenarios live in
 * `CertCard.reduced-motion.test.tsx`.
 */

const cert: CertItem = {
  title: "Test Cert",
  issuer: "Test Issuer",
  year: "2024",
  description: "Test description",
  thumbnailUrl: "https://example.com/thumb.jpg",
  imageUrl: "https://example.com/full.jpg",
};

const noop = () => {};

describe("CertCard — hover lift (no reduced-motion preference)", () => {
  it("applies a y/scale transform on hover", async () => {
    const { container } = render(<CertCard cert={cert} index={0} onOpen={noop} />);
    const article = container.querySelector("article")!;

    expect(article.style.boxShadow).toBe("");
    fireEvent.pointerEnter(article);

    await waitFor(() => {
      expect(article.style.transform).not.toBe("");
      expect(article.style.transform).not.toBe("none");
    });
    // Hard constraint: no box-shadow introduced by the hover state.
    expect(article.style.boxShadow).toBe("");
  });

  it("returns to rest (no transform) on hover-out", async () => {
    const { container } = render(<CertCard cert={cert} index={0} onOpen={noop} />);
    const article = container.querySelector("article")!;

    fireEvent.pointerEnter(article);
    await waitFor(() => {
      expect(article.style.transform).not.toBe("");
      expect(article.style.transform).not.toBe("none");
    });

    fireEvent.pointerLeave(article);
    await waitFor(() => {
      const t = article.style.transform;
      expect(t === "" || t === "none").toBe(true);
    });
  });
});
