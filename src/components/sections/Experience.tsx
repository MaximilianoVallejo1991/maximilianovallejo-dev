import { useState } from "react";
import { useContent } from "../../hooks/useContent";
import SectionWrapper from "../ui/SectionWrapper";
import TimelineNode from "../ui/TimelineNode";
import { Spacer } from "../ui/Spacer";
import ConvergenceGraphic from "../ui/ConvergenceGraphic";
import DivergenceGraphic from "../ui/DivergenceGraphic";
import IconMap from "../ui/IconMap";
import { BRANCH_ACCENT, BRANCH_RAIL_CX, BRANCH_GRAPHIC_VIEWBOX_WIDTH } from "../../lib/branchAccent";
import { mergeMilestonesByYear } from "../../lib/mergeMilestonesByYear";
import {
  resolveYear,
  getBranchLayout,
  buildTimelineWithSpacers,
  getTimelineHeight,
  findMilestoneTopByYear,
  getBranchSweepPlan,
  HIGHLIGHT_STEP_DELAY_MS,
} from "../../lib/timelineScale";
import { motion } from "motion/react";
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

/** What a click on the divergence graphic/labels currently has swept:
 * a single branch (its key), every branch at once ("all"), or nothing. */
type SweepTarget = string | "all" | null;

// PROTOTYPE: one hardcoded cross-branch diagonal connector, matched by
// branchKey+year (stable across locales — titles translate, years don't).
// Lands CONNECTOR_TARGET_GAP_PX short of the target milestone's own Y, so
// it visually merges into that branch's rail instead of touching its dot.
interface DiagonalConnector {
  id: string;
  fromBranchKey: string;
  fromYear: string;
  toBranchKey: string;
  toYear: string;
}
const DIAGONAL_CONNECTORS: DiagonalConnector[] = [
  { id: "ciclo-basico-plc", fromBranchKey: "study", fromYear: "2011", toBranchKey: "trade", toYear: "2017" },
];
const CONNECTOR_TARGET_GAP_PX = 60;

// Flat header-row allowance applied uniformly to every column (icon + <h3>
// row above the rail) — not year-based, since every branch's items now
// already start at the shared globalMinYear origin internally (see
// getBranchLayout's leading-spacer synthesis).
const HEADER_OFFSET_PX = 24;

// One-time, non-compounding buffer added once to the tallest branch's real
// height so the very last node's real text (title/description, possibly a
// photo) has breathing room before whatever renders below the column
// (the convergence graphic). Deliberately NOT applied per-node — that was
// the bug in the removed ESTIMATED_MILESTONE_HEIGHT_PX approach, which
// guessed at every node's height and compounded drift down each column.
const LAST_NODE_BREATHING_ROOM_PX = 140;

