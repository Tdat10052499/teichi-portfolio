// Sprite coordinates are measured from the actual artwork, not an assumed grid.
const frames = {
  idle:[[79,15,179,297],[343,17,179,295],[610,17,177,295],[873,16,179,296]],
  happy:[[75,324,181,282],[346,325,181,278],[610,325,180,277],[875,325,182,281]],
  thinking:[[75,619,174,283],[348,615,175,287],[611,619,176,283],[868,619,188,283]],
  sleepy:[[71,916,176,238],[336,921,177,231],[607,929,191,223],[876,936,180,216]],
  coding:[[85,1163,168,228],[341,1163,178,230],[610,1163,176,230],[881,1163,171,230]],
};
const descriptions={idle:'Mây is looking around.',happy:'Mây smiles with closed eyes and celebrates.',thinking:'Mây rests a hand on his chin and thinks.',sleepy:'Mây closes his eyes and nods off.',coding:'Mây sits cross-legged and types on his laptop.'};
const messages={auto:'I’ll keep you company.',happy:'A little joy goes a long way!',thinking:'Hmm… let’s think this through.',sleepy:'Just resting my eyes…',coding:'One idea. One line at a time.'};
export async function initPixelMay({host,getMotion,getChapter,say}) {
  const atlas=new Image();atlas.src=new URL('./assets/may-sprite.png',import.meta.url).href;await atlas.decode();
  const canvas=document.createElement('canvas');canvas.className='may-pixel-canvas';canvas.setAttribute('aria-hidden','true');
  const context=canvas.getContext('2d',{alpha:true});host.replaceChildren(canvas);host.dataset.ready='true';host.dataset.renderer='2d';
  let width=0,height=0,mode='auto',current='',changedAt=performance.now(),lastInput=performance.now(),transientUntil=0,hoverContext=null;
  let reactionMood='idle',reactionUntil=0;
  let frame=-1,lastPaint='',pointerX=0,look=0;
  const controls=[...document.querySelectorAll('[data-may-mode]')],select=document.querySelector('#may-mode-select');
  const resize=()=>{width=host.clientWidth;height=host.clientHeight;const ratio=Math.min(devicePixelRatio,2);canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);context.setTransform(ratio,0,0,ratio,0,0);context.imageSmoothingEnabled=false;lastPaint='';};
  const observer=new ResizeObserver(resize);observer.observe(host);resize();
  function choose(value){if(value!=='auto'&&!frames[value])return;mode=value;transientUntil=0;lastInput=performance.now();changedAt=performance.now();lastPaint='';controls.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mayMode===mode)));select.value=mode;say(messages[value]);}
  controls.forEach(button=>button.addEventListener('click',()=>choose(button.dataset.mayMode)));select.addEventListener('change',()=>choose(select.value));
  const wake=()=>{lastInput=performance.now();};
  window.addEventListener('pointermove',e=>{wake();pointerX=e.clientX/innerWidth*2-1;},{passive:true});
  window.addEventListener('pointerdown',wake,{passive:true});window.addEventListener('keydown',wake);window.addEventListener('scroll',wake,{passive:true});
  function greet(){transientUntil=performance.now()+2500;say('Xin chào! That made my day.');}
  host.addEventListener('click',greet);host.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();greet();}});
  for(const [selector,name] of [['.project','coding'],['.paper-wrap','thinking'],['.hack-pass','coding']]){
    document.querySelectorAll(selector).forEach(el=>{el.addEventListener('pointerenter',()=>hoverContext=name);el.addEventListener('pointerleave',()=>hoverContext=null);el.addEventListener('focusin',()=>hoverContext=name);el.addEventListener('focusout',()=>hoverContext=null);});
  }
  function resolve(now){if(now<reactionUntil)return reactionMood;if(now<transientUntil)return 'happy';if(mode!=='auto')return mode;if(now-lastInput>=12000)return 'sleepy';if(document.activeElement?.matches('input,textarea'))return 'coding';if(hoverContext)return hoverContext;const chapter=getChapter();if(chapter==='research')return 'thinking';if(chapter==='work'||chapter==='hackathon')return 'coding';return 'idle';}
  function frameAt(name,age,motion){if(!motion)return 0;if(name==='idle'){const p=age%4300;return p<3400?0:p<3730?1:p<3880?2:3;}const sequence=name==='thinking'?[0,0,1,1,2,2,3,3]:name==='sleepy'?[0,0,1,2,2,3,2,1]:[0,1,2,3];const fps=name==='happy'?7:name==='coding'?6:3;return sequence[Math.floor(age/1000*fps)%sequence.length];}
  return {react(mood,message,duration=4000){if(!frames[mood])return;reactionMood=mood;reactionUntil=performance.now()+duration;say(message);},update(){
    const now=performance.now(),next=resolve(now),motion=getMotion();
    if(next!==current){current=next;changedAt=now;host.dataset.mood=current;host.setAttribute('aria-label',descriptions[current]+' Tap or press Enter to greet him.');}
    frame=frameAt(current,now-changedAt,motion);host.dataset.frame=String(frame);host.dataset.mode=mode;
    look=motion?look+(pointerX*5-look)*.09:0;
    const [sx,sy,sw,sh]=frames[current][frame];const scale=Math.min(width*.58/195,height*.72/297);
    const dx=Math.round((width-sw*scale)/2+look),baseline=Math.round(height*.83);
    const bounce=motion&&current==='happy'?[0,3,6,1][frame]*scale:0;
    const dy=Math.round(baseline-sh*scale-bounce),key=[current,frame,dx,dy,width,height,motion].join(':');
    if(key===lastPaint)return;lastPaint=key;context.clearRect(0,0,width,height);context.imageSmoothingEnabled=false;
    context.drawImage(atlas,sx,sy,sw,sh,dx,dy,Math.round(sw*scale),Math.round(sh*scale));
  }};
}
