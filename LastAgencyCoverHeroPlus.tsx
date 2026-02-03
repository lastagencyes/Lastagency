import * as React from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

type NavItem = { label: string; href: string }
type StatItem = { label: string; value: string }

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function safeJsonParse<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function Pill({
  text,
  accent,
  active = false,
}: {
  text: string
  accent: string
  active?: boolean
}) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 12px",
        borderRadius: 999,
        background: active ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.10)",
        backdropFilter: "blur(10px)",
        color: "rgba(255,255,255,0.86)",
        fontSize: 12,
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: 99,
          background: active ? accent : "rgba(255,255,255,0.35)",
          boxShadow: active ? `0 0 0 4px ${accent}1f` : "none",
        }}
      />
      {text}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        padding: "14px 14px",
        borderRadius: 18,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.10)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 24px 70px rgba(0,0,0,0.35)",
        minWidth: 160,
      }}
    >
      <div
        style={{
          fontSize: 11,
          opacity: 0.72,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 850,
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </div>
    </div>
  )
}

export type LastAgencyCoverHeroPlusProps = {
  brand?: string
  navJson?: string
  headlineA?: string
  headlineB?: string
  rightKicker?: string
  rightText?: string
  ctaLabel?: string
  ctaHref?: string
  secondaryCtaLabel?: string
  secondaryCtaHref?: string
  accent?: string
  smokeRadius?: number
  orbSize?: number
  showNav?: boolean
  showAccentLine?: boolean
  chipsJson?: string
  statsJson?: string
  marqueeText?: string
  badgeLeft?: string
  badgeRight?: string

  /** Opcional: para integrarlo en layouts con height fija */
  style?: React.CSSProperties
  className?: string
}

