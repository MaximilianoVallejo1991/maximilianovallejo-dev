import { motion, useReducedMotion } from "motion/react";
import { useTheme } from "./ThemeContext";
import { useLanguage } from "../i18n/LanguageContext";

const ICON_PX = 18;

const ICON_SHOWN = { opacity: 1, rotate: 0, scale: 1 } as const;
const ICON_HIDDEN = { opacity: 0, rotate: -90, scale: 0.6 } as const;

const ICON_TRANSITION = { duration: 0.28, ease: [0.16, 1, 0.3, 1] } as const;
const ICON_INSTANT = { duration: 0 } as const;

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { language } = useLanguage();
  const isDark = theme === "dark";
  const prefersReduced = useReducedMotion();
  const label = isDark
    ? language === "es"
      ? "Modo claro"
      : "Light mode"
    : language === "es"
      ? "Modo oscuro"
      : "Dark mode";

  return (
    <button
      onClick={toggleTheme}
      aria-label={label}
      className="cursor-pointer rounded-md p-1.5 text-muted transition-colors duration-200 hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
    >
      <span
        className="relative block"
        style={{ width: ICON_PX, height: ICON_PX }}
      >
        <motion.span
          className="absolute inset-0 block"
          initial={false}
          animate={isDark ? ICON_SHOWN : ICON_HIDDEN}
          transition={prefersReduced ? ICON_INSTANT : ICON_TRANSITION}
        >
          {/* Sun icon */}
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        </motion.span>

        <motion.span
          className="absolute inset-0 block"
          initial={false}
          animate={isDark ? ICON_HIDDEN : ICON_SHOWN}
          transition={prefersReduced ? ICON_INSTANT : ICON_TRANSITION}
        >
          {/* Moon icon */}
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </motion.span>
      </span>
    </button>
  );
}
