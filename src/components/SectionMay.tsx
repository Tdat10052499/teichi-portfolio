"use client";
import { useEffect, useRef, useState } from "react";
import { useMotion } from "./MotionProvider";

const frames = {
  idle: [[79,15,179,297],[343,17,179,295],[610,17,177,295],[873,16,179,296]],
  happy: [[75,324,181,282],[346,325,181,278],[610,325,180,277],[875,325,182,281]],
  thinking: [[75,619,174,283],[348,615,175,287],[611,619,176,283],[868,619,188,283]],
  sleepy: [[71,916,176,238],[336,921,177,231],[607,929,191,223],[876,936,180,216]],
  coding: [[85,1163,168,228],[341,1163,178,230],[610,1163,176,230],[881,1163,171,230]],
};
type Mood = keyof typeof frames;
type Place = "hero" | "products" | "research" | "about" | "contact" | "demo";
const scenes: Record<Place,{mood:Mood;label:string;hint:string;reply:string;gesture:string}> = {
  demo:{mood:"coding",label:"Say hello to your prototype guide",hint:"Choose an asset. This is a sample wallet.",reply:"Xin chào! Every action here changes sample data only.",gesture:"greet"},
  hero:{mood:"idle",label:"Say hello to Mây",hint:"A little curiosity. A little company. Tap to say hello.",reply:"Xin chào! Products or research — where shall we start?",gesture:"greet"},
  products:{mood:"coding",label:"Celebrate the prototype with Mây",hint:"I’m trying the prototype. Change a screen above and I’ll follow along.",reply:"One idea, one small step. Ready to try the sample demo?",gesture:"hop"},
  research:{mood:"thinking",label:"Ask Mây about the research question",hint:"A valid signature and a current version are two different questions. Ask me why.",reply:"A signature helps check authenticity. Version consistency asks whether the shards are up to date together. This is a concept explanation, not a research result.",gesture:"ponder"},
  about:{mood:"idle",label:"Take a stretch break with Mây",hint:"Building, learning, then a little break. Tap for a stretch.",reply:"A small stretch, then back to being curious!",gesture:"stretch"},
  contact:{mood:"happy",label:"High five Mây",hint:"Thanks for exploring. A high five before you go?",reply:"High five! See you around the next idea.",gesture:"highfive"},
};
let atlasPromise: Promise<HTMLImageElement> | undefined;
function getAtlas() {
  return atlasPromise ??= new Promise((resolve,reject) => {
    const image = new window.Image();
    image.onload=()=>resolve(image); image.onerror=()=>{atlasPromise=undefined;reject(new Error("Sprite unavailable"));};
    image.src=`${process.env.NODE_ENV === "production" ? "/teichi-portfolio" : ""}/assets/may-sprite.png`;
  });
}

export default function SectionMay({place,preview,mood,message}:{place:Place;preview?:string;mood?:Mood;message?:string}) {
  const {motion}=useMotion();
  const scene={...scenes[place],mood:mood??scenes[place].mood};
  const canvas=useRef<HTMLCanvasElement>(null);
  const button=useRef<HTMLButtonElement>(null);
  const [greeted,setGreeted]=useState(false);
  const [ready,setReady]=useState(false);
  const [failed,setFailed]=useState(false);
  const [gesture,setGesture]=useState(0);
  const activity=useRef({x:0,y:0,last:0,until:0});
  const lastPreview=useRef(preview);

  useEffect(()=>{
    let disposed=false,raf=0,visible=false;
    const el=canvas.current,host=button.current;
    if(!el||!host)return;
    const ctx=el.getContext("2d"); if(!ctx)return;
    if(lastPreview.current!==preview){activity.current.until=performance.now()+1800;lastPreview.current=preview;}
    let image:HTMLImageElement|undefined,w=0,h=0,lastPaint="";
    const resize=()=>{w=host.clientWidth;h=host.clientHeight;const dpr=Math.min(devicePixelRatio,2);el.width=w*dpr;el.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.imageSmoothingEnabled=false;lastPaint="";};
    const draw=(now:number)=>{
      raf=0;if(disposed||!visible||document.hidden||!image)return;
      let mood:Mood=scene.mood;
      if(now<activity.current.until)mood=place==="research"?"thinking":"happy";
      else if(place==="hero"&&activity.current.last&&now-activity.current.last>15000)mood="sleepy";
      const frame=motion?Math.floor(now/(mood==="happy"?150:mood==="coding"?200:650))%4:0;
      const [sx,sy,sw,sh]=frames[mood][frame];
      const scale=Math.min(w*.84/195,h*.84/297);
      const look=motion?activity.current.x*3:0;
      const lift=motion&&now<activity.current.until&&place!=="research"?Math.sin(now/140)*3:0;
      const x=Math.round((w-sw*scale)/2+look),y=Math.round(h*.92-sh*scale-lift);
      const key=[mood,frame,x,y,w,h].join(":");
      if(key!==lastPaint){ctx.clearRect(0,0,w,h);ctx.drawImage(image,sx,sy,sw,sh,x,y,Math.round(sw*scale),Math.round(sh*scale));lastPaint=key;host.dataset.mood=mood;host.dataset.frame=String(frame);}
      if(motion)raf=requestAnimationFrame(draw);
    };
    const start=()=>{cancelAnimationFrame(raf);if(visible&&!document.hidden)raf=requestAnimationFrame(draw);};
    const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;host.dataset.inView=String(visible);start();},{threshold:.05});observer.observe(host);
    const size=new ResizeObserver(()=>{resize();start();});size.observe(host);
    document.addEventListener("visibilitychange",start);
    getAtlas().then(value=>{if(disposed)return;image=value;resize();setReady(true);activity.current.last=performance.now();start();}).catch(()=>{if(!disposed)setFailed(true);});
    return()=>{disposed=true;cancelAnimationFrame(raf);observer.disconnect();size.disconnect();document.removeEventListener("visibilitychange",start);};
  },[motion,place,scene.mood,gesture,preview]);

  const activate=()=>{activity.current.until=performance.now()+2200;activity.current.last=performance.now();setGreeted(!greeted);setGesture(n=>n+1);};
  return <div className={`section-may may-at-${place}`} data-may-place={place}>
    <button ref={button} type="button" className="section-may-character" aria-label={scene.label} aria-describedby={`may-note-${place}`} data-ready={ready} onClick={activate} onPointerMove={e=>{const rect=e.currentTarget.getBoundingClientRect();activity.current.x=(e.clientX-rect.left)/rect.width*2-1;activity.current.last=performance.now();}} onPointerLeave={()=>{activity.current.x=0;}}>
      <span className="may-ground" aria-hidden="true" />
      <span key={gesture} className={`may-gesture ${gesture?`gesture-${scene.gesture}`:""}`}><canvas ref={canvas} aria-hidden="true" />{failed&&<span className="may-fallback">☁</span>}</span>
      <span className="may-spark" aria-hidden="true">{place==="research"?"?":place==="products"?"{ }":"✧"}</span>
    </button>
    <div className="section-may-note"><span className="section-may-label">MÂY / {place==="products"?"BUILDING":place==="research"?"WONDERING":place==="about"?"RECHARGING":place==="contact"?"SEE YOU SOON":"YOUR COMPANION"}</span><p id={`may-note-${place}`} aria-live="polite">{greeted?scene.reply:message?message:preview?`Now exploring ${preview}. These are sample screens — try switching the preview.`:scene.hint}</p><span className="may-action-hint">{place==="research"?"Tap to think together":"Tap Mây to interact"} ↗</span></div>
  </div>;
}
