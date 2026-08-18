# Proposal: Career Trajectory Section

Change: `portfolio-career-timeline` · Phase: `sdd-propose` · Artifact store: hybrid

## Intent

The `experience` section is 100% Lorem Ipsum across 4 meaningless tracks. It is dead weight in a portfolio whose entire pitch is a non-linear path into software. Replace it with the real story: **3 branches (Soft Skills, Trade, Formal Education) converging into one "Full Stack Developer" node**, 16 verified bilingual milestones. Success = a visitor understands in one screen that the convergence was deliberate, not accidental.

## Scope

### In Scope

- Reshape `Milestone` / `ExperienceTrack` types in `src/data/content.ts` (add optional `icon`, branch endpoint label).
- Replace `experience` data in `content.es.ts` + `content.en.ts` with the 16 approved milestones (see [content.md](content.md) — copy is locked, do not rewrite).
- Rebuild `Experience.tsx`: convergence graphic + per-branch `TimelineNode` lists.
- Add optional `icon` prop to `TimelineNode.tsx`, rendered inside the existing dot.
- Add branch/milestone icons to `IconMap.tsx` (hand-authored inline SVG, no new dependency).
- Relabel EN nav `Experience` → `Journey` (ES already reads `Trayectoria`).
- Vitest + Testing Library setup (see open item 5).

### Out of Scope

- Full Hero-style per-node SVG diagram (deferred stretch goal).
- Milestone photos/thumbnails (`photoUrl` stays optional, unused).
- Any change to Hero, About, Skills, Projects, Certifications, Contact.
- Icon libraries (MUI Timeline evaluated and rejected — see tech-decisions).

## Capabilities

### New

- `career-trajectory`: 3-branch convergence narrative, bilingual content model, per-branch expandable milestone timeline.
- `dev-testing-setup`: project test runner + component testing harness.

### Modified

- None — no `openspec/specs/` exists yet.

## Approach

Hybrid per exploration. Key departure from `Hero.tsx`: **all text lives in HTML; the SVG is a decorative connector layer only** (`aria-hidden`). Hero's brittleness comes from `foreignObject` text inside two hand-tuned coordinate sets (viewBox 1000×700 desktop / 400×600 mobile, ~520 lines). Removing text from the SVG removes the need for a mobile coordinate variant entirely.

### Open Item Decisions

| # | Question | Options | Recommendation |
|---|---|---|---|
| 1 | Graphic tech | CSS borders / Tailwind tricks / minimal inline SVG | **Minimal inline SVG** — 4 circles + 3 paths in one fixed viewBox, decorative only. CSS/Tailwind can't do diagonal converging curves without transform hacks. Topology is fixed (3→1), so "hardcoded" here is 7 shapes, not 16. |
| 2 | Layout + mobile | Vertical stack / side-by-side / dual markup like Hero | **Revised (user-requested):** desktop (`md+`) keeps the 3-column branch layout + SVG convergence graphic. Mobile (`<md`) does NOT show 3 stacked accordions — instead all 16 milestones merge into **one chronological timeline, color-coded per branch** (accent color passed as a `TimelineNode` prop), with a small 3-chip legend above it (color → branch name) and the "Full Stack Developer" terminal card at the end. Same-year ties break by branch order (Hab. Blandas → Oficio → Estudios Formales). Reuses `TimelineNode` as-is; adds one merge-and-sort helper. No content duplication, no second SVG/coordinate set. |
| 3 | Accordion | Single-open (current) / all expanded | **Independent multi-open toggles**, default expanded at `md+`, collapsed on mobile (one `matchMedia` read at mount). This is now the primary story — hiding it behind one-at-a-time clicks buries it. 16 milestones is too much unbroken mobile scroll to expand by default. |
| 4 | Nav entry | Keep `#experience` / rename `#journey` | **Keep `#experience`.** `Nav.tsx` resolves anchors via `querySelector(href)` + IntersectionObserver scrollspy in both locale files; renaming risks `cv.html` deep links and buys nothing — users see the label, not the id. |
| 5 | Test runner | Scope in / defer | **Scope in as slice 0.** Strict TDD Mode is active; `sdd-apply`/`sdd-verify` need a real command. Vitest is the zero-config fit (Vite 6 already present). Deferring forces fake TDD. Install via **pnpm** (`scripts/check-package-manager.mjs` hard-fails npm). |

