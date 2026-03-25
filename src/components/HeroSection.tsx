"use client"

import { useEffect, useState, useRef } from "react"
import { Sparkles, ArrowRight } from "lucide-react"
import { RocketPathIllustration } from "./rocket-path-illustration"

// ── Role data ───────────────────────────────────────────────
const ROLES = [
  { title: "Software Engineer", r: 139, g:  92, b: 246 },
  { title: "Product Designer",  r: 236, g:  72, b: 153 },
  { title: "Data Scientist",    r:  20, g: 184, b: 166 },
  { title: "Doctor",            r:  16, g: 185, b: 129 },
  { title: "Entrepreneur",      r: 249, g: 115, b:  22 },
  { title: "Lawyer",            r: 245, g: 158, b:  11 },
  { title: "Artist",            r:   6, g: 182, b: 212 },
]

// ── Constellation nodes & edges ─────────────────────────────
const NODES = [
  { x: 82.7, y: 23.1 }, { x: 60.5, y:  8.0 }, { x: 65.1, y: 88.0 },
  { x: 81.4, y: 68.0 }, { x: 15.7, y: 65.0 }, { x: 27.5, y: 36.5 },
  { x: 75.6, y: 16.7 }, { x: 19.1, y: 85.0 }, { x: 88.4, y: 48.0 },
  { x: 93.0, y: 72.0 }, { x: 17.7, y: 22.0 }, { x: 40.4, y: 88.0 },
  { x: 50.2, y: 55.0 }, { x: 35.0, y: 12.0 }, { x: 72.0, y: 44.0 },
  { x:  8.0, y: 44.0 }, { x: 55.0, y: 72.0 }, { x: 44.0, y: 30.0 },
]
const EDGES = (() => {
  const e: [number,number][] = []
  for (let i = 0; i < NODES.length; i++)
    for (let j = i+1; j < NODES.length; j++) {
      const dx = NODES[i].x - NODES[j].x, dy = NODES[i].y - NODES[j].y
      if (Math.sqrt(dx*dx + dy*dy) < 28) e.push([i, j])
    }
  return e
})()

// ── Floating emoji objects ──────────────────────────────────
const OBJECTS = [
  { emoji: "📚", x: 88, y: 12, size: 28, spd: 8,  ph: 0   },
  { emoji: "🎓", x:  4, y: 18, size: 24, spd: 10, ph: 1.5 },
  { emoji: "🧪", x: 92, y: 52, size: 22, spd: 7,  ph: 0.8 },
  { emoji: "💻", x:  2, y: 68, size: 26, spd: 9,  ph: 2.2 },
  { emoji: "📊", x: 76, y: 85, size: 20, spd: 11, ph: 1.0 },
  { emoji: "🧠", x:  8, y: 42, size: 24, spd: 8,  ph: 3.0 },
  { emoji: "⚙️", x: 52, y:  4, size: 20, spd: 12, ph: 0.5 },
  { emoji: "🔬", x: 94, y: 32, size: 22, spd: 9,  ph: 2.8 },
  { emoji: "🎨", x: 46, y: 92, size: 24, spd: 10, ph: 1.8 },
  { emoji: "⚖️", x: 20, y:  6, size: 20, spd: 8,  ph: 0.3 },
]

// ── Glowing dots ────────────────────────────────────────────
const DOTS = Array.from({ length: 12 }, (_, i) => ({
  x: (15 + i * 7.3) % 92 + 4,
  y: (10 + i * 8.7) % 88 + 4,
  ph: i * 0.9,
  spd: 0.5 + (i % 3) * 0.3,
  size: 5 + (i % 3) * 3,
  r: [139,236,20,249,245,6,139,236,20,249,139,20][i],
  g: [92,72,184,115,158,182,92,72,184,115,92,184][i],
  b: [246,153,166,22,11,212,246,153,166,22,246,166][i],
}))

// ── Typewriter hook ─────────────────────────────────────────
function useTypewriter(text: string, speed = 55) {
  const [displayed, setDisplayed] = useState("")
  const [phase, setPhase]         = useState<"typing"|"pause"|"erasing">("typing")
  const targetRef                 = useRef(text)

  useEffect(() => {
    targetRef.current = text
    setPhase("erasing")
  }, [text])

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>
    if (phase === "erasing") {
      if (displayed.length === 0) { setPhase("typing"); return }
      t = setTimeout(() => setDisplayed(d => d.slice(0, -1)), speed / 2)
    } else if (phase === "typing") {
      if (displayed.length < targetRef.current.length)
        t = setTimeout(() => setDisplayed(targetRef.current.slice(0, displayed.length + 1)), speed)
      else setPhase("pause")
    } else {
      t = setTimeout(() => {}, 1200)
    }
    return () => clearTimeout(t)
  }, [displayed, phase, speed])

  return displayed
}