export default function Experience() {
  const content = useContent();
  const { experience } = content;

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
  const [highlightedConnectors, setHighlightedConnectors] = useState<Set<string>>(new Set());
  // What's currently toggled into a full top-to-bottom "sweep": a single
  // branch (clicking its label or its divergence-graphic line), every
  // branch at once (clicking the origin node/name), or nothing. Only one
  // target sweeps at a time; clicking the currently-active trigger again
  // clears it, and clicking a different trigger switches to that one.
  const [desktopSweepTarget, setDesktopSweepTarget] = useState<SweepTarget>(null);

  const toggleBranchSweep = (branchKey: string) => {
    setDesktopSweepTarget((current) => (current === branchKey ? null : branchKey));
  };
  const toggleAllSweep = () => {
    setDesktopSweepTarget((current) => (current === "all" ? null : "all"));
  };

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
  const mobileItems = buildTimelineWithSpacers(merged.map((m) => m.milestone));
  const mobileTotalHeight = getTimelineHeight(mobileItems);

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

  const connectorPaths = DIAGONAL_CONNECTORS.map((connector) => {
    const fromIdx = experience.branches.findIndex((b) => b.branchKey === connector.fromBranchKey);
    const toIdx = experience.branches.findIndex((b) => b.branchKey === connector.toBranchKey);
    if (fromIdx === -1 || toIdx === -1) return null;
    const fromTop = findMilestoneTopByYear(branchLayouts[fromIdx].items, connector.fromYear);
    const toTop = findMilestoneTopByYear(branchLayouts[toIdx].items, connector.toYear);
    if (fromTop === null || toTop === null) return null;
    return {
      id: connector.id,
      fromBranchKey: connector.fromBranchKey,
      fromYear: connector.fromYear,
      x1: BRANCH_RAIL_CX[fromIdx],
      y1: fromTop,
      x2: BRANCH_RAIL_CX[toIdx],
      y2: Math.max(0, toTop - CONNECTOR_TARGET_GAP_PX),
    };
  }).filter((c): c is NonNullable<typeof c> => c !== null);

  return (
    <SectionWrapper id="experience" className="mx-auto max-w-6xl px-4 py-20 md:py-28">
      <motion.h2
        {...fadeInItem(0)}
        className="font-heading text-3xl font-bold text-primary md:text-4xl"
      >
        {content.navLinks.find((l) => l.href === "#experience")?.label}
      </motion.h2>

      {/* Desktop: 3-column layout, always expanded, shared temporal scale */}
      <div className="hidden md:block">
        <button type="button" onClick={toggleAllSweep} className="group mx-auto mt-10 block">
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
            desktopSweepTarget && desktopSweepTarget !== "all"
              ? experience.branches.findIndex((b) => b.branchKey === desktopSweepTarget)
              : null
          }
          allActive={desktopSweepTarget === "all"}
          onBranchClick={(index) => {
            const branch = experience.branches[index];
            if (branch) toggleBranchSweep(branch.branchKey);
          }}
          onOriginClick={toggleAllSweep}
        />
        <div className="relative grid grid-cols-3 gap-8">
          {experience.branches.map((branch, branchIdx) => {
            const accent = BRANCH_ACCENT[branch.accentKey];
            const layout = branchLayouts[branchIdx];
            const branchSweepPlan = sweepPlansByBranch.get(branch.branchKey);
            return (
              <motion.div key={branch.branchKey} {...fadeInItem(branchIdx + 1)}>
                <button
                  type="button"
                  onClick={() => toggleBranchSweep(branch.branchKey)}
                  className="group flex items-center gap-3 rounded"
                >
                  <IconMap name={branch.icon} className={`h-5 w-5 shrink-0 ${accent.text}`} />
                  <h3
                    className={`font-heading text-xl font-semibold text-primary transition-colors duration-200 ${accent.hoverText} ${
                      desktopSweepTarget === branch.branchKey || desktopSweepTarget === "all"
                        ? accent.activeHoverText
                        : ""
                    }`}
                  >
                    {branch.branchLabel}
                  </h3>
                </button>

                <div className="relative" style={{ marginTop: HEADER_OFFSET_PX }}>
                  {/* Single continuous connector rail for the whole column */}
                  <div
                    className="absolute inset-y-0 left-[11px] w-px bg-border"
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
                              // PROTOTYPE: spacerSteps is only non-empty on
                              // real hover-enter (mouseleave always passes
                              // an empty map) — reliable here because this
                              // connector's source milestone always has a
                              // non-empty hoverIllumination of its own.
                              const isEnter = spacerSteps.size > 0;
                              const matches = isEnter
                                ? DIAGONAL_CONNECTORS.filter(
                                    (c) =>
                                      c.fromBranchKey === branch.branchKey &&
                                      c.fromYear === item.data.year,
                                  ).map((c) => c.id)
                                : [];
                              setHighlightedConnectors(new Set(matches));
                            }}
                            top={itemTop}
                            highlightDelayMs={minDelay(
                              desktopHighlightedNodes.get(item.id),
                              branchSweepPlan?.milestones.get(item.id),
                            )}
                          />
                        ) : (
                          <li key={item.id}>
                            <Spacer
                              id={item.id}
                              height={item.height}
                              dataYearFrom={item.yearFrom}
                              dataYearTo={item.yearTo}
                              accentKey={branch.accentKey}
                              highlightDelayMs={minDelay(
                                desktopHighlighted.get(item.id),
                                branchSweepPlan?.spacers.get(item.id),
                              )}
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
                    className={`absolute left-[11px] border-l-2 transition-colors duration-300 ${
                      branchSweepPlan ? accent.ring : "border-transparent"
                    }`}
                    style={{
                      top: layout.height,
                      bottom: 0,
                      transitionDelay: branchSweepPlan ? `${sweepDurationMs}ms` : "0ms",
                    }}
                    aria-hidden="true"
                  />
                </div>
              </motion.div>
            );
          })}

          {/* PROTOTYPE: cross-branch diagonal connector(s), overlaid on top
              of the 3 columns. pointer-events-none so it never blocks the
              real node/spacer hovers underneath it. */}
          <svg
            viewBox={`0 0 ${BRANCH_GRAPHIC_VIEWBOX_WIDTH} ${maxBranchHeight + LAST_NODE_BREATHING_ROOM_PX}`}
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
            className="pointer-events-none absolute left-0 w-full"
            style={{
              top: HEADER_OFFSET_PX,
              height: maxBranchHeight + LAST_NODE_BREATHING_ROOM_PX,
            }}
          >
            {connectorPaths.map((c) => (
              <line
                key={c.id}
                x1={c.x1}
                y1={c.y1}
                x2={c.x2}
                y2={c.y2}
                strokeWidth={2}
                strokeLinecap="round"
                strokeDasharray={highlightedConnectors.has(c.id) ? undefined : "4 4"}
                className={`transition-colors duration-300 ${
                  highlightedConnectors.has(c.id) ? "stroke-branch-study" : "stroke-border"
                }`}
              />
            ))}
          </svg>
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
        />
        <p className="mt-4 text-center font-heading text-lg font-semibold text-primary">
          {experience.convergenceLabel}
        </p>
      </div>

      {/* Mobile: single merged chronological timeline, same shared scale */}
      <div className="md:hidden mt-10">
        <p className="text-center font-heading text-lg font-semibold text-primary">
          {experience.originLabelMobile}
        </p>
        <ul className="mt-4 flex flex-wrap items-center gap-4">
          {experience.branches.map((branch) => {
            const accent = BRANCH_ACCENT[branch.accentKey];
            return (
              <li key={branch.branchKey} className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${accent.fill}`} aria-hidden="true" />
                <span className="font-body text-xs font-medium text-muted">
                  {branch.branchLabel}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="relative mt-6">
          <div className="absolute inset-y-0 left-[11px] w-px bg-border" aria-hidden="true" />
          <ol
            className="relative"
            style={{ minHeight: mobileTotalHeight + LAST_NODE_BREATHING_ROOM_PX }}
          >
            {(() => {
              let milestoneCursor = 0;
              let cumulativeHeight = 0;
              return mobileItems.map((item, itemIdx) => {
                const itemTop = cumulativeHeight;
                if (item.type === "spacer") cumulativeHeight += item.height;

                if (item.type === "spacer") {
                  return (
                    <li key={item.id}>
                      <Spacer
                        id={item.id}
                        height={item.height}
                        dataYearFrom={item.yearFrom}
                        dataYearTo={item.yearTo}
                        highlightDelayMs={mobileHighlighted.get(item.id)}
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
                const source = merged[milestoneCursor];
                milestoneCursor += 1;
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
                    highlightDelayMs={mobileHighlightedNodes.get(item.id)}
                  />
                );
              });
            })()}
            <li
              className="absolute inset-x-0 flex gap-4"
              style={{ top: mobileTotalHeight }}
            >
              <div className="relative z-10 mt-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-accent bg-surface">
                <IconMap name="code" className="h-3 w-3 text-accent" />
              </div>
              <div className="flex-1">
                <h4 className="font-heading text-base font-semibold text-primary">
                  {experience.convergenceLabel}
                </h4>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </SectionWrapper>
  );
}
