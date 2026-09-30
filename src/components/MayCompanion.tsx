"use client";

import React, { useEffect, useRef } from "react";
import { useMotion } from "./MotionProvider";

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

interface MayCompanionProps {
  mode: string;
  mood: string;
  transientUntil: number;
  chapter: string;
}

export default function MayCompanion({ mode, mood, transientUntil, chapter }: MayCompanionProps) {
  const { motion } = useMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const animState = useRef({
    width: 0,
    height: 0,
    current: "",
    changedAt: performance.now(),
    lastInput: performance.now(),
    hoverContext: null as string | null,
    frame: -1,
    lastPaint: "",
    pointerX: 0,
    look: 0,
    elapsed: 0,
  });

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
      if (now < transientUntil) return mood;
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
  }, [motion, chapter, mode, mood, transientUntil]);

  useEffect(() => {
    const handleEnter = (e: Event) => {
      const target = e.target as Element;
      if (target && typeof target.matches === 'function') {
        if (target.matches('.project, .hack-pass, [data-action]')) animState.current.hoverContext = 'coding';
        else if (target.matches('.paper-wrap, input, textarea')) animState.current.hoverContext = 'thinking';
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
    <div 
      id="mascot" 
      ref={containerRef}
      role="button" 
      tabIndex={0} 
      aria-label="Mây, your pixel guide. Tap to say hello."
    >
      <canvas ref={canvasRef} className="may-pixel-canvas" aria-hidden="true" />
    </div>
  );
}
