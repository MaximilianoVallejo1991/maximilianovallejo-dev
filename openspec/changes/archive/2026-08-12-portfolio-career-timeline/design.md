# Design: Career Trajectory Section

Change: `portfolio-career-timeline` · Phase: `sdd-design` · Store: hybrid
Reads: [proposal.md](proposal.md) (approved), [spec.md](spec.md) (authoritative), [content.md](content.md) (locked copy)

> **Superseded**: proposal.md Decision 3's "collapsed on mobile" wording is stale. spec.md governs: **below `md` there is no accordion at all** — one merged chronological list. No `matchMedia` anywhere in this change.

## Technical Approach

One data source, two CSS-gated render paths. `content.experience` is read once in `Experience.tsx`; the desktop path maps branches to 3 columns, the mobile path pipes the same branches through a pure merge/sort helper. Visibility is pure Tailwind (`hidden md:block` / `md:hidden`) — zero JS media queries, zero hydration risk, zero content duplication in source. The SVG is a decorative connector layer only: `aria-hidden`, one `viewBox`, no `<text>`, no `foreignObject`.

## Architecture Decisions

| # | Decision | Choice | Rejected | Rationale |
|---|---|---|---|---|
| D1 | Responsive strategy | Dual DOM subtree, CSS-gated at `md` | `useMediaQuery`/`matchMedia` single render | `display:none` subtrees are outside the a11y tree, so no duplicate-content penalty. Avoids mount flash + the SSR/hydration risk proposal.md flagged. Eliminates that risk entirely. |
| D2 | Accent color mechanism | 3 new `--color-branch-*` tokens in `@theme` + `.dark`, consumed via a static class map | Inline `style={{color}}`, arbitrary values `text-[#d97706]` | Tailwind v4 auto-generates `text-/bg-/border-/stroke-branch-*` utilities from `@theme` tokens. Extends the existing token system instead of inventing a parallel one; dark mode inherits `.dark` override for free. Tailwind cannot build class names dynamically, so the key→class map must be a literal record. |
| D3 | Helper location | `src/lib/mergeMilestonesByYear.ts` | `src/utils/…` (proposal.md's guess), inline in `Experience.tsx` | `src/utils/` does not exist; `src/lib/` is the established convention (`cloudinary.ts`, `placeholder.ts`). Inline kills unit-testability — this is the primary TDD target. |
| D4 | Terminal label placement | Field on the experience object; rendered as HTML **below** the SVG | `<text>` inside the SVG (Hero's approach) | Text in SVG is exactly what made `Hero.tsx` need two coordinate sets and ~520 lines. Hard constraint from spec.md. |
| D5 | Accordion state | `Record<string, boolean>` keyed by `branchKey`, storing **collapsed** | `expandedTrack: string \| null` (current), `Set<string>` of expanded | Inverted storage makes `{}` mean "all expanded" — default-expanded requires no seeding from content and stays correct if branch count changes. **Breaking change to existing state shape.** |
| D6 | Vitest config location | `test` block inside existing `vite.config.ts` | Separate `vitest.config.ts` | The React plugin is already configured there and is required for JSX in tests. One config, no duplication. `vite.config.ts` sits outside `tsconfig.json`'s `include: ["src"]`, so it is not type-checked either way. |
| D7 | Test globals | `globals: false`, explicit `import { describe, it, expect } from "vitest"` | `globals: true` + `types: ["vitest/globals"]` in tsconfig | Setting `compilerOptions.types` restricts ambient type inclusion project-wide. Explicit imports keep `tsconfig.json` untouched. |

## Data Model — `src/data/content.ts`

`Milestone` is unchanged (no speculative fields, per spec). `ExperienceTrack` is replaced.

```ts
// UNCHANGED
export interface Milestone {
  year: string;          // "2008" | "2021–2022" | "Continua" | "Ongoing"
  title: string;
  description: string;
  photoUrl?: string;     // stays optional + unused
}

// NEW — replaces ExperienceTrack (heroImage dropped, icon + accentKey added)
export interface ExperienceBranch {
  branchKey: string;              // stable id: "soft" | "trade" | "study"
  branchLabel: string;            // localized: "Hab. Blandas" / "Soft Skills"
  accentKey: BranchAccentKey;     // color token id, locale-invariant
  icon: string;                   // IconMap key, e.g. "compass"
  milestones: Milestone[];
}

// NEW — wraps branches + the convergence terminal label
export interface ExperienceData {
  branches: ExperienceBranch[];
  convergenceLabel: string;       // "Desarrollador Full Stack" / "Full Stack Developer"
}

// PortfolioContent: experience: ExperienceTrack[]  →  experience: ExperienceData;
```

`erasableSyntaxOnly: true` is on — use union types + `const` objects, **never `enum`**. `verbatimModuleSyntax: true` — all type imports must use `import type`.

### Accent colors — `src/index.css` + `src/lib/branchAccent.ts`

```css
/* @theme block, after --color-card-overlay */
--color-branch-soft:  #d97706;   /* Hab. Blandas / Soft Skills — amber  */
--color-branch-trade: #0d9488;   /* Oficio / Trade — teal               */
--color-branch-study: #7c3aed;   /* Estudios Formales / Formal Ed — violet */

/* .dark block */
--color-branch-soft:  #fbbf24;
--color-branch-trade: #2dd4bf;
--color-branch-study: #a78bfa;
```

```ts
// src/lib/branchAccent.ts
export type BranchAccentKey = "soft" | "trade" | "study" | "accent";

export interface BranchAccentClasses {
  ring: string;    // dot border
  fill: string;    // dot core + legend chip
  text: string;    // year label
  stroke: string;  // SVG path/circle
}

export const BRANCH_ACCENT: Record<BranchAccentKey, BranchAccentClasses> = {
  accent: { ring: "border-accent",       fill: "bg-accent",       text: "text-accent",       stroke: "stroke-accent" },
  soft:   { ring: "border-branch-soft",  fill: "bg-branch-soft",  text: "text-branch-soft",  stroke: "stroke-branch-soft" },
  trade:  { ring: "border-branch-trade", fill: "bg-branch-trade", text: "text-branch-trade", stroke: "stroke-branch-trade" },
  study:  { ring: "border-branch-study", fill: "bg-branch-study", text: "text-branch-study", stroke: "stroke-branch-study" },
};
```

All 16 class strings are literal → Tailwind's scanner finds them. `"accent"` preserves today's look as the default, so `TimelineNode` stays backward-compatible.

## Merge/Sort Helper — `src/lib/mergeMilestonesByYear.ts`

```ts
import type { ExperienceBranch, Milestone } from "../data/content";
import type { BranchAccentKey } from "./branchAccent";

export interface MergedMilestone {
  milestone: Milestone;
  branchKey: string;
  branchLabel: string;
  accentKey: BranchAccentKey;
}

/** First 4-digit run in the year string; Infinity when absent ("Continua"/"Ongoing" sort last). */
export function parseYearStart(year: string): number {
  const match = year.match(/\d{4}/);
  return match ? Number(match[0]) : Number.POSITIVE_INFINITY;
}

export function mergeMilestonesByYear(branches: ExperienceBranch[]): MergedMilestone[];
```

Implementation contract:

1. Decorate: for each `branch` at `branchIndex`, for each `milestone`, emit `{ ...MergedMilestone, yearStart, branchIndex }`.
2. Sort with an **explicit comparator** — never subtraction:
   ```ts
   if (a.yearStart !== b.yearStart) return a.yearStart < b.yearStart ? -1 : 1;
   return a.branchIndex - b.branchIndex;
   ```
   **Gotcha**: `Infinity - Infinity === NaN` would corrupt the sort. This is why subtraction is banned on `yearStart`.
3. Strip the decoration fields before returning.

Tie-break order (Hab. Blandas → Oficio → Estudios Formales) comes from **array order in the content files**, not a hardcoded list. Same-branch/same-year pairs (2021 Argentina Programa vs 2021–2022 QA) hold source order via `Array.prototype.sort` stability.

Expected output: 16 items. Index 0 = 2007 Téc. Electrónica (study). 2008 tie → Scout (soft) precedes Taller Metalmecánico (trade). Last = Continua/Ongoing.

## Component Tree

```
Experience.tsx  (orchestrator — reads useContent(), owns accordion state)
├── <h2>  ← content.navLinks.find(l => l.href === "#experience").label
├── desktop path   "hidden md:block"
│   ├── <div className="grid grid-cols-3 gap-8">
│   │     └── per branch: <button aria-expanded> + <ol> of <TimelineNode accentKey icon>
│   ├── <ConvergenceGraphic accentKeys={["soft","trade","study"]} />   aria-hidden
│   └── <p> convergenceLabel  (HTML, NOT in the SVG)
└── mobile path    "md:hidden"
    ├── legend: 3 chips (BRANCH_ACCENT[k].fill dot + branchLabel)
    ├── <ol> mergeMilestonesByYear(branches).map(<TimelineNode accentKey …>)
    └── terminal card: convergenceLabel
```

| File | Action | Responsibility |
|---|---|---|
| `src/data/content.ts` | Modify | `ExperienceBranch` + `ExperienceData` replace `ExperienceTrack`; `PortfolioContent.experience` retyped |
| `src/data/content.es.ts` | Modify | 16 real milestones verbatim from content.md, 3 branches, `convergenceLabel: "Desarrollador Full Stack"` |
| `src/data/content.en.ts` | Modify | Same for EN + nav label (below) |
| `src/lib/branchAccent.ts` | Create | `BranchAccentKey` type + `BRANCH_ACCENT` class map |
| `src/lib/mergeMilestonesByYear.ts` | Create | Pure merge/sort helper (above) |
| `src/lib/mergeMilestonesByYear.test.ts` | Create | Order, 2008 tie-break, count=16, `parseYearStart` edge cases |
| `src/index.css` | Modify | 3 `--color-branch-*` tokens in `@theme` + `.dark` |
| `src/components/ui/TimelineNode.tsx` | Modify | New optional `icon`, `accentKey` props; icon renders inside the dot |
| `src/components/ui/TimelineNode.test.tsx` | Create | Icon-in-dot with and without `icon` |
| `src/components/ui/IconMap.tsx` | Modify | 3 branch icons (`compass`, `anvil`, `graduation`) + `code` for the terminal node |
| `src/components/ui/ConvergenceGraphic.tsx` | Create | Decorative SVG, `md+` only |
| `src/components/sections/Experience.tsx` | Modify | Rebuilt orchestrator, dual render paths, new accordion state |
| `vite.config.ts` | Modify | `test` block |
| `src/test/setup.ts` | Create | jest-dom matchers + `cleanup` |
| `package.json` | Modify | `test` / `test:watch` scripts, 5 devDeps |

`src/components/sections/Hero.tsx` — **untouched** (reference only).

## `TimelineNode` prop change

```ts
interface TimelineNodeProps {
  milestone: Milestone;
  isLast: boolean;
  index: number;
  accentKey?: BranchAccentKey;  // default "accent" → current appearance
  icon?: string;                // IconMap key; when absent, current 2×2 dot core renders
}
```

Inside the dot (`data-testid="timeline-dot"` added for the test): when `icon` is set, render `<IconMap name={icon} className={\`h-3 w-3 ${accent.text}\`} />` in place of the `<div className="h-2 w-2 rounded-full …">` core. Dot border uses `accent.ring`; year label uses `accent.text`. Connector line stays `bg-border` for all branches.

## Convergence Graphic — `src/components/ui/ConvergenceGraphic.tsx`

Root: `<svg viewBox="0 0 900 180" aria-hidden="true" focusable="false" className="hidden md:block w-full h-auto" fill="none">`.

`900` maps to a `grid-cols-3` container: column centers land on x = 150, 450, 750 (1/6, 3/6, 5/6). One `viewBox`, no mobile variant, no `preserveAspectRatio` override.

| Element | Geometry | Class |
|---|---|---|
| Branch endpoint ×3 | `<circle cx="150|450|750" cy="16" r="7" />` | `fill-branch-*` |
| Left path | `M150 16 C150 90 450 80 447 131` | `stroke-branch-soft` |
| Middle path | `M450 16 V131` | `stroke-branch-trade` |
| Right path | `M750 16 C750 90 450 80 453 131` | `stroke-branch-study` |
| Terminal ring | `<circle cx="450" cy="150" r="18" />` | `fill-surface stroke-accent` |
| Terminal core | `<circle cx="450" cy="150" r="8" />` | `fill-accent` |

Paths: `strokeWidth={2.5}`, `strokeLinecap="round"`, `fill="none"`. Total: 5 circles + 3 paths. **Zero `<text>`, zero `foreignObject`** — the "Full Stack Developer" label is a sibling HTML `<p>`.

## Accordion (desktop only)

```ts
const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
const isExpanded = (key: string) => !collapsed[key];
const toggle = (key: string) =>
  setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
```

- `{}` initial ⇒ all 3 expanded on first render (spec: "Default expanded").
- Toggling one key never touches the others (spec: "Independent toggle").
- `<button aria-expanded={isExpanded(branch.branchKey)}>` — native `<button>` gives Enter/Space for free.
- The `<img heroImage>` in the current header is removed; the header becomes icon + label + chevron.

## Vitest Harness (slice 0, ~60 lines)

```ts
// vite.config.ts — add reference + test block
/// <reference types="vitest/config" />
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    globals: false,
    setupFiles: ["./src/test/setup.ts"],
    css: false,
  },
});
```

```ts
// src/test/setup.ts
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => cleanup());
```

```json
"test":       "node scripts/check-package-manager.mjs && vitest run",
"test:watch": "node scripts/check-package-manager.mjs && vitest"
```

devDeps (pnpm only — `scripts/check-package-manager.mjs` hard-fails npm):
`vitest`, `jsdom`, `@testing-library/react`, `@testing-library/dom`, `@testing-library/jest-dom`.

**pnpm gotcha**: `@testing-library/react@16` declares `@testing-library/dom` as a *peer*. pnpm's strict, non-hoisted `node_modules` will not resolve it implicitly — it MUST be installed explicitly.

**tsc gotcha**: `tsconfig.json` has `include: ["src"]`, so `*.test.ts(x)` and `src/test/setup.ts` ARE type-checked by `pnpm build`. `noUnusedLocals`/`noUnusedParameters` apply to test files too.

## Nav Change

`src/data/content.en.ts` line 331 — label only, `href` untouched:

```diff
-    { href: "#experience", label: "Experience" },
+    { href: "#experience", label: "Journey" },
```

`src/data/content.es.ts:331` already reads `label: "Trayectoria"` — **no ES change**. Because `Experience.tsx` derives its `<h2>` from `navLinks.find(l => l.href === "#experience")?.label`, this one line updates both the nav link and the section heading. `#experience` is also targeted by `Hero.tsx:82,96` and `Nav.tsx`'s `querySelector` + `IntersectionObserver` scrollspy — all unaffected.

## Testing Strategy

| Layer | Target | Approach |
|---|---|---|
| Unit | `mergeMilestonesByYear` | Feed the real 3-branch fixture (5+4+7). Assert length 16, full ascending year order, 2008 tie → Scout before Taller Metalmecánico, "Continua" last. |
| Unit | `parseYearStart` | `"2008"→2008`, `"2021–2022"→2021`, `"Continua"→Infinity`, `"Ongoing"→Infinity` |
| Component | `TimelineNode` | RTL render with `icon="compass"` → `getByTestId("timeline-dot").querySelector("svg")` is non-null; render without `icon` → no `svg` inside the dot, no crash |
| Build | ES/EN parity | `tsc -b` in `pnpm build` — structural, no test needed |

Strict TDD order for slice 0→1: write `mergeMilestonesByYear.test.ts` red **before** the helper exists.

## Slice Mapping & Conflict Risk

| Slice | Files | Est. lines |
|---|---|---|
| 0 | `vite.config.ts`, `src/test/setup.ts`, `package.json`, `pnpm-lock.yaml` | ~60 |
| 1 | `content.ts`, `content.es.ts`, `content.en.ts`, **`Experience.tsx`** | ~460 |
| 2 | `index.css`, `branchAccent.ts`, `TimelineNode.tsx`, `TimelineNode.test.tsx`, `IconMap.tsx` | ~120 |
| 3 | `ConvergenceGraphic.tsx`, `mergeMilestonesByYear.ts`(+test), **`Experience.tsx`** | ~250 |

**Cross-slice file (merge-conflict risk)**: `src/components/sections/Experience.tsx` is touched in slice 1 (minimal adaptation to `ExperienceData` + renamed fields so the build stays green) and rewritten in slice 3. Keep slice 1's edit to the smallest possible diff — retype the destructure, swap `track.*` → `branch.*`, drop the `heroImage` `<img>`. Do not start restructuring layout in slice 1.

`mergeMilestonesByYear.ts` is authored in slice 3 but its **test may land in slice 0** as the harness smoke test; if so, slice 0 must ship it skipped or slice 3 must own both. Recommend: slice 0 uses a throwaway trivial smoke test, and the merge helper + its test land together in slice 3.

## Migration / Rollout

No data migration, no persisted state, no feature flag. Per-slice `git revert`. Slice 3 reverts to slice 2's accordion-only render (real content, still shippable).

## Open Questions

None blocking. Two low-risk judgment calls left to `sdd-apply`:
- Exact hex values for the 3 branch tokens (contrast-checked candidates given above; adjust if they clash with the blue accent).
- Branch icon glyph choices in `IconMap` (`compass` / `anvil` / `graduation` are suggestions, not contract).
