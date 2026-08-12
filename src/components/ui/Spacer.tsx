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
}

/**
 * Measured block between two milestones on the timeline. Carries the
 * temporal data (`data-year-from`/`data-year-to`) and stays fully invisible
 * (transparent border, no background) while idle; `highlighted` lights up
 * only the left border in the branch accent color — no background fill at
 * any state. Its left border is offset with `ml-[11px]` to align with the
 * parent `<ol>`'s connector rail (`absolute left-[11px]` in `Experience.tsx`).
 */
export function Spacer({
  height,
  dataYearFrom,
  dataYearTo,
  id,
  highlighted = false,
  accentKey = "accent",
}: SpacerProps) {
  const accent = BRANCH_ACCENT[accentKey];

  return (
    <div
      data-testid="spacer"
      // ml-[11px] aligns this element's left border with the connector rail
      // (`absolute left-[11px]` in Experience.tsx) so the highlighted state
      // overlays the rail exactly instead of drifting under the dot column.
      className={`relative ml-[11px] border-l-2 bg-transparent transition-colors duration-200 ${
        highlighted ? accent.ring : "border-transparent"
      }`}
      style={{ height: `${height}px` }}
      data-year-from={dataYearFrom}
      data-year-to={dataYearTo}
      data-id={id}
      data-highlighted={highlighted || undefined}
    />
  );
}
