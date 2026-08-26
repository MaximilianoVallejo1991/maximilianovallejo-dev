# Proposal: Portfolio Motion/UX Modernization

Change: `portfolio-motion-modernization` · Phase: `sdd-propose` · Artifact store: hybrid

## Intent

The portfolio already ships `motion` v12, but only uses it for scroll-entrance. Interaction feedback is inconsistent: the nav has no scroll reactivity and no active indicator, the mobile menu pops in with no transition, and the theme toggle swaps icons instantly. Worse, `SkillCarousel` autoplays regardless of `prefers-reduced-motion` — a real **WCAG 2.2.2 violation**. Success = coherent, reduced-motion-safe interaction feedback across nav, theme toggle, hero and cards, with zero new dependencies.

## Scope

### In Scope

| # | Item | File(s) |
|---|---|---|
| 1 | Scroll-reactive header (blur/shadow threshold) + `layoutId` active indicator, **scoped separately for desktop vs. mobile lists** | `Nav.tsx` |
| 2 | Mobile menu `AnimatePresence` height/opacity transition | `Nav.tsx` |
| 3 | `useReducedMotion()` guard on the autoplay effect (a11y fix) | `SkillCarousel.tsx` |
| 4 | Sun/moon icon morph (opacity/rotate/scale crossfade); reduced-motion gates rotation only | `ThemeToggle.tsx` |
| 5 | Line-level `motion.text` stagger reveal for greeting/name/subtitle, **both** desktop and mobile SVG blocks | `Hero.tsx` |
| 6 | `whileHover={{ y: -4, scale: 1.02 }}` gated by reduced-motion — **no box-shadow** | `CertCard.tsx`, `ProjectCard.tsx` |
| 7 | Delete confirmed dead code (zero importers) | `src/components/ui/SkillCard.tsx` |

### Out of Scope

- Word/character-level Hero splitting via `motion.tspan` (Approach B) — rejected as fragile.
- `box-shadow` on hover — violates the project's transform/opacity-only convention.
- `Experience.tsx` traveling-light system — untouched.
- Any new animation library or dependency.
- Retrofitting `SkillCard.tsx` hover (it is deleted, not upgraded).

## Capabilities

### New

- `nav-interaction`: scroll-reactive header state, animated active-section indicator, animated mobile menu.
- `motion-accessibility`: `prefers-reduced-motion` compliance for autoplay, hover lift, icon morph, and hero reveal.
- `interaction-motion`: theme toggle morph, hero line stagger, card hover lift.

### Modified

- None — `openspec/specs/` does not exist yet.

## Approach

Extend what exists; invent nothing. Per exploration:

- **Nav (1)**: boolean `scrollY > threshold` state toggles blur/shadow classes. A single `motion.span` with `layoutId` renders **only inside the active link** — Motion animates position itself, no `AnimatePresence` needed. Two distinct ids (`nav-indicator-desktop` / `nav-indicator-mobile`) because desktop and mobile are two separate `.map()` lists over the same `navLinks`.
- **Mobile menu (2)**: wrap the existing conditional in `AnimatePresence`, animate `height: 0 → "auto"` + opacity.
- **Carousel (3)**: guard clause only. Manual navigation (arrows/dots/wheel/touch/keyboard) is already independent of the interval, so pausing autoplay costs no functionality.
- **ThemeToggle (4)**: mount both icons absolutely positioned, crossfade.
- **Hero (5)**: `<text>` → `motion.text` with staggered delay. Coordinates stay locked in the existing viewBoxes — no position math, no second coordinate set.
- **Cards (6)**: `ProjectCard` already has `group-hover:scale-105` on the inner image; the card-level lift composes with it.
- **All new motion** reuses `SectionWrapper`'s `containerVariants`/`itemVariants`/`fadeInItem` stagger convention rather than defining parallel variants.

## Affected Areas

| Area | Impact | Description |
|---|---|---|
| `src/components/layout/Nav.tsx` | Modified | Items 1 + 2; largest single diff |
| `src/components/ui/SkillCarousel.tsx` | Modified | Item 3, a11y guard |
| `src/components/ui/ThemeToggle.tsx` | Modified | Item 4, icon morph |
| `src/components/sections/Hero.tsx` | Modified | Item 5, both SVG blocks |
| `src/components/ui/CertCard.tsx` | Modified | Item 6 |
| `src/components/ui/ProjectCard.tsx` | Modified | Item 6 |
| `src/components/ui/SkillCard.tsx` | **Removed** | Item 7, dead code |
| `src/components/sections/Experience.tsx` | Untouched | Traveling-light system is a hard no-touch |
| `src/components/layout/SectionWrapper.tsx` | Untouched | Convention source, reused not modified |

