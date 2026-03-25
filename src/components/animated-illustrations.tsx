"use client"

import { useEffect, useState } from "react"

// Animated person working on laptop
export function WorkingPersonIllustration({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Desk */}
      <rect x="50" y="220" width="300" height="10" rx="5" className="fill-amber-200" />
      <rect x="80" y="230" width="20" height="50" rx="4" className="fill-amber-300" />
      <rect x="300" y="230" width="20" height="50" rx="4" className="fill-amber-300" />
      
      {/* Laptop */}
      <g className="animate-pulse" style={{ animationDuration: "3s" }}>
        <rect x="120" y="180" width="160" height="40" rx="4" className="fill-slate-200 stroke-slate-300 stroke-2" />
        <rect x="140" y="130" width="120" height="50" rx="4" className="fill-slate-100 stroke-slate-300 stroke-2" />
        {/* Screen content - animated */}
        <rect x="150" y="140" width="40" height="4" rx="2" className="fill-violet-500 animate-pulse" />
        <rect x="150" y="150" width="60" height="4" rx="2" className="fill-slate-300" />
        <rect x="150" y="160" width="50" height="4" rx="2" className="fill-slate-300" />
        <circle cx="240" cy="155" r="15" className="fill-pink-100 stroke-pink-400 stroke-2" />
      </g>
      
      {/* Person */}
      <g>
        {/* Body */}
        <ellipse cx="200" cy="110" rx="25" ry="30" className="fill-violet-500" />
        {/* Head */}
        <circle cx="200" cy="60" r="25" className="fill-amber-200" />
        {/* Hair */}
        <path d="M175 50 Q200 30 225 50" className="stroke-amber-800 stroke-[8] fill-none" strokeLinecap="round" />
        {/* Face */}
        <circle cx="192" cy="55" r="3" className="fill-slate-700" />
        <circle cx="208" cy="55" r="3" className="fill-slate-700" />
        <path d="M195 68 Q200 73 205 68" className="stroke-slate-500 stroke-2 fill-none" strokeLinecap="round" />
        {/* Arms - animated typing */}
        <g className="origin-center" style={{ animation: "typing 0.3s ease-in-out infinite alternate" }}>
          <path d="M175 100 Q150 130 140 170" className="stroke-violet-500 stroke-[12] fill-none" strokeLinecap="round" />
          <circle cx="140" cy="170" r="8" className="fill-amber-200" />
        </g>
        <g className="origin-center" style={{ animation: "typing 0.3s ease-in-out infinite alternate-reverse" }}>
          <path d="M225 100 Q250 130 260 170" className="stroke-violet-500 stroke-[12] fill-none" strokeLinecap="round" />
          <circle cx="260" cy="170" r="8" className="fill-amber-200" />
        </g>
      </g>
      
      {/* Floating elements */}
      <g className="animate-bounce" style={{ animationDuration: "2s" }}>
        <circle cx="320" cy="80" r="20" className="fill-teal-100 stroke-teal-400 stroke-2" />
        <path d="M310 80 L320 90 L335 70" className="stroke-teal-500 stroke-3 fill-none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="animate-bounce" style={{ animationDuration: "2.5s", animationDelay: "0.5s" }}>
        <circle cx="70" cy="100" r="15" className="fill-coral-100 stroke-coral-400 stroke-2" style={{ fill: '#ffe4e1', stroke: '#f97316' }} />
        <text x="60" y="106" className="fill-orange-500 text-sm font-bold">AI</text>
      </g>
      
      {/* Stars decoration */}
      <g className="animate-pulse" style={{ animationDuration: "1.5s" }}>
        <path d="M340 140 L342 135 L344 140 L349 142 L344 144 L342 149 L340 144 L335 142 Z" className="fill-amber-400" />
      </g>
      <g className="animate-pulse" style={{ animationDuration: "1.8s", animationDelay: "0.3s" }}>
        <path d="M60 60 L62 55 L64 60 L69 62 L64 64 L62 69 L60 64 L55 62 Z" className="fill-pink-400" />
      </g>
      
      {/* Coffee cup */}
      <g>
        <rect x="290" y="200" width="25" height="20" rx="3" className="fill-rose-100 stroke-rose-300 stroke-2" />
        <path d="M315 205 Q325 210 315 215" className="stroke-rose-300 stroke-2 fill-none" />
        {/* Steam - animated */}
        <path d="M297 195 Q295 185 300 180" className="stroke-slate-300 stroke-2 fill-none animate-pulse" />
        <path d="M305 195 Q307 185 302 178" className="stroke-slate-300 stroke-2 fill-none animate-pulse" style={{ animationDelay: "0.5s" }} />
      </g>
      
      <style jsx>{`
        @keyframes typing {
          0% { transform: translateY(0); }
          100% { transform: translateY(-3px); }
        }
      `}</style>
    </svg>
  )
}

