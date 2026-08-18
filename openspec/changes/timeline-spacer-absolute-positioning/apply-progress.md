# Apply Progress: Spacer Line Alignment (position: relative → absolute)

Change: `timeline-spacer-absolute-positioning` · Phase: `sdd-apply` · Store: file-based (`openspec/`)
Mode: **Standard**. No tasks/spec/design artifacts exist for this fix — the orchestrator gave direct
implementation instructions (problem description + target diff shape) instead, same pattern as the
`timeline-hover-illumination` batches. Engram MCP tools were not exposed as callable functions in this
apply session (toolset: Read/Edit/Write/Glob/Grep/Bash only); progress recorded to this file only.
Re-persist to Engram (`sdd/timeline-spacer-absolute-positioning/apply-progress`) when available.

## Problem

Spacer `<li>` elements flowed after the preceding `TimelineNode`'s `<li>` in normal document flow, so
the spacer's `border-left` (the connector line) started below the previous node's rendered text height
instead of at its calculated year position on the shared temporal scale.

## Completed Tasks

- [x] `Spacer.tsx`: changed the root `div` from `position: relative` to `position: absolute`; added
  optional `top?: number` prop (pixels from the parent `<ol>`'s top, which must stay `position: relative`
  for this to anchor correctly); added `left: 0` inline style so the border-left stays pinned to the
  column's left edge regardless of the `<li>` wrapper's own (now zero-height, out-of-flow) box.
- [x] `Experience.tsx` — desktop render (`layout.items.map`): wrapped the existing `.map` in an IIFE
  tracking a `cumulativeHeight` accumulator; each item receives `top={itemTop}` (the accumulator's value
  before this item), then the accumulator advances by `item.height` (spacer) or
  `ESTIMATED_MILESTONE_HEIGHT_PX` (milestone).
- [x] `Experience.tsx` — mobile render (`mobileItems.map`): added the same `cumulativeHeight` tracking
  alongside the pre-existing `milestoneCursor` tracking in the same IIFE; `Spacer` receives `top={itemTop}`.
- [x] Added `ESTIMATED_MILESTONE_HEIGHT_PX = 120` module-level constant in `Experience.tsx` — a
  conservative, not-pixel-perfect estimate of a rendered `TimelineNode`'s height (dot + year + title +
  description, no photo), used only to advance the cumulative offset past milestone items since
  `TimelineNode` itself stays in normal flow (unaffected by this fix) and its real DOM height isn't
  measured.

## Files Changed

| File | Action | What Was Done |
|---|---|---|
| `src/components/ui/Spacer.tsx` | Modified | `position: relative` → `absolute`; added `top?: number` prop; added `left: 0` to the inline style; className changed from `relative ml-[11px] border-l-2 bg-transparent ...` to `absolute ml-[11px] border-l-2 bg-transparent ...`; updated doc comment to explain why absolute positioning is required and what `top` is for. |
| `src/components/sections/Experience.tsx` | Modified | Added `ESTIMATED_MILESTONE_HEIGHT_PX` constant. Desktop `layout.items.map` and mobile `mobileItems.map` both now compute and pass a `top` offset to every `Spacer`, tracked via a `cumulativeHeight` accumulator local to each IIFE. `TimelineNode` call sites unchanged (no `top` prop — it stays in normal flow). |

## Why `TimelineNode` was left untouched

The fix only targets `Spacer`, which is the element whose border-left renders the connector line. Making
`TimelineNode` absolute too would remove it from flow entirely and require estimating (not measuring) its
own vertical position for every render, compounding the estimation error already accepted for
`ESTIMATED_MILESTONE_HEIGHT_PX`. Keeping `TimelineNode` in flow means the milestone content still lays
out with real (not estimated) height — only the spacer's line needs an explicit `top`, since the line has
no content of its own to size the `<li>` around.

## Known Limitation (accepted, matches instructions)

`ESTIMATED_MILESTONE_HEIGHT_PX = 120` is a fixed estimate, not a measured DOM height. If a milestone's
actual rendered height differs significantly from 120px (e.g. very long description text, or a
`photoUrl` thumbnail — `TimelineNode` renders a 64×64px image when present, which this estimate does not
account for), the following spacer's `top` will be off by the delta, and cumulative drift can compound
across multiple mismatched items in the same branch. This is the same trade-off named in the task
instructions ("This doesn't need to be pixel-perfect — it just needs to start the spacer line at the
right visual position") — a `ResizeObserver`/measured-height approach would be exact but was explicitly
out of scope. No milestone in current content data sets `photoUrl`, so this limitation is currently
inert.

## Issues Found

None. `pnpm test -- --run` and `pnpm build` both green with zero test file changes needed — no existing
test asserts `position`, `top`, or `left` inline styles on `Spacer` (only `height`, `data-year-from`,
`data-year-to`, and child-count are asserted in `Spacer.test.tsx`), so none needed updating for this
fix to compile/pass.

## Verification

- `pnpm test -- --run`: ✅ 50/50 passing (7 test files), no regressions.
- `pnpm build` (`tsc -b && vite build`): ✅ exits 0, no TS errors.
- `git diff --stat`: 2 files changed, 64 insertions(+), 24 deletions(-) — well within the 400-line review
  budget; no chained-PR decision required.
- Manual browser check at the running preview server: **NOT PERFORMED** — this apply session's toolset
  (Read/Edit/Write/Glob/Grep/Bash) has no browser/screenshot capability, so the actual visual alignment
  of the connector line against each node's calculated year position was not confirmed by eye. The fix's
  logic (absolute positioning + explicit `top` offset replacing flow positioning) directly addresses the
  documented mechanism of the bug, and is covered by the same TDD-verified pure-function data
  (`layout.items`, `item.height`) the component already renders from, but pixel-level visual confirmation
  is still recommended.

## Status

**4/4 implementation tasks complete.** `pnpm test` and `pnpm build` both green. Ready for: a human or
browser-tooled agent to visually confirm connector-line alignment at `http://localhost:5173` (`#experience`
section, both `md`+ desktop 3-column and mobile merged views), then `sdd-verify`.
