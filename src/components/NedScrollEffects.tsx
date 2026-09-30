"use client";

import React, { useEffect, useRef } from "react";
import { useMotion } from "@/components/MotionProvider";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function NedScrollEffects() {
  const { motion } = useMotion();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Add classes and setup GSAP based animations
    const revealTargets = document.querySelectorAll(
      '.section-top, .story-grid > *, .principles article, .demo-intro > h2, .demo-device, .design-strip, .gallery figure, .status-grid article, .reality-note, .architecture > div, .closing > *, .source-links'
    );
    
    const chapters = [
      ['Welcome', 'happy', 'Welcome! Scroll to explore the story. Tap me for a little hello.'],
      ['The idea', 'thinking', 'Familiar actions first. The blockchain details can come second.'],
      ['Try it', 'coding', 'Choose an asset and try a sample trade. I’m here to help.'],
      ['The design', 'happy', 'Purple belongs to N.E.D. Hover or focus a screen to look closer.'],
      ['Current status', 'thinking', 'Built, simulated, or planned? These cards tell you which is which.'],
      ['Under the hood', 'coding', 'Follow the layers: interface, identity, then network.'],
      ['What’s next', 'happy', 'You made it! Try the demo, or head back to meet Teichi.']
    ];

    const sections = Array.from(document.querySelectorAll('main > section'));
    
    // Add scroll tracking for rail
    const updateRail = () => {
      const height = window.innerHeight;
      let current = 0;
      sections.forEach((s, i) => {
        if (s.getBoundingClientRect().top < height * 0.48) current = i;
      });
      
      document.querySelectorAll('.story-rail a').forEach((a, i) => {
        if (i === current) a.setAttribute('aria-current', 'location');
        else a.removeAttribute('aria-current');
      });
    };
    
    window.addEventListener('scroll', updateRail, { passive: true });
    updateRail();
    
    revealTargets.forEach((el, i) => {
      el.classList.add('scroll-reveal');
      (el as HTMLElement).style.setProperty('--reveal-delay', `${(i % 3) * 65}ms`);
      
      gsap.fromTo(el, 
        { opacity: 0, y: 35 },
        {
          opacity: 1, 
          y: 0,
          duration: 0.9,
          ease: "power2.out",
          delay: (i % 3) * 0.065,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true
          }
        }
      );
    });
    
    // Progress bar
    const progress = document.querySelector('.reading-progress') as HTMLElement;
    if (progress) {
      gsap.to(progress, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: "main",
          start: "top top",
          end: "bottom bottom",
          scrub: 0
        }
      });
    }

    // Interactive hero art
    const hero = document.querySelector('.hero-art');
    const front = hero?.querySelector('.front-screen') as HTMLElement;
    const back = hero?.querySelector('.back-screen') as HTMLElement;
    let px = 0, py = 0;
    
    const handleMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch' || !hero || !front || !back || !motion) return;
      const r = hero.getBoundingClientRect();
      px = (e.clientX - r.left) / r.width - 0.5;
      py = (e.clientY - r.top) / r.height - 0.5;
      
      gsap.to(front, { x: px * 20, y: py * 12, duration: 0.5, ease: "power2.out", overwrite: true });
      gsap.to(back, { x: -px * 16, y: -py * 10, duration: 0.5, ease: "power2.out", overwrite: true });
    };
    
    const handleLeave = () => {
      if (!front || !back || !motion) return;
      gsap.to(front, { x: 0, y: 0, duration: 0.8, ease: "power2.out", overwrite: true });
      gsap.to(back, { x: 0, y: 0, duration: 0.8, ease: "power2.out", overwrite: true });
    };
    
    hero?.addEventListener('pointermove', handleMove as any);
    hero?.addEventListener('pointerleave', handleLeave);

    return () => {
      hero?.removeEventListener('pointermove', handleMove as any);
      hero?.removeEventListener('pointerleave', handleLeave);
      window.removeEventListener('scroll', updateRail);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [motion]);

  const chapters = [
    'Welcome', 'The idea', 'Try it', 'The design', 'Current status', 'Under the hood', 'What’s next'
  ];

  return (
    <>
      <nav className="story-rail" aria-label="Case study chapters">
        {chapters.map((title, i) => (
          <a key={i} href={`#ned-chapter-${i}`} aria-label={title}>
            <span>{String(i + 1).padStart(2, '0')}</span>
            <b>{title}</b>
          </a>
        ))}
      </nav>
      <div className="reading-progress" aria-hidden="true" style={{ transformOrigin: "left center" }}></div>
    </>
  );
}
