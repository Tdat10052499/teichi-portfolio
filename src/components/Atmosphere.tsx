"use client";

import { useEffect, useRef } from "react";
import { useMotion } from "./MotionProvider";

/** A decorative field: input belongs to the section, never to the canvas. */
export default function Atmosphere() {
  const ref = useRef<HTMLCanvasElement>(null);
  const { motion } = useMotion();

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;
    let width = 0, height = 0, raf = 0, visible = false, last = 0, phase = 0;
    let scroll = 0, targetScroll = 0;
    const pointer = { x: -1000, y: -1000, tx: -1000, ty: -1000 };
    const ripples: { x: number; y: number; at: number }[] = [];

    const render = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      const delta = Math.min(now - (last || now), 50);
      last = now;
      if (motion) phase += delta * .00016;
      pointer.x += (pointer.tx - pointer.x) * .08;
      pointer.y += (pointer.ty - pointer.y) * .08;
      scroll += (targetScroll - scroll) * .055;
      ctx.clearRect(0, 0, width, height);
      // Two open, asymmetric ribbons leave a quiet reading area in the center.
      const small = width < 700;
      const rows = small ? 13 : 20;
      const step = small ? 18 : 20;
      for (let row = 0; row < rows; row++) {
        const depth = row / (rows - 1);
        ctx.beginPath();
        let first = true;
        for (let x = -20; x <= width + 20; x += step) {
          const u = x / width;
          const arch = Math.sin(u * Math.PI * 2.05 + phase * .6 + depth * .4);
          let y = height * (.70 + arch * .13) + (depth - .5) * height * .27;
          y += Math.sin(u * 7 - phase + depth * 2) * 16 - scroll * (10 + depth * 24);
          let px = x;
          const dx = x - pointer.x, dy = y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (motion && dist < 180) {
            const force = Math.pow(1 - dist / 180, 2) * 44;
            px += dx / (dist || 1) * force;
            y += dy / (dist || 1) * force;
          }
          if (motion) for (const ripple of ripples) {
            const age = (now - ripple.at) / 1400;
            const distance = Math.hypot(x - ripple.x, y - ripple.y);
            y += Math.sin((distance - age * 600) * .035) * Math.exp(-Math.pow((distance - age * 600) / 85, 2)) * 18 * (1 - age);
          }
          if (first) { ctx.moveTo(px, y); first = false; } else ctx.lineTo(px, y);
        }
        ctx.strokeStyle = `rgba(102,126,86,${.075 + depth * .10})`;
        ctx.lineWidth = .8;
        ctx.stroke();
      }
      // Small seeds drift along the same contour, rather than filling the page with noise.
      for (let i = 0; i < (small ? 22 : 48); i++) {
        const u = ((i * .618033 + phase * .009) % 1);
        const x = u * width;
        const y = height * (.70 + Math.sin(u * Math.PI * 2.05 + phase * .6) * .13) + Math.sin(i * 2.4 + phase) * height * .11 - scroll * 20;
        ctx.beginPath(); ctx.arc(x, y, i % 5 === 0 ? 2.3 : 1.3, 0, Math.PI * 2);
        ctx.fillStyle = i % 5 === 0 ? "#81985888" : "#7d94734d"; ctx.fill();
      }
      while (ripples.length && now - ripples[0].at > 1400) ripples.shift();
      canvas.dataset.state = motion ? "flowing" : "still";
      if (motion) raf = requestAnimationFrame(render);
    };
    const start = () => { cancelAnimationFrame(raf); last = 0; if (visible && !document.hidden) raf = requestAnimationFrame(render); };
    const resize = () => {
      width = host.clientWidth; height = host.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); start();
    };
    const move = (event: PointerEvent) => {
      if (!motion || event.pointerType === "touch") return;
      const rect = host.getBoundingClientRect();
      pointer.tx = event.clientX - rect.left; pointer.ty = event.clientY - rect.top;
      if (pointer.x < -500) { pointer.x = pointer.tx; pointer.y = pointer.ty; }
    };
    const leave = () => { pointer.tx = -1000; pointer.ty = -1000; };
    const press = (event: PointerEvent) => {
      if (!motion || event.button !== 0 || (event.target as Element).closest("a,button,input,select,textarea")) return;
      const rect = host.getBoundingClientRect();
      ripples.push({ x: event.clientX - rect.left, y: event.clientY - rect.top, at: performance.now() });
      if (ripples.length > 4) ripples.shift();
    };
    const onScroll = () => { if (visible && motion) targetScroll = Math.min(1, Math.max(0, -host.getBoundingClientRect().top / height)); };
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; start(); }, { threshold: 0 });
    intersection.observe(host);
    const observer = new ResizeObserver(resize); observer.observe(host);
    host.addEventListener("pointermove", move, { passive: true });
    host.addEventListener("pointerleave", leave);
    host.addEventListener("pointerdown", press, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", start);
    resize();
    return () => {
      cancelAnimationFrame(raf); observer.disconnect(); intersection.disconnect();
      host.removeEventListener("pointermove", move); host.removeEventListener("pointerleave", leave); host.removeEventListener("pointerdown", press);
      window.removeEventListener("scroll", onScroll); document.removeEventListener("visibilitychange", start);
    };
  }, [motion]);

  return <canvas ref={ref} className="v2-atmosphere" aria-hidden="true" />;
}
