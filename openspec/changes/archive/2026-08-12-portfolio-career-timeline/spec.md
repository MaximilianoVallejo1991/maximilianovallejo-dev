# Spec: Career Trajectory Section

Change: `portfolio-career-timeline` · Phase: `sdd-spec` · Store: hybrid
Source: proposal.md (approved), content.md (locked copy)

## Capability: `career-trajectory` (NEW)

### Requirement: Data model shape
`Milestone` keeps `year`/`title`/`description`/optional `photoUrl` unchanged — no fields for the deferred detail-modal. Branch type adds a key, label, accent-color id. `TimelineNode` gains optional `icon` + accent-color id. ES/EN shape parity MUST be enforced by `tsc -b`.

| Scenario | Given | When | Then |
|---|---|---|---|
| Build enforces parity | ES/EN both implement `PortfolioContent` | `pnpm build` runs | `tsc -b` passes only if `experience` shape matches (3 branches, 16 milestones, same keys) |
| No speculative fields | `Milestone` type post-change | inspected | no fields for extended text/files/photo-array/video |

### Requirement: Content correctness
`experience` MUST hold exactly 3 branches (Hab. Blandas/Soft Skills 5, Oficio/Trade 4, Estudios Formales/Formal Education 7 = 16 total), text verbatim from `content.md` per locale, plus terminal "Full Stack Developer"/"Desarrollador Full Stack" label. Zero Lorem Ipsum.

| Scenario | Given | When | Then |
|---|---|---|---|
| Milestone counts match | ES and EN `experience` | counted per branch | 5/4/7 per locale, text matches `content.md` |
| No placeholder text | full `experience` array, both locales | searched for "Lorem" (case-insensitive) | zero matches |

## Capability: `career-trajectory` — Desktop (`md+`)

### Requirement: Three-column layout + decorative convergence graphic
3 branch columns render at `md+` alongside a convergence graphic: `aria-hidden="true"`, zero `<text>`/`foreignObject` nodes, single fixed `viewBox` (no mobile coordinate variant).

| Scenario | Given | When | Then |
|---|---|---|---|
| No text nodes | rendered `ConvergenceGraphic` at `md+` | SVG output inspected | zero `<text>`/`foreignObject`; root has `aria-hidden="true"` |
| Single viewBox, no mobile variant | `ConvergenceGraphic.tsx` | inspected | exactly one `viewBox`; not rendered below `md` |

### Requirement: Independent branch accordions, default expanded
Each branch panel toggles independently (expanding one doesn't collapse another) and defaults to expanded on first render.

| Scenario | Given | When | Then |
|---|---|---|---|
| Default expanded | section renders at `md+`, first load | no interaction yet | all 3 panels show their milestones |
| Independent toggle | all 3 panels expanded | user collapses "Oficio" | "Oficio" collapses; other 2 stay expanded |

## Capability: `career-trajectory` — Mobile (`<md`)

### Requirement: Single merged chronological timeline
Below `md`: ONE flat list of all 16 milestones, sorted by year ascending, same-year ties broken by branch order (Hab. Blandas → Oficio → Estudios Formales). No per-branch accordions. Each item color-coded by branch accent. 3-chip legend above the list. Terminal "Full Stack Developer"/"Desarrollador Full Stack" card at the end.

| Scenario | Given | When | Then |
|---|---|---|---|
| 16 sorted items | 3 branch arrays (5+4+7) | merged and sorted | exactly 16 items, ascending year |
| Same-year tie-break | 2008 shared by Hab. Blandas "Scout" and Oficio "Taller Metalmecánico" | merged and sorted | "Scout" precedes "Taller Metalmecánico" |
| No accordions below `md` | section renders below `md` | inspected | no per-branch collapse/expand controls; single list only |
| Legend + terminal card | merged mobile timeline | rendered | 3-chip legend above list; terminal EN/ES card is the last item |

## Capability: `career-trajectory` — Accessibility

### Requirement: Motion and semantics
Convergence graphic is `aria-hidden`. Section inherits `prefers-reduced-motion` from `SectionWrapper`. Accordion toggles are keyboard-operable with `aria-expanded` reflecting state.

| Scenario | Given | When | Then |
|---|---|---|---|
| Reduced motion respected | user has `prefers-reduced-motion: reduce` | section enters viewport | entrance animations suppressed per `SectionWrapper` |
| Accordion keyboard operable | branch toggle button, `md+` | focused, activated via Enter/Space | toggles state; `aria-expanded` updates |

## Capability: `career-trajectory` — Navigation

### Requirement: Stable anchor id, relabeled EN text
Section keeps `id="experience"`. Scrollspy resolves `#experience` unchanged. EN nav label → "Journey"; ES stays "Trayectoria".

| Scenario | Given | When | Then |
|---|---|---|---|
| Scrollspy still highlights | section enters viewport while scrolling | `IntersectionObserver` fires | nav link `href="#experience"` marked active, both locales |
| Labels correct | EN/ES `navLinks` | entry with `href="#experience"` read | EN label = "Journey", ES label = "Trayectoria" |

## Capability: `dev-testing-setup` (NEW)

### Requirement: Test runner available and green
`pnpm test` script exists (Vitest + Testing Library, installed via pnpm) and exits 0 on a clean checkout.

| Scenario | Given | When | Then |
|---|---|---|---|
| Test command passes | clean checkout, `pnpm install` done | `pnpm test` runs | exits 0, includes tests below |

### Requirement: Coverage for new pure logic and rendering
Merge/sort helper has unit tests for order, tie-break, and count. `TimelineNode` has a test for icon-in-dot rendering with and without the `icon` prop.

| Scenario | Given | When | Then |
|---|---|---|---|
| Merge/sort unit test | 3 branch arrays w/ 2008 overlap (per content.md) | helper tested directly | asserts full ascending order + correct 2008 tie-break |
| Icon-in-dot render test | `TimelineNode` with `icon="scout"` | rendered via Testing Library | icon SVG present in dot; renders cleanly without `icon` too |

## Out of Scope (non-goals — do not flag as defects)

| Item | Status |
|---|---|
| Hero-style hardcoded per-node SVG, dual coordinate sets | Rejected; graphic is decorative-only, single viewBox |
| Milestone photo/thumbnail usage | `photoUrl` stays optional, unused |
| Hero/About/Skills/Projects/Certifications/Contact changes | Untouched |
| Icon libraries (e.g. MUI Timeline) | Rejected; hand-authored inline SVG only |
| "Ver más" detail modal (files/photos/video) | Deferred change; no speculative `Milestone` fields |
| `#experience` → `#journey` id rename | Rejected; keeps scrollspy stable |

## Slice Mapping (traceability only)

| Slice | Requirements |
|---|---|
| 0 | `dev-testing-setup` |
| 1 | Data model, Content correctness, Navigation |
| 2 | Icon/color prop groundwork (supports rendering + icon-in-dot test) |
| 3 | Desktop, Mobile, Accessibility |

Maps 1:1 to proposal.md `Success Criteria` (8 checkboxes).
