# Archive Report: portfolio-career-timeline

**Change**: `portfolio-career-timeline`
**Archive Date**: 2026-08-12
**Artifact Store Mode**: hybrid (engram + openspec)
**Project**: maximilianovallejo-dev

## Executive Summary

The SDD cycle for `portfolio-career-timeline` has been completed successfully. All 7 phases (explore, propose, spec, design, tasks, apply, verify) have been executed. The change has passed verification with **0 CRITICAL, 0 WARNING** findings. All code has been implemented on the feature branch `feat/career-timeline` (4 commits), passing build, tests, and spec validation. The planning cycle is closed and archived.

## Archive Contents

Complete SDD artifact trail for full traceability:

| Artifact | Phase | Status | File |
|---|---|---|---|
| **explore.md** | sdd-explore | ✅ Complete | Codebase analysis, 3 approaches evaluated, hybrid recommended |
| **proposal.md** | sdd-propose | ✅ Approved | 3-branch convergence narrative, 5 open-item decisions, scope + rollback plan |
| **spec.md** | sdd-spec | ✅ Authoritative | 21 scenarios, 2 capabilities (career-trajectory + dev-testing-setup), slice mapping |
| **design.md** | sdd-design | ✅ Finalized | 7 architecture decisions, data model contract, component tree, vitest harness |
| **tasks.md** | sdd-tasks | ✅ All 24 marked [x] | 4 work-unit slices, line estimates (886 total), delivery strategy |
| **content.md** | User-locked | ✅ Approved | 3 branches, 16 milestones (ES/EN bilingual), verbatim text |
| **verify-report.md** | sdd-verify | ✅ PASS | Independent verification, all spec + design constraints met, 12/12 tests passing |

## Implementation Summary

### Code Delivered (feat/career-timeline branch)

**Commits**: 4 chained work-unit commits on `feat/career-timeline`

| Slice | Goal | Changes | Status |
|---|---|---|---|
| 0 | Vitest + Testing Library harness | `vite.config.ts`, `src/test/setup.ts`, `package.json`, 5 devDeps added, smoke test | ✅ ~60 lines |
| 1 | Data model + real content | `content.ts` (types), `content.es.ts`, `content.en.ts` (16 milestones), nav label "Journey" | ✅ ~460 lines |
| 2 | Accent colors + icon groundwork | `index.css` (3 color tokens), `branchAccent.ts`, `IconMap.tsx` (3 branch icons), `TimelineNode.tsx` (props), test | ✅ ~120 lines |
| 3 | Convergence graphic + dual render paths | `ConvergenceGraphic.tsx`, `mergeMilestonesByYear.ts`/`.test.ts`, `Experience.tsx` rebuild (desktop 3-col + mobile merged timeline) | ✅ ~250 lines |

**Total**: ~890 lines of changes across 17 files (per verify-report).

### Test Coverage

- `pnpm test` — 12 passing tests across 3 test files:
  - `smoke.test.ts` — harness canary (trivial)
  - `mergeMilestonesByYear.test.ts` — unit: order, 2008 tie-break, Infinity edge cases, 16-item count
  - `TimelineNode.test.tsx` — component: icon-in-dot rendering with/without `icon` prop
- `pnpm build` — `tsc -b` ✅ (ES/EN shape parity enforced structurally)

### Specs Synced

No prior openspec/specs/ existed. Delta specs live only in the completed change. No main specs to merge into.

## Verification Results

**Verdict**: PASS (0 CRITICAL, 0 WARNING, 1 SUGGESTION)

### Critical/Warning Issues
None.

### Suggestions
1. Minor: `ConvergenceGraphic.tsx` duplicates branch accent class mappings instead of consuming `BRANCH_ACCENT[...].stroke`. Not spec-blocking; optional cleanup.

### Spec Requirements: All Met

