import { useState } from "react";
import { useContent } from "../../hooks/useContent";
import SectionWrapper from "../ui/SectionWrapper";
import TimelineNode from "../ui/TimelineNode";
import { motion } from "motion/react";
import { fadeInItem } from "../ui/SectionWrapper";

export default function Experience() {
  const content = useContent();
  const { experience } = content;
  const [expandedBranch, setExpandedBranch] = useState<string | null>(null);

  const toggleBranch = (key: string) => {
    setExpandedBranch((prev) => (prev === key ? null : key));
  };

  return (
    <SectionWrapper id="experience" className="mx-auto max-w-6xl px-4 py-20 md:py-28">
      <motion.h2
        {...fadeInItem(0)}
        className="font-heading text-3xl font-bold text-primary md:text-4xl"
      >
        {content.navLinks.find((l) => l.href === "#experience")?.label}
      </motion.h2>

      <div className="mt-10 flex flex-col gap-12">
        {experience.branches.map((branch, branchIdx) => (
          <motion.div key={branch.branchKey} {...fadeInItem(branchIdx + 1)}>
            {/* Branch header */}
            <button
              onClick={() => toggleBranch(branch.branchKey)}
              className="group flex w-full cursor-pointer items-center gap-4 text-left transition-colors duration-200"
              aria-expanded={expandedBranch === branch.branchKey}
            >
              <h3 className="font-heading text-xl font-semibold text-primary transition-colors duration-200 group-hover:text-accent md:text-2xl">
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
                className={`shrink-0 text-muted transition-transform duration-200 ${expandedBranch === branch.branchKey ? "rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Timeline */}
            {expandedBranch === branch.branchKey && (
              <ol className="mt-6">
                {branch.milestones.map((m, i) => (
                  <TimelineNode
                    key={m.year + m.title}
                    milestone={m}
                    isLast={i === branch.milestones.length - 1}
                    index={i}
                  />
                ))}
              </ol>
            )}
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
