import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useContent } from "../../hooks/useContent";

/* ────────────── Node config ──────────────
   SVG viewBox: 1000 × 700, center at (500, 350).
   Each branch has a 45° diagonal segment (circuit-like).

   ALL elements — paths, labels, AND center text — live inside the SVG
   so they share the same coordinate system regardless of screen size. */

interface NodeConfig {
  id: string;
  path: string;
  circleCx: number;
  circleCy: number;
  color: string;
  strokeWidth: number;
  label: string;
  textX: number;
  textY: number;
  textAnchor: "start" | "middle" | "end";
  target: string;
  fontSize: number;
}

function buildNodes(labels: [string, string, string, string, string]): NodeConfig[] {
  return [
    {
      id: "software",
      label: labels[3],
      path: "M 660 260 L 780 140 L 880 140",
      circleCx: 660,
      circleCy: 260,
      color: "#06B6D4",
      strokeWidth: 3,
      textX: 880,
      textY: 128,
      textAnchor: "middle",
      target: "#projects",
      fontSize: 11,
    },
    {
      id: "tecnico",
      label: labels[4],
      path: "M 760 320 L 840 240 L 950 240",
      circleCx: 760,
      circleCy: 320,
      color: "#94A3B8",
      strokeWidth: 3,
      textX: 930,
      textY: 228,
      textAnchor: "middle",
      target: "#certifications",
      fontSize: 10,
    },
    {
      id: "problemas",
      label: labels[2],
      path: "M 560 420 L 660 520 L 800 520",
      circleCx: 560,
      circleCy: 420,
      color: "#F97316",
      strokeWidth: 3,
      textX: 785,
      textY: 508,
      textAnchor: "middle",
      // Was "#skills" — that section is temporarily hidden (see
      // SkillsProjects.tsx), which left this pointing at a dead id and
      // silently no-oping on click/tap. Projects is the next closest fit
      // for "real problem solving" until Skills comes back.
      target: "#projects",
      fontSize: 9,
    },
    {
      id: "equipos",
      label: labels[1],
      path: "M 370 420 L 290 500 L 210 500",
      circleCx: 370,
      circleCy: 420,
      color: "#10B981",
      strokeWidth: 2,
      textX: 220,
      textY: 492,
      textAnchor: "middle",
      target: "#experience",
      fontSize: 8,
    },
    {
      id: "coordinacion",
      label: labels[0],
      path: "M 280 300 L 200 220 L 120 220",
      circleCx: 280,
      circleCy: 300,
      color: "#15803D",
      strokeWidth: 1,
      textX: 120,
      textY: 208,
      textAnchor: "middle",
      target: "#experience",
      fontSize: 9,
    },
  ];
}

/* ────────────── Component ────────────── */

