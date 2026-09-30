"use client";

import React, { useEffect, useRef } from "react";
import { useMotion } from "./MotionProvider";
import { skills } from "../data/portfolio";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function About() {
  const { setChapter } = useMotion();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setChapter("about");
        });
      },
      { rootMargin: "-25% 0px -50% 0px" }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [setChapter]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const title = sectionRef.current?.querySelector("h2");
      if (title) {
        gsap.from(title, {
          y: 65,
          opacity: 0.25,
          duration: 1,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top 88%", end: "top 35%", scrub: 0.7 },
        });
      }

      gsap.from(sectionRef.current?.querySelectorAll(".about-grid > div, .services > div") || [], {
        y: 35,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className="about section" ref={sectionRef}>
      <p className="eyebrow">04 / THE HUMAN BEHIND THE BLOCKS</p>
      <div className="about-grid">
        <h2>Technical mind.<br /><em>Curious soul.</em></h2>
        <div>
          <p className="about-lead">Good technology should feel like magic. And work like clockwork.</p>
          <p>I’m Đạt — Teichi D., an engineer who cares as much about how things feel as how they function. I build decentralized products with thoughtful interfaces, resilient architecture, and a little unexpected delight.</p>
          <p className="university">Van Lang University <span>IT · Web3 · Blockchain</span></p>
          <p>From Solidity to shaders, I connect the dots between blockchain infrastructure and the people using it.</p>
          <div className="stack">
            {skills.map((skill, index) => <span key={index}>{skill}</span>)}
          </div>
        </div>
      </div>
      <div className="services">
        <div>
          <span>01</span>
          <h3>Smart contracts</h3>
          <p>Clear architecture. Tested logic.<br />Ownership built into the foundation.</p>
        </div>
        <div>
          <span>02</span>
          <h3>Web3 experiences</h3>
          <p>Wallets, dApps, and interfaces<br />that put people first.</p>
        </div>
        <div>
          <span>03</span>
          <h3>Creative engineering</h3>
          <p>Real-time 3D and considered motion<br />that make every interaction count.</p>
        </div>
      </div>
    </section>
  );
}