// Career path roadmap illustration
export function CareerRoadmapIllustration({ className = "" }: { className?: string }) {
  const [activeNode, setActiveNode] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNode(prev => (prev + 1) % 4)
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  const nodeColors = [
    { fill: "fill-violet-500", ring: "stroke-violet-200", bg: "fill-violet-100" },
    { fill: "fill-teal-500", ring: "stroke-teal-200", bg: "fill-teal-100" },
    { fill: "fill-orange-500", ring: "stroke-orange-200", bg: "fill-orange-100" },
    { fill: "fill-pink-500", ring: "stroke-pink-200", bg: "fill-pink-100" }
  ]
  
  return (
    <svg className={className} viewBox="0 0 440 280" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Path line */}
      <path 
        d="M60 230 Q110 205 160 175 Q210 145 265 115 Q310 90 370 65" 
        className="stroke-slate-200 stroke-[4] fill-none" 
        strokeDasharray="8 8"
      />
      {/* Animated progress line - gradient effect */}
      <defs>
        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="33%" stopColor="#14b8a6" />
          <stop offset="66%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <path 
        d="M60 230 Q110 205 160 175 Q210 145 265 115 Q310 90 370 65" 
        stroke="url(#pathGradient)"
        strokeWidth="4"
        fill="none"
        strokeDasharray="340"
        strokeDashoffset="340"
        style={{ animation: "drawPath 3s ease-in-out infinite" }}
      />
      
      {/* Nodes */}
      {[
        { x: 60,  y: 230, label: "Start"   },
        { x: 160, y: 175, label: "Skills"  },
        { x: 265, y: 115, label: "Growth"  },
        { x: 370, y: 65,  label: "Success" }
      ].map((node, i) => (
        <g key={i}>
          <circle 
            cx={node.x} 
            cy={node.y} 
            r={activeNode >= i ? 20 : 15}
            className={`transition-all duration-500 ${
              activeNode >= i 
                ? `${nodeColors[i].fill} ${nodeColors[i].ring} stroke-4` 
                : "fill-white stroke-slate-200 stroke-2"
            }`}
          />
          {activeNode >= i && (
            <circle 
              cx={node.x} 
              cy={node.y} 
              r="30"
              className={`fill-none ${nodeColors[i].ring} stroke-2 animate-ping`}
              style={{ animationDuration: "1.5s" }}
            />
          )}
          <text 
            x={node.x} 
            y={node.y + 45} 
            textAnchor="middle" 
            className={`text-xs font-medium transition-all duration-300 ${
              activeNode >= i ? "fill-slate-700" : "fill-slate-400"
            }`}
          >
            {node.label}
          </text>
          {/* Icons inside nodes */}
          {i === 0 && (
            <circle cx={node.x} cy={node.y} r="6" className={activeNode >= i ? "fill-white" : "fill-slate-300"} />
          )}
          {i === 1 && (
            <path d={`M${node.x - 6} ${node.y} L${node.x} ${node.y - 6} L${node.x + 6} ${node.y} L${node.x} ${node.y + 6} Z`} 
              className={activeNode >= i ? "fill-white" : "fill-slate-300"} />
          )}
          {i === 2 && (
            <path d={`M${node.x - 5} ${node.y + 5} L${node.x} ${node.y - 5} L${node.x + 5} ${node.y + 5} Z`} 
              className={activeNode >= i ? "fill-white" : "fill-slate-300"} />
          )}
          {i === 3 && (
            <path d={`M${node.x - 6} ${node.y + 2} L${node.x - 2} ${node.y + 6} L${node.x + 8} ${node.y - 4}`} 
              className={activeNode >= i ? "stroke-white stroke-3 fill-none" : "stroke-slate-300 stroke-2 fill-none"} 
              strokeLinecap="round" strokeLinejoin="round" />
          )}
        </g>
      ))}
      
      {/* Decorative elements */}
      <g className="animate-pulse" style={{ animationDuration: "2s" }}>
        <rect x="105" y="148" width="30" height="20" rx="4" className="fill-amber-50 stroke-amber-200" />
        <rect x="110" y="153" width="15" height="3" rx="1" className="fill-amber-400" />
        <rect x="110" y="159" width="20" height="3" rx="1" className="fill-amber-200" />
      </g>
      
      <g className="animate-pulse" style={{ animationDuration: "2.5s", animationDelay: "0.5s" }}>
        <rect x="295" y="140" width="35" height="25" rx="4" className="fill-violet-50 stroke-violet-200" />
        <circle cx="312" cy="152" r="8" className="fill-violet-100 stroke-violet-400" />
      </g>
      
      <style jsx>{`
        @keyframes drawPath {
          0% { stroke-dashoffset: 300; }
          50% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>
    </svg>
  )
}

// Floating skill badges illustration
export function SkillBadgesIllustration({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Central figure silhouette */}
      <circle cx="150" cy="100" r="40" className="fill-violet-100 stroke-violet-200 stroke-2" />
      <circle cx="150" cy="80" r="18" className="fill-violet-200" />
      <ellipse cx="150" cy="115" rx="22" ry="25" className="fill-violet-200" />
      
      {/* Floating skill badges - multi-colored */}
      <g className="animate-float" style={{ animationDelay: "0s" }}>
        <rect x="40" y="30" width="60" height="28" rx="14" className="fill-pink-100 stroke-pink-300 stroke-2" />
        <text x="70" y="49" textAnchor="middle" className="fill-pink-600 text-xs font-medium">Design</text>
      </g>
      
      <g className="animate-float" style={{ animationDelay: "0.5s" }}>
        <rect x="200" y="40" width="70" height="28" rx="14" className="fill-violet-500 stroke-violet-600" />
        <text x="235" y="59" textAnchor="middle" className="fill-white text-xs font-medium">Leadership</text>
      </g>
      
      <g className="animate-float" style={{ animationDelay: "1s" }}>
        <rect x="30" y="120" width="55" height="28" rx="14" className="fill-teal-100 stroke-teal-400 stroke-2" />
        <text x="57" y="139" textAnchor="middle" className="fill-teal-600 text-xs font-medium">Code</text>
      </g>
      
      <g className="animate-float" style={{ animationDelay: "1.5s" }}>
        <rect x="210" y="130" width="65" height="28" rx="14" className="fill-orange-100 stroke-orange-300 stroke-2" />
        <text x="242" y="149" textAnchor="middle" className="fill-orange-600 text-xs font-medium">Strategy</text>
      </g>
      
      <g className="animate-float" style={{ animationDelay: "2s" }}>
        <rect x="100" y="160" width="80" height="28" rx="14" className="fill-amber-100 stroke-amber-400 stroke-2" />
        <text x="140" y="179" textAnchor="middle" className="fill-amber-600 text-xs font-medium">Innovation</text>
      </g>
      
      {/* Connection lines - gradient colors */}
      <line x1="100" y1="44" x2="130" y2="70" className="stroke-pink-300 stroke-2" strokeDasharray="4 4" />
      <line x1="200" y1="54" x2="175" y2="75" className="stroke-violet-300 stroke-2" strokeDasharray="4 4" />
      <line x1="85" y1="134" x2="120" y2="115" className="stroke-teal-300 stroke-2" strokeDasharray="4 4" />
      <line x1="210" y1="144" x2="180" y2="120" className="stroke-orange-300 stroke-2" strokeDasharray="4 4" />
      <line x1="140" y1="160" x2="150" y2="140" className="stroke-amber-300 stroke-2" strokeDasharray="4 4" />
    </svg>
  )
}

// Growth chart illustration
export function GrowthChartIllustration({ className = "" }: { className?: string }) {
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    const timer = setTimeout(() => setProgress(100), 500)
    return () => clearTimeout(timer)
  }, [])

  const barColors = [
    "fill-violet-300",
    "fill-teal-300",
    "fill-pink-300",
    "fill-orange-300",
    "fill-amber-300",
    "fill-violet-500"
  ]
  
  return (
    <svg className={className} viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Grid lines */}
      {[40, 80, 120, 160].map((y) => (
        <line key={y} x1="40" y1={y} x2="280" y2={y} className="stroke-slate-100" strokeWidth="1" />
      ))}
      
      {/* Y axis */}
      <line x1="40" y1="40" x2="40" y2="175" className="stroke-slate-300 stroke-2" />
      {/* X axis */}
      <line x1="40" y1="175" x2="280" y2="175" className="stroke-slate-300 stroke-2" />
      
      {/* Bars - multi-colored */}
      {[
        { x: 60, height: 40, delay: 0 },
        { x: 100, height: 60, delay: 0.1 },
        { x: 140, height: 55, delay: 0.2 },
        { x: 180, height: 90, delay: 0.3 },
        { x: 220, height: 110, delay: 0.4 },
        { x: 260, height: 130, delay: 0.5 }
      ].map((bar, i) => (
        <g key={i}>
          <rect 
            x={bar.x - 12} 
            y={175 - (bar.height * progress / 100)} 
            width="24" 
            height={bar.height * progress / 100} 
            rx="4" 
            className={barColors[i]}
            style={{ 
              transition: "all 0.8s ease-out",
              transitionDelay: `${bar.delay}s`
            }}
          />
        </g>
      ))}
      
      {/* Trend line - gradient */}
      <defs>
        <linearGradient id="trendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="50%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
      <path 
        d="M60 135 Q100 120 140 125 Q180 90 220 70 Q250 50 260 45" 
        stroke="url(#trendGradient)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="200"
        strokeDashoffset={200 - (progress * 2)}
        style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
      />
      
      {/* Arrow at end */}
      <g 
        className="transition-all duration-1000" 
        style={{ 
          opacity: progress > 80 ? 1 : 0,
          transform: `translate(${progress > 80 ? 0 : -10}px, 0)`
        }}
      >
        <circle cx="260" cy="45" r="8" className="fill-orange-500" />
        <path d="M256 45 L260 41 L264 45" className="stroke-white stroke-2 fill-none" strokeLinecap="round" />
      </g>
      
      {/* Label */}
      <text x="160" y="195" textAnchor="middle" className="fill-slate-400 text-xs">Career Growth Over Time</text>
    </svg>
  )
}

// Success celebration illustration
export function SuccessIllustration({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Central badge */}
      <circle cx="100" cy="100" r="50" className="fill-violet-100 stroke-violet-400 stroke-3" />
      <circle cx="100" cy="100" r="35" className="fill-violet-500" />
      
      {/* Checkmark */}
      <path 
        d="M80 100 L95 115 L125 85" 
        className="stroke-white stroke-[6] fill-none" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Confetti particles - multi-colored */}
      {[
        { x: 40, y: 50, color: "fill-violet-400" },
        { x: 160, y: 45, color: "fill-orange-400" },
        { x: 30, y: 120, color: "fill-pink-400" },
        { x: 170, y: 130, color: "fill-teal-400" },
        { x: 55, y: 160, color: "fill-amber-400" },
        { x: 145, y: 165, color: "fill-rose-400" },
        { x: 80, y: 30, color: "fill-cyan-400" },
        { x: 120, y: 25, color: "fill-lime-400" }
      ].map((conf, i) => (
        <g 
          key={i} 
          className="animate-bounce" 
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: "1s" }}
        >
          {i % 2 === 0 ? (
            <rect 
              x={conf.x} 
              y={conf.y} 
              width="8" 
              height="8" 
              rx="2"
              className={conf.color}
              transform={`rotate(${i * 20} ${conf.x + 4} ${conf.y + 4})`}
            />
          ) : (
            <circle cx={conf.x} cy={conf.y} r="5" className={conf.color} />
          )}
        </g>
      ))}
      
      {/* Stars - multi-colored */}
      <g className="animate-pulse" style={{ animationDuration: "1.5s" }}>
        <path d="M35 80 L37 75 L39 80 L44 82 L39 84 L37 89 L35 84 L30 82 Z" className="fill-amber-400" />
      </g>
      <g className="animate-pulse" style={{ animationDuration: "1.5s", animationDelay: "0.5s" }}>
        <path d="M165 90 L167 85 L169 90 L174 92 L169 94 L167 99 L165 94 L160 92 Z" className="fill-pink-400" />
      </g>
      <g className="animate-pulse" style={{ animationDuration: "1.8s", animationDelay: "0.3s" }}>
        <path d="M50 140 L52 135 L54 140 L59 142 L54 144 L52 149 L50 144 L45 142 Z" className="fill-teal-400" />
      </g>
      
      {/* Rings */}
      <circle 
        cx="100" cy="100" r="60" 
        className="stroke-pink-200 stroke-2 fill-none animate-ping" 
        style={{ animationDuration: "2s" }}
      />
      <circle 
        cx="100" cy="100" r="70" 
        className="stroke-orange-200 stroke-2 fill-none animate-ping" 
        style={{ animationDuration: "2s", animationDelay: "0.5s" }}
      />
    </svg>
  )
}