import { useState } from "react";
import { useContent } from "../../hooks/useContent";
import SectionWrapper from "../ui/SectionWrapper";
import TimelineNode from "../ui/TimelineNode";
import { Spacer } from "../ui/Spacer";
import ConvergenceGraphic from "../ui/ConvergenceGraphic";
import IconMap from "../ui/IconMap";
import { BRANCH_ACCENT } from "../../lib/branchAccent";
import { mergeMilestonesByYear } from "../../lib/mergeMilestonesByYear";
import { resolveYear, getBranchLayout, buildTimelineWithSpacers } from "../../lib/timelineScale";
import { motion } from "motion/react";
import { fadeInItem } from "../ui/SectionWrapper";

export default function Experience() {
  const content = useContent();
  const { experience } = content;

  // Spacer ids illuminated by the currently hovered milestone (desktop and
  // mobile timelines track their own hover state independently).
  const [desktopHighlighted, setDesktopHighlighted] = useState<Set<string>>(new Set());
  const [mobileHighlighted, setMobileHighlighted] = useState<Set<string>>(new Set());

  const branchIconByKey = Object.fromEntries(
    experience.branches.map((branch) => [branch.branchKey, branch.icon]),
  );

  // Shared temporal scale: every branch (and the mobile merged list) is
  // positioned relative to the earliest year across all branches.
  const globalMinYear = Math.min(
    ...experience.branches.map((branch) => resolveYear(branch.milestones[0].year)),
  );

  const branchLayouts = experience.branches.map((branch) =>
    getBranchLayout(branch, globalMinYear),
  );
  const branchEndOffsets = branchLayouts.map((layout) => layout.endOffset);

  const merged = mergeMilestonesByYear(experience.branches);
  const mobileItems = buildTimelineWithSpacers(
    merged.map((m) => m.milestone),
    globalMinYear,
  );

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
        <div className="mt-10 grid grid-cols-3 gap-8">
          {experience.branches.map((branch, branchIdx) => {
            const accent = BRANCH_ACCENT[branch.accentKey];
            const layout = branchLayouts[branchIdx];
            return (
              <motion.div key={branch.branchKey} {...fadeInItem(branchIdx + 1)}>
                <div className="flex items-center gap-3">
                  <IconMap name={branch.icon} className={`h-5 w-5 shrink-0 ${accent.text}`} />
                  <h3 className="font-heading text-xl font-semibold text-primary">
                    {branch.branchLabel}
                  </h3>
                </div>

                <div
                  className="relative"
                  style={{ marginTop: layout.topOffset + 24 }}
                >
                  {/* Single continuous connector rail for the whole column */}
                  <div
                    className="absolute inset-y-0 left-[11px] w-px bg-border"
                    aria-hidden="true"
                  />
                  <ol className="relative" style={{ minHeight: layout.height }}>
                    {layout.items.map((item, itemIdx) =>
                      item.type === "milestone" ? (
                        <TimelineNode
                          key={item.id}
                          milestone={item.data}
                          index={itemIdx}
                          accentKey={branch.accentKey}
                          icon={branch.icon}
                          items={layout.items}
                          onHover={(ids) => setDesktopHighlighted(new Set(ids))}
                        />
                      ) : (
                        <li key={item.id}>
                          <Spacer
                            id={item.id}
                            height={item.height}
                            dataYearFrom={item.yearFrom}
                            dataYearTo={item.yearTo}
                            accentKey={branch.accentKey}
                            highlighted={desktopHighlighted.has(item.id)}
                          />
                        </li>
                      ),
                    )}
                  </ol>
                </div>
              </motion.div>
            );
          })}
        </div>

        <ConvergenceGraphic branchEndOffsets={branchEndOffsets} />
        <p className="mt-4 text-center font-heading text-lg font-semibold text-primary">
          {experience.convergenceLabel}
        </p>
      </div>

      {/* Mobile: single merged chronological timeline, same shared scale */}
      <div className="md:hidden mt-10">
        <ul className="flex flex-wrap items-center gap-4">
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
          <ol className="relative">
            {(() => {
              let milestoneCursor = 0;
              return mobileItems.map((item, itemIdx) => {
                if (item.type === "spacer") {
                  return (
                    <li key={item.id}>
                      <Spacer
                        id={item.id}
                        height={item.height}
                        dataYearFrom={item.yearFrom}
                        dataYearTo={item.yearTo}
                        highlighted={mobileHighlighted.has(item.id)}
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
                    onHover={(ids) => setMobileHighlighted(new Set(ids))}
                  />
                );
              });
            })()}
            <li className="relative flex gap-4">
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
