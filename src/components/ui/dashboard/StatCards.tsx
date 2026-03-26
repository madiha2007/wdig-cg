import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Target, Building2, Briefcase, ArrowRight } from "lucide-react";
import { PALETTE_COLORS } from "../../../lib/dashboard-data";

function AnimNum({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / 1600, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, inView]);
  return <span ref={ref}>{val}{suffix}</span>;
}

interface StatCardsProps {
  topCareersCount: number;
}

export default function StatCards({ topCareersCount }: StatCardsProps) {
  const cards = [
    { icon: <Target size={16} />, label: "Career Matches", value: topCareersCount, suffix: "", sub: "Personalised for you", accent: PALETTE_COLORS[0].hex, lightBg: PALETTE_COLORS[0].lightHex },
    { icon: <Building2 size={16} />, label: "Institutes", value: 120, suffix: "+", sub: "Colleges & universities", accent: PALETTE_COLORS[1].hex, lightBg: PALETTE_COLORS[1].lightHex },
    { icon: <Briefcase size={16} />, label: "Careers to Explore", value: 900, suffix: "+", sub: "O*NET verified database", accent: PALETTE_COLORS[2].hex, lightBg: PALETTE_COLORS[2].lightHex },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {cards.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -4, boxShadow: "var(--shadow-card-hover)" }}
          className="bg-card rounded-2xl border border-border shadow-card p-5 cursor-pointer relative overflow-hidden group"
        >
          <div
            className="absolute -top-7 -right-7 w-28 h-28 rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, ${c.lightBg} 0%, transparent 70%)` }}
          />
          <div
            className="w-9 h-9 rounded-[10px] shrink-0 flex items-center justify-center"
            style={{ background: c.lightBg, color: c.accent }}
          >
            {c.icon}
          </div>
          <div className="mt-4">
            <div
              className="text-[clamp(1.8rem,3.5vw,2.4rem)] font-extrabold font-display leading-none tracking-[-0.03em]"
              style={{ color: c.accent }}
            >
              <AnimNum to={c.value} suffix={c.suffix} />
            </div>
            <div className="text-sm font-bold text-foreground mt-1">{c.label}</div>
            <div className="text-[0.65rem] text-muted-foreground mt-0.5 flex items-center gap-1">
              {c.sub} <ArrowRight size={9} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
          <div
            className="absolute bottom-0 left-0 right-0 h-[2.5px] opacity-15"
            style={{ background: c.accent }}
          />
        </motion.div>
      ))}
    </div>
  );
}
