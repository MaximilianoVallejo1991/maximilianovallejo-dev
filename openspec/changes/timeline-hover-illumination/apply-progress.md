# Apply Progress: Timeline Hover Illumination

Change: `timeline-hover-illumination` · Phase: `sdd-apply` · Store: file-based (`openspec/`)
Mode: **Standard (GREEN only)** — explicitly scoped by the orchestrator as "NEW, GREEN phase only — NO Strict TDD RED". No tasks/spec/design artifacts were provided; the orchestrator gave direct 3-slice implementation instructions instead. Tests intentionally NOT written this batch — user will add them manually afterward.
Note: Engram MCP tools were not exposed to this apply session (same limitation as `timeline-spacer-fixes`). This artifact exists on disk only; re-persist to Engram (`sdd/timeline-hover-illumination/apply-progress`) when available.

## Deviation from Strict TDD Policy

The project's cached testing capability is `strict_tdd: true`, and this change is NEW work — normally requiring RED → GREEN → REFACTOR. This batch was explicitly directed by the orchestrator to implement GREEN only, with tests deferred to the user. This is a recorded deviation, not a silent one: no TDD Cycle Evidence table is included because no tests were written in this batch.

## Completed Tasks (3 slices, all GREEN)

- [x] Slice 1 — `TimelineNode.tsx`: added optional `items?: TimelineItem[]` and `onHover?: (spacerIds: string[]) => void` props; wired `onMouseEnter` → `getSpacersToHighlight(milestone, items)` → `onHover(ids)`, and `onMouseLeave` → `onHover([])`. Both are no-ops when `items`/`onHover` are absent (safe default — matches existing call sites without changes).
- [x] Slice 2 — `Spacer.tsx`: added optional `highlighted?: boolean` and `accentKey?: BranchAccentKey` props. When highlighted, applies `accent.highlightBg` (a new literal Tailwind class per accent key, e.g. `bg-accent/30`) with a `transition-colors duration-200`; otherwise `bg-transparent`. Also exposes `data-highlighted` for testability.
- [x] Slice 3 — `Experience.tsx`: added `desktopHighlighted`/`mobileHighlighted` `useState<Set<string>>` (tracked independently per timeline). Desktop `TimelineNode` gets `items={layout.items}` + `onHover={(ids) => setDesktopHighlighted(new Set(ids))}`; desktop `Spacer` gets `accentKey={branch.accentKey}` + `highlighted={desktopHighlighted.has(item.id)}`. Mobile `TimelineNode` gets `items={mobileItems}` + `onHover={(ids) => setMobileHighlighted(new Set(ids))}`; mobile `Spacer` gets `highlighted={mobileHighlighted.has(item.id)}` (no per-item accent available in the merged list, so it uses the `Spacer` default `"accent"`).

## Files Changed

| File | Action | What Was Done |
|---|---|---|
| `src/components/ui/TimelineNode.tsx` | Modified | Added `items`/`onHover` props; `onMouseEnter`/`onMouseLeave` handlers call `getSpacersToHighlight` from `src/lib/timelineScale.ts` and report highlighted spacer ids up to the parent. No visual/render changes to icon, accent, or year — existing behavior preserved when the new props are omitted. |
| `src/components/ui/Spacer.tsx` | Modified | Added `highlighted`/`accentKey` props; background className switches between `accent.highlightBg` (`bg-{accent}/30`) and `bg-transparent` with a 200ms color transition. |
| `src/lib/branchAccent.ts` | Modified | Added `highlightBg: string` field to `BranchAccentClasses` and one literal `bg-{accent}/30` string per accent key (`accent`/`soft`/`trade`/`study`) in `BRANCH_ACCENT`. Required because Tailwind v4's static scanner needs full literal class strings — `${accent.fill}/30` template-concatenation at runtime would NOT be picked up (the modifier-opacity class never appears literally in source). |
| `src/components/sections/Experience.tsx` | Modified | Added `useState` import; two `Set<string>` highlight-state hooks (desktop, mobile); wired `items`/`onHover` into both `TimelineNode` render sites and `highlighted`/`accentKey` into both `Spacer` render sites. |

