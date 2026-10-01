"use client";

/** Original vector models: projected geometry, no copied reference-site assets. */
export default function NedModuleModel({index}:{index:number}) {
  return <svg className={`ned-module-model model-${index}`} viewBox="0 0 220 200" fill="none" aria-hidden="true">
    <path className="model-ground" d="M20 148 110 100 200 148 110 196Z M50 132 140 180 M80 116 170 164 M50 164 140 116 M80 180 170 132" />
    {index===0 && <g className="model-object">{[0,1,2].map(n=><g key={n} className={`model-layer layer-${n}`} transform={`translate(0 ${n*29})`}><path className="model-face" d="M43 61 110 25 177 61 110 98Z"/><path d="M43 61v10l67 37 67-37V61 M110 98v10"/><path className="model-detail" d="m64 61 46-24 45 24-45 24Z M83 61l27-14 26 14-26 14Z"/></g>)}</g>}
    {index===1 && <g className="model-object"><path className="model-shell" d="M45 61 110 26 175 61v76l-65 36-65-36Z M45 61l65 36 65-36 M110 97v76"/><g className="model-core"><path className="model-face" d="m82 86 28-16 28 16v33l-28 16-28-16Z"/><path d="m82 86 28 16 28-16 M110 102v33"/></g><g className="model-layer layer-0"><path className="model-face" d="m36 48 74-39 74 39-74 40Z"/><path d="M36 48v7l74 40 74-40v-7"/><path className="model-detail" d="M102 42a8 8 0 1 1 12 7l-2 12-9-4 2-11"/></g><path className="model-detail" strokeDasharray="3 5" d="M45 67v66 M175 67v66 M110 101v66"/></g>}
    {index===2 && <g className="model-object"><ellipse className="model-shell" cx="110" cy="100" rx="80" ry="38" transform="rotate(-30 110 100)"/><ellipse className="model-shell" cx="110" cy="100" rx="80" ry="38" transform="rotate(30 110 100)"/><ellipse className="model-detail" cx="110" cy="100" rx="32" ry="76"/><g className="model-core"><path className="model-face" d="m87 88 23-13 23 13v26l-23 13-23-13Z"/><path d="m87 88 23 13 23-13 M110 101v26"/></g><g className="model-satellites"><circle cx="45" cy="73" r="5"/><circle cx="175" cy="126" r="5"/><circle cx="110" cy="24" r="5"/></g></g>}
    {index===3 && <g className="model-object">{[0,1,2].map(row=>[0,1,2].map(col=>{const x=58+col*30-row*14,y=64+row*25+col*16;return <g className={`model-cell cell-${row+col}`} key={`${row}-${col}`} transform={`translate(${x} ${y})`}><path className="model-face" d="m0 0 27-15L54 0 27 15Z"/><path d="M0 0v29l27 15 27-15V0 M27 15v29"/></g>}))}</g>}
    <path className="model-crosshair" d="M12 20h10 M17 15v10 M198 175h10 M203 170v10"/>
  </svg>;
}
