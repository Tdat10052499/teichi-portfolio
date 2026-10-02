"use client";
import { useState } from "react";
export default function ShardExperiment(){
 const [aligned,setAligned]=useState(false);
 return <div className="shard-experiment"><div className="v2-shards"><div><span>SHARD A</span><strong>v.02</strong><small>Updated</small></div><div className={aligned?'':'stale'}><span>SHARD B</span><strong>{aligned?'v.02':'v.01'}</strong><small>{aligned?'Aligned':'Older version'}</small></div><div><span>SHARD C</span><strong>v.02</strong><small>Updated</small></div></div><button className="exhibit-control" aria-pressed={aligned} onClick={()=>setAligned(v=>!v)}>{aligned?'Introduce version skew ↗':'Align the versions ↗'}</button><p aria-live="polite">{aligned?'Versions now match in this illustration. Matching versions alone does not prove a model is secure.':'All three shards can have signed updates while one still carries an older version.'}</p><small>Concept illustration · not experimental results</small></div>
}