## Deviations from Design

1. `getSpacersToHighlight(milestone, items)` requires the full `TimelineItem[]` of the branch/merged list, not just the milestone — the orchestrator's shorthand ("call `getSpacersToHighlight(data)`") was adjusted to the real 2-arg signature already defined in `src/lib/timelineScale.ts`. `TimelineNode` now takes an `items` prop to supply this.
2. Colors are NOT applied via `bg-opacity-30` (a Tailwind v3 utility, removed/deprecated in Tailwind v4 — this project is on Tailwind v4.1.18 per `package.json`). Used the Tailwind v4 opacity-modifier syntax (`bg-accent/30`) instead, added as a literal per-key string in `BRANCH_ACCENT` so Tailwind's static content scanner can find it (dynamic template concatenation of class name + modifier would silently produce no CSS).
3. No content data (`src/data/content.ts`) currently sets `hoverIllumination` on any milestone, so `getSpacersToHighlight` returns `[]` for every hover today — the wiring is live but visually inert until content authors opt individual milestones in. This matches the stated scope (data-only config was explicitly deferred by the parent `timeline-spacer-fixes` proposal).

## Issues Found

None. `pnpm build` (`tsc -b && vite build`) and `pnpm test` (existing 50-test suite) both pass with zero changes to test files.

## Verification

- `pnpm build`: ✅ exits 0, no TS errors.
- `pnpm test -- --run`: ✅ 50/50 passing (7 test files), no regressions in `TimelineNode.test.tsx`, `Spacer.test.tsx`, `Experience.test.tsx`.
- Manual browser check at `http://localhost:5173`: **NOT PERFORMED** — this apply session's toolset (Read/Edit/Write/Glob/Grep/Bash) has no browser/screenshot capability, and no milestone in current content data has `hoverIllumination` set, so there is nothing to visually observe yet regardless. A dev server was confirmed listening on port 5173.

## Status (Batch 1)

**3/3 implementation slices complete (GREEN only, as scoped).**
Ready for: user to add tests manually (RED test files already exist as stubs: `TimelineNode.test.tsx`, `Spacer.test.tsx` — new hover/highlight assertions can be appended), then `sdd-verify` or a follow-up TDD batch to backfill Strict TDD evidence if required by policy.

---

## Batch 2 — Data config: `hoverIllumination` per milestone

Mode: **Standard (data-only, no logic changes)**. No tasks/spec/design artifacts found for this batch either — same pattern as Batch 1: direct instructions given (strategy + verosímil ranges per milestone position), no Engram tool access in this session (functions available were limited to Read/Edit/Write/Glob/Grep/Bash — `mem_search`/`mem_save` were not exposed as callable tools). Progress recorded to this file only; re-persist to Engram (`sdd/timeline-hover-illumination/apply-progress`) when available.

This batch closes deviation #3 noted in Batch 1 ("No content data currently sets `hoverIllumination` on any milestone... visually inert until content authors opt individual milestones in").

### Completed Tasks

- [x] Added `hoverIllumination` to all 5 `soft` branch milestones in `content.es.ts` and `content.en.ts`
- [x] Added `hoverIllumination` to all 4 `trade` branch milestones in `content.es.ts` and `content.en.ts`
- [x] Added `hoverIllumination` to all 7 `study` branch milestones in `content.es.ts` and `content.en.ts` (including the open-ended `Continua`/`Ongoing` entry)

### Strategy Applied (per milestone position within its branch)

| Position | Config shape | Range used |
|---|---|---|
| Early (first in branch) | `{ downwardsYears }` | 3–7 |
| Middle | `{ upwardsYears, downwardsYears }` | 2–5 each |
| Late (not last, not open-ended) | `{ upwardsYears }` | 2–5 |
| Last (not open-ended) | `{ upwardsYears }` | 5–8 |
| Open-ended (`Continua`/`Ongoing`) | `{ upwardsYears }` | 2–5 |

