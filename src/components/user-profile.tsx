"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  User, Mail, Phone, GraduationCap, MapPin, Edit3, Award,
  Clock, Bell, Moon, LogOut, Sparkles, Brain, CheckCircle2,
  Settings, Download, Share2, Calendar, Briefcase, Target,
  X, Camera, Save, Loader2, Plus, Music,
} from "lucide-react";
import { auth, db } from "../../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

/* ─── Types ───────────────────────────────────────────────────────────────── */
interface UserData {
  name: string; email: string; phone: string; education: string;
  location: string; bio: string; photoURL: string | null;
  role: "Student"|"Working"|"Freelancer"|"Job Seeker"|"Other";
  createdAt: string; interests: string[]; hobbies: string[];
}
interface AssessmentResult {
  thinking_style?: { primary?: { label: string; description: string }; secondary?: { label: string } };
  top_careers?: { name: string; emerging?: boolean }[];
  moderate_careers?: { name: string }[];
  dominant_traits?: { trait: string; score: number }[];
  dimension_scores?: Record<string, number>;
  normalizedTraits?: Record<string, number>;
}
interface ActivityItem { id: string; type: string; title: string; date: any; icon: string; }

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const LABELS: Record<string,string> = {
  logical:"Logical Reasoning",analytical:"Analytical Thinking",numerical:"Numerical Ability",
  verbal:"Verbal Ability",spatial:"Spatial Reasoning",creativity:"Creativity",
  discipline:"Discipline",resilience:"Resilience",independence:"Independence",
  adaptability:"Adaptability",growth_mindset:"Growth Mindset",risk_appetite:"Risk Appetite",
  depth_focus:"Depth of Focus",confidence:"Confidence",stress_tolerance:"Stress Tolerance",
  accountability:"Accountability",initiative:"Initiative",problem_solving:"Problem Solving",
  intrinsic_motivation:"Intrinsic Motivation",purpose_drive:"Purpose Drive",
  passion_signal:"Passion Signal",learning_orientation:"Learning Orientation",
  communication:"Communication",leadership:"Leadership",teamwork:"Teamwork",
  empathy:"Empathy",emotional_intelligence:"Emotional Intelligence",
  helping_orientation:"Helping Orientation",
};
const label = (k: string) => LABELS[k] ?? k.replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase());
const initials = (n: string) => n.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);
const relTime = (ts: any) => {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  const m = Math.floor((Date.now()-d.getTime())/60000);
  if (m<60) return `${m}m ago`;
  if (m<1440) return `${Math.floor(m/60)}h ago`;
  if (m<10080) return `${Math.floor(m/1440)}d ago`;
  return d.toLocaleDateString("en-IN",{day:"numeric",month:"short"});
};

/* ─── Skill Bar ───────────────────────────────────────────────────────────── */
function SkillBar({ name, score, i }: { name: string; score: number; i: number }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(()=>setW(score), 400+i*60); return ()=>clearTimeout(t); },[score,i]);
  const color = score>=70 ? "#2563eb" : score>=50 ? "#7c3aed" : "#94a3b8";
  return (
    <div style={{marginBottom:"1.1rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:"0.3rem",alignItems:"center"}}>
        <span style={{fontSize:"0.78rem",fontWeight:600,color:"#334155",letterSpacing:"0.01em"}}>{name}</span>
        <span style={{fontSize:"0.72rem",fontWeight:700,color,fontVariantNumeric:"tabular-nums"}}>{score}%</span>
      </div>
      <div style={{height:5,background:"#e2e8f0",borderRadius:99,overflow:"hidden",position:"relative"}}>
        <motion.div
          initial={{width:0}} animate={{width:`${w}%`}}
          transition={{duration:0.9,ease:[0.16,1,0.3,1],delay:i*0.05}}
          style={{position:"absolute",top:0,left:0,height:"100%",borderRadius:99,
            background:`linear-gradient(90deg,${color},${score>=70?"#7c3aed":score>=50?"#2563eb":"#cbd5e1"})`}} />
      </div>
    </div>
  );
}

/* ─── Toggle ──────────────────────────────────────────────────────────────── */
function Toggle({ on, onToggle }: { on:boolean; onToggle:()=>void }) {
  return (
    <motion.button onClick={onToggle} style={{position:"relative",width:44,height:24,borderRadius:99,border:"none",
      background:on?"#2563eb":"#cbd5e1",cursor:"pointer",flexShrink:0,padding:0}}>
      <motion.div animate={{x:on?22:2}} transition={{type:"spring",stiffness:600,damping:35}}
        style={{position:"absolute",top:2,width:20,height:20,borderRadius:"50%",background:"#fff",
          boxShadow:"0 1px 4px rgba(0,0,0,0.15)"}} />
    </motion.button>
  );
}

/* ─── Tag Input ───────────────────────────────────────────────────────────── */
function TagInput({ label:lbl, icon, tags, onUpdate, placeholder, color="#2563eb" }: {
  label:string; icon:React.ReactNode; tags:string[];
  onUpdate:(t:string[])=>void; placeholder:string; color?:string;
}) {
  const [val, setVal] = useState("");
  const add = () => { const v=val.trim(); if(v&&!tags.includes(v)) onUpdate([...tags,v]); setVal(""); };
  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"1rem"}}>
        <span style={{color}}>{icon}</span>
        <h3 style={{fontSize:"0.95rem",fontWeight:700,color:"#0f172a",margin:0,letterSpacing:"-0.01em"}}>{lbl}</h3>
      </div>
      <div style={{display:"flex",gap:"0.5rem",marginBottom:"0.9rem"}}>
        <input value={val} onChange={e=>setVal(e.target.value)} placeholder={placeholder}
          onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();add();}}}
          style={{flex:1,padding:"0.6rem 0.9rem",borderRadius:10,border:"1.5px solid #e2e8f0",
            background:"#f8fafc",fontSize:"0.82rem",color:"#0f172a",outline:"none",fontFamily:"inherit",
            transition:"border-color 0.2s"}}
          onFocus={e=>e.target.style.borderColor=color} onBlur={e=>e.target.style.borderColor="#e2e8f0"} />
        <motion.button whileTap={{scale:0.93}} onClick={add} type="button"
          style={{padding:"0.6rem 1rem",borderRadius:10,border:"none",background:color,
            color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",gap:4,
            fontSize:"0.78rem",fontWeight:700,fontFamily:"inherit",letterSpacing:"0.02em"}}>
          <Plus size={13}/> Add
        </motion.button>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem"}}>
        <AnimatePresence>
          {tags.map(t=>(
            <motion.span key={t} initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0,opacity:0}}
              style={{display:"inline-flex",alignItems:"center",gap:4,padding:"0.28rem 0.7rem",
                borderRadius:99,background:`${color}12`,border:`1.5px solid ${color}25`,
                fontSize:"0.76rem",fontWeight:600,color:"#1e293b"}}>
              {t}
              <button onClick={()=>onUpdate(tags.filter(x=>x!==t))}
                style={{background:"none",border:"none",cursor:"pointer",padding:0,display:"flex",color:"#94a3b8",lineHeight:1}}>
                <X size={10}/>
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
        {tags.length===0 && <span style={{fontSize:"0.74rem",color:"#94a3b8",fontStyle:"italic"}}>No {lbl.toLowerCase()} added yet</span>}
      </div>
    </div>
  );
}

