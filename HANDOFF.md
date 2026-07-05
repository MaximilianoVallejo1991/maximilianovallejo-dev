# Handoff — Portfolio Launch (maximilianovallejo-dev)

> Punto de entrada para retomar este proyecto en otra IA, otra sesión, o después de un tiempo.
> Última actualización: 2026-07-05

## TL;DR

Portfolio personal bilingüe (ES/EN) de Maximiliano Vallejo. Single-page React 19 + Vite + Tailwind v4 + `motion`, deploy en Vercel. 7 secciones. Hero con animación SVG convergente de 4 cuadrantes. Imágenes con placeholders picsum, PDFs locales, datos en TS.

**Stack final**: Vite 6 + React 19 + TS 5 + Tailwind v4 (CSS-first) + `motion` v12 + Cloudinary (raw URLs, sin SDK). Sin i18n lib, sin router, sin backend.

**Estado actual**: Implementación completa (26/26 tareas), build limpio. **Verify FAILED con 3 CRITICAL issues** — el código está pusheado a GitHub pero tiene issues conocidos sin arreglar. Decisión del usuario: pushear primero, arreglar después.

## Project Context

**Sujeto**: Maximiliano Vallejo, junior full stack dev en transición. Historia única:
- 20 años Scout → Instructor Scout
- 11 años mecánica industrial (PLCs Siemens LOGO!8, diseño/fabricación de maquinaria)
- 3-4 años Guía de sitio habilitado por Parques Nacionales del Aconquija
- 4 años soporte IT/seguridad en Poder Judicial de Tucumán
- 3 años programación autodidacta
- 2 años Emme 3D (10 impresoras 3D, diseño industrial)

**Stack del sujeto**: React 19, TypeScript, Node.js, Express, Prisma, PostgreSQL, MySQL, JWT, Vite, Tailwind, motion.

**Diferenciador declarado**: Spec-driven Development, evaluación de modelos, optimización de contextos para IA.

**Proyectos destacados** (3 visibles):
1. Stock Control — POS & Inventory (Node, Express, Prisma, PostgreSQL, React) — repo: `MaximilianoVallejo1991/stock-controll-main`
2. ElianApp — Collaborative Expense Tracking (React 19, Express 5, Prisma 7, PostgreSQL, JWT) — live: `elian-app-frontend.vercel.app`
3. Countdown to Christmas — countdown app (JS, HTML, CSS) — live: `tochristmas.vercel.app`

**Contacto**: jmaximilianovallejo@gmail.com · LinkedIn: linkedin.com/in/maximiliano-vallejo/ · GitHub: MaximilianoVallejo1991

## Estructura de Secciones (implementada)

1. **Hero** — 4 paths SVG animados convergentes desde cuadrantes (Voluntariado/Industria/Tech/Oficios) hacia centro "Desarrollador Full Stack"
2. **Sobre mí** — bio narrativa + foto
3. **Habilidades** — grid 4 categorías (Frontend, Backend, Tools, Industrial)
4. **Proyectos** — 3 cards con screenshot, descripción, tech tags, links
5. **Trayectoria** — 4 tracks (Voluntariado, Industria, Tech, Oficios) con milestones
6. **Certificaciones** — cards en 3 categorías (Formal/Técnica/Extracurricular) con tabs
7. **Contacto** — links email/LinkedIn/GitHub
+ Footer + Sticky nav con scroll-spy + Modo oscuro/claro + Switch ES/EN

## SDD State (current)

| Artifact | Status | Location |
|----------|--------|----------|
| Init | done | `.atl/skill-registry.md`, engram `sdd-init-go-cheap/maximilianovallejo-dev` |
| Explore | done | `.atl/changes/portfolio-launch/explore.md` |
| Proposal | done | `.atl/changes/portfolio-launch/proposal.md` |
| Spec | done | `.atl/changes/portfolio-launch/spec.md` |
| Design | done | `.atl/changes/portfolio-launch/design.md` |
| Tasks | done | `.atl/changes/portfolio-launch/tasks.md` |
| Apply | done | `.atl/changes/portfolio-launch/apply-progress.md` (26/26 tasks) |
| Verify | **FAILED** | `.atl/changes/portfolio-launch/verify-report.md` (3 CRITICAL, 5 WARNING, 3 SUGGESTION) |
| Archive | pending | — blocked until verify passes |

**Change name**: `portfolio-launch`
**Mode**: interactive
**Artifact store**: hybrid (engram + `.atl/`)
**Delivery strategy**: exception-ok (maintainer approved size:exception)

## Skills Loaded Per Phase (user preference)

- **sdd-design**: `ui-ux-pro-max` (color, typography, layout intelligence, design tokens)
- **sdd-apply**: `ui-ux-pro-max` + `ponytail` (minimal code, YAGNI, stdlib-first)

