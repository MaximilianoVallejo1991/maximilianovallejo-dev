"use client"

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type CSSProperties,
} from "react"
import IconMap from "./IconMap"
import type { Skill } from "../../data/content"

interface SkillCarouselProps {
  skills: Skill[]
  cardWidth?: number
  cardHeight?: number
  radius?: number
  tilt?: number
  sideTilt?: number
  gap?: number
  opacity?: number
  autoplay?: boolean
  autoplayDelay?: number
}

const PERSPECTIVE = 1600
const SCALE_STEP = 0.16
const DEPTH = 240
const TRANSITION_DURATION = 0.6

function cssTransition(duration: number, ease: string) {
  return `transform ${duration}s ${ease}, opacity ${duration}s ${ease}`
}

interface ResponsiveSettings {
  cardWidth: number
  cardHeight: number
  maxVisible: number
  gap: number
  paddingH: number
  isMobile: boolean
  iconSize: number
  fontSize: number
  contentPadding: number
  contentGap: number
}

function useResponsiveSettings(): ResponsiveSettings {
  const [settings, setSettings] = useState<ResponsiveSettings>({
    cardWidth: 240,
    cardHeight: 112,
    maxVisible: 3,
    gap: 8,
    paddingH: 60,
    isMobile: false,
    iconSize: 40,
    fontSize: 14,
    contentPadding: 16,
    contentGap: 10,
  })

  useEffect(() => {
    const updateSettings = () => {
      const width = window.innerWidth

      if (width < 640) {
        // Mobile
        setSettings({
          cardWidth: 132,
          cardHeight: 104,
          maxVisible: 1,
          gap: 4,
          paddingH: 24,
          isMobile: true,
          iconSize: 26,
          fontSize: 11,
          contentPadding: 8,
          contentGap: 6,
        })
      } else if (width < 1024) {
        // Tablet
        setSettings({
          cardWidth: 176,
          cardHeight: 112,
          maxVisible: 1.5,
          gap: 7,
          paddingH: 30,
          isMobile: false,
          iconSize: 32,
          fontSize: 12,
          contentPadding: 12,
          contentGap: 8,
        })
      } else {
        // Desktop
        setSettings({
          cardWidth: 240,
          cardHeight: 112,
          maxVisible: 3,
          gap: 8,
          paddingH: 60,
          isMobile: false,
          iconSize: 40,
          fontSize: 14,
          contentPadding: 16,
          contentGap: 10,
        })
      }
    }

    updateSettings()
    window.addEventListener("resize", updateSettings)
    return () => window.removeEventListener("resize", updateSettings)
  }, [])

  return settings
}

