# Design: Portfolio Motion/UX Modernization

Change: `portfolio-motion-modernization` · Phase: `sdd-design` · Artifact store: hybrid
Reads: `proposal.md`, `explore.md` · Feeds: `sdd-tasks`

## Decision Summary

| # | Item | Core decision |
|---|---|---|
| — | **Shared** | One reduced-motion convention (`RM-CONV`) applied at 5 sites, 2 application modes (prop-ternary, effect-guard) |
| — | **Shared** | `src/test/setup.ts` gains a `window.matchMedia` mock — **prerequisite**, jsdom has none today |
| 1 | Nav scroll | `useState<boolean>` fed by the **already-existing** passive scroll listener. No `useScroll`, no second listener |
| 1 | Nav indicator | `motion.span` conditionally rendered **inside** the active `<a>`; two `layoutId`s, both lists mounted simultaneously |
| 2 | Mobile menu | `AnimatePresence` wraps existing conditional; padding moves to an inner div so `height: 0` is truly 0 |
| 3 | Carousel | Guard clause + dep array; `useReducedMotion()` must sit **above** the existing `if (n === 0) return null` |
| 4 | ThemeToggle | Both icons always mounted in a fixed-size `relative` wrapper; no `AnimatePresence` |
| 5 | Hero | **`motion.g` wrapper, not `motion.text`** — Motion maps `y` to the SVG *attribute* on `<text>` |
| 6 | Cards | `whileHover` object with explicit spring; `ProjectCard` image zoom retuned to match timing |
| 7 | SkillCard | Clean delete — **no barrel files exist anywhere in `src/`** |

## Corrections to the Proposal

Two paths in the proposal's Affected Areas table are wrong. `sdd-tasks` must use these:

| Proposal says | Actual path |
|---|---|
| `src/components/ui/ThemeToggle.tsx` | **`src/theme/ThemeToggle.tsx`** |
| `src/components/layout/SectionWrapper.tsx` | **`src/components/ui/SectionWrapper.tsx`** |

`Nav.tsx` imports `ThemeToggle` from `../../theme/ThemeToggle` — confirmed.

---

## Shared Convention: `RM-CONV` (reduced motion)

The proposal flags "reduced-motion gates applied inconsistently across 4 files" as a Med risk. This is the single convention that closes it.

### The rule

```ts
import { useReducedMotion } from "motion/react";

const prefersReduced = useReducedMotion();   // top of component body
```

| Aspect | Rule |
|---|---|
| Variable name | `prefersReduced` — always |
| Call site | Top-level component body, **before any early return** |
| Import | `motion/react` (never `framer-motion`) |
| Forbidden | Branching JSX, a second component, reading `matchMedia` directly, a wrapper hook |

### Two application modes only

**Mode A — prop ternary** (declarative motion):

```tsx
prop={prefersReduced ? undefined : value}   // for variants / whileHover
delay={prefersReduced ? 0 : computedDelay}  // for timing
```

Mirrors the existing `SectionWrapper.tsx:48-49` pattern exactly. `undefined` — not `{}`, not a no-op variant.

**Mode B — effect guard** (imperative motion):

```ts
useEffect(() => {
  if (prefersReduced || /* existing conditions */) return;
  // ...
}, [prefersReduced, /* existing deps */]);
```

Must appear in **both** the guard and the dependency array.

### Site map

| Site | File | Mode | What is gated | What survives |
|---|---|---|---|---|
| RM-1 | `ui/SkillCarousel.tsx` | B | Autoplay interval | All manual nav (arrows, dots, wheel, touch, keys) |
| RM-2 | `theme/ThemeToggle.tsx` | A | `rotate` + `scale` | `opacity` crossfade |
| RM-3 | `sections/Hero.tsx` | A | Stagger delay + `y` offset | Final rendered position |
| RM-4 | `ui/CertCard.tsx` | A | Entire `whileHover` | CSS `hover:border-accent/40` |
| RM-5 | `ui/ProjectCard.tsx` | A | Entire `whileHover` | CSS border + image zoom |
| RM-6 | `layout/Nav.tsx` | A | Indicator slide duration | Indicator still renders at the active link |

RM-6 is a **scope delta** — see Open Decisions.

### Naming note

