import type { ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

interface SectionWrapperProps {
  id?: string;
  children: ReactNode;
  className?: string;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function fadeInItem(index: number) {
  return {
    variants: itemVariants,
    custom: index,
  };
}

export const hoverLift = {
  y: -80,
  scale: 1.02,
  transition: { type: "spring", stiffness: 400, damping: 30 },
} as const;

export default function SectionWrapper({
  id,
  children,
  className = "",
}: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReduced = useReducedMotion();

  return (
    <motion.section
      id={id}
      ref={ref}
      className={`scroll-mt-14 snap-start ${className}`}
      variants={prefersReduced ? undefined : containerVariants}
      initial={prefersReduced ? "visible" : "hidden"}
      animate={inView ? "visible" : "hidden"}
    >
      {children}
    </motion.section>
  );
}
