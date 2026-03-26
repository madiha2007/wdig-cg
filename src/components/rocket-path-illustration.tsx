"use client"

import { useEffect, useRef } from "react"

export function RocketPathIllustration({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    const ctx = canvas.getContext("2d")!
    let animId: number
    let t = 0
    let progress = 0
    let loopPhase: "forward" | "pause" | "rewind" = "forward"
    let pauseTimer = 0

    const MILESTONES = [
      { t: 0.08, label: "School", icon: "📚", r: 139, g: 92, b: 246 },
      { t: 0.25, label: "Aptitude Test", icon: "🧪", r: 236, g: 72, b: 153 },
      { t: 0.42, label: "Skills", icon: "💡", r: 20, g: 184, b: 166 },
      { t: 0.58, label: "Internship", icon: "💼", r: 249, g: 115, b: 22 },
      { t: 0.74, label: "First Job", icon: "🚀", r: 245, g: 158, b: 11 },
      { t: 0.92, label: "Dream Career", icon: "🏆", r: 16, g: 185, b: 129 },
    ]

    const revealed = new Array(MILESTONES.length).fill(false)
    const mScale = new Array(MILESTONES.length).fill(0)
    const trail: { x: number; y: number }[] = []
    const TRAIL_LEN = 110
    let stars: { x: number; y: number; r: number; ph: number; col: number[] }[] = []

    function resize() {
      if (!canvas || !wrap) return;
      canvas.width = wrap.offsetWidth
      canvas.height = wrap.offsetHeight
      // regenerate stars on resize
      stars = Array.from({ length: 28 }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 2 + 0.5,
        ph: Math.random() * Math.PI * 2,
        col: [[139, 92, 246], [236, 72, 153], [20, 184, 166], [249, 115, 22], [245, 158, 11], [6, 182, 212]][Math.floor(Math.random() * 6)],
      }))
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)

    function getPath(w: number, h: number) {
      return [
        { x: w * 0.10, y: h * 0.88 },
        { x: w * 0.22, y: h * 0.70 },
        { x: w * 0.36, y: h * 0.58 },
        { x: w * 0.50, y: h * 0.44 },
        { x: w * 0.64, y: h * 0.30 },
        { x: w * 0.78, y: h * 0.20 },
        { x: w * 0.90, y: h * 0.10 },
      ]
    }

    function pathPoint(pts: { x: number; y: number }[], t: number) {
      const n = pts.length - 1
      const seg = Math.min(Math.floor(t * n), n - 1)
      const lt = t * n - seg
      const p0 = pts[Math.max(seg - 1, 0)]
      const p1 = pts[seg]
      const p2 = pts[Math.min(seg + 1, n)]
      const p3 = pts[Math.min(seg + 2, n)]
      const t2 = lt * lt, t3 = lt * lt * lt
      return {
        x: 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * lt + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
        y: 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * lt + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
      }
    }

    function pathAngle(pts: { x: number; y: number }[], t: number) {
      const a = pathPoint(pts, Math.max(t - 0.01, 0))
      const b = pathPoint(pts, Math.min(t + 0.01, 1))
      return Math.atan2(b.y - a.y, b.x - a.x)
    }

    function drawRocket(x: number, y: number, angle: number) {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle + Math.PI / 2)

      // Flame
      const fl = 14 + Math.sin(t * 0.3) * 4
      const fg = ctx.createLinearGradient(0, 8, 0, 8 + fl)
      fg.addColorStop(0, "rgba(255,200,50,0.9)")
      fg.addColorStop(0.5, "rgba(255,100,30,0.7)")
      fg.addColorStop(1, "rgba(255,50,0,0)")
      ctx.fillStyle = fg
      ctx.beginPath()
      ctx.moveTo(-5, 10); ctx.lineTo(5, 10); ctx.lineTo(0, 10 + fl)
      ctx.closePath(); ctx.fill()

      // Body
      ctx.fillStyle = "#7c3aed"
      ctx.beginPath()
      ctx.moveTo(0, -18); ctx.lineTo(7, 0); ctx.lineTo(7, 10); ctx.lineTo(-7, 10); ctx.lineTo(-7, 0)
      ctx.closePath(); ctx.fill()

      // Nose
      ctx.fillStyle = "#ec4899"
      ctx.beginPath()
      ctx.moveTo(0, -18); ctx.lineTo(7, 0); ctx.lineTo(-7, 0)
      ctx.closePath(); ctx.fill()

      // Window
      ctx.fillStyle = "rgba(255,255,255,0.9)"
      ctx.beginPath(); ctx.arc(0, 2, 4, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = "#bfdbfe"
      ctx.beginPath(); ctx.arc(0, 2, 2.5, 0, Math.PI * 2); ctx.fill()

      // Fins
      ctx.fillStyle = "#6d28d9"
      ctx.beginPath(); ctx.moveTo(-7, 6); ctx.lineTo(-13, 12); ctx.lineTo(-7, 10); ctx.closePath(); ctx.fill()
      ctx.beginPath(); ctx.moveTo(7, 6); ctx.lineTo(13, 12); ctx.lineTo(7, 10); ctx.closePath(); ctx.fill()

      ctx.restore()
    }

    function draw() {
      if (!canvas || !ctx) return;
      const w = canvas.width, h = canvas.height
      ctx.clearRect(0, 0, w, h)
      const pts = getPath(w, h)
      const rp = pathPoint(pts, progress)

      // Background orb following rocket
      const bg = ctx.createRadialGradient(rp.x, rp.y, 0, rp.x, rp.y, w * 0.55)
      bg.addColorStop(0, "rgba(124,58,237,0)")
      bg.addColorStop(1, "rgba(0,0,0,0)")
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h)

      // Star field
      stars.forEach(s => {
        const alpha = 0.15 + Math.sin(t * 0.04 + s.ph) * 0.1
        ctx.fillStyle = `rgba(${s.col[0]},${s.col[1]},${s.col[2]},${alpha})`
        ctx.beginPath(); ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2); ctx.fill()
      })

      // Ghost path
      ctx.strokeStyle = "rgba(139,92,246,0.1)"
      ctx.lineWidth = 2; ctx.setLineDash([6, 8])
      ctx.beginPath()
      for (let i = 0; i <= 100; i++) {
        const p = pathPoint(pts, i / 100)
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)
      }
      ctx.stroke(); ctx.setLineDash([])

      // Coloured trail
      if (trail.length > 1) {
        for (let i = 1; i < trail.length; i++) {
          const frac = i / trail.length
          const alpha = frac * 0.75
          const cr = Math.round(139 + (236 - 139) * Math.min(frac * 3, 1))
          const cg2 = Math.round(92 + (72 - 92) * Math.min(frac * 3, 1))
          const cb2 = Math.round(246 + (153 - 246) * Math.min(frac * 3, 1))
          ctx.strokeStyle = `rgba(${cr},${cg2},${cb2},${alpha})`
          ctx.lineWidth = 3 * frac + 1
          ctx.lineCap = "round"
          ctx.beginPath()
          ctx.moveTo(trail[i - 1].x, trail[i - 1].y)
          ctx.lineTo(trail[i].x, trail[i].y)
          ctx.stroke()
        }
      }

      // Trail sparkles
      for (let i = trail.length - 1; i >= 0; i--) {
        const age = trail.length - i
        const alpha = Math.max(0, 1 - age / TRAIL_LEN) * 0.55
        const sz = Math.max(0, (1 - age / TRAIL_LEN)) * 3.5
        if (sz < 0.3) continue
        const cols = ["rgba(139,92,246,", "rgba(236,72,153,", "rgba(20,184,166,", "rgba(249,115,22,"]
        ctx.fillStyle = cols[i % 4] + alpha + ")"
        ctx.beginPath(); ctx.arc(trail[i].x, trail[i].y, sz, 0, Math.PI * 2); ctx.fill()
      }

      // Milestones
      MILESTONES.forEach((m, mi) => {
        const mp = pathPoint(pts, m.t)
        const s = mScale[mi]
        if (s < 0.01) return

        const pulse = Math.sin(t * 0.06 + mi) * 0.5 + 0.5

        // Pulse ring
        ctx.strokeStyle = `rgba(${m.r},${m.g},${m.b},${0.3 * s})`
        ctx.lineWidth = 1.5
        ctx.beginPath(); ctx.arc(mp.x, mp.y, 24 + pulse * 6, 0, Math.PI * 2); ctx.stroke()

        // Glow bg
        const gw = ctx.createRadialGradient(mp.x, mp.y, 0, mp.x, mp.y, 22 * s)
        gw.addColorStop(0, `rgba(${m.r},${m.g},${m.b},0.2)`)
        gw.addColorStop(1, `rgba(${m.r},${m.g},${m.b},0)`)
        ctx.fillStyle = gw
        ctx.beginPath(); ctx.arc(mp.x, mp.y, 22 * s, 0, Math.PI * 2); ctx.fill()

        // Circle
        ctx.fillStyle = `rgba(${m.r},${m.g},${m.b},${0.95 * s})`
        ctx.beginPath(); ctx.arc(mp.x, mp.y, 18 * s, 0, Math.PI * 2); ctx.fill()

        // Emoji
        ctx.font = `${14 * s}px serif`
        ctx.textAlign = "center"; ctx.textBaseline = "middle"
        ctx.globalAlpha = s
        ctx.fillText(m.icon, mp.x, mp.y)
        ctx.globalAlpha = 1

        // Label
        ctx.fillStyle = `rgba(${m.r},${m.g},${m.b},${s})`
        ctx.font = `700 ${11 * s}px sans-serif`
        ctx.textAlign = "center"; ctx.textBaseline = "alphabetic"
        const offY = m.t < 0.5 ? 34 * s : -22 * s
        ctx.fillText(m.label, mp.x, mp.y + offY)
      })

      // Rocket
      drawRocket(rp.x, rp.y, pathAngle(pts, progress))

      // Advance
      if (loopPhase === "forward") {
        progress += 0.004
        trail.push({ x: rp.x, y: rp.y })
        if (trail.length > TRAIL_LEN) trail.shift()

        MILESTONES.forEach((m, mi) => {
          if (progress >= m.t && !revealed[mi]) revealed[mi] = true
          if (revealed[mi] && mScale[mi] < 1) mScale[mi] = Math.min(1, mScale[mi] + 0.06)
        })

        if (progress >= 1) { progress = 1; loopPhase = "pause"; pauseTimer = 0 }
      } else if (loopPhase === "pause") {
        pauseTimer++
        if (pauseTimer > 90) { loopPhase = "rewind"; revealed.fill(false) }
      } else {
        progress -= 0.008
        if (trail.length > 0) trail.pop()
        MILESTONES.forEach((m, mi) => {
          if (progress < m.t) mScale[mi] = Math.max(0, mScale[mi] - 0.08)
        })
        if (progress <= 0) { progress = 0; trail.length = 0; loopPhase = "forward" }
      }

      t++
      animId = requestAnimationFrame(draw)
    }

    animId = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
    }
  }, [])

  return (
    <div ref={wrapRef} className={`relative w-full ${className}`} style={{ minHeight: 320 }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
}
