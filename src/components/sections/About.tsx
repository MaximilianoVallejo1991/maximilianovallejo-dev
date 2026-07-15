import { useContent } from "../../hooks/useContent";
import SectionWrapper from "../ui/SectionWrapper";
import { motion } from "motion/react";
import { fadeInItem } from "../ui/SectionWrapper";

export default function About() {
  const content = useContent();
  const { about } = content;

  return (
    <SectionWrapper id="about" className="mx-auto max-w-6xl px-4 py-12 md:py-28">
      {/* Mobile: portrait above title */}
      <motion.img
        {...fadeInItem(0)}
        src={about.photoUrl}
        alt={about.photoAlt}
        className="mx-auto mb-4 h-40 w-40 rounded-full border-2 border-border object-cover shadow-lg md:hidden"
      />

      <motion.h2
        {...fadeInItem(0)}
        className="text-center font-heading text-3xl font-bold text-primary md:text-left md:text-4xl"
      >
        {content.navLinks.find((l) => l.href === "#about")?.label}
      </motion.h2>

      <div className="mt-6 flex flex-col items-center gap-6 md:mt-10 md:flex-row md:items-start md:gap-10">
        {/* Desktop portrait */}
        <motion.img
          {...fadeInItem(1)}
          src={about.photoUrl}
          alt={about.photoAlt}
          className="hidden h-40 w-40 shrink-0 rounded-full border-2 border-border object-cover shadow-lg md:block md:h-56 md:w-56"
        />

        {/* Paragraphs */}
        <div className="flex flex-col gap-4">
          {/* Desktop paragraphs — md+ */}
          <div className="hidden md:flex md:flex-col md:gap-4">
            {about.paragraphs.map((p, i) => (
              <motion.p
                key={`d-${i}`}
                {...fadeInItem(i + 2)}
                className="font-body text-base leading-relaxed text-muted md:text-lg"
              >
                {p}
              </motion.p>
            ))}
          </div>
          {/* Mobile paragraphs — below md */}
          <div className="flex flex-col gap-4 md:hidden">
            {(about.mobileParagraphs ?? about.paragraphs).map((p, i) => (
              <motion.p
                key={`m-${i}`}
                {...fadeInItem(i + 2)}
                className="font-body text-sm leading-relaxed text-muted"
              >
                {p}
              </motion.p>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
