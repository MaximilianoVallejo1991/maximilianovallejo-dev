# Tasks: Portfolio Motion/UX Modernization

Change: `portfolio-motion-modernization` · Phase: `sdd-tasks` · Store: hybrid
Reads: `spec/nav-interaction.md`, `spec/motion-accessibility.md`, `spec/interaction-motion.md`, `design.md`

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated changed lines | ~390 (impl ~+177/−23, tests ~190) |
| 400-line budget risk | High |
| Chained PRs recommended | Yes (risk-mitigation option — not the default path) |
| Chain strategy | size-exception (pending) — resolved `delivery_strategy` is `single-pr`; fallback split named below |
| Delivery strategy | single-pr |
| Decision needed before apply | Yes |

```text
Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: size-exception
400-line budget risk: High
```

At ~390/400 lines the change sits at the review-budget ceiling with no margin. Per the resolved `single-pr` strategy, the orchestrator MUST require/record a maintainer-approved `size:exception` before `sdd-apply` proceeds as one PR. If no exception is granted, the confirmed fallback seam (unchanged from design.md) is:

| Suggested split | Units | Est. lines |
|---|---|---|
| PR 1 | WU0 + WU1 + WU2 (Nav: scroll state, indicator, mobile menu) | ~135 |
| PR 2 | WU3 – WU7 (carousel guard, theme toggle, hero, cards, deletion) | ~255 |

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|---|---|---|---|
| WU0 | `matchMedia` test mock | PR 1 | Hard prerequisite for WU3–WU6 tests |
| WU1 | Nav scroll state + `layoutId` indicator | PR 1 | Depends on WU0 for reduced-motion test |
| WU2 | Nav mobile menu `AnimatePresence` | PR 1 | Must follow WU1 (same `<a>` markup) |
| WU3 | Carousel autoplay reduced-motion guard | PR 2 | Independent; smallest, real a11y bug fix — can be pulled to front of PR 2 |
| WU4 | ThemeToggle icon crossfade | PR 2 | Independent |
| WU5 | Hero line-stagger | PR 2 | Independent |
| WU6 | Card hover lift | PR 2 | Independent |
| WU7 | Delete `SkillCard.tsx` + README cleanup | PR 2 | Independent; can be pulled forward — zero coupling |

---

## WU0: `matchMedia` test mock (blocks WU3–WU6 tests)

- [x] 0.1 In `src/test/setup.ts`, add a configurable `window.matchMedia` stub: default `matches: false` for all queries, a test-controllable override to force `(prefers-reduced-motion: reduce)` → `matches: true`, and no-op `addEventListener`/`removeEventListener`/`addListener`/`removeListener`. Prerequisite for every reduced-motion scenario across `motion-accessibility.md`.

## WU1: Nav scroll state + `layoutId` indicator (`src/components/layout/Nav.tsx`)

- [x] 1.1 Add `const [scrolled, setScrolled] = useState(false)` and `SCROLL_THRESHOLD = 8`; extend the existing `onScroll` (Nav.tsx:34-62) with `setScrolled(window.scrollY > SCROLL_THRESHOLD)`. Satisfies nav-interaction "Crosses threshold" / "Reverts below threshold".
- [x] 1.2 Update header `className` template to swap blur/shadow classes on `scrolled`, keeping `border-transparent` (not removed) in the unscrolled state. Satisfies nav-interaction "No flicker at boundary" (no height jump).
- [x] 1.3 Add module constants `INDICATOR_TRANSITION` (spring, stiffness 380, damping 32) and `INDICATOR_INSTANT` (`duration: 0`).
- [x] 1.4 Add `const prefersReduced = useReducedMotion()` at the top of the component body (RM-6).
- [x] 1.5 Inside the active desktop `<a>` (Nav.tsx:100-114), add `relative` and render `motion.span layoutId="nav-indicator-desktop"` conditionally, `transition={prefersReduced ? INDICATOR_INSTANT : INDICATOR_TRANSITION}`. Satisfies nav-interaction "Desktop indicator slides" + motion-accessibility "Nav active-indicator slide".
- [x] 1.6 Inside the active mobile `<a>` (Nav.tsx:159-171), add `relative` and render `motion.span layoutId="nav-indicator-mobile"` before the label. Satisfies nav-interaction "Mobile indicator slides" / "No cross-list jump" / "Distinct layoutId values".
- [x] 1.7 Tests: scroll toggles cleanly at threshold (crosses/reverts/no thrash); both `layoutId` spans coexist with different id values when both lists are mounted; indicator animates with `prefersReduced=false` and renders without an animated slide with `prefersReduced=true` (needs WU0 mock).

## WU2: Mobile menu `AnimatePresence` (`src/components/layout/Nav.tsx`) — after WU1

- [x] 2.1 Wrap the existing `{menuOpen && ...}` block in `AnimatePresence initial={false}`, converting the child to `motion.div key="mobile-menu"` with `overflow-hidden`.
- [x] 2.2 Move `px-4 pb-4 pt-2` padding to a new inner `<div>` so `height: 0` collapses fully; add `initial/animate/exit` for `height`/`opacity` and `transition={prefersReduced ? MENU_INSTANT : MENU_TRANSITION}` (`MENU_TRANSITION = { duration: 0.24, ease: [0.16,1,0.3,1] }`).
- [x] 2.3 Tests: menu opens with height `0→auto` + opacity `0→1`; closes via exit animation before unmount (no instant disappearance); tapping a nav link plays the exit animation. Satisfies nav-interaction "Animated mobile menu open/close" scenarios.

## WU3: Carousel reduced-motion guard (`src/components/ui/SkillCarousel.tsx`)