> **Nota**: `ponytail` no existe como skill formal instalado. Su filosofía se inyectó directo en el prompt de sdd-apply como instrucciones explícitas.

## Locked Decisions (DO NOT change without checking with user)

- i18n: ES default, EN switch, NO persistence, NO browser auto-detect, NO URL routing, NO additional languages
- Hero: stroke-only SVG paths, `motion.path` + `pathLength` animation
- Images: `https://picsum.photos/seed/{seed}/WxH` placeholders; single `PLACEHOLDER_BASE` constant for Cloudinary migration
- PDFs: `public/pdfs/`, links open `_blank`
- Certificate density: 10-12 curated, 3 categorías
- Photo density: 1 hero + 2-3 thumbnails per track (~12-15 total)
- Domain: deferred (Vercel default `maximilianovallejo-dev.vercel.app`)
- NO contact form, NO blog, NO analytics, NO test suite, NO Lenis, NO GSAP, NO framer-motion, NO react-i18next, NO Cloudinary SDK

## Known Issues (verify FAILED — 3 CRITICAL sin arreglar)

### 🔴 C1: SkillCard no renderiza iconos SVG
- **Spec**: _"Each skill SHALL display an icon (SVG, not emoji) and a label"_
- **File**: `src/components/ui/SkillCard.tsx`
- **Issue**: El componente solo renderiza `<span>{skill.name}</span>`. El campo `skill.icon` (e.g., `"react"`, `"typescript"`, `"docker"`) existe en ambos content files pero nunca se consume. No hay mapping de iconos ni renderizado SVG.
- **Impact**: 23 skills en 4 categorías se muestran como texto plano, sin iconos.

### 🔴 C2: 6 strings hardcodeados en español
- **Spec**: CROSS-3 _"Zero hardcoded user-facing strings in JSX"_
- **Files**:
  - `SkipLink.tsx:7` — `"Saltar al contenido"`
  - `Footer.tsx:14` — `"Construido con React, TypeScript, Tailwind CSS"`
  - `Footer.tsx:29` — `"Volver arriba"`
  - `Nav.tsx:64` — `aria-label="Navegación principal"`
  - `Nav.tsx:100` — `"Cerrar menú"` / `"Abrir menú"`
  - `Contact.tsx:51,78,104` — `"Email"`, `"LinkedIn"`, `"GitHub"`
- **Impact**: Al switchear a EN, estas strings quedan en español.

### 🔴 C3: Hero no respeta `prefers-reduced-motion`
- **Spec**: _"When prefers-reduced-motion is active, paths SHALL render in their final state instantly"_
- **File**: `src/components/sections/Hero.tsx`
- **Issue**: `useReducedMotion()` pone delays a 0 pero `motion.path` igual anima `pathLength: 0→1` vía JS rAF. El CSS no afecta animations de motion.
- **Fix**: When `prefersReduced` is true, set `initial={{ pathLength: 1 }}` y `animate={{ pathLength: 1 }}` (no animation).

### 🟡 WARNING (5) — No bloquean el push pero deberían arreglarse

- W1: `About.tsx` portrait sin `loading="lazy"`
- W2: SEO meta no dinámico por idioma (cambia `<title>` a EN)
- W3: `ThemeToggle` sin `whileTap={{ scale: 0.9 }}` micro-interaction
- W4: `Certifications.tsx` detecta idioma con `content.hero.greeting === "Hi, I'm"` (frágil)
- W5: Falta `will-change: path-length` en hero paths

### 💡 SUGGESTION (3) — Nice-to-have

- S1: Usar `useEffect(() => { document.title = content.meta.title }, [content])` para SEO dinámico
- S2: Mover Footer credits y back-to-top text a content data
- S3: Agregar labels bilingües para links de Contact (e.g., "Enviar correo" → "Send email")

## How to Fix the 3 CRITICAL

1. **SkillCard icons**:
   - Crear `src/components/ui/IconMap.tsx` con mapping de `skill.icon` → SVG component
   - Usar librerías como `simple-icons` o `lucide-react` (NO emoji, per spec)
   - Renderizar `<IconMap name={skill.icon} />` dentro de SkillCard

2. **Hardcoded strings**:
   - Agregar al `PortfolioContent` interface: `skipLink: string`, `footer: { credits: string, backToTop: string }`, `nav: { ariaLabel: string, openMenu: string, closeMenu: string }`, `contact: { linkLabels: { email: string, linkedin: string, github: string } }`
   - Llenar en `content.es.ts` y `content.en.ts`
   - Reemplazar strings hardcodeados en componentes

