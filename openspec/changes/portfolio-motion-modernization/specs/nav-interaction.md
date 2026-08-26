# Spec: Nav Interaction

Change: `portfolio-motion-modernization` · Phase: `sdd-spec` · Store: hybrid

## Capability: `nav-interaction` (NEW)

### Requirement: Scroll-reactive header state
The header MUST toggle a visually distinct "scrolled" state (blur + shadow) once vertical scroll position crosses a fixed threshold, and MUST revert below it.

| Scenario | Given | When | Then |
|---|---|---|---|
| Crosses threshold | header at top of page (`scrollY = 0`) | user scrolls past the threshold | header applies blur/shadow classes |
| Reverts below threshold | header in scrolled state | user scrolls back above the threshold | header removes blur/shadow classes |
| No flicker at boundary | scroll position oscillates right at the threshold | scroll events fire repeatedly | state toggles cleanly, no rapid class thrashing beyond one toggle per crossing |

### Requirement: Animated active-section indicator with independent desktop/mobile scopes
An active-link indicator MUST animate its position via `layoutId` **only within the link list where the active link currently lives**. Desktop and mobile link lists MUST use two distinct `layoutId` values so the indicator never animates across lists.

| Scenario | Given | When | Then |
|---|---|---|---|
| Desktop indicator slides | desktop nav visible, "About" active | user clicks "Projects" | indicator animates from "About" to "Projects" within the desktop list only |
| Mobile indicator slides | mobile menu open, "About" active | user taps "Projects" | indicator animates within the mobile list only |
| No cross-list jump | mobile menu opens while desktop nav is also mounted | active section changes | desktop indicator and mobile indicator animate independently; neither jumps from the other list's prior position |
| Distinct layoutId values | desktop and mobile indicator elements inspected | rendered simultaneously (e.g. wide viewport with menu forced open) | desktop element has a different `layoutId` than the mobile element |

### Requirement: Animated mobile menu open/close
The mobile menu MUST animate open and closed (height + opacity transition) via `AnimatePresence`, rather than mounting/unmounting instantly.

| Scenario | Given | When | Then |
|---|---|---|---|
| Opens with transition | mobile menu closed | user opens the menu | menu animates height `0 → auto` and opacity `0 → 1` |
| Closes with transition | mobile menu open | user closes the menu | menu animates height/opacity back to closed before unmounting (exit animation completes, no instant disappearance) |
| Cleans up on route/link click | mobile menu open | user taps a nav link | menu plays its exit animation and closes |