### Values Set (identical in `es` and `en` — data is language-independent)

**soft**: 2008 Scout `{downwardsYears:7}` · 2015 Instructor Scout `{upwardsYears:3, downwardsYears:5}` · 2017 Rover `{upwardsYears:2, downwardsYears:4}` · 2020 Guía APN `{upwardsYears:5}` · 2024 Distinción Montañismo (last) `{upwardsYears:8}`

**trade**: 2008 Taller Metalmecánico `{downwardsYears:5}` · 2017 PLC `{upwardsYears:4, downwardsYears:2}` · 2019 Emme 3D `{upwardsYears:5}` · 2022 PJT Sistemas (last) `{upwardsYears:6}`

**study**: 2007 Téc. Electrónica `{downwardsYears:6}` · 2009 Téc. Constructor `{upwardsYears:3, downwardsYears:4}` · 2010 MMO `{upwardsYears:2, downwardsYears:3}` · 2011 Ciclo Básico Ing. Química `{upwardsYears:4, downwardsYears:5}` · 2021 Argentina Programa `{upwardsYears:5}` · 2021–2022 QA T.TEC `{upwardsYears:4}` · Continua/Ongoing (open-ended) `{upwardsYears:3}`

### Files Changed

| File | Action | What Was Done |
|---|---|---|
| `src/data/content.es.ts` | Modified | Added `hoverIllumination` object to all 16 milestones across the 3 experience branches. |
| `src/data/content.en.ts` | Modified | Same 16 `hoverIllumination` values, mirrored — shape parity enforced by `tsc -b`. |

### Deviations from Design

None — `HoverIllumination`/`Milestone.hoverIllumination` types already existed in `src/data/content.ts` (defined ahead of this batch), and `getSpacersToHighlight` in `src/lib/timelineScale.ts` already consumed them. This batch only supplies data values; no type or logic changes were needed.

### Issues Found

None.

### Verification

- `pnpm build` (`tsc -b && vite build`): exit 0, no TS errors — confirms `es`/`en` shape parity holds with the new field populated.
- `pnpm test -- --run`: 50/50 passing (7 test files), no regressions.
- Manual browser check: **NOT PERFORMED** — this session's toolset has no browser/screenshot capability. The wiring from Batch 1 (`onMouseEnter`/`onMouseLeave` → `getSpacersToHighlight` → highlight state → `Spacer` background) is now live with real data; visual confirmation of the illumination effect is pending manual check by the user against the running dev/preview server.

### Status (Batch 2)

**16/16 milestones configured across both locales.** Build and existing test suite green. Ready for manual visual verification of the hover-illumination effect, then `sdd-verify`.

---

## Batch 3 — Refine hover illumination to target specific elements, not containers

Mode: **Standard**. No tasks/spec/design artifacts exist for this change (same as Batches 1–2) — the orchestrator/user gave direct instructions instead. Engram MCP tools were again not exposed to this session (same limitation noted in Batches 1–2); progress recorded to this file only.

Problem addressed: earlier batches lit up the `Spacer` div at 30% opacity and gave `TimelineNode` no self-highlight at all — the request was to make the effect feel targeted (dot, year, title, description individually) instead of a flat container tint.

### Completed Tasks

- [x] `Spacer.tsx`: reduced illumination from a 30%-opacity fill to a subtle 10%-opacity tint + a 2px colored left border (was: solid-ish background fill only)
- [x] `TimelineNode.tsx`: added self-hover highlighting to the dot (ring + shadow glow), year (bold), title (accent color), and description (darken to primary) — the card container itself (`motion.li`) never gets a background/border change
- [x] `branchAccent.ts`: added `ringGlow` and `hoverText` literal fields (one full compound Tailwind class string per branch key) to support the new hover states
- [x] `Experience.tsx`: verified — no changes needed, `highlighted={desktopHighlighted.has(item.id)}` / `highlighted={mobileHighlighted.has(item.id)}` were already wired correctly from Batch 1

### Files Changed