// ── Canvas background ───────────────────────────────────────
function CanvasBg({ roleIdx }: { roleIdx: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const tRef      = useRef(0)
  const rafRef    = useRef(0)
  const roleRef   = useRef(roleIdx)

  useEffect(() => { roleRef.current = roleIdx }, [roleIdx])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const draw = () => {
      const w = canvas.width, h = canvas.height, t = tRef.current
      const ri = roleRef.current
      const { r: cr, g: cg, b: cb } = ROLES[ri]
      ctx.clearRect(0, 0, w, h)

      // Orb 1 top-right (role colour)
      const g1 = ctx.createRadialGradient(w*0.88, h*0.1, 0, w*0.88, h*0.1, w*0.5)
      const s1 = 0.22 + Math.sin(t*0.0008)*0.07
      g1.addColorStop(0,   `rgba(${cr},${cg},${cb},${s1})`)
      g1.addColorStop(0.5, `rgba(${cr},${cg},${cb},${s1*0.3})`)
      g1.addColorStop(1,   "rgba(0,0,0,0)")
      ctx.fillStyle = g1; ctx.fillRect(0, 0, w, h)

      // Orb 2 bottom-left (pink)
      const g2 = ctx.createRadialGradient(w*0.08, h*0.9, 0, w*0.08, h*0.9, w*0.44)
      const s2 = 0.16 + Math.sin(t*0.0006+1)*0.06
      g2.addColorStop(0,   `rgba(236,72,153,${s2})`)
      g2.addColorStop(0.5, `rgba(236,72,153,${s2*0.25})`)
      g2.addColorStop(1,   "rgba(0,0,0,0)")
      ctx.fillStyle = g2; ctx.fillRect(0, 0, w, h)

      // Orb 3 centre (teal)
      const g3 = ctx.createRadialGradient(w*0.45, h*0.5, 0, w*0.45, h*0.5, w*0.3)
      const s3 = 0.1 + Math.sin(t*0.0005+2)*0.04
      g3.addColorStop(0, `rgba(20,184,166,${s3})`); g3.addColorStop(1, "rgba(0,0,0,0)")
      ctx.fillStyle = g3; ctx.fillRect(0, 0, w, h)

      // Spinning ring 1
      ctx.save(); ctx.translate(w*0.88, h*0.5); ctx.rotate(t*0.0004)
      ctx.strokeStyle = `rgba(${cr},${cg},${cb},0.28)`; ctx.lineWidth = 1.5
      ctx.setLineDash([6,8]); ctx.beginPath(); ctx.arc(0, 0, Math.min(w,h)*0.22, 0, Math.PI*2); ctx.stroke()
      ctx.setLineDash([]); ctx.restore()

      // Spinning ring 2
      ctx.save(); ctx.translate(w*0.12, h*0.18); ctx.rotate(-t*0.0006)
      ctx.strokeStyle = "rgba(236,72,153,0.22)"; ctx.lineWidth = 1
      ctx.setLineDash([4,6]); ctx.beginPath(); ctx.arc(0, 0, Math.min(w,h)*0.13, 0, Math.PI*2); ctx.stroke()
      ctx.setLineDash([]); ctx.restore()

      // ── Constellation edges — soft & subtle ──
      const lit = new Set([
        (ri*2)%NODES.length, (ri*2+3)%NODES.length,
        (ri*3+1)%NODES.length, (ri*4+2)%NODES.length,
      ])
      EDGES.forEach(([a, b]) => {
        const active = lit.has(a) || lit.has(b)
        const pulse  = Math.sin(t*0.002 + a*0.4)*0.5 + 0.5
        // Much lower opacity — max 0.18 active, 0.07 inactive
        const alpha  = active ? 0.10 + pulse*0.08 : 0.04 + pulse*0.03
        ctx.strokeStyle = active
          ? `rgba(${cr},${cg},${cb},${alpha})`
          : `rgba(139,92,246,${alpha})`
        ctx.lineWidth = active ? 0.7 : 0.35
        ctx.beginPath()
        ctx.moveTo(NODES[a].x/100*w, NODES[a].y/100*h)
        ctx.lineTo(NODES[b].x/100*w, NODES[b].y/100*h)
        ctx.stroke()
      })

      // ── Constellation nodes — small and soft ──
      NODES.forEach((n, i) => {
        const isLit = lit.has(i)
        const pulse = Math.sin(t*0.002 + i*0.7)*0.5 + 0.5
        const nx = n.x/100*w, ny = n.y/100*h
        const rad   = isLit ? 2.5 : 1.2
        const alpha = isLit ? 0.35 + pulse*0.15 : 0.10 + pulse*0.05
        if (isLit) {
          const gw = ctx.createRadialGradient(nx, ny, 0, nx, ny, rad + 8)
          gw.addColorStop(0, `rgba(${cr},${cg},${cb},${0.05 + pulse*0.03})`)
          gw.addColorStop(1, "rgba(0,0,0,0)")
          ctx.fillStyle = gw
          ctx.beginPath(); ctx.arc(nx, ny, rad + 8, 0, Math.PI*2); ctx.fill()
        }
        ctx.fillStyle = isLit
          ? `rgba(${cr},${cg},${cb},${alpha})`
          : `rgba(139,92,246,${alpha})`
        ctx.beginPath(); ctx.arc(nx, ny, rad, 0, Math.PI*2); ctx.fill()
      })

      // Glowing dots
      DOTS.forEach(d => {
        const dy   = Math.sin(t*0.001*d.spd + d.ph)*22
        const sc   = 1 + Math.sin(t*0.001*d.spd + d.ph)*0.25
        const nx   = d.x/100*w, ny = d.y/100*h + dy
        const rad  = d.size/2*sc
        const gd   = ctx.createRadialGradient(nx, ny, 0, nx, ny, rad*2.5)
        gd.addColorStop(0,   `rgba(${d.r},${d.g},${d.b},0.85)`)
        gd.addColorStop(0.5, `rgba(${d.r},${d.g},${d.b},0.3)`)
        gd.addColorStop(1,   "rgba(0,0,0,0)")
        ctx.fillStyle = gd; ctx.beginPath(); ctx.arc(nx, ny, rad*2.5, 0, Math.PI*2); ctx.fill()
        ctx.fillStyle = `rgba(${d.r},${d.g},${d.b},0.9)`
        ctx.beginPath(); ctx.arc(nx, ny, rad, 0, Math.PI*2); ctx.fill()
      })

      // Floating emoji
      OBJECTS.forEach(obj => {
        const dy  = Math.sin(t*0.001*obj.spd + obj.ph)*18
        const rot = Math.sin(t*0.0008*obj.spd + obj.ph)*0.18
        ctx.save()
        ctx.translate(obj.x/100*w, obj.y/100*h + dy); ctx.rotate(rot)
        ctx.globalAlpha = 0.65
        ctx.font = `${obj.size}px serif`
        ctx.textAlign = "center"; ctx.textBaseline = "middle"
        ctx.fillText(obj.emoji, 0, 0)
        ctx.restore()
      })

      tRef.current++
      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", resize) }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}

// ── Main HeroSection ────────────────────────────────────────
export function HeroSection() {
  const [roleIdx,   setRoleIdx]   = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [hasResult, setHasResult] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    try { setHasResult(!!localStorage.getItem("aptitudeResult")) } catch {}
    const iv = setInterval(() => setRoleIdx(p => (p + 1) % ROLES.length), 4000)
    return () => clearInterval(iv)
  }, [])

  const { r, g, b } = ROLES[roleIdx]
  const roleColor   = `rgb(${r},${g},${b})`
  const displayed   = useTypewriter(ROLES[roleIdx].title)

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-30 bg-white">

      <style>{`
        @keyframes cursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes scrollBounce {
          0%,100%{transform:translateX(-50%) translateY(0)}
          50%{transform:translateX(-50%) translateY(9px)}
        }
      `}</style>

      {/* Single canvas — all background animation */}
      <CanvasBg roleIdx={roleIdx} />

      {/* Content */}
      <div className="relative w-full max-w-6xl mx-auto" style={{ zIndex: 10 }}>
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* ── Left — copy ── */}
          <div className="text-center lg:text-left">

            {/* Live badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border shadow-md mb-8"
              style={{
                background:  "rgba(255,255,255,0.92)",
                borderColor: `rgba(${r},${g},${b},0.3)`,
                opacity:     isVisible ? 1 : 0,
                transform:   isVisible ? "translateY(0)" : "translateY(16px)",
                transition:  "all 1s ease, border-color 0.8s ease",
              }}
            >
              <Sparkles className="w-4 h-4" style={{ color: roleColor }} />
              <span className="text-sm font-medium" style={{ color: "#475569" }}>AI-Powered Career Guidance</span>
            </div>

            {/* Headline with typewriter */}
            <h1
              className="font-bold tracking-tight mb-6"
              style={{
                fontSize:   "clamp(36px, 6vw, 72px)",
                lineHeight: 1.1,
                opacity:    isVisible ? 1 : 0,
                transform:  isVisible ? "translateY(0)" : "translateY(32px)",
                transition: "all 1s ease 0.2s",
              }}
            >
              <span style={{ color: "#1e2a3a" }}>Become the</span>
              <br />
              <span
                className="whitespace-nowrap"
                style={{
                  color:      roleColor,
                  display:    "inline-block",
                  minHeight:  "1.15em",
                  transition: "color 0.8s ease",
                }}
              >
                {displayed}
                <span style={{
                  display:       "inline-block",
                  width:         3,
                  height:        "0.85em",
                  background:    roleColor,
                  marginLeft:    3,
                  verticalAlign: "middle",
                  borderRadius:  2,
                  animation:     "cursorBlink 0.75s step-end infinite",
                  transition:    "background 0.8s ease",
                }} />
              </span>
              <br />
              <span style={{ color: "#94a3b8", fontSize: "0.42em", fontWeight: 400 }}>
                you were always meant to be.
              </span>
            </h1>

            {/* Sub-copy */}
            <p
              className="text-lg md:text-xl max-w-xl mx-auto lg:mx-0 mb-12 leading-relaxed"
              style={{
                color:      "#64748b",
                opacity:    isVisible ? 1 : 0,
                transform:  isVisible ? "translateY(0)" : "translateY(24px)",
                transition: "all 1s ease 0.4s",
              }}
            >
              Our AI analyses your aptitude, personality, and goals to match you
              with careers you'll actually love — then maps out{" "}
              <strong style={{ color: "#1e2a3a" }}>exactly</strong> how to get there.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-4"
              style={{
                opacity:    isVisible ? 1 : 0,
                transform:  isVisible ? "translateY(0)" : "translateY(20px)",
                transition: "all 1s ease 0.6s",
              }}
            >
              {hasResult ? (
                <a href="/results"
                  className="group inline-flex items-center gap-2 text-lg px-8 py-4 rounded-full text-white font-semibold transition-all duration-300 hover:scale-105"
                  style={{ background: "linear-gradient(135deg,#22c55e,#16a34a)", boxShadow: "0 10px 32px rgba(34,197,94,0.35)" }}
                >
                  View My Results ✓
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </a>
              ) : (
                <a href="/aptitude"
                  className="group inline-flex items-center gap-2 text-lg px-8 py-4 rounded-full text-white font-semibold hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg,rgb(${r},${g},${b}),rgb(${Math.min(r+60,255)},${Math.min(g+40,255)},${Math.min(b+80,255)}))`,
                    boxShadow:  `0 10px 32px rgba(${r},${g},${b},0.4)`,
                    transition: "background 0.8s ease, box-shadow 0.8s ease, transform 0.3s",
                  }}
                >
                  Take the Aptitude Test 🚀
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </a>
              )}
            </div>
          </div>

          {/* ── Right — animated illustrations ── */}
          <div
            className="hidden lg:block relative"
            style={{
              opacity:    isVisible ? 1 : 0,
              transform:  isVisible ? "translateX(0)" : "translateX(48px)",
              transition: "all 1s ease 0.3s",
            }}
          >
            <div className="relative">
              <RocketPathIllustration className="h-80 lg:h-96" />
            </div>
          </div>

        </div>
      </div>

      {/* Scroll hint */}
      <div style={{
        position:   "absolute", bottom: 32, left: "50%", zIndex: 10,
        opacity:    isVisible ? 1 : 0,
        transition: "opacity 1s ease 1s",
        animation:  "scrollBounce 2s ease-in-out infinite",
      }}>
        <div style={{ color: "rgba(148,163,184,0.7)", fontSize: 11, letterSpacing: "0.12em", fontWeight: 700, textAlign: "center" }}>
          ↓ &nbsp; SCROLL TO EXPLORE
        </div>
      </div>
    </section>
  )
}