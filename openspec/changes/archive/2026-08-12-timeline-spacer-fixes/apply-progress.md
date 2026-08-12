# Apply Progress: Timeline Spacer Fixes

Change: `timeline-spacer-fixes` (refinement on `timeline-temporal-scale`) · Phase: `sdd-apply` · Store: file-based (`.atl/changes`)
Mode: **Strict TDD** (test runner: `pnpm test` / vitest)
Note: Engram MCP tools were not exposed to this apply session (same limitation noted in the parent change's apply-progress). This artifact exists on disk only; re-persist to Engram (`sdd/timeline-spacer-fixes/apply-progress`) when available.

## Batch Summary

Single continuous apply batch covering all 3 phases (12 tasks). Review Workload Forecast in `tasks.md` recorded `Decision needed before apply: No`, `Chained PRs recommended: No`, `400-line budget risk: Low` — no delivery-strategy decision was required before starting.

## Completed Tasks

### Phase 1 — Temporal Scale Logic (TDD)
- [x] 1.1–1.4 [RED]: added/updated tests in `timelineScale.test.ts` for open-ended anchoring, trailing spacer, collapsed inline spacer, and `getBranchLayout.endOffset` derivation. Confirmed RED (6 failing assertions) before implementing.
- [x] 1.5–1.6 [GREEN]: implemented anchoring + trailing spacer in `buildTimelineWithSpacers`, and last-`TimelineItem`-derived `endOffset` in `getBranchLayout`.
- [x] 1.7 [REFACTOR]: reconciled spacer-count assertions (study: 6→7, merged/mobile: 15→16), added doc comments explaining the anchor/trailing-spacer mechanism; `pnpm test -- timelineScale` green (50/50).

### Phase 2 — Desktop Column Sizing
- [x] 2.1: `Experience.tsx` desktop `<ol>` — `style={{ height: layout.height }}` → `style={{ minHeight: layout.height }}`.
- [~] 2.2: Dev-server visual check — **BLOCKED by tooling**, see Manual QA section.

### Phase 3 — Verification
- [x] 3.1: `pnpm test` — 50/50 passing, no regressions in `TimelineNode.test.tsx` / `Spacer.test.tsx` / `Experience.test.tsx` / `ConvergenceGraphic.test.tsx` / `mergeMilestonesByYear.test.ts`.
- [x] 3.2: `pnpm build` (`tsc -b && vite build`) — exits 0.
- [~] 3.3: Visual confirmation — **BLOCKED by tooling**, see Manual QA section. Mobile `<ol>` markup was NOT touched by this batch (only the desktop `<ol>`'s inline style changed), so byte-identical mobile render is true by construction/inspection, not by a rendered-screenshot check.

## Files Changed

| File | Action | What Was Done |
|---|---|---|
| `src/lib/timelineScale.ts` | Modified | `buildTimelineWithSpacers`: detects an open-ended last milestone (`!Number.isFinite(parseYearStart(...))`), anchors its `yearStart` at the previous item's resolved end year instead of `CURRENT_YEAR`, collapses the inline spacer immediately before it to 0px, and appends a trailing spacer (anchorYear → `CURRENT_YEAR`) after it. `getBranchLayout`: `endOffset` now derives from the last `TimelineItem` (spacer `yearTo` or milestone `yearStart`) instead of re-resolving `branch.milestones[last].year` directly. |
| `src/lib/timelineScale.test.ts` | Modified | Updated `study`-branch spacer-count assertion (6→7) and the generic merged/mobile spacer-count assertion (15→16); added 5 new tests: open-ended anchoring, collapsed inline spacer, trailing spacer contract, no-trailing-spacer for closed branches, and merged-list trailing-spacer parity; updated `getBranchLayout` test comment to reflect the new derivation source (value unchanged: 1900). |
| `src/components/sections/Experience.tsx` | Modified | Desktop `<ol>`: `height` → `minHeight` inline style, so the list expands to real flow content (spacer heights + node text) when it exceeds the temporal-floor height, instead of clipping the connector rail early. Mobile `<ol>` untouched. |

## TDD Cycle Evidence

| Task | Test File | Layer | Safety Net | RED | GREEN | TRIANGULATE | REFACTOR |
|---|---|---|---|---|---|---|---|
| 1.1–1.4 (anchoring + trailing spacer + endOffset derivation) | `timelineScale.test.ts` | Unit | ✅ 44 pre-existing tests (baseline, all green before this batch) | ✅ Written — 6 assertions failed against old code (`expected 2021 to be 2022`, `expected 'milestone' to be 'spacer'`, spacer-count mismatches 15/16 and 6/7) | ✅ Passed — 50/50 after implementing `buildTimelineWithSpacers` + `getBranchLayout` changes | ✅ 3 branches (study: open-ended; trade: closed, no trailing spacer expected; merged/mobile: cross-branch generic reuse) | ✅ Doc comments added explaining the anchor/trailing-spacer mechanism; no logic duplication introduced |
| 2.1 (`height` → `minHeight`) | N/A — CSS/layout-only, no new unit assertion (no test framework asserts inline `style` values in this codebase's existing suite) | Component (manual/visual) | ✅ Full 50-test suite re-run after the change (no regression) | N/A (standard mode: one-line CSS property change, not RED/GREEN-cycled) | ✅ `pnpm build` + `pnpm test` both green after the change | ➖ Not applicable (single-property change) | ➖ None needed |

## Test Summary

- **Total tests added/modified this batch**: 5 new tests + 3 updated assertions (study spacer count, merged spacer count, `getBranchLayout` comment) in `timelineScale.test.ts`
- **Total tests passing (full suite)**: 50/50
- **Layers used**: Unit (all `timelineScale.test.ts` assertions)

## Deviations from Design

1. **Test file structure**: the tasks artifact's task numbering (1.1 RED "add test for anchoring", 1.2 RED "add test for trailing spacer", etc.) implied 4 sequential single-purpose RED tests; the actual implementation needed a 5th test (`does NOT emit a trailing spacer for a branch whose last milestone resolves to a concrete, non-clamped year`) to properly triangulate the `isLastOpenEnded` branch condition against a negative case (the `trade` branch), plus a 6th (merged/mobile parity). None of these are contradictions of the spec — they're the minimum triangulation needed to safely implement the conditional logic per TDD discipline.
2. **`resolveYearEnd` reused as-is** (pre-existing private helper from `timeline-temporal-scale`) for computing both the anchor year and the outgoing edge of the open-ended milestone — no new "end year" helper was needed; the existing one already extracts the last 4-digit run in a year string, which is exactly the previous item's end year.

## Issues Found

None. Both phases implemented cleanly against the existing `timelineScale.ts`/`Experience.tsx` structure from the parent `timeline-temporal-scale` change; no architectural conflicts.

## Manual QA — NOT PERFORMED (tooling gap, not a skipped step)

Tasks 2.2 and 3.3 require visual confirmation in a real browser. This apply session's toolset (Read/Edit/Write/Glob/Grep/Bash) has no browser, screenshot, or Playwright/Puppeteer capability. What was done instead:

- Confirmed the dev/preview server is reachable: `curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/` → `200`.
- Confirmed via source inspection that the mobile `<ol>` block (lines ~121-163 of `Experience.tsx`) was not touched by this batch — only the desktop `<ol>`'s inline style (line 71) changed — so "mobile unaffected" holds by construction, not by a rendered check.
- All numeric claims (anchor year 2022, trailing spacer 400px, `endOffset` 1900 unchanged) are covered by the unit tests above, which exercise the exact same pure functions `Experience.tsx` calls (`getBranchLayout`, `buildTimelineWithSpacers`) — so the DATA driving the render is verified; only the PAINT (actual pixel layout, connector-rail visual continuity, no overlap with `ConvergenceGraphic`) is unverified.

**What remains genuinely unverified and requires a human or a browser-capable tool** (open `http://localhost:5173`, `md`/`lg` breakpoints, `#experience` section):
1. The connector rail visually spans the full desktop column height with no truncation, now that `minHeight` lets the `<ol>` expand past the temporal-floor height when real content (card text) is taller.
2. The "Guía APN → Distinción" (soft branch) and "QA T.TEC → Continua" (study branch) gaps are visible as expected (this second one is now a TRAILING gap after the "Continua" node, not an inline gap before it — a genuine positional change from the parent change's behavior).
3. No new overlap between the desktop grid and `ConvergenceGraphic` given the (potentially taller) `<ol>` boxes.
4. Mobile render is pixel-identical to before (expected, since no mobile markup changed, but unconfirmed visually).

**Recommendation**: same as the parent change — this needs either (a) a human to look at `http://localhost:5173` for ~2 minutes, or (b) re-delegating this step to an agent/session with browser tooling (e.g., a Playwright MCP or a Task agent with screenshot capability).

## Status

**10/12 tasks structurally complete; tasks 2.2 and 3.3 (visual QA) blocked by tooling, not by choice.**
`pnpm test`: ✅ 50/50 passing.
`pnpm build` (`tsc -b` + `vite build`): ✅ passing.

Ready for: a human or browser-tooled agent to complete visual QA (items 1-4 above), then `sdd-verify` re-check.
