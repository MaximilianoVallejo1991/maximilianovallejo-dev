import { useEffect, useState } from "react";
import { useContent } from "../../hooks/useContent";
import SectionWrapper from "../ui/SectionWrapper";
import TimelineNode from "../ui/TimelineNode";
import { Spacer } from "../ui/Spacer";
import ConvergenceGraphic from "../ui/ConvergenceGraphic";
import DivergenceGraphic from "../ui/DivergenceGraphic";
import IconMap from "../ui/IconMap";
import { BRANCH_ACCENT } from "../../lib/branchAccent";
import { mergeMilestonesByYear } from "../../lib/mergeMilestonesByYear";
import {
  resolveYear,
  getBranchLayout,
  buildTimelineWithSpacers,
  enforceMinimumMilestoneGap,
  getTimelineHeight,
  getBranchSweepPlan,
  HIGHLIGHT_STEP_DELAY_MS,
  SAME_YEAR_SPACER_HEIGHT_PX,
} from "../../lib/timelineScale";
import { motion, useReducedMotion } from "motion/react";
import { fadeInItem } from "../ui/SectionWrapper";

/** Converts a hover-plan step map (id -> 0-indexed step) into a delay-ms
 * map (id -> milliseconds), for the traveling-light hover animation. */
function toDelayMs(steps: Map<string, number>): Map<string, number> {
  return new Map(Array.from(steps, ([id, step]) => [id, step * HIGHLIGHT_STEP_DELAY_MS]));
}

/** Whichever delay fires SOONER wins when both a hover-driven and a
 * click-driven ("sweep the whole branch") animation could apply to the
 * same item at once. */
function minDelay(a: number | undefined, b: number | undefined): number | undefined {
  if (a === undefined) return b;
  if (b === undefined) return a;
  return Math.min(a, b);
}

/**
 * Combines a hover-driven delay with a sweep-driven one into what
 * TimelineNode/Spacer need: the delay to use for BOTH lighting up and
 * (during an auto-fade-off) fading back out, plus whether it should
 * currently render as lit. Hover always lights regardless of `sweepLit` —
 * only the sweep's own contribution is gated, so hovering a node while an
 * unrelated sweep happens to be mid-fade still works normally. The delay
 * itself stays defined (from whichever source has it) even while
 * `sweepLit` is false, so the fade-off transition still waits the same
 * amount the fade-on did instead of snapping off instantly.
 */
function combinedHighlight(
  hoverDelayMs: number | undefined,
  sweepDelayMs: number | undefined,
  sweepLit: boolean,
): { delayMs: number | undefined; highlighted: boolean } {
  return {
    delayMs: minDelay(hoverDelayMs, sweepDelayMs),
    highlighted: hoverDelayMs !== undefined || (sweepDelayMs !== undefined && sweepLit),
  };
}

/** Total time (ms) for a "sweep the whole branch" click animation to go
 * from the first milestone to the last — fixed regardless of how many
 * years that branch spans, so a short and a long branch both feel equally
 * smooth (see getBranchSweepPlan's own doc for why this isn't
 * HIGHLIGHT_STEP_DELAY_MS-based). */
const BRANCH_SWEEP_DURATION_MS = 1000;
/** Same idea, but for sweeping all 3 branches at once from the origin
 * node/name — deliberately slower than a single branch, so the "whole
 * story at once" moment reads as unhurried rather than a rushed flash. */
const ALL_BRANCHES_SWEEP_DURATION_MS = 1600;
/** How long a sweep stays fully lit, after its "turning on" wave finishes,
 * before it starts auto-fading back off — long enough to actually read the
 * lit branch, short enough that it doesn't feel stuck on. */
const SWEEP_HOLD_MS = 500;
/** Matches every `transition-colors duration-300` used for these highlight
 * elements. Added as a buffer after the fade-off wave's own duration before
 * the sweep target is cleared entirely — clearing it resets each element's
 * transition-delay back to "0ms", which must only happen once the LAST
 * item's own fade-off transition (the one with the largest delay) has
 * actually finished, not at the exact instant it was due to start. */
const CSS_TRANSITION_DURATION_MS = 300;

/** What a click on the divergence graphic/labels currently has swept:
 * a single branch (its key), every branch at once ("all"), or nothing. */
type SweepTarget = string | "all" | null;

// Flat header-row allowance applied uniformly to every column (icon + <h3>
// row above the rail) — not year-based, since every branch's items now
// already start at the shared globalMinYear origin internally (see
// getBranchLayout's leading-spacer synthesis). Also doubles as the exact
// distance the rail line (below) is extended upward, so it starts right at
// the header node's bottom edge instead of floating below an empty gap.
const HEADER_OFFSET_PX = 24;

