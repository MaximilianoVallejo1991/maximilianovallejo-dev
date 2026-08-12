# Verify Report: portfolio-career-timeline

Change: `portfolio-career-timeline` · Phase: `sdd-verify` · Store: hybrid
Reads: spec.md, design.md, tasks.md, content.md (all authoritative)

## Overall Verdict: **PASS**

0 CRITICAL, 0 WARNING, 1 SUGGESTION.

Independent re-verification (not a rubber-stamp of apply reports): build, test suite, and every spec
requirement/design constraint were checked directly against source. No prior verify-report existed for
this change (first run).

## Build & Test Re-confirmation

- `pnpm install` — up to date.
- `pnpm build` — `tsc -b && vite build` passes clean (proves ES/EN `PortfolioContent.experience` shape parity).
- `pnpm test` — 3 test files, 12 tests, all passing (`mergeMilestonesByYear.test.ts`, `TimelineNode.test.tsx`, `smoke.test.ts`).

Test content was inspected directly, not just pass/fail counts:
- `mergeMilestonesByYear.test.ts`: tests `parseYearStart` edge cases (`"2008"→2008`, `"2021–2022"→2021`,
  `"Continua"/"Ongoing"→Infinity`), full 16-item length + ascending order against the real `es.experience.branches`
  fixture, the 2008 tie-break (Scout before Taller Metalmecánico), "Continua" sorts last, AND an explicit
  Infinity-vs-Infinity two-branch fixture proving the comparator doesn't corrupt order (the exact gotcha
  design.md flags). This is genuine, non-trivial coverage.
- `TimelineNode.test.tsx`: renders with `icon="compass"` and asserts an `<svg>` is present inside
  `getByTestId("timeline-dot")`; renders without `icon` and asserts no `<svg>` and no crash. Both paths
  covered as spec requires.

## Findings

### CRITICAL: none

### WARNING: none

### SUGGESTION

1. `ConvergenceGraphic.tsx` hardcodes `fill-branch-*` / `stroke-branch-*` class strings directly rather than
   consuming `BRANCH_ACCENT[...].stroke` from `src/lib/branchAccent.ts` (which design.md defines with a
   `stroke` field seemingly for this purpose). Not a defect — output is correct and Tailwind's scanner still
   finds the literal classes — but it's a minor duplication of the color-to-class mapping in two places.
   Not spec-blocking; optional cleanup only.

## Spec Requirement Checklist

| Requirement | Status | Evidence |
|---|---|---|
| Data model shape (Milestone unchanged, ExperienceBranch/ExperienceData added) | PASS | `src/data/content.ts:54-72` matches design.md contract exactly |
| ES/EN shape parity via `tsc -b` | PASS | `pnpm build` green |
| No speculative Milestone fields | PASS | `Milestone` interface unchanged (year/title/description/photoUrl?) |
| Content correctness: 5/4/7=16 milestones, verbatim text | PASS | `content.es.ts:140-262`, `content.en.ts:140-261` diffed line-by-line against `content.md` — verbatim match both locales |
| Zero Lorem in experience data | PASS | `rg -i lorem` hits only pre-existing `certifications` block (untouched, out of scope) — zero hits in `experience` |
| Convergence graphic: aria-hidden, zero text/foreignObject, single viewBox | PASS | `ConvergenceGraphic.tsx` — no `<text>`/`foreignObject`, `aria-hidden="true"`, one `viewBox="0 0 900 180"`, `hidden md:block` |
| Independent branch accordions, default expanded | PASS | `Experience.tsx:15-19` `Record<string,boolean>` collapsed-state, `{}` initial = all expanded, toggle only touches its own key |
| Mobile: single merged chronological timeline, 16 items, tie-break | PASS | `mergeMilestonesByYear.ts` explicit comparator (`<`/`>`, never subtraction), verified no `<` `-` mixing; test suite covers order + tie-break + Infinity case |
| No accordions below md | PASS | Mobile path (`md:hidden`) renders one flat `<ol>`, no collapse controls |
| Legend + terminal card | PASS | `Experience.tsx:96-108` 3-chip legend, terminal card as last `<li>` in the merged `<ol>` |
| Accessibility: reduced-motion inherited, aria-expanded keyboard-operable | PASS | `fadeInItem`/`SectionWrapper` own `useReducedMotion`; no raw `animate=`/`transition=` bypass in `Experience.tsx`/`ConvergenceGraphic.tsx`; native `<button aria-expanded={expanded}>` |
| Navigation: `#experience` unchanged, EN label "Journey", ES "Trayectoria" | PASS | `content.en.ts:361` `label: "Journey"`, `content.es.ts:362` `label: "Trayectoria"` (pre-existing, untouched), both `href="#experience"` |
| `dev-testing-setup`: `pnpm test` green | PASS | 12/12 passing |
| Coverage for merge/sort + icon-in-dot | PASS | see Build & Test section above |

