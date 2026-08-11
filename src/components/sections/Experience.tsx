import { useState } from "react";
import { useContent } from "../../hooks/useContent";
import SectionWrapper from "../ui/SectionWrapper";
import TimelineNode from "../ui/TimelineNode";
import ConvergenceGraphic from "../ui/ConvergenceGraphic";
import IconMap from "../ui/IconMap";
import { BRANCH_ACCENT } from "../../lib/branchAccent";
import { mergeMilestonesByYear } from "../../lib/mergeMilestonesByYear";
import { motion } from "motion/react";
import { fadeInItem } from "../ui/SectionWrapper";

export default function Experience() {
  const content = useContent();
  const { experience } = content;
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const isExpanded = (key: string) => !collapsed[key];
  const toggle = (key: string) =>
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));

  const branchIconByKey = Object.fromEntries(
    experience.branches.map((branch) => [branch.branchKey, branch.icon]),
  );
  const mergedMilestones = mergeMilestonesByYear(experience.branches);

  return (
    <SectionWrapper id="experience" className="mx-auto max-w-6xl px-4 py-20 md:py-28">
      <motion.h2
        {...fadeInItem(0)}
        className="font-heading text-3xl font-bold text-primary md:text-4xl"
      >
        {content.navLinks.find((l) => l.href === "#experience")?.label}
      </motion.h2>

      {/* Desktop: 3-column layout with independent accordions + convergence graphic */}
      <div className="hidden md:block">
        <div className="mt-10 grid grid-cols-3 gap-8">
          {experience.branches.map((branch, branchIdx) => {
            const accent = BRANCH_ACCENT[branch.accentKey];
            const expanded = isExpanded(branch.branchKey);
            return (
              <motion.div key={branch.branchKey} {...fadeInItem(branchIdx + 1)}>
                <button
                  onClick={() => toggle(branch.branchKey)}
                  className="group flex w-full cursor-pointer items-center gap-3 text-left transition-colors duration-200"
                  aria-expanded={expanded}
                >
                  <IconMap name={branch.icon} className={`h-5 w-5 shrink-0 ${accent.text}`} />
                  <h3 className="font-heading text-xl font-semibold text-primary transition-colors duration-200 group-hover:text-accent">
                    {branch.branchLabel}
                  </h3>
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`ml-auto shrink-0 text-muted transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {expanded && (
                  <ol className="mt-6">
                    {branch.milestones.map((m, i) => (
                      <TimelineNode
                        key={m.year + m.title}
                        milestone={m}
                        isLast={i === branch.milestones.length - 1}
                        index={i}
                        accentKey={branch.accentKey}
                        icon={branch.icon}
                      />
                    ))}
                  </ol>
                )}
              </motion.div>
            );
          })}
        </div>

        <ConvergenceGraphic />
        <p className="mt-4 text-center font-heading text-lg font-semibold text-primary">
          {experience.convergenceLabel}
        </p>
      </div>

      {/* Mobile: single merged chronological timeline */}
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

        <ol className="mt-6">
          {mergedMilestones.map((m, i) => (
            <TimelineNode
              key={m.branchKey + m.milestone.year + m.milestone.title}
              milestone={m.milestone}
              isLast={false}
              index={i}
              accentKey={m.accentKey}
              icon={branchIconByKey[m.branchKey]}
            />
          ))}
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
    </SectionWrapper>
  );
}