3. **Hero reduced-motion**:
   ```tsx
   const prefersReduced = useReducedMotion();
   <motion.path
     initial={{ pathLength: prefersReduced ? 1 : 0 }}
     animate={{ pathLength: 1 }}
     transition={{ duration: prefersReduced ? 0 : 0.35, delay: prefersReduced ? 0 : staggerDelay }}
   />
   ```

Después de los fixes, re-ejecutar `sdd-verify` y luego `sdd-archive`.

## Files Layout (implementado)

```
maximilianovallejo-dev/
├── .atl/                                    # SDD artifacts (gitignored)
├── public/
│   ├── robots.txt
│   └── pdfs/.gitkeep
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css                            # @import tailwindcss + @theme + dark + reduced motion
│   ├── data/
│   │   ├── content.ts                       # TypeScript interfaces
│   │   ├── content.es.ts                    # Spanish content
│   │   └── content.en.ts                    # English content
│   ├── i18n/
│   │   ├── LanguageContext.tsx
│   │   └── LanguageSwitch.tsx
│   ├── theme/
│   │   ├── ThemeContext.tsx
│   │   └── ThemeToggle.tsx
│   ├── hooks/
│   │   └── useContent.ts
│   ├── lib/
│   │   ├── placeholder.ts                   # PLACEHOLDER_BASE
│   │   └── cloudinary.ts                    # cldImg() (inactive)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.tsx
│   │   │   ├── Nav.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── SkipLink.tsx
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Skills.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── Experience.tsx
│   │   │   ├── Certifications.tsx
│   │   │   └── Contact.tsx
│   │   └── ui/
│   │       ├── SectionWrapper.tsx
│   │       ├── SkillCard.tsx                # ⚠️ CRITICAL: missing icon render
│   │       ├── ProjectCard.tsx
│   │       ├── CertCard.tsx
│   │       ├── Tag.tsx
│   │       └── TimelineNode.tsx
│   └── vite-env.d.ts
├── .gitignore
├── HANDOFF.md                               # este archivo
├── README.md                                # quick start + overview
├── index.html                               # SEO meta + OG tags
├── package.json                             # React 19.2.3, Vite 6.4.1, motion 12.23.25
├── package-lock.json
├── tsconfig.json
├── vite.config.ts                           # React + Tailwind v4 plugins
└── vercel.json                              # CSP + cache headers
```

## Build & Run

```bash
npm install
npm run dev      # dev server
npm run build    # production build (tsc + vite)
npm run preview  # preview production build
```

## Deploy

Vercel: `vercel.json` configurado con CSP headers y cache. Deploy automático al pushear a `main` si Vercel está conectado al repo.

**URL objetivo**: `maximilianovallejo-dev.vercel.app`

## Definition of Done (proposal) — 11/15 ✅

- [x] `npm run dev` sin errores
- [x] `npm run build` sin errores TS
- [x] 7 secciones renderizan contenido de `content.es.ts`
- [x] Switch ES/EN funciona (excepto los 6 strings en C2)
- [x] Dark/light toggle persiste en localStorage
- [⚠️] Hero SVG anima — pero no respeta `prefers-reduced-motion` (C3)
- [x] Secciones animan al scroll (opacity + translateY)
- [x] Scroll-spy highlights nav activo
- [x] Layout funcional a 375/768/1024/1440 sin scroll horizontal
- [x] Links externos abren en nueva pestaña
- [x] Todas las `<img>` tienen `alt`
- [x] Skip-to-content link visible en primer Tab
- [⚠️] SEO meta tags presentes (estáticos, no dinámicos por idioma)
- [⚠️] Accessibility — falta SkillCard icons (C1)
- [ ] Deployado en Vercel (pendiente de conectar)

## How to Resume (después de fixes)

1. Leer este archivo (`HANDOFF.md`)
2. Leer `.atl/changes/portfolio-launch/verify-report.md` (los 3 CRITICAL)
3. Arreglar los 3 CRITICAL (ver "How to Fix" arriba)
4. Re-correr `sdd-verify` para confirmar PASS
5. Si PASS, correr `sdd-archive` para sincronizar
6. Push los fixes al repo

## Open Risks

1. **Hero `pathLength` puede fallar si paths son filled (no stroked)** — design valida con stroke-only ✅
2. **Tailwind v4 CSS-first es nuevo, sin `tailwind.config.js`** — documentado en README
3. **Cambio de idioma puede causar layout shift con textos largos** — sin testear con strings largos

## Key Learnings (de apply phase)

- `motion` v12 usa entry point `motion/react` para React bindings (AnimatePresence, useInView, useReducedMotion)
- `motion` v12 type system requiere tuple easings (`[number, number, number, number]`) — `number[]` falla
- Tailwind v4 dark mode: `.dark` class + CSS custom property overrides en `index.css`
