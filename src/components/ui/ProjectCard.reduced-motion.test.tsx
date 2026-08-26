import { describe, expect, it, beforeAll } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import ProjectCard from "./ProjectCard";
import type { Project } from "../../data/content";
import { setPrefersReducedMotion } from "../../test/setup";

/*
 * `useReducedMotion()` freezes its value on the FIRST render in a test file
 * (see the gotcha documented in src/test/setup.ts) — so the reduce
 * preference is set once, before any component in this file ever mounts.
 */
beforeAll(() => {
  setPrefersReducedMotion(true);
});

const project: Project = {
  slug: "test-project",
  title: "Test Project",
  description: "A test project",
  techTags: ["React", "TypeScript"],
  repoUrl: "https://github.com/example/test",
  screenshot: "/test.png",
};

describe("ProjectCard — card-level hover lift suppressed under prefers-reduced-motion: reduce", () => {
  it("applies no transform on the card on hover", () => {
    const { container } = render(<ProjectCard project={project} index={0} />);
    const article = container.querySelector("article")!;

    fireEvent.pointerEnter(article);
    expect(article.style.transform === "" || article.style.transform === "none").toBe(true);
  });
});
