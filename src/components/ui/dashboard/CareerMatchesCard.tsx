import { motion } from "framer-motion";
import { Briefcase, ChevronRight, CheckCircle2 } from "lucide-react";
import { PALETTE_COLORS } from "../../../lib/dashboard-data";

interface CareerMatchesCardProps {
  topCareers: string[];
  topMatchCount?: number;
}

export default function CareerMatchesCard({ topCareers, topMatchCount = 3 }: CareerMatchesCardProps) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="bg-card rounded-2xl border border-border shadow-card overflow-hidden"
    >
      <div className="p-5 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[10px] shrink-0 flex items-center justify-center bg-dash-cyan-light text-dash-cyan">
              <Briefcase size={15} />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground">Top Career Matches</div>
              <div className="text-[0.6rem] text-muted-foreground mt-0.5">Personalised for you</div>
            </div>
          </div>
          <span className="text-[0.65rem] font-bold text-dash-cyan flex items-center gap-0.5 cursor-pointer hover:underline">
            Explore all <ChevronRight size={10} />
          </span>
        </div>
        <div className="h-px bg-border" />
      </div>

      <div className="px-5 pb-5">
        {topCareers.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🎯</div>
            <p className="text-xs text-muted-foreground mb-4">Complete assessment to see your matches</p>
            <button className="px-4 py-2 bg-dash-cyan-light text-dash-cyan rounded-full text-xs font-bold cursor-pointer border-0 font-body">
              Get Started →
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {topCareers.slice(0, 7).map((name, i) => {
              const isTop = i < topMatchCount;
              const pc = PALETTE_COLORS[i % PALETTE_COLORS.length];
              return (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={14} style={{ color: pc.hex }} className="shrink-0" />
                    <span className="text-[0.78rem] font-semibold text-foreground group-hover:text-dash-cyan transition-colors">{name}</span>
                  </div>
                  <span
                    className="text-[0.5rem] font-extrabold tracking-wider px-2 py-0.5 rounded-full"
                    style={{
                      color: isTop ? PALETTE_COLORS[1].hex : PALETTE_COLORS[2].hex,
                      background: isTop ? PALETTE_COLORS[1].lightHex : PALETTE_COLORS[2].lightHex,
                    }}
                  >
                    {isTop ? "TOP MATCH" : "GOOD FIT"}
                  </span>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
