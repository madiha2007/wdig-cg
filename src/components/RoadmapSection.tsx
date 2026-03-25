"use client"

import { useEffect, useRef } from "react"

const STEPS = [
  {
    level: "Level 01",
    title: "Discover Yourself",
    desc: "AI aptitude tests uncover your natural strengths, interests, and hidden potential — building clarity from day one.",
    tag: "Start Here 🌱",
    color: "#7c3aed",
    href: "/aptitude",
    side: "left" as const,
    img: "/roadmap/level1.png",
  },
  {
    level: "Level 02",
    title: "Unlock Career Matches",
    desc: "AI instantly unlocks career paths that genuinely match your skills, mindset, and passions.",
    tag: "AI Powered 🤖",
    color: "#ec4899",
    href: "/results",
    side: "right" as const,
    img: "/roadmap/level2.png",
  },
  {
    level: "Level 03",
    title: "Choose Your Roadmap",
    desc: "Step-by-step roadmaps — skills, exams, certifications, and milestones to achieve.",
    tag: "Plan It 🗺️",
    color: "#f97316",
    href: "/explore",
    side: "left" as const,
    img: "/roadmap/level3.png",
  },
  {
    level: "Level 04",
    title: "Find Best Institutes",
    desc: "Top colleges and courses tailored to your career path, location, and goals.",
    tag: "Colleges 🏫",
    color: "#10b981",
    href: "/institute",
    side: "right" as const,
    img: "/roadmap/level5.png",
  },
  {
    level: "Level 05",
    title: "Connect With Mentors",
    desc: "Learn from those who've already walked the path — real-world guidance no textbook offers.",
    tag: "Mentorship 🤝",
    color: "#8b5cf6",
    href: "/mentors",
    side: "left" as const,
    img: "/roadmap/level6.png",
  },
  {
    level: "Level 06",
    title: "Talk to AI Career Bot",
    desc: "24/7 personalised career advice from our AI chatbot — ask anything, anytime.",
    tag: "AI Chat 💬",
    color: "#7c3aed",
    href: "/chatbot",
    side: "right" as const,
    img: "/roadmap/level7.png",
  },
]

// ── Road geometry ─────────────────────────────────────────────────────────────
const VB_W    = 900
const VB_H    = 1140
const Y_START = 95
const Y_STEP  = 190
const DOT_XS  = STEPS.map((_, i) => i % 2 === 0 ? 310 : 590)
const DOT_YS  = STEPS.map((_, i) => Y_START + i * Y_STEP)
const TENSION = 0.42

function buildRoadPath(): string {
  let d = `M ${DOT_XS[0]} ${DOT_YS[0]}`
  for (let i = 0; i < DOT_XS.length - 1; i++) {
    const x0 = DOT_XS[i],   y0 = DOT_YS[i]
    const x1 = DOT_XS[i+1], y1 = DOT_YS[i+1]
    const dy = (y1 - y0) * TENSION
    d += ` C ${x0} ${y0 + dy}, ${x1} ${y1 - dy}, ${x1} ${y1}`
  }
  return d
}
const ROAD_D = buildRoadPath()

