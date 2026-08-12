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
  upwardsYears?: number;
  downwardsYears?: number;
}

export interface Milestone {
  year: string;
  title: string;
  description: string;
  photoUrl?: string;
  /** Deferred behavior: event handlers/styling for illumination are out of scope. */
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
}

export interface CertItem {
  title: string;
  issuer: string;
  year: string;
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