export default function SkillCarousel({
  skills,
  cardWidth: cardWidthProp,
  cardHeight: cardHeightProp,
  radius = 8,
  tilt = 0,
  sideTilt = 0,
  gap: gapProp,
  opacity = 50,
  autoplay = true,
  autoplayDelay = 3,
}: SkillCarouselProps) {
  const responsiveSettings = useResponsiveSettings()
  const cardWidth = cardWidthProp ?? responsiveSettings.cardWidth
  const cardHeight = cardHeightProp ?? responsiveSettings.cardHeight
  const gap = gapProp ?? responsiveSettings.gap
  const maxVisible = responsiveSettings.maxVisible
  const paddingH = responsiveSettings.paddingH
  const isMobile = responsiveSettings.isMobile
  const iconSize = responsiveSettings.iconSize
  const fontSize = responsiveSettings.fontSize
  const contentPadding = responsiveSettings.contentPadding
  const contentGap = responsiveSettings.contentGap

  const [active, setActive] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const lockRef = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const n = skills.length

  if (n === 0) return null

  const lock = useCallback(() => {
    lockRef.current = true
    window.setTimeout(() => {
      lockRef.current = false
    }, TRANSITION_DURATION * 1000 + 50)
  }, [])

  const step = useCallback(
    (dir: number) => {
      if (lockRef.current) return
      lock()
      setActive((a) => (((a + dir) % n) + n) % n)
    },
    [n, lock]
  )

  const handleCardClick = useCallback(
    (i: number) => {
      if (lockRef.current) return
      lock()
      if (i !== active) {
        setActive(i)
      }
    },
    [active, lock]
  )

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!autoplay || !isInView || isHovered || n < 2) return
    const ms = Math.max(0.3, autoplayDelay) * 1000
    const id = window.setInterval(() => step(1), ms)
    return () => window.clearInterval(id)
  }, [autoplay, autoplayDelay, isInView, isHovered, n, step])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (!isHovered) return
      const direction = e.deltaY > 0 ? 1 : -1
      step(direction)
    }

    container.addEventListener("wheel", handleWheel, { passive: false })
    return () => container.removeEventListener("wheel", handleWheel)
  }, [isHovered, step])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let startX = 0
    let deltaX = 0
    let swiping = false

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
      deltaX = 0
      swiping = true
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!swiping) return
      deltaX = e.touches[0].clientX - startX
      if (Math.abs(deltaX) > 10) e.preventDefault()
    }

    const handleTouchEnd = () => {
      if (!swiping) return
      swiping = false
      const SWIPE_THRESHOLD = 40
      if (deltaX > SWIPE_THRESHOLD) {
        step(-1)
      } else if (deltaX < -SWIPE_THRESHOLD) {
        step(1)
      }
    }

    container.addEventListener("touchstart", handleTouchStart, { passive: true })
    container.addEventListener("touchmove", handleTouchMove, { passive: false })
    container.addEventListener("touchend", handleTouchEnd)
    return () => {
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove)
      container.removeEventListener("touchend", handleTouchEnd)
    }
  }, [step])

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault()
        step(1)
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        step(-1)
      }
    },
    [step]
  )


  const transitionCss = cssTransition(TRANSITION_DURATION, "cubic-bezier(0.22, 1, 0.36, 1)")
  const effectiveRadius = (Math.max(0, Math.min(20, radius)) / 20) * (Math.min(cardWidth, cardHeight) / 2)
  const dim = 1 - Math.max(0, Math.min(100, opacity)) / 100

  const rootStyle: CSSProperties = {
    position: "relative",
    width: "100%",
    maxWidth: "100%",
    height: cardHeight + 40,
    outline: "none",
    boxSizing: "border-box",
  }

  const viewportStyle: CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    perspective: `${PERSPECTIVE}px`,
    paddingLeft: `${paddingH}px`,
    paddingRight: `${paddingH}px`,
    overflow: "hidden",
    boxSizing: "border-box",
  }

  return (
    <div
      ref={containerRef}
      style={rootStyle}
      tabIndex={0}
      role="group"
      aria-roledescription="carousel"
      onKeyDown={onKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={viewportStyle}>
      <div
        style={{
          position: "relative",
          width: cardWidth,
          height: cardHeight,
          transformStyle: "preserve-3d",
        }}
      >
        {skills.map((skill, i) => {
          let rel = i - active
          if (rel > n / 2) rel -= n
          if (rel < -n / 2) rel += n

          const ax = Math.abs(rel)
          const visible = ax <= maxVisible
          const isActive = rel === 0
          const sc = Math.max(0.4, 1 - ax * SCALE_STEP)
          const tx = rel * (gap * 30)
          const tz = -ax * DEPTH
          const ry = -rel * tilt
          const rz = rel * sideTilt

          const cardStyle: CSSProperties = {
            position: "absolute",
            left: "50%",
            top: "50%",
            width: cardWidth,
            height: cardHeight,
            borderRadius: effectiveRadius,
            overflow: "hidden",
            transformStyle: "preserve-3d",
            transformOrigin: "center center",
            transform: `translate(-50%, -50%) translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${sc})`,
            transition: transitionCss,
            opacity: visible ? 1 : 0,
            cursor: isActive ? "default" : "pointer",
            pointerEvents: visible ? "auto" : "none",
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-border)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
          }

          return (
            <div
              key={skill.name}
              style={cardStyle}
              onClick={() => handleCardClick(i)}
              aria-label={skill.name}
              aria-hidden={!visible}
            >
              {/* Dim overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "var(--color-card-overlay)",
                  opacity: isActive ? 0 : dim,
                  transition: `opacity ${TRANSITION_DURATION}s cubic-bezier(0.22, 1, 0.36, 1)`,
                  pointerEvents: "none",
                  borderRadius: effectiveRadius,
                }}
              />

              {/* Content */}
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: `${contentGap}px`,
                  padding: `${contentPadding}px`,
                  textAlign: "center",
                  pointerEvents: "none",
                  width: "100%",
                  height: "100%",
                  boxSizing: "border-box",
                }}
              >
                <div
                  className="text-accent"
                  style={{ width: iconSize, height: iconSize, flexShrink: 0 }}
                >
                  <IconMap name={skill.icon} className="h-full w-full text-accent" />
                </div>
                <span
                  className="font-body font-semibold text-primary"
                  style={{
                    fontSize: `${fontSize}px`,
                    lineHeight: 1.2,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {skill.name}
                </span>
              </div>
            </div>
          )
        })}
      </div>
      </div>

      {/* Side arrows - Left */}
      <div
        onClick={() => step(-1)}
        style={{
          position: "absolute",
          left: 10,
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--color-muted)",
          opacity: isHovered ? 0.7 : 0.4,
          transition: `opacity ${TRANSITION_DURATION}s ease`,
          cursor: "pointer",
          fontSize: "24px",
          fontWeight: "bold",
          userSelect: "none",
        }}
        aria-label="Habilidad anterior"
      >
        ‹
      </div>

      {/* Side arrows - Right */}
      <div
        onClick={() => step(1)}
        style={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--color-muted)",
          opacity: isHovered ? 0.7 : 0.4,
          transition: `opacity ${TRANSITION_DURATION}s ease`,
          cursor: "pointer",
          fontSize: "24px",
          fontWeight: "bold",
          userSelect: "none",
        }}
        aria-label="Siguiente habilidad"
      >
        ›
      </div>

      {/* Navigation hint */}
      {n > 1 && isMobile && (
        <div
          style={{
            position: "absolute",
            bottom: -24,
            left: "50%",
            transform: "translateX(-50%)",
            color: "var(--color-muted)",
            fontSize: "0.75rem",
            opacity: 0.6,
            whiteSpace: "nowrap",
          }}
        >
          {active + 1} / {n}
        </div>
      )}

      {n > 1 && !isMobile && (
        <div
          style={{
            position: "absolute",
            bottom: -28,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0.5rem",
            alignItems: "center",
            maxWidth: "100%",
            color: "var(--color-muted)",
            fontSize: "0.75rem",
            opacity: 0.6,
          }}
        >
          {skills.map((_, i) => (
            <button
              key={i}
              onClick={() => handleCardClick(i)}
              aria-label={`Go to skill ${i + 1}`}
              style={{
                width: i === active ? "1.5rem" : "0.5rem",
                height: "0.5rem",
                borderRadius: "9999px",
                backgroundColor: i === active ? "var(--color-accent)" : "var(--color-border)",
                border: "none",
                cursor: "pointer",
                transition: `all ${TRANSITION_DURATION}s ease`,
                padding: 0,
                flexShrink: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
