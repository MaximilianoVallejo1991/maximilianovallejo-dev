# Handoff — Portfolio Launch (maximilianovallejo-dev)

> Punto de entrada para retomar este proyecto en otra IA, otra sesión, o después de un tiempo.
> Última actualización: 2026-11-07

## TL;DR

Portfolio personal bilingüe (ES/EN) de Maximiliano Vallejo. Single-page React 19 + Vite + Tailwind v4 + `motion`, deploy en Vercel. 7 secciones. Hero con animación SVG convergente de 4 cuadrantes que se dibujan desde el centro hacia las esquinas. Imágenes con placeholders picsum, PDFs locales, datos en TS.

**Stack final**: Vite 6 + React 19 + TS 5 + Tailwind v4 (CSS-first) + `motion` v12 + Cloudinary (raw URLs, sin SDK). Sin i18n lib, sin router, sin backend.

**Estado actual**: Contenido actualizado con experiencia real de LinkedIn/GitHub. 3 CRITICAL fixes aplicados y verificados. Hero con animación mejorada (stagger text, hover lift, labels navegables). CV descargable desde logo MV. 6 proyectos visibles (ver sesión 2026-11-07).

## Project Context

**Sujeto**: Maximiliano Vallejo, junior full stack dev en transición. Trayectoria única:
- 10+ años taller mecánico (PLCs Siemens LOGO!8, diseño/fabricación de maquinaria)
- Emme 3D (10 impresoras 3D, diseño industrial)
- Coordinador de ventas y logística (Ladrillos Macizos Concepción)
- Guía de Parque Nacional del Aconquija
- 20 años Scout → Instructor Scout
- Soporte IT/Seguridad en Poder Judicial de Tucumán (actual)
- 3 años programación autodidacta → Full Stack

**Stack del sujeto**: React 19, TypeScript, Node.js, Express, Prisma, PostgreSQL, JWT, Vite, Tailwind CSS v4, motion, Docker, Git.

**Proyectos destacados** (6 visibles):
1. Stock Control — POS & Inventory — repo: `MaximilianoVallejo1991/stock-controll-main`
2. ElianApp — Collaborative Expense Tracking — live: `elian-app-frontend.vercel.app`, repo: `MaximilianoVallejo1991/ElianApp`
3. Countdown to Christmas — live: `tochristmas.vercel.app/`, repo: `MaximilianoVallejo1991/CountdownToChristmas`
4. Minijuegos — motor de minijuegos educativos (Flutter) — live: `maximilianovallejo1991.github.io/minigames-engine/`, repo: `MaximilianoVallejo1991/minigames-engine`
5. Invitación 15 de Sofía — live: `sofialarcon15.vercel.app`, repo: `MaximilianoVallejo1991/SofiAlarcon15`
6. InventoryBot — panel interno de inventario (Next.js + Supabase) — **repo privado** (`inventary-bot`), sin `repoUrl`/`liveUrl` en el card; solo screenshots (ver sesión 2026-11-07 para el detalle de por qué y cómo se redactaron)

**Contacto**: jmaximilianovallejo@gmail.com · LinkedIn: linkedin.com/in/maximiliano-vallejo/ · GitHub: MaximilianoVallejo1991

## Estructura de Secciones (implementada)

1. **Hero** — 4 paths SVG animados desde centro → esquinas (1.2s c/u, staggered 0.3s). Contenido central: fade in + staggered text (saludo→nombre→subtítulo). Hover: centro y labels se elevan suavemente. Labels clickeables navegan a #experience/#skills.
2. **Sobre mí** — bio narrativa de transición (taller → PLCs → 3D → software)
3. **Habilidades** — grid 4 categorías (Frontend, Backend, Tools, Industrial)
4. **Proyectos** — 3 cards con screenshot, descripción, tech tags, links
5. **Trayectoria** — 4 tracks (Voluntariado, Industria, Tech, Oficios) con milestones detallados
6. **Certificaciones** — cards en 3 categorías (Formal/Técnica/Extracurricular) con tabs
7. **Contacto** — links email/LinkedIn/GitHub
+ Footer + Sticky nav con scroll-spy + Modo oscuro/claro + Switch ES/EN + CV descargable desde "MV"

## SDD State (current)