export default function Hero() {
  const content = useContent();
  const nodes = buildNodes(content.hero.nodes);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const prefersReduced = useReducedMotion();
  const svgGrey = "#71717a";

  const scrollTo = (href: string) => {
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };

  /* Clockwise entrance order — Aplicación de Software first, then clockwise */
  const clockOrder = [0, 1, 2, 3, 4];
  const NODE_STAGGER_DESKTOP = 0.4;
  const NODE_STAGGER_MOBILE = 0.35;

  /* Text entrance order — greeting, name, subtitle (top to bottom) */
  const textOrder = [0, 1, 2] as const;
  const TEXT_STAGGER_DESKTOP = 0.18;
  const TEXT_STAGGER_MOBILE = 0.15;
  const TEXT_BASE_DELAY = 0.1;

  /* ─── Mobile-only: automatic, random, continuous node highlight ───
     Runs only while the Hero section is in view, so it doesn't keep
     animating (and using CPU/battery) once the user has scrolled past. */
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const recentLitRef = useRef<number[]>([]);

  useEffect(() => {
    if (!isMobile || !isInView || prefersReduced || nodes.length < 2) {
      return;
    }

    const HOLD_MS = 2000;
    const PAUSE_MS = 900;

    const pickNext = (exclude: number[]) => {
      let next = Math.floor(Math.random() * nodes.length);
      while (exclude.includes(next)) {
        next = Math.floor(Math.random() * nodes.length);
      }
      return next;
    };

    let timeoutId: number;

    const turnOn = () => {
      const next = pickNext(recentLitRef.current);
      recentLitRef.current = [...recentLitRef.current, next].slice(-3);
      setHoveredIdx(next);
      timeoutId = window.setTimeout(turnOff, HOLD_MS);
    };

    const turnOff = () => {
      setHoveredIdx(null);
      timeoutId = window.setTimeout(turnOn, PAUSE_MS);
    };

    turnOn();

    return () => window.clearTimeout(timeoutId);
  }, [isMobile, isInView, prefersReduced, nodes.length]);

  useEffect(() => {
    if (!isMobile || !isInView) {
      setHoveredIdx(null);
    }
  }, [isMobile, isInView]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex min-h-screen flex-col items-center justify-center md:overflow-hidden px-4 scroll-mt-14 snap-start"
    >
      {/* ─── DESKTOP: single SVG coordinate system ─── */}
      {/*
        The wrapper matches the viewBox aspect ratio. Both SVG paths and center
        text live inside the SVG so they ALWAYS stay aligned.
      */}
      <div className="relative hidden h-full w-full max-w-7xl md:block">
        <svg
          viewBox="0 0 1000 700"
          className="h-full w-full"
          fill="none"
          style={{ aspectRatio: "1000/700", overflow: "visible" }}
        >
          {nodes.map((n, i) => {
            const active = hoveredIdx === i;
            const stroke = active ? n.color : svgGrey;
            const sw = active ? n.strokeWidth + 1.5 : n.strokeWidth;
            const radius = active ? 6 : 3.5;
            const fs = active ? n.fontSize + 3 : n.fontSize;

            const step = clockOrder[i];
            const delay = prefersReduced ? 0 : step * NODE_STAGGER_DESKTOP;

            return (
              <motion.g
                key={n.id}
                initial={{ opacity: 0, y: prefersReduced ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay, ease: "easeOut" }}
              >
                {/* Connector path */}
                <path
                  d={n.path}
                  stroke={stroke}
                  strokeWidth={sw}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-300 ease-out"
                />

                {/* Start node */}
                <circle
                  cx={n.circleCx}
                  cy={n.circleCy}
                  r={9}
                  stroke={stroke}
                  strokeWidth={1}
                  fill="none"
                  className="transition-all duration-300 ease-out"
                />
                <circle
                  cx={n.circleCx}
                  cy={n.circleCy}
                  r={radius}
                  fill={stroke}
                  className="transition-all duration-300 ease-out"
                />

                {/* Interactive zone — pointer events unify mouse & touch */}
                <g
                  onPointerEnter={() => setHoveredIdx(i)}
                  onPointerLeave={() => setHoveredIdx(null)}
                  onClick={() => scrollTo(n.target)}
                  className="cursor-pointer"
                >
                  <path
                    d={n.path}
                    stroke="transparent"
                    strokeWidth={16}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <circle cx={n.circleCx} cy={n.circleCy} r={10} fill="transparent" />

                  <text
                    x={n.textX}
                    y={n.textY}
                    textAnchor={n.textAnchor}
                    fill={stroke}
                    className="transition-all duration-300 ease-out"
                    style={{
                      fontSize: `${fs}px`,
                      fontFamily: '"Space Grotesk", sans-serif',
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                    }}
                  >
                    {n.label}
                  </text>
                </g>
              </motion.g>
            );
          })}

          {/* ─── Center text inside SVG (shared coordinate space) ─── */}
          {[
            {
              key: "greeting",
              node: (
                <text
                  x={500}
                  y={308}
                  textAnchor="middle"
                  fill="var(--color-muted)"
                  style={{ fontSize: 20, fontFamily: "Archivo, sans-serif" }}
                >
                  {content.hero.greeting}
                </text>
              ),
            },
            {
              key: "name",
              node: (
                <text
                  x={500}
                  y={356}
                  textAnchor="middle"
                  fill="var(--color-primary)"
                  style={{
                    fontSize: 52,
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontWeight: 700,
                  }}
                >
                  {content.hero.name}
                </text>
              ),
            },
            {
              key: "subtitle",
              node: (
                <text
                  x={500}
                  y={400}
                  textAnchor="middle"
                  fill="var(--color-accent)"
                  style={{
                    fontSize: 26,
                    fontFamily: "Archivo, sans-serif",
                    fontWeight: 600,
                  }}
                >
                  {content.hero.subtitle}
                </text>
              ),
            },
          ].map((line, i) => (
            <motion.g
              key={line.key}
              initial={{ opacity: 0, y: prefersReduced ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: prefersReduced
                  ? 0
                  : TEXT_BASE_DELAY + textOrder[i] * TEXT_STAGGER_DESKTOP,
                ease: "easeOut",
              }}
            >
              {line.node}
            </motion.g>
          ))}
        </svg>
      </div>

      {/* ─── MOBILE: compact SVG node map ─── */}
      <div className="flex w-full flex-col items-center py-4 -mt-[12dvh] md:hidden">
        {/*
          Mobile viewBox adapted to phone aspect ratio.
          Same 45° circuit-like nodes scaled compact,
          with foreignObject for text wrapping.
        */}
        {(() => {
          type MCfg = {
            id: string; path: string; cx: number; cy: number;
            sw: number; foX: number; foY: number; foYActive?: number; foW: number;
            ta: "left" | "right";
          };
          /* Mobile positions — viewBox 400×600 */
          const mPoses: Record<string, MCfg> = {
            software: {
              id: "software", ta: "left",
              // Sube empinado y se estira en una plataforma horizontal larga arriba
              path: "M 230 240 L 290 140 L 380 140",
              cx: 230, cy: 240, sw: 2,
              foX: 290, foY: 108, foYActive: 88, foW: 90,
            },
            tecnico: {
              id: "tecnico", ta: "left",
              // Sale casi horizontal hacia la derecha, un quiebre corto y base baja
              path: "M 270 288 L 320 238 L 390 238",
              cx: 270, cy: 288, sw: 2,
              foX: 320, foY: 205, foYActive: 183, foW: 75,
            },
            problemas: {
              id: "problemas", ta: "left",
              // Cae largo hacia la esquina inferior derecha
              path: "M 215 340 L 265 415 L 370 415",
              cx: 215, cy: 340, sw: 2,
              foX: 265, foY: 420, foW: 110,
            },
            equipos: {
              id: "equipos", ta: "right",
              // Desplazado en diagonal hacia abajo a la izquierda, base limpia
              path: "M 135 320 L 85 360 L 15 360",
              cx: 135, cy: 320, sw: 1.5,
              foX: -10, foY: 365, foW: 95,
            },
            coordinacion: {
              id: "coordinacion", ta: "right",
              // Quiebre más pronunciado hacia arriba a la izquierda
              path: "M 160 250 L 105 170 L 20 170",
              cx: 160, cy: 250, sw: 1,
              foX: 15, foY: 140, foYActive: 125, foW: 90,
            },
          };
          /* map desktop nodes → mobile positions, keep label & target */
          const mNodes = nodes.map((n) => {
            const m = mPoses[n.id];
            return { ...n, ...m };
          });

          return (
            <svg
              viewBox="0 0 400 600"
              className="w-full max-w-sm"
              fill="none"
              style={{ overflow: "visible", aspectRatio: "400/600" }}
            >
              <g>
                {mNodes.map((n, i) => {
                  const active = hoveredIdx === i;
                  const stroke = active ? n.color : svgGrey;
                  const sw = active ? n.sw + 1.75 : n.sw;
                  const radius = active ? 6.5 : 2.5;
                  const ringRadius = active ? 9 : 6;
                  const ringSw = active ? 1.5 : 1;
                  const labelFontSize = active ? "13px" : "10px";

                  const step = clockOrder[i];
                  const delay = prefersReduced ? 0 : step * NODE_STAGGER_MOBILE;

                  return (
                    <motion.g
                      key={n.id}
                      initial={{ opacity: 0, y: prefersReduced ? 0 : 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay, ease: "easeOut" }}
                    >
                      {/* Connector path */}
                      <path
                        d={n.path}
                        stroke={stroke}
                        strokeWidth={sw}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-all duration-[800ms] ease-in-out"
                      />
                      {/* Ring around start dot */}
                      <circle
                        cx={n.cx}
                        cy={n.cy}
                        r={ringRadius}
                        stroke={stroke}
                        strokeWidth={ringSw}
                        fill="none"
                        className="transition-all duration-[800ms] ease-in-out"
                      />
                      {/* Start circle */}
                      <circle
                        cx={n.cx}
                        cy={n.cy}
                        r={radius}
                        fill={stroke}
                        className="transition-all duration-[800ms] ease-in-out"
                      />

                      {/* Interactive zone — pointer events unify mouse & touch */}
                      <g
                        onPointerEnter={() => setHoveredIdx(i)}
                        onPointerLeave={() => setHoveredIdx(null)}
                        onClick={() => scrollTo(n.target)}
                        className="cursor-pointer"
                      >
                        <path
                          d={n.path}
                          stroke="transparent"
                          strokeWidth={16}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                        <circle cx={n.cx} cy={n.cy} r={12} fill="transparent" />

                        {/* Wrapping text via foreignObject */}
                        <foreignObject
                          x={n.foX}
                          y={active && n.foYActive !== undefined ? n.foYActive : n.foY}
                          width={n.foW}
                          height={60}
                          style={{
                            transition: "y 800ms ease-in-out",
                            overflow: n.id === "coordinacion" ? "visible" : undefined,
                          }}
                        >
                          <div
                            className="transition-all duration-[800ms] ease-in-out"
                            style={{
                              fontSize: labelFontSize,
                              fontFamily: "'Space Grotesk', sans-serif",
                              fontWeight: 500,
                              textTransform: "uppercase",
                              letterSpacing: "0.1em",
                              lineHeight: 1.35,
                              color: stroke,
                              textAlign: n.ta,
                              pointerEvents: "none",
                              overflowWrap: "break-word",
                            }}
                          >
                            {n.id === "coordinacion" ? (
                              (() => {
                                const words = n.label.split(" ");
                                const mid = Math.ceil(words.length / 2);
                                return (
                                  <>
                                    <div style={{ whiteSpace: "nowrap" }}>
                                      {words.slice(0, mid).join(" ")}
                                    </div>
                                    <div style={{ whiteSpace: "nowrap" }}>
                                      {words.slice(mid).join(" ")}
                                    </div>
                                  </>
                                );
                              })()
                            ) : (
                              n.label
                            )}
                          </div>
                        </foreignObject>
                      </g>
                    </motion.g>
                  );
                })}

                {/* Center text — 33% from left edge */}
                {[
                  {
                    key: "mobileGreeting",
                    node: (
                      <text
                        x={195}
                        y={274}
                        textAnchor="middle"
                        fill="var(--color-muted)"
                        style={{ fontSize: 13, fontFamily: "Archivo, sans-serif" }}
                      >
                        {content.hero.mobileGreeting}
                      </text>
                    ),
                  },
                  {
                    key: "mobileName",
                    node: (
                      <text
                        x={195}
                        y={296}
                        textAnchor="middle"
                        fill="var(--color-primary)"
                        style={{
                          fontSize: 22,
                          fontFamily: '"Space Grotesk", sans-serif',
                          fontWeight: 700,
                        }}
                      >
                        {content.hero.mobileName}
                      </text>
                    ),
                  },
                  {
                    key: "mobileSubtitle",
                    node: (
                      <text
                        x={195}
                        y={314}
                        textAnchor="middle"
                        fill="var(--color-accent)"
                        style={{
                          fontSize: 13,
                          fontFamily: "Archivo, sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        {content.hero.mobileSubtitle}
                      </text>
                    ),
                  },
                ].map((line, i) => (
                  <motion.g
                    key={line.key}
                    initial={{ opacity: 0, y: prefersReduced ? 0 : 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.7,
                      delay: prefersReduced
                        ? 0
                        : TEXT_BASE_DELAY + textOrder[i] * TEXT_STAGGER_MOBILE,
                      ease: "easeOut",
                    }}
                  >
                    {line.node}
                  </motion.g>
                ))}
              </g>
            </svg>
          );
        })()}
      </div>
    </section>
  );
}
