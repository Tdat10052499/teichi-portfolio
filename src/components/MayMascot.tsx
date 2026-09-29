"use client";

import React, { useEffect, useRef, useState } from "react";
import { useMotion } from "./MotionProvider";
import { gsap } from "gsap";

const frames = {
  idle: [[79, 15, 179, 297], [343, 17, 179, 295], [610, 17, 177, 295], [873, 16, 179, 296]],
  happy: [[75, 324, 181, 282], [346, 325, 181, 278], [610, 325, 180, 277], [875, 325, 182, 281]],
  thinking: [[75, 619, 174, 283], [348, 615, 175, 287], [611, 619, 176, 283], [868, 619, 188, 283]],
  sleepy: [[71, 916, 176, 238], [336, 921, 177, 231], [607, 929, 191, 223], [876, 936, 180, 216]],
  coding: [[85, 1163, 168, 228], [341, 1163, 178, 230], [610, 1163, 176, 230], [881, 1163, 171, 230]],
};

const descriptions = {
  idle: "Mây is looking around.",
  happy: "Mây smiles with closed eyes and celebrates.",
  thinking: "Mây rests a hand on his chin and thinks.",
  sleepy: "Mây closes his eyes and nods off.",
  coding: "Mây sits cross-legged and types on his laptop.",
};

const messages = {
  auto: "I’ll keep you company.",
  happy: "A little joy goes a long way!",
  thinking: "Hmm… let’s think this through.",
  sleepy: "Just resting my eyes…",
  coding: "One idea. One line at a time.",
};

