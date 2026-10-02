"use client";
import { useState, type CSSProperties } from "react";
const modes = [
  {name:"Products",value:0,note:"Bring the parts together. Make the next action clear."},
  {name:"Systems",value:50,note:"Separate the layers. Explore what connects them."},
  {name:"Research",value:100,note:"Change the perspective. Ask what the structure leaves unresolved."},
];
export default function IdeaSculpture(){
 const [value,setValue]=useState(50);
 const mode=value<33?0:value<67?1:2;
 return <div className="idea-exhibit">
  <div className="idea-scene" aria-hidden="true" style={{'--open':value/100,'--turn':`${-28+value*.55}deg`} as CSSProperties}>
   <div className="idea-floor"/><div className="idea-object">{Array.from({length:9},(_,i)=><span key={i} className="idea-slice" style={{'--i':i-4} as CSSProperties}><i/><b/></span>)}</div>
   <span className="idea-coordinate">TEICHI / FORM STUDY 001</span><span className="idea-coordinate right">{String(value).padStart(3,'0')} / 100</span>
  </div>
  <div className="idea-controls"><div className="idea-controls-heading"><label htmlFor="idea-shape">Change the perspective</label><span>↔</span></div><div role="group" aria-label="Sculpture perspectives">{modes.map((item,i)=><button key={item.name} aria-pressed={mode===i} onClick={()=>setValue(item.value)}><small>0{i+1}</small> {item.name}</button>)}</div><input id="idea-shape" type="range" min="0" max="100" value={value} aria-valuetext={`${modes[mode].name}, ${value} percent expanded`} onChange={e=>setValue(Number(e.target.value))}/><p aria-live="polite">{modes[mode].note}</p><span className="idea-help">Drag the slider · or use arrow keys</span></div>
 </div>
}
