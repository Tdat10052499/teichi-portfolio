"use client";

import React, { useEffect, useRef } from "react";
import { useMotion } from "./MotionProvider";

export default function HeroField() {
  const { motion } = useMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const hero = canvas.closest(".hero") as HTMLElement;
    if (!hero) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    let width = 0, height = 0, points: any[] = [], columns = 0, visible = true;
    let time = 0, dirty = true, wasMoving = true;
    const pointer = { x: 0, y: 0, active: false };
    let ripples: any[] = [];
    const coarse = window.matchMedia("(pointer: coarse)");
    let animationFrameId: number;
    let previous = performance.now();
    
    function resize() {
      width = hero.clientWidth; height = hero.clientHeight;
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas!.width = Math.round(width * dpr); canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      columns = Math.ceil(width / 42) + 3;
      const rows = Math.ceil(height / 38) + 3;
      points = Array.from({ length: columns * rows }, (_, i) => ({
        x: (i % columns) * 42 - 42, y: Math.floor(i / columns) * 38 - 38,
        dx: 0, dy: 0, px: 0, py: 0, light: 0,
      }));
      dirty = true;
    }
    
    function locate(e: PointerEvent) {
      const r = hero.getBoundingClientRect();
      pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top;
    }
    
    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      locate(e); pointer.active = true;
    };
    
    const handlePointerLeave = () => { pointer.active = false; };
    
    const handlePointerDown = (e: PointerEvent) => {
      if (!motion || (e.target as Element).closest('a,button,select,input,[role="button"]')) return;
      locate(e); 
      ripples.push({ x: pointer.x, y: pointer.y, age: 0 });
      ripples = ripples.slice(-3);
    };
    
    hero.addEventListener("pointermove", handlePointerMove, { passive: true });
    hero.addEventListener("pointerleave", handlePointerLeave);
    hero.addEventListener("pointerdown", handlePointerDown, { passive: true });
    
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(hero);
    
    const intersectionObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    intersectionObserver.observe(hero);
    
    resize();
    
    const tick = (now: number) => {
      animationFrameId = requestAnimationFrame(tick);
      const dt = Math.min((now - previous) / 1000, 0.035);
      previous = now;
      
      if (!visible) return;
      if (motion !== wasMoving) { dirty = true; wasMoving = motion; ripples = []; }
      if (!motion && !dirty) return;
      if (motion) time += dt;
      dirty = false;
      
      ctx!.clearRect(0, 0, width, height);
      const blend = 1 - Math.exp(-dt * 9);
      ripples.forEach(r => r.age += dt);
      ripples = ripples.filter(r => r.age < 2.4);
      
      for (const p of points) {
        const wave = Math.sin(p.x / 205 + p.y / 190 + (motion ? time * 0.14 : 0));
        const baseY = p.y + wave * 30 + Math.sin(p.x / 340 - p.y / 210) * 26;
        const dx = p.x - pointer.x, dy = baseY - pointer.y;
        const distance = Math.hypot(dx, dy);
        const influence = pointer.active && motion && !coarse.matches ? Math.max(0, 1 - distance / 190) : 0;
        const push = influence * influence * 34;
        let targetX = distance > 1 ? dx / distance * push : 0;
        let targetY = distance > 1 ? dy / distance * push : 0;
        let rippleLight = 0;
        
        for (const r of ripples) {
          const rx = p.x - r.x, ry = baseY - r.y, d = Math.hypot(rx, ry);
          const force = Math.exp(-Math.pow((d - r.age * 230) / 48, 2)) * 19 * (1 - r.age / 2.4);
          if (d > 1) { targetX += rx / d * force; targetY += ry / d * force; }
          rippleLight += force / 100;
        }
        
        p.dx = motion ? p.dx + (targetX - p.dx) * blend : 0;
        p.dy = motion ? p.dy + (targetY - p.dy) * blend : 0;
        p.px = p.x + p.dx; p.py = baseY + p.dy;
        
        const right = Math.min(1, Math.max(0, (p.x / width - 0.35) * 2));
        const bottom = Math.min(1, Math.max(0, (p.y / height - 0.48) * 3));
        p.light = 0.025 + Math.max(right * 0.17, bottom * 0.10) + influence * 0.28 + Math.min(rippleLight, 0.15);
      }
      
      ctx!.lineWidth = 0.65;
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        ctx!.strokeStyle = `rgba(190,213,136,${p.light})`;
        ctx!.beginPath();
        if (i % columns < columns - 1) { const n = points[i + 1]; ctx!.moveTo(p.px, p.py); ctx!.lineTo(n.px, n.py); }
        if (i + columns < points.length) { const n = points[i + columns]; ctx!.moveTo(p.px, p.py); ctx!.lineTo(n.px, n.py); }
        ctx!.stroke();
        
        if (i % 3 === 0) {
          ctx!.fillStyle = `rgba(217,255,98,${Math.min(0.75, p.light * 2.3)})`;
          ctx!.fillRect(p.px - 1, p.py - 1, 2, 2);
        }
      }
    };
    
    animationFrameId = requestAnimationFrame(tick);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      hero.removeEventListener("pointermove", handlePointerMove);
      hero.removeEventListener("pointerleave", handlePointerLeave);
      hero.removeEventListener("pointerdown", handlePointerDown);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [motion]);

  return <canvas ref={canvasRef} className="hero-field" aria-hidden="true" />;
}