export default function MayMascot() {
  const { motion, chapter } = useMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  
  const [speechText, setSpeechText] = useState("Xin chào! I’m Mây. Tap to say hello.");
  const [mode, setMode] = useState("auto");
  const [docked, setDocked] = useState(false);
  const [mood, setMood] = useState("idle");
  const speechTimeoutRef = useRef<NodeJS.Timeout>(null);

  // Animation refs to avoid frequent state updates causing re-renders
  const animState = useRef({
    width: 0,
    height: 0,
    current: "",
    changedAt: performance.now(),
    lastInput: performance.now(),
    transientUntil: 0,
    hoverContext: null as string | null,
    frame: -1,
    lastPaint: "",
    pointerX: 0,
    look: 0,
    elapsed: 0,
  });

  const say = (text: string) => {
    setSpeechText(text);
    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    speechTimeoutRef.current = setTimeout(() => {
      setSpeechText(animState.current.current === "sleepy" ? "Just resting my eyes…" : (docked ? "Still here. Still curious." : "Xin chào! I’m Mây. Tap to say hello."));
    }, 4600);
  };

  useEffect(() => {
    // Docking logic
    const handleScroll = () => {
      const hero = document.querySelector(".hero");
      if (!hero) return;
      const isDocked = hero.getBoundingClientRect().bottom < 140;
      
      if (isDocked !== docked) {
        setDocked(isDocked);
        const shell = shellRef.current;
        if (!shell) return;
        
        gsap.killTweensOf(shell);
        gsap.set(shell, { clearProps: "transform" });
        const before = shell.getBoundingClientRect();
        
        // Temporarily apply/remove classes to calculate after rect
        shell.classList.toggle("docked", isDocked);
        const parent = isDocked ? document.body : document.querySelector(".mascot-stage");
        if (parent) parent.appendChild(shell);
        
        const after = shell.getBoundingClientRect();
        
        if (motion) {
          gsap.fromTo(
            shell,
            { x: before.left - after.left, y: before.top - after.top, scaleX: before.width / after.width, scaleY: before.height / after.height, transformOrigin: "top left" },
            { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.85, ease: "power3.inOut", onComplete: () => gsap.set(shell, { clearProps: "transform,transformOrigin" }) }
          );
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [docked, motion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const basePath = process.env.NODE_ENV === 'production' ? '/teichi-portfolio' : '';
    const atlas = new Image();
    atlas.src = `${basePath}/assets/may-sprite.png`;
    let animationFrameId: number;
    let previous = performance.now();

    const resize = () => {
      if (!containerRef.current) return;
      animState.current.width = containerRef.current.clientWidth;
      animState.current.height = containerRef.current.clientHeight;
      const ratio = Math.min(window.devicePixelRatio, 2);
      canvas.width = Math.round(animState.current.width * ratio);
      canvas.height = Math.round(animState.current.height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.imageSmoothingEnabled = false;
      animState.current.lastPaint = "";
    };

    const observer = new ResizeObserver(resize);
    observer.observe(containerRef.current!);
    
    atlas.onload = () => {
      resize();
      const tick = (now: number) => {
        animationFrameId = requestAnimationFrame(tick);
        const dt = Math.min((now - previous) / 1000, 0.035);
        previous = now;
        
        if (document.hidden) return;
        if (motion) animState.current.elapsed += dt;

        update(now);
      };
      animationFrameId = requestAnimationFrame(tick);
    };

    const resolve = (now: number) => {
      if (now < animState.current.transientUntil) return "happy";
      if (mode !== "auto") return mode;
      if (now - animState.current.lastInput >= 12000) return "sleepy";
      if (document.activeElement?.matches("input,textarea")) return "coding";
      if (animState.current.hoverContext) return animState.current.hoverContext;
      
      if (chapter === "research") return "thinking";
      if (chapter === "work" || chapter === "hackathon") return "coding";
      return "idle";
    };

    const frameAt = (name: string, age: number) => {
      if (!motion) return 0;
      if (name === "idle") {
        const p = age % 4300;
        return p < 3400 ? 0 : p < 3730 ? 1 : p < 3880 ? 2 : 3;
      }
      const sequence = name === "thinking" ? [0, 0, 1, 1, 2, 2, 3, 3] : name === "sleepy" ? [0, 0, 1, 2, 2, 3, 2, 1] : [0, 1, 2, 3];
      const fps = name === "happy" ? 7 : name === "coding" ? 6 : 3;
      return sequence[Math.floor((age / 1000) * fps) % sequence.length];
    };

    const update = (now: number) => {
      const next = resolve(now);
      
      if (next !== animState.current.current) {
        animState.current.current = next;
        animState.current.changedAt = now;
        setMood(next);
      }
      
      const frameIndex = frameAt(animState.current.current, now - animState.current.changedAt);
      animState.current.frame = frameIndex;
      
      animState.current.look = motion ? animState.current.look + (animState.current.pointerX * 5 - animState.current.look) * 0.09 : 0;
      
      const frameData = (frames as any)[animState.current.current][frameIndex];
      if (!frameData) return;
      
      const [sx, sy, sw, sh] = frameData;
      const { width, height, look } = animState.current;
      const scale = Math.min((width * 0.58) / 195, (height * 0.72) / 297);
      
      const dx = Math.round((width - sw * scale) / 2 + look);
      const baseline = Math.round(height * 0.83);
      const bounce = motion && animState.current.current === "happy" ? [0, 3, 6, 1][frameIndex] * scale : 0;
      const dy = Math.round(baseline - sh * scale - bounce);
      
      const key = `${animState.current.current}:${frameIndex}:${dx}:${dy}:${width}:${height}:${motion}`;
      if (key === animState.current.lastPaint) return;
      animState.current.lastPaint = key;
      
      context.clearRect(0, 0, width, height);
      context.imageSmoothingEnabled = false;
      context.drawImage(atlas, sx, sy, sw, sh, dx, dy, Math.round(sw * scale), Math.round(sh * scale));
    };

    const wake = () => { animState.current.lastInput = performance.now(); };
    const handlePointerMove = (e: PointerEvent) => { wake(); animState.current.pointerX = (e.clientX / window.innerWidth) * 2 - 1; };
    
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", wake, { passive: true });
    window.addEventListener("keydown", wake);
    window.addEventListener("scroll", wake, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", wake);
      window.removeEventListener("keydown", wake);
      window.removeEventListener("scroll", wake);
    };
  }, [motion, chapter, mode]);

  const handleChoose = (value: string) => {
    setMode(value);
    animState.current.transientUntil = 0;
    animState.current.lastInput = performance.now();
    animState.current.changedAt = performance.now();
    animState.current.lastPaint = "";
    say((messages as any)[value]);
  };

  const handleGreet = () => {
    animState.current.transientUntil = performance.now() + 2500;
    say("Xin chào! That made my day.");
  };

  // Provide hover context globally for other elements to trigger
  useEffect(() => {
    const handleEnter = (e: Event) => {
      const target = e.target as Element;
      if (target && typeof target.matches === 'function') {
        if (target.matches('.project, .hack-pass')) animState.current.hoverContext = 'coding';
        else if (target.matches('.paper-wrap')) animState.current.hoverContext = 'thinking';
      }
    };
    const handleLeave = () => { animState.current.hoverContext = null; };

    document.addEventListener('pointerenter', handleEnter, true);
    document.addEventListener('pointerleave', handleLeave, true);
    document.addEventListener('focusin', handleEnter, true);
    document.addEventListener('focusout', handleLeave, true);
    
    return () => {
      document.removeEventListener('pointerenter', handleEnter, true);
      document.removeEventListener('pointerleave', handleLeave, true);
      document.removeEventListener('focusin', handleEnter, true);
      document.removeEventListener('focusout', handleLeave, true);
    }
  }, []);

  return (
    <div className={`mascot-shell ${docked ? 'docked' : ''}`} id="mascot-shell" ref={shellRef}>
      <div className="orbit orbit-one"></div>
      <div className="orbit orbit-two"></div>
      
      <div 
        id="mascot" 
        ref={containerRef}
        role="button" 
        tabIndex={0} 
        aria-label={`${(descriptions as any)[mood] || descriptions.idle} Tap or press Enter to greet him.`}
        onClick={handleGreet}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleGreet(); } }}
      >
        <canvas ref={canvasRef} className="may-pixel-canvas" aria-hidden="true" />
      </div>
      
      <div className="stage-top">MEET MÂY / PIXEL COMPANION</div>
      <div className="speech" role="status">{speechText}</div>
      
      <div className="may-controls" role="group" aria-label="Mây expressions">
        {Object.keys(messages).map(m => (
          <button 
            key={m} 
            data-may-mode={m} 
            aria-pressed={mode === m}
            onClick={() => handleChoose(m)}
          >
            {m === 'auto' ? 'Auto' : m === 'thinking' ? 'Think' : m === 'coding' ? 'Code' : m === 'sleepy' ? 'Sleep' : 'Happy'}
          </button>
        ))}
      </div>
      
      <label className="may-compact-control">
        <span>MÂY</span>
        <select value={mode} onChange={(e) => handleChoose(e.target.value)} aria-label="Mây expression">
          <option value="auto">Auto</option>
          <option value="happy">Happy</option>
          <option value="thinking">Thinking</option>
          <option value="coding">Coding</option>
          <option value="sleepy">Sleepy</option>
        </select>
      </label>
      
      <span className="may-label">MÂY <small>A LITTLE PIXEL PERSONALITY</small></span>
      <span className="coordinate">
        X: <b id="coord-x">0.00</b> &nbsp; Y: <b id="coord-y">0.00</b>
      </span>
    </div>
  );
}
