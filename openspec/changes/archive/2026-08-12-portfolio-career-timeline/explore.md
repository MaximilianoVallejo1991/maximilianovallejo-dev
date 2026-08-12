# Exploration: Career-Journey Trajectory Diagram Section

Change: `portfolio-career-timeline`
Date: 2026-08-11
Phase: sdd-explore
Status: partial (see risks — persistence had to be done by orchestrator, not the explore sub-agent)

## Source

Hand-sketched diagram (photo) provided by the user: three parallel career branches converging into a single outcome node "Desarrollador Full Stack":

- **Hab. Blandas (Soft Skills)**: Scout (2008) → Instructor (2017) → Guía de Montaña (2020)
- **Oficio (Trade/Craft)**: Taller Metalmecánico (2008) → Emme 3D, own venture (2019) → PLC (no date) → PJT Sistemas (2022)
- **Estudios Formales (Formal Education)**: Téc. Rep. Electrodomésticos (2007) → Téc. Constructor (2009) → MMO (2010) → Ciclo Básico Ingeniería Química (2011) → Arg. Programa (2019) → QA UTN (2020) → Capacitación continua (ongoing)

## Current State

**Content pattern** (`src/data/content.ts`, `content.en.ts`, `content.es.ts`):
- Shared `PortfolioContent` interface; two typed plain objects (`content.en.ts`/`content.es.ts`) picked by `useContent()` based on `LanguageContext`. No i18next — TypeScript enforces shape parity.
- Existing types already close to what's needed:
  ```ts
  export interface Milestone {
    year: string;
    title: string;
    description: string;
    photoUrl?: string;
  }
  export interface ExperienceTrack {
    trackKey: string;
    trackLabel: string;
    heroImage: string;
    milestones: Milestone[];
  }
  ```
- `content.experience: ExperienceTrack[]` currently holds 4 tracks (`voluntariado`, `industria`, `tech`, `oficios`), **100% Lorem Ipsum placeholder**. Doesn't map cleanly to the sketch's 3 branches, and has no "convergence" concept.

**Component pattern** (`src/components/`):
- `sections/` = one file per page section, composed in fixed order in `Layout.tsx`.
- `ui/` = reusable pieces (`SectionWrapper`, `TimelineNode`, `SkillCarousel`, `IconMap`, `Tag`, `ProjectCard`, `CertCard`, `SkillCard`).
- `Experience.tsx` already exists: accordion per track → expands into vertical dotted timeline of milestones via `TimelineNode.tsx` (dot, connector, year/title/description, optional thumbnail). Solid, accessible, reusable — but no branch-convergence visual.
- Styling: Tailwind CSS v4 utility classes + CSS custom properties for light/dark theme. No CSS modules.
- Animation: `motion` (v12, `"motion/react"`, not framer-motion). `SectionWrapper.tsx` = shared fade/stagger-in wrapper (`useInView`, respects `useReducedMotion()`).

**SVG/diagram pattern** (`Hero.tsx`):
- Closest visual precedent for "branches converging to one node": 5 skill nodes with diagonal paths converging to a center text block, one `viewBox` for desktop.
- Fully bespoke: hand-tuned pixel coordinates per node, **entirely separate hardcoded coordinate set for mobile** (different `viewBox`, `foreignObject`-wrapped text). No reusable abstraction.
- Hero's nodes are single-label leaves — the sketch needs each branch to hold 3–7 dated milestones, a harder rendering problem.

**Layout wiring**: `Layout.tsx` imports each section + fixed JSX order; new section needs import + line + typically a `navLinks` entry in both locale files.

## Affected Areas

- `src/data/content.ts` — type changes: reshape `Milestone`/`ExperienceTrack`, or add new type (e.g. `CareerBranch`).
- `src/data/content.en.ts` / `content.es.ts` — `experience` is placeholder; needs real bilingual content authored for all 3 branches.
- `src/components/sections/Experience.tsx` — repurpose to match 3-branch/convergence structure, or add a new parallel section.
- `src/components/ui/TimelineNode.tsx` — directly reusable inside any branch layout.
- `src/components/sections/Hero.tsx` — reference-only; not modified. Its hardcoding approach is a cautionary precedent for effort estimation.
- `src/components/layout/Layout.tsx` — wire in new/changed section.
- `navLinks` in both locale files — may need relabeling if section identity changes.
- `package.json` — **no test runner configured** (no vitest/jest/testing-library), while Strict TDD Mode is flagged active for this session.

