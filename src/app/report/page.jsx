"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const C = {
  navy:"#1A1A5E", navyMid:"#2D2D8A", lavender:"#C4B5FD",
  lilac:"#EDE9FE", pink:"#FBCFE8", blush:"#FDF2F8",
  sky:"#BAE6FD", skyLight:"#F0F9FF", cream:"#FAFAF8",
  white:"#FFFFFF", muted:"#9CA3AF",
  grad1:"linear-gradient(135deg,#EDE9FE,#FDF2F8)",
  grad2:"linear-gradient(135deg,#F0F9FF,#EDE9FE)",
  grad3:"linear-gradient(135deg,#FDF2F8,#F0F9FF)",
};

const TRAIT_COLORS=["#8B5CF6","#EC4899","#0EA5E9","#10B981","#F59E0B","#6366F1"];
const DIM_COLOR={cognitive:"#0EA5E9",personality:"#8B5CF6",motivational:"#F59E0B",social:"#10B981",suppression:"#EC4899",contribution:"#6366F1"};
const DIM_ICON={cognitive:"🧠",personality:"⚙️",motivational:"🔥",social:"🤝",suppression:"🔓",contribution:"🌍"};

function Ring({score,size=90,stroke=8,color="#8B5CF6",label,delay=0}){
  const [a,setA]=useState(false);
  const r=(size-stroke)/2, circ=2*Math.PI*r, off=circ-(a?score/100:0)*circ;
  useEffect(()=>{const t=setTimeout(()=>setA(true),delay);return()=>clearTimeout(t);},[delay]);
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
      <div style={{position:"relative",width:size,height:size}}>
        <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={`${color}25`} strokeWidth={stroke}/>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
            strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
            style={{transition:`stroke-dashoffset 1.4s cubic-bezier(.16,1,.3,1) ${delay}ms`}}/>
        </svg>
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
          <span style={{fontSize:size*.23,fontWeight:800,color:C.navy,fontFamily:"Georgia,serif",lineHeight:1}}>{score}</span>
        </div>
      </div>
      {label&&<div style={{fontSize:"0.65rem",fontWeight:700,color:C.navy,textTransform:"capitalize",textAlign:"center",letterSpacing:"0.04em"}}>{DIM_ICON[label]||"📊"} {label}</div>}
    </div>
  );
}