// Small deliberate vertical stub between the header node and the
// DivergenceGraphic's fan-line endpoint above it — a visible connector, not
// just "no gap". Touches both ends by construction (see the div using it):
// its top sits flush at the column's own top edge (= the SVG's bottom edge,
// which BRANCH_CIRCLE_BOTTOM_MARGIN in DivergenceGraphic sets to exactly
// the endpoint circle's own radius, so the two touch at ANY viewport width
// despite one being SVG-viewBox-scaled and the other a fixed HTML px), and
// its bottom sits flush against the header node (next flow sibling).
const TOP_CONNECTOR_PX = 50;

// The endpoint circles in Convergence/DivergenceGraphic sit flush on their
// SVG's edge via margin === radius (see BRANCH_CIRCLE_TOP_MARGIN /
// BRANCH_CIRCLE_BOTTOM_MARGIN there) — geometrically zero gap, but a circle
// that only grazes an edge at a single tangent point antialiases to almost
// no coverage right at that point, so it visually reads as a small gap even
// though the boxes truly touch. Fix lives here, not in the SVGs: extend the
// HTML separator lines (top connector above, rail "tail" below) a few px
// PAST their own box, into the SVG's rendered area. Both live inside a
// `position: relative` ancestor (the header node's connector / the branch
// column), so per normal CSS stacking they paint OVER the non-positioned
// SVG beneath/above them regardless of DOM order — bridging the weak
// antialiased sliver with solid color instead of touching the SVG's own
// (tested, viewport-scale-invariant) margin math.
const TANGENT_BRIDGE_PX = 10;

// One-time, non-compounding buffer added once to the tallest branch's real
// height so the very last node's real text (title/description, possibly a
// photo) has breathing room before whatever renders below the column
// (the convergence graphic). Deliberately NOT applied per-node — that was
// the bug in the removed ESTIMATED_MILESTONE_HEIGHT_PX approach, which
// guessed at every node's height and compounded drift down each column.
const LAST_NODE_BREATHING_ROOM_PX = 130;

// Mobile only: floor passed to enforceMinimumMilestoneGap for the merged
// list — deliberately a bit MORE than SAME_YEAR_SPACER_HEIGHT_PX (not that
// value directly). SAME_YEAR_SPACER_HEIGHT_PX was measured against
// same-year pairs, which tend to be brief; a COMPRESSED_YEAR_RANGES gap
// bridges two FULL milestone blocks (real title + description on both
// sides), so it needs more slack. Confirmed by measurement: at exactly
// SAME_YEAR_SPACER_HEIGHT_PX (100px) the tightest real case (2011 Ciclo
// Básico -> 2015 Instructor Scout) left only ~1px of clearance — technically
// no longer overlapping, but thin enough that a bigger font or a slightly
// longer translation could tip it back into collision.
const MOBILE_MIN_MILESTONE_GAP_PX = SAME_YEAR_SPACER_HEIGHT_PX + 20;

// Mobile only: vertical gap between the last real milestone in the merged
// list and the convergence node rendered right below it. Without this,
// convergence sat at `top: mobileTotalHeight` — but buildTimelineWithSpacers
// never appends a trailing spacer after the LAST milestone (there's no
// "next" item to build one towards), so that last milestone's own `top` is
// ALSO exactly `mobileTotalHeight`: the two nodes shared one coordinate and
// rendered stacked directly on top of each other instead of one below the
// other. Reuses LAST_NODE_BREATHING_ROOM_PX's own value (not a smaller
// number) for the same reason that constant exists in the first place: the
// last milestone's real (possibly multi-line) title/description can render
// up to that far below its own `top`, so anything less would still
// visually collide with that trailing text even once the coordinates
// themselves no longer match.
const CONVERGENCE_NODE_GAP_PX = LAST_NODE_BREATHING_ROOM_PX;
// Breathing room below convergence itself, inside the `<ol>`'s own height —
// convergence is a single short line (no description), so it needs much
// less than LAST_NODE_BREATHING_ROOM_PX, just enough that its own text
// isn't flush against the container's bottom edge.
const CONVERGENCE_NODE_TRAILING_ROOM_PX = 40;

// Mobile-only: branches whose own "present" milestone becomes redundant once
// forced adjacent to the other branches' "present" milestones AND the
// convergence node, purely a side-effect of merging 3 independent timelines
// into ONE chronological list (see mergeMilestonesByYear — everything
// without a 4-digit year sorts last and ties break by branch order, so all
// "present" milestones land back-to-back right before convergence). On
// desktop each branch is its own column, never adjacent to the others', so
// this redundancy never exists there — this filter is intentionally mobile-
// only, never applied to the desktop columns or the underlying data.
const MOBILE_HIDDEN_PRESENT_BRANCHES = new Set(["soft", "trade"]);

