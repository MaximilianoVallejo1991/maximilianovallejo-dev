# Tasks: Timeline Spacer Fixes

Source: `openspec/changes/timeline-spacer-fixes/proposal.md` (no separate spec.md/design.md exist for this refinement; proposal's Approach/Affected Areas/Success Criteria serve as the requirement source).

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~70-110 (timelineScale.ts ~20, timelineScale.test.ts ~50-70, Experience.tsx 1) |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR: Slice 1+2 combined (~90-110L). Slice 3 is verification only, no diff. |
| Delivery strategy | ask-on-risk (default, unspecified by orchestrator) |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Trailing-spacer + anchoring fix in `timelineScale.ts` (+tests) | PR 1 | TDD-first; self-contained pure-function change |
| 2 | `height` → `minHeight` in `Experience.tsx` | PR 1 (same, one-line) | Trivial; bundle with Unit 1 unless reviewer wants it isolated |
| 3 | Build/test verification | N/A | No diff; gate before merge |

## Phase 1: Temporal Scale Logic (`src/lib/timelineScale.ts`, `timelineScale.test.ts`)

- [x] 1.1 [RED] Add test: open-ended last milestone (`study` → "Continua") anchors `yearStart` at the previous item's end year (2022), not `CURRENT_YEAR`.
- [x] 1.2 [RED] Add test: a trailing spacer is emitted after the anchored open-ended milestone, `yearFrom=2022`, `yearTo=CURRENT_YEAR(2026)`, `height=400`.
- [x] 1.3 [RED] Update existing test (currently asserts the pre-"Continua" spacer is 400px): with anchoring, that inline spacer becomes `0px` (both sides resolve to 2022).
- [x] 1.4 [RED] Add test: `getBranchLayout` for `study` — `endOffset` stays `1900` (derived from the trailing spacer's `yearTo`, not the re-anchored milestone's `yearStart`).
- [x] 1.5 [GREEN] `buildTimelineWithSpacers`: detect an open-ended last milestone via `!Number.isFinite(parseYearStart(milestone.year))`; set its `yearStart` to the previous item's resolved end year; push a trailing spacer item to `CURRENT_YEAR`.
- [x] 1.6 [GREEN] `getBranchLayout`: derive `endOffset` from the last `TimelineItem` (spacer `yearTo` when the last item is a spacer, else milestone `yearStart`) instead of `resolveYear(branch.milestones[last].year)`.
- [x] 1.7 [REFACTOR] Reconcile remaining `study`-branch assertions (spacer count/heights array) with the new item sequence; run `pnpm test -- timelineScale` to confirm green.

## Phase 2: Desktop Column Sizing (`src/components/sections/Experience.tsx`)

- [x] 2.1 Line 71: change `style={{ height: layout.height }}` to `style={{ minHeight: layout.height }}` on the desktop `<ol>`.
- [~] 2.2 Dev-server check: connector rail (`inset-y-0`, line 68) spans the full column including the trailing spacer; no truncation before "Guía APN → Distinción" / "QA T.TEC → Continua" gaps. **BLOCKED by tooling** — no browser/screenshot capability in this apply session (Read/Edit/Write/Glob/Grep/Bash only). Dev server confirmed reachable (`curl` → 200) but that only returns the pre-render SPA shell.

## Phase 3: Verification

- [x] 3.1 Run `pnpm test` — all `timelineScale.test.ts` cases pass; no regression in `TimelineNode.test.tsx` / `Spacer.test.tsx`. (50/50 passing)
- [x] 3.2 Run `pnpm build` — `tsc -b` exits 0.
- [~] 3.3 Visual check: "Continua" node anchors near 2022 with a 400px gap below it to the convergence graphic; mobile `<ol>` unaffected (no `height`/`minHeight` style, byte-identical render). **BLOCKED by tooling**, same as 2.2 — mobile markup confirmed unchanged by inspection (no edits to the mobile `<ol>` block), but real-browser visual confirmation not performed.

## Requirement Links (proposal Success Criteria)

- 1.1-1.7 → "Connector rail spans full column"; "Open-ended milestone anchors at 2022 with a 400px trailing spacer to 2026"
- 2.1-2.2 → "Desktop column no longer overlaps convergence graphic"; "Guía APN → Distinción / QA T.TEC → Continua gaps visible"
- 3.1-3.3 → "Mobile render byte-identical"; "`pnpm test` and `pnpm build` pass"