| Requirement | Evidence |
|---|---|
| Data model shape | `ExperienceBranch`/`ExperienceData` added, `Milestone` unchanged |
| ES/EN parity | `tsc -b` passes, shape-enforced |
| No Lorem Ipsum | `rg -i lorem` zero hits in `experience` data |
| Desktop: 3-col + SVG graphic | `ConvergenceGraphic.tsx` aria-hidden, single viewBox, zero text nodes |
| Desktop: independent accordions, default expanded | `Record<string,boolean>` collapsed-state, initial `{}` = all expanded |
| Mobile: merged timeline, 16 items, tie-break | `mergeMilestonesByYear.ts` explicit comparator, 2008 Scout→Taller order verified |
| Accessibility: reduced-motion, keyboard toggle | Inherited from `SectionWrapper`, native button + aria-expanded |
| Navigation: stable `#experience`, EN "Journey" | `href="#experience"` unchanged, label updated in EN navLinks |
| Test runner green | `pnpm test` 12/12 pass, coverage includes merge/sort + icon-in-dot |

### Design Constraints: All Met

- No `matchMedia`/`useMediaQuery` in scope
- Pure Tailwind CSS gating (`hidden md:block` / `md:hidden`)
- No `enum`, all type imports use `import type`
- Accordion state as `Record<string, boolean>`
- Vitest in `vite.config.ts`, explicit imports (no globals)
- Exactly 5 devDeps added (vitest, jsdom, @testing-library/react, @testing-library/dom, @testing-library/jest-dom)

## Scope Adherence

17 files changed (all within design.md's File table). Zero touches to Hero, About, Skills, Projects, Certifications, Contact sections. No runtime dependencies added.

### Out of Scope (Deferred)

- Hero-style hardcoded per-node SVG (stretch goal)
- Milestone photos/thumbnails
- "Ver más" detail modal
- Icon libraries (MUI Timeline evaluated, rejected)
- Section id rename `#experience` → `#journey` (decision 4 kept `#experience` stable for scrollspy)

## Risks Addressed

| Risk | Mitigation | Status |
|---|---|---|
| SVG drifts toward Hero hardcoding | Hard constraint: no text in SVG, no second viewBox. Verified in verify-report | ✅ Mitigated |
| Slice 1 busts review budget | Content is data-only, verbatim-copy, low complexity. Flagged for `size:exception` if needed | ✅ Flagged |
| Hydration/SSR mismatch | Static Vite SPA, no `matchMedia`. Pure Tailwind gating eliminates risk entirely | ✅ Eliminated |
| Scrollspy breaks if id changes | Decision 4 keeps `#experience` stable | ✅ Kept stable |
| Vitest setup expands scope | Slice 0 capped: config + setup + scripts + one smoke test. No retrofitting other sections | ✅ Contained |

## Git Hygiene

- `.gitignore` change (`certificados/` addition) confirmed **not** in any of the 4 commits, remains uncommitted in working tree (as intended — separate from SDD scope).
- All commits follow conventional commits, no AI attribution.
- Git history clean: `0d809fd`, `dd408b1`, `1b5340d`, `9a9ace5` (4 commits on feat/career-timeline).

## Rollback Plan

Per-slice revert via `git revert`:
- Slice 3: falls back to Slice 2's accordion-only render (real content, still shippable)
- Slices 1–3: cleanly revert to Lorem Ipsum via any single commit revert
- Slice 0: independently revertible (`pnpm remove` + delete config)

No data migration, no persisted state, no feature flag required.

## Next Steps

The planning cycle is closed. Ready for user to:
1. Review the feature on `feat/career-timeline` branch.
2. Create PR(s) against `main` (chained PRs recommended per proposal.md forecast: 4 slices → 4 PRs).
3. Or cherry-pick individual commits if a different delivery strategy is preferred.

No further SDD phases required.

## Artifact Locations

**Openspec Archive**:
`openspec/changes/archive/2026-08-12-portfolio-career-timeline/`
- explore.md
- proposal.md
- spec.md
- design.md
- tasks.md
- verify-report.md
- content.md
- ARCHIVE-REPORT.md (this file)

**Active Branch**:
`feat/career-timeline` (4 commits, ready for user PRs)

**Engram** (if enabled):
- sdd/portfolio-career-timeline/archive-report (this report persisted)

## Certification

This archive report certifies that:
- ✅ All 7 SDD phases completed successfully
- ✅ All 21 spec scenarios verified
- ✅ All 24 tasks implemented and marked complete
- ✅ All design constraints met
- ✅ 0 CRITICAL / 0 WARNING in verification
- ✅ Build and tests pass
- ✅ Change is ready for team review and PR creation
- ✅ Archive trail is complete and traceably persisted

**Archived By**: sdd-archive executor (automated)
**Date**: 2026-08-12
**Status**: CLOSED