// ── Desktop: winding SVG road ─────────────────────────────────────────────────
function DesktopRoadmap() {
  const svgRef   = useRef<SVGSVGElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const rafRef   = useRef<number>(0)
  const dashOff  = useRef(0)

  useEffect(() => {
    const dashEl = document.getElementById("rm-dashes") as SVGPathElement | null
    const tick = () => {
      dashOff.current -= 0.4
      if (dashEl) dashEl.style.strokeDashoffset = String(dashOff.current)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  useEffect(() => {
    function layout() {
      const svg   = svgRef.current
      const cards = cardsRef.current
      if (!svg || !cards) return

      const sr = svg.getBoundingClientRect()
      const sx = sr.width  / VB_W
      const sy = sr.height / VB_H

      document.querySelectorAll(".rm-dyn").forEach(el => el.remove())
      const dotsG = document.getElementById("rm-dots-g")
      cards.innerHTML = ""

      STEPS.forEach((step, i) => {
        const svgX = DOT_XS[i]
        const svgY = DOT_YS[i]
        const px   = svgX * sx
        const py   = svgY * sy

        // SVG dot
        if (dotsG) {
          const ns = "http://www.w3.org/2000/svg"

          const glow = document.createElementNS(ns, "circle")
          glow.setAttribute("cx", String(svgX))
          glow.setAttribute("cy", String(svgY))
          glow.setAttribute("r", "24")
          glow.setAttribute("fill", step.color)
          glow.setAttribute("opacity", "0.10")
          glow.classList.add("rm-dyn")
          dotsG.appendChild(glow)

          const ring = document.createElementNS(ns, "circle")
          ring.setAttribute("cx", String(svgX))
          ring.setAttribute("cy", String(svgY))
          ring.setAttribute("r", "15")
          ring.setAttribute("fill", "white")
          ring.setAttribute("stroke", step.color)
          ring.setAttribute("stroke-width", "2.5")
          ring.classList.add("rm-dyn")
          dotsG.appendChild(ring)

          const inner = document.createElementNS(ns, "circle")
          inner.setAttribute("cx", String(svgX))
          inner.setAttribute("cy", String(svgY))
          inner.setAttribute("r", "6")
          inner.setAttribute("fill", step.color)
          inner.classList.add("rm-dyn")
          dotsG.appendChild(inner)
        }

        // Content card
        const isLeft   = step.side === "left"
        const BLOCK_W  = 290
        const BLOCK_H  = 160
        const DOT_R_PX = 15 * sx
        const GAP      = 52

        const rawLeft = isLeft
          ? px - DOT_R_PX - GAP - BLOCK_W
          : px + DOT_R_PX + GAP

        const el = document.createElement("div")
        el.style.cssText = `
          position: absolute;
          width: ${BLOCK_W}px;
          left: ${Math.max(4, rawLeft)}px;
          top: ${py - BLOCK_H / 2}px;
          z-index: 5;
          opacity: 0;
          transform: translateX(${isLeft ? "-16px" : "16px"});
          transition: opacity 0.55s ease ${i * 0.08}s, transform 0.55s ease ${i * 0.08}s;
          pointer-events: all;
        `

        el.innerHTML = `
          <div style="
            display:flex;
            align-items:flex-start;
            gap:12px;
            flex-direction:${isLeft ? "row-reverse" : "row"};
          ">
            <div style="
              width:64px; height:64px; flex-shrink:0;
              border-radius:14px;
              background:white;
              border:2px solid ${step.color}30;
              box-shadow:0 4px 18px ${step.color}18, 0 1px 4px rgba(0,0,0,0.05);
              display:flex; align-items:center; justify-content:center;
              overflow:hidden;
            "><img src="${step.img}" alt="${step.title}" style="width:40px;height:40px;object-fit:contain;" /></div>
            <div style="flex:1; text-align:${isLeft ? "right" : "left"};">
              <div style="
                font-size:9.5px; font-weight:700; letter-spacing:0.13em;
                text-transform:uppercase; color:${step.color};
                margin-bottom:3px; font-family:sans-serif;
              ">${step.level}</div>
              <div style="
                font-size:16px; font-weight:700; color:#1e2a3a;
                line-height:1.3; margin-bottom:6px;
                font-family:'Lora',serif;
              ">${step.title}</div>
              <p style="
                font-size:12px; color:#64748b;
                line-height:1.6; margin:0 0 9px;
                font-family:sans-serif;
              ">${step.desc}</p>
              <a href="${step.href}" style="
                display:inline-block;
                font-size:11px; font-weight:700;
                padding:4px 14px; border-radius:999px;
                background:${step.color}12;
                border:1.5px solid ${step.color}35;
                color:${step.color};
                text-decoration:none;
                font-family:sans-serif;
                transition:background 0.2s;
              "
              onmouseenter="this.style.background='${step.color}22'"
              onmouseleave="this.style.background='${step.color}12'"
              >${step.tag}</a>
            </div>
          </div>
        `
        cards.appendChild(el)
        requestAnimationFrame(() => requestAnimationFrame(() => {
          el.style.opacity = "1"
          el.style.transform = "translateX(0)"
        }))
      })
    }

    const ro = new ResizeObserver(() => layout())
    if (svgRef.current) ro.observe(svgRef.current)
    requestAnimationFrame(() => requestAnimationFrame(layout))
    return () => ro.disconnect()
  }, [])

  return (
    <div style={{ position: "relative" }}>
      <svg
        ref={svgRef}
        width="100%"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", overflow: "visible" }}
      >
        <path d={ROAD_D} fill="none" stroke="rgba(124,58,237,0.05)" strokeWidth="64" strokeLinecap="round" />
        <path
          id="rm-dashes"
          d={ROAD_D}
          fill="none"
          stroke="rgba(124,58,237,0.32)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="10 10"
          strokeDashoffset="0"
        />
        <g id="rm-dots-g" />
      </svg>
      <div
        ref={cardsRef}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none" }}
      />
    </div>
  )
}

// ── Mobile / Tablet: vertical line + alternating square cards ────────────────
function MobileRoadmap() {
  return (
    <div style={{ position: "relative", padding: "0 16px", maxWidth: 560, margin: "0 auto" }}>
      {/* Vertical centre line */}
      <div style={{
        position: "absolute",
        left: "50%",
        top: 28,
        bottom: 28,
        width: 2,
        transform: "translateX(-50%)",
        background: "linear-gradient(180deg,#7c3aed55,#ec489955,#f9731655,#10b98155,#8b5cf655,#7c3aed55)",
        borderRadius: 2,
        zIndex: 0,
      }} />

      {STEPS.map((step, i) => {
        const onRight = i % 2 !== 0   // alternate: even = card on left, odd = card on right
        return (
          <div
            key={step.level}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 48px 1fr",
              alignItems: "center",
              marginBottom: i < STEPS.length - 1 ? 28 : 0,
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Left slot */}
            {!onRight ? (
              <div style={{
                background: "white",
                borderRadius: 14,
                border: `2px solid ${step.color}28`,
                boxShadow: `0 4px 20px ${step.color}12, 0 1px 4px rgba(0,0,0,0.05)`,
                padding: "14px",
              }}>
                <CardContent step={step} />
              </div>
            ) : (
              <div /> /* empty */
            )}

            {/* Centre dot */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2 }}>
              <div style={{
                width: 18, height: 18, borderRadius: "50%",
                background: "white",
                border: `3px solid ${step.color}`,
                boxShadow: `0 0 0 5px ${step.color}18`,
                flexShrink: 0,
              }} />
            </div>

            {/* Right slot */}
            {onRight ? (
              <div style={{
                background: "white",
                borderRadius: 14,
                border: `2px solid ${step.color}28`,
                boxShadow: `0 4px 20px ${step.color}12, 0 1px 4px rgba(0,0,0,0.05)`,
                padding: "14px",
              }}>
                <CardContent step={step} />
              </div>
            ) : (
              <div /> /* empty */
            )}
          </div>
        )
      })}
    </div>
  )
}

function CardContent({ step }: { step: typeof STEPS[0] }) {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <div style={{
          width: 40, height: 40, flexShrink: 0,
          borderRadius: 10,
          background: `${step.color}10`,
          border: `1.5px solid ${step.color}30`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <img src={step.img} alt={step.title} style={{ width: 26, height: 26, objectFit: "contain" }} />
        </div>
        <span style={{
          fontSize: 9, fontWeight: 700, letterSpacing: "0.12em",
          textTransform: "uppercase", color: step.color, fontFamily: "sans-serif",
        }}>{step.level}</span>
      </div>
      <div style={{
        fontSize: 14, fontWeight: 700, color: "#1e2a3a",
        fontFamily: "'Lora',serif", marginBottom: 5, lineHeight: 1.3,
      }}>{step.title}</div>
      <p style={{
        fontSize: 11, color: "#64748b", lineHeight: 1.6,
        margin: "0 0 8px", fontFamily: "sans-serif",
      }}>{step.desc}</p>
      <a href={step.href} style={{
        display: "inline-block",
        fontSize: 10, fontWeight: 700,
        padding: "3px 11px", borderRadius: 999,
        background: `${step.color}12`,
        border: `1.5px solid ${step.color}35`,
        color: step.color, textDecoration: "none",
        fontFamily: "sans-serif",
      }}>{step.tag}</a>
    </>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────
export function RoadmapSection() {
  return (
    <section style={{
      background: "#f8f7ff",
      padding: "80px 0 120px",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: "-120px", left: "-120px",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-100px", right: "-100px",
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 60, position: "relative", zIndex: 2 }}>
        <span style={{
          display: "inline-block",
          color: "#7c3aed", borderRadius: 999,
          padding: "5px 16px", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em",
          textTransform: "uppercase", marginBottom: 14,
          border: "1.5px solid rgba(124,58,237,0.2)",
          background: "rgba(124,58,237,0.05)",
          fontFamily: "sans-serif",
        }}>Your Journey</span>
        <h2 style={{
          fontFamily: "'Lora', serif", fontSize: "clamp(26px, 4vw, 44px)",
          fontWeight: 700, color: "#1e1b4b", lineHeight: 1.2, fontStyle: "italic",
          margin: "0 0 10px",
        }}>
          Your{" "}
          <span style={{
            background: "linear-gradient(135deg,#7c3aed,#ec4899)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>AI-Powered</span>{" "}
          Career Journey
        </h2>
        <p style={{ color: "#94a3b8", fontSize: 15, margin: 0, fontFamily: "sans-serif" }}>
          Six levels from self-discovery to your dream career
        </p>
      </div>

      {/* Responsive CSS */}
      <style>{`
        .rm-desktop { display: block; }
        .rm-mobile  { display: none;  }
        @media (max-width: 1024px) {
          .rm-desktop { display: none;  }
          .rm-mobile  { display: block; }
        }
      `}</style>

      {/* Desktop */}
      <div className="rm-desktop" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px" }}>
        <DesktopRoadmap />
      </div>

      {/* Mobile / tablet */}
      <div className="rm-mobile">
        <MobileRoadmap />
      </div>
    </section>
  )
}