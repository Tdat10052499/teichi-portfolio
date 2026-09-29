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
      document.documentElement.style.scrollBehavior = "smooth";
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

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, [motion]);

  return (
    <MotionContext.Provider value={{ motion, toggleMotion: () => setMotion((m) => !m), chapter, setChapter }}>
      {children}
    </MotionContext.Provider>
  );
}
