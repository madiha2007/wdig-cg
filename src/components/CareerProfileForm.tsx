"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "../../firebase";

// ── Design tokens — matches your report.js T object exactly ──────────────────
const T = {
  ink: "#0D1B2A", inkMid: "#2C3E50", inkLight: "#5D7A8A",
  teal: "#0A7B6B", tealLight: "#E8F8F5", tealMid: "#14B89A",
  gold: "#C9962B", goldLight: "#FEF9EC",
  rose: "#C0445A", roseLight: "#FDF0F2",
  sky: "#1A6B9A", skyLight: "#EDF5FB",
  purple: "#5B3FA0", purpleLight: "#F3EFFD",
  cream: "#FAFAF8", white: "#FFFFFF",
};

// ── Option data ───────────────────────────────────────────────────────────────
const STAGES = [
  { value: "school_9_10",   label: "School",       sub: "Class 9–10",     icon: "🏫" },
  { value: "school_11_12",  label: "School",       sub: "Class 11–12",    icon: "🏫" },
  { value: "ug",            label: "Undergraduate",sub: "Student",        icon: "🎓" },
  { value: "pg",            label: "Postgraduate", sub: "Student",        icon: "🎓" },
  { value: "professional",  label: "Working",      sub: "Professional",   icon: "💼" },
  { value: "career_changer",label: "Career",       sub: "Changer / Gap",  icon: "🔄" },
];

const FIELDS = [
  { value: "science_pcm", label: "Science PCM" },
  { value: "science_pcb", label: "Science PCB" },
  { value: "commerce",    label: "Commerce" },
  { value: "arts",        label: "Arts & Humanities" },
  { value: "engineering", label: "Engineering" },
  { value: "medical",     label: "Medical" },
  { value: "law",         label: "Law" },
  { value: "design",      label: "Design" },
  { value: "business",    label: "Business" },
  { value: "technology",  label: "Technology" },
  { value: "other",       label: "Other" },
];

const FINANCE = [
  { value: "need_income_soon", label: "Need income soon",       icon: "⚡" },
  { value: "some_runway",      label: "Have some runway",       icon: "🛤️" },
  { value: "full_support",     label: "Full family support",    icon: "🌿" },
];

const PRESSURE = [
  { value: "high",     label: "Very high",   sub: "Specific career expected" },
  { value: "moderate", label: "Moderate",    sub: "Some say in the matter"   },
  { value: "free",     label: "Full freedom",sub: "My choice entirely"       },
];

const HORIZON = [
  { value: "1_2_years", label: "1–2 years", icon: "⚡" },
  { value: "3_5_years", label: "3–5 years", icon: "📈" },
  { value: "6_8_years", label: "6–8 years", icon: "🏔️" },
];

const SKILLS = [
  { value: "coding",         label: "Coding",           cat: "Technical" },
  { value: "data_analysis",  label: "Data / Excel",     cat: "Technical" },
  { value: "design",         label: "Graphic Design",   cat: "Technical" },
  { value: "video_editing",  label: "Video Editing",    cat: "Technical" },
  { value: "writing",        label: "Writing",          cat: "Technical" },
  { value: "mathematics",    label: "Mathematics",      cat: "Technical" },
  { value: "science_lab",    label: "Science / Lab",    cat: "Technical" },
  { value: "public_speaking",label: "Public Speaking",  cat: "Technical" },
  { value: "music",          label: "Music",            cat: "Creative"  },
  { value: "art_drawing",    label: "Art / Drawing",    cat: "Creative"  },
  { value: "photography",    label: "Photography",      cat: "Creative"  },
  { value: "acting",         label: "Acting",           cat: "Creative"  },
  { value: "teaching",       label: "Teaching",         cat: "People"    },
  { value: "organizing",     label: "Organizing Events",cat: "People"    },
  { value: "sports",         label: "Sports",           cat: "People"    },
  { value: "volunteering",   label: "Volunteering",     cat: "People"    },
  { value: "selling",        label: "Selling",          cat: "People"    },
];

