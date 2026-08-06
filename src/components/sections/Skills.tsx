import { useContent } from "../../hooks/useContent";
import SectionWrapper from "../ui/SectionWrapper";
import SkillCarousel from "../ui/SkillCarousel";
import { motion } from "motion/react";
import { fadeInItem } from "../ui/SectionWrapper";

export default function Skills() {
  const content = useContent();
  const { skills } = content;

  const allSkills = skills.flatMap((cat) => cat.items);

  return (
    <SectionWrapper id="skills" className="mx-auto max-w-6xl px-4 py-20 md:py-28">
      <motion.h2
        {...fadeInItem(0)}
        className="font-heading text-3xl font-bold text-primary md:text-4xl"
      >
        {content.navLinks.find((l) => l.href === "#skills")?.label}
      </motion.h2>

      <motion.div {...fadeInItem(1)} className="mt-10">
        <SkillCarousel skills={allSkills} />
      </motion.div>
    </SectionWrapper>
  );
}