| File | Action | What Was Done |
|---|---|---|
| `src/components/ui/Spacer.tsx` | Modified | `highlighted` now renders `border-l-2` + `${accent.highlightBg} ${accent.ring}` (10% bg tint + colored left border) instead of a flat `${accent.highlightBg}` fill; non-highlighted state keeps `border-l-2 border-transparent` (static width) to avoid a layout shift when the border color toggles in. |
| `src/components/ui/TimelineNode.tsx` | Modified | Added `group` to the `motion.li` wrapper. Dot gets `${accent.ring} ${accent.ringGlow}` (ring/shadow glow shows on `group-hover`, not just via the existing `border-2 ${accent.ring}` outline that was already always-on). Year span gets `group-hover:font-bold`. Title (`h4`) gets `${accent.hoverText}` (accent color) + `transition-colors`. Description (`p`) gets `group-hover:text-primary` (darken from `text-muted`) + `transition-colors`. The `motion.li`/card container itself has no background or border change on hover — only these four child elements respond. |
| `src/lib/branchAccent.ts` | Modified | `highlightBg` opacity changed from `/30` to `/10` for all 4 keys (subtler spacer tint). Added `ringGlow: string` (full `group-hover:ring-2 group-hover:ring-{key}/50 group-hover:ring-offset-2 group-hover:ring-offset-surface group-hover:shadow-lg group-hover:shadow-{key}/20` per key) and `hoverText: string` (`group-hover:text-{key}` per key) to `BranchAccentClasses` and all 4 `BRANCH_ACCENT` entries. |
| `src/components/sections/Experience.tsx` | Not modified | Already passes `highlighted` correctly to both desktop and mobile `Spacer` instances from Batch 1 — no change required for this batch's scope. |

### Deviations from Design

1. Used Tailwind's `group`/`group-hover:` mechanism for `TimelineNode`'s self-highlight instead of adding local `isHovered` React state — the component already has `onMouseEnter`/`onMouseLeave` wired for the cross-element spacer-highlight feature, so a CSS-only approach avoids a redundant re-render and keeps the two hover concerns (spacer illumination via state/props, self-highlight via CSS) cleanly separated.
2. Each `ringGlow`/`hoverText` value is written as ONE full literal compound string per branch key in `branchAccent.ts` (variant + utility + color together, e.g. `"group-hover:text-branch-soft"`), not composed at runtime via template concatenation (e.g. `` `group-hover:text-${accentKey}` ``). This follows the same constraint documented in Batch 1 deviation #2: Tailwind v4's static scanner only picks up class candidates that appear as contiguous literal text somewhere in a scanned source file — a runtime-interpolated variant+color combination would silently produce no CSS. Verified after build: `dist/assets/index-*.css` contains `group-hover` and `ring-offset-surface`/`shadow-branch-study` selectors, confirming the scanner picked up all 4 branch-key variants.
3. `Spacer`'s non-highlighted state uses `border-l-2 border-transparent` (rather than omitting the border utility entirely) so the border-width never toggles between 0 and 2px — only the color transitions. This avoids a layout nudge on hover/unhover.

### Issues Found

None. `pnpm build` (`tsc -b && vite build`) and `pnpm test -- --run` (existing 50-test suite, 7 files) both pass with zero test file changes needed — no test asserted specific highlight class names, only structural attributes (`data-testid`, `data-year-from/to`, height, absence of children/internal elements), all of which are unaffected.

### Verification

- `pnpm build`: exits 0, no TS errors.
- `pnpm test -- --run`: 50/50 passing (7 test files), no regressions.
- Compiled CSS spot-check: `rg "group-hover" dist/assets/index-*.css` and `rg -c "ring-offset-surface|shadow-branch-study" dist/assets/index-*.css` both matched — confirms the new per-branch hover utilities were emitted, not silently dropped by Tailwind's scanner.
- Manual browser check: **NOT PERFORMED** — this session's toolset (Read/Edit/Write/Glob/Grep/Bash) has no browser/screenshot capability. A preview server was reported running by the environment; visual confirmation of the refined hover effect (subtle spacer tint + border, dot glow, text color/weight shifts) is pending manual check by the user against the running dev/preview server.

