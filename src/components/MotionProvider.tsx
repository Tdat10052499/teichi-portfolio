"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface MotionContextType {
  motion: boolean;
  toggleMotion: () => void;
  chapter: string;
  setChapter: (ch: string) => void;
}

const MotionContext = createContext<MotionContextType>({
  motion: true,
  toggleMotion: () => {},
  chapter: "home",
  setChapter: () => {},
});

export const useMotion = () => useContext(MotionContext);

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  const [motion, setMotion] = useState(true);
  const [chapter, setChapter] = useState("home");

  useEffect(() => {
    // Check reduced motion preference initially
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) setMotion(false);

    const listener = (e: MediaQueryListEvent) => setMotion(!e.matches);
    reduced.addEventListener("change", listener);
    return () => reduced.removeEventListener("change", listener);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }
  }, []);

  useEffect(() => {
    if (!motion) {
      document.body.classList.add("motion-off");
      document.documentElement.style.scrollBehavior = "auto";
      return;
    } else {
      document.body.classList.remove("motion-off");
      // Let Lenis own animated scrolling; avoid competing CSS smoothing.
      document.documentElement.style.scrollBehavior = "auto";
    }

    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      syncTouch: false,
      anchors: false,
      prevent: (node) => !!node.closest("dialog"),
    });

    // Provide Lenis to ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    const navigateAnchor = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element).closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor || anchor.target || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      event.preventDefault();
      history.pushState(null, "", url.hash);
      lenis.scrollTo(target, { offset: 0, lerp: 0, duration: 1.05, onComplete: () => {
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      } });
    };
    document.addEventListener("click", navigateAnchor);
    
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(tick);
      document.removeEventListener("click", navigateAnchor);
    };
  }, [motion]);

  return (
    <MotionContext.Provider value={{ motion, toggleMotion: () => setMotion((m) => !m), chapter, setChapter }}>
      {children}
    </MotionContext.Provider>
  );
}