function TraitBar({label,score,color,i}){
  const [w,setW]=useState(0);
  useEffect(()=>{const t=setTimeout(()=>setW(score),200+i*60);return()=>clearTimeout(t);},[score,i]);
  return(
    <div style={{background:C.white,borderRadius:16,padding:"1rem 1.25rem",boxShadow:`0 2px 12px ${color}18`,border:`1.5px solid ${color}28`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:8}}>
        <span style={{fontSize:"0.8rem",fontWeight:700,color:C.navy}}>{label}</span>
        <span style={{fontSize:"1.3rem",fontWeight:800,color,fontFamily:"Georgia,serif"}}>{score}<span style={{fontSize:"0.6rem",color:C.muted}}>%</span></span>
      </div>
      <div style={{height:6,background:`${color}18`,borderRadius:999,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${w}%`,background:`linear-gradient(90deg,${color},${color}88)`,borderRadius:999,transition:`width 1.1s cubic-bezier(.16,1,.3,1) ${i*40}ms`,boxShadow:`0 0 8px ${color}55`}}/>
      </div>
    </div>
  );
}

function CareerCard({c,rank}){
  const [hov,setHov]=useState(false);
  const GRADS=[C.grad1,C.grad2,C.grad3,C.grad1,C.grad2];
  const BADGE=["🥇","🥈","🥉","4️⃣","5️⃣"];
  return(
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:GRADS[rank],borderRadius:22,padding:"1.5rem",border:"1.5px solid rgba(255,255,255,.8)",
        boxShadow:hov?"0 20px 50px rgba(139,92,246,.2)":"0 4px 20px rgba(139,92,246,.08)",
        transform:hov?"translateY(-5px)":"none",transition:"all .3s cubic-bezier(.16,1,.3,1)",
        position:"relative",overflow:"hidden",cursor:"default"}}>
      <div style={{position:"absolute",top:-20,right:-20,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,.5)"}}/>
      <div style={{position:"absolute",top:10,right:14,fontSize:"1.5rem"}}>{BADGE[rank]}</div>
      <div style={{fontSize:"0.6rem",fontWeight:800,letterSpacing:".15em",textTransform:"uppercase",color:C.navyMid,opacity:.7,marginBottom:4}}>{c.domain}</div>
      <div style={{fontFamily:"Georgia,serif",fontSize:"1.1rem",fontWeight:700,color:C.navy,marginBottom:6,lineHeight:1.2,paddingRight:30}}>{c.name}</div>
      <div style={{fontSize:"0.76rem",color:C.navyMid,lineHeight:1.6,marginBottom:12,opacity:.85}}>{c.society_role}</div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{fontSize:"1.4rem",fontWeight:800,color:TRAIT_COLORS[rank%6],fontFamily:"Georgia,serif"}}>{c.score}%</div>
        {c.emerging&&<span style={{fontSize:"0.58rem",fontWeight:800,background:C.sky,color:C.navy,borderRadius:999,padding:"0.2rem 0.6rem",letterSpacing:".1em"}}>✨ EMERGING</span>}
      </div>
    </div>
  );
}

function RoadStep({step,i,total,color}){
  const [vis,setVis]=useState(false);
  const ref=useRef();
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setVis(true)},{threshold:.3});
    if(ref.current)obs.observe(ref.current);
    return()=>obs.disconnect();
  },[]);
  return(
    <div ref={ref} style={{display:"flex",gap:14,opacity:vis?1:0,transform:vis?"none":"translateX(-16px)",transition:`all .5s ease ${i*.09}s`}}>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}>
        <div style={{width:38,height:38,borderRadius:"50%",background:`linear-gradient(135deg,${color},${color}99)`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:"white",fontSize:"0.85rem",boxShadow:`0 4px 14px ${color}44`,flexShrink:0}}>{i+1}</div>
        {i<total-1&&<div style={{width:2,flex:1,background:`linear-gradient(180deg,${color}55,transparent)`,marginTop:4,minHeight:28}}/>}
      </div>
      <div style={{background:C.white,borderRadius:16,padding:"1rem 1.25rem",flex:1,boxShadow:"0 2px 10px rgba(139,92,246,.07)",border:`1px solid ${color}22`,marginBottom:12}}>
        <p style={{fontSize:"0.84rem",color:C.navy,lineHeight:1.7,fontWeight:500}}>{step}</p>
      </div>
    </div>
  );
}

function FlagCard({flag,i}){
  const [open,setOpen]=useState(false);
  return(
    <div onClick={()=>setOpen(!open)} style={{background:C.white,borderRadius:16,padding:"1rem 1.25rem",border:`1.5px solid #FBCFE866`,cursor:"pointer",boxShadow:"0 2px 10px #FBCFE820",transition:"all .2s"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:10,background:C.blush,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem"}}>🔍</div>
          <span style={{fontWeight:700,color:C.navy,fontSize:"0.84rem"}}>{flag.title||"Pattern Detected"}</span>
        </div>
        <span style={{color:C.muted,fontSize:"0.75rem",transition:"transform .2s",transform:open?"rotate(180deg)":"none"}}>▼</span>
      </div>
      {open&&<p style={{fontSize:"0.8rem",color:C.navyMid,lineHeight:1.75,marginTop:10,borderTop:`1px solid ${C.blush}`,paddingTop:10}}>{flag.insight||flag.description}</p>}
    </div>
  );
}

function extractPhrases(text,max=4){
  return(text||"").split(/[.!?]+/).map(s=>s.trim()).filter(s=>s.length>30&&s.length<180).slice(0,max);
}
function extractSteps(text){
  const lines=(text||"").split("\n").map(l=>l.trim()).filter(Boolean);
  const steps=[];
  for(const l of lines){
    const m=l.match(/^\(?(\d+)\)?[.)]\s+(.+)/)||l.match(/^[-•*]\s+(.+)/);
    if(m)steps.push(m[2]||m[1]);
  }
  return steps.length>2?steps:lines.filter(l=>l.length>25).slice(0,6);
}
function parseSections(text){
  return(text||"").split(/^## /m).filter(Boolean).map(p=>{
    const nl=p.indexOf("\n");
    return{heading:p.slice(0,nl).trim().replace(/^\d+\.\s*/,""),body:p.slice(nl+1).trim()};
  });
}

