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
    title: "Explore Trending Careers",
    desc: "Real-time insights into emerging opportunities shaping the future of work.",
    tag: "Trending 🔥",
    color: "#06b6d4",
    href: "/trending",
    side: "right" as const,
    img: "/roadmap/level4.png",
  },
  {
    level: "Level 05",
    title: "Find Best Institutes",
    desc: "Top colleges and courses tailored to your career path, location, and goals.",
    tag: "Colleges 🏫",
    color: "#10b981",
    href: "/institute",
    side: "left" as const,
    img: "/roadmap/level5.png",
  },
  {
    level: "Level 06",
    title: "Connect With Mentors",
    desc: "Learn from those who've already walked the path — real-world guidance no textbook offers.",
    tag: "Mentorship 🤝",
    color: "#8b5cf6",
    href: "/mentors",
    side: "right" as const,
    img: "/roadmap/level6.png",
  },
  {
    level: "Level 07",
    title: "Talk to AI Career Bot",
    desc: "24/7 personalised career advice from our AI chatbot — ask anything, anytime.",
    tag: "AI Chat 💬",
    color: "#7c3aed",
    href: "/chatbot",
    side: "left" as const,
    img: "/roadmap/level7.png",
  },
]

// ── Road geometry (SVG coordinate space) ──────────────────────────────────────
// ViewBox 900 × 1260, path winds left-right through center column
// Dot anchor points sit on the path at equal Y intervals
const VB_W    = 900
const VB_H    = 1260
const Y_START = 90
const Y_STEP  = 180
// Path winds through center: alternating x ~340 and ~560
const DOT_XS  = [340, 560, 340, 560, 340, 560, 340]
const DOT_YS  = STEPS.map((_, i) => Y_START + i * Y_STEP)
const TENSION = 0.45

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

export function RoadmapSection() {
  const svgRef   = useRef<SVGSVGElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const rafRef   = useRef<number>(0)
  const dashOff  = useRef(0)

  // Animate dashes
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

  // Layout dots + floating content
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
        const px   = svgX * sx   // pixel x of dot centre
        const py   = svgY * sy   // pixel y of dot centre

        // ── SVG dot: small clean circle with subtle glow ──
        if (dotsG) {
          const ns = "http://www.w3.org/2000/svg"

          // Outer glow ring
          const glow = document.createElementNS(ns, "circle")
          glow.setAttribute("cx", String(svgX))
          glow.setAttribute("cy", String(svgY))
          glow.setAttribute("r", "22")
          glow.setAttribute("fill", step.color)
          glow.setAttribute("opacity", "0.12")
          glow.classList.add("rm-dyn")
          dotsG.appendChild(glow)

          // White fill circle
          const ring = document.createElementNS(ns, "circle")
          ring.setAttribute("cx", String(svgX))
          ring.setAttribute("cy", String(svgY))
          ring.setAttribute("r", "14")
          ring.setAttribute("fill", "white")
          ring.setAttribute("stroke", step.color)
          ring.setAttribute("stroke-width", "2")
          ring.classList.add("rm-dyn")
          dotsG.appendChild(ring)

          // Solid inner dot
          const inner = document.createElementNS(ns, "circle")
          inner.setAttribute("cx", String(svgX))
          inner.setAttribute("cy", String(svgY))
          inner.setAttribute("r", "5")
          inner.setAttribute("fill", step.color)
          inner.classList.add("rm-dyn")
          dotsG.appendChild(inner)
        }


        // ── Content block: icon + text, positioned cleanly on one side of the dot ──
        const isLeft = step.side === "left"
        const BLOCK_W   = 300   // px
        const BLOCK_H   = 180   // px estimated for vertical centering
        const DOT_RADIUS = 14 * sx  // dot visual radius in pixels (r=14 in SVG units)
        const GAP        = 48   // px gap between dot edge and card edge

        // For left-side: block sits to the LEFT of the dot
        // For right-side: block sits to the RIGHT of the dot
        const blockLeft = isLeft
          ? px - DOT_RADIUS - GAP - BLOCK_W
          : px + DOT_RADIUS + GAP

        const el = document.createElement("div")
        el.style.cssText = `
          position: absolute;
          width: ${BLOCK_W}px;
          left: ${Math.max(4, blockLeft)}px;
          top: ${py - BLOCK_H / 2}px;
          z-index: 5;
          opacity: 0;
          transform: translateX(${isLeft ? "-14px" : "14px"});
          transition: opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s;
          pointer-events: all;
        `

        el.innerHTML = `
          <div style="display:flex; align-items:flex-start; gap:14px; flex-direction:${isLeft ? "row-reverse" : "row"};">
            <div style="
              width:72px; height:72px; flex-shrink:0;
              border-radius:50%;
              background:white;
              border:2px solid ${step.color}25;
              box-shadow:0 4px 16px ${step.color}20, 0 1px 4px rgba(0,0,0,0.06);
              display:flex; align-items:center; justify-content:center;
              overflow:hidden;
            "><img src="${step.img}" alt="${step.title}" style="width:48px;height:48px;object-fit:contain;" /></div>
            <div style="flex:1; text-align:${isLeft ? "right" : "left"};">
              <div style="
                font-size:10px; font-weight:700; letter-spacing:0.12em;
                text-transform:uppercase; color:${step.color};
                margin-bottom:4px; font-family:sans-serif;
              ">${step.level}</div>
              <div style="
                font-size:18px; font-weight:700; color:#1e2a3a;
                line-height:1.3; margin-bottom:7px;
                font-family:'Lora',serif;
              ">${step.title}</div>
              <p style="
                font-size:13px; color:#64748b;
                line-height:1.65; margin-bottom:10px;
                font-family:sans-serif;
              ">${step.desc}</p>
              <a href="${step.href}" style="
                display:inline-block;
                font-size:12px; font-weight:700;
                padding:5px 15px; border-radius:999px;
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
    <section style={{
      background: "#f8f7ff",
      padding: "80px 0 120px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Subtle background blobs like reference image */}
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
        }}>
          Your Journey
        </span>
        <h2 style={{
          fontFamily: "'Lora', serif", fontSize: "clamp(26px, 4vw, 44px)",
          fontWeight: 700, color: "#1e1b4b", lineHeight: 1.2, fontStyle: "italic",
        }}>
          Your{" "}
          <span style={{
            background: "linear-gradient(135deg,#7c3aed,#ec4899)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
            AI-Powered
          </span>{" "}
          Career Journey
        </h2>
        <p style={{ color: "#94a3b8", fontSize: 15, marginTop: 10, fontFamily: "sans-serif" }}>
          Seven levels from self-discovery to your dream career
        </p>
      </div>

      {/* Road canvas */}
      <div style={{
        position: "relative",
        maxWidth: 1100,
        margin: "0 auto",
        padding: "0 24px",
      }}>
        <div style={{ position: "relative" }}>
          <svg
            ref={svgRef}
            width="100%"
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: "block", overflow: "visible" }}
          >
            {/* Very faint filled road shape for depth */}
            <path
              d={ROAD_D}
              fill="none"
              stroke="rgba(124,58,237,0.06)"
              strokeWidth="60"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Main dashed path — like reference image */}
            <path
              id="rm-dashes"
              d={ROAD_D}
              fill="none"
              stroke="rgba(124,58,237,0.35)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="10 10"
              strokeDashoffset="0"
            />
            {/* Dots layer */}
            <g id="rm-dots-g" />
          </svg>

          {/* Floating icons + text */}
          <div
            ref={cardsRef}
            style={{
              position: "absolute",
              top: 0, left: 0, right: 0, bottom: 0,
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </section>
  )
}