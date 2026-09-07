/* Data model types for the portfolio.
   Both content.es.ts and content.en.ts must satisfy PortfolioContent.
   Shape parity is enforced at build time by TypeScript. */

import type { BranchAccentKey } from "../lib/branchAccent";

export type Lang = "es" | "en";

export interface SiteMeta {
  title: string;
  description: string;
  author: string;
  siteUrl: string;
}

export interface HeroData {
  greeting: string;
  name: string;
  subtitle: string;
  nodes: [string, string, string, string, string];
  mobileGreeting: string;
  mobileName: string;
  mobileSubtitle: string;
}

export interface AboutData {
  paragraphs: string[];
  mobileParagraphs?: string[];
  photoUrl: string;
  photoAlt: string;
}

export interface Skill {
  name: string;
  icon: string;
}

export interface SkillCategory {
  category: string;
  categoryKey: string;
  items: Skill[];
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  techTags: string[];
  liveUrl?: string;
  repoUrl: string;
  screenshot: string;
}

export interface HoverIllumination {
  /**
   * How many one-year connector segments to light up going BACKWARD
   * (toward earlier milestones) when this milestone is hovered. The
   * timeline scale is built one spacer segment per year (see
   * buildTimelineWithSpacers in lib/timelineScale.ts), so this is a plain
   * count — e.g. 3 lights the nearest 3 segments before this milestone,
   * regardless of how many milestones those segments span.
   */
  upwardsYears?: number;
  /** Same as `upwardsYears`, but counting FORWARD (toward later milestones). */
  downwardsYears?: number;
}

export interface Milestone {
  year: string;
  title: string;
  description: string;
  photoUrl?: string;
  hoverIllumination?: HoverIllumination;
}

export interface ExperienceBranch {
  branchKey: string;
  branchLabel: string;
  accentKey: BranchAccentKey;
  icon: string;
  milestones: Milestone[];
}

export interface ExperienceData {
  branches: ExperienceBranch[];
  convergenceLabel: string;
  /**
   * Shared label used both as the `year` and `title` of a synthetic
   * "present" milestone appended (at render time, not stored per-branch)
   * to any branch whose real last milestone doesn't already reach
   * CURRENT_YEAR — see getBranchLayout in lib/timelineScale.ts. Also
   * reused verbatim by branches whose real data already ends open-ended
   * (e.g. "Continua"/"Ongoing"), which resolve to CURRENT_YEAR directly.
   */
  presentLabel: string;
  /** Label above the desktop divergence graphic (the single origin point
   * the 3 branches fan out from) — the full name. */
  originLabel: string;
  /** Same origin label, shorter, for the mobile merged timeline. */
  originLabelMobile: string;
}

export interface CertItem {
  title: string;
  issuer?: string;
  year: string;
  description: string;
  thumbnailUrl: string;
  imageUrl: string;
  pdfUrl?: string;
}

export interface CertCategory {
  category: string;
  categoryKey: string;
  items: CertItem[];
}

export type CertFilter = "all" | "formal" | "tecnica" | "extracurricular";

export interface ContactLinkLabels {
  email: string;
  linkedin: string;
  github: string;
}

export interface ContactData {
  email: string;
  linkedin: string;
  github: string;
  cta: string;
  linkLabels: ContactLinkLabels;
}

export interface ConstructionBanner {
  label: string;
  message: string;
}

export interface NavLinkData {
  href: string;
  label: string;
}

/** Image URLs shared verbatim between content.es.ts and content.en.ts.
    Single source of truth so both locales stay in sync. */
export const IMAGE_URLS = {
  aboutPhoto:
    "https://res.cloudinary.com/dc3kybsmr/image/upload/v1752021992/max_foto_yqzdwl.png",
} as const;

/** Per-project screenshot/live/repo URLs — identical in both locales
    (a live demo or a GitHub repo has no language). Keyed by slug. */
export const PROJECT_ASSETS = {
  stockControl: {
    screenshot:
      "https://res.cloudinary.com/dc3kybsmr/image/upload/c_fill,g_north,h_450,w_800/f_auto/q_auto/projects/stock-control.png",
    liveUrl: "https://stockdetienda.vercel.app",
    repoUrl: "https://github.com/MaximilianoVallejo1991/stock-controll-main",
  },
  elianapp: {
    screenshot:
      "https://res.cloudinary.com/dc3kybsmr/image/upload/c_fill,g_north,h_450,w_800/f_auto/q_auto/projects/elianapp.png",
    liveUrl: "https://elianapp.vercel.app",
    repoUrl: "https://github.com/MaximilianoVallejo1991/ElianApp",
  },
  countdownChristmas: {
    screenshot:
      "https://res.cloudinary.com/dc3kybsmr/image/upload/c_fill,g_north,h_450,w_800/f_auto/q_auto/projects/countdown-christmas.png",
    liveUrl: "https://tochristmas.vercel.app",
    repoUrl: "https://github.com/MaximilianoVallejo1991/CountdownToChristmas",
  },
} as const;

export interface PortfolioContent {
  meta: SiteMeta;
  construction: ConstructionBanner;
  hero: HeroData;
  about: AboutData;
  skills: SkillCategory[];
  projects: Project[];
  experience: ExperienceData;
  certifications: CertCategory[];
  contact: ContactData;
  navLinks: NavLinkData[];
  skipLink: string;
  footerCredits: string;
  footerBackToTop: string;
  navAriaLabel: string;
  navOpenMenu: string;
  navCloseMenu: string;
}