| Artifact | Status | Location |
|----------|--------|----------|
| Init | done | `.atl/skill-registry.md`, engram `sdd-init-go-cheap/maximilianovallejo-dev` |
| Explore | done | `.atl/changes/portfolio-launch/explore.md` |
| Proposal | done | `.atl/changes/portfolio-launch/proposal.md` |
| Spec | done | `.atl/changes/portfolio-launch/spec.md` |
| Design | done | `.atl/changes/portfolio-launch/design.md` |
| Tasks | done | `.atl/changes/portfolio-launch/tasks.md` |
| Apply | done | `.atl/changes/portfolio-launch/apply-progress.md` (26/26 tasks + fixes) |
| Verify | **PASS** | 3 CRITICAL fixes resueltos, build limpio |
| Archive | pending | — |

**Change name**: `portfolio-launch`
**Mode**: interactive
**Artifact store**: hybrid (engram + `.atl/`)
**Delivery strategy**: exception-ok (maintainer approved size:exception)

## Skills Loaded Per Phase (user preference)

- **sdd-design**: `ui-ux-pro-max` (color, typography, layout intelligence, design tokens)
- **sdd-apply**: `ui-ux-pro-max` + `ponytail` (minimal code, YAGNI, stdlib-first)

## Locked Decisions (DO NOT change without checking with user)

- i18n: ES default, EN switch, NO persistence, NO browser auto-detect, NO URL routing, NO additional languages
- Hero: stroke-only SVG paths, `motion.path` + `pathLength` animation, centro → esquinas
- Images: `https://picsum.photos/seed/{seed}/WxH` placeholders; single `PLACEHOLDER_BASE` constant for Cloudinary migration
- PDFs: `public/pdfs/`, links open `_blank`
- Certificate density: 10-12 curated, 3 categorías
- Domain: deferred (Vercel default `maximilianovallejo-dev.vercel.app`)
- NO contact form, NO blog, NO analytics, NO test suite, NO Lenis, NO GSAP, NO framer-motion, NO react-i18next, NO Cloudinary SDK
- CV descargable desde logo "MV" en nav (`public/cv.html`)
- Hero center content: quieto por defecto, hover lift, sin flote automático
- Labels cuadrantes: hover lift + click navega a #experience/#skills

## Session 2026-07-06 — Work Completed

### Sincronización
- Agregado remote `origin` apuntando a `MaximilianoVallejo1991/maximilianovallejo-dev`
- Renombrado `master` → `main`, hard reset a `origin/main`
- `npm install` → 87 packages

### Fix 3 CRITICAL Verify Issues
1. **C1 SkillCard icons**: Creado `IconMap.tsx` con 24 SVGs inline (react, typescript, postgresql, docker, postman, mysql, jwt, etc.). Actualizado `SkillCard.tsx` para renderizar `<IconMap name={skill.icon} />`.
2. **C2 Hardcoded strings**: Agregados campos i18n a `PortfolioContent`. Actualizados `SkipLink`, `Footer`, `Nav`, `Contact` para usar `useContent()`.
3. **C3 Hero reduced-motion**: `pathProps()` retorna `pathLength: 1` sin animate cuando `prefersReduced` está activo.

### Actualización de Contenido
- **About**: Reescripto con narrativa de transición (taller → PLCs → 3D → software) basada en LinkedIn/GitHub del usuario
- **Experience tracks**: Tech ahora muestra Full Stack (2023-actualidad) + Soporte Poder Judicial (2022-actualidad como CURRENT). Industria: Técnico Mecánico (2009-2020) + nuevo Coordinador Ventas (2017-2022). Oficios: Emme 3D (2020-2022). Voluntariado: + Guía Parque del Aconquija (2019-2023)
- **Projects**: Descripciones actualizadas, URLs de repos y live corregidas
- **Skills**: Agregados Postman, MySQL, JWT con iconos SVG
- **Contact**: URLs corregidas a perfiles reales

### Hero Animation
- Paths invertidos: dibujan desde centro (400,300) hacia las esquinas
- Duración aumentada a 1.2s c/u, delays [0, 0.3, 0.6, 0.9]
- Texto central: entrada escalonada (stagger 0.15s) con slide-up
- Hover: centro se eleva (y: -5), labels se elevan (y: -3)
- Labels clickeables: Voluntariado→#experience, Industria→#experience, Tecnología→#skills, Oficios→#experience
- Paths extendidos hasta posición de labels (64,90 / 736,90 / 64,480 / 736,480)

### CV
- Creado `cv.html` (root + `public/`) con diseño limpio ATS-friendly
- Header azul con nombre, título, contacto
- Secciones: Sobre mí → Tecnologías → Proyectos → Experiencia → Formación → Idiomas
- Logo "MV" en nav descarga el CV (`download="Maximiliano_Vallejo_CV.html"`)

