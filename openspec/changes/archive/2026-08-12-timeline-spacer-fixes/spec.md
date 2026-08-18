# Delta Spec: Timeline Spacer Fixes

Change: `timeline-spacer-fixes` (refinement) · Phase: `sdd-spec` · Store: file-based (`.atl/changes`)
Base: `.atl/changes/timeline-temporal-scale/spec.md`, capability `timeline-temporal-scale`.

## Capability: `career-trajectory` (MODIFIED behavior on `Experience.tsx`, `timelineScale.ts`)

## MODIFIED Requirements

### Requirement: Continuous connector rail

Each branch `<ol>` MUST render exactly one continuous `absolute` connector line spanning its full height, owned by the list, not per-spacer. The desktop `<ol>` MUST size itself with `minHeight` — not fixed `height` — equal to the temporal floor `(lastYear − firstYear) × YEAR_HEIGHT_PX`, so real flow height (spacer heights plus node text) wins whenever it exceeds that floor, and the rail MUST span the full rendered flow height with no early truncation.
(Previously: `<ol>` used a fixed `height` equal to the temporal floor, which is always ≤ real flow content and clipped the rail before the last spacer/node)

| Scenario | Given | When | Then |
|---|---|---|---|
| Single rail | branch `<ol>` with N milestones | rendered | exactly 1 absolute connector element for the whole list |
| No gaps at zero-height spacer | milestones `2021` → `2021–2022` (0px spacer) | rendered | connector rail shows no visual break beside the cards |
| Rail spans flow height | branch column where flow height (spacers + node text) exceeds the temporal floor | rendered | `<ol>` renders at flow height via `minHeight`; connector rail reaches the last spacer/node with no truncation |

### Requirement: Year resolution edge cases

Year strings MUST resolve via `resolveYear`: ranges (`"2021–2022"`) resolve to the start year; the infinity token (`"Continua"`/`"Ongoing"`) resolves to `CURRENT_YEAR` (2026, clamped, not literal `Infinity`). When the LAST milestone in a branch resolves to `CURRENT_YEAR` via this clamp, `buildTimelineWithSpacers` MUST anchor that milestone's own vertical position at the PREVIOUS milestone's end year, not at `CURRENT_YEAR`.
(Previously: the open-ended milestone was positioned directly at the clamped current year, so its node sat at the scale's bottom instead of at its true start year)

| Scenario | Given | When | Then |
|---|---|---|---|
| Range parsing | `year="2021–2022"` | `resolveYear` called | returns `2021` |
| Same-year pair | milestones `2021` → `2021–2022` | spacer built | height = `0px`, still rendered |
| Open-ended anchoring | last milestone `"Continua"`, previous milestone ends `2022` | `buildTimelineWithSpacers` runs | `"Continua"` node anchors at `2022`, not `2026` |

## ADDED Requirements

### Requirement: Trailing spacer for open-ended final milestone

`buildTimelineWithSpacers` MUST emit a trailing `Spacer` after the last milestone of a branch when that milestone's `resolveYear` result equals `CURRENT_YEAR` (open-ended/"Continua" token), with `data-year-from` equal to the milestone's anchored year and `data-year-to="{CURRENT_YEAR}"`, height `(CURRENT_YEAR − anchorYear) × YEAR_HEIGHT_PX`. Branches whose last milestone resolves to a finite, non-clamped year MUST NOT receive a trailing spacer.

| Scenario | Given | When | Then |
|---|---|---|---|
| Trailing spacer emitted | last milestone `"Continua"` anchored at `2022`, `CURRENT_YEAR=2026` | `buildTimelineWithSpacers` runs | trailing spacer appended: `data-year-from="2022"` `data-year-to="2026"`, height `400px` |
| No spacer for closed branch | last milestone resolves to a concrete year (e.g. `2020`) | `buildTimelineWithSpacers` runs | no trailing spacer emitted; branch ends at the last node |

### Requirement: No regression in unrelated features (Previously: scrollspy, reduced motion, nav labels, mobile breakpoint — carried forward from `timeline-temporal-scale`)

Existing scrollspy, reduced-motion, and nav-label behavior MUST remain unchanged. The mobile `<ol>` (merged single list, `<md` breakpoint) MUST retain no `height`/`minHeight` inline style — this change touches desktop layout and `buildTimelineWithSpacers` topology only. `pnpm test` and `pnpm build` MUST both exit 0 after the change.

| Scenario | Given | When | Then |
|---|---|---|---|
| Scrollspy stable | user scrolls to `#experience` | `IntersectionObserver` fires | nav link still highlights, both locales |
| Mobile untouched | viewport `<md` | rendered | merged single-list `<ol>` has no `height`/`minHeight` inline style |
| Verification gate | full change applied | `pnpm test && pnpm build` run | both exit `0` |

## Out of Scope (unchanged from base)

Hover illumination wiring, `Spacer.tsx` visual styling, mobile layout structure, absolute node positioning redesign, `ConvergenceGraphic` DOM-measurement migration.
