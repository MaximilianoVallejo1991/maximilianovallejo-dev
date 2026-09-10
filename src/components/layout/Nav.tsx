import { useState, useEffect, useCallback, type MouseEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useContent } from "../../hooks/useContent";
import LanguageSwitch from "../../i18n/LanguageSwitch";
import ThemeToggle from "../../theme/ThemeToggle";
import IconMap from "../ui/IconMap";

const SCROLL_THRESHOLD = 8;

const INDICATOR_TRANSITION = { type: "spring", stiffness: 380, damping: 32 } as const;
const INDICATOR_INSTANT = { duration: 0 } as const;

const MENU_TRANSITION = { duration: 0.24, ease: [0.16, 1, 0.3, 1] } as const;
const MENU_INSTANT = { duration: 0 } as const;

// Idle "breathing" cue on the CV badge — signals the logo is downloadable
// without a hover-only tooltip (which mobile/touch never sees). Loops
// indefinitely; disabled entirely under reduced motion, where the badge
// just sits at its resting scale/opacity instead of pulsing.
const CV_BADGE_PULSE = {
  scale: [1, 1.18, 1],
  opacity: [0.75, 1, 0.75],
};
const CV_BADGE_TRANSITION = { duration: 2.2, repeat: Infinity, ease: "easeInOut" } as const;

export default function Nav() {
  const content = useContent();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("#hero");
  const [scrolled, setScrolled] = useState(false);
  const prefersReduced = useReducedMotion();

  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      const header = document.querySelector("header");
      const h = header?.offsetHeight ?? 56;
      const y = target.getBoundingClientRect().top + window.scrollY - h;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Scroll-spy via IntersectionObserver
  const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    // Find the first section that is mostly visible
    for (const entry of entries) {
      if (entry.isIntersecting) {
        setActiveSection("#" + entry.target.id);
        break;
      }
    }
  }, []);

  useEffect(() => {
    const sectionIds = content.navLinks.map((l) => l.href);
    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    });

    const elements: Element[] = [];
    for (const id of sectionIds) {
      const el = document.querySelector(id);
      if (el) {
        observer.observe(el);
        elements.push(el);
      }
    }

    // Hero fallback when at top
    const onScroll = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
      if (window.scrollY < 100) {
        setActiveSection("#hero");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [handleIntersect, content.navLinks]);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-shadow duration-200 ${
        scrolled
          ? "border-border bg-surface/95 shadow-sm backdrop-blur-md"
          : "border-transparent bg-surface/90 backdrop-blur-sm"
      }`}
    >
      <nav
        aria-label={content.navAriaLabel}
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3"
      >
        <a
          href="/cv.pdf"
          download="MaximilianoVallejoCV.pdf"
          className="relative inline-flex font-heading text-lg font-semibold text-primary no-underline transition-colors duration-200 hover:text-accent"
          title={content.downloadCvLabel}
          aria-label={content.downloadCvLabel}
        >
          MV
          {/* Persistent download cue — a hover-only title tooltip never
              reaches touch devices, so the badge itself has to carry the
              "this does something" signal via a slow idle pulse instead. */}
          <motion.span
            aria-hidden="true"
            animate={prefersReduced ? undefined : CV_BADGE_PULSE}
            transition={prefersReduced ? undefined : CV_BADGE_TRANSITION}
            className="absolute -right-2 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-accent bg-surface text-accent"
          >
            <IconMap name="download" className="h-2 w-2" />
          </motion.span>
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {content.navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`relative text-sm font-medium no-underline transition-colors duration-200 ${activeSection === link.href
                  ? "text-accent"
                  : "text-muted hover:text-accent"
                }`}
            >
              {link.label}
              {activeSection === link.href && (
                <motion.span
                  layoutId="nav-indicator-desktop"
                  data-testid="nav-indicator-desktop"
                  className="absolute -bottom-1.5 left-0 right-0 h-0.5 rounded-full bg-accent"
                  transition={prefersReduced ? INDICATOR_INSTANT : INDICATOR_TRANSITION}
                />
              )}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitch />
          <ThemeToggle />

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? content.navCloseMenu : content.navOpenMenu}
            aria-expanded={menuOpen}
            className="ml-2 cursor-pointer rounded-md p-1.5 text-muted transition-colors duration-200 hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 md:hidden"
          >
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={prefersReduced ? MENU_INSTANT : MENU_TRANSITION}
            className="overflow-hidden border-t border-border bg-surface md:hidden"
          >
            <div className="px-4 pb-4 pt-2">
              {content.navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative block rounded-md px-3 py-2 text-sm font-medium no-underline transition-colors duration-200 ${activeSection === link.href
                      ? "text-accent bg-accent/5"
                      : "text-muted hover:bg-border/50 hover:text-primary"
                    }`}
                >
                  {activeSection === link.href && (
                    <motion.span
                      layoutId="nav-indicator-mobile"
                      data-testid="nav-indicator-mobile"
                      className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-accent"
                      transition={prefersReduced ? INDICATOR_INSTANT : INDICATOR_TRANSITION}
                    />
                  )}
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