- [x] 3.1 Import `useReducedMotion` from `motion/react`; add `const prefersReduced = useReducedMotion()` at ~line 145, above the `if (n === 0) return null` early return and alongside the other pre-existing hooks (do not worsen the hooks-order bug — D5).
- [x] 3.2 Update the autoplay `useEffect` guard to `if (prefersReduced || !autoplay || !isInView || isHovered || n < 2) return;` and add `prefersReduced` to the dependency array.
- [x] 3.3 Tests: autoplay does not advance under `prefers-reduced-motion: reduce`; arrow/dot/wheel/touch/keyboard nav still advance under reduce; autoplay advances normally under `no-preference`. Satisfies motion-accessibility "Carousel autoplay" scenarios.

## WU4: ThemeToggle icon crossfade (`src/theme/ThemeToggle.tsx`)

- [x] 4.1 Add `ICON_PX = 18`, `ICON_SHOWN`/`ICON_HIDDEN` animate targets, `ICON_TRANSITION` (`duration: 0.28`)/`ICON_INSTANT` (`duration: 0`), and `const prefersReduced = useReducedMotion()`.
- [x] 4.2 Wrap button content in a fixed-size `relative` `<span>`; render two always-mounted `motion.span` (absolute, `initial={false}`) around the existing unchanged sun/moon `<svg>`, animate targets swapped on `isDark`, `transition={prefersReduced ? ICON_INSTANT : ICON_TRANSITION}`.
- [x] 4.3 Tests: crossfade plays both directions (sun→moon, moon→sun); both icon elements exist mid-transition, differentiated by opacity; rotation/scale suppressed under reduce while crossfade may still play; full morph plays under `no-preference`. Satisfies interaction-motion "Theme toggle icon morph" + motion-accessibility "Theme-toggle rotation" scenarios.

## WU5: Hero line-stagger (`src/components/sections/Hero.tsx`)

- [ ] 5.1 Add `textOrder = [0,1,2]`, `TEXT_STAGGER_DESKTOP = 0.18`, `TEXT_STAGGER_MOBILE = 0.15`, `TEXT_BASE_DELAY = 0.1` near `clockOrder`; extract `NODE_STAGGER_DESKTOP`/`NODE_STAGGER_MOBILE` constants (pure refactor, no behavior change).
- [ ] 5.2 Replace the desktop text block (lines 291-325): wrap each of the 3 `<text>` elements — byte-for-byte unchanged (`x`, `y`, `textAnchor`, `fill`, `style`) — in `motion.g` with `initial={{opacity:0, y: prefersReduced?0:12}}`, `animate={{opacity:1, y:0}}`, delay `TEXT_BASE_DELAY + textOrder[i]*TEXT_STAGGER_DESKTOP` (reusing the existing `prefersReduced` at Hero.tsx:109).
- [ ] 5.3 Replace the mobile text block (lines 510-544) equivalently with mobile constants/content (`mobileGreeting`/`mobileName`/`mobileSubtitle`).
- [ ] 5.4 Tests: desktop stagger (EN) and mobile stagger (ES) reveal in sequence; rendered `<text>` `x`/`y` attributes unchanged vs current `main` across 2 viewports × 2 locales (coordinate-lock regression); stagger suppressed under reduce (all lines fade together, no offset/delay). Satisfies interaction-motion "Hero line-stagger reveal" + motion-accessibility "Hero reveal" scenarios.

## WU6: Card hover lift (`src/components/ui/SectionWrapper.tsx`, `CertCard.tsx`, `ProjectCard.tsx`)

- [ ] 6.1 Export `hoverLift` from `SectionWrapper.tsx`: `{ y: -4, scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 30 } }`.
- [ ] 6.2 `CertCard.tsx`: import `useReducedMotion`/`hoverLift`; add `prefersReduced`; set `whileHover={prefersReduced ? undefined : hoverLift}` on the `motion.article`.
- [ ] 6.3 `ProjectCard.tsx`: same wiring, `prefersReduced` added after the existing `useState`; `whileHover` on `motion.article`.
- [ ] 6.4 `ProjectCard.tsx`: change the inner `<img>` class `duration-500` → `duration-300` (D2 — fixes lag between the 250ms card spring and the 500ms image zoom).
- [ ] 6.5 Tests: lift applies (`y:-4, scale:1.02`) under `no-preference` on both cards; suppressed (no transform) under reduce; returns to rest on hover-out; no `box-shadow` present at any state; `ProjectCard` image scale composes with card lift without clipping. Satisfies interaction-motion "Card hover lift is transform/opacity only" + motion-accessibility "Card hover lift" scenarios.

## WU7: Delete `SkillCard.tsx` + README cleanup

- [ ] 7.1 Delete `src/components/ui/SkillCard.tsx` (no barrel files exist in `src/`; zero code importers confirmed in design.md).
- [ ] 7.2 Update `README.md:101` (remove `SkillCard` from the `ui/` inventory) and remove `README.md:229` (known-issue C1, now stale). Leave `HANDOFF.md` untouched (historical log).
- [ ] 7.3 Verify: `pnpm build` (`tsc -b`) passes with zero missed importer errors.

---

## Sequencing Constraints (from design.md — preserved)

| Constraint | Detail |
|---|---|
| WU0 first — hard | Every reduced-motion test depends on it; without it WU3–WU6 ship untested |
| WU1 before WU2 | WU2 restructures the mobile `<a>` markup that WU1's indicator depends on |
| WU3 may pull forward | Smallest unit, only real WCAG bug fix — ship first if PR is split |
| WU7 may pull forward | Pure deletion, zero coupling — shrinks review surface early |
| WU4–WU6 | Fully independent, any order, no shared files |
