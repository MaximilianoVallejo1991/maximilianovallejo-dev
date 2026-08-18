# Proposal: Timeline Spacer Fixes

## Intent

Desktop timeline spacers read as broken: lower gaps lose their connector rail and the column bottom collides with the convergence graphic. Two independent defects, both verified in code:

1. **Undersized column box.** `getBranchLayout` returns `height = (lastYear - firstYear) * YEAR_HEIGHT_PX` — pure temporal span, ignoring milestone text height. `Experience.tsx:71` applies it as a fixed `height` on the desktop `<ol>`. Real content (spacers **plus** node text) always exceeds it, so the box under-reports its size. The connector rail (`inset-y-0` on the `<ol>`'s wrapper, `Experience.tsx:67`) inherits that wrong height and stops early. Since `Spacer` renders an empty div with no visual of its own, a spacer without rail is indistinguishable from void.
2. **No trailing spacer.** `buildTimelineWithSpacers` returns early on the last milestone (`if (!next) return`), so an open-ended milestone ("Continua"/"Ongoing") gets no spacer to the present. Today `resolveYear("Continua")` clamps to `CURRENT_YEAR`, parking the node at the scale's bottom with the 400px gap *above* it, instead of anchoring it at its real start (2022) with the gap running *below* to "actualidad".

## Scope

### In Scope
- `getBranchLayout`: emit `height` as a temporal **floor**, and derive `endOffset` from the last *item* (trailing spacer included), not the last milestone.
- `buildTimelineWithSpacers`: anchor an open-ended final milestone at the previous milestone's end year and emit a trailing spacer to `CURRENT_YEAR`.
- `Experience.tsx`: replace fixed `height` with `minHeight` on the desktop `<ol>` so flow height wins and the rail spans real content.
- `timelineScale.test.ts`: cover trailing-spacer emission, open-ended anchoring, and `endOffset` from last item.

### Out of Scope
- Hover illumination wiring (`getSpacersToHighlight` stays data-only).
- Mobile layout — its `<ol>` has no fixed height and must stay untouched.
- `Spacer.tsx` visual styling.
- Redesigning the layout model (absolute node positioning).

## Capabilities

### New Capabilities
None.

### Modified Capabilities
- `career-trajectory`: desktop branch column sizing and open-ended milestone representation on the shared temporal scale.

## Approach

**`height` → `minHeight` is the whole fix for defect 1.** Flow height is already ≥ the temporal span once node text is counted, so the min binds only on sparse branches — exactly the correct semantic for `layout.height`, and it needs **no estimated-node-height constant**.

Rejected: adding `ESTIMATED_NODE_HEIGHT` (~110px) to `height`. It is a magic number that silently desyncs across i18n text length (ES/EN differ), font loading, and column width, while `minHeight` alone already resolves the overlap.

Consequence to accept: `endOffset` predicts geometry that flow layout does not honor, so `ConvergenceGraphic` anchors drift from true column bottoms. DOM measurement (`ResizeObserver`) is the correct long-term fix — deferred.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/lib/timelineScale.ts` | Modified | Trailing spacer, open-ended anchoring, `endOffset` from last item |
| `src/lib/timelineScale.test.ts` | Modified | New unit coverage (TDD-first) |
| `src/components/sections/Experience.tsx` | Modified | Line 71: `height` → `minHeight` |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Open-ended anchoring shifts sort order in `mergeMilestonesByYear` (mobile) | Med | Keep `resolveYear` clamping unchanged; anchor only inside `buildTimelineWithSpacers` |
| Convergence lines drift from real column bottoms | High | Known and accepted; log as follow-up |
| Cross-branch alignment degrades below the first node | Med | Inherent to flow layout; already accepted in design.md tolerance |
| Mobile regression | Low | Assert mobile `<ol>` has no height style |

## Rollback Plan

Single-commit revert. Three files, no data/schema/config changes. Reverting restores the previous (broken but stable) render.

## Dependencies

- Refinement on the archived `portfolio-career-timeline` change; no external prerequisites.

## Success Criteria

- [ ] Connector rail spans the full desktop column, including the last spacer
- [ ] "Guía APN → Distinción" and "QA T.TEC → Continua" 400px gaps are visible
- [ ] Open-ended milestone anchors at 2022 with a 400px trailing spacer to 2026
- [ ] Desktop column no longer overlaps the convergence graphic or its label
- [ ] Mobile render byte-identical
- [ ] `pnpm test` and `pnpm build` pass
