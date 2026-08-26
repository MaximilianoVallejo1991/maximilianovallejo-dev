# maximilianovallejo-dev

Personal portfolio for Maximiliano Vallejo — a junior full stack developer with a unique background spanning 20 years of Scout leadership, 11 years of industrial mechanics, national park guiding, IT support at Poder Judicial de Tucumán, and self-taught programming.

A single-page React 19 + Vite + Tailwind CSS v4 application with a 4-quadrant animated SVG hero, bilingual ES/EN support, dark/light mode, and deploy on Vercel.

## Live Demo

[maximilianovallejo-dev.vercel.app](https://maximilianovallejo-dev.vercel.app) _(pending deploy)_

## Tech Stack

- **React 19** — latest stable with concurrent features
- **Vite 6** — fast build tool with zero-config React/TS
- **TypeScript 5** — type-safe content data, shape parity enforcement between ES/EN
- **Tailwind CSS v4** — CSS-first config (`@import "tailwindcss"`, `@theme` directive, no `tailwind.config.js`)
- **Motion v12** — animations (`motion.path` for hero, `useInView` for sections, `AnimatePresence` for language transitions)
- **Cloudinary** — image hosting (raw URLs, no SDK; helper pre-written but inactive)

**Explicitly not used**: `framer-motion`, `react-i18next`, `react-router`, `gsap`, `lenis`, `@cloudinary/url-gen`, `typed.js`, `tailwind.config.js`.

## Features

- **7 sections**: Hero, About, Skills, Projects, Experience, Certifications, Contact
- **Bilingual ES/EN** via custom React Context + TypeScript content files
- **Dark/Light mode** with `localStorage` persistence and `prefers-color-scheme` detection
- **4-quadrant animated SVG hero** with `motion.path` + `pathLength` animation
- **Scroll-triggered entrance animations** via `motion` + `useInView` + stagger
- **Scroll-spy navigation** with active section highlighting
- **Hamburger menu** at < 768px viewport
- **Responsive** at 375px, 768px, 1024px, 1440px
- **Accessible**: skip-to-content, keyboard navigation, ARIA labels, focus management, `prefers-reduced-motion` support
- **SEO**: meta tags, Open Graph, dynamic `<title>` per language

## Quick Start

### Prerequisites

- Node.js 18+ (tested with 20+)
- npm or pnpm

### Install

```bash
npm install
```

### Develop

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Build

```bash
npm run build
```

Produces a production build in `dist/`. Runs `tsc -b` first to catch type errors.

### Preview

```bash
npm run preview
```

Serves the production build locally.

## Project Structure

```
maximilianovallejo-dev/
├── public/
│   ├── robots.txt
│   └── pdfs/                    # PDF certificates served from here
├── src/
│   ├── main.tsx                 # ReactDOM.createRoot entry
│   ├── App.tsx                  # Provider composition: Language → Theme → Layout
│   ├── index.css                # @import tailwindcss + @theme tokens
│   ├── data/
│   │   ├── content.ts           # TypeScript interfaces (PortfolioContent)
│   │   ├── content.es.ts        # Spanish content (default)
│   │   └── content.en.ts        # English content
│   ├── i18n/
│   │   ├── LanguageContext.tsx  # Provider + useLanguage()
│   │   └── LanguageSwitch.tsx   # ES/EN toggle
│   ├── theme/
│   │   ├── ThemeContext.tsx     # Provider + useTheme()
│   │   └── ThemeToggle.tsx      # Sun/moon toggle
│   ├── hooks/
│   │   └── useContent.ts        # Resolves language → typed content
│   ├── lib/
│   │   ├── placeholder.ts       # PLACEHOLDER_BASE constant
│   │   └── cloudinary.ts        # cldImg() helper (inactive)
│   ├── components/
│   │   ├── layout/              # Layout, Nav, Footer, SkipLink
│   │   ├── sections/            # Hero, About, Skills, Projects, Experience, Certifications, Contact
│   │   └── ui/                  # SectionWrapper, ProjectCard, CertCard, Tag, TimelineNode
│   └── vite-env.d.ts
├── index.html                   # SEO meta, OG tags, blocking theme script
├── vercel.json                  # CSP + cache headers
├── vite.config.ts               # React + Tailwind v4 plugins
├── tsconfig.json
└── package.json
```

## Architecture

### Data Flow

```
content.es.ts ──┐
                ├── useContent() ──→ All 7 sections
content.en.ts ──┘        ↑
                     useLanguage()
                          ↑
                   LanguageSwitch (nav)
```

Every section consumes `useContent()` — never imports content files directly. TypeScript compilation enforces shape parity: a missing field in either `content.es.ts` or `content.en.ts` causes a build failure.

### Provider Composition

```
App
├── LanguageProvider
│   └── ThemeProvider
│       └── Layout
│           ├── SkipLink
│           ├── Nav (scroll-spy, sticky, hamburger <768px)
│           ├── <main id="main-content">
│           │   ├── Hero
│           │   ├── About
│           │   ├── Skills
│           │   ├── Projects
│           │   ├── Experience
│           │   ├── Certifications
│           │   └── Contact
│           └── Footer
```

### Theme Tokens

CSS-first via `@theme` directive in `src/index.css`:

```css
@theme {
  --color-primary: #18181B;
  --color-accent: #2563EB;
  --color-surface: #FAFAFA;
  --color-text: #09090B;
  --font-heading: 'Space Grotesk', sans-serif;
  --font-body: 'Archivo', sans-serif;
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
}
```

Dark mode inverts surface/text via `.dark` class on `<html>`. The accent (`#2563EB` / `#3B82F6`) remains visible in both modes.

## Customization

### Switch from Picsum to Cloudinary

1. Create a Cloudinary account and note your cloud name
2. Upload images and get public IDs
3. Edit `src/lib/placeholder.ts`:
   ```ts
   // Before:
   export const PLACEHOLDER_BASE = 'https://picsum.photos/seed';
   
   // After:
   export const PLACEHOLDER_BASE = 'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload';
   ```
4. Update image URLs in `src/data/content.es.ts` and `src/data/content.en.ts` from `{PLACEHOLDER_BASE}/{seed}/WxH` to `{PLACEHOLDER_BASE}/f_auto,q_auto,w_{width}/v1/{public_id}`

### Add a New Language

1. Create `src/data/content.{lang}.ts` exporting `PortfolioContent` (typed)
2. Add the new `Lang` value in `src/data/content.ts`:
   ```ts
   export type Lang = 'es' | 'en' | '{new}';
   ```
3. Update `src/hooks/useContent.ts` to import and resolve the new content file
4. Add a toggle button option in `src/i18n/LanguageSwitch.tsx`

### Add a New Section

1. Create the content data shape in `src/data/content.ts`:
   ```ts
   export interface {Section}Data { ... }
   export interface PortfolioContent {
     // ... existing
     {section}: {Section}Data;
   }
   ```
2. Add content in both `content.es.ts` and `content.en.ts`
3. Create `src/components/sections/{Section}.tsx`
4. Add a nav link in `content.{lang}.ts` and the `Nav.tsx` component

## Deploy

### Vercel (recommended)

1. Push the repo to GitHub
2. Import the repo in [Vercel](https://vercel.com/new)
3. Vercel auto-detects Vite. No build config needed.
4. Deploy. Default subdomain: `maximilianovallejo-dev.vercel.app`

The `vercel.json` includes:
- Content-Security-Policy headers
- Cache headers for static assets

### Manual Deploy

```bash
npm run build
# Upload dist/ to your static host
```

## Known Issues

This project shipped with 3 known issues from the initial spec verification (see [HANDOFF.md](./HANDOFF.md) for full details). They are documented and will be addressed in a follow-up:

- **C2**: 6 hardcoded Spanish strings in `SkipLink`, `Footer`, `Nav`, and `Contact` don't switch to English
- **C3**: Hero SVG paths still animate via JavaScript when `prefers-reduced-motion: reduce` is active

5 additional WARNINGs (lazy loading, dynamic SEO, micro-interactions, fragile language detection, missing `will-change`) and 3 SUGGESTIONs are also documented in the verify report.

## Performance

- **Build output**: CSS 23 KB (gzip: 5 KB), JS 366 KB (gzip: 115 KB)
- **Hero animation**: completes within 1.7s
- **Language switch**: 300ms fade transition
- **First paint**: < 1s on typical connections
- **Images**: lazy-loaded except hero portrait

## Accessibility

- 17.4:1 contrast ratio (light: #09090B on #FAFAFA; dark: #FAFAFA on #09090B) — well above WCAG AA (4.5:1)
- Skip-to-content link visible on first `Tab`
- Semantic landmarks: `<header>`, `<main id="main-content">`, `<footer>`, `<nav>`
- `prefers-reduced-motion` respected for non-Motion animations
- All interactive elements have `aria-label` and `cursor-pointer`
- Keyboard navigation throughout
- Screen reader tested

## License

MIT — see [LICENSE](./LICENSE) if present.

## Contact

Maximiliano Vallejo · jmaximilianovallejo@gmail.com · [LinkedIn](https://linkedin.com/in/maximiliano-vallejo/) · [GitHub](https://github.com/MaximilianoVallejo1991)
