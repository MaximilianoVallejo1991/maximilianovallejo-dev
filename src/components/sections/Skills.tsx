import { useContent } from "../../hooks/useContent";
import SectionWrapper from "../ui/SectionWrapper";
import SkillCard from "../ui/SkillCard";
import { motion } from "motion/react";
import { fadeInItem } from "../ui/SectionWrapper";

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

      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
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