export default function LastAgencyCoverHeroPlus({
  brand = "Last Agency",
  navJson = '[{"label":"Services","href":"#services"},{"label":"About","href":"#about"},{"label":"Projects","href":"#projects"},{"label":"Contact","href":"#contact"}]',
  headlineA = "Marketing,",
  headlineB = "Sin humo",
  rightKicker = "© Restauración & ocio nocturno",
  rightText = "Estrategia, creatividad y performance para llenar mesas y pistas. Sin promesas mágicas: datos, ejecución y resultados medibles.",
  ctaLabel = "Agenda una llamada",
  ctaHref = "#contact",
  secondaryCtaLabel = "Ver servicios",
  secondaryCtaHref = "#services",
  accent = "#00D7FF",
  smokeRadius = 120,
  orbSize = 520,
  showNav = true,
  showAccentLine = true,
  chipsJson = '["Restauración","Nightlife","Ads","Contenido","Branding","Web & SEO"]',
  statsJson = '[{"label":"Enfoque","value":"Reservas & Aforo"},{"label":"Reporting","value":"Semanal"},{"label":"Optimización","value":"Siempre"}]',
  marqueeText = "Ads • Reels • UGC • Influencers • Branding • Web • SEO",
  badgeLeft = "Marketing sin humo",
  badgeRight = "Disponible",
  style,
  className,
}: LastAgencyCoverHeroPlusProps) {
  // Responsive safe
  const [isMobile, setIsMobile] = React.useState(false)
  React.useEffect(() => {
    if (typeof window === "undefined") return
    const onResize = () => setIsMobile(window.innerWidth < 980)
    onResize()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  // Mouse → parallax
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 140, damping: 24, mass: 0.65 })
  const sy = useSpring(my, { stiffness: 140, damping: 24, mass: 0.65 })

  const bgX = useTransform(sx, [-1, 1], ["-2.8%", "2.8%"])
  const bgY = useTransform(sy, [-1, 1], ["-2.2%", "2.2%"])
  const rotX = useTransform(sy, [-1, 1], [6, -6])
  const rotY = useTransform(sx, [-1, 1], [-8, 8])

  // Spotlight position (%)
  const spotX = useTransform(sx, [-1, 1], [35, 65])
  const spotY = useTransform(sy, [-1, 1], [38, 62])

  // Haze drift
  const hazeX = useTransform(sx, [-1, 1], [-18, 18])
  const hazeY = useTransform(sy, [-1, 1], [-12, 12])

  // CTA magnetic
  const bmx = useMotionValue(0)
  const bmy = useMotionValue(0)
  const bsx = useSpring(bmx, { stiffness: 320, damping: 26 })
  const bsy = useSpring(bmy, { stiffness: 320, damping: 26 })

  // Secondary CTA magnetic
  const sbmx = useMotionValue(0)
  const sbmy = useMotionValue(0)
  const sbsx = useSpring(sbmx, { stiffness: 320, damping: 26 })
  const sbsy = useSpring(sbmy, { stiffness: 320, damping: 26 })

  // Smoke mask string state
  const [maskCss, setMaskCss] = React.useState(
    `radial-gradient(circle ${smokeRadius}px at 50% 50%, #000 0%, #000 45%, transparent 70%)`
  )

  React.useEffect(() => {
    setMaskCss(
      `radial-gradient(circle ${smokeRadius}px at 50% 50%, #000 0%, #000 45%, transparent 70%)`
    )
  }, [smokeRadius])

  const rafRef = React.useRef<number | null>(null)
  const lastRef = React.useRef({ x: 50, y: 50 })

  const updateMask = (xPct: number, yPct: number) => {
    setMaskCss(
      `radial-gradient(circle ${smokeRadius}px at ${xPct.toFixed(1)}% ${yPct.toFixed(
        1
      )}%, #000 0%, #000 45%, transparent 70%)`
    )
  }

  // Data
  const nav = safeJsonParse<NavItem[]>(navJson, [
    { label: "Services", href: "#services" },
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
  ])

  const chips = safeJsonParse<string[]>(chipsJson, [
    "Restauración",
    "Nightlife",
    "Ads",
    "Contenido",
    "Branding",
    "Web & SEO",
  ])

  const stats = safeJsonParse<StatItem[]>(statsJson, [
    { label: "Enfoque", value: "Reservas & Aforo" },
    { label: "Reporting", value: "Semanal" },
    { label: "Optimización", value: "Siempre" },
  ])

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height

    const nx = clamp((x - 0.5) * 2, -1, 1)
    const ny = clamp((y - 0.5) * 2, -1, 1)
    mx.set(nx)
    my.set(ny)

    const xPct = 50 + nx * 14
    const yPct = 50 + ny * 10
    lastRef.current = { x: xPct, y: yPct }

    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      updateMask(lastRef.current.x, lastRef.current.y)
    })
  }

  const onLeave = () => {
    mx.set(0)
    my.set(0)
    updateMask(50, 50)
  }

  const onBtnMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    bmx.set(x * 14)
    bmy.set(y * 10)
  }

  const onBtnLeave = () => {
    bmx.set(0)
    bmy.set(0)
  }

  const onSecondaryBtnMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    sbmx.set(x * 10)
    sbmy.set(y * 8)
  }

  const onSecondaryBtnLeave = () => {
    sbmx.set(0)
    sbmy.set(0)
  }

  const padX = isMobile ? 22 : 72
  const padTop = isMobile ? 92 : 120
  const hSize = isMobile ? 56 : 92
  const orbFinal = isMobile ? Math.round(orbSize * 0.72) : orbSize

  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        background: "#050607",
        color: "rgba(255,255,255,0.92)",
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial',
        ...style,
      }}
    >
      {showAccentLine && (
        <div
          style={{
            position: "absolute",
            top: 74,
            left: 0,
            right: 0,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
            opacity: 0.75,
            zIndex: 2,
          }}
        />
      )}

      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          inset: -140,
          background: `radial-gradient(800px 480px at ${spotX}% ${spotY}%, rgba(255,255,255,0.07), transparent 60%)`,
          pointerEvents: "none",
          opacity: 0.9,
          zIndex: 1,
        }}
      />

      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          inset: -90,
          x: bgX,
          y: bgY,
          background:
            "radial-gradient(1200px 700px at 20% 20%, rgba(255,255,255,0.06), transparent 55%)," +
            "radial-gradient(900px 500px at 82% 28%, rgba(0,255,255,0.05), transparent 55%)," +
            "radial-gradient(700px 520px at 45% 88%, rgba(255,255,255,0.04), transparent 60%)," +
            "linear-gradient(180deg, rgba(255,255,255,0.03), transparent 26%, rgba(0,0,0,0.58))",
          zIndex: 0,
        }}
      />

      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          left: "50%",
          top: "58%",
          width: orbFinal,
          height: orbFinal,
          transform: "translate(-50%, -50%)",
          borderRadius: 999,
          background:
            "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.22), rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.02) 60%, transparent 72%)",
          boxShadow: "0 40px 120px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.10)",
          border: "1px solid rgba(255,255,255,0.10)",
          backdropFilter: "blur(10px)",
          rotateX: rotX,
          rotateY: rotY,
          transformStyle: "preserve-3d",
          opacity: 0.92,
          zIndex: 2,
        }}
      />

      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.085,
          backgroundImage:
            "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22%3E%3Cfilter id=%22n%22 x=%220%22 y=%220%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22160%22 height=%22160%22 filter=%22url(%23n)%22 opacity=%220.55%22/%3E%3C/svg%3E')",
          mixBlendMode: "overlay",
          zIndex: 3,
        }}
      />

      <header
        style={{
          position: "absolute",
          top: 18,
          left: 18,
          right: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 14,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02))",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
              display: "grid",
              placeItems: "center",
              fontWeight: 900,
              letterSpacing: "-0.02em",
            }}
          >
            LA
          </div>
          <div style={{ fontWeight: 650, opacity: 0.9 }}>{brand}</div>

          {!isMobile && (
            <div
              style={{
                marginLeft: 10,
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 12px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.10)",
                backdropFilter: "blur(10px)",
                color: "rgba(255,255,255,0.82)",
                fontSize: 12,
                letterSpacing: "0.02em",
              }}
            >
              <span style={{ opacity: 0.85 }}>{badgeLeft}</span>
              <span style={{ opacity: 0.35 }}>•</span>
              <span style={{ color: accent, fontWeight: 800 }}>{badgeRight}</span>
            </div>
          )}
        </div>

        {showNav && !isMobile && (
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "10px 16px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.10)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
            }}
          >
            {nav.slice(0, 5).map((item, i) => (
              <a
                key={i}
                href={item.href}
                style={{
                  color: "rgba(255,255,255,0.72)",
                  textDecoration: "none",
                  fontSize: 13,
                  letterSpacing: "0.02em",
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}

        <motion.a
          href={ctaHref}
          onMouseMove={onBtnMove}
          onMouseLeave={onBtnLeave}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: isMobile ? "11px 14px" : "12px 16px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.92)",
            color: "#0a0b0c",
            textDecoration: "none",
            fontWeight: 900,
            boxShadow: "0 26px 70px rgba(0,0,0,0.45)",
            x: bsx,
            y: bsy,
            whiteSpace: "nowrap",
          }}
        >
          <span>{ctaLabel}</span>
          <span style={{ opacity: 0.7 }}>→</span>
        </motion.a>
      </header>

      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: `${padTop}px ${padX}px ${isMobile ? 34 : 72}px ${padX}px`,
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1.6fr 1fr",
          gap: isMobile ? 18 : 36,
          alignItems: "start",
          zIndex: 6,
        }}
      >
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 18 }}>
            <Pill text={chips[0] || "Restauración"} accent={accent} active />
            {(chips || []).slice(1, 6).map((c, i) => (
              <Pill key={i} text={c} accent={accent} />
            ))}
          </div>

          <div style={{ maxWidth: 960 }}>
            <motion.h1
              initial={{ opacity: 0, y: 14, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.85, ease: [0.2, 0.8, 0.2, 1] }}
              style={{
                margin: 0,
                fontSize: hSize,
                lineHeight: 0.92,
                letterSpacing: "-0.04em",
                fontWeight: 780,
              }}
            >
              {headlineA}
            </motion.h1>

            <div
              style={{
                marginTop: 10,
                fontSize: hSize,
                lineHeight: 0.92,
                letterSpacing: "-0.03em",
                fontFamily:
                  'ui-serif, "Iowan Old Style", "Apple Garamond", "Times New Roman", serif',
                fontStyle: "italic",
                position: "relative",
                display: "inline-block",
                userSelect: "none",
              }}
            >
              <span style={{ opacity: 0.55, filter: "blur(4px)" }}>{headlineB}</span>

              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  WebkitMaskImage: maskCss as any,
                  maskImage: maskCss as any,
                }}
              >
                {headlineB}
              </span>

              <motion.span
                aria-hidden
                style={{
                  position: "absolute",
                  inset: "-12px -18px",
                  pointerEvents: "none",
                  background:
                    "radial-gradient(240px 150px at 50% 50%, rgba(255,255,255,0.11), transparent 65%)",
                  filter: "blur(16px)",
                  opacity: 0.55,
                  x: hazeX,
                  y: hazeY,
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 26 }}>
            <motion.a
              href={ctaHref}
              onMouseMove={onBtnMove}
              onMouseLeave={onBtnLeave}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 16px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.92)",
                color: "#0a0b0c",
                textDecoration: "none",
                fontWeight: 900,
                boxShadow: "0 26px 70px rgba(0,0,0,0.45)",
                x: bsx,
                y: bsy,
                whiteSpace: "nowrap",
              }}
            >
              <span>{ctaLabel}</span>
              <span style={{ opacity: 0.7 }}>→</span>
            </motion.a>

            <motion.a
              href={secondaryCtaHref}
              onMouseMove={onSecondaryBtnMove}
              onMouseLeave={onSecondaryBtnLeave}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 16px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.86)",
                textDecoration: "none",
                fontWeight: 800,
                backdropFilter: "blur(10px)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.30)",
                x: sbsx,
                y: sbsy,
                whiteSpace: "nowrap",
              }}
            >
              <span>{secondaryCtaLabel}</span>
              <span style={{ opacity: 0.7 }}>↗</span>
            </motion.a>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 22 }}>
            {(stats || []).slice(0, 3).map((s, i) => (
              <Stat key={i} label={s.label} value={s.value} />
            ))}
          </div>

          <motion.div
            style={{
              position: "absolute",
              left: isMobile ? 0 : "50%",
              bottom: isMobile ? -6 : 22,
              transform: isMobile ? "none" : "translateX(-50%)",
              width: 52,
              height: 52,
              borderRadius: 999,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.10)",
              backdropFilter: "blur(10px)",
              display: "grid",
              placeItems: "center",
              boxShadow: "0 24px 70px rgba(0,0,0,0.45)",
            }}
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div style={{ fontSize: 18, opacity: 0.85 }}>⌄</div>
          </motion.div>
        </div>

        <div style={{ paddingTop: isMobile ? 10 : 26, maxWidth: 520 }}>
          <div
            style={{
              fontSize: 12,
              opacity: 0.72,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            {rightKicker}
          </div>

          <div style={{ fontSize: 16, lineHeight: 1.55, opacity: 0.86 }}>{rightText}</div>

          <div
            style={{
              height: 1,
              marginTop: 18,
              marginBottom: 14,
              background: "rgba(255,255,255,0.10)",
            }}
          />

          <div
            style={{
              width: "100%",
              overflow: "hidden",
              borderRadius: 16,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 18px 50px rgba(0,0,0,0.25)",
            }}
          >
            <motion.div
              style={{
                display: "flex",
                gap: 18,
                padding: "10px 14px",
                whiteSpace: "nowrap",
                color: "rgba(255,255,255,0.78)",
                fontSize: 13,
              }}
              animate={{ x: [0, -420] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <span style={{ color: accent, opacity: 0.95 }}>•</span> {marqueeText}{" "}
              <span style={{ color: accent, opacity: 0.95 }}>•</span> {marqueeText}
            </motion.div>
          </div>

          <a
            href={secondaryCtaHref}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              marginTop: 14,
              color: "rgba(255,255,255,0.78)",
              textDecoration: "none",
              fontSize: 14,
            }}
          >
            Ver casos <span style={{ opacity: 0.6 }}>→</span>
          </a>
        </div>
      </div>

      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 240,
          background:
            "linear-gradient(180deg, transparent, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.85))",
          pointerEvents: "none",
          zIndex: 7,
        }}
      />
    </div>
  )
}
