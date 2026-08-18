import type { BranchAccentKey } from "../../lib/branchAccent";
import { BRANCH_ACCENT } from "../../lib/branchAccent";
import { getHighlightPlanFromSpacer, type TimelineItem } from "../../lib/timelineScale";

interface SpacerProps {
  /** Pixel height on the shared temporal scale; may be 0 for same-year pairs. */
  height: number;
  dataYearFrom: number;
  dataYearTo: number;
  id?: string;
  /**
   * Illuminated when defined (a hovered milestone, or this spacer itself,
   * lit it up); the value is the CSS transition-delay (ms) for the
   * traveling-light animation — 0 lights immediately, higher values light
   * later as the "wave" travels from the hover origin toward this segment.
   * `undefined` means idle/not highlighted.
   */
  highlightDelayMs?: number;
  /**
   * Overrides whether this segment renders as highlighted right now,
   * decoupled from `highlightDelayMs` — defaults to
   * `highlightDelayMs !== undefined` when omitted. Needed for the
   * auto-fade-off animation: a sweep in its "fading" phase still needs
   * `highlightDelayMs` to carry the SAME delay it lit up with (so the
   * transition back to idle waits the same amount, retracing the wave in
   * the same order), while `highlighted` itself has already flipped to
   * `false`.
   */
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
  /** Full item list of the branch/merged list this spacer belongs to — required to resolve which milestone(s) light up on hover (the reverse of TimelineNode's own hover). */
  items?: TimelineItem[];
  /** Called with the hover animation plan (spacer id -> delay step, milestone id -> delay step) on hover, or empty maps on mouse leave. */
  onHover?: (spacerSteps: Map<string, number>, milestoneSteps: Map<string, number>) => void;
}

/**
 * Measured block between two milestones on the timeline. Carries the
 * temporal data (`data-year-from`/`data-year-to`) and stays fully invisible
 * (transparent border, no background) while idle; a defined
 * `highlightDelayMs` lights up only the left border in the branch accent
 * color — no background fill at any state.
 *
 * Structured as a WIDE invisible hit-target (`w-6`, matching the dot's own
 * width) containing a precisely-offset thin visual line (`left-[11px]
 * border-l-2`) — a bare 2px-wide border is impractical to hover with a real
 * mouse, but the visual line still has to land exactly on `left-[11px]` to
 * align with the parent `<ol>`'s connector rail (`absolute left-[11px]` in
 * `Experience.tsx`). Hovering anywhere in the wide outer box lights up both
 * this segment and, via `onHover`, the whole path (segments + milestone)
 * that claims it, staggered by `HIGHLIGHT_STEP_DELAY_MS` per step.
 *
 * Positioned `absolute` (not `relative`) so it does not flow after the
 * preceding `TimelineNode`'s `<li>` — flow position would start the line
 * below that node's text instead of at its calculated year position.
 * `top` places it exactly; `left: 0` keeps it pinned to the column's left
 * edge regardless of the `<li>` wrapper's own box.
 */
export function Spacer({
  height,
  dataYearFrom,
  dataYearTo,
  id,
  highlightDelayMs,
  highlighted: highlightedProp,
  accentKey = "accent",
  top,
  items,
  onHover,
}: SpacerProps) {
  const accent = BRANCH_ACCENT[accentKey];
  const highlighted = highlightedProp ?? highlightDelayMs !== undefined;

  const handleMouseEnter = () => {
    if (!onHover || !id || !items) return;
    const plan = getHighlightPlanFromSpacer(id, items);
    onHover(plan.spacers, plan.milestones);
  };

  const handleMouseLeave = () => {
    if (!onHover) return;
    onHover(new Map(), new Map());
  };

  return (
    <div
      data-testid="spacer"
      className="absolute left-0 w-6 bg-transparent"
      style={{
        height: `${height}px`,
        top: top ? `${top}px` : "0",
      }}
      data-year-from={dataYearFrom}
      data-year-to={dataYearTo}
      data-id={id}
      data-highlighted={highlighted || undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        data-testid="spacer-line"
        className={`absolute inset-y-0 left-[11px] border-l-2 transition-colors duration-200 ${
          highlighted ? accent.ring : "border-transparent"
        }`}
        // Keyed off highlightDelayMs (not `highlighted`) — the delay must
        // stay attached even while `highlighted` is false during an
        // auto-fade-off, so the transition back to idle still waits the
        // right amount instead of snapping instantly.
        style={{
          transitionDelay: highlightDelayMs !== undefined ? `${highlightDelayMs}ms` : "0ms",
        }}
      />
    </div>
  );
}