## Constraints

- **Testing**: Standard mode for this change (**not** Strict TDD). New/updated tests are still expected during `sdd-apply` — no test files currently exist for Nav, ThemeToggle, SkillCarousel, Hero, or CertCard.
- **Motion library only** — `motion` v12 is already installed. **No new dependencies.**
- `Experience.tsx` traveling-light system stays untouched.
- `SectionWrapper` stagger convention is preserved and extended, not replaced.
- Transform/opacity only for hover — no `box-shadow`.
- pnpm only (`scripts/check-package-manager.mjs` hard-fails npm).

## Review Workload Forecast (preliminary)

| Group | Est. lines |
|---|---|
| Implementation subtotal (items 1–7) | ~210–250 |
| Tests (5–6 files, none exist today) | ~100–150 |
| **Realistic total** | **~310–400+** |

**400-line budget risk: Medium-High.** Delivery strategy is `single-pr`. Per the `chained-pr` rule, if `sdd-tasks` confirms the aggregate estimate exceeds 400 changed lines, a maintainer-approved **`size:exception` must be requested and recorded before `sdd-apply` begins** — do not silently switch to chained PRs. The formal decision point is the Review Workload Guard at `sdd-tasks`; flagged here early.

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Aggregate diff busts the 400-line `single-pr` budget once tests land | **High** | Record `size:exception` at the `sdd-tasks` guard before apply. Do not auto-chain. |
| Nav `layoutId` shared across desktop + mobile lists causes a cross-list jump when the mobile menu opens | **Med** | Two distinct `layoutId` values, scoped per list. Explicit spec requirement + test. |
| Hero SVG coordinate-lock breaks under `motion.text` wrapping | **Med** | Approach A only — wrap existing elements, never recompute positions. Verify both viewports × both locales. |
| Reduced-motion gates applied inconsistently across 4 files | **Med** | `motion-accessibility` is its own capability with its own spec requirements, not an afterthought per file. |
| Nav diff (items 1+2, ~90–110 lines) becomes hard to review as one unit | Low | Items 1 and 2 are separate work-unit commits (behavior + its tests), even inside one PR. |
| Deleting `SkillCard.tsx` breaks an unseen import | Low | Confirmed zero importers; `tsc -b` catches any miss at build time. |

## Rollback Plan

Per-item `git revert` — every item is an independent work-unit commit touching a disjoint concern (item 7 is a pure deletion, restorable from history). No data migration, no persisted state, no dependency change, no schema. Reverting any single item leaves the rest functional because each is additive motion on top of already-working markup. Full rollback = revert the PR; the portfolio returns to its current static-interaction state.

## Dependencies

- None. `motion` v12 is already installed and in use.

## Success Criteria

- [ ] Header visibly changes blur/shadow past the scroll threshold; active indicator slides between links.
- [ ] Desktop and mobile nav indicators never animate into each other (separate `layoutId` scopes).
- [ ] Mobile menu opens/closes with a height+opacity transition, and exits cleanly via `AnimatePresence`.
- [ ] With `prefers-reduced-motion: reduce`, carousel autoplay does **not** run; manual navigation still works.
- [ ] With `prefers-reduced-motion: reduce`, card hover lift and theme-toggle rotation are suppressed (crossfade still allowed).
- [ ] Hero greeting/name/subtitle reveal in staggered sequence on both desktop and mobile SVG blocks, in both locales, with no coordinate drift.
- [ ] Card hover applies transform only — **zero** `box-shadow` added.
- [ ] `src/components/ui/SkillCard.tsx` is deleted and `pnpm build` (`tsc -b`) passes.
- [ ] `pnpm test` green; new tests cover the reduced-motion gates.
- [ ] `Experience.tsx` diff is empty.

## Next Phases

`sdd-spec` and `sdd-design` (parallel, both read this proposal), then `sdd-tasks`.
