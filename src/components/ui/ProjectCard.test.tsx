import { describe, expect, it } from "vitest";
import { render, fireEvent, waitFor } from "@testing-library/react";
import ProjectCard from "./ProjectCard";
import type { Project } from "../../data/content";

/*
 * This file never calls `setPrefersReducedMotion` — the default matchMedia
 * stub returns `matches: false`, so `useReducedMotion()` is locked to
 * `false` for every render in this file (see the gotcha documented in
 * src/test/setup.ts). Reduced-motion scenarios live in
 * `ProjectCard.reduced-motion.test.tsx`.
 */

const project: Project = {
  slug: "test-project",
  title: "Test Project",
  description: "A test project",
  techTags: ["React", "TypeScript"],
  repoUrl: "https://github.com/example/test",
  screenshot: "/test.png",
};

describe("ProjectCard — hover lift (no reduced-motion preference)", () => {
  it("applies a y/scale transform on the card on hover, without a box-shadow", async () => {
    const { container } = render(<ProjectCard project={project} index={0} />);
    const article = container.querySelector("article")!;

    fireEvent.pointerEnter(article);
    await waitFor(() => {
      expect(article.style.transform).not.toBe("");
      expect(article.style.transform).not.toBe("none");
    });
    expect(article.style.boxShadow).toBe("");
  });

  it("returns to rest on hover-out", async () => {
    const { container } = render(<ProjectCard project={project} index={0} />);
    const article = container.querySelector("article")!;

    fireEvent.pointerEnter(article);
    await waitFor(() => {
      expect(article.style.transform).not.toBe("");
    });

    fireEvent.pointerLeave(article);
    await waitFor(() => {
      const t = article.style.transform;
      expect(t === "" || t === "none").toBe(true);
    });
  });

  it("retunes the inner image zoom to duration-300 (matches the card's ~250ms spring settle instead of lagging at 500ms)", () => {
    const { container } = render(<ProjectCard project={project} index={0} />);
    const img = container.querySelector("img")!;
    expect(img.className).toContain("duration-300");
    expect(img.className).not.toContain("duration-500");
    // Composes with the card-level lift: both the CSS zoom and the card's
    // whileHover transform are present, and the card keeps overflow-hidden
    // (via its wrapping div) so the extra scale is clipped cleanly.
    expect(img.className).toContain("group-hover:scale-105");
  });
});