const FREE_TIME = [
  { value: "make_things",    label: "Making things"         },
  { value: "research",       label: "Deep research"         },
  { value: "help_people",    label: "Helping people"        },
  { value: "competing",      label: "Competing"             },
  { value: "build_community",label: "Building communities"  },
  { value: "follow_startups",label: "Following startups"    },
  { value: "tinkering",      label: "Tinkering / building"  },
  { value: "nothing_yet",    label: "Nothing specific yet"  },
];

const ACHIEVEMENTS = [
  { value: "built_project",  label: "Built a project"      },
  { value: "won_competition",label: "Won a competition"    },
  { value: "led_team",       label: "Led a team / club"    },
  { value: "freelanced",     label: "Freelanced / earned"  },
  { value: "volunteered",    label: "Volunteered"          },
  { value: "published",      label: "Published / performed"},
];

const SUCCESS = [
  { value: "financial_freedom",   label: "Financial freedom",    icon: "💰" },
  { value: "real_impact",         label: "Real impact",          icon: "🌍" },
  { value: "being_best",          label: "Being the best",       icon: "🏆" },
  { value: "balance",             label: "Balance & peace",      icon: "🕊️" },
  { value: "solving_problems",    label: "Solving hard problems", icon: "🔬" },
  { value: "creative_expression", label: "Creative expression",  icon: "🎨" },
];

const VISION = [
  { value: "own_business",   label: "Own business",         icon: "🚀" },
  { value: "top_company",    label: "Top company leader",   icon: "🏢" },
  { value: "research",       label: "Research / academia",  icon: "🔭" },
  { value: "freelance",      label: "Independent / freelance", icon: "🌐" },
  { value: "public_service", label: "Public service",       icon: "🤝" },
  { value: "figuring_out",   label: "Still figuring it out",icon: "🧭" },
];

