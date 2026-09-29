"use client";

import React, { useEffect } from "react";
import { useMotion } from "./MotionProvider";

export default function Header() {
  const { motion, toggleMotion, chapter } = useMotion();

  // Handle smooth scroll for nav links if motion is enabled
  useEffect(() => {
    const handleNavClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor || !anchor.hash) return;
      
      const targetEl = document.querySelector(anchor.hash);
      if (!targetEl) return;
      
      e.preventDefault();
      
      if (motion) {
        // Find Lenis instance from window if we need to manually scroll,
        // but simple scrollIntoView with smooth behavior is handled globally, 
        // except lenis overrides it. Wait, window.scrollTo({ top: targetEl.getBoundingClientRect().top + window.scrollY - 35, behavior: 'smooth' }) works with Lenis
        window.scrollTo({
          top: targetEl.getBoundingClientRect().top + window.scrollY - 35,
          // lenis handles the actual lerp when scroll behavior is smooth
        });
      } else {
        targetEl.scrollIntoView({ behavior: "instant" as ScrollBehavior });
      }
      history.replaceState(null, "", anchor.hash);
    };

    const nav = document.querySelector("header nav");
    nav?.addEventListener("click", handleNavClick as any);
    return () => nav?.removeEventListener("click", handleNavClick as any);
  }, [motion]);

  return (
    <>
      <aside className="chapter-nav" aria-label="Page sections">
        <a href="#home" data-label="Intro" className={chapter === "home" ? "active" : ""}><span>Intro</span></a>
        <a href="#work" data-label="Work" className={chapter === "work" ? "active" : ""}><span>Work</span></a>
        <a href="#research" data-label="Research" className={chapter === "research" ? "active" : ""}><span>Research</span></a>
        <a href="#hackathon" data-label="Hackathon" className={chapter === "hackathon" ? "active" : ""}><span>Hackathon</span></a>
        <a href="#about" data-label="About" className={chapter === "about" ? "active" : ""}><span>About</span></a>
      </aside>
      <div className="progress" aria-hidden="true"></div>
      
      <header>
        <a className="wordmark" href="#home" aria-label="Teichi D. home">
          td<span>®</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#work">Selected work <span>03</span></a>
          <a href="#research">Research</a>
          <a href="#hackathon">Hackathon</a>
          <a href="#about">About</a>
          <a href="#contact">Let’s talk <i className="nav-dot"></i></a>
        </nav>
        <button 
          className="motion-toggle" 
          aria-pressed={!motion}
          onClick={toggleMotion}
        >
          {motion ? "Motion on" : "Motion off"}
        </button>
      </header>
    </>
  );
}