### Build
- `tsc -b && vite build` — 0 errores, 456 modules

## Session 2026-11-07 — Work Completed

### Sincronización
- El local estaba 5 commits atrás de `origin/main` (CV regenerado, email de contacto actualizado, banner "under construction" removido, cue de descarga del CV animado, hito 2015 de Ladrillos Macizos). `git pull --ff-only` sin conflictos.
- Verificado que el deploy de producción en Vercel coincide siempre con `origin/main` (build automático por push a GitHub).

### 3 proyectos nuevos en la sección Proyectos
Datos (descripción, stack) sacados directamente de GitHub (`gh repo view` / `gh api .../languages` / `package.json` / `pubspec.yaml`), no inventados.

1. **Minijuegos** (`minigames-engine`) — Flutter + Dart + go_router, motor de minijuegos educativos data-driven (temas intercambiables solo con datos). Primer juego: trivia de ruleta sobre reciclaje. Deploy en GitHub Pages. Repo público.
2. **Invitación 15 de Sofía** (`SofiAlarcon15`) — React 19 + Vite + Tailwind v4 + lucide-react. Invitación web interactiva (countdown, galería, confirmación, regalos). Deploy en Vercel. Repo público.
3. **InventoryBot** (`inventary-bot`, nombre interno real del repo `eset-inventory-web`) — Next.js 15 + React 19 + Supabase + TypeScript. Panel interno de solo lectura para inventario de equipos, sincronizado a diario desde un bot en Google Apps Script. **Repo privado** (confidencialidad del cliente) y sin demo activa (el usuario pausó el backend/DB en Supabase — plan free solo permite 2 proyectos activos simultáneos, y priorizó dejar activo ElianApp). Pendiente a futuro: migrar la DB de ElianApp a otra cuenta de Supabase del usuario para poder reactivar ambos (no abordado esta sesión, el usuario pidió dejarlo para después).

### Cambios de modelo de datos (`src/data/content.ts`)
- `Project.repoUrl` pasó de obligatorio a **opcional** — necesario para InventoryBot, que no tiene un repo público al que linkear.
- Nuevo campo opcional `Project.screenshotHover` — segunda imagen que reemplaza a `screenshot` en hover (crossfade). Se usa solo en InventoryBot (login → vista interna). `ProjectCard.tsx` ahora: (a) no renderiza el link "GitHub →" si falta `repoUrl`, (b) apila un `<img>` absoluto con `opacity-0 group-hover:opacity-100` cuando hay `screenshotHover`.

