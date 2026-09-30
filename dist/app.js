import { initPixelMay } from './may-pixel.js';
import { initHeroField } from './hero-field.js';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)'), fine=matchMedia('(pointer:fine)');
let motion=!reduced.matches,lenis=null,motionContext=null,may=null;
const state={x:0,y:0,px:innerWidth/2,py:innerHeight/2,velocity:0,chapter:'home',wave:0,spin:0,rotation:0,tap:0,dragging:false,docked:false};
const speech=$('.speech');let speechTimer;
function say(text){speech.textContent=text;clearTimeout(speechTimer);speechTimer=setTimeout(()=>speech.textContent=state.docked?'Still here. Still curious.':'Xin chào! I’m Mây. Tap to say hello.',4600);}
const studies=[
{title:'N.E.D Wallet',type:'01 / UNIHACKFEST 2026 · PROJECT OWNER',intro:'Hold dollars. Explore tokenized stocks.',challenge:'N.E.D Wallet brings a focused financial product idea into UniHackfest 2026: a single wallet experience for holding dollars and investing in US stocks.',approach:'As project owner, I explore a USDC-first Solana wallet experience. The source includes Devnet transfer flows and simulated xStocks trading. Read the full case study for the design system, current implementation status, and a sample buy/sell walkthrough.',stack:['Expo / React Native','Solana','Dynamic','In development'],note:'Hackathon project · Product availability and investment services are not offered by this portfolio.'},
{title:'Origin Collective',type:'02 / CONCEPT · DIGITAL OWNERSHIP',intro:'An expressive home for independent digital creators.',challenge:'Collecting digital work should preserve the artist’s story while making provenance and ownership clear. Origin explores that balance through an editorial marketplace concept.',approach:'Collection pages put the work first, then reveal edition details and ownership history. Considered motion connects browsing, inspecting, and collecting. Wallet states remain legible throughout the experience.',stack:['React','Three.js','GSAP','ERC-721'],note:'Concept project · Illustrative portfolio case study'},
{title:'Relay Network',type:'03 / CONCEPT · DEVELOPER EXPERIENCE',intro:'Complex infrastructure, a clearer interface.',challenge:'Cross-chain actions involve multiple networks and asynchronous steps. Relay explores how to make those transitions understandable without burying users in implementation details.',approach:'A unified transaction timeline shows source confirmation, relay progress, and destination settlement. Network selection is explicit, and recoverable errors offer a clear next action.',stack:['TypeScript','EVM','React','Event indexing'],note:'Concept project · Illustrative portfolio case study'}];
function openDialog(d){d.showModal();lenis?.stop();}
$$('[data-project]').forEach(el=>el.addEventListener('click',()=>{const p=studies[+el.dataset.project];$('#ned-case-link').hidden=el.dataset.project!=='0';$('#case-title').textContent=p.title;$('#case-type').textContent=p.type;$('#case-intro').textContent=p.intro;$('#case-challenge').textContent=p.challenge;$('#case-approach').textContent=p.approach;$('#case-dialog .case-note').textContent=p.note;$('#case-stack').replaceChildren(...p.stack.map(s=>Object.assign(document.createElement('span'),{textContent:s})));openDialog($('#case-dialog'));}));
$$('dialog').forEach(d=>{d.setAttribute('data-lenis-prevent','');d.querySelector('.close').addEventListener('click',()=>d.close());d.addEventListener('close',()=>{lenis?.start();});d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();});});
$('#contact-button').addEventListener('click',()=>openDialog($('#contact-dialog')));
$('#contact-form').addEventListener('submit',e=>{e.preventDefault();location.href='mailto:'+encodeURIComponent($('#email').value)+'?subject='+encodeURIComponent('Let’s build something together')+'&body='+encodeURIComponent($('#brief').value);});
function setupMotion(){
 motionContext?.revert();motionContext=null;lenis?.destroy();lenis=null;
 document.body.classList.toggle('motion-off',!motion);$('.motion-toggle').textContent=motion?'Motion on':'Motion off';$('.motion-toggle').setAttribute('aria-pressed',String(!motion));
 if(!motion){$$('[data-tilt],.project-art,.primary,nav a,.wordmark').forEach(e=>gsap.set(e,{clearProps:'transform'}));return;}
 if(window.Lenis){lenis=new Lenis({lerp:.085,smoothWheel:true,syncTouch:false,anchors:false,prevent:n=>n.closest('dialog')});lenis.on('scroll',e=>{state.velocity=e.velocity;window.ScrollTrigger?.update();});}
 if(window.gsap&&window.ScrollTrigger){gsap.registerPlugin(ScrollTrigger);motionContext=gsap.context(()=>{
  gsap.from('.hero-copy>*',{y:26,opacity:0,stagger:.1,duration:.85,ease:'power3.out',clearProps:'transform,opacity'});
  $$('.section').forEach(section=>{
   const title=section.querySelector('h2');if(title)gsap.from(title,{y:65,opacity:.25,duration:1,ease:'none',scrollTrigger:{trigger:section,start:'top 88%',end:'top 35%',scrub:.7}});
   gsap.from(section.querySelectorAll('.section-heading>p,.research-copy,.hack-details,.about-grid>div,.services>div'),{y:35,opacity:0,stagger:.12,duration:.9,ease:'power2.out',scrollTrigger:{trigger:section,start:'top 78%',once:true}});
  });
  $$('.project').forEach(el=>gsap.from(el,{y:65,opacity:.25,ease:'none',scrollTrigger:{trigger:el,start:'top 98%',end:'top 60%',scrub:.6}}));
  gsap.fromTo('.paper',{rotation:-7,y:45},{rotation:2,y:-25,ease:'none',scrollTrigger:{trigger:'.research',start:'top bottom',end:'bottom top',scrub:1}});
  gsap.fromTo('.hack-pass',{rotation:6,y:40},{rotation:-3,y:-25,ease:'none',scrollTrigger:{trigger:'.hackathon',start:'top bottom',end:'bottom top',scrub:1}});
  gsap.to('.contact-star',{rotation:100,ease:'none',scrollTrigger:{trigger:'.contact',start:'top bottom',end:'bottom top',scrub:1}});
 });ScrollTrigger.refresh();}
}
$('.motion-toggle').addEventListener('click',()=>{motion=!motion;setupMotion();});reduced.addEventListener('change',e=>{motion=!e.matches;setupMotion();});
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const target=$(a.getAttribute('href'));if(!target)return;e.preventDefault();if(lenis&&motion)lenis.scrollTo(target,{offset:-35,duration:1.35});else target.scrollIntoView({behavior:'instant'});history.replaceState(null,'',a.getAttribute('href'));}));
// Keep the system cursor; only components declare their own cursor shape.
window.addEventListener('pointermove',e=>{
 state.px=e.clientX;state.py=e.clientY;state.x=e.clientX/innerWidth*2-1;state.y=-(e.clientY/innerHeight*2-1);
 $('#coord-x').textContent=state.x.toFixed(2);$('#coord-y').textContent=state.y.toFixed(2);
 if(motion&&fine.matches){const section=e.target.closest('.work,.about,.contact');if(section){const r=section.getBoundingClientRect();section.style.setProperty('--field-x',e.clientX-r.left+'px');section.style.setProperty('--field-y',e.clientY-r.top+'px');}}
},{passive:true});
$$('.primary,header .wordmark,nav a').forEach(el=>{el.addEventListener('pointermove',e=>{if(!motion||!fine.matches)return;const r=el.getBoundingClientRect();gsap.to(el,{x:(e.clientX-r.left-r.width/2)*.12,y:(e.clientY-r.top-r.height/2)*.18,duration:.35,ease:'power2.out'});});el.addEventListener('pointerleave',()=>gsap.to(el,{x:0,y:0,duration:.6,ease:'elastic.out(1,.45)'}));});
$$('.project,[data-tilt]').forEach(el=>{const art=el.querySelector('.project-art')||el;el.addEventListener('pointermove',e=>{if(!motion||!fine.matches)return;const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;art.style.setProperty('--pointer-x',x*100+'%');art.style.setProperty('--pointer-y',y*100+'%');gsap.to(art,{rotationY:(x-.5)*8,rotationX:-(y-.5)*7,transformPerspective:1000,duration:.45,ease:'power2.out'});});el.addEventListener('pointerleave',()=>gsap.to(art,{rotationX:0,rotationY:0,duration:.8,ease:'power3.out'}));});
$$('.project').forEach((p,i)=>p.addEventListener('pointerenter',()=>say(['N.E.D Wallet. Built at UniHackfest.','Ideas deserve a little ownership.','Connecting the dots. And the chains.'][i])));
const sections=$$('main>section'),chapterObserver=new IntersectionObserver(entries=>{entries.forEach(e=>{if(!e.isIntersecting)return;state.chapter=e.target.id;$$('.chapter-nav a').forEach(a=>a.classList.toggle('active',a.hash==='#'+state.chapter));if(state.docked){const msg={research:'A signature is only part of the story.',hackathon:'UniHackfest 2026. Let’s build!',about:'The human behind the code.',contact:'Your next idea starts here.',work:'Come explore the work.'};if(msg[state.chapter])say(msg[state.chapter]);}});},{rootMargin:'-25% 0px -50% 0px'});sections.forEach(s=>chapterObserver.observe(s));
function dockMay(docked){if(docked===state.docked)return;state.docked=docked;const shell=$('#mascot-shell');gsap.killTweensOf(shell);gsap.set(shell,{clearProps:'transform'});const before=shell.getBoundingClientRect();shell.classList.toggle('docked',docked);(docked?document.body:document.querySelector(".mascot-stage")).appendChild(shell);const after=shell.getBoundingClientRect();if(motion)gsap.fromTo(shell,{x:before.left-after.left,y:before.top-after.top,scaleX:before.width/after.width,scaleY:before.height/after.height,transformOrigin:'top left'},{x:0,y:0,scaleX:1,scaleY:1,duration:.85,ease:'power3.inOut',onComplete:()=>gsap.set(shell,{clearProps:'transform,transformOrigin'})});}
let scrollQueued=false;function onScroll(){if(scrollQueued)return;scrollQueued=true;requestAnimationFrame(()=>{scrollQueued=false;const total=document.documentElement.scrollHeight-innerHeight;$('.progress').style.width=(total>0?scrollY/total*100:0)+'%';dockMay($('.hero').getBoundingClientRect().bottom<140);});}window.addEventListener('scroll',onScroll,{passive:true});
const heroField=initHeroField($('.hero'),$('.hero-field'));
let previous=0,elapsed=0;
function tick(now){requestAnimationFrame(tick);const dt=Math.min((now-previous)/1000,.035);previous=now;if(document.hidden)return;lenis?.raf(now);if(motion)elapsed+=dt;
 heroField.update(dt,motion);may?.update(elapsed,dt);state.velocity*=.96;
}requestAnimationFrame(tick);
// Pixel companion: hand-drawn frames, no WebGL dependency.
setupMotion();onScroll();
initPixelMay({host:$('#mascot'),getMotion:()=>motion,getChapter:()=>state.chapter,say}).then(companion=>{may=companion;}).catch(error=>{console.error('Mây sprite:',error);$('#mascot').innerHTML='<p class="model-error">Mây couldn’t load. Please refresh to try again.</p>';speech.textContent='The portfolio is ready to explore.';});
