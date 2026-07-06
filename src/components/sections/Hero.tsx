import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useContent } from "../../hooks/useContent";

const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

const pathVariants = {
  draw: {
    pathLength: 1,
    transition: { duration: 0.35, ease: easeOut },
  },
  hidden: { pathLength: 0 },
};

export default function Hero() {
  const content = useContent();
  const prefersReduced = useReducedMotion();
  const [pathsDone, setPathsDone] = useState(prefersReduced);
  const doneCount = useRef(0);

  const onPathComplete = () => {
    doneCount.current += 1;
    if (doneCount.current >= 4) {
      setPathsDone(true);
    }
  };

  const labels = content.hero.quadrantLabels;

  const delays = [0, 0.2, 0.4, 0.6];

  // ponytail: when prefersReduced, skip pathLength animation entirely
  const pathProps = (delay: number) =>
    prefersReduced
      ? { initial: { pathLength: 1 } as const }
      : {
          variants: pathVariants,
          initial: "hidden" as const,
          animate: "draw" as const,
          transition: { delay, ease: easeOut },
        };

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 scroll-mt-14"
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-30 dark:opacity-15">
        <svg
          viewBox="0 0 800 600"
          className="h-full w-full max-w-5xl"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          {/* NW: Voluntariado */}
          <title>{labels[0]}</title>
          <motion.path
            d="M 80 80 C 200 120, 320 200, 400 300"
            {...pathProps(delays[0])}
            onAnimationComplete={onPathComplete}
          />

          {/* NE: Industria */}
          <title>{labels[1]}</title>
          <motion.path
            d="M 720 80 C 600 120, 480 200, 400 300"
            {...pathProps(delays[1])}
            onAnimationComplete={onPathComplete}
          />

          {/* SW: Tech */}
          <title>{labels[2]}</title>
          <motion.path
            d="M 80 520 C 200 480, 320 400, 400 300"
            {...pathProps(delays[2])}
            onAnimationComplete={onPathComplete}
          />

          {/* SE: Oficios */}
          <title>{labels[3]}</title>
          <motion.path
            d="M 720 520 C 600 480, 480 400, 400 300"
            {...pathProps(delays[3])}
            onAnimationComplete={onPathComplete}
          />
        </svg>
      </div>

      {/* Quadrant labels */}
      <div className="pointer-events-none absolute inset-0">
        <span className="absolute top-[15%] left-[8%] font-heading text-xs font-medium uppercase tracking-widest text-muted/50 md:text-sm">
          {labels[0]}
        </span>
        <span className="absolute top-[15%] right-[8%] font-heading text-xs font-medium uppercase tracking-widest text-muted/50 md:text-sm">
          {labels[1]}
        </span>
        <span className="absolute bottom-[20%] left-[8%] font-heading text-xs font-medium uppercase tracking-widest text-muted/50 md:text-sm">
          {labels[2]}
        </span>
        <span className="absolute bottom-[20%] right-[8%] font-heading text-xs font-medium uppercase tracking-widest text-muted/50 md:text-sm">
          {labels[3]}
        </span>
      </div>

      {/* Center content */}
      <motion.div
        className="relative z-10 text-center"
        initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
        animate={pathsDone ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className="mb-2 font-body text-lg text-muted md:text-xl">
          {content.hero.greeting}
        </p>
        <h1 className="font-heading text-4xl font-bold text-primary md:text-6xl">
          {content.hero.name}
        </h1>
        <p className="mt-4 font-body text-xl font-semibold text-accent md:text-2xl">
          {content.hero.subtitle}
        </p>
      </motion.div>
    </section>
  );
}
