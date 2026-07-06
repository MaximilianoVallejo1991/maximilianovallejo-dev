// ponytail: minimal inline SVGs, distinguishable shapes. No icon lib dependency.
import type { JSX } from "react";

const icons: Record<string, JSX.Element> = {
  react: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="2" />
      <ellipse cx="12" cy="12" rx="10" ry="4" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
    </svg>
  ),
  typescript: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <path d="M8 12h8M8 16h5M15 8l-2 4 2 4" />
    </svg>
  ),
  nextjs: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 20h20L12 2z" />
      <path d="M16 20l-4-7-4 7" />
    </svg>
  ),
  tailwindcss: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5c-2 0-3.5 1-4.5 3 1-1 2.2-1.3 3.5-.5.6.4 1 .9 1.7 1.5C13.9 10.2 15.3 12 19 12c2 0 3.5-1 4.5-3-1 1-2.2 1.3-3.5.5-.6-.4-1-.9-1.7-1.5C17.1 6.8 15.7 5 12 5zM5 12c-2 0-3.5 1-4.5 3 1-1 2.2-1.3 3.5-.5.6.4 1 .9 1.7 1.5C6.9 17.2 8.3 19 12 19c2 0 3.5-1 4.5-3-1 1-2.2 1.3-3.5.5-.6-.4-1-.9-1.7-1.5C10.1 13.8 8.7 12 5 12z" />
    </svg>
  ),
  astro: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l5 16-5-4-5 4z" />
      <circle cx="12" cy="10" r="1.5" />
    </svg>
  ),
  html: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 3l2 18h12l2-18H4z" />
      <path d="M8 8h8M8 12h8M9 16h6" />
    </svg>
  ),
  javascript: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <path d="M9 8v5a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V8M15 14l-1 2 1 2" />
    </svg>
  ),
  nodejs: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L4 7v10l8 5 8-5V7z" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 9v6M9 12h6" />
    </svg>
  ),
  express: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h6l3-6 3 12 3-6h3" />
    </svg>
  ),
  postgresql: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v4c0 1.7 3.6 3 8 3s8-1.3 8-3V6" />
      <path d="M4 10v4c0 1.7 3.6 3 8 3s8-1.3 8-3v-4" />
      <line x1="4" y1="6" x2="4" y2="18" />
      <line x1="20" y1="6" x2="20" y2="18" />
    </svg>
  ),
  prisma: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L4 18l8 4 8-4z" />
      <path d="M12 10v12M8 14l8 4" />
    </svg>
  ),
  api: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12h4l2-5 4 10 4-10 2 5h4" />
      <circle cx="6" cy="8" r="1" />
      <circle cx="18" cy="16" r="1" />
    </svg>
  ),
  git: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="7" r="2" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
      <path d="M7 9v6M7 9c2-2 6-2 8 0" />
      <path d="M9 15c2 2 6 2 8 0" />
    </svg>
  ),
  docker: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <rect x="6" y="7" width="2" height="2" rx="0.5" />
      <rect x="10" y="7" width="2" height="2" rx="0.5" />
      <rect x="14" y="7" width="2" height="2" rx="0.5" />
      <rect x="8" y="11" width="2" height="2" rx="0.5" />
      <rect x="12" y="11" width="2" height="2" rx="0.5" />
      <path d="M2 17h20" />
    </svg>
  ),
  linux: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <ellipse cx="12" cy="9" rx="3" ry="1.5" />
      <ellipse cx="12" cy="16" rx="2" ry="1" />
      <path d="M8 13c1-1 3-1 4 0s3-1 4 0" />
      <circle cx="10" cy="10" r="0.8" />
      <circle cx="14" cy="10" r="0.8" />
      <path d="M12 19v-3" />
    </svg>
  ),
  vscode: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 3L6 8v8l10 5 4-3V6z" />
      <path d="M6 8l10 4v4M6 16l10-4V8" />
    </svg>
  ),
  figma: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="4" />
      <circle cx="15" cy="9" r="4" />
      <circle cx="9" cy="15" r="4" />
      <circle cx="15" cy="15" r="4" />
    </svg>
  ),
  vercel: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3L3 20h18z" />
    </svg>
  ),
  vite: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L3 12h5l-2 10 10-10h-5l3-10z" />
    </svg>
  ),
  wrench: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
};

interface IconMapProps {
  name: string;
  className?: string;
}

export default function IconMap({ name, className = "h-5 w-5 shrink-0 text-accent" }: IconMapProps) {
  const icon = icons[name];
  if (!icon) return null;
  return <span className={className}>{icon}</span>;
}
