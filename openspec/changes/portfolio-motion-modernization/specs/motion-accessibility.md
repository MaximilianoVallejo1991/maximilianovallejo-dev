# Spec: Motion Accessibility

Change: `portfolio-motion-modernization` · Phase: `sdd-spec` · Store: hybrid

## Capability: `motion-accessibility` (NEW)

Cross-cutting `prefers-reduced-motion` compliance (WCAG 2.2.2) across autoplay, hover, icon rotation, and reveal animations. Each requirement below is independently testable — reduced-motion handling MUST NOT be scoped as a side note of another capability's implementation.

### Requirement: Carousel autoplay MUST be suppressed under reduced motion
`SkillCarousel` autoplay MUST NOT advance slides when `prefers-reduced-motion: reduce` is active. Manual controls MUST remain fully functional regardless of the motion preference.

| Scenario | Given | When | Then |
|---|---|---|---|
| Autoplay suppressed | `prefers-reduced-motion: reduce` is set | `SkillCarousel` mounts and is in view | autoplay interval does not advance slides |
| Manual controls unaffected | `prefers-reduced-motion: reduce` is set | user clicks an arrow, dot, or uses wheel/touch/keyboard nav | slide changes exactly as it would with motion enabled |
| Autoplay runs without the preference | `prefers-reduced-motion: no-preference` | `SkillCarousel` mounts and is in view | autoplay advances slides on its interval |

### Requirement: Card hover lift MUST be suppressed under reduced motion
`whileHover` transform lift on `CertCard` / `ProjectCard` MUST be gated off when `prefers-reduced-motion: reduce` is active.

| Scenario | Given | When | Then |
|---|---|---|---|
| Lift suppressed | `prefers-reduced-motion: reduce` is set | user hovers a `CertCard` or `ProjectCard` | no `y`/`scale` transform is applied |
| Lift applies without the preference | `prefers-reduced-motion: no-preference` | user hovers a `CertCard` or `ProjectCard` | `y: -4, scale: 1.02` transform is applied |

### Requirement: Theme-toggle rotation MUST be gated; crossfade MAY still occur
The sun/moon icon rotation component of the morph MUST be suppressed under reduced motion. The opacity crossfade MAY still play (it is not a vestibular-trigger motion pattern).

| Scenario | Given | When | Then |
|---|---|---|---|
| Rotation suppressed | `prefers-reduced-motion: reduce` is set | user toggles the theme | icon swap has no rotate/scale transform |
| Crossfade still allowed | `prefers-reduced-motion: reduce` is set | user toggles the theme | opacity crossfade between icons may still animate |
| Full morph without the preference | `prefers-reduced-motion: no-preference` | user toggles the theme | icon swap plays opacity + rotate + scale crossfade |

### Requirement: Nav active-indicator slide MUST respect reduced motion
The `layoutId`-driven slide transition of the active-link indicator (desktop and mobile) MUST be suppressed under `prefers-reduced-motion: reduce` — the indicator still renders at the active link, but its movement between links MUST NOT be animated.

| Scenario | Given | When | Then |
|---|---|---|---|
| Slide suppressed | `prefers-reduced-motion: reduce` is set | active section changes | indicator appears at the new active link without an animated slide |
| Slide plays without the preference | `prefers-reduced-motion: no-preference` | active section changes | indicator animates its position between links |

### Requirement: Hero reveal MUST respect reduced motion
The line-level stagger reveal in `Hero.tsx` MUST be suppressed (or reduced to an instant/opacity-only state) when `prefers-reduced-motion: reduce` is active, consistent with `SectionWrapper`'s existing reduced-motion convention.

| Scenario | Given | When | Then |
|---|---|---|---|
| Stagger suppressed | `prefers-reduced-motion: reduce` is set | Hero section mounts | greeting/name/subtitle lines render without staggered motion transforms |
| Stagger plays without the preference | `prefers-reduced-motion: no-preference` | Hero section mounts | lines reveal in staggered sequence |
