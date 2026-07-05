import { useState } from "react";
import { useContent } from "../../hooks/useContent";
import SectionWrapper from "../ui/SectionWrapper";
import TimelineNode from "../ui/TimelineNode";
import { motion } from "motion/react";
import { fadeInItem } from "../ui/SectionWrapper";

export default function Experience() {
  const content = useContent();
  const { experience } = content;
  const [expandedTrack, setExpandedTrack] = useState<string | null>(null);

  const toggleTrack = (key: string) => {
    setExpandedTrack((prev) => (prev === key ? null : key));
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
        {experience.map((track, trackIdx) => (
          <motion.div key={track.trackKey} {...fadeInItem(trackIdx + 1)}>
            {/* Track header */}
            <button
              onClick={() => toggleTrack(track.trackKey)}
              className="group flex w-full cursor-pointer items-center gap-4 text-left transition-colors duration-200"
              aria-expanded={expandedTrack === track.trackKey}
            >
              <img
                src={track.heroImage}
                alt={track.trackLabel}
                loading="lazy"
                className="h-16 w-24 shrink-0 rounded-lg object-cover md:h-20 md:w-32"
              />
              <h3 className="font-heading text-xl font-semibold text-primary transition-colors duration-200 group-hover:text-accent md:text-2xl">
                {track.trackLabel}
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
                className={`shrink-0 text-muted transition-transform duration-200 ${expandedTrack === track.trackKey ? "rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Timeline */}
            {expandedTrack === track.trackKey && (
              <ol className="mt-6">
                {track.milestones.map((m, i) => (
                  <TimelineNode
                    key={m.year + m.title}
                    milestone={m}
                    isLast={i === track.milestones.length - 1}
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
