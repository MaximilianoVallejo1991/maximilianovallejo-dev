import { useState, useEffect, useCallback, useRef, type MouseEvent } from "react";
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

// Idle "liquid" cue on the CV logo — the "MV" initials dissolve into a
// download icon and back, forever. Driven by a plain boolean toggled on
// an interval rather than one long keyframes array: Nav re-renders
// somewhat often (scroll, scroll-spy), and a multi-second keyframes
// animation has no way to resume cleanly if a render lands mid-tween —
// it was observed stalling for most of a leg before jumping to the next
// keyframe. A single target swap re-settles correctly on every render.
//
// No `filter: blur()` here on purpose — animating blur on a child of
// this header is a known Chrome compositor trap: the header itself
// uses `backdrop-blur-*`, and an animated child filter forces it to
// recompute that backdrop on every frame, tanking this to a handful
// of fps instead of interpolating smoothly.
const CV_MORPH_HOLD_MS = 1800;
const CV_MORPH_TRANSITION = { duration: 0.6, ease: "easeInOut" } as const;
const CV_MORPH_SETTLE = { duration: 0.25, ease: "easeOut" } as const;
const CV_MORPH_MV_VISIBLE = { opacity: 1, scale: 1 };
const CV_MORPH_MV_HIDDEN = { opacity: 0, scale: 0.55 };
const CV_MORPH_ICON_VISIBLE = { opacity: 1, scale: 1 };
const CV_MORPH_ICON_HIDDEN = { opacity: 0, scale: 0.55 };

export default function Nav() {
  const content = useContent();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cvMenuOpen, setCvMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("#hero");
  const [scrolled, setScrolled] = useState(false);
  const [showCvIcon, setShowCvIcon] = useState(false);
  const prefersReduced = useReducedMotion();
  const cvMenuRef = useRef<HTMLDivElement>(null);

  // Drives the CV logo's idle MV <-> download-icon loop. Paused (and
  // reset to "MV") while the language popover is open or reduced motion
  // is on, rather than just left running underneath it.
  useEffect(() => {
    if (prefersReduced || cvMenuOpen) {
      setShowCvIcon(false);
      return;
    }
    const id = window.setInterval(() => setShowCvIcon((v) => !v), CV_MORPH_HOLD_MS);
    return () => window.clearInterval(id);
  }, [prefersReduced, cvMenuOpen]);

  // Close the CV language picker on an outside click or Escape — it's a
  // popover sitting on top of the page, not a layout element like the
  // mobile nav drawer below, so it needs to behave like one.
  useEffect(() => {
    if (!cvMenuOpen) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (!cvMenuRef.current?.contains(e.target as Node)) {
        setCvMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCvMenuOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [cvMenuOpen]);

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
        <div ref={cvMenuRef} className="relative">
          <button
            type="button"
            onClick={() => setCvMenuOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={cvMenuOpen}
            className="relative inline-flex cursor-pointer items-center font-heading text-lg font-semibold text-primary transition-colors duration-200 hover:text-accent"
            title={content.downloadCvLabel}
            aria-label={content.downloadCvLabel}
          >
            <span className="relative inline-flex h-7 w-9 items-center justify-center">
              <motion.span
                className="flex h-full w-full items-center justify-center"
                animate={showCvIcon ? CV_MORPH_MV_HIDDEN : CV_MORPH_MV_VISIBLE}
                transition={prefersReduced ? undefined : cvMenuOpen ? CV_MORPH_SETTLE : CV_MORPH_TRANSITION}
              >
                MV
              </motion.span>
              {/* Persistent download cue — a hover-only title tooltip never
                  reaches touch devices, so the logo itself has to carry the
                  "this does something" signal by morphing into the download
                  icon on an idle loop. Stops once the menu is open — it's
                  served its purpose and a morphing logo next to an open menu
                  reads as distracting rather than inviting. */}
              <motion.span
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center text-accent"
                animate={showCvIcon ? CV_MORPH_ICON_VISIBLE : CV_MORPH_ICON_HIDDEN}
                transition={prefersReduced ? undefined : cvMenuOpen ? CV_MORPH_SETTLE : CV_MORPH_TRANSITION}
              >
                <IconMap name="download" className="h-5 w-5" />
              </motion.span>
            </span>
          </button>

          {/* CV language picker — the portfolio and the CV are separate
              documents with independent languages: this always offers
              both regardless of which language the site is currently
              showing, rather than following LanguageSwitch. */}
          <AnimatePresence>
            {cvMenuOpen && (
              <motion.div
                key="cv-menu"
                role="menu"
                initial={{ opacity: 0, y: -4, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.97 }}
                transition={prefersReduced ? MENU_INSTANT : { duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-0 top-full z-50 mt-2 min-w-[11rem] overflow-hidden rounded-lg border border-border bg-surface py-1 shadow-lg"
              >
                <a
                  role="menuitem"
                  href="/cv.pdf"
                  download="MaximilianoVallejoCV.pdf"
                  onClick={() => setCvMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-primary no-underline transition-colors duration-150 hover:bg-border/50 hover:text-accent"
                >
                  {content.downloadCvEs}
                </a>
                <a
                  role="menuitem"
                  href="/cv.en.pdf"
                  download="MaximilianoVallejoCV-EN.pdf"
                  onClick={() => setCvMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-primary no-underline transition-colors duration-150 hover:bg-border/50 hover:text-accent"
                >
                  {content.downloadCvEn}
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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
            aria-controls="mobile-nav-menu"
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
            id="mobile-nav-menu"
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
