import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLanguage } from "../../i18n/LanguageContext";
import SkipLink from "./SkipLink";
import Nav from "./Nav";
import Hero from "../sections/Hero";
import About from "../sections/About";
import SkillsProjects from "../sections/SkillsProjects";
import Experience from "../sections/Experience";
import Certifications from "../sections/Certifications";
import Contact from "../sections/Contact";

export default function Layout() {
  const { language } = useLanguage();
  const prefersReduced = useReducedMotion();

  const fade = prefersReduced
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.3 },
      };

  return (
    <div className="min-h-screen bg-surface">
      <SkipLink />
      <Nav />
      <AnimatePresence mode="wait">
        <motion.main id="main-content" key={language} {...fade}>
          <Hero />
          <About />
          <SkillsProjects />
          <Experience />
          <Certifications />
          <Contact />
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
