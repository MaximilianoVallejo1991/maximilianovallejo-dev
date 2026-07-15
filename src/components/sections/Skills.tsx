import { useState } from "react";
import { useContent } from "../../hooks/useContent";
import SectionWrapper from "../ui/SectionWrapper";
import SkillCard from "../ui/SkillCard";
import { motion } from "motion/react";
import { fadeInItem } from "../ui/SectionWrapper";
import type { SkillCategory } from "../../data/content";

function MobileSkillCategory({
  category,
}: {
  category: SkillCategory;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      layout
      className="overflow-hidden rounded-lg border border-border bg-surface"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-3 transition-colors duration-200 hover:bg-accent/5"
        aria-expanded={isOpen}
      >
        <h3 className="font-heading text-base font-semibold text-primary">
          {category.category}
        </h3>

        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 shrink-0 text-muted"
        >
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>
      </button>

      <motion.div
        initial={false}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <motion.div
          variants={{
            open: {
              transition: { staggerChildren: 0.07, delayChildren: 0.05 },
            },
            closed: {
              transition: { staggerChildren: 0.04, staggerDirection: -1 },
            },
          }}
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          className="flex flex-col gap-2 px-4 pb-4 pt-2"
        >
          {category.items.map((skill) => (
            <motion.div
              key={skill.name}
              variants={{
                open: { opacity: 1, y: 0, scale: 1 },
                closed: { opacity: 0, y: -12, scale: 0.96 },
              }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 24,
              }}
            >
              <SkillCard skill={skill} index={0} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function Skills() {
  const content = useContent();
  const { skills } = content;

  const visibleCategories = skills.filter((cat) => cat.items.length > 0);

  return (
    <SectionWrapper id="skills" className="mx-auto max-w-6xl px-4 py-20 md:py-28">
      <motion.h2
        {...fadeInItem(0)}
        className="font-heading text-3xl font-bold text-primary md:text-4xl"
      >
        {content.navLinks.find((l) => l.href === "#skills")?.label}
      </motion.h2>

      {/* Mobile: accordion categories */}
      <div className="mt-6 flex flex-col gap-3 md:hidden">
        {visibleCategories.map((cat) => (
          <MobileSkillCategory key={cat.categoryKey} category={cat} />
        ))}
      </div>

      {/* Desktop: grid */}
      <div className="mt-10 hidden grid-cols-1 gap-10 md:grid md:grid-cols-2 lg:grid-cols-4">
        {visibleCategories.map((cat, catIdx) => (
          <motion.div key={cat.categoryKey} {...fadeInItem(catIdx + 1)}>
            <h3 className="mb-4 font-heading text-lg font-semibold text-primary">
              {cat.category}
            </h3>
            <div className="flex flex-col gap-2">
              {cat.items.map((skill, i) => (
                <SkillCard key={skill.name} skill={skill} index={i} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
