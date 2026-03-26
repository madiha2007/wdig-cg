import { motion } from "framer-motion";

interface ClosingNoteProps {
  thinkingStyle?: string;
  name: string;
}

export default function ClosingNote({ thinkingStyle, name }: ClosingNoteProps) {
  const firstName = name.split(" ")[0] || "";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.9 }}
      className="text-center py-12 px-4"
    >
      <div className="w-9 h-[1.5px] bg-border mx-auto mb-6 rounded-full" />
      <p className="font-display text-[clamp(0.88rem,2vw,1.05rem)] italic text-muted-foreground/40 leading-[2] max-w-[52ch] mx-auto mb-3">
        {thinkingStyle && firstName
          ? `Every ${thinkingStyle} has a path that's entirely their own, ${firstName} — yours is still unfolding. The best version of your career isn't found; it's built.`
          : `Your journey is just beginning. The careers, skills, and opportunities waiting for you are closer than you think.`}
      </p>
      <p className="text-[0.58rem] text-muted-foreground/25 font-bold tracking-[0.2em] uppercase">— WDIG Team</p>
    </motion.div>
  );
}