// ── Tiny sub-components ───────────────────────────────────────────────────────
function BlockHeader({ number, title, accent = T.teal }: { number: string; title: string; accent?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "1.25rem" }}>
      <div style={{
        width: 32, height: 32, borderRadius: 10,
        background: `${accent}18`, border: `1.5px solid ${accent}30`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "0.72rem", fontWeight: 800, color: accent, flexShrink: 0,
        fontFamily: "Georgia, serif",
      }}>{number}</div>
      <h3 style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: "1.05rem", fontWeight: 700, color: T.ink, margin: 0,
      }}>{title}</h3>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${accent}30, transparent)` }} />
    </div>
  );
}

function RadioCard({
  selected, onClick, icon, label, sub, accent = T.teal,
}: { selected: boolean; onClick: () => void; icon?: string; label: string; sub?: string; accent?: string }) {
  return (
    <button onClick={onClick} style={{
      background: selected ? `${accent}12` : T.white,
      border: `1.5px solid ${selected ? accent : "#e2e8f0"}`,
      borderRadius: 14, padding: "0.75rem 1rem",
      cursor: "pointer", textAlign: "left", transition: "all .2s ease",
      transform: selected ? "translateY(-1px)" : "none",
      boxShadow: selected ? `0 4px 16px ${accent}20` : "none",
    }}>
      {icon && <div style={{ fontSize: "1.25rem", marginBottom: "0.3rem" }}>{icon}</div>}
      <div style={{ fontSize: "0.82rem", fontWeight: 700, color: selected ? accent : T.inkMid }}>{label}</div>
      {sub && <div style={{ fontSize: "0.7rem", color: T.inkLight, marginTop: 2 }}>{sub}</div>}
    </button>
  );
}

function Chip({
  selected, onClick, label, accent = T.teal,
}: { selected: boolean; onClick: () => void; label: string; accent?: string }) {
  return (
    <button onClick={onClick} style={{
      background: selected ? `${accent}15` : T.white,
      border: `1.5px solid ${selected ? accent : "#e2e8f0"}`,
      borderRadius: 999, padding: "0.35rem 0.85rem",
      cursor: "pointer", fontSize: "0.78rem", fontWeight: selected ? 700 : 500,
      color: selected ? accent : T.inkMid, transition: "all .18s ease",
      transform: selected ? "scale(1.03)" : "none",
    }}>{label}</button>
  );
}

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: "2rem" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: i === current ? 22 : 7, height: 7,
          borderRadius: 999, transition: "all .3s ease",
          background: i < current ? T.tealMid : i === current ? T.teal : "#e2e8f0",
        }} />
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function CareerProfileForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromTest = searchParams.get("from") === "aptitude";

  const [uid, setUid] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Form state
  const [stage, setStage] = useState("");
  const [field, setField] = useState("");
  const [finance, setFinance] = useState("");
  const [pressure, setPressure] = useState("");
  const [horizon, setHorizon] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [freeTime, setFreeTime] = useState<string[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [success, setSuccess] = useState("");
  const [vision, setVision] = useState("");
  const [dream, setDream] = useState("");
  const [blocker, setBlocker] = useState("");

  // Use Firebase Auth — matches your existing app's auth pattern
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/login");
        return;
      }
      setUid(user.uid);

      // Load existing profile if any
      fetch(`http://localhost:5000/api/profile/${user.uid}`)
        .then(r => r.json())
        .then(({ profile }) => {
          if (profile) {
            setStage(profile.current_stage || "");
            setField(profile.field || "");
            setFinance(profile.financial_situation || "");
            setPressure(profile.family_pressure || "");
            setHorizon(profile.time_horizon || "");
            setSkills(profile.skills || []);
            setFreeTime(profile.free_time_activities || []);
            setAchievements(profile.past_achievements || []);
            setSuccess(profile.success_definition || "");
            setVision(profile.ten_year_vision || "");
            setDream(profile.secret_dream || "");
            setBlocker(profile.biggest_blocker || "");
          }
        })
        .catch(() => {})
        .finally(() => setLoadingProfile(false));
    });

    return () => unsubscribe();
  }, [router]);

  const toggle = (arr: string[], val: string, setArr: (a: string[]) => void) => {
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  };

  const filledBlocks = [stage, field, finance, pressure, horizon,
    skills.length > 0, freeTime.length > 0, success, vision].filter(Boolean).length;
  const totalBlocks = 9;
  const progress = Math.round((filledBlocks / totalBlocks) * 100);

  const handleSave = async () => {
    if (!uid) return;
    setSaving(true);
    try {
      const res = await fetch("http://localhost:5000/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: uid,
          current_stage: stage,
          field,
          financial_situation: finance,
          family_pressure: pressure,
          time_horizon: horizon,
          skills,
          free_time_activities: freeTime,
          past_achievements: achievements,
          success_definition: success,
          ten_year_vision: vision,
          secret_dream: dream,
          biggest_blocker: blocker,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaved(true);
      // If user came from test page, redirect back automatically after 1.2s
      if (fromTest) {
        setTimeout(() => router.push("/aptitude"), 1200);
      } else {
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (e) {
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loadingProfile) return (
    <div style={{
      minHeight: "100vh", background: `linear-gradient(135deg, ${T.ink}, #0D2E3A)`,
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", gap: 16,
    }}>
      <style>{`@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
      <div style={{ fontSize: "2.5rem", animation: "bob 1.8s ease infinite" }}>✦</div>
      <p style={{ color: "rgba(255,255,255,0.5)", fontFamily: "system-ui", fontSize: "0.85rem" }}>Loading your profile…</p>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${T.cream}; }
        textarea:focus, input:focus { outline: 2px solid ${T.teal}; outline-offset: 2px; }
        textarea, input { font-family: 'Plus Jakarta Sans', system-ui; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:none; } }
        @keyframes bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>

      <div style={{
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        background: T.cream, minHeight: "100vh", color: T.ink,
      }}>

        {/* ── Hero header ── */}
        <div style={{
          background: `linear-gradient(160deg, ${T.ink} 0%, #0D2E3A 60%, #1A3A4A 100%)`,
          padding: "2.5rem 2rem 3rem", position: "relative", overflow: "hidden",
        }}>
          {/* Background blobs */}
          {[["-60px","auto","-60px","auto",300,T.teal,0.08],["-40px","auto","auto","-40px",200,T.gold,0.07]].map(
            ([t,b,r,l,sz,col,op]: any[], i) => (
              <div key={i} style={{
                position:"absolute",top:t,bottom:b,right:r,left:l,
                width:sz,height:sz,borderRadius:"50%",
                background:`radial-gradient(circle,${col}${Math.round(op*255).toString(16).padStart(2,"0")},transparent 65%)`,
                pointerEvents:"none",
              }}/>
            )
          )}

          <div style={{ maxWidth: 680, margin: "0 auto", position: "relative" }}>
            <button onClick={() => router.back()} style={{
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)",
              color: "rgba(255,255,255,0.6)", padding: "0.4rem 0.9rem",
              borderRadius: 10, cursor: "pointer", fontSize: "0.78rem",
              fontFamily: "system-ui", marginBottom: "1.5rem", display: "inline-block",
            }}>← Back</button>

            <div style={{
              fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.28em",
              textTransform: "uppercase", color: T.tealMid, marginBottom: "0.6rem",
            }}>Your Profile</div>

            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              fontWeight: 800, color: T.white, lineHeight: 1.1, marginBottom: "0.75rem",
            }}>Tell us who you are</h1>

            <p style={{
              color: "rgba(255,255,255,0.55)", fontSize: "0.88rem",
              lineHeight: 1.7, maxWidth: 480,
            }}>
              This helps us personalise your career report. Takes 2–3 minutes.
              Your answers are private and only used to improve your recommendations.
            </p>

            {/* Progress bar */}
            <div style={{ marginTop: "1.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Profile completion</span>
                <span style={{ fontSize: "0.72rem", color: T.tealMid, fontWeight: 700 }}>{progress}%</span>
              </div>
              <div style={{ height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 999, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${progress}%`, borderRadius: 999,
                  background: `linear-gradient(90deg, ${T.tealMid}, ${T.gold})`,
                  transition: "width .5s cubic-bezier(.16,1,.3,1)",
                }} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Form body ── */}
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "2.5rem 1.5rem 6rem" }}>

          {/* BLOCK 1 — Stage */}
          <div style={{
            background: T.white, borderRadius: 24, border: `1px solid ${T.teal}18`,
            padding: "1.75rem", marginBottom: "1.25rem",
            boxShadow: `0 4px 24px ${T.teal}08`,
            animation: "fadeUp .5s ease both",
          }}>
            <BlockHeader number="01" title="I am currently a…" accent={T.teal} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.6rem" }}>
              {STAGES.map(s => (
                <RadioCard key={s.value} selected={stage === s.value}
                  onClick={() => setStage(s.value)}
                  icon={s.icon} label={s.label} sub={s.sub} accent={T.teal} />
              ))}
            </div>
          </div>

          {/* BLOCK 1b — Field */}
          <div style={{
            background: T.white, borderRadius: 24, border: `1px solid ${T.teal}18`,
            padding: "1.75rem", marginBottom: "1.25rem",
            boxShadow: `0 4px 24px ${T.teal}08`,
            animation: "fadeUp .5s ease .05s both",
          }}>
            <BlockHeader number="02" title="My field is…" accent={T.teal} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {FIELDS.map(f => (
                <Chip key={f.value} selected={field === f.value}
                  onClick={() => setField(f.value)} label={f.label} accent={T.teal} />
              ))}
            </div>
          </div>

          {/* BLOCK 2 — Context */}
          <div style={{
            background: T.white, borderRadius: 24, border: `1px solid ${T.sky}18`,
            padding: "1.75rem", marginBottom: "1.25rem",
            boxShadow: `0 4px 24px ${T.sky}08`,
            animation: "fadeUp .5s ease .1s both",
          }}>
            <BlockHeader number="03" title="Your situation" accent={T.sky} />

            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: T.inkLight, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.6rem" }}>Financial situation</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.5rem", marginBottom: "1.25rem" }}>
              {FINANCE.map(f => (
                <RadioCard key={f.value} selected={finance === f.value}
                  onClick={() => setFinance(f.value)}
                  icon={f.icon} label={f.label} accent={T.sky} />
              ))}
            </div>

            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: T.inkLight, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.6rem" }}>Family pressure on career</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.5rem", marginBottom: "1.25rem" }}>
              {PRESSURE.map(p => (
                <RadioCard key={p.value} selected={pressure === p.value}
                  onClick={() => setPressure(p.value)}
                  label={p.label} sub={p.sub} accent={T.sky} />
              ))}
            </div>

            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: T.inkLight, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.6rem" }}>How long can you invest?</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.5rem" }}>
              {HORIZON.map(h => (
                <RadioCard key={h.value} selected={horizon === h.value}
                  onClick={() => setHorizon(h.value)}
                  icon={h.icon} label={h.label} accent={T.sky} />
              ))}
            </div>
          </div>

          {/* BLOCK 3 — Skills */}
          <div style={{
            background: T.white, borderRadius: 24, border: `1px solid ${T.purple}18`,
            padding: "1.75rem", marginBottom: "1.25rem",
            boxShadow: `0 4px 24px ${T.purple}08`,
            animation: "fadeUp .5s ease .15s both",
          }}>
            <BlockHeader number="04" title="What can you already do?" accent={T.purple} />
            {["Technical", "Creative", "People"].map(cat => (
              <div key={cat} style={{ marginBottom: "1rem" }}>
                <p style={{ fontSize: "0.7rem", fontWeight: 700, color: T.purple, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.5rem" }}>{cat}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                  {SKILLS.filter(s => s.cat === cat).map(s => (
                    <Chip key={s.value} selected={skills.includes(s.value)}
                      onClick={() => toggle(skills, s.value, setSkills)}
                      label={s.label} accent={T.purple} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* BLOCK 4 — Reality */}
          <div style={{
            background: T.white, borderRadius: 24, border: `1px solid ${T.gold}18`,
            padding: "1.75rem", marginBottom: "1.25rem",
            boxShadow: `0 4px 24px ${T.gold}08`,
            animation: "fadeUp .5s ease .2s both",
          }}>
            <BlockHeader number="05" title="Your reality" accent={T.gold} />

            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: T.inkLight, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.6rem" }}>What do you do in your free time?</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginBottom: "1.25rem" }}>
              {FREE_TIME.map(f => (
                <Chip key={f.value} selected={freeTime.includes(f.value)}
                  onClick={() => toggle(freeTime, f.value, setFreeTime)}
                  label={f.label} accent={T.gold} />
              ))}
            </div>

            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: T.inkLight, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.6rem" }}>What have you actually done?</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
              {ACHIEVEMENTS.map(a => (
                <Chip key={a.value} selected={achievements.includes(a.value)}
                  onClick={() => toggle(achievements, a.value, setAchievements)}
                  label={a.label} accent={T.gold} />
              ))}
            </div>
          </div>

          {/* BLOCK 5 — Vision */}
          <div style={{
            background: T.white, borderRadius: 24, border: `1px solid ${T.rose}18`,
            padding: "1.75rem", marginBottom: "1.25rem",
            boxShadow: `0 4px 24px ${T.rose}08`,
            animation: "fadeUp .5s ease .25s both",
          }}>
            <BlockHeader number="06" title="Your vision" accent={T.rose} />

            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: T.inkLight, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.6rem" }}>Success means…</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.5rem", marginBottom: "1.25rem" }}>
              {SUCCESS.map(s => (
                <RadioCard key={s.value} selected={success === s.value}
                  onClick={() => setSuccess(s.value)}
                  icon={s.icon} label={s.label} accent={T.rose} />
              ))}
            </div>

            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: T.inkLight, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.6rem" }}>In 10 years I see myself…</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.5rem" }}>
              {VISION.map(v => (
                <RadioCard key={v.value} selected={vision === v.value}
                  onClick={() => setVision(v.value)}
                  icon={v.icon} label={v.label} accent={T.rose} />
              ))}
            </div>
          </div>

          {/* BLOCK 6 — Secret (most valuable for AI) */}
          <div style={{
            background: `linear-gradient(160deg, ${T.ink}, #0D2E3A)`,
            borderRadius: 24, padding: "1.75rem", marginBottom: "2rem",
            position: "relative", overflow: "hidden",
            animation: "fadeUp .5s ease .3s both",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: `radial-gradient(circle at 20% 50%, ${T.teal}12, transparent 50%), radial-gradient(circle at 80% 20%, ${T.gold}0f, transparent 45%)`,
              pointerEvents: "none",
            }} />
            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "1.25rem" }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: `${T.tealMid}20`, border: `1.5px solid ${T.tealMid}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.72rem", fontWeight: 800, color: T.tealMid,
                  fontFamily: "Georgia, serif",
                }}>07</div>
                <h3 style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "1.05rem", fontWeight: 700, color: T.white, margin: 0,
                }}>The honest part</h3>
                <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${T.tealMid}30, transparent)` }} />
              </div>

              <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", marginBottom: "0.6rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Something you've always wanted to do but never said out loud
              </p>
              <textarea value={dream} onChange={e => setDream(e.target.value)}
                placeholder="e.g. write a book, build a startup, travel and work, become a filmmaker…"
                rows={3} style={{
                  width: "100%", background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12,
                  padding: "0.85rem 1rem", color: T.white, fontSize: "0.88rem",
                  lineHeight: 1.6, resize: "vertical", marginBottom: "1.25rem",
                }}
              />

              <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", marginBottom: "0.6rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                What's stopping you from pursuing it?
              </p>
              <textarea value={blocker} onChange={e => setBlocker(e.target.value)}
                placeholder="e.g. parents expect something else, don't know where to start, financial pressure…"
                rows={3} style={{
                  width: "100%", background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12,
                  padding: "0.85rem 1rem", color: T.white, fontSize: "0.88rem",
                  lineHeight: 1.6, resize: "vertical",
                }}
              />
            </div>
          </div>

          {/* ── Save button ── */}
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", justifyContent: "center" }}>
            <button onClick={handleSave} disabled={saving} style={{
              background: saved
                ? `linear-gradient(135deg, #16a34a, #15803d)`
                : `linear-gradient(135deg, ${T.teal}, ${T.tealMid})`,
              border: "none", color: T.white,
              padding: "1rem 2.5rem", borderRadius: 14,
              cursor: saving ? "not-allowed" : "pointer",
              fontWeight: 700, fontSize: "0.95rem",
              fontFamily: "'Plus Jakarta Sans', system-ui",
              opacity: saving ? 0.7 : 1,
              transition: "all .3s ease",
              boxShadow: `0 8px 24px ${T.teal}40`,
              display: "flex", alignItems: "center", gap: "0.5rem",
            }}>
              {saving
                ? <><span style={{ animation: "pulse 1s ease infinite" }}>●</span> Saving…</>
                : saved
                  ? fromTest ? "✓ Saved! Taking you to the test…" : "✓ Profile Saved!"
                  : fromTest ? "Save & Start the Test →" : "Save Profile"}
            </button>

            {saved && (
              <button onClick={() => router.push("/test")} style={{
                background: T.gold, border: "none", color: T.ink,
                padding: "1rem 2rem", borderRadius: 14,
                cursor: "pointer", fontWeight: 700, fontSize: "0.9rem",
                fontFamily: "'Plus Jakarta Sans', system-ui",
                boxShadow: `0 8px 24px ${T.gold}40`,
                animation: "fadeUp .3s ease",
              }}>
                Take the Test →
              </button>
            )}
          </div>

          <p style={{
            textAlign: "center", color: T.inkLight,
            fontSize: "0.72rem", marginTop: "1rem", lineHeight: 1.6,
          }}>
            You can update this anytime from your profile page.<br />
            Saving re-generates your next report with richer insights.
          </p>
        </div>
      </div>
    </>
  );
}
