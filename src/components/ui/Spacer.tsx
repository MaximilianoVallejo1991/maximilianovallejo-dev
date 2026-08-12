import type { BranchAccentKey } from "../../lib/branchAccent";
import { BRANCH_ACCENT } from "../../lib/branchAccent";

interface SpacerProps {
  /** Pixel height on the shared temporal scale; may be 0 for same-year pairs. */
  height: number;
  dataYearFrom: number;
  dataYearTo: number;
  id?: string;
  /** True when this spacer should be illuminated (hovered milestone lit it up). */
  highlighted?: boolean;
  /** Branch accent used for the highlight color; defaults to the generic accent. */
  accentKey?: BranchAccentKey;
  /**
   * Pixel offset from the top of the parent `<ol>` (which must be
   * `position: relative`). Since this element is now `position: absolute`,
   * it no longer flows after the previous `TimelineNode`'s text — the
   * caller must supply the exact vertical position so the connector line
   * starts where the previous node ends, not wherever flow layout left it.
   */
  top?: number;
}

/**
 * Measured block between two milestones on the timeline. Carries the
 * temporal data (`data-year-from`/`data-year-to`) and stays fully invisible
 * (transparent border, no background) while idle; `highlighted` lights up
 * only the left border in the branch accent color — no background fill at
 * any state. Its left border is offset with `ml-[11px]` to align with the
 * parent `<ol>`'s connector rail (`absolute left-[11px]` in `Experience.tsx`).
 *
 * Positioned `absolute` (not `relative`) so it does not flow after the
 * preceding `TimelineNode`'s `<li>` — flow position would start the line
 * below that node's text instead of at its calculated year position.
 * `top` places it exactly; `left: 0` keeps the border-left pinned to the
 * column's left edge regardless of the `<li>` wrapper's own box.
 */
export function Spacer({
  height,
  dataYearFrom,
  dataYearTo,
  id,
  highlighted = false,
  accentKey = "accent",
  top,
}: SpacerProps) {
  const accent = BRANCH_ACCENT[accentKey];

  return (
    <div
      data-testid="spacer"
      // ml-[11px] aligns this element's left border with the connector rail
      // (`absolute left-[11px]` in Experience.tsx) so the highlighted state
      // overlays the rail exactly instead of drifting under the dot column.
      className={`absolute ml-[11px] border-l-2 bg-transparent transition-colors duration-200 ${
        highlighted ? accent.ring : "border-transparent"
      }`}
      style={{
        height: `${height}px`,
        top: top ? `${top}px` : "0",
        left: 0,
      }}
      data-year-from={dataYearFrom}
      data-year-to={dataYearTo}
      data-id={id}
      data-highlighted={highlighted || undefined}
    />
  );
}