### Screenshots de InventoryBot — redacción de datos sensibles
El usuario pasó dos capturas reales del panel (`Login-inventary-bot.png`, `inside-inventary-bot.png`, en `C:\Users\jmaxi\OneDrive\Imágenes\Screenshots\`) que contenían datos de producción reales: nombre de la empresa dueña del sistema, apellidos de empleados, códigos de oficina, IPs internas, y el email de sesión del usuario. Antes de subir nada se confirmó con el usuario qué se podía mostrar.

Redacción aplicada (con `Pillow`, instalado ad-hoc vía `pip install Pillow` — no es dependencia del proyecto) usando **blur real** (`ImageFilter.GaussianBlur`, no cajas sólidas) sobre las coordenadas exactas, detectadas por escaneo de píxeles columna por columna (no por métricas de fuente, que no coincidían con la fuente real de la app):
- Nombre de la empresa (header) y email de sesión: blureados por completo.
- Apellidos: blureados; nombres de pila visibles (incluido un caso con orden invertido "Apellido Nombre" en los datos de origen, manejado como caso especial).
- Hostnames de equipos: ~42% inicial visible, resto blureado.
- Oficina e IP: columnas enteras blureadas, nada visible.
- Fila "CAMARAS" (no es una persona): sin tocar.

Resultado: `Login-inventary-bot-redacted.png` / `inside-inventary-bot-redacted.png`, en la misma carpeta junto a los originales sin redactar (los originales **no** se subieron a ningún lado).

### Assets subidos a Cloudinary (`dc3kybsmr`, carpeta `projects/`)
- `projects/minigames-engine.jpg` y `projects/sofia-15.jpg` — capturados en vivo con automatización de Chrome (viewport 1600×900) contra los demos desplegados.
- `projects/inventary-bot-login.png` y `projects/inventary-bot-inside.png` — las dos versiones ya redactadas, subidas vía `sign-upload` (firma) + `curl` directo a la Upload API (archivos locales, no soportado por `upload-asset`).
- Las URLs en `content.ts` no fijan versión, así que un futuro re-upload con el mismo `public_id` se refleja solo, sin tocar código.

### Verificación
- `tsc -b` limpio, `vitest run` → 71/71 tests OK.
- Server de dev levantado (`pnpm dev`, **no** `npm` — el repo fuerza pnpm vía `scripts/check-package-manager.mjs`) y revisado visualmente en Chrome: las 6 cards, el hover de InventoryBot (cambio de imagen, sin links) y el hover de Minijuegos (con GitHub + Live) andan como se espera.

### Commit
`e0f37ec` — `feat(projects): add Minijuegos, Sofía's 15th invitation, and InventoryBot` — pusheado a `origin/main`.

## Definition of Done (proposal) — 14/15 ✅

- [x] `npm run dev` sin errores
- [x] `npm run build` sin errores TS
- [x] 7 secciones renderizan contenido de `content.es.ts`
- [x] Switch ES/EN funciona (zero hardcoded strings)
- [x] Dark/light toggle persiste en localStorage
- [x] Hero SVG anima (centro → esquinas, 1.2s, staggered)
- [x] Hero respeta `prefers-reduced-motion`
- [x] Secciones animan al scroll (opacity + translateY)
- [x] Scroll-spy highlights nav activo
- [x] Layout funcional a 375/768/1024/1440 sin scroll horizontal
- [x] Links externos abren en nueva pestaña
- [x] Todas las `<img>` tienen `alt`
- [x] Skip-to-content link visible en primer Tab
- [x] SEO meta tags presentes (estáticos)
- [ ] Deployado en Vercel (pendiente de conectar)

## How to Resume

1. Leer este archivo (`HANDOFF.md`)
2. Si hay cambios pendientes, correr `sdd-archive` para cerrar el cambio
3. Para deploy: conectar repo a Vercel, push a `main` dispara deploy automático
4. Para modificar contenido: editar `src/data/content.es.ts` y `content.en.ts`
5. Para modificar CV: editar `public/cv.html`

## Files Layout (implementado)

```
maximilianovallejo-dev/
├── .atl/                                    # SDD artifacts (gitignored)
├── public/
│   ├── cv.html                              # CV descargable
│   ├── robots.txt
│   └── pdfs/.gitkeep
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css                            # @import tailwindcss + @theme + dark + reduced motion
│   ├── data/
│   │   ├── content.ts                       # TypeScript interfaces + new i18n fields
│   │   ├── content.es.ts                    # Spanish content (actualizado Jul 2026)
│   │   └── content.en.ts                    # English content (actualizado Jul 2026)
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
│   │   │   ├── Nav.tsx                      # MV descarga CV
│   │   │   ├── Footer.tsx                   # i18n
│   │   │   └── SkipLink.tsx                 # i18n
│   │   ├── sections/
│   │   │   ├── Hero.tsx                     # centro→esquinas, staggered text, hover lift, labels navegables
│   │   │   ├── About.tsx
│   │   │   ├── Skills.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── Experience.tsx
│   │   │   ├── Certifications.tsx
│   │   │   └── Contact.tsx                  # i18n
│   │   └── ui/
│   │       ├── SectionWrapper.tsx
│   │       ├── SkillCard.tsx                # IconMap render
│   │       ├── IconMap.tsx                  # 27 inline SVGs
│   │       ├── ProjectCard.tsx
│   │       ├── CertCard.tsx
│   │       ├── Tag.tsx
│   │       └── TimelineNode.tsx
│   └── vite-env.d.ts
├── cv.html                                  # CV (copia)
├── .gitignore
├── HANDOFF.md                               # este archivo
├── README.md
├── index.html
├── package.json
├── vite.config.ts
└── vercel.json
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

## Key Learnings (de apply phase)

- `motion` v12 usa entry point `motion/react` para React bindings (AnimatePresence, useInView, useReducedMotion)
- `motion` v12 type system requiere tuple easings (`[number, number, number, number]`) — `number[]` falla
- Tailwind v4 dark mode: `.dark` class + CSS custom property overrides en `index.css`
- `useReducedMotion()` de motion setea delays a 0 pero sigue animando via JS rAF — hay que condicionalmente evitar `animate` por completo
- SVG `pathLength` revela desde el start point (`M`) hacia el end point — invertir la dirección del path invierte el sentido de drawing
- Para hover-only lift, `whileHover` de motion es más limpio que auto-float looping
