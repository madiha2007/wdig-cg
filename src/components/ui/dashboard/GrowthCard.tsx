import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, CheckCircle2 } from "lucide-react";
import { tlabel, PALETTE_COLORS } from "../../../lib/dashboard-data";

interface GrowthCardProps {
  needsGainSkills: string[];
  skillMap: Record<string, number>;
}

export default function GrowthCard({ needsGainSkills, skillMap }: GrowthCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  if (needsGainSkills.length === 0 && Object.keys(skillMap).length > 0) {
    return (
      <div className="bg-card rounded-2xl border border-border shadow-card p-7 text-center">
        <CheckCircle2 size={34} className="text-dash-emerald mx-auto mb-2" />
        <p className="text-sm font-semibold text-muted-foreground">All traits above 50% — excellent!</p>
      </div>
    );
  }

  if (needsGainSkills.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        <div className="p-5 pb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-[10px] shrink-0 flex items-center justify-center bg-dash-amber-light text-dash-amber">
              <TrendingUp size={15} />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground">Growth Areas</div>
              <div className="text-[0.6rem] text-muted-foreground mt-0.5">Traits below 50%</div>
            </div>
          </div>
          <div className="h-px bg-border" />
        </div>
        <div className="px-5 pb-5 text-center">
          <div className="text-4xl mb-2">📈</div>
          <p className="text-xs text-muted-foreground mb-4">Complete assessment to discover growth areas</p>
          <button className="px-4 py-2 bg-dash-amber-light text-accent-foreground rounded-full text-xs font-bold cursor-pointer border-0 font-body">
            Get Started →
          </button>
        </div>
      </div>
    );
  }

  const skills = needsGainSkills.slice(0, 6);
  const R = 52, CX = 70, CY = 70, strokeW = 18;
  const circumference = 2 * Math.PI * R;
  const gapDeg = 4;
  const gapLen = (gapDeg / 360) * circumference;
  const totalSlices = skills.length;
  const sliceLen = (circumference - totalSlices * gapLen) / totalSlices;

  const segs = skills.map((k, i) => ({
    key: k,
    score: skillMap[k] ?? 0,
    color: PALETTE_COLORS[i % PALETTE_COLORS.length].hex,
    lightBg: PALETTE_COLORS[i % PALETTE_COLORS.length].lightHex,
    sliceLen,
    offset: circumference - i * (sliceLen + gapLen),
  }));

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="bg-card rounded-2xl border border-border shadow-card overflow-hidden"
    >
      <div className="p-5 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[10px] shrink-0 flex items-center justify-center bg-dash-amber-light text-dash-amber">
              <TrendingUp size={15} />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground">Growth Areas</div>
              <div className="text-[0.6rem] text-muted-foreground mt-0.5">Traits below 50% · needs attention</div>
            </div>
          </div>
          <span className="text-[0.55rem] font-extrabold tracking-wider text-dash-amber bg-dash-amber-light border border-dash-amber/20 rounded-full px-2.5 py-0.5">
            DEVELOP
          </span>
        </div>
        <div className="h-px bg-border" />
      </div>

      <div ref={ref} className="px-5 pb-5 flex items-center gap-5">
        {/* Donut SVG */}
        <div className="shrink-0">
          <svg width={140} height={140} viewBox="0 0 140 140">
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="hsl(var(--muted))" strokeWidth={strokeW} />
            {segs.map((seg, i) => (
              <circle
                key={seg.key}
                cx={CX} cy={CY} r={R}
                fill="none"
                stroke={seg.color}
                strokeWidth={strokeW - 1}
                strokeLinecap="round"
                strokeDasharray={`${inView ? seg.sliceLen : 0} ${circumference}`}
                strokeDashoffset={seg.offset}
                style={{
                  transition: `stroke-dasharray 2s cubic-bezier(0.16,1,0.3,1) ${i * 160}ms`,
                  transform: "rotate(-90deg)",
                  transformOrigin: `${CX}px ${CY}px`,
                  filter: `drop-shadow(0 0 4px ${seg.color}40)`,
                }}
              />
            ))}
            <text x={CX} y={CY - 7} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="7.5" fontWeight="700" fontFamily="DM Sans,sans-serif" letterSpacing="0.1em">NEEDS</text>
            <text x={CX} y={CY + 6} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="7.5" fontWeight="700" fontFamily="DM Sans,sans-serif" letterSpacing="0.1em">GROWTH</text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 flex-1">
          {segs.map((seg, i) => (
            <motion.div
              key={seg.key}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.45 }}
              className="flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: seg.color }} />
              <span className="text-[0.67rem] font-semibold text-muted-foreground flex-1">{tlabel(seg.key)}</span>
              <span
                className="text-[0.63rem] font-extrabold rounded-md px-1.5 py-px"
                style={{ color: seg.color, background: seg.lightBg }}
              >
                {seg.score}%
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
