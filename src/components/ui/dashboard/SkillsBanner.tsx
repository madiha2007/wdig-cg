import { motion } from "framer-motion";
import { Map } from "lucide-react";
import { PALETTE_COLORS } from "../../../lib/dashboard-data";

interface SkillsBannerProps {
  isAssessed: boolean;
  skills: string[];
}

export default function SkillsBanner({ isAssessed, skills }: SkillsBannerProps) {
  const list = skills.slice(0, 6);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-card rounded-2xl border border-border shadow-card overflow-hidden mb-6 relative"
    >
      {/* Top accent bar */}
      <div className="h-[3px] bg-gradient-to-r from-dash-amber via-[#f59e0b] to-[#fbbf24] shrink-0" />

      {/* Dot grid bg */}
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="p-7 relative">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[0.6rem] font-extrabold tracking-[0.2em] uppercase text-dash-amber">
              <span className="inline-block w-3.5 h-[1.5px] rounded-sm bg-dash-amber" />
              Your Growth Roadmap
            </span>
            <h3 className="font-display text-[clamp(1.15rem,2.8vw,1.6rem)] font-bold text-foreground tracking-tight mt-2 mb-1">
              Skills to Acquire
            </h3>
            <p className="text-[0.7rem] text-muted-foreground leading-relaxed">
              {isAssessed
                ? "Identified from your aptitude gaps — build these to unlock your top career matches"
                : "Complete your assessment to get a personalised skill roadmap"}
            </p>
          </div>
          {isAssessed && (
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-dash-amber-light border border-dash-amber/20 rounded-[10px] cursor-pointer text-[0.7rem] font-bold text-accent-foreground"
            >
              <Map size={12} /> View Full Roadmap
            </motion.div>
          )}
        </div>

        {list.length > 0 ? (
          <>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(155px,1fr))] gap-3">
              {list.map((skill, i) => {
                const pc = PALETTE_COLORS[i % PALETTE_COLORS.length];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + i * 0.07, type: "spring", stiffness: 260, damping: 20 }}
                    whileHover={{ y: -3, scale: 1.02 }}
                    className="flex items-center gap-2.5 bg-card border rounded-xl px-3.5 py-3 shadow-sm relative overflow-hidden cursor-pointer"
                    style={{ borderColor: `${pc.hex}22`, boxShadow: `0 2px 10px ${pc.hex}10` }}
                  >
                    <div
                      className="absolute -top-4 -right-4 w-14 h-14 rounded-full opacity-60 pointer-events-none"
                      style={{ background: pc.lightHex }}
                    />
                    <div
                      className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[0.58rem] font-extrabold text-primary-foreground relative"
                      style={{ background: pc.hex, boxShadow: `0 2px 6px ${pc.hex}40` }}
                    >
                      {i + 1}
                    </div>
                    <span className="text-[0.76rem] font-bold leading-snug relative" style={{ color: pc.hex }}>
                      {skill}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-5 px-3.5 py-2.5 bg-dash-amber-light rounded-[10px] border border-dash-amber/20 flex items-center gap-2">
              <span className="text-base">💡</span>
              <p className="text-[0.62rem] text-accent-foreground font-bold m-0">
                These skills are prioritised by order — start with #1 and work your way down for maximum career impact.
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🗺️</div>
            <p className="text-sm text-muted-foreground mb-4">
              Complete your assessment to unlock a personalised skill roadmap built just for you.
            </p>
            <button className="px-5 py-2.5 bg-dash-amber-light text-accent-foreground border border-dash-amber/20 rounded-[10px] text-xs font-bold cursor-pointer font-body">
              Begin Assessment →
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