export default function Experience() {
  const content = useContent();
  const { experience } = content;
  const prefersReducedMotion = useReducedMotion();

  // Spacer id -> delay ms, and milestone id -> delay ms, for the currently
  // hovered milestone OR spacer's traveling-light animation (hovering a
  // node never highlights other nodes, only its own reachable spacers).
  // Desktop and mobile timelines track their own hover state independently.
  const [desktopHighlighted, setDesktopHighlighted] = useState<Map<string, number>>(new Map());
  const [desktopHighlightedNodes, setDesktopHighlightedNodes] = useState<Map<string, number>>(
    new Map(),
  );
  const [mobileHighlighted, setMobileHighlighted] = useState<Map<string, number>>(new Map());
  const [mobileHighlightedNodes, setMobileHighlightedNodes] = useState<Map<string, number>>(
    new Map(),
  );
  // What's currently toggled into a full top-to-bottom "sweep": a single
  // branch (clicking its label or its divergence-graphic line), every
  // branch at once (clicking the origin node/name), or nothing. Only one
  // target sweeps at a time; clicking the currently-active trigger again
  // clears it, and clicking a different trigger switches to that one.
  const [desktopSweepTarget, setDesktopSweepTarget] = useState<SweepTarget>(null);
  // Whether the current sweep target should render LIT right now — separate
  // from `desktopSweepTarget` itself so the auto-fade-off (below) can flip
  // this back to false while the target (and its per-item delays, from
  // sweepPlansByBranch) stays in place. Every lit/unlit decision below
  // reuses those SAME per-item delays for both directions, so turning off
  // replays the exact order things turned on in, instead of snapping off
  // all at once.
  const [desktopSweepLit, setDesktopSweepLit] = useState(true);

  const toggleBranchSweep = (branchKey: string) => {
    setDesktopSweepTarget((current) => (current === branchKey ? null : branchKey));
    setDesktopSweepLit(true);
  };
  const toggleAllSweep = () => {
    setDesktopSweepTarget((current) => (current === "all" ? null : "all"));
    setDesktopSweepLit(true);
  };

  // Auto-fade: once a sweep finishes lighting (its own on-wave duration),
  // hold fully lit for SWEEP_HOLD_MS, then flip `desktopSweepLit` off — every
  // item transitions back to idle after its OWN same delay, so the wave
  // retraces itself in the same order it lit up in. Once that off-wave has
  // also had time to finish, clear the target entirely so a fresh click
  // starts clean. Re-running whenever the target changes cancels any
  // in-flight timers from the previous target (React's effect cleanup) —
  // clicking a different branch mid-fade abandons the old sequence instead
  // of racing it.
  useEffect(() => {
    if (!desktopSweepTarget) return;
    const onWaveMs =
      desktopSweepTarget === "all" ? ALL_BRANCHES_SWEEP_DURATION_MS : BRANCH_SWEEP_DURATION_MS;
    const fadeTimer = setTimeout(() => setDesktopSweepLit(false), onWaveMs + SWEEP_HOLD_MS);
    const clearTimer = setTimeout(
      () => setDesktopSweepTarget(null),
      onWaveMs + SWEEP_HOLD_MS + onWaveMs + CSS_TRANSITION_DURATION_MS,
    );
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(clearTimer);
    };
  }, [desktopSweepTarget]);

  // Mobile's own sweep target/lit pair — same shape and same auto-fade-off
  // behavior as the desktop one above, but tracked independently: the merged
  // single-column mobile timeline has no columns/divergence graphic to click,
  // so it gets its own two triggers instead (see the mobile JSX below):
  // tapping the origin node sweeps the WHOLE merged list top-to-bottom
  // ("all"), tapping a legend chip isolates just that branch's own
  // milestones (branchKey).
  const [mobileSweepTarget, setMobileSweepTarget] = useState<SweepTarget>(null);
  const [mobileSweepLit, setMobileSweepLit] = useState(true);

  const toggleMobileBranchSweep = (branchKey: string) => {
    setMobileSweepTarget((current) => (current === branchKey ? null : branchKey));
    setMobileSweepLit(true);
  };
  const toggleMobileAllSweep = () => {
    setMobileSweepTarget((current) => (current === "all" ? null : "all"));
    setMobileSweepLit(true);
  };

  useEffect(() => {
    if (!mobileSweepTarget) return;
    const onWaveMs =
      mobileSweepTarget === "all" ? ALL_BRANCHES_SWEEP_DURATION_MS : BRANCH_SWEEP_DURATION_MS;
    const fadeTimer = setTimeout(() => setMobileSweepLit(false), onWaveMs + SWEEP_HOLD_MS);
    const clearTimer = setTimeout(
      () => setMobileSweepTarget(null),
      onWaveMs + SWEEP_HOLD_MS + onWaveMs + CSS_TRANSITION_DURATION_MS,
    );
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(clearTimer);
    };
  }, [mobileSweepTarget]);

  const branchIconByKey = Object.fromEntries(
    experience.branches.map((branch) => [branch.branchKey, branch.icon]),
  );

  // Shared temporal scale: every branch (and the mobile merged list) is
  // positioned relative to the earliest year across all branches.
  const globalMinYear = Math.min(
    ...experience.branches.map((branch) => resolveYear(branch.milestones[0].year)),
  );

  const branchLayouts = experience.branches.map((branch) =>
    getBranchLayout(branch, globalMinYear, experience.presentLabel),
  );
  // Every column is padded to the tallest branch's real height so all 3
  // rails end at the same point before ConvergenceGraphic draws them
  // converging into one shared point below.
  const maxBranchHeight = Math.max(...branchLayouts.map((layout) => layout.height));
  const branchEndOffsets = branchLayouts.map(() => maxBranchHeight);

  const merged = mergeMilestonesByYear(experience.branches);
  // See MOBILE_HIDDEN_PRESENT_BRANCHES's own doc — drops the redundant
  // "present" milestones for soft/trade from the MOBILE list only; `merged`
  // itself (used by desktop's per-branch layouts above) stays untouched.
  const mobileMerged = merged.filter(
    (m) => !(MOBILE_HIDDEN_PRESENT_BRANCHES.has(m.branchKey) && m.milestone.year === experience.presentLabel),
  );
  // enforceMinimumMilestoneGap: see its own doc — a COMPRESSED_YEAR_RANGES
  // stretch that lands as the ENTIRE gap between two milestones from
  // different branches (only possible in this merged mobile list, never on
  // desktop's own per-branch columns) can compress well below what two real
  // milestone text blocks need, causing them to visually collide even
  // though their `top` coordinates are correctly distinct.
  const mobileItems = enforceMinimumMilestoneGap(
    buildTimelineWithSpacers(mobileMerged.map((m) => m.milestone)),
    MOBILE_MIN_MILESTONE_GAP_PX,
  );
  const mobileTotalHeight = getTimelineHeight(mobileItems);
  // Mobile sweep plan: proportional-to-top delays across the WHOLE merged
  // list (one shared physical rail, so the wave always travels its real
  // length regardless of which target is active) — see the mobile JSX for
  // how "all" vs a specific branchKey differ in which items actually render
  // lit vs merely timed.
  const mobileSweepDurationMs =
    mobileSweepTarget === "all" ? ALL_BRANCHES_SWEEP_DURATION_MS : BRANCH_SWEEP_DURATION_MS;
  const mobileSweepPlan = mobileSweepTarget
    ? getBranchSweepPlan(mobileItems, mobileTotalHeight, mobileSweepDurationMs)
    : null;

  // Which branches are currently sweeping, and the per-branch plan for
  // each — "all" sweeps every branch (each independently, all starting at
  // once), a specific branchKey sweeps just that one.
  const sweepingBranchKeys =
    desktopSweepTarget === "all"
      ? experience.branches.map((b) => b.branchKey)
      : desktopSweepTarget
        ? [desktopSweepTarget]
        : [];
  const sweepDurationMs =
    desktopSweepTarget === "all" ? ALL_BRANCHES_SWEEP_DURATION_MS : BRANCH_SWEEP_DURATION_MS;
  const sweepPlansByBranch = new Map(
    sweepingBranchKeys.map((key) => {
      const idx = experience.branches.findIndex((b) => b.branchKey === key);
      return [key, getBranchSweepPlan(branchLayouts[idx].items, branchLayouts[idx].height, sweepDurationMs)];
    }),
  );

  return (
    <SectionWrapper
      id="experience"
      // Extra bottom padding (vs. pt-20/pt-28 on top) — this section scrolls
      // internally (h-screen + overflow-y-auto, see index.css's note on
      // internally-scrolling snap slots), so pb equal to pt left almost no
      // internal scroll room to absorb the last bit of momentum before it
      // leaked into the outer page scroll and the mandatory snap yanked you
      // into the next section. More bottom padding = more internal scroll
      // distance to soak that up first. Same fix as Certifications.tsx.
      className="h-screen overflow-y-auto scrollbar-hidden mx-auto max-w-6xl px-4 pt-20 pb-40 md:pt-28 md:pb-56"
    >
      <motion.h2
        {...fadeInItem(0)}
        className="font-heading text-3xl font-bold text-primary md:text-4xl"
      >
        {content.navLinks.find((l) => l.href === "#experience")?.label}
      </motion.h2>

      {/* Desktop: 3-column layout, always expanded, shared temporal scale */}
      <div className="hidden md:block">
        <button type="button" onClick={toggleAllSweep} className="group mx-auto mt-10 mb-6 block">
          <p
            className={`text-center font-heading text-lg font-semibold text-primary transition-colors duration-200 ${BRANCH_ACCENT.accent.hoverText} ${
              desktopSweepTarget === "all" ? BRANCH_ACCENT.accent.activeHoverText : ""
            }`}
          >
            {experience.originLabel}
          </p>
        </button>
        <DivergenceGraphic
          activeIndex={
            desktopSweepTarget && desktopSweepTarget !== "all" && desktopSweepLit
              ? experience.branches.findIndex((b) => b.branchKey === desktopSweepTarget)
              : null
          }
          allActive={desktopSweepTarget === "all" && desktopSweepLit}
          onBranchClick={(index) => {
            const branch = experience.branches[index];
            if (branch) toggleBranchSweep(branch.branchKey);
          }}
          onOriginClick={toggleAllSweep}
        />
        {/* gap-x as a PERCENTAGE, not the usual fixed gap-8 (32px) — a fixed
            px gap makes each column's real start position an AFFINE (not
            purely proportional) function of the grid's own width, while
            BRANCH_RAIL_CX below assumes a purely proportional one (it's a
            viewBox-unit fraction, scaled uniformly by the SVGs). Those two
            disagree at any width other than the one BRANCH_RAIL_CX was
            calibrated against, and the error compounds most for the middle
            column (two gaps between it and either edge). A percentage gap
            keeps column starts proportional to the grid's width too, so one
            calibrated set of constants stays correct at every width. */}
        <div className="relative grid grid-cols-3 gap-y-8 gap-x-[2.857%]">
          {experience.branches.map((branch, branchIdx) => {
            const accent = BRANCH_ACCENT[branch.accentKey];
            const layout = branchLayouts[branchIdx];
            const branchSweepPlan = sweepPlansByBranch.get(branch.branchKey);
            return (
              <motion.div key={branch.branchKey} {...fadeInItem(branchIdx + 1)}>
                {/* Small vertical separator between the divergence graphic's
                    fan-line endpoint (sitting right above, at this column's
                    own top edge) and the header node below — see
                    TOP_CONNECTOR_PX's own doc for why both ends touch
                    pixel-exactly. Two layers, same idiom as the rail's own
                    "tail" below the last milestone: a neutral base line
                    that's always visible (so it reads as continuing the
                    rail even before any interaction), plus an accent
                    overlay that lights up during that branch's sweep — a
                    gray hairline butted against a bold colored circle
                    doesn't visually read as touching without this. */}
                <div
                  data-testid="branch-top-connector"
                  className="relative"
                  style={{ height: TOP_CONNECTOR_PX }}
                  aria-hidden="true"
                >
                  <div
                    className="absolute bottom-0 left-[11px] w-px bg-border"
                    style={{ top: -TANGENT_BRIDGE_PX }}
                  />
                  <div
                    className={`absolute bottom-0 left-[11px] border-l-2 transition-colors duration-300 ${
                      branchSweepPlan && desktopSweepLit ? accent.ring : "border-transparent"
                    }`}
                    style={{
                      top: -TANGENT_BRIDGE_PX,
                      // Fires immediately (not sweepDurationMs, unlike the
                      // tail below the last node) — this segment sits right
                      // after the header node and DivergenceGraphic's line,
                      // both of which light up instantly on click. It's the
                      // START of the sweep, not the end.
                      transitionDelay: "0ms",
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => toggleBranchSweep(branch.branchKey)}
                  className="group flex items-center gap-3 rounded"
                >
                  {/* Bigger, more prominent node than a plain icon — reads as
                      this branch's own origin marker sitting on the rail's
                      x-axis. -ml-1 recenters its wider (32px) box on the
                      same left-[11px] line the rail and every milestone dot
                      below share, instead of drifting right like a naive
                      same-left-edge box would. */}
                  <div
                    data-testid="branch-header-node"
                    className={`relative z-10 -ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-surface transition-shadow duration-200 ${accent.ring} ${accent.ringGlow} ${
                      (desktopSweepTarget === branch.branchKey || desktopSweepTarget === "all") &&
                      desktopSweepLit
                        ? accent.activeRingGlow
                        : ""
                    }`}
                  >
                    <IconMap name={branch.icon} className={`h-4 w-4 ${accent.text}`} />
                  </div>
                  <h3
                    className={`font-heading text-xl font-semibold text-primary transition-colors duration-200 ${accent.hoverText} ${
                      (desktopSweepTarget === branch.branchKey || desktopSweepTarget === "all") &&
                      desktopSweepLit
                        ? accent.activeHoverText
                        : ""
                    }`}
                  >
                    {branch.branchLabel}
                  </h3>
                </button>

                <div className="relative" style={{ marginTop: HEADER_OFFSET_PX }}>
                  {/* Single continuous connector rail for the whole column —
                      extended HEADER_OFFSET_PX upward (past this div's own
                      top, into the header's marginTop gap) so it starts
                      right at the header node's bottom edge above instead of
                      floating below an empty gap, AND extended
                      TANGENT_BRIDGE_PX downward past its own bottom, into
                      ConvergenceGraphic's rendered area — this gray line
                      (not the colored "tail" overlay below, which is
                      invisible while idle) is what's actually visible when
                      nothing is swept, so it needs the same tangent-bridge
                      overlap the tail gets for the lit state. One
                      continuous element, so there's no seam where it could
                      fail to touch. */}
                  <div
                    data-testid="branch-rail"
                    className="absolute left-[11px] w-px bg-border"
                    style={{ top: -HEADER_OFFSET_PX, bottom: -TANGENT_BRIDGE_PX }}
                    aria-hidden="true"
                  />
                  {/* Accent overlay for the HEADER_OFFSET_PX stretch above —
                      the base rail above never gets covered by a Spacer's
                      own overlay (Spacers only exist inside the <ol>, which
                      starts at this div's own top), so without this the gap
                      between the header node and the first real spacer
                      stayed permanently gray, never lighting up during a
                      sweep. Fires immediately, same as the top-connector and
                      header node right above it. */}
                  <div
                    className={`absolute left-[11px] border-l-2 transition-colors duration-300 ${
                      branchSweepPlan && desktopSweepLit ? accent.ring : "border-transparent"
                    }`}
                    style={{
                      top: -HEADER_OFFSET_PX,
                      height: HEADER_OFFSET_PX,
                      transitionDelay: "0ms",
                    }}
                    aria-hidden="true"
                  />
                  <ol
                    className="relative"
                    style={{ minHeight: maxBranchHeight + LAST_NODE_BREATHING_ROOM_PX }}
                  >
                    {(() => {
                      let cumulativeHeight = 0;
                      return layout.items.map((item, itemIdx) => {
                        const itemTop = cumulativeHeight;
                        if (item.type === "spacer") cumulativeHeight += item.height;

                        const milestoneHighlight =
                          item.type === "milestone"
                            ? combinedHighlight(
                                desktopHighlightedNodes.get(item.id),
                                branchSweepPlan?.milestones.get(item.id),
                                desktopSweepLit,
                              )
                            : null;
                        const spacerHighlight =
                          item.type === "spacer"
                            ? combinedHighlight(
                                desktopHighlighted.get(item.id),
                                branchSweepPlan?.spacers.get(item.id),
                                desktopSweepLit,
                              )
                            : null;

                        return item.type === "milestone" ? (
                          <TimelineNode
                            key={item.id}
                            milestone={item.data}
                            index={itemIdx}
                            accentKey={branch.accentKey}
                            icon={branch.icon}
                            items={layout.items}
                            onHover={(spacerSteps) => {
                              setDesktopHighlighted(toDelayMs(spacerSteps));
                              setDesktopHighlightedNodes(new Map());
                            }}
                            top={itemTop}
                            highlightDelayMs={milestoneHighlight?.delayMs}
                            highlighted={milestoneHighlight?.highlighted}
                          />
                        ) : (
                          <li key={item.id}>
                            <Spacer
                              id={item.id}
                              height={item.height}
                              dataYearFrom={item.yearFrom}
                              dataYearTo={item.yearTo}
                              accentKey={branch.accentKey}
                              highlightDelayMs={spacerHighlight?.delayMs}
                              highlighted={spacerHighlight?.highlighted}
                              top={itemTop}
                              items={layout.items}
                              onHover={(spacerSteps, milestoneSteps) => {
                                setDesktopHighlighted(toDelayMs(spacerSteps));
                                setDesktopHighlightedNodes(toDelayMs(milestoneSteps));
                              }}
                            />
                          </li>
                        );
                      });
                    })()}
                  </ol>
                  {/* "Tail" of the rail below the last real node, down to the
                      shared column bottom — lights up as part of the branch
                      sweep so the wave continues seamlessly into
                      ConvergenceGraphic instead of stopping dead at the
                      last node. */}
                  <div
                    data-testid="branch-rail-tail"
                    className={`absolute left-[11px] border-l-2 transition-colors duration-300 ${
                      branchSweepPlan && desktopSweepLit ? accent.ring : "border-transparent"
                    }`}
                    style={{
                      top: layout.height,
                      bottom: -TANGENT_BRIDGE_PX,
                      transitionDelay: branchSweepPlan ? `${sweepDurationMs}ms` : "0ms",
                    }}
                    aria-hidden="true"
                  />
                </div>
              </motion.div>
            );
          })}

        </div>

        <ConvergenceGraphic
          branchEndOffsets={branchEndOffsets}
          activeIndex={
            desktopSweepTarget && desktopSweepTarget !== "all"
              ? experience.branches.findIndex((b) => b.branchKey === desktopSweepTarget)
              : null
          }
          allActive={desktopSweepTarget === "all"}
          revealDelayMs={sweepDurationMs}
          lit={desktopSweepLit}
        />
        <p className="mt-4 text-center font-heading text-lg font-semibold text-primary">
          {experience.convergenceLabel}
        </p>
      </div>

      {/* Mobile: single merged chronological timeline, same shared scale.
          Bookended by two accent-colored nodes (origin above, convergence
          below) so the rail visibly STARTS and ENDS at a real anchor instead
          of floating text at the top and an unmatched node style at the
          bottom — accent (the same blue convergence already used) reads as
          "this is about the person/outcome", kept visually distinct from the
          3 branch colors running between the two anchors. The legend
          (rendered fixed to the bottom of the viewport — see
          mobileLegendVisible above) doubles as the mobile sweep trigger:
          tapping the origin node sweeps the whole rail ("all"), tapping a
          legend chip isolates just that branch's own milestones. */}
      <div className="md:hidden mt-10">
        {/* Origin node — same row shape as every TimelineNode/the
            convergence node below (dot flush at the LEFT edge, label beside
            it), not a centered standalone block — so it visually reads as
            the FIRST item on the rail instead of floating text above it.
            The dot sits in a relative wrapper so the pulsing "tap me" ring
            can be absolutely centered behind it without affecting layout. */}
        <button
          type="button"
          onClick={toggleMobileAllSweep}
          className="group flex w-full items-center gap-4 text-left"
        >
          <span className="relative flex h-6 w-6 shrink-0 items-center justify-center">
            {/* Pulsing ring hinting the node is tappable — same idea (and
                same numbers) as DivergenceGraphic's origin pulse on desktop:
                infinite grow-and-fade loop, paused once a full sweep is
                already lit (no point pulsing under an already-lit ring) and
                skipped entirely for prefers-reduced-motion (purely
                decorative, not informational). */}
            {!prefersReducedMotion && !(mobileSweepTarget === "all" && mobileSweepLit) && (
              <motion.span
                className={`absolute inset-0 rounded-full border-2 ${BRANCH_ACCENT.accent.ring}`}
                style={{ originX: 0.5, originY: 0.5 }}
                initial={{ opacity: 0.6, scale: 0.85 }}
                animate={{ opacity: 0, scale: 1.7 }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                aria-hidden="true"
              />
            )}
            <span
              className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 bg-surface transition-shadow duration-200 ${BRANCH_ACCENT.accent.ring} ${
                mobileSweepTarget === "all" && mobileSweepLit ? BRANCH_ACCENT.accent.activeRingGlow : ""
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${BRANCH_ACCENT.accent.fill}`} />
            </span>
          </span>
          <p
            className={`font-heading text-lg font-semibold text-primary transition-colors duration-200 ${BRANCH_ACCENT.accent.hoverText} ${
              mobileSweepTarget === "all" && mobileSweepLit ? BRANCH_ACCENT.accent.activeHoverText : ""
            }`}
          >
            {experience.originLabelMobile}
          </p>
        </button>
        {/* Short stub connecting the origin node to the rail below, aligned
            to the SAME left-[11px] x-position the rail and every dot share
            — same idiom as TOP_CONNECTOR_PX on desktop, just simpler (one
            column, no divergence graphic to bridge). */}
        <div className="ml-[11px] h-4 w-px bg-border" aria-hidden="true" />

        <div className="relative mt-2">
          <div className="absolute inset-y-0 left-[11px] w-px bg-border" aria-hidden="true" />
          <ol
            className="relative"
            style={{
              minHeight:
                mobileTotalHeight + CONVERGENCE_NODE_GAP_PX + CONVERGENCE_NODE_TRAILING_ROOM_PX,
            }}
          >
            {(() => {
              let milestoneCursor = 0;
              let cumulativeHeight = 0;
              return mobileItems.map((item, itemIdx) => {
                const itemTop = cumulativeHeight;
                if (item.type === "spacer") cumulativeHeight += item.height;

                if (item.type === "spacer") {
                  // The upcoming (not-yet-consumed) milestone this segment
                  // arrives at — used only to color the sweep/hover
                  // highlight, so a lit connector always matches the branch
                  // color of the node it leads into instead of a hardcoded
                  // generic accent (previously every mobile connector lit up
                  // blue regardless of which branch it belonged to).
                  const arrival = mobileMerged[milestoneCursor];
                  const spacerCombined = combinedHighlight(
                    mobileHighlighted.get(item.id),
                    mobileSweepPlan?.spacers.get(item.id),
                    mobileSweepLit,
                  );
                  return (
                    <li key={item.id}>
                      <Spacer
                        id={item.id}
                        height={item.height}
                        dataYearFrom={item.yearFrom}
                        dataYearTo={item.yearTo}
                        accentKey={arrival?.accentKey}
                        highlightDelayMs={spacerCombined.delayMs}
                        highlighted={spacerCombined.highlighted}
                        top={itemTop}
                        items={mobileItems}
                        onHover={(spacerSteps, milestoneSteps) => {
                          setMobileHighlighted(toDelayMs(spacerSteps));
                          setMobileHighlightedNodes(toDelayMs(milestoneSteps));
                        }}
                      />
                    </li>
                  );
                }
                const source = mobileMerged[milestoneCursor];
                milestoneCursor += 1;
                // Sweeping "all" lights every milestone as the wave passes;
                // sweeping a single branch only lights THAT branch's own
                // milestones — the connector above still sweeps its full
                // real length either way (one shared physical rail), but
                // only the isolated branch's dots get the glow, so it
                // visually pops out from the other two.
                const milestoneSweepLit =
                  mobileSweepLit &&
                  (mobileSweepTarget === "all" || mobileSweepTarget === source.branchKey);
                const milestoneCombined = combinedHighlight(
                  mobileHighlightedNodes.get(item.id),
                  mobileSweepPlan?.milestones.get(item.id),
                  milestoneSweepLit,
                );
                return (
                  <TimelineNode
                    key={item.id}
                    milestone={item.data}
                    index={itemIdx}
                    accentKey={source.accentKey}
                    icon={branchIconByKey[source.branchKey]}
                    items={mobileItems}
                    onHover={(spacerSteps) => {
                      setMobileHighlighted(toDelayMs(spacerSteps));
                      setMobileHighlightedNodes(new Map());
                    }}
                    top={itemTop}
                    highlightDelayMs={milestoneCombined.delayMs}
                    highlighted={milestoneCombined.highlighted}
                  />
                );
              });
            })()}
            <li
              className="absolute inset-x-0 flex gap-4"
              style={{ top: mobileTotalHeight + CONVERGENCE_NODE_GAP_PX }}
            >
              <div
                className={`relative z-10 mt-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 bg-surface transition-shadow duration-200 ${BRANCH_ACCENT.accent.ring} ${
                  mobileSweepTarget === "all" && mobileSweepLit ? BRANCH_ACCENT.accent.activeRingGlow : ""
                }`}
                // Only "all" ever reaches this node (isolating a single
                // branch stops at that branch's own milestones) — the delay
                // matches the wave's real travel time, so convergence lights
                // up when the wave actually ARRIVES instead of jumping lit
                // the instant you tap the origin. Kept attached (not reset
                // to "0ms") even once `mobileSweepLit` flips false, so the
                // auto-fade-off retraces the same timing on the way out.
                style={{
                  transitionDelay: mobileSweepTarget === "all" ? `${mobileSweepDurationMs}ms` : "0ms",
                }}
              >
                <IconMap name="code" className={`h-3 w-3 ${BRANCH_ACCENT.accent.text}`} />
              </div>
              <div className="flex-1">
                <h4
                  className={`font-heading text-base font-semibold text-primary transition-colors duration-200 ${
                    mobileSweepTarget === "all" && mobileSweepLit ? BRANCH_ACCENT.accent.activeHoverText : ""
                  }`}
                  style={{
                    transitionDelay: mobileSweepTarget === "all" ? `${mobileSweepDurationMs}ms` : "0ms",
                  }}
                >
                  {experience.convergenceLabel}
                </h4>
              </div>
            </li>
          </ol>
        </div>

        {/* Color legend — a plain static block at the very end, not sticky
            or fixed. Tried following the user's scroll (sticky, then fixed
            + IntersectionObserver visibility) but neither held up reliably
            on mobile (sticky's bottom-anchoring is a known-flaky browser
            behavior; the fixed+IO version couldn't even be confirmed in
            this session's test harness) — a plain block that's simply
            readable once you scroll to the end is the version that can't
            break. Still doubles as the per-branch sweep trigger (see
            toggleMobileBranchSweep above). */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 border-t border-border pt-4">
          {experience.branches.map((branch) => {
            const accent = BRANCH_ACCENT[branch.accentKey];
            const active = mobileSweepTarget === branch.branchKey;
            return (
              <button
                key={branch.branchKey}
                type="button"
                onClick={() => toggleMobileBranchSweep(branch.branchKey)}
                className="flex items-center gap-2 rounded px-1 py-1"
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${accent.fill} transition-shadow duration-200 ${
                    active && mobileSweepLit ? accent.activeRingGlow : ""
                  }`}
                  aria-hidden="true"
                />
                <span
                  className={`font-body text-xs font-medium transition-colors duration-200 ${
                    active ? `${accent.text} font-semibold` : "text-muted"
                  }`}
                >
                  {branch.branchLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
