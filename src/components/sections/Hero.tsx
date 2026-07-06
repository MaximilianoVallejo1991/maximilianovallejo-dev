import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useContent } from "../../hooks/useContent";

const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

const pathVariants = {
  draw: {
    pathLength: 1,
    transition: { duration: 1.2, ease: easeOut },
  },
  hidden: { pathLength: 0 },
};

const textItem = (i: number) =>
  ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: i * 0.15, duration: 0.4, ease: easeOut },
  }) as const;

const sections = ["#experience", "#experience", "#skills", "#experience"];

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

  const delays = [0, 0.3, 0.6, 0.9];

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

  const scrollTo = (href: string) => {
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth" });
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
          {/* NW: Voluntariado — centro → label */}
          <title>{labels[0]}</title>
          <motion.path
            d="M 400 300 C 280 180, 160 120, 64 90"
            {...pathProps(delays[0])}
            onAnimationComplete={onPathComplete}
          />

          {/* NE: Industria */}
          <title>{labels[1]}</title>
          <motion.path
            d="M 400 300 C 520 180, 640 120, 736 90"
            {...pathProps(delays[1])}
            onAnimationComplete={onPathComplete}
          />

          {/* SW: Tech */}
          <title>{labels[2]}</title>
          <motion.path
            d="M 400 300 C 280 420, 160 450, 64 480"
            {...pathProps(delays[2])}
            onAnimationComplete={onPathComplete}
          />

          {/* SE: Oficios */}
          <title>{labels[3]}</title>
          <motion.path
            d="M 400 300 C 520 420, 640 450, 736 480"
            {...pathProps(delays[3])}
            onAnimationComplete={onPathComplete}
          />
        </svg>
      </div>

      {/* Quadrant labels — hover to lift, click to navigate */}
      <div className="absolute inset-0">
        {labels.map((label, i) => (
          <motion.button
            key={label}
            onClick={() => scrollTo(sections[i])}
            whileHover={prefersReduced ? {} : { y: -3 }}
            whileTap={{ scale: 0.97 }}
            className={
              "absolute cursor-pointer border-none bg-transparent font-heading text-xs font-medium uppercase tracking-widest text-muted/50 transition-colors duration-200 hover:text-accent md:text-sm " +
              (i === 0 ? "top-[15%] left-[8%]" : "") +
              (i === 1 ? "top-[15%] right-[8%]" : "") +
              (i === 2 ? "bottom-[20%] left-[8%]" : "") +
              (i === 3 ? "bottom-[20%] right-[8%]" : "")
            }
          >
            {label}
          </motion.button>
        ))}
      </div>

      {/* Center content — static, hover to lift */}
      <motion.div
        className="relative z-10 text-center"
        initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
        animate={pathsDone ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={prefersReduced ? {} : { y: -5 }}
      >
        <motion.p
          className="mb-2 font-body text-lg text-muted md:text-xl"
          {...(pathsDone ? textItem(0) : {})}
        >
          {content.hero.greeting}
        </motion.p>
        <motion.h1
          className="font-heading text-4xl font-bold text-primary md:text-6xl"
          {...(pathsDone ? textItem(1) : {})}
        >
          {content.hero.name}
        </motion.h1>
        <motion.p
          className="mt-4 font-body text-xl font-semibold text-accent md:text-2xl"
          {...(pathsDone ? textItem(2) : {})}
        >
          {content.hero.subtitle}
        </motion.p>
      </motion.div>
    </section>
  );
}
