# Spec: Interaction Motion

Change: `portfolio-motion-modernization` · Phase: `sdd-spec` · Store: hybrid

## Capability: `interaction-motion` (NEW)

### Requirement: Theme toggle icon morph
`ThemeToggle` MUST crossfade between sun and moon icons using opacity, rotate, and scale — not an instant swap.

| Scenario | Given | When | Then |
|---|---|---|---|
| Crossfade on toggle | light theme active, moon icon hidden | user clicks the toggle | sun icon fades/rotates/scales out while moon icon fades/rotates/scales in |
| Both icons present in DOM during transition | toggle mid-animation | inspected | both icon elements exist, absolutely positioned, differentiated by opacity |
| Reversible | dark theme active | user clicks the toggle again | moon → sun crossfade plays symmetrically |

### Requirement: Hero line-stagger reveal
`Hero.tsx` MUST reveal the greeting, name, and subtitle as separate lines with a staggered delay, on **both** the desktop and mobile SVG blocks, in **both** supported locales, without recomputing SVG coordinates.

| Scenario | Given | When | Then |
|---|---|---|---|
| Desktop stagger | desktop viewport, EN locale | Hero mounts | greeting, name, subtitle reveal in sequence with increasing delay |
| Mobile stagger | mobile viewport, ES locale | Hero mounts | greeting, name, subtitle reveal in sequence with increasing delay |
| Coordinates unchanged | Hero SVG viewBox before/after change | compared | `<text>` x/y coordinates are identical; only wrapping element/animation changed |
| Both locales covered | EN and ES Hero content | mounted | stagger behavior is present in both, using each locale's own text |

### Requirement: Card hover lift is transform/opacity only
`CertCard` and `ProjectCard` MUST apply a hover lift (`y: -4, scale: 1.02`) using only transform and opacity properties. `box-shadow` MUST NOT be added as part of the hover state.

| Scenario | Given | When | Then |
|---|---|---|---|
| Lift applies on hover | `CertCard` or `ProjectCard` at rest | user hovers | element translates up 4px and scales to 1.02 |
| No box-shadow introduced | hovered card's computed styles | inspected | no new `box-shadow` value is present versus the resting state |
| Composes with existing image scale | `ProjectCard` with `group-hover:scale-105` on inner image | user hovers the card | card-level lift and inner image scale both apply without visual conflict (e.g. clipping/overflow issues) |
| Returns to rest on hover-out | card lifted state | pointer leaves the card | card returns to `y: 0, scale: 1` |
