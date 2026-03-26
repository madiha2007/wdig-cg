import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { STYLE_PERSONALITIES, defaultPersonality, tlabel } from "../../../lib/dashboard-data";

interface PersonalNoteCardProps {
  name: string;
  thinkingStyle?: string;
  topCareer?: string;
  topSkillKeys?: string[];
}

export default function PersonalNoteCard({ name, thinkingStyle, topCareer, topSkillKeys = [] }: PersonalNoteCardProps) {
  const firstName = name.split(" ")[0] || "there";
  const personality = thinkingStyle ? (STYLE_PERSONALITIES[thinkingStyle] ?? defaultPersonality) : null;
  const topSkills = topSkillKeys.slice(0, 2).map(tlabel).join(" and ");

  let note = "";
  if (thinkingStyle && topCareer) {
    note = `${firstName}, as a ${thinkingStyle}, you naturally ${personality?.traits[0]?.toLowerCase() ?? "think differently from the crowd"}. Your profile points clearly toward a future in ${topCareer}${topSkills ? `, and the strengths you already carry — ${topSkills} — put you ahead of where most people start` : ""}. The path ahead isn't about finding who you are; it's about building on what you already know you're capable of.`;
  } else if (thinkingStyle) {
    note = `${firstName}, you carry the hallmarks of a ${thinkingStyle} — someone who ${personality?.traits[0]?.toLowerCase() ?? "approaches problems uniquely"}. That's not a small thing. The right career doesn't just use your skills; it amplifies them.`;
  } else {
    note = `${firstName}, once you complete your assessment, we'll write a note that speaks directly to your strengths, your thinking style, and the careers that are genuinely built for someone like you. It won't be generic — it'll be yours.`;
  }

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="bg-card rounded-2xl border border-border shadow-card overflow-hidden h-full flex flex-col"
    >
      <div className="h-[3px] bg-gradient-to-r from-dash-violet via-dash-cyan to-dash-emerald shrink-0" />
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            animate={{ rotate: [0, 6, -6, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            className="w-9 h-9 rounded-[10px] bg-dash-emerald-light flex items-center justify-center text-base shrink-0"
          >
            ✉️
          </motion.div>
          <div>
            <span className="inline-flex items-center gap-1.5 text-[0.6rem] font-extrabold tracking-[0.2em] uppercase text-dash-emerald">
              <span className="inline-block w-3.5 h-[1.5px] rounded-sm bg-dash-emerald" />
              Written for you, {firstName}
            </span>
            <div className="text-sm font-bold text-foreground mt-1">A Personal Note</div>
          </div>
        </div>

        <div className="h-px bg-border mb-4" />

        <div className="relative flex-1">
          <div className="absolute -left-0.5 -top-3 text-[3.8rem] leading-none text-dash-emerald/[0.06] font-display select-none pointer-events-none">"</div>
          <p className="text-[clamp(0.82rem,1.8vw,0.9rem)] leading-[1.95] italic font-display text-muted-foreground pl-3 mb-5">
            {note}
          </p>
        </div>

        <div className="h-px bg-border mb-3" />
        <div className="flex items-center justify-between">
          <span className="text-[0.56rem] font-bold text-muted-foreground/40 uppercase tracking-widest">
            Based on your aptitude profile
          </span>
          <span className="text-[0.65rem] font-bold text-dash-emerald flex items-center gap-0.5 cursor-pointer hover:underline">
            Full Report <ChevronRight size={10} />
          </span>
        </div>
      </div>
    </motion.div>
  );
}
