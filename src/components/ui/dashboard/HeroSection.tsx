import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { STYLE_PERSONALITIES, defaultPersonality } from "@/lib/dashboard-data";

interface HeroSectionProps {
  name: string;
  isAssessed: boolean;
  thinkingStyle?: string;
}

export default function HeroSection({ name, isAssessed, thinkingStyle }: HeroSectionProps) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const initials = name ? name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "U";

  return (
    <div className="relative z-10 mb-10 px-1 pt-8">
      <div className="flex items-start justify-between gap-8 flex-wrap">
        {/* Left: greeting + name */}
        <div className="flex-1 min-w-[240px]">
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-xs font-medium tracking-wide text-muted-foreground mb-1"
          >
            {greeting}&nbsp;&nbsp;·&nbsp;&nbsp;
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[clamp(2.4rem,5.5vw,3.8rem)] font-bold text-foreground tracking-[-0.04em] leading-[1.02] mb-2"
          >
            Hello,{" "}
            <span className="bg-gradient-to-r from-dash-violet to-dash-pink bg-clip-text text-transparent">
              {name || "there"}.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.16, duration: 0.5 }}
            className="text-[clamp(0.85rem,1.8vw,0.95rem)] text-muted-foreground leading-relaxed max-w-[44ch]"
          >
            {isAssessed
              ? "Your personalised career dashboard is ready. Here's everything about you."
              : "Discover your thinking style and unlock a career path built entirely around you."}
          </motion.p>

          {!isAssessed && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24, duration: 0.4 }}
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="mt-5 px-6 py-3 bg-dash-violet text-primary-foreground rounded-xl font-bold text-sm inline-flex items-center gap-2 shadow-[var(--shadow-glow-violet)] border-0 cursor-pointer font-body"
              >
                <Sparkles size={14} /> Begin Assessment
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* Right: avatar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.18, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-full border border-border shadow-card p-5 flex flex-col items-center gap-3"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-dash-violet to-dash-pink flex items-center justify-center text-2xl font-extrabold text-primary-foreground font-display shadow-[var(--shadow-glow-violet)]">
            {initials}
          </div>
        </motion.div>
      </div>

      {/* Decorative separator */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="h-[1.5px] gradient-rainbow mt-8 rounded-full origin-left"
      />
    </div>
  );
}
