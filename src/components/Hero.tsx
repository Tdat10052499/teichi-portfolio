"use client";

import React, { useEffect, useRef } from "react";
import { useMotion } from "./MotionProvider";
import HeroField from "./HeroField";
import MayMascot from "./MayMascot";
import { gsap } from "gsap";

export default function Hero() {
  const { setChapter } = useMotion();
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setChapter("home");
          }
        });
      },
      { rootMargin: "-25% 0px -50% 0px" }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, [setChapter]);

  // Initial animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-copy > *", {
        y: 26,
        opacity: 0,
        stagger: 0.1,
        duration: 0.85,
        ease: "power3.out",
        clearProps: "transform,opacity",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" id="home" ref={heroRef}>
      <HeroField />
      
      <div className="eyebrow">
        <span className="live-dot"></span> OPEN FOR SELECT COLLABORATIONS
      </div>
      
      <div className="hero-copy">
        <p className="intro">Hồ Du tuấn Đạt / Teichi D.</p>
        <h1>Building what’s<br/><span className="lime">next.</span> <span className="outline">Onchain.</span></h1>
        <p className="description">
          I turn complex technology into simple, human experiences. <br/>
          From the first interaction to the final block.
        </p>
        <a className="primary" href="#work">Explore my work <span className="small-square"></span></a>
        <p className="field-note">
          <span className="desktop-note">A living field · Move to explore. Click to ripple.</span>
          <span className="touch-note">A living field · Tap the background.</span>
        </p>
      </div>

      <div className="mascot-stage">
        <MayMascot />
      </div>

      <div className="hero-bottom">
        <span>VAN LANG UNIVERSITY / VIETNAM</span>
        <a href="#work">SCROLL TO DISCOVER <span className="scroll-line"></span></a>
        <span>PORTFOLIO — 2026</span>
      </div>
    </section>
  );
}
