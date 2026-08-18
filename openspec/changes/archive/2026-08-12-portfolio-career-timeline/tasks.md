# Tasks: Career Trajectory Section

Change: `portfolio-career-timeline` · Phase: `sdd-tasks` · Store: hybrid
Reads: spec.md (authoritative), design.md (authoritative), content.md (locked copy)

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated changed lines | ~890 (60 + 460 + 120 + 250) |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 (Slice 0, ~60) → PR 2 (Slice 1, ~460 — still over budget alone but content is repetitive/verbatim-copy, low review complexity) → PR 3 (Slice 2, ~120) → PR 4 (Slice 3, ~250) |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending — user decision required |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High

### Per-task line estimate (running total)

| Task | Est. lines | Running total |
|---|---|---|
| 0.1–0.5 (harness) | 60 | 60 |
| 1.1 (types) | 35 | 95 |
| 1.2 (content.es.ts) | 190 | 285 |
| 1.3 (content.en.ts) | 190 | 475 |
| 1.4 (nav label) | 1 | 476 |
| 1.5 (Experience.tsx minimal retype) | 40 | 516 |
| 2.1 (CSS tokens) | 10 | 526 |
| 2.2 (branchAccent.ts) | 25 | 551 |
| 2.3 (IconMap icons) | 30 | 581 |
| 2.4 (TimelineNode.test.tsx RED) | 30 | 611 |
| 2.5 (TimelineNode.tsx GREEN) | 25 | 636 |
| 3.1 (mergeMilestonesByYear.test.ts RED) | 60 | 696 |
| 3.2 (mergeMilestonesByYear.ts GREEN) | 40 | 736 |
| 3.3 (ConvergenceGraphic.tsx) | 60 | 796 |
| 3.4 (Experience.tsx full rebuild) | 90 | 886 |

Total ≈ 886 lines, confirming design.md's ~890 estimate. Every individual slice except Slice 0 exceeds or nearly exceeds the 400-line single-PR budget when Slice 1's content payload is counted (though most of Slice 1 is repetitive data-entry, not logic, so review complexity is lower than raw line count implies). Recommend chained PRs per the 4 slice boundaries already identified in design.md.

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|---|---|---|---|
| 1 | Vitest harness green, no app changes | PR 1 | Base: main. Standalone — safe to merge alone. |
| 2 | New data shape + real bilingual content + minimal `Experience.tsx` retype to keep build green | PR 2 | Base: PR 1 (or main once merged). Keep Experience.tsx diff minimal per design.md warning — no layout changes. |
| 3 | Accent tokens + icon/accentKey props on `TimelineNode` + icon set | PR 3 | Base: PR 2. Adds capability without wiring into `Experience.tsx` yet — old accordion still renders unchanged look via default `accentKey="accent"`. |
| 4 | Convergence graphic + merge/sort helper + full `Experience.tsx` rebuild (dual render paths) | PR 4 | Base: PR 3. User-visible feature completion. |

---

## Phase 0 — Slice 0: Vitest Harness (PR 1, ~60 lines)

