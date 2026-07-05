import { motion } from "motion/react";
import { fadeInItem } from "./SectionWrapper";
import type { Skill } from "../../data/content";

interface SkillCardProps {
  skill: Skill;
  index: number;
}

export default function SkillCard({ skill, index }: SkillCardProps) {
  return (
    <motion.div
      {...fadeInItem(index)}
      className="flex cursor-default items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 transition-colors duration-200 hover:border-accent/40"
    >
      <span className="font-body text-sm font-medium text-primary">{skill.name}</span>
    </motion.div>
  );
}