/* ─── Edit Field ──────────────────────────────────────────────────────────── */
function EditField({lbl,icon,value,onChange,placeholder,type="text"}: {
  lbl:string;icon:React.ReactNode;value:string;onChange:(v:string)=>void;placeholder:string;type?:string;
}) {
  const [focus,setFocus] = useState(false);
  return (
    <div>
      <label style={{display:"flex",alignItems:"center",gap:5,fontSize:"0.68rem",fontWeight:700,
        color:"#64748b",marginBottom:"0.35rem",textTransform:"uppercase",letterSpacing:"0.08em"}}>
        {icon} {lbl}
      </label>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}
        style={{width:"100%",padding:"0.65rem 0.9rem",borderRadius:10,
          border:`1.5px solid ${focus?"#2563eb":"#e2e8f0"}`,background:"#f8fafc",
          fontSize:"0.85rem",color:"#0f172a",outline:"none",fontFamily:"inherit",
          boxSizing:"border-box",transition:"border-color 0.18s"}} />
    </div>
  );
}

/* ─── Edit Modal ──────────────────────────────────────────────────────────── */
function EditModal({open,onClose,userData,onSave}: {
  open:boolean;onClose:()=>void;userData:UserData;onSave:(d:Partial<UserData>)=>Promise<void>;
}) {
  const [form,setForm] = useState(userData);
  const [saving,setSaving] = useState(false);
  const [preview,setPreview] = useState<string|null>(userData.photoURL);
  useEffect(()=>{setForm(userData);setPreview(userData.photoURL);},[userData]);
  const handleImg = (e:React.ChangeEvent<HTMLInputElement>) => {
    const f=e.target.files?.[0]; if(!f) return;
    const r=new FileReader(); r.onloadend=()=>setPreview(r.result as string); r.readAsDataURL(f);
  };
  const submit = async(e:React.FormEvent)=>{
    e.preventDefault(); setSaving(true);
    await onSave({...form,photoURL:preview});
    setSaving(false); onClose();
  };
  return (
    <AnimatePresence>
      {open&&(
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
          style={{position:"fixed",inset:0,zIndex:50,display:"flex",alignItems:"center",
            justifyContent:"center",padding:"1rem",background:"rgba(2,6,23,0.6)",
            backdropFilter:"blur(8px)",overflowY:"auto"}}
          onClick={onClose}>
          <motion.div initial={{scale:0.94,y:20,opacity:0}} animate={{scale:1,y:0,opacity:1}}
            exit={{scale:0.94,y:20,opacity:0}} transition={{type:"spring",damping:28,stiffness:340}}
            onClick={e=>e.stopPropagation()}
            style={{background:"#fff",borderRadius:24,maxWidth:580,width:"100%",
              boxShadow:"0 32px 80px rgba(0,0,0,0.18)",overflow:"hidden",margin:"2rem 0"}}>

            {/* top bar */}
            <div style={{height:4,background:"linear-gradient(90deg,#2563eb,#7c3aed)"}}/>
            <div style={{padding:"1.5rem 1.75rem 1.25rem",borderBottom:"1px solid #f1f5f9"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div>
                  <h2 style={{fontSize:"1.2rem",fontWeight:800,color:"#0f172a",margin:0,letterSpacing:"-0.02em"}}>Edit Profile</h2>
                  <p style={{fontSize:"0.75rem",color:"#94a3b8",marginTop:"0.15rem"}}>Keep your information up to date</p>
                </div>
                <button onClick={onClose} style={{width:30,height:30,borderRadius:"50%",border:"1px solid #e2e8f0",
                  background:"#f8fafc",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#64748b"}}>
                  <X size={14}/>
                </button>
              </div>
            </div>

            <form onSubmit={submit} style={{padding:"1.5rem 1.75rem"}}>
              {/* avatar */}
              <div style={{display:"flex",justifyContent:"center",marginBottom:"1.5rem"}}>
                <div style={{position:"relative"}}>
                  <div style={{width:80,height:80,borderRadius:"50%",padding:3,background:"linear-gradient(135deg,#2563eb,#7c3aed)"}}>
                    <div style={{width:"100%",height:"100%",borderRadius:"50%",overflow:"hidden",
                      background:"#eff6ff",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      {preview?<img src={preview} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                        :<User size={28} color="#2563eb"/>}
                    </div>
                  </div>
                  <label htmlFor="modal-avatar" style={{position:"absolute",bottom:0,right:0,width:26,height:26,
                    borderRadius:"50%",background:"#2563eb",display:"flex",alignItems:"center",
                    justifyContent:"center",cursor:"pointer",border:"2px solid #fff"}}>
                    <Camera size={11} color="#fff"/>
                    <input id="modal-avatar" type="file" accept="image/*" onChange={handleImg} style={{display:"none"}}/>
                  </label>
                </div>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.85rem 1rem"}}>
                <EditField lbl="Full Name" icon={<User size={11}/>} value={form.name} onChange={v=>setForm(p=>({...p,name:v}))} placeholder="Your name"/>
                <div>
                  <label style={{display:"flex",alignItems:"center",gap:5,fontSize:"0.68rem",fontWeight:700,
                    color:"#94a3b8",marginBottom:"0.35rem",textTransform:"uppercase",letterSpacing:"0.08em"}}>
                    <Mail size={11}/> Email <span style={{background:"#f1f5f9",borderRadius:99,padding:"0.05rem 0.4rem",fontSize:"0.6rem",marginLeft:2}}>locked</span>
                  </label>
                  <div style={{padding:"0.65rem 0.9rem",background:"#f8fafc",borderRadius:10,
                    border:"1px solid #f1f5f9",color:"#94a3b8",fontSize:"0.82rem"}}>{form.email}</div>
                </div>
                <EditField lbl="Phone" icon={<Phone size={11}/>} value={form.phone} onChange={v=>setForm(p=>({...p,phone:v}))} placeholder="+91 98765 43210" type="tel"/>
                <EditField lbl="Location" icon={<MapPin size={11}/>} value={form.location} onChange={v=>setForm(p=>({...p,location:v}))} placeholder="City, Country"/>
              </div>

              {[
                {lbl:"Current Status",icon:<Briefcase size={11}/>,key:"role",opts:["Student","Working","Freelancer","Job Seeker","Other"]},
                {lbl:"Education",icon:<GraduationCap size={11}/>,key:"education",opts:["High School","Undergraduate","Graduate","Postgraduate","Professional"]},
              ].map(({lbl,icon,key,opts})=>(
                <div key={key} style={{marginTop:"0.85rem"}}>
                  <label style={{display:"flex",alignItems:"center",gap:5,fontSize:"0.68rem",fontWeight:700,
                    color:"#64748b",marginBottom:"0.35rem",textTransform:"uppercase",letterSpacing:"0.08em"}}>
                    {icon} {lbl}
                  </label>
                  <select value={(form as any)[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))}
                    style={{width:"100%",padding:"0.65rem 0.9rem",borderRadius:10,border:"1px solid #e2e8f0",
                      background:"#f8fafc",fontSize:"0.85rem",color:"#0f172a",outline:"none",fontFamily:"inherit"}}>
                    {opts.map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}

              <div style={{marginTop:"0.85rem"}}>
                <label style={{fontSize:"0.68rem",fontWeight:700,color:"#64748b",display:"block",
                  marginBottom:"0.35rem",textTransform:"uppercase",letterSpacing:"0.08em"}}>About You</label>
                <textarea value={form.bio} onChange={e=>setForm(p=>({...p,bio:e.target.value}))} rows={3}
                  placeholder="Tell the world what drives you..."
                  style={{width:"100%",padding:"0.65rem 0.9rem",borderRadius:10,border:"1px solid #e2e8f0",
                    background:"#f8fafc",fontSize:"0.85rem",color:"#0f172a",resize:"none",outline:"none",
                    fontFamily:"inherit",boxSizing:"border-box"}}/>
              </div>

              <div style={{display:"flex",gap:"0.65rem",marginTop:"1.4rem"}}>
                <button type="button" onClick={onClose}
                  style={{flex:1,padding:"0.7rem",borderRadius:11,border:"1px solid #e2e8f0",
                    background:"#f8fafc",color:"#64748b",fontWeight:600,fontSize:"0.83rem",cursor:"pointer",fontFamily:"inherit"}}>
                  Cancel
                </button>
                <motion.button type="submit" disabled={saving} whileTap={{scale:0.96}}
                  style={{flex:2,padding:"0.7rem",borderRadius:11,border:"none",
                    background:"linear-gradient(135deg,#2563eb,#7c3aed)",color:"#fff",fontWeight:700,
                    fontSize:"0.83rem",cursor:saving?"not-allowed":"pointer",display:"flex",
                    alignItems:"center",justifyContent:"center",gap:"0.4rem",fontFamily:"inherit",opacity:saving?0.7:1}}>
                  {saving?<><Loader2 size={13} style={{animation:"spin 1s linear infinite"}}/> Saving…</>
                    :<><Save size={13}/> Save Changes</>}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── MAIN ────────────────────────────────────────────────────────────────── */
export default function UserProfile() {
  const [fu, setFu] = useState<any>(null);
  const [ud, setUd] = useState<UserData>({
    name:"",email:"",phone:"",education:"Undergraduate",
    location:"",bio:"",photoURL:null,role:"Student",createdAt:"",interests:[],hobbies:[]
  });
  const [assess, setAssess] = useState<AssessmentResult|null>(null);
  const [acts, setActs] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [notifs, setNotifs] = useState(true);
  const [dark, setDark] = useState(false);
  const [toast, setToast] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(()=>{
    const unsub = auth.onAuthStateChanged(async u=>{
      if(!u){setLoading(false);return;}
      setFu(u);
      const ref = doc(db,"users",u.uid);
      const snap = await getDoc(ref);
      if(snap.exists()){
        const d = snap.data() as UserData;
        setUd({...d,email:u.email||d.email,photoURL:d.photoURL||u.photoURL||null});
      } else {
        const init:UserData = {
          name:u.displayName||"User",email:u.email||"",phone:"",education:"Undergraduate",
          location:"",bio:"",photoURL:u.photoURL||null,role:"Student",
          createdAt:new Date().toISOString(),interests:[],hobbies:[]
        };
        await setDoc(ref,init); setUd(init);
      }
      const as = await getDoc(doc(db,"assessments",u.uid));
      if(as.exists()) setAssess(as.data() as AssessmentResult);
      const ac = await getDoc(doc(db,"activities",u.uid));
      if(ac.exists()) setActs((ac.data().items||[]).slice(0,6));
      setLoading(false); setTimeout(()=>setReady(true),80);
    });
    return ()=>unsub();
  },[]);

  const logAct = async(type:string,title:string,icon:string)=>{
    if(!fu) return;
    const ref = doc(db,"activities",fu.uid);
    const s = await getDoc(ref);
    const ex:ActivityItem[] = s.exists()?(s.data().items||[]):[];
    const up = [{id:Date.now().toString(),type,title,date:new Date().toISOString(),icon},...ex].slice(0,20);
    await setDoc(ref,{items:up}); setActs(up.slice(0,6));
  };

  const saveProfile = async(upd:Partial<UserData>)=>{
    if(!fu) return;
    await updateDoc(doc(db,"users",fu.uid),upd as any);
    setUd(p=>({...p,...upd})); logAct("profile","Updated profile","👤");
  };
  const saveInterests = async(interests:string[])=>{
    if(!fu) return;
    await updateDoc(doc(db,"users",fu.uid),{interests});
    setUd(p=>({...p,interests})); logAct("interest","Updated career interests","💡");
  };
  const saveHobbies = async(hobbies:string[])=>{
    if(!fu) return;
    await updateDoc(doc(db,"users",fu.uid),{hobbies});
    setUd(p=>({...p,hobbies})); logAct("hobby","Updated hobbies","🎨");
  };

  const downloadReport = ()=>{
    if(!assess){alert("Take the aptitude test first.");return;}
    const lines=[
      "══════════════════════════════════════════════",
      "      CAREER ASSESSMENT REPORT",
      "══════════════════════════════════════════════",
      `Name: ${ud.name}`,`Email: ${ud.email}`,
      `Date: ${new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}`,
      "","── Thinking Style ───────────────────────────",
      `Primary: ${assess.thinking_style?.primary?.label??"N/A"}`,
      assess.thinking_style?.secondary?`Secondary: ${assess.thinking_style.secondary.label}`:"",
      "","── Top Careers ──────────────────────────────",
      ...(assess.top_careers??[]).map((c,i)=>`${i+1}. ${typeof c==="object"?c.name:c}`),
      "","── Good Fits ────────────────────────────────",
      ...(assess.moderate_careers??[]).map((c,i)=>`${i+1}. ${typeof c==="object"?c.name:c}`),
      "","── Career Interests ─────────────────────────",
      ud.interests.join(", ")||"Not specified",
      "","══════════════════════════════════════════════",
      "   Where Do I Go? Career Platform",
      "══════════════════════════════════════════════",
    ];
    const url=URL.createObjectURL(new Blob([lines.join("\n")],{type:"text/plain"}));
    const a=document.createElement("a"); a.href=url;
    a.download=`${ud.name.replace(/\s+/g,"_")}_Career_Report.txt`;
    a.click(); URL.revokeObjectURL(url);
  };

  const shareProfile = async()=>{
    const text=`${ud.name} — Career Profile\nThinking Style: ${assess?.thinking_style?.primary?.label??"Unknown"}\nTop Career: ${assess?.top_careers?.[0]?.name??"N/A"}\nvia Where Do I Go?`;
    if(navigator.share){try{await navigator.share({title:`${ud.name}'s Profile`,text});}catch{}}
    else{await navigator.clipboard.writeText(text);setToast(true);setTimeout(()=>setToast(false),3000);}
  };

  const HIDE = ["suppression_signal","pressure_conformity","childhood_divergence","fear_avoidance"];
  const traits = Object.entries((assess as any)?.normalizedTraits??{})
    .filter(([k])=>!HIDE.includes(k))
    .map(([k,v]:[string,any])=>({key:k,name:label(k),score:Math.round(v*100)}))
    .sort((a:any,b:any)=>b.score-a.score).slice(0,10) as {key:string;name:string;score:number}[];

  const joined = ud.createdAt
    ? new Date(ud.createdAt).toLocaleDateString("en-IN",{month:"long",year:"numeric"}) : "";

  if(loading) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f0f7ff"}}>
      <div style={{textAlign:"center"}}>
        <div style={{width:36,height:36,border:"3px solid #bfdbfe",borderTopColor:"#2563eb",
          borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto 1rem"}}/>
        <p style={{fontSize:"0.9rem",fontWeight:600,color:"#1e40af"}}>Loading profile…</p>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap');
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes up{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .card{opacity:0;animation:up 0.5s cubic-bezier(0.16,1,0.3,1) forwards}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{height:4px;width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#bfdbfe;border-radius:99px}
      `}</style>

      <div style={{
        minHeight:"100vh",
        background:"linear-gradient(160deg,#f0f7ff 0%,#fafbff 40%,#f5f3ff 100%)",
        fontFamily:"'Sora',sans-serif",color:"#0f172a",
        opacity:ready?1:0,transition:"opacity 0.5s ease",overflowX:"hidden"
      }}>

        {/* ── Subtle mesh background ── */}
        <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
          <div style={{position:"absolute",top:"-20%",right:"-10%",width:600,height:600,borderRadius:"50%",
            background:"radial-gradient(circle,rgba(37,99,235,0.06) 0%,transparent 70%)"}}/>
          <div style={{position:"absolute",bottom:"-10%",left:"-5%",width:500,height:500,borderRadius:"50%",
            background:"radial-gradient(circle,rgba(124,58,237,0.06) 0%,transparent 70%)"}}/>
        </div>

        <div style={{position:"relative",zIndex:1,maxWidth:1080,margin:"0 auto",padding:"2.5rem 1.5rem 6rem"}}>

          {/* ══ HERO PROFILE CARD ══════════════════════════════════════════════ */}
          <div className="card" style={{animationDelay:"0s",
            background:"#fff",borderRadius:24,marginBottom:"1.5rem",overflow:"hidden",
            boxShadow:"0 1px 2px rgba(0,0,0,0.04),0 8px 32px rgba(37,99,235,0.08)",
            border:"1px solid rgba(37,99,235,0.08)"}}>

            {/* colour stripe */}
            <div style={{height:5,background:"linear-gradient(90deg,#2563eb 0%,#7c3aed 50%,#2563eb 100%)",backgroundSize:"200% 100%"}}/>

            <div style={{padding:"2rem 2.25rem"}}>
              <div style={{display:"flex",flexWrap:"wrap",alignItems:"flex-start",gap:"1.75rem"}}>

                {/* Avatar */}
                <div style={{position:"relative",flexShrink:0}}>
                  <div style={{width:108,height:108,borderRadius:"50%",padding:3,
                    background:"linear-gradient(135deg,#2563eb,#7c3aed)"}}>
                    <div style={{width:"100%",height:"100%",borderRadius:"50%",overflow:"hidden",
                      background:"#eff6ff",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      {ud.photoURL
                        ? <img src={ud.photoURL} alt={ud.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                        : <span style={{fontSize:"2rem",fontWeight:800,
                            background:"linear-gradient(135deg,#2563eb,#7c3aed)",
                            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                            {initials(ud.name)}
                          </span>}
                    </div>
                  </div>
                  <div style={{position:"absolute",bottom:5,right:5,width:14,height:14,
                    borderRadius:"50%",background:"#3b82f6",border:"2.5px solid #fff"}}/>
                </div>

                {/* Name + meta */}
                <div style={{flex:1,minWidth:200}}>
                  <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:"0.65rem",marginBottom:"0.5rem"}}>
                    <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:"clamp(1.5rem,3vw,2rem)",
                      fontWeight:400,color:"#0f172a",margin:0,letterSpacing:"-0.01em"}}>{ud.name||"Your Name"}</h1>
                    <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"0.22rem 0.75rem",
                      borderRadius:99,background:"linear-gradient(135deg,#2563eb,#7c3aed)",
                      color:"#fff",fontSize:"0.67rem",fontWeight:700,letterSpacing:"0.04em",textTransform:"uppercase"}}>
                      <Sparkles size={9}/>{ud.role}
                    </span>
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:"0.6rem 1.1rem",color:"#64748b",fontSize:"0.78rem",marginBottom:"0.75rem"}}>
                    {[
                      {icon:<Mail size={11}/>,val:ud.email},
                      ud.location&&{icon:<MapPin size={11}/>,val:ud.location},
                      ud.phone&&{icon:<Phone size={11}/>,val:ud.phone},
                      joined&&{icon:<Calendar size={11}/>,val:`Joined ${joined}`},
                      ud.education&&{icon:<GraduationCap size={11}/>,val:ud.education},
                    ].filter(Boolean).map((item:any,i)=>(
                      <span key={i} style={{display:"flex",alignItems:"center",gap:4}}>{item.icon}{item.val}</span>
                    ))}
                  </div>
                  {ud.bio&&<p style={{fontSize:"0.82rem",lineHeight:1.7,color:"#475569",maxWidth:"52ch",margin:0}}>{ud.bio}</p>}
                </div>

                {/* Edit button */}
                <motion.button whileHover={{scale:1.04}} whileTap={{scale:0.95}} onClick={()=>setEditOpen(true)}
                  style={{display:"flex",alignItems:"center",gap:6,padding:"0.6rem 1.2rem",borderRadius:11,
                    border:"1.5px solid #2563eb",background:"transparent",color:"#2563eb",fontWeight:700,
                    fontSize:"0.78rem",cursor:"pointer",fontFamily:"inherit",flexShrink:0,letterSpacing:"0.01em"}}>
                  <Edit3 size={13}/> Edit Profile
                </motion.button>
              </div>

              {/* Thinking style pill */}
              {assess?.thinking_style?.primary&&(
                <div style={{marginTop:"1.25rem",paddingTop:"1.25rem",borderTop:"1px solid #f1f5f9"}}>
                  <div style={{display:"inline-flex",alignItems:"center",gap:"0.9rem",
                    padding:"0.7rem 1.2rem",borderRadius:14,
                    background:"linear-gradient(135deg,#eff6ff,#f5f3ff)",
                    border:"1px solid #bfdbfe"}}>
                    <span style={{fontSize:"1.5rem"}}>🧩</span>
                    <div>
                      <p style={{fontSize:"0.58rem",fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",
                        color:"#2563eb",margin:"0 0 0.1rem"}}>Thinking Style</p>
                      <p style={{fontFamily:"'DM Serif Display',serif",fontSize:"0.95rem",color:"#0f172a",margin:0}}>
                        {assess.thinking_style.primary.label}
                      </p>
                      {assess.thinking_style.secondary&&(
                        <p style={{fontSize:"0.68rem",color:"#7c3aed",margin:"0.08rem 0 0"}}>
                          Also: {assess.thinking_style.secondary.label}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ══ MAIN GRID ══════════════════════════════════════════════════════ */}
          <div style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) 280px",gap:"1.5rem",alignItems:"start"}}>

            {/* ── LEFT ── */}
            <div style={{display:"flex",flexDirection:"column",gap:"1.5rem",minWidth:0}}>

              {/* SKILL STRENGTHS */}
              <div className="card" style={{animationDelay:"0.08s",
                background:"#fff",borderRadius:20,padding:"1.75rem",
                boxShadow:"0 1px 2px rgba(0,0,0,0.04),0 4px 16px rgba(37,99,235,0.06)",
                border:"1px solid rgba(37,99,235,0.07)"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.4rem"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
                    <div style={{width:30,height:30,borderRadius:8,background:"#eff6ff",
                      display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <Brain size={15} color="#2563eb"/>
                    </div>
                    <h2 style={{fontSize:"0.93rem",fontWeight:700,color:"#0f172a",margin:0,letterSpacing:"-0.01em"}}>Skill Strengths</h2>
                  </div>
                  {!assess&&<span style={{fontSize:"0.68rem",color:"#94a3b8",fontStyle:"italic"}}>Take the aptitude test</span>}
                </div>
                {traits.length>0?(
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 2.5rem"}}>
                    {traits.map((t,i)=><SkillBar key={t.key} name={t.name} score={t.score} i={i}/>)}
                  </div>
                ):(
                  <div style={{textAlign:"center",padding:"2rem 1rem",color:"#cbd5e1"}}>
                    <Brain size={36} style={{marginBottom:"0.75rem",opacity:0.4}}/>
                    <p style={{margin:0,fontSize:"0.82rem",color:"#94a3b8"}}>Complete the aptitude test to unlock your skill profile.</p>
                  </div>
                )}
              </div>

              {/* CAREER INTERESTS */}
              <div className="card" style={{animationDelay:"0.14s",
                background:"#fff",borderRadius:20,padding:"1.75rem",
                boxShadow:"0 1px 2px rgba(0,0,0,0.04),0 4px 16px rgba(37,99,235,0.06)",
                border:"1px solid rgba(37,99,235,0.07)"}}>
                <TagInput label="Career Interests" icon={<Target size={16}/>}
                  tags={ud.interests} onUpdate={saveInterests}
                  placeholder="e.g. UI/UX Design, Data Science…" color="#2563eb"/>
              </div>

              {/* HOBBIES */}
              <div className="card" style={{animationDelay:"0.18s",
                background:"#fff",borderRadius:20,padding:"1.75rem",
                boxShadow:"0 1px 2px rgba(0,0,0,0.04),0 4px 16px rgba(124,58,237,0.06)",
                border:"1px solid rgba(124,58,237,0.07)"}}>
                <TagInput label="Hobbies & Interests" icon={<Music size={16}/>}
                  tags={ud.hobbies} onUpdate={saveHobbies}
                  placeholder="e.g. Photography, Reading…" color="#7c3aed"/>
              </div>

              {/* RECOMMENDED CAREERS */}
              <div className="card" style={{animationDelay:"0.22s",
                background:"#fff",borderRadius:20,padding:"1.75rem",
                boxShadow:"0 1px 2px rgba(0,0,0,0.04),0 4px 16px rgba(37,99,235,0.06)",
                border:"1px solid rgba(37,99,235,0.07)"}}>
                <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"1.4rem"}}>
                  <div style={{width:30,height:30,borderRadius:8,background:"#faf5ff",
                    display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <Award size={15} color="#7c3aed"/>
                  </div>
                  <h2 style={{fontSize:"0.93rem",fontWeight:700,color:"#0f172a",margin:0,letterSpacing:"-0.01em"}}>Recommended Career Paths</h2>
                </div>

                {(assess?.top_careers?.length||assess?.moderate_careers?.length)?(
                  <div style={{display:"flex",gap:"0.75rem",overflowX:"auto",paddingBottom:"0.5rem"}}>
                    {[...(assess?.top_careers??[]),...(assess?.moderate_careers??[])].slice(0,8).map((c:any,i)=>{
                      const top = i<(assess?.top_careers?.length??0);
                      return (
                        <motion.div key={i} whileHover={{y:-4,boxShadow:top
                          ?"0 12px 28px rgba(37,99,235,0.22)"
                          :"0 12px 28px rgba(124,58,237,0.22)"}}
                          style={{minWidth:180,borderRadius:16,padding:"1.1rem 1.25rem",color:"#fff",flexShrink:0,
                            background:top
                              ?"linear-gradient(145deg,#1d4ed8,#2563eb)"
                              :"linear-gradient(145deg,#6d28d9,#7c3aed)",
                            boxShadow:top
                              ?"0 4px 14px rgba(37,99,235,0.18)"
                              :"0 4px 14px rgba(124,58,237,0.18)",
                            transition:"box-shadow 0.2s,transform 0.2s",cursor:"default"}}>
                          <p style={{fontSize:"0.55rem",fontWeight:700,letterSpacing:"0.12em",
                            textTransform:"uppercase",opacity:0.75,margin:"0 0 0.4rem"}}>
                            {top?"★ Top Match":"◆ Good Fit"}
                          </p>
                          <p style={{fontFamily:"'DM Serif Display',serif",fontSize:"0.95rem",
                            lineHeight:1.3,margin:0}}>{typeof c==="object"?c.name:c}</p>
                          {c?.emerging&&(
                            <span style={{display:"inline-block",marginTop:"0.4rem",fontSize:"0.56rem",
                              fontWeight:700,background:"rgba(255,255,255,0.2)",
                              padding:"0.1rem 0.45rem",borderRadius:99,letterSpacing:"0.06em"}}>
                              EMERGING
                            </span>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                ):(
                  <div style={{textAlign:"center",padding:"2rem 1rem",color:"#94a3b8"}}>
                    <Award size={36} style={{marginBottom:"0.75rem",opacity:0.3}}/>
                    <p style={{margin:0,fontSize:"0.82rem"}}>Complete the aptitude test to see your career matches.</p>
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT ── */}
            <div style={{display:"flex",flexDirection:"column",gap:"1.5rem"}}>

              {/* RECENT ACTIVITY */}
              <div className="card" style={{animationDelay:"0.1s",
                background:"#fff",borderRadius:20,padding:"1.5rem",
                boxShadow:"0 1px 2px rgba(0,0,0,0.04),0 4px 16px rgba(37,99,235,0.06)",
                border:"1px solid rgba(37,99,235,0.07)"}}>
                <div style={{display:"flex",alignItems:"center",gap:"0.45rem",marginBottom:"1.25rem"}}>
                  <div style={{width:28,height:28,borderRadius:7,background:"#f8fafc",
                    display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <Clock size={13} color="#64748b"/>
                  </div>
                  <h2 style={{fontSize:"0.88rem",fontWeight:700,color:"#0f172a",margin:0}}>Recent Activity</h2>
                </div>
                {acts.length>0?(
                  <div style={{display:"flex",flexDirection:"column",gap:"0.7rem"}}>
                    {acts.map((a,i)=>(
                      <div key={a.id} style={{display:"flex",alignItems:"flex-start",gap:"0.6rem",position:"relative"}}>
                        {i<acts.length-1&&(
                          <div style={{position:"absolute",left:14,top:28,width:1,
                            height:"calc(100% + 0.7rem)",
                            background:"linear-gradient(to bottom,#bfdbfe,transparent)"}}/>
                        )}
                        <div style={{width:28,height:28,borderRadius:"50%",background:"#eff6ff",
                          border:"1px solid #bfdbfe",display:"flex",alignItems:"center",
                          justifyContent:"center",fontSize:"0.78rem",flexShrink:0,zIndex:1}}>
                          {a.icon||"📌"}
                        </div>
                        <div style={{flex:1,minWidth:0}}>
                          <p style={{fontSize:"0.76rem",fontWeight:600,color:"#1e293b",margin:"0 0 0.08rem",lineHeight:1.4}}>{a.title}</p>
                          <p style={{fontSize:"0.66rem",color:"#94a3b8",margin:0}}>{relTime(a.date)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ):(
                  <p style={{fontSize:"0.76rem",color:"#94a3b8",textAlign:"center",fontStyle:"italic",margin:"0.5rem 0"}}>No activity yet.</p>
                )}
              </div>

              {/* QUICK SETTINGS */}
              <div className="card" style={{animationDelay:"0.16s",
                background:"#fff",borderRadius:20,padding:"1.5rem",
                boxShadow:"0 1px 2px rgba(0,0,0,0.04),0 4px 16px rgba(37,99,235,0.06)",
                border:"1px solid rgba(37,99,235,0.07)"}}>
                <div style={{display:"flex",alignItems:"center",gap:"0.45rem",marginBottom:"1.25rem"}}>
                  <div style={{width:28,height:28,borderRadius:7,background:"#f8fafc",
                    display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <Settings size={13} color="#64748b"/>
                  </div>
                  <h2 style={{fontSize:"0.88rem",fontWeight:700,color:"#0f172a",margin:0}}>Quick Settings</h2>
                </div>

                <div style={{display:"flex",flexDirection:"column",gap:"0.35rem"}}>
                  {/* Toggles */}
                  {[
                    {lbl:"Notifications",icon:<Bell size={13} color="#64748b"/>,val:notifs,set:()=>setNotifs(p=>!p)},
                    {lbl:"Dark Mode",icon:<Moon size={13} color="#64748b"/>,val:dark,set:()=>setDark(p=>!p)},
                  ].map(({lbl,icon,val,set})=>(
                    <div key={lbl} style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                      padding:"0.65rem 0.8rem",borderRadius:10,background:"#f8fafc",border:"1px solid #f1f5f9"}}>
                      <div style={{display:"flex",alignItems:"center",gap:"0.45rem"}}>
                        {icon}<span style={{fontSize:"0.78rem",fontWeight:500,color:"#334155"}}>{lbl}</span>
                      </div>
                      <Toggle on={val} onToggle={set}/>
                    </div>
                  ))}

                  {/* Action buttons */}
                  {[
                    {lbl:"Download Report",icon:<Download size={13} color="#2563eb"/>,onClick:downloadReport},
                    {lbl:"Share Profile",icon:<Share2 size={13} color="#7c3aed"/>,onClick:shareProfile},
                  ].map(({lbl,icon,onClick})=>(
                    <motion.button key={lbl} whileTap={{scale:0.97}} onClick={onClick}
                      style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                        padding:"0.65rem 0.8rem",borderRadius:10,background:"#f8fafc",
                        border:"1px solid #f1f5f9",cursor:"pointer",fontFamily:"inherit",width:"100%"}}>
                      <span style={{fontSize:"0.78rem",fontWeight:500,color:"#334155"}}>{lbl}</span>
                      {icon}
                    </motion.button>
                  ))}

                  <div style={{height:1,background:"#f1f5f9",margin:"0.1rem 0"}}/>

                  {/* Logout */}
                  <motion.button whileTap={{scale:0.97}} onClick={()=>setLogoutOpen(true)}
                    style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                      padding:"0.65rem 0.8rem",borderRadius:10,background:"#fff5f5",
                      border:"1px solid #fee2e2",cursor:"pointer",fontFamily:"inherit",width:"100%"}}>
                    <span style={{fontSize:"0.78rem",fontWeight:700,color:"#dc2626"}}>Sign Out</span>
                    <LogOut size={13} color="#dc2626"/>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── MODALS ── */}
        <EditModal open={editOpen} onClose={()=>setEditOpen(false)} userData={ud} onSave={saveProfile}/>

        <AnimatePresence>
          {logoutOpen&&(
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              style={{position:"fixed",inset:0,zIndex:50,display:"flex",alignItems:"center",
                justifyContent:"center",padding:"1rem",background:"rgba(2,6,23,0.55)",backdropFilter:"blur(8px)"}}
              onClick={()=>setLogoutOpen(false)}>
              <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.9,opacity:0}}
                onClick={e=>e.stopPropagation()}
                style={{background:"#fff",borderRadius:22,padding:"2rem",maxWidth:360,width:"100%",
                  boxShadow:"0 24px 60px rgba(0,0,0,0.14)",textAlign:"center"}}>
                <div style={{width:50,height:50,borderRadius:"50%",background:"#fff5f5",
                  display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 0.9rem"}}>
                  <LogOut size={20} color="#dc2626"/>
                </div>
                <h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.25rem",color:"#0f172a",marginBottom:"0.4rem"}}>Sign out?</h3>
                <p style={{fontSize:"0.8rem",color:"#64748b",lineHeight:1.65,marginBottom:"1.5rem"}}>
                  You'll need to sign back in to access your profile and results.
                </p>
                <div style={{display:"flex",gap:"0.6rem"}}>
                  <button onClick={()=>setLogoutOpen(false)}
                    style={{flex:1,padding:"0.7rem",borderRadius:11,border:"1px solid #e2e8f0",
                      background:"#f8fafc",color:"#64748b",fontWeight:600,fontSize:"0.82rem",
                      cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
                  <motion.button whileTap={{scale:0.97}}
                    onClick={()=>{auth.signOut();setLogoutOpen(false);}}
                    style={{flex:1,padding:"0.7rem",borderRadius:11,border:"none",background:"#dc2626",
                      color:"#fff",fontWeight:700,fontSize:"0.82rem",cursor:"pointer",fontFamily:"inherit"}}>
                    Sign Out
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {toast&&(
            <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} exit={{opacity:0,y:24}}
              style={{position:"fixed",bottom:28,left:"50%",transform:"translateX(-50%)",zIndex:100,
                background:"linear-gradient(135deg,#1d4ed8,#7c3aed)",color:"#fff",
                padding:"0.7rem 1.4rem",borderRadius:99,
                boxShadow:"0 8px 24px rgba(29,78,216,0.28)",fontSize:"0.8rem",fontWeight:600,
                display:"flex",alignItems:"center",gap:6,whiteSpace:"nowrap"}}>
              <CheckCircle2 size={13}/> Copied to clipboard!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}