## Design Constraint Checklist

| Constraint | Status | Evidence |
|---|---|---|
| No `matchMedia`/`useMediaQuery`/`window.innerWidth` in scope files | PASS | grep hits only in unrelated pre-existing `Hero.tsx`/`SkillCarousel.tsx`, zero in `Experience.tsx`/`ConvergenceGraphic.tsx` |
| Pure Tailwind CSS gating (`hidden md:block` / `md:hidden`) | PASS | confirmed both classes used correctly |
| `expandedTrack`/`heroImage` fully removed | PASS | zero grep matches anywhere in `src/` |
| Accordion state `Record<string, boolean>` (D5) | PASS | `Experience.tsx:15` |
| No `enum` (erasableSyntaxOnly) | PASS | zero `enum` matches across all touched files |
| `import type` for type-only imports (verbatimModuleSyntax) | PASS | `content.ts`, `TimelineNode.tsx`, `mergeMilestonesByYear.ts` all use `import type` correctly |
| `TimelineNode` `icon`/`accentKey` optional, default `accentKey="accent"` | PASS | `TimelineNode.tsx:13-22` |
| `data-testid="timeline-dot"` present | PASS | `TimelineNode.tsx:39` |
| Vitest config in `vite.config.ts` (D6), explicit imports not globals (D7) | PASS | matches design.md verbatim |
| 5 devDeps only, no scope creep | PASS | `package.json` diff shows exactly `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/dom`, `@testing-library/jest-dom` |

## Non-Goals / Scope Check

`git diff main...feat/career-timeline --stat` — 17 files changed, all within design.md's File table
(`content.ts`, `content.es.ts`, `content.en.ts`, `Experience.tsx`, `ConvergenceGraphic.tsx`,
`mergeMilestonesByYear.ts`(+test), `branchAccent.ts`, `TimelineNode.tsx`(+test), `IconMap.tsx`, `index.css`,
`vite.config.ts`, `src/test/setup.ts`, `smoke.test.ts`, `package.json`, `pnpm-lock.yaml`). Zero touches to
`Hero.tsx`, `About`, `Skills`, `Projects`, `Certifications`, `Contact` sections. No new dependency beyond the
5 approved testing devDeps.

## Git Hygiene

`.gitignore` (`certificados/` addition) confirmed absent from all 4 commits (`0d809fd`, `dd408b1`, `1b5340d`,
`9a9ace5` — `git show --stat` on each shows no `.gitignore` entry) and remains uncommitted/untouched in the
working tree, exactly as it was before this change started.

## Tasks Completeness

All 24 tasks in `tasks.md` marked `[x]` (0 unchecked). Code state matches: Slice 0 harness exists and passes,
Slice 1 data model + content + minimal Experience retype done, Slice 2 accent/icon groundwork done, Slice 3
full dual-render-path rebuild + convergence graphic + merge helper done.

## Recommendation

`next_recommended`: **sdd-archive**. No CRITICAL or WARNING issues block archive. The one SUGGESTION is
optional polish, not a blocker.