## Approaches

1. **Extend existing `Experience` section/data in place** — rename 4 placeholder tracks to the 3 sketch branches, populate real milestones, keep accordion + `TimelineNode` list, no new diagram.
   - Pros: minimal new code, reuses proven accessible components, low risk, inherently responsive.
   - Cons: does NOT deliver the "3 branches converging into one node" visual — loses the core narrative payoff.
   - Effort: Low.

2. **Full custom branching SVG diagram**, generalizing/extending the Hero pattern.
   - Pros: faithful to the sketch, strongest storytelling value.
   - Cons: Hero's precedent shows this needs two fully hand-tuned hardcoded coordinate sets for just 5 single-label nodes; scaling to 3 branches × up to 7 dated milestones is much larger, no reusable abstraction, accessibility unsolved anywhere in the codebase.
   - Effort: High.

3. **Hybrid** — simplified, mostly-CSS/lightweight-SVG "3-columns-converging-to-1" visual as a compact section header/graphic, with the existing accordion + `TimelineNode` list underneath for full per-milestone detail (reusing/renaming `ExperienceTrack`/`Milestone` types).
   - Pros: delivers the convergence metaphor without Hero-level pixel hardcoding; keeps rich detail in the already-built, responsive, accessible list; incremental content-model changes.
   - Cons: still real new design work; less "wow" than a full diagram; needs a decision for PLC (no date) and "Capacitación continua" (ongoing).
   - Effort: Medium.

## Recommendation

**Approach 3 (hybrid)**: best effort/impact balance. Reuses the proven `TimelineNode`/`SectionWrapper`/typed-content pipeline, avoids Hero's brittle per-pixel dual-coordinate hardcoding, still delivers the "branches converge into Full Stack Developer" narrative. Approach 2 is a reasonable stretch goal for a later iteration once the hybrid ships and the user can react to it.

## Risks

- No test runner configured — Strict TDD Mode is active this session but has nothing to run against. Must be resolved (add vitest + testing-library, or explicitly scope this change out of TDD enforcement) before `sdd-apply`.
- `experience` content is 100% placeholder — this is a full rewrite of that section's data/identity, not a pure addition. Scope (replace vs. add new section) must be confirmed with user.
- Mapping the sketch's 3 branches onto (or alongside) the existing 4 placeholder tracks is ambiguous — risks losing/mixing unrelated placeholder content (e.g. "tech"/"pjudicial" milestones) if not decided explicitly.
- Hero's SVG pattern is cautionary, not reusable — if approach 2 is chosen later, expect meaningfully more implementation + cross-breakpoint QA effort than Hero itself took.

## Open Questions for Proposal Phase

1. Replace/reshape the existing `experience` section+data to the 3 sketch branches, or add a new parallel `trajectory` section/type alongside it?
2. Confirm approach 1 / 2 / 3 (recommend 3) given the sketch's visual importance to the user.
3. Vertical (stacked) vs. horizontal layout, and mobile strategy for 3 parallel branches.
4. Keep original Spanish labels (Hab. Blandas / Oficio / Estudios Formales) verbatim, or reword for a professional bilingual portfolio audience — and what are the EN equivalents?
5. Where does "PLC" (a skill, not dated) fit in the Oficio branch?
6. How to model "Capacitación continua" (ongoing, no end date)?
7. Dedicated nav entry (e.g. "Trayectoria"/"Journey"), replace `#experience` link, or subsection of `About`?
8. Resolve missing test-runner gap before implementation, given Strict TDD Mode is active.

## Status

Ready for proposal: **Yes**, pending the open questions above being resolved with the user before/during `sdd-propose`.

Next recommended phase: `sdd-propose`.
