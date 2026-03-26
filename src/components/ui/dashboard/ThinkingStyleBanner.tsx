import { motion } from "framer-motion";
import { STYLE_PERSONALITIES, defaultPersonality } from "../../../lib/dashboard-data";

interface ThinkingStyleBannerProps {
  thinkingStyle?: string;
  thinkingDesc?: string;
  isAssessed: boolean;
}

export default function ThinkingStyleBanner({ thinkingStyle, thinkingDesc, isAssessed }: ThinkingStyleBannerProps) {
  if (!isAssessed || !thinkingStyle) return null;
  const p = STYLE_PERSONALITIES[thinkingStyle] ?? defaultPersonality;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.22, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="mb-6 relative overflow-hidden"
    >
      <div
        className="rounded-2xl p-7 md:p-9 relative overflow-hidden border"
        style={{
          background: `linear-gradient(135deg, ${p.color}18 0%, ${p.color}08 50%, hsl(var(--card)) 100%)`,
          borderColor: `${p.color}28`,
          boxShadow: `0 4px 32px ${p.color}14, 0 1px 3px rgba(0,0,0,0.05)`,
        }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${p.color}12 0%, transparent 70%)` }} />
        <div className="absolute -bottom-10 left-[40%] w-44 h-44 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${p.color}08 0%, transparent 70%)` }} />

        {/* Large icon watermark */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 text-[5rem] opacity-[0.07] select-none pointer-events-none">
          {p.icon}
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{p.icon}</span>
            <div>
              <span
                className="inline-flex items-center gap-1.5 text-[0.6rem] font-extrabold tracking-[0.2em] uppercase"
                style={{ color: p.color }}
              >
                <span className="inline-block w-3.5 h-[1.5px] rounded-sm" style={{ background: p.color }} />
                Your Thinking Style
              </span>
              <h2 className="font-display text-[clamp(1.4rem,3.5vw,2.2rem)] font-bold text-foreground tracking-[-0.03em] leading-tight mt-1">
                {thinkingStyle}
              </h2>
            </div>
          </div>

          {thinkingDesc && (
            <p className="text-[clamp(0.82rem,1.8vw,0.9rem)] text-muted-foreground leading-[1.85] max-w-[60ch] mb-5">
              {thinkingDesc}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            {p.traits.map((trait, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.07, type: "spring", stiffness: 260, damping: 20 }}
                className="flex items-center gap-1.5 bg-card border rounded-full px-3 py-1.5 shadow-sm"
                style={{ borderColor: `${p.color}25` }}
              >
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: p.color }} />
                <span className="text-[0.72rem] font-semibold text-muted-foreground">{trait}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