The codebase currently has both `prefersReduced` (`SectionWrapper`, `Hero`, `Layout`) and `prefersReducedMotion` (`Experience`, `DivergenceGraphic`). New code uses `prefersReduced` (majority, and matches every file in this change's blast radius). **Do not** rename the two outliers — `Experience.tsx` is a hard no-touch and `DivergenceGraphic` is out of scope.

---

## Prerequisite: `matchMedia` test mock

`src/test/setup.ts` is 5 lines and does **not** mock `window.matchMedia`. jsdom does not implement it. Every reduced-motion test in this change depends on being able to force `prefers-reduced-motion: reduce`.

**Add to `src/test/setup.ts`** a configurable `matchMedia` stub keyed on the query string, exposing a helper so tests can flip the value per-case. Shape:

- Default: all queries return `matches: false`
- Test-controllable override so a test can force `(prefers-reduced-motion: reduce)` → `matches: true`
- Must implement `addEventListener` / `removeEventListener` / `addListener` / `removeListener` as no-ops — Motion's `useReducedMotion` subscribes, and `Hero.tsx:131` and `ThemeContext.tsx:19` also call `matchMedia`

This is **WU0** and blocks the test half of WU3–WU6.

---

## Item 1 — Nav: scroll-reactive header + `layoutId` indicator

### 1a. Scroll threshold state

**Decision: `useState<boolean>` updated from the existing scroll listener.** Not `useScroll` + `useMotionValueEvent`.

Rationale:

| Option | Verdict |
|---|---|
| `useState` + existing listener | **Chosen.** A listener already exists at `Nav.tsx:51-56` (passive, for the hero fallback). Adds zero listeners. |
| `useScroll` + `useMotionValueEvent` | Rejected. Its benefit is avoiding re-renders by writing to a MotionValue. We need a **Tailwind class swap**, which requires a re-render regardless. Pure overhead + a new import. |
| `motion.header` + `animate` on backdrop | Rejected. `backdrop-blur` is not an animatable transform/opacity property; violates the project's transform/opacity convention. |

Implementation shape — extend the existing effect, do not add a new one:

```tsx
const [scrolled, setScrolled] = useState(false);
const SCROLL_THRESHOLD = 8;

// inside the EXISTING useEffect (Nav.tsx:34-62), extend the EXISTING onScroll:
const onScroll = () => {
  setScrolled(window.scrollY > SCROLL_THRESHOLD);   // added
  if (window.scrollY < 100) setActiveSection("#hero");  // unchanged
};
```

`setScrolled` with an unchanged boolean is a no-op re-render in React — no throttle needed.

Header className becomes a template with the conditional segment:

```tsx
className={`sticky top-0 z-40 border-b transition-shadow duration-200 ${
  scrolled
    ? "border-border bg-surface/95 shadow-sm backdrop-blur-md"
    : "border-transparent bg-surface/90 backdrop-blur-sm"
}`}
```

Border must be `border-b border-transparent` in the unscrolled state (not removed) so the header height never changes — a height jump would fight the sticky offset used by `handleNavClick`.

### 1b. Active indicator placement

**Decision: `motion.span` rendered conditionally *inside* the active `<a>`.** Not a sibling, not a single indicator positioned by measurement.

The `<a>` gains `relative`. Motion's layout engine handles the cross-element slide on its own — **no `AnimatePresence`**, because at any moment exactly one span with a given `layoutId` is mounted; Motion treats mount-at-B-while-unmounting-at-A as the same element and interpolates.

Desktop (`Nav.tsx:100-114`) — underline bar:

```tsx
<a
  key={link.href}
  href={link.href}
  onClick={(e) => handleNavClick(e, link.href)}
  className={`relative text-sm font-medium no-underline transition-colors duration-200 ${
    activeSection === link.href ? "text-accent" : "text-muted hover:text-accent"
  }`}
>
  {link.label}
  {activeSection === link.href && (
    <motion.span
      layoutId="nav-indicator-desktop"
      className="absolute -bottom-1.5 left-0 right-0 h-0.5 rounded-full bg-accent"
      transition={prefersReduced ? INDICATOR_INSTANT : INDICATOR_TRANSITION}
    />
  )}
</a>
```

Mobile (`Nav.tsx:159-171`) — left rail, placed **before** the label so it does not affect inline text flow:

```tsx
<a
  className={`relative block rounded-md px-3 py-2 text-sm font-medium no-underline transition-colors duration-200 ${
    activeSection === link.href
      ? "text-accent bg-accent/5"
      : "text-muted hover:bg-border/50 hover:text-primary"
  }`}
>
  {activeSection === link.href && (
    <motion.span
      layoutId="nav-indicator-mobile"
      className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-accent"
      transition={prefersReduced ? INDICATOR_INSTANT : INDICATOR_TRANSITION}
    />
  )}
  {link.label}
</a>
```

Module-level constants (top of `Nav.tsx`):

```ts
const INDICATOR_TRANSITION = { type: "spring", stiffness: 380, damping: 32 } as const;
const INDICATOR_INSTANT = { duration: 0 } as const;
```

`motion.span` is `display: inline` by default; `absolute` promotes it to block. It carries no text, so it needs no `aria-hidden` — it is a decorative empty element.

### 1c. The two-`layoutId` scoping decision (explore.md risk)

**Decision: two distinct ids — `nav-indicator-desktop` and `nav-indicator-mobile`.**

The real reason is stronger than "two lists":

> The desktop list is `hidden md:flex` — **CSS-hidden, never unmounted**. When the mobile menu opens, both lists are mounted in the React tree simultaneously, each rendering an indicator for the same `activeSection`.

With a shared `layoutId`, Motion would see two elements claiming one layout identity and animate between them — and worse, it would measure the desktop one while `display: none`, which yields a zero-size bounding box, producing a slide to/from the viewport origin. Separate ids give each list its own layout scope, so neither ever measures the other.

Rejected alternatives:

| Alternative | Why rejected |
|---|---|
| Single `layoutId`, unmount desktop list below `md` | Requires a JS breakpoint (`matchMedia`) to drive rendering. Replaces a CSS concern with a JS one and adds a resize listener. |
| Single `layoutId` + `LayoutGroup` per list | `LayoutGroup` namespaces ids, so it works — but it is two extra wrapper components and one more import to achieve exactly what two string literals achieve. |
| No `layoutId`, animate `left`/`width` from measurement | Requires refs on every link + a ResizeObserver. Strictly worse. |

**Test requirement**: assert both indicator spans can coexist and that their `layoutId` values differ — this is the regression guard for the Med-likelihood risk in the proposal.

### 1d. Interaction with `Layout.tsx`

`Layout.tsx` has a top-level `AnimatePresence mode="wait"` keyed by `language`. Per explore.md, `Nav` is a **sibling rendered before** it — no nesting, no conflict.

One consequence worth a test: on language switch, `content.navLinks` labels change but `href`s do not, so `activeSection` is unchanged and the indicator keeps the same `layoutId` at the same link. It may re-measure (label widths change between es/en) and slide slightly — this is correct behavior, not a bug.

---

## Item 2 — Nav: mobile menu `AnimatePresence`

**Decision: `AnimatePresence` wraps the existing `{menuOpen && ...}` conditional unchanged.** No change to `menuOpen` state logic, no change to the hamburger handler, no change to `handleNavClick`'s `setMenuOpen(false)`.

`AnimatePresence` is purely additive: it intercepts unmount and defers it until the exit animation resolves. The existing state machine is untouched.

### The padding trap

The current element is:

```tsx
<div className="border-t border-border bg-surface px-4 pb-4 pt-2 md:hidden">
```

Animating `height: 0` on **this** element does not collapse it — `pb-4 pt-2` (24px) survives, leaving a visible bar. Padding must move to an inner wrapper.

```tsx
<AnimatePresence initial={false}>
  {menuOpen && (
    <motion.div
      key="mobile-menu"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={prefersReduced ? MENU_INSTANT : MENU_TRANSITION}
      className="overflow-hidden border-t border-border bg-surface md:hidden"
    >
      <div className="px-4 pb-4 pt-2">
        {content.navLinks.map((link) => (/* unchanged, + indicator from 1b */))}
      </div>
    </motion.div>
  )}
</AnimatePresence>
```

Required details:

| Detail | Why |
|---|---|
| `overflow-hidden` on the `motion.div` | Without it, links spill outside the collapsing box during the animation |
| Padding on the inner `div` | So `height: 0` is genuinely 0 |
| `key="mobile-menu"` | `AnimatePresence` requires a stable key on its direct child |
| `initial={false}` | Suppresses an open-animation on first mount/hydration; the menu starts closed anyway |
| `height: "auto"` | Motion measures and interpolates to a pixel value automatically |

```ts
const MENU_TRANSITION = { duration: 0.24, ease: [0.16, 1, 0.3, 1] } as const;
const MENU_INSTANT = { duration: 0 } as const;
```

The easing reuses `itemVariants`'s curve from `SectionWrapper.tsx:23` — same visual language, shorter duration because this is interaction feedback, not entrance.

---

## Item 3 — SkillCarousel reduced-motion guard

**Target effect**: `SkillCarousel.tsx:190-195`.

### Guard clause and placement

```ts
// with the other hooks, ~line 145 — BEFORE `if (n === 0) return null`
const prefersReduced = useReducedMotion();

// autoplay effect, modified:
useEffect(() => {
  if (prefersReduced || !autoplay || !isInView || isHovered || n < 2) return;
  const ms = Math.max(0.3, autoplayDelay) * 1000;
  const id = window.setInterval(() => step(1), ms);
  return () => window.clearInterval(id);
}, [prefersReduced, autoplay, autoplayDelay, isInView, isHovered, n, step]);
```

`prefersReduced` goes **first** in the guard — it is the a11y-mandated condition and reads as the headline. Added to the dep array so a live OS preference change tears the interval down immediately (Motion's `useReducedMotion` is reactive).

Needs a new import line: `import { useReducedMotion } from "motion/react";` — this file currently imports nothing from `motion`.

### Placement is load-bearing (pre-existing bug)

`SkillCarousel.tsx:150` is:

```tsx
if (n === 0) return null
```

...and it sits **above** `useCallback` at line 152 and every `useEffect` below it. That already violates the Rules of Hooks: when `skills` is empty the hook count changes and React throws on the subsequent render.

This change does not fix that bug (out of scope), but it **must not compound it**. `useReducedMotion()` goes at ~line 145 alongside `useState(0)` / `useState(false)` / `useRef` — above the early return, where the other correctly-placed hooks are.

Flagged in Risks for a follow-up change.

### Functionality cost: zero

Per explore.md, every manual path (`step` via arrows, dots, wheel, touch, `onKeyDown`) is independent of the interval. Disabling autoplay removes no capability. Test must assert exactly this: with reduce on, no advance after `autoplayDelay`, but arrow click still advances.

---

## Item 4 — ThemeToggle icon morph

**File**: `src/theme/ThemeToggle.tsx` (not `components/ui/`).

**Decision: both icons permanently mounted, absolutely stacked, crossfaded by `animate`.** No `AnimatePresence`.

Rationale: `AnimatePresence` would unmount/remount SVGs on every toggle and requires exit coordination for a two-state swap that never has more than two known states. Two always-mounted elements with opposed `animate` values is fewer moving parts and gives a true simultaneous crossfade rather than a sequenced out-then-in.

### Component shape

The wrapper must have **explicit dimensions** — both children are `absolute`, so the wrapper would otherwise collapse to zero and the button's `p-1.5` would produce a 0×0 hit area.

```tsx
const ICON_PX = 18;

<button
  onClick={toggleTheme}
  aria-label={label}
  className="cursor-pointer rounded-md p-1.5 text-muted transition-colors duration-200 hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
>
  <span
    className="relative block"
    style={{ width: ICON_PX, height: ICON_PX }}
  >
    <motion.span
      className="absolute inset-0 block"
      initial={false}
      animate={isDark ? ICON_SHOWN : ICON_HIDDEN}
      transition={prefersReduced ? ICON_INSTANT : ICON_TRANSITION}
    >
      {/* existing sun <svg>, unchanged */}
    </motion.span>

    <motion.span
      className="absolute inset-0 block"
      initial={false}
      animate={isDark ? ICON_HIDDEN : ICON_SHOWN}
      transition={prefersReduced ? ICON_INSTANT : ICON_TRANSITION}
    >
      {/* existing moon <svg>, unchanged */}
    </motion.span>
  </span>
</button>
```

### Animate targets

```ts
const ICON_SHOWN  = { opacity: 1, rotate: 0,    scale: 1   } as const;
const ICON_HIDDEN = { opacity: 0, rotate: -90,  scale: 0.6 } as const;

const ICON_TRANSITION = { duration: 0.28, ease: [0.16, 1, 0.3, 1] } as const;
const ICON_INSTANT    = { duration: 0 } as const;
```

### Reduced-motion variant

Per the proposal's success criterion — *"theme-toggle rotation suppressed (crossfade still allowed)"* — gating happens on the **transition**, not the target values:

| | `rotate` / `scale` | `opacity` |
|---|---|---|
| Normal | Animated over 0.28s | Animated over 0.28s |
| Reduced | Jumps instantly (duration 0) | Jumps instantly (duration 0) |

`duration: 0` means the hidden icon's rotation/scale is never *perceived* as motion, while the icon swap still reads correctly. This is simpler and more robust than maintaining a second pair of target objects, and it keeps a single source of truth for the visual end-state.

### Wrapping notes

- `motion.span` (not `motion.div`) — the parent is a `<button>`; `<div>` inside `<button>` is invalid HTML in strict parsers.
- Both existing `<svg>` elements keep `aria-hidden="true"`; the accessible name stays on the button's `aria-label`, which already recomputes per theme/language. **No a11y regression** — but note both icons are now always in the DOM, so `aria-hidden` on both is now load-bearing rather than incidental.
- `initial={false}` prevents a crossfade animation on first paint / theme rehydration.
- The button keeps `text-muted` and the SVGs keep `stroke="currentColor"` — theme colors continue to work untouched.

---

## Item 5 — Hero line-level stagger

**File**: `src/components/sections/Hero.tsx`. Two blocks: desktop `1000×700` (lines 291-325) and mobile `400×600` (lines 510-544). Three `<text>` elements each.

### Critical decision: `motion.g`, not `motion.text`

The proposal and explore both say "wrap the 3 `<text>` in `motion.text`". **This design overrides that**, and the reason is exactly the Med-likelihood risk both documents flagged ("Hero SVG coordinate-lock breaks under `motion.text` wrapping"):

> Motion resolves `x` / `y` to **SVG presentation attributes** on elements that accept them — and `<text>` accepts `x` and `y`. Animating `y` on `motion.text` therefore writes the `y` **attribute**, overwriting the hardcoded `y={308}` / `y={356}` / `y={400}` coordinate lock. That is coordinate drift, not a hypothetical.

`<g>` accepts no `x`/`y` attributes, so Motion compiles `y` to `transform: translateY()` — a pure visual offset that cannot touch the coordinate system.

This is not a novel pattern: **the same file already proves it**, at `Hero.tsx:218` (desktop) and `Hero.tsx:407` (mobile), where node groups animate `initial={{ opacity: 0, y: ... }}` on `motion.g`.

Fallback if a reviewer insists on the literal `motion.text`: animate **`opacity` only**, never `y`. That is safe but loses the rise.

### Reuse the `clockOrder` pattern

`Hero.tsx:118` defines `const clockOrder = [0, 1, 2, 3, 4]` and each node computes:

```ts
const step = clockOrder[i];
const delay = prefersReduced ? 0 : step * 0.4;   // 0.35 on mobile
```

The text stagger reuses this shape verbatim, with a parallel order array. Add near `clockOrder`:

```ts
/* Text entrance order — greeting, name, subtitle (top to bottom) */
const textOrder = [0, 1, 2] as const;
const TEXT_STAGGER_DESKTOP = 0.18;
const TEXT_STAGGER_MOBILE  = 0.15;
const TEXT_BASE_DELAY      = 0.1;
```

Tighter than the node stagger (`0.4` / `0.35`) because three lines read as one headline block, whereas five nodes read as a sequence. Text leads: it completes at ~0.46s while nodes complete at 1.6s, so the name lands first and the circuit builds around it.

While at it, extract the existing magic numbers to named constants for symmetry — `NODE_STAGGER_DESKTOP = 0.4`, `NODE_STAGGER_MOBILE = 0.35` — and reference them at `Hero.tsx:215` / `Hero.tsx:404`. Pure refactor, no behavior change.

### Desktop shape (replaces lines 291-325)

Each of the three `<text>` elements is wrapped; the `<text>` itself is **byte-for-byte unchanged**, including `x`, `y`, `textAnchor`, `fill`, and `style`.

```tsx
{[
  { key: "greeting", node: /* existing greeting <text>, unchanged */ },
  { key: "name",     node: /* existing name <text>, unchanged */ },
  { key: "subtitle", node: /* existing subtitle <text>, unchanged */ },
].map((line, i) => (
  <motion.g
    key={line.key}
    initial={{ opacity: 0, y: prefersReduced ? 0 : 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.8,
      delay: prefersReduced
        ? 0
        : TEXT_BASE_DELAY + textOrder[i] * TEXT_STAGGER_DESKTOP,
      ease: "easeOut",
    }}
  >
    {line.node}
  </motion.g>
))}
```

`duration: 0.8` and `ease: "easeOut"` are copied from the desktop node groups (`Hero.tsx:222`) so text and nodes share one motion feel.

If the array-map indirection is judged less readable than three explicit blocks, three literal `motion.g` wrappers with hardcoded `textOrder` indices are equally acceptable — the constraint is the wrapper element and the delay formula, not the loop.

### Mobile shape (replaces lines 510-544)

Identical, with mobile values:

- `initial={{ opacity: 0, y: prefersReduced ? 0 : 8 }}` — matches `Hero.tsx:409`
- `duration: 0.7` — matches `Hero.tsx:411`
- `delay: TEXT_BASE_DELAY + textOrder[i] * TEXT_STAGGER_MOBILE`
- Content is `mobileGreeting` / `mobileName` / `mobileSubtitle` (different keys from desktop — do not unify)

The mobile center text already sits inside a plain `<g>` at `Hero.tsx:393`. Nesting `motion.g` inside it is valid and inert.

### Reduced motion (RM-3)

`prefersReduced` **already exists** at `Hero.tsx:109`. Reuse it — do **not** add a second `useReducedMotion()` call. When reduced: `y` offset is `0` and all delays are `0`, so all three lines fade in together with no movement. This matches the existing node treatment exactly.

### Verification matrix

The proposal requires "both viewports × both locales, no coordinate drift":

| | es | en |
|---|---|---|
| Desktop 1000×700 | greeting/name/subtitle at x=500, y=308/356/400 | same |
| Mobile 400×600 | mobileGreeting/Name/Subtitle at x=195, y=274/296/314 | same |

Assertion: the rendered `<text>` `x`/`y` attributes are **unchanged from current `main`** in all four cells. That is the coordinate-lock regression test.

---

## Item 6 — Card hover lift

**Files**: `src/components/ui/CertCard.tsx`, `src/components/ui/ProjectCard.tsx`. (`SkillCard.tsx` is deleted by item 7, not upgraded.)

### Shared variant object

Defined **once**, exported from `SectionWrapper.tsx` alongside `fadeInItem` — that file is already the project's motion-convention source, and duplicating the object in two files is exactly the inconsistency the proposal warns about.

```ts
// src/components/ui/SectionWrapper.tsx — new export
export const hoverLift = {
  y: -4,
  scale: 1.02,
  transition: { type: "spring", stiffness: 400, damping: 30 },
} as const;
```

The explicit `transition` is **required**. Without it, `whileHover` inherits the component's default transition — which, because these cards carry `itemVariants` via `fadeInItem`, is the 0.45s entrance easing. That reads as sluggish, laggy hover. The spring settles in ~250ms.

Transform-only: `y` and `scale`. **Zero `box-shadow`**, per the proposal's hard constraint.

### `useReducedMotion()` call site — both cards

Top of the component body, before the `return`. `ProjectCard` already has a hook (`useState`) — `prefersReduced` goes immediately after it.

`CertCard.tsx`:

```tsx
import { motion, useReducedMotion } from "motion/react";
import { fadeInItem, hoverLift } from "./SectionWrapper";

export default function CertCard({ cert, index }: CertCardProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.article
      {...fadeInItem(index)}
      whileHover={prefersReduced ? undefined : hoverLift}
      className="flex cursor-pointer flex-col rounded-lg border border-border bg-surface p-5 transition-colors duration-200 hover:border-accent/40"
    >
```

`ProjectCard.tsx`:

```tsx
export default function ProjectCard({ project, index }: ProjectCardProps) {
  const [imgError, setImgError] = useState(false);
  const prefersReduced = useReducedMotion();

  return (
    <motion.article
      {...fadeInItem(index)}
      whileHover={prefersReduced ? undefined : hoverLift}
      className="group cursor-pointer overflow-hidden rounded-xl border border-border bg-surface transition-colors duration-200 hover:border-accent/40"
    >
```

`className` is unchanged in both — including `hover:border-accent/40`, which is a color transition and survives reduced motion. `group` stays on `ProjectCard`.

### Composing with `group-hover:scale-105` (the double-scale question)

`ProjectCard.tsx:31` has `transition-transform duration-500 group-hover:scale-105` on the inner `<img>`.

**Decision: keep both. The compounding is not the problem; the timing mismatch is.**

| Concern | Analysis | Action |
|---|---|---|
| Magnitude | Nested transforms multiply: image renders at `1.02 × 1.05 = 1.071`. A 7.1% zoom vs. the intended 5% is visually indistinguishable. | None |
| Clipping | The card has `overflow-hidden` and the image wrapper has `overflow-hidden`; the extra 2% is clipped cleanly. | None |
| **Timing** | Card springs to rest in ~250ms; image eases over **500ms**. The image visibly keeps growing after the card has settled — reads as lag, not layering. | **Change `duration-500` → `duration-300`** |
| Reduced motion | The image zoom is pure CSS and is **not** covered by `prefersReduced`. | Accepted — see below |

The one-token class change is in the same file and the same work unit. Alternatives considered:

- *Remove `group-hover:scale-105`* — rejected. It is existing, working, shipped behavior; deleting it is a UX regression outside this change's intent.
- *Reduce card scale to `1.0` for `ProjectCard` only* — rejected. Two different hover variants defeats the shared-convention goal.

**Correction (orchestrator, verified against `src/index.css:70-84`)**: this is not a gap. A global `@media (prefers-reduced-motion: reduce)` rule already exists in this codebase — `*, *::before, *::after { transition-duration: 0.01ms !important; }` — and it already covers the image's CSS `transition-transform`. Under reduced motion the image still reaches `scale-105` on hover (the end state is unchanged, same as `hover:border-accent/40` elsewhere), but the transition collapses to ~0.01ms instead of animating over 500ms — i.e. it snaps instead of animating, which is the correct reduced-motion behavior and matches every other CSS-only hover in this codebase. No follow-up change needed.

### `whileHover` × `variants` interaction

Both cards receive `variants={itemVariants}` from `fadeInItem`, and their parent `SectionWrapper` drives `animate="visible"`. `itemVariants.visible` sets `y: 0`; `hoverLift` sets `y: -4`.

Motion resolves `whileHover` at higher priority than `animate` while hovered, and returns to the `animate` state on hover-out. No conflict, no `y` fighting. The only artifact is hovering *during* the entrance animation, which momentarily wins the `y` — acceptable and self-correcting.

---

## Item 7 — Delete `SkillCard.tsx`

**Decision: hard delete `src/components/ui/SkillCard.tsx`. No barrel update needed.**

Verification performed:

| Check | Result |
|---|---|
| `index.ts` / `index.tsx` anywhere under `src/` | **None exist.** Glob `src/**/index.{ts,tsx}` returns zero files. The project imports by direct path exclusively. |
| Code importers of `SkillCard` | **Zero.** Only self-reference (`SkillCard.tsx` internal) plus docs. |
| `Skills.tsx` | Uses `SkillCarousel` exclusively — confirmed in explore.md. |
| `IconMap.tsx` | Also used by `SkillCarousel.tsx:395`, so it stays. **Do not delete `IconMap`.** |

Doc mentions (non-blocking, no build impact):

- `README.md:101` — lists `SkillCard` in the `ui/` inventory
- `README.md:229` — a known-issue entry "C1: `SkillCard` renders only text labels"
- `HANDOFF.md:90`, `HANDOFF.md:188` — historical changelog entries

**Recommendation**: update `README.md:101` (inventory, now factually wrong) and drop `README.md:229` (a known issue about a deleted file is noise). Leave `HANDOFF.md` alone — it is a dated historical log; rewriting history there is wrong.

Gate: `pnpm build` (`tsc -b`) must pass. TypeScript catches any missed importer at compile time.

---

## Open Decisions for `sdd-spec` / `sdd-tasks`

| # | Decision | Recommendation |
|---|---|---|
| D1 | **RM-6 is a scope delta.** The proposal's `motion-accessibility` capability lists 4 gates (autoplay, hover, icon morph, hero reveal). The Nav indicator's layout slide is a 5th animation not covered. | **Included.** Orchestrator added the requirement to `specs/motion-accessibility.md` ("Nav active-indicator slide MUST respect reduced motion") — resolved, no action needed at `sdd-tasks`. |
| D2 | `ProjectCard` image `duration-500` → `duration-300`. | Include in WU6. One token, same file, fixes a real visual defect introduced by the lift. |
| D3 | `README.md` cleanup in WU7. | Include. ~2 lines. |
| D4 | `motion.g` instead of `motion.text` for item 5. | **Design overrides the proposal.** `sdd-spec` should word the requirement by *behavior* ("lines reveal in staggered sequence with no change to rendered `x`/`y` attributes"), not by element name. |
| D5 | `SkillCarousel`'s pre-existing hooks-order bug (`return null` above hooks). | **Do not fix here.** Out of scope, would inflate an already at-risk diff. File as a follow-up. |

---

## Work Units (ordered — direct input to `sdd-tasks`)

Each unit is one commit: behavior **plus its own tests**, never split by file type. Each is independently revertable.

| WU | Item | Scope | Files | Est. impl | Est. test |
|---|---|---|---|---|---|
| **WU0** | — | `matchMedia` mock in test setup — **blocks WU3–WU6 tests** | `src/test/setup.ts` | ~25 | 0 |
| **WU1** | 1 | Scroll threshold state + header class swap + `layoutId` indicator in both lists (2 ids) | `layout/Nav.tsx` | ~45 | ~45 |
| **WU2** | 2 | `AnimatePresence` mobile menu + padding restructure | `layout/Nav.tsx` | ~20 | ~25 |
| **WU3** | 3 | `useReducedMotion` autoplay guard (**a11y fix**) | `ui/SkillCarousel.tsx` | ~5 | ~30 |
| **WU4** | 4 | Two-icon crossfade wrapper + RM gate | `theme/ThemeToggle.tsx` | ~35 | ~25 |
| **WU5** | 5 | `motion.g` text stagger, desktop + mobile + stagger constants | `sections/Hero.tsx` | ~45 | ~35 |
| **WU6** | 6 | `hoverLift` export + both cards + image duration retune | `ui/SectionWrapper.tsx`, `ui/CertCard.tsx`, `ui/ProjectCard.tsx` | ~25 | ~30 |
| **WU7** | 7 | Delete `SkillCard.tsx` + README cleanup | `ui/SkillCard.tsx` (−21), `README.md` | ~−23 | 0 |

### Sequencing constraints

| Constraint | Detail |
|---|---|
| **WU0 first — hard** | Every reduced-motion test needs it. Without WU0, WU3–WU6 ship untested. |
| **WU1 before WU2** | WU2 restructures the mobile list's DOM; WU1 adds the indicator inside those same `<a>` elements. Reversed order means WU2 gets rewritten. |
| WU3 may be pulled to position 2 | Smallest unit and the only real **bug** (WCAG 2.2.2). If the PR gets split, this one ships first. |
| WU7 may be pulled to position 2 | Pure deletion, zero coupling to anything else. Early removal shrinks the review surface. |
| WU4–WU6 fully independent | No shared files, any order. |

### Review workload handoff

| | Lines |
|---|---|
| Implementation | ~+177 / −23 |
| Tests | ~190 |
| **Total** | **~390** |

**Verdict: at the 400-line `single-pr` ceiling, with no margin.** This confirms the proposal's Medium-High assessment and lands right on the boundary. `sdd-tasks` must run the Review Workload Guard: either record a maintainer-approved `size:exception`, or split at the natural seam — **WU0+WU1+WU2 (Nav, ~135 lines)** as PR 1, **WU3–WU7 (~255 lines)** as PR 2. Do not auto-chain without the guard decision.

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| `motion.text` `y`-as-attribute would break Hero's coordinate lock | **High if built as proposed** | High | **Resolved by design** — `motion.g` wrapper (D4). Regression test asserts `x`/`y` attributes unchanged across 2 viewports × 2 locales. |
| Aggregate diff lands at ~390/400 lines | **High** | Med | Guard at `sdd-tasks`; pre-identified split seam after WU2. |
| Shared `layoutId` would slide the indicator from a `display:none` element (zero bbox → origin jump) | **Resolved** | High | Two ids + a test asserting they differ and coexist. |
| `height: 0` leaves a 24px padding bar in the mobile menu | Med | Low | Padding moved to inner div; test asserts collapsed height. |
~~`ProjectCard` image zoom is not reduced-motion gated~~ — **not a real risk**, corrected by orchestrator: `src/index.css:71-84` already forces `transition-duration: 0.01ms` globally under reduced motion, so the CSS zoom already collapses to an instant snap. No follow-up needed. | — | — | — |
| `SkillCarousel` pre-existing hooks-order violation (`return null` at line 150 above 8 hooks) | Low (needs empty `skills`) | High | Not fixed here (D5). New hook placed **above** the early return so this change does not worsen it. Follow-up filed. |
| `useReducedMotion` untestable without `matchMedia` — jsdom has none | **Certain** | High | WU0 is a hard prerequisite, sequenced first. |
| Proposal's `ThemeToggle` / `SectionWrapper` paths are wrong | **Certain** | Low | Corrected table at the top of this document. |
| RM-6 (Nav indicator gate) not in the proposal's capability list | Med | Low | Flagged as D1 for `sdd-spec` to formalize. |

## Rollback

Unchanged from the proposal: per-WU `git revert`. Every unit is additive motion on already-working markup, except WU7 (restorable from history) and WU0 (test-only). No migration, no persisted state, no dependency change.