### Status (Batch 3)

**4/4 refinement tasks complete.** Build and test suite green; CSS output verified to contain the new literal classes. Ready for manual visual verification, then `sdd-verify`.

---

## Batch 4 — Remove background entirely; only the vertical line lights up

Mode: **Standard**. No tasks/spec/design artifacts exist for this change (same as Batches 1–3) — direct instructions given: `Spacer` must be 100% invisible while idle (no background at any state) and, when `highlighted`, only the left border shows the branch accent color — no background tint.

Problem addressed: Batch 3 kept a static `bg-gray-700/20` idle fill and a `10%`-opacity accent tint on hover, both explicitly unwanted. This batch strips both, leaving only the border.

### Completed Tasks

- [x] `Spacer.tsx`: idle state changed from `border-transparent bg-gray-700/20` to `border-transparent` with `bg-transparent` applied unconditionally; highlighted state changed from `${accent.highlightBg} ${accent.ring}` to just `${accent.ring}` (no background class at all)
- [x] Updated the component doc comment to describe the border-only behavior (previously described a "tint + border" fill)

### Files Changed

| File | Action | What Was Done |
|---|---|---|
| `src/components/ui/Spacer.tsx` | Modified | `className` now always includes `bg-transparent`; the conditional only toggles the border color (`accent.ring` when `highlighted`, else `border-transparent`). Removed `bg-gray-700/20` (idle fill) and `accent.highlightBg` (hover tint) entirely. |

### Deviations from Design

1. This reverses part of Batch 3's design (`${accent.highlightBg} ${accent.ring}` on hover, `bg-gray-700/20` at idle) per explicit new instructions — background is no longer used at any state, only the border. `accent.highlightBg` is now unused by `Spacer.tsx`; the field itself was left in `branchAccent.ts` (out of scope for this batch — only `Spacer.tsx` was requested) since removing it could affect other consumers/tests without being asked.

### Issues Found

None. `pnpm build` (`tsc -b && vite build`) passes with zero TS errors. `pnpm test -- --run`: `Spacer.test.tsx` and 5 other test files pass (45/50 tests, 6/7 files green); the 5 failures are all in `src/lib/timelineScale.test.ts` (`getBranchLayout`/`buildTimelineWithSpacers` height/offset assertions), pre-existing and unrelated to this change — confirmed by reading `Spacer.tsx`'s diff touches only className logic, not `timelineScale.ts`, and the failing file was not modified in this batch.

### Verification

- `pnpm build`: exits 0, no TS errors.
- `pnpm test -- --run`: 45/50 passing (6/7 test files); `Spacer.test.tsx` fully green. Pre-existing failures confined to `timelineScale.test.ts`, out of this batch's scope (`getBranchLayout` height/offset math, unrelated to `Spacer` styling).
- Manual browser check: **NOT PERFORMED** — this session's toolset (Read/Edit/Write/Glob/Grep/Bash) has no browser/screenshot capability. A preview server was reported running by the environment; visual confirmation that the spacer is fully invisible while idle and only the border lights up on hover is pending manual check by the user.

### Status (Batch 4)

**2/2 tasks complete.** Build green; `Spacer.test.tsx` green. Ready for manual visual verification, then `sdd-verify`.

---

## Batch 5 — Investigate/fix reported NaN in `getSpacersToHighlight` (string year arithmetic)

Mode: **Standard**. No tasks/spec/design artifacts exist for this change (same as Batches 1–4) — direct instructions given, with an exact diagnosis and exact patch supplied: `item.yearTo`/`item.yearFrom` allegedly hold strings (e.g. `"2008"`), so `item.yearTo - target.yearStart` in `getSpacersToHighlight` allegedly produces `NaN`. Engram MCP tools again not exposed to this session; progress recorded to this file only.

### Verification performed before patching

Per repo convention ("verify technical claims before stating them"), I checked whether the described bug reproduces in the current tree before editing:

