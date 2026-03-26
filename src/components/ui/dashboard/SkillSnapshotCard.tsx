import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Brain, ChevronRight } from "lucide-react";
import { tlabel, PALETTE_COLORS } from "../../../lib/dashboard-data";

interface SkillSnapshotCardProps {
  existingSkills: { key: string; score: number }[];
}

export default function SkillSnapshotCard({ existingSkills }: SkillSnapshotCardProps) {
  const top = existingSkills.slice(0, 7);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="bg-card rounded-2xl border border-border shadow-card overflow-hidden"
    >
      <div className="p-5 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[10px] shrink-0 flex items-center justify-center bg-dash-violet-light text-dash-violet">
              <Brain size={15} />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground">Existing Skillset</div>
              <div className="text-[0.6rem] text-muted-foreground mt-0.5">From aptitude assessment</div>
            </div>
          </div>
          <span className="text-[0.65rem] font-bold text-dash-violet flex items-center gap-0.5 cursor-pointer hover:underline">
            Retake <ChevronRight size={10} />
          </span>
        </div>
        <div className="h-px bg-border" />
      </div>

      <div ref={ref} className="px-5 pb-5">
        {top.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🧠</div>
            <p className="text-xs text-muted-foreground mb-4">Take the assessment to reveal your skills</p>
            <button className="px-4 py-2 bg-dash-violet-light text-dash-violet rounded-full text-xs font-bold cursor-pointer border-0 font-body">
              Get Started →
            </button>
          </div>
        ) : (
          <>
            {/* Axis ticks */}
            <div className="flex pl-[110px] mb-1.5">
              {[0, 25, 50, 75, 100].map(v => (
                <div key={v} className="flex-1" style={{ textAlign: v === 0 ? "left" : "right" }}>
                  <span className="text-[0.5rem] text-muted-foreground/40 font-semibold">{v > 0 ? v : ""}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2.5">
              {top.map((s, i) => {
                const pc = PALETTE_COLORS[i % PALETTE_COLORS.length];
                return (
                  <div key={s.key} className="flex items-center gap-2">
                    <span className="text-[0.68rem] font-semibold text-muted-foreground w-[100px] text-right truncate shrink-0">
                      {tlabel(s.key)}
                    </span>
                    <div className="flex-1 h-5 bg-muted rounded-full relative overflow-hidden">
                      {[25, 50, 75].map(pct => (
                        <div key={pct} className="absolute top-0 bottom-0 w-px bg-border" style={{ left: `${pct}%` }} />
                      ))}
                      <motion.div
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${s.score}%` } : {}}
                        transition={{ duration: 1.4, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${pc.hex}cc, ${pc.hex})`,
                          boxShadow: `0 0 8px ${pc.hex}40`,
                        }}
                      />
                    </div>
                    <span className="text-[0.62rem] font-extrabold shrink-0 w-8 text-right" style={{ color: pc.hex }}>
                      {s.score}%
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 text-[0.6rem] text-muted-foreground/60 font-medium">
              ✦ Traits scoring 50%+ on your assessment
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