export default function ReportPage(){
  const router=useRouter();
  const sp=useSearchParams();
  const uid=sp.get("uid");
  const [data,setData]=useState(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);
  const [dl,setDl]=useState(false);

  useEffect(()=>{
    if(!uid){router.push("/login");return;}
    fetch(`http://localhost:5000/api/report/${uid}`)
      .then(r=>{if(!r.ok)throw new Error("Failed to generate report");return r.json();})
      .then(d=>{setData(d);setLoading(false);})
      .catch(e=>{setError(e.message);setLoading(false);});
  },[uid]);

  const downloadPDF=async()=>{
    try{
      setDl(true);
      const res=await fetch(`http://localhost:5000/api/report/${uid}/pdf`);
      if(!res.ok)throw new Error("PDF failed");
      const blob=await res.blob();
      const a=document.createElement("a");
      a.href=URL.createObjectURL(blob);a.download="wdig-report.pdf";a.click();
    }catch(e){alert(e.message);}finally{setDl(false);}
  };

  if(loading)return(
    <div style={{minHeight:"100vh",background:`linear-gradient(135deg,${C.lilac},${C.blush},${C.skyLight})`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20,fontFamily:"Georgia,serif"}}>
      <style>{`@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{fontSize:"3.5rem",animation:"bob 2s ease infinite"}}>🌸</div>
      <div style={{fontSize:"1.5rem",fontWeight:700,color:C.navy}}>Crafting Your Report</div>
      <div style={{display:"flex",gap:8}}>{[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:TRAIT_COLORS[i],animation:`bob 1.2s ease ${i*.2}s infinite`}}/>)}</div>
      <p style={{color:C.muted,fontSize:"0.85rem",fontFamily:"system-ui"}}>Takes about 20 seconds…</p>
    </div>
  );

  if(error)return(
    <div style={{minHeight:"100vh",background:`linear-gradient(135deg,${C.lilac},${C.blush})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"system-ui"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:"3rem",marginBottom:12}}>⚠️</div>
        <div style={{color:C.navy,fontWeight:700,marginBottom:8}}>{error}</div>
        <button onClick={()=>{setLoading(true);setError(null);fetch(`http://localhost:5000/api/report/${uid}`).then(r=>r.json()).then(d=>{setData(d);setLoading(false);}).catch(e=>{setError(e.message);setLoading(false);});}}
          style={{padding:"0.7rem 1.5rem",background:C.navyMid,color:"white",border:"none",borderRadius:12,cursor:"pointer",fontWeight:600}}>Try Again</button>
      </div>
    </div>
  );
  if(!data)return null;

  const secs=parseSections(data.report||"");
  const dims=data.dimension_scores||{};
  const traits=data.dominant_traits||[];
  const careers=data.top_careers||[];
  const moderate=data.moderate_careers||[];
  const supp=data.suppression||{};
  const flags=supp.flags||[];

  const whoSec=secs.find(s=>/who/i.test(s.heading))||secs[0];
  const holdSec=secs.find(s=>/hold|back/i.test(s.heading))||secs[1];
  const worldSec=secs.find(s=>/world|offer/i.test(s.heading))||secs[2];
  const roadSec=secs.find(s=>/road|career/i.test(s.heading))||secs[3];
  const eduSec=secs.find(s=>/edu|path/i.test(s.heading))||secs[4];

  const whoCards=extractPhrases(whoSec?.body,3);
  const worldCards=extractPhrases(worldSec?.body,3);
  const holdCards=extractPhrases(holdSec?.body,3);
  const roadSteps=extractSteps(roadSec?.body);
  const eduSteps=extractSteps(eduSec?.body);
  const closingLine=extractPhrases(secs[secs.length-1]?.body,1)[0];

  const SEC=(icon,grad,children)=>(
    <div style={{background:grad,borderRadius:24,padding:"2rem",marginBottom:"1.25rem",border:"1.5px solid rgba(255,255,255,.7)",boxShadow:"0 4px 30px rgba(139,92,246,.06)"}}>
      <div style={{fontSize:"1.5rem",marginBottom:"0.5rem"}}>{icon}</div>
      {children}
    </div>
  );

  return(<>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
      *{box-sizing:border-box;margin:0;padding:0}
      body{background:${C.cream}}
      @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
      @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
      .fu{opacity:0;animation:fadeUp .6s ease forwards}
      ::-webkit-scrollbar{width:5px}
      ::-webkit-scrollbar-thumb{background:${C.lavender};border-radius:99px}
    `}</style>

    <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",background:C.cream,minHeight:"100vh",color:C.navy}}>

      {/* ── HERO ── */}
      <div style={{background:`linear-gradient(160deg,${C.navy} 0%,${C.navyMid} 55%,#3D2A8A 100%)`,padding:"3.5rem 1.5rem 4rem",position:"relative",overflow:"hidden"}}>
        {/* decorative blobs */}
        {[["-50px","auto","-50px","auto",300,300,C.lavender,.18],["-40px","auto","auto","-40px",200,200,C.sky,.12],["40%","auto","auto","35%",180,180,C.pink,.1]].map(([t,b,r,l,w,h,col,op],i)=>(
          <div key={i} style={{position:"absolute",top:t,bottom:b,right:r,left:l,width:w,height:h,borderRadius:"50%",background:`radial-gradient(circle,${col}${Math.round(op*255).toString(16).padStart(2,"0")},transparent 65%)`,pointerEvents:"none"}}/>
        ))}
        {/* floating dots */}
        {[...Array(7)].map((_,i)=>(
          <div key={i} style={{position:"absolute",borderRadius:"50%",width:[6,9,5,7,8,6,7][i],height:[6,9,5,7,8,6,7][i],background:[C.lavender,C.pink,C.sky,C.lavender,C.pink,C.sky,C.lavender][i],opacity:.45,top:[`12%`,`65%`,`25%`,`78%`,`40%`,`18%`,`55%`][i],left:[`8%`,`18%`,`72%`,`82%`,`48%`,`88%`,`30%`][i],animation:`bob ${[2.2,2.8,2,3,2.5,1.9,2.6][i]}s ease ${[0,.3,.6,.1,.5,.8,.2][i]}s infinite`}}/>
        ))}

        <div style={{maxWidth:820,margin:"0 auto",position:"relative"}}>
          {/* nav */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"2.5rem",flexWrap:"wrap",gap:10}}>
            <button onClick={()=>router.push("/results")} style={{background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",color:"rgba(255,255,255,.75)",padding:"0.45rem 1rem",borderRadius:10,cursor:"pointer",fontSize:"0.8rem",fontFamily:"'Plus Jakarta Sans',sans-serif",backdropFilter:"blur(8px)"}}>← Results</button>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>{setLoading(true);fetch(`http://localhost:5000/api/report/${uid}?force=true`).then(r=>r.json()).then(d=>{setData(d);setLoading(false);});}}
                style={{background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",color:"rgba(255,255,255,.7)",padding:"0.45rem 0.9rem",borderRadius:10,cursor:"pointer",fontSize:"0.8rem",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>↺</button>
              <button onClick={downloadPDF} disabled={dl}
                style={{background:`linear-gradient(135deg,${C.lavender},${C.pink})`,border:"none",color:C.navy,padding:"0.45rem 1.25rem",borderRadius:10,cursor:"pointer",fontSize:"0.82rem",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,opacity:dl?.6:1}}>
                {dl?"...":"⬇ PDF"}</button>
            </div>
          </div>

          <div className="fu" style={{animationDelay:".1s"}}>
            <div style={{fontSize:"0.62rem",fontWeight:800,letterSpacing:".25em",textTransform:"uppercase",color:C.lavender,marginBottom:"0.7rem",opacity:.85}}>Aptitude Report</div>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(2.4rem,6vw,3.8rem)",fontWeight:800,color:"white",lineHeight:1.05,marginBottom:"1rem"}}>{data.thinking_style_primary}</h1>
            {data.thinking_style_secondary&&(
              <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",borderRadius:999,padding:"0.4rem 1rem",backdropFilter:"blur(8px)",marginBottom:"1.25rem"}}>
                <span style={{fontSize:"0.62rem",fontWeight:800,color:C.lavender,letterSpacing:".12em",textTransform:"uppercase"}}>Also</span>
                <span style={{fontSize:"0.82rem",fontWeight:600,color:"white"}}>{data.thinking_style_secondary}</span>
              </div>
            )}
          </div>

          {careers.length>0&&(
            <div className="fu" style={{animationDelay:".28s",display:"flex",flexWrap:"wrap",gap:8,marginTop:"1rem"}}>
              {careers.slice(0,3).map((c,i)=>(
                <div key={i} style={{background:"rgba(255,255,255,.08)",border:`1px solid ${{0:C.lavender,1:C.pink,2:C.sky}[i]}44`,borderRadius:999,padding:"0.35rem 1rem",fontSize:"0.75rem",fontWeight:600,color:"rgba(255,255,255,.85)",display:"flex",alignItems:"center",gap:6}}>
                  <span style={{color:{0:C.lavender,1:C.pink,2:C.sky}[i]}}>{"⭐🌟✨"[i]}</span>
                  {c.name}<span style={{color:"rgba(255,255,255,.4)",fontSize:"0.68rem"}}>{c.score}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{maxWidth:820,margin:"0 auto",padding:"2rem 1.5rem 5rem"}}>

        {/* ── DIMENSION RINGS ── */}
        {Object.keys(dims).length>0&&(
          <div className="fu" style={{animationDelay:".1s",background:`linear-gradient(135deg,${C.white},${C.lilac}55)`,borderRadius:24,padding:"2rem",marginBottom:"1.25rem",border:`1.5px solid ${C.lavender}44`,boxShadow:"0 8px 40px rgba(139,92,246,.07)"}}>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.4rem",fontWeight:700,color:C.navy,marginBottom:4}}>📊 Dimension Profile</h2>
            <p style={{fontSize:"0.76rem",color:C.muted,marginBottom:"1.75rem"}}>How you score across 6 psychological dimensions</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:"1.75rem",justifyContent:"space-around"}}>
              {Object.entries(dims).map(([d,s],i)=><Ring key={d} score={s} color={DIM_COLOR[d]||"#8B5CF6"} label={d} delay={i*110} size={90} stroke={7}/>)}
            </div>
          </div>
        )}

        {/* ── DOMINANT TRAITS ── */}
        {traits.length>0&&(
          <div className="fu" style={{animationDelay:".18s",marginBottom:"1.25rem"}}>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.4rem",fontWeight:700,color:C.navy,marginBottom:"0.4rem"}}>⚡ Dominant Traits</h2>
            <p style={{fontSize:"0.76rem",color:C.muted,marginBottom:"1.1rem"}}>Your most defining characteristics</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:"0.8rem"}}>
              {traits.map(({label,score},i)=><TraitBar key={label} label={label} score={score} color={TRAIT_COLORS[i%6]} i={i}/>)}
            </div>
          </div>
        )}

        {/* ── WHO YOU ARE ── */}
        {whoCards.length>0&&SEC("🧠",C.grad1,<>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.4rem",fontWeight:700,color:C.navy,marginBottom:"1.1rem"}}>Who You Are</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:"0.85rem"}}>
            {whoCards.map((q,i)=>(
              <div key={i} style={{background:"rgba(255,255,255,.75)",borderRadius:16,padding:"1.25rem",border:"1px solid rgba(255,255,255,.9)",backdropFilter:"blur(8px)",position:"relative"}}>
                <div style={{fontSize:"1.8rem",position:"absolute",top:10,right:14,opacity:.2,fontFamily:"Georgia,serif",lineHeight:1}}>"</div>
                <p style={{fontSize:"0.83rem",color:C.navy,lineHeight:1.8,fontStyle:"italic",fontWeight:500}}>{q}</p>
              </div>
            ))}
          </div>
        </>)}

        {/* ── CAREER CARDS ── */}
        {careers.length>0&&(
          <div className="fu" style={{animationDelay:".28s",marginBottom:"1.25rem"}}>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.4rem",fontWeight:700,color:C.navy,marginBottom:"0.4rem"}}>🎯 Career Matches</h2>
            <p style={{fontSize:"0.76rem",color:C.muted,marginBottom:"1.1rem"}}>Ranked by compatibility with your profile</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:"1rem",marginBottom:"1rem"}}>
              {careers.map((c,i)=><CareerCard key={i} c={c} rank={i}/>)}
            </div>
            {moderate.length>0&&(
              <div style={{background:C.white,borderRadius:18,padding:"1.25rem",border:`1.5px solid ${C.lavender}33`}}>
                <div style={{fontSize:"0.65rem",fontWeight:800,letterSpacing:".15em",textTransform:"uppercase",color:C.muted,marginBottom:"0.85rem"}}>Also Consider</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:"0.55rem"}}>
                  {moderate.map((c,i)=>(
                    <div key={i} style={{background:C.lilac,borderRadius:999,padding:"0.32rem 0.85rem",fontSize:"0.74rem",fontWeight:600,color:C.navy}}>
                      {c.name}<span style={{color:C.muted,marginLeft:4}}>{c.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── WHAT'S HOLDING YOU BACK ── */}
        {(flags.length>0||holdCards.length>0)&&SEC("🔓",C.grad3,<>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.4rem",fontWeight:700,color:C.navy,marginBottom:supp.suppression_level!==undefined?"0.85rem":"1.1rem"}}>What's Holding You Back</h2>
          {supp.suppression_level!==undefined&&(
            <div style={{background:"rgba(255,255,255,.75)",borderRadius:14,padding:"1rem 1.25rem",marginBottom:"1rem",border:"1px solid rgba(255,255,255,.9)"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <span style={{fontWeight:700,fontSize:"0.82rem",color:C.navy}}>Suppression Level</span>
                <span style={{fontWeight:800,fontSize:"1rem",color:"#EC4899",fontFamily:"Georgia,serif"}}>{supp.suppression_level}/10</span>
              </div>
              <div style={{height:7,background:"#FBCFE855",borderRadius:999,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${supp.suppression_level*10}%`,background:"linear-gradient(90deg,#EC4899,#A855F7)",borderRadius:999,transition:"width 1.2s ease"}}/>
              </div>
            </div>
          )}
          {flags.length>0&&<div style={{display:"grid",gap:"0.7rem",marginBottom:"0.85rem"}}>{flags.map((f,i)=><FlagCard key={i} flag={f} i={i}/>)}</div>}
          {holdCards.length>0&&(
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:"0.75rem"}}>
              {holdCards.map((q,i)=>(
                <div key={i} style={{background:"rgba(255,255,255,.7)",borderRadius:14,padding:"1rem",border:"1px solid rgba(255,255,255,.9)"}}>
                  <p style={{fontSize:"0.8rem",color:C.navy,lineHeight:1.75,fontStyle:"italic"}}>{q}</p>
                </div>
              ))}
            </div>
          )}
        </>)}

        {/* ── WHAT YOU OFFER ── */}
        {worldCards.length>0&&(
          <div className="fu" style={{animationDelay:".32s",background:`linear-gradient(135deg,${C.navy},${C.navyMid})`,borderRadius:24,padding:"2rem",marginBottom:"1.25rem",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",inset:0,background:`radial-gradient(circle at 20% 50%,${C.lavender}15,transparent 50%),radial-gradient(circle at 80% 20%,${C.pink}12,transparent 45%)`,pointerEvents:"none"}}/>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.4rem",fontWeight:700,color:"white",marginBottom:"1.25rem",position:"relative"}}>🌍 What You Offer the World</h2>
            <div style={{display:"grid",gap:"0.85rem",position:"relative"}}>
              {worldCards.map((q,i)=>(
                <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                  <div style={{width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${C.lavender},${C.sky})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.75rem",flexShrink:0,marginTop:2}}>✦</div>
                  <p style={{fontSize:"0.86rem",color:"rgba(255,255,255,.85)",lineHeight:1.8,fontStyle:"italic",fontWeight:500}}>{q}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CAREER ROADMAP ── */}
        {roadSteps.length>0&&(
          <div className="fu" style={{animationDelay:".36s",marginBottom:"1.25rem"}}>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.4rem",fontWeight:700,color:C.navy,marginBottom:"0.4rem"}}>🗺️ Career Roadmap</h2>
            <p style={{fontSize:"0.76rem",color:C.muted,marginBottom:"1.1rem"}}>Step by step path to get there</p>
            <div style={{paddingLeft:"0.25rem"}}>
              {roadSteps.map((s,i)=><RoadStep key={i} step={s} i={i} total={roadSteps.length} color={TRAIT_COLORS[i%6]}/>)}
            </div>
          </div>
        )}

        {/* ── EDUCATION PATH ── */}
        {eduSteps.length>0&&SEC("🎓",C.grad2,<>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.4rem",fontWeight:700,color:C.navy,marginBottom:"1.1rem"}}>Educational Pathway</h2>
          <div style={{paddingLeft:"0.25rem"}}>
            {eduSteps.map((s,i)=><RoadStep key={i} step={s} i={i} total={eduSteps.length} color={["#EC4899","#A855F7","#6366F1","#0EA5E9","#10B981"][i%5]}/>)}
          </div>
        </>)}

        {/* ── CLOSING ── */}
        <div className="fu" style={{animationDelay:".44s",background:`linear-gradient(135deg,${C.navy},#3D2A8A)`,borderRadius:28,padding:"3rem 2rem",textAlign:"center",position:"relative",overflow:"hidden",boxShadow:"0 20px 60px rgba(26,26,94,.2)"}}>
          <div style={{position:"absolute",inset:0,background:`radial-gradient(circle at 25% 60%,${C.lavender}18,transparent 50%),radial-gradient(circle at 75% 25%,${C.pink}14,transparent 45%)`,pointerEvents:"none"}}/>
          <div style={{fontSize:"2.5rem",marginBottom:"1rem",animation:"bob 3s ease infinite",display:"block"}}>✨</div>
          <p style={{fontFamily:"'Playfair Display',serif",fontSize:"1.05rem",fontStyle:"italic",color:"rgba(255,255,255,.9)",lineHeight:1.9,maxWidth:"52ch",margin:"0 auto",position:"relative"}}>
            {closingLine||"Your potential is uniquely yours — trust the path ahead."}
          </p>
          <div style={{display:"flex",gap:10,justifyContent:"center",marginTop:"2rem",flexWrap:"wrap",position:"relative"}}>
            <button onClick={downloadPDF} disabled={dl}
              style={{background:`linear-gradient(135deg,${C.lavender},${C.pink})`,border:"none",color:C.navy,padding:"0.8rem 1.75rem",borderRadius:14,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:"0.9rem",opacity:dl?.6:1}}>
              {dl?"Generating...":"⬇ Download PDF"}</button>
            <button onClick={()=>router.push("/results")}
              style={{background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",color:"rgba(255,255,255,.8)",padding:"0.8rem 1.75rem",borderRadius:14,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:600,fontSize:"0.9rem"}}>
              ← Back</button>
          </div>
        </div>

      </div>
    </div>
  </>);
}