- [x] 0.1 Add `pnpm add -D vitest jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom` (all 5 explicit — `@testing-library/dom` is a peer dep pnpm won't hoist implicitly).
- [x] 0.2 Edit `vite.config.ts`: add `/// <reference types="vitest/config" />` and a `test` block (`environment: "jsdom"`, `globals: false`, `setupFiles: ["./src/test/setup.ts"]`, `css: false`) per design.md.
- [x] 0.3 Create `src/test/setup.ts`: import `@testing-library/jest-dom/vitest`, `afterEach(() => cleanup())` from `@testing-library/react`.
- [x] 0.4 Edit `package.json`: add `"test": "node scripts/check-package-manager.mjs && vitest run"` and `"test:watch": "node scripts/check-package-manager.mjs && vitest"`.
- [x] 0.5 Add one throwaway trivial smoke test (e.g. `src/test/smoke.test.ts` asserting `1 + 1 === 2`) to prove the harness runs; delete or keep as a canary — do NOT put `mergeMilestonesByYear` tests here (design.md: helper + its test land together in Slice 3).
- [x] 0.6 Run `pnpm test` — verify exits 0. Run `pnpm build` — verify `tsc -b` still passes (test files are inside `include: ["src"]`).

Satisfies: spec.md `dev-testing-setup` → "Test command passes".

---

## Phase 1 — Slice 1: Data Model + Real Content (PR 2, ~460 lines)

- [x] 1.1 Edit `src/data/content.ts`: replace `ExperienceTrack` with `ExperienceBranch` (`branchKey`, `branchLabel`, `accentKey: BranchAccentKey`, `icon: string`, `milestones: Milestone[]`) and add `ExperienceData` (`branches: ExperienceBranch[]`, `convergenceLabel: string`); retype `PortfolioContent.experience: ExperienceData`. `Milestone` stays unchanged. Use `import type` for type-only imports (`verbatimModuleSyntax`); no `enum` (`erasableSyntaxOnly`).
- [x] 1.2 Edit `src/data/content.es.ts`: replace `experience` with 3 branches (Hab. Blandas 5, Oficio 4, Estudios Formales 7 = 16 milestones) verbatim from `content.md` ES table, `convergenceLabel: "Desarrollador Full Stack"`. Zero Lorem Ipsum.
- [x] 1.3 Edit `src/data/content.en.ts`: same for EN (Soft Skills 5, Trade 4, Formal Education 7 = 16), verbatim from `content.md` EN table, `convergenceLabel: "Full Stack Developer"`.
- [x] 1.4 Edit `src/data/content.en.ts` line ~331: `navLinks` entry `{ href: "#experience", label: "Experience" }` → `label: "Journey"`. Confirm `content.es.ts:331` already reads `"Trayectoria"` — no ES change needed.
- [x] 1.5 Minimally retype `src/components/sections/Experience.tsx` to keep the build green: swap `content.experience` iteration from `ExperienceTrack[]` to `ExperienceData.branches`, rename `track.*` → `branch.*` (`trackKey`→`branchKey`, `trackLabel`→`branchLabel`), remove the `<img heroImage>` element (field no longer exists). **Do not** touch layout, accordion behavior, or add desktop/mobile split yet — that is Slice 3's job.
- [x] 1.6 Run `pnpm build` — verify `tsc -b` passes (ES/EN shape parity enforced structurally). Run `pnpm test` — still green.

Satisfies: spec.md "Data model shape", "Content correctness", "Navigation" (stable anchor id, relabeled EN text).

---

## Phase 2 — Slice 2: Accent Colors + Icon Groundwork (PR 3, ~120 lines)

- [x] 2.1 Edit `src/index.css`: add `--color-branch-soft`, `--color-branch-trade`, `--color-branch-study` to the `@theme` block (after `--color-card-overlay`) and their `.dark` overrides, per design.md hex values.
- [x] 2.2 Create `src/lib/branchAccent.ts`: `BranchAccentKey` union type (`"soft" | "trade" | "study" | "accent"`), `BranchAccentClasses` interface (`ring`, `fill`, `text`, `stroke`), and `BRANCH_ACCENT` literal `Record` map (4 entries × 4 literal class strings — must be literal, not templated, for Tailwind's scanner).
- [x] 2.3 Edit `src/components/ui/IconMap.tsx`: add 3 branch icons (`compass`, `anvil`, `graduation`) + `code` for the terminal node, following the existing hand-authored inline-SVG pattern (no icon library).
- [x] 2.4 **[RED]** Create `src/components/ui/TimelineNode.test.tsx`: test A — render `TimelineNode` with `icon="compass"`, assert `getByTestId("timeline-dot").querySelector("svg")` is non-null. Test B — render without `icon`, assert no `svg` inside the dot and no crash. Run `pnpm test` — confirm both fail (component doesn't support `icon`/`accentKey` yet, no `data-testid="timeline-dot"` yet).
- [x] 2.5 **[GREEN]** Edit `src/components/ui/TimelineNode.tsx`: add optional `accentKey?: BranchAccentKey` (default `"accent"`) and `icon?: string` props. Add `data-testid="timeline-dot"` to the dot wrapper. When `icon` is set, render `<IconMap name={icon} className="h-3 w-3 {accent.text}" />` in place of the `<div className="h-2 w-2 rounded-full …">` core; dot border uses `accent.ring`, year label uses `accent.text`. Connector line stays `bg-border`. Run `pnpm test` — confirm both pass.
- [x] 2.6 Run `pnpm build` — verify no regressions (Slice 1's `Experience.tsx` still renders with default `accentKey="accent"`, unchanged visual appearance).

Satisfies: spec.md "Coverage for new pure logic and rendering" → icon-in-dot render test.

---

## Phase 3 — Slice 3: Desktop/Mobile Render Paths + Convergence Graphic (PR 4, ~250 lines)

- [x] 3.1 **[RED]** Create `src/lib/mergeMilestonesByYear.test.ts` using the real 3-branch fixture (5+4+7, per `content.md`) BEFORE the helper exists. Assert: length 16; full ascending year order; 2008 tie → "Scout" (soft) precedes "Taller Metalmecánico" (trade); "Continua"/"Ongoing" sorts last. Also test `parseYearStart`: `"2008"→2008`, `"2021–2022"→2021`, `"Continua"→Infinity`, `"Ongoing"→Infinity`. Run `pnpm test` — confirm red (module not found).
- [x] 3.2 **[GREEN]** Create `src/lib/mergeMilestonesByYear.ts`: `parseYearStart(year: string): number` (first 4-digit match, else `Number.POSITIVE_INFINITY`); `mergeMilestonesByYear(branches: ExperienceBranch[]): MergedMilestone[]` — decorate with `yearStart`/`branchIndex`, sort with the **explicit comparator** (never subtraction — `Infinity - Infinity === NaN` would corrupt the sort), strip decoration before returning. Run `pnpm test` — confirm green.
- [x] 3.3 Create `src/components/ui/ConvergenceGraphic.tsx`: `<svg viewBox="0 0 900 180" aria-hidden="true" focusable="false" className="hidden md:block w-full h-auto" fill="none">` — 3 branch endpoint circles (cx 150/450/750), 3 connector paths (`stroke-branch-*`), 1 terminal ring + 1 terminal core circle. Zero `<text>`, zero `foreignObject`, single fixed `viewBox`, not rendered below `md`.
- [x] 3.4 Rebuild `src/components/sections/Experience.tsx`: read `content.experience` once; **desktop path** (`hidden md:block`) — 3-column grid, each branch as independent accordion (`Record<string, boolean>` collapsed-state per design.md D5, `{}` = all expanded, toggling one never touches others), `<ConvergenceGraphic>` + `<p>{convergenceLabel}</p>` below the grid (HTML, not in SVG); **mobile path** (`md:hidden`) — 3-chip legend, single `<ol>` from `mergeMilestonesByYear(branches)`, terminal card with `convergenceLabel` as the last item. No `matchMedia`/`useMediaQuery` — pure Tailwind CSS gating.
- [x] 3.5 Run `pnpm test` and `pnpm build` — full suite green, `tsc -b` passes.
- [x] 3.6 Manual check: `prefers-reduced-motion` respected (inherited from `SectionWrapper`, no new animation code needed); accordion toggle is keyboard-operable via native `<button>` with `aria-expanded` reflecting state.

Satisfies: spec.md "Three-column layout + decorative convergence graphic", "Independent branch accordions, default expanded", "Single merged chronological timeline", "Motion and semantics", "Merge/sort unit test".

---

## Rollback

Each slice/PR is independently `git revert`-able. Reverting Slice 3 falls back to Slice 2's accordion-only render (real content, still shippable). No data migration, no persisted state, no feature flag.

## Open Questions Carried Into Apply (non-blocking)

- Exact hex values for the 3 branch tokens — contrast-checked candidates already in design.md; adjust only if they visibly clash with the blue accent.
- Branch icon glyph choices (`compass`/`anvil`/`graduation`) are suggestions, not contract.