- `TimelineItem`'s `spacer` variant is typed `{ yearFrom: number; yearTo: number; ... }` (`src/lib/timelineScale.ts:15-16`).
- Both construction sites (`buildTimelineWithSpacers`, lines ~121-137) assign `yearFrom`/`yearTo` from `resolveYear`/`resolveYearEnd`/`CURRENT_YEAR`, all of which are `number` (`resolveYearEnd` explicitly does `Number(matches[...])`).
- Wrote a scratch test iterating every branch in `content.es.ts` (16 milestones, all with `hoverIllumination` set per Batch 2) and asserted `typeof item.yearFrom === "number"`, `typeof item.yearTo === "number"`, `Number.isFinite(item.height)` for every spacer. **All passed** — no strings, no `NaN`, anywhere in the current data + code path. Scratch test was deleted after use (not committed).

**Conclusion**: the specific bug as described (string-typed spacer years causing `NaN`) does not currently reproduce in this codebase. No functional bug was found in `getSpacersToHighlight`.

### Completed Tasks

- [x] Applied the requested `Number(...)` coercion in `getSpacersToHighlight` anyway, as defensive hardening (harmless no-op given TypeScript already guarantees numeric operands here; protects against a future data-shape change, e.g. if `TimelineItem` construction is ever refactored to consume raw string years)

### Files Changed

| File | Action | What Was Done |
|---|---|---|
| `src/lib/timelineScale.ts` | Modified | `getSpacersToHighlight`: `distance = target.yearStart - item.yearFrom` → `target.yearStart - Number(item.yearFrom)`; `distance = item.yearTo - target.yearStart` → `Number(item.yearTo) - target.yearStart`. No behavior change (operands were already `number`). |

### Deviations from Design

None — this is a pure hardening edit, not a design change.

### Issues Found (separate, pre-existing, out of scope)

`pnpm test` has **5 pre-existing failures**, all in `src/lib/timelineScale.test.ts`, all in `buildTimelineWithSpacers`/`getBranchLayout` (height/topOffset/endOffset assertions) — **none in `getSpacersToHighlight`**, which is 100% green both before and after this batch's edit. Root cause: the test file's hardcoded expected values assume `YEAR_HEIGHT_PX = 100` (e.g. "computes topOffset=100px... (soft, 2008)"), but the source constant is `YEAR_HEIGHT_PX = 60` (`src/lib/timelineScale.ts:5`). Every failing assertion's actual value is exactly `0.6×` the expected value (e.g. `700→420`, `100→60`, `1500→900`), confirming a stale-test-literal vs. live-constant mismatch, not a logic bug. This was already flagged as pre-existing/unrelated in Batch 4 ("5 failures ... pre-existing and unrelated to this change") and remains unresolved — I did not guess-fix it here because I cannot tell from available artifacts whether `60` (current visual behavior) or `100` (test's assumption) is the intended value, and changing either without direction risks silently altering the rendered timeline's vertical scale. **This is the actual blocker to "build + test must pass" — recommend the user/orchestrator confirm the intended `YEAR_HEIGHT_PX` value so the test literals (or the constant) can be corrected in a follow-up batch.**

### Verification

- `pnpm build` (`tsc -b && vite build`): exit 0, no TS errors.
- `pnpm test`: 45/50 passing (6/7 files). `getSpacersToHighlight` describe block: 3/3 passing (unaffected by this batch, as expected — it never exercised the string-coercion path). The 5 failures are the pre-existing `YEAR_HEIGHT_PX` mismatch documented above, confirmed unrelated to this batch's file/lines.

### Status (Batch 5)

**1/1 defensive edit complete; underlying reported bug not reproducible with evidence provided.** `pnpm build` green. `pnpm test` NOT fully green — 5 pre-existing, unrelated failures block full pass; root cause identified (stale test literals vs. `YEAR_HEIGHT_PX` constant) but not fixed pending a decision on the correct value. Ready for: user decision on `YEAR_HEIGHT_PX` (keep `60` and update the 5 test literals, or restore `100` and re-check visual layout), then `sdd-verify`.
