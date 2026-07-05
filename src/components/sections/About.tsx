import { useContent } from "../../hooks/useContent";
import SectionWrapper from "../ui/SectionWrapper";
import { motion } from "motion/react";
import { fadeInItem } from "../ui/SectionWrapper";

export default function About() {
  const content = useContent();
  const { about } = content;

  return (
    <SectionWrapper id="about" className="mx-auto max-w-6xl px-4 py-20 md:py-28">
      <motion.h2
        {...fadeInItem(0)}
        className="font-heading text-3xl font-bold text-primary md:text-4xl"
      >
        {content.navLinks.find((l) => l.href === "#about")?.label}
      </motion.h2>

      <div className="mt-10 flex flex-col items-center gap-10 md:flex-row md:items-start">
        {/* Portrait */}
        <motion.img
          {...fadeInItem(1)}
          src={about.photoUrl}
          alt={about.photoAlt}
          className="h-40 w-40 shrink-0 rounded-full border-2 border-border object-cover shadow-lg md:h-56 md:w-56"
        />

        {/* Paragraphs */}
        <div className="flex flex-col gap-4">
          {about.paragraphs.map((p, i) => (
            <motion.p
              key={i}
              {...fadeInItem(i + 2)}
              className="font-body text-base leading-relaxed text-muted md:text-lg"
            >
              {p}
            </motion.p>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
