# Exploration: Portfolio Motion/UX Modernization

Change: `portfolio-motion-modernization`
Date: 2026-08-25
Phase: sdd-explore
Status: partial (persistence done by orchestrator — the sdd-explore sub-agent had no `Write`/`Bash`/`mem_save` tools available in this session; same gap seen in `2026-08-12-portfolio-career-timeline/explore.md`)

## Source

Motion/UX audit (Aug 2026) run ahead of this change, plus a design proposal discussed with the user, converged on 7 scope items to modernize animation/UX across the portfolio without introducing a new library (the `motion` v12 package is already installed and used).

## Current State (per file)

- **`Nav.tsx`**: sticky header, static `bg-surface/90 backdrop-blur-sm`, no scroll reactivity. Scroll-spy via `IntersectionObserver` sets `activeSection`, but the active link only gets a text-color change — no indicator element exists. Mobile menu is `{menuOpen && (<div>...)}`, instant mount/unmount, no `AnimatePresence`. Desktop and mobile render **two separate `.map()` lists** from the same `content.navLinks`.
- **`SkillCarousel.tsx`**: autoplay effect depends on `autoplay, isInView, isHovered, n` — does **not** check `useReducedMotion`. Confirmed accessibility bug (WCAG 2.2.2). Manual navigation (arrows/dots/wheel/touch/keyboard) is independent of the autoplay interval.
- **`ThemeToggle.tsx`**: plain conditional render of sun/moon SVG, no `motion`, no shared wrapper, no reduced-motion handling.
- **`Hero.tsx`**: name/title/greeting are raw SVG `<text>` elements inside a coordinate-locked viewBox (duplicated desktop 1000×700 / mobile 400×600 blocks), explicitly commented as living inside the SVG "so it ALWAYS stays aligned" regardless of screen size. Node paths already use `motion.g` with stagger via `clockOrder`.
- **`CertCard.tsx` / `SkillCard.tsx`**: `motion.article`/`motion.div` used only for scroll-entrance (`fadeInItem`), hover is CSS-only `hover:border-accent/40` (color, not transform). `SkillCard.tsx` confirmed dead code — zero importers besides itself; `Skills.tsx` uses `SkillCarousel` exclusively.
- **`ProjectCard.tsx`**: already has `group-hover:scale-105` (transform) on the inner image — partial precedent for the "lift" pattern in item 6, but the card itself doesn't lift/shadow, only the image zooms.
- **`SectionWrapper.tsx`**: `containerVariants`/`itemVariants` + `fadeInItem(index)` is the established stagger/entrance convention reused across sections — any new item-level animation should extend this, not invent a new one.
- **`Layout.tsx`**: top-level `AnimatePresence mode="wait"` wraps `motion.main` keyed by `language` (fade on language switch only). `Nav` is a sibling rendered before this `AnimatePresence` — no structural nesting conflict for Nav's own `layoutId`/`AnimatePresence` additions.

## Per-Item Approach

| # | Item | Approach | Scope |
|---|------|----------|-------|
| 1 | Nav dynamic scroll + animated indicator | Boolean `scrollY > threshold` state (or `useMotionValueEvent`) toggles blur/shadow classes; single `motion.span layoutId="nav-indicator-desktop"` rendered only inside the active link — Motion animates it across position on its own, no `AnimatePresence` needed. | Nav.tsx, ~40-60 lines |
| 2 | Mobile menu `AnimatePresence` | Wrap conditional block in `AnimatePresence`, `motion.div` animating `height: 0 → "auto"`, `opacity: 0 → 1`. | Same file, ~15-20 lines |
| 3 | SkillCarousel reduced-motion fix | Add `useReducedMotion()` guard clause to the autoplay effect. | SkillCarousel.tsx, ~3-5 lines |
| 4 | ThemeToggle icon morph | Both icons mounted, absolutely positioned, animate `opacity`/`rotate`/`scale` crossfade; reduced-motion gates rotation (crossfade only). | ThemeToggle.tsx, ~30-40 lines |
| 5 | Hero text reveal | **Approach A (recommended)**: wrap the 3 existing `<text>` elements in `motion.text` with staggered delay, preserving SVG coordinate-lock. Approach B (word/char split via `motion.tspan`) needs manual position math ×2 viewports ×2 languages — high risk, larger diff. | Hero.tsx, ~40-50 lines (A) vs 80-120+ (B) |
| 6 | CertCard/SkillCard/ProjectCard hover lift | `whileHover={{ y: -4, scale: 1.02 }}` gated by `useReducedMotion()`, added per card. | ~10-15 lines/file |
| 7 | SkillCard.tsx housekeeping | Confirmed dead code via grep. Delete vs. fold into item 6 — open question, sequencing depends on the answer. | −21 lines (if deleted) |

## Open Questions (block `sdd-propose` precision)

1. **`SkillCard.tsx`** — delete outright, or keep and fold into item 6's hover upgrade (e.g. as a future non-carousel fallback)?
2. **Item 6 hover** — the scope says "lift+shadow+scale" but the project's established convention is transform/opacity only. Confirm: allow `box-shadow` as an explicit exception, or drop the shadow and simulate depth via opacity/border only?
3. **Item 5 Hero** — confirm Approach A (line-level stagger) is acceptable, vs. the literally-requested word/character split (Approach B).

## Aggregate Diff Size Estimate

| Item(s) | Files | Est. lines (impl only) |
|---|---|---|
| 1+2 Nav | Nav.tsx | ~90-110 |
| 3 SkillCarousel | SkillCarousel.tsx | ~5 |
| 4 ThemeToggle | ThemeToggle.tsx | ~35 |
| 5 Hero (Approach A) | Hero.tsx | ~45 |
| 6 Cards | CertCard.tsx, SkillCard.tsx, ProjectCard.tsx | ~35 |
| 7 SkillCard removal | SkillCard.tsx | −21 |
| **Implementation subtotal** | | **~210-250** |

No existing test files for Nav, ThemeToggle, SkillCarousel, Hero, or CertCard (only Experience/Spacer/TimelineNode/Convergence/Divergence have `.test.tsx`). Standard mode (not strict TDD) is active for this change, but new/updated tests are still expected during `sdd-apply` — plausibly **+100-150 lines** across 5-6 test files, pushing the realistic total to **~310-400+ lines**.

**400-line budget risk: Medium-High** against the `single-pr` delivery strategy resolved for this change, once tests are counted.

## Risks

- Hero SVG-text constraint makes item 5 the least certain item — Approach A recommended to keep risk low.
- Nav item 1's `layoutId` must be scoped per list (desktop vs. mobile) to avoid a cross-list jump animation when the mobile menu opens.
- Item 6's "shadow" requirement nominally conflicts with the project's transform/opacity-only hover convention.
- Item 7 (delete vs. keep `SkillCard.tsx`) is unresolved and blocks clean sequencing of item 6 for that file.
- Aggregate diff estimate carries Medium-High risk of exceeding the 400-line `single-pr` budget once tests are included — formal decision point is the Review Workload Guard at `sdd-tasks`, but flagged here early.

## Ready for Proposal

Yes, pending resolution of the 3 open questions above.

**Next recommended**: `sdd-propose`