## Affected Areas

| Area | Impact | Description |
|---|---|---|
| `src/data/content.ts` | Modified | Types reshaped, `icon` added |
| `src/data/content.es.ts` / `.en.ts` | Modified | `experience` replaced; EN nav label |
| `src/components/sections/Experience.tsx` | Modified | Rebuilt around convergence + branches |
| `src/components/ui/TimelineNode.tsx` | Modified | Optional `icon` prop in dot |
| `src/components/ui/IconMap.tsx` | Modified | New branch/milestone icons |
| `src/components/ui/ConvergenceGraphic.tsx` | New | Decorative SVG connector layer (desktop only, `md+`) |
| `src/utils/mergeMilestonesByYear.ts` (or inline in `Experience.tsx`) | New | Merges the 3 branches' milestones into one chronologically-sorted list for the mobile timeline, with branch accent color attached and same-year ties broken by branch order |
| `package.json`, `vite.config.ts`, `src/test/setup.ts` | New/Modified | Vitest harness |
| `src/components/sections/Hero.tsx` | Untouched | Reference only |

## Review Workload Forecast (preliminary)

Estimated ~850 changed lines. **Exceeds the 400-line budget — chained PRs recommended.** Delivery strategy is `ask-on-risk`, so confirm before `sdd-apply`. Suggested work-unit slices:

| Slice | Deliverable | Est. lines |
|---|---|---|
| 0 | Vitest + Testing Library harness, green sample test | ~60 |
| 1 | Types + real bilingual content + nav label (renders via existing accordion) | ~460 (data-heavy, low cognitive load — candidate for `size:exception`) |
| 2 | `TimelineNode` icon prop + `IconMap` additions | ~70 |
| 3 | `ConvergenceGraphic` + `Experience.tsx` restructure | ~250 |

Slice 1 cannot be split ES/EN: `PortfolioContent` enforces shape parity, so splitting breaks `tsc -b`.

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Convergence SVG drifts toward Hero-style hardcoding | Med | Hard constraint: no text in SVG, no second viewBox. Fail the design review if either appears. |
| Slice 1 alone busts the review budget | High | Flag as data-only; request `size:exception` or split by branch (3 branches × both locales, still parity-safe if types land in slice 1a). |
| Mobile default-collapsed needs `matchMedia` — SSR/hydration mismatch | Low | Static Vite SPA, no SSR. Read once in `useEffect`. |
| Scrollspy breaks if section id changes | Low | Decision 4 keeps `#experience`. |
| Vitest setup expands scope beyond the visual feature | Med | Slice 0 is capped: config + setup file + scripts + one smoke test. No retrofitting tests for other sections. |
| Icon set for 16 milestones balloons | Med | Icons are per-branch (3), not per-milestone. Milestone-level icons optional and additive. |

## Rollback Plan

Per-slice revert. Slice 3 reverts to slice 2's accordion-only render (still real content, still shippable). Slices 1–3 revert cleanly to the current Lorem Ipsum section via `git revert`; no data migration, no persisted state, no external dependency. Slice 0 is independently revertible (`pnpm remove` + delete config).

## Dependencies

- pnpm (enforced). New devDeps: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`.
- No runtime dependencies added.

## Success Criteria

- [ ] `experience` contains zero Lorem Ipsum; all 16 milestones match [content.md](content.md) verbatim in both locales.
- [ ] `pnpm build` passes (`tsc -b` proves ES/EN shape parity).
- [ ] `pnpm test` exists and is green.
- [ ] Convergence graphic + 3-column branch layout render at `md+`, with zero text inside the SVG.
- [ ] Below `md`, all 16 milestones render as one chronologically-sorted timeline, color-coded per branch, with a 3-chip legend and the terminal "Full Stack Developer" card — no stacked per-branch accordions on mobile.
- [ ] Branch panels toggle independently at `md+`; default expanded.
- [ ] `prefers-reduced-motion` respected (inherits `SectionWrapper`).
- [ ] Nav `#experience` scrollspy still highlights correctly; EN label reads "Journey".
