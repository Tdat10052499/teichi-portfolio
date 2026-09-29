"use client";

import React, { useEffect, useRef, useState } from "react";
import { useMotion } from "./MotionProvider";
import { studies } from "../data/portfolio";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SelectedWork() {
  const { setChapter, motion } = useMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [activeProject, setActiveProject] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setChapter("work");
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

      gsap.from(sectionRef.current?.querySelectorAll(".section-heading > p") || [], {
        y: 35,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true },
      });

      const projects = sectionRef.current?.querySelectorAll(".project") || [];
      projects.forEach((el) => {
        gsap.from(el, {
          y: 65,
          opacity: 0.25,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 98%", end: "top 60%", scrub: 0.6 },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleOpen = (index: number) => {
    setActiveProject(index);
    if (dialogRef.current) {
      dialogRef.current.showModal();
      document.documentElement.style.overflow = 'hidden';
    }
  };

  const handleClose = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
      document.documentElement.style.overflow = '';
      setActiveProject(null);
    }
  };

  const activeData = activeProject !== null ? studies[activeProject] : null;

  return (
    <>
      <section id="work" className="work section" ref={sectionRef}>
        <div className="section-heading">
          <div>
            <p className="eyebrow">01 / SELECTED EXPERIMENTS</p>
            <h2>Less talk.<br />More <em>proof.</em></h2>
          </div>
          <p>A hackathon project and concept explorations<br />in ownership, utility, and the internet.</p>
        </div>
        <div className="projects">
          <button className="project" onClick={() => handleOpen(0)}>
            <div className="project-art vault">
              <div className="art-label">N.E.D / UNIHACKFEST 2026</div>
              <div className="vault-visual">
                <span>N.</span>
                <div className="ring r1"></div>
                <div className="ring r2"></div>
                <div className="ring r3"></div>
              </div>
              <div className="art-bottom">Hold dollars.<br />Invest in US stocks.</div>
              <span className="project-open">VIEW CASE STUDY</span>
            </div>
            <div className="project-info">
              <h3>N.E.D Wallet</h3>
              <span>UniHackfest 2026 · Project owner</span>
              <b>01</b>
            </div>
          </button>
          <button className="project" onClick={() => handleOpen(1)}>
            <div className="project-art prism">
              <div className="art-label">PROVENANCE IS EVERYTHING.</div>
              <div className="prism-visual">OWN<br /><span>YOUR</span><br />ORIGIN.</div>
              <span className="art-badge">ORIGIN®<br />COLLECTIVE</span>
              <span className="project-open">VIEW CASE STUDY</span>
            </div>
            <div className="project-info">
              <h3>Origin Collective</h3>
              <span>Concept · Digital ownership</span>
              <b>02</b>
            </div>
          </button>
          <button className="project project-wide" onClick={() => handleOpen(2)}>
            <div className="project-art relay">
              <div className="art-label">RELAY / INFRASTRUCTURE WITHOUT FRICTION</div>
              <div className="relay-text">One connection.<br />Every chain.</div>
              <div className="network" aria-hidden="true">
                <i></i><i></i><i></i><i></i><i></i><i></i><strong>r.</strong>
              </div>
              <span className="project-open">VIEW CASE STUDY</span>
            </div>
            <div className="project-info">
              <h3>Relay Network</h3>
              <span>Concept · Cross-chain experience</span>
              <b>03</b>
            </div>
          </button>
        </div>
      </section>

      <dialog 
        id="case-dialog" 
        ref={dialogRef}
        data-lenis-prevent
        onClick={(e) => {
          if (e.target === dialogRef.current) handleClose();
        }}
        onClose={handleClose}
      >
        <button className="close" aria-label="Close case study" onClick={handleClose}>×</button>
        {activeData && (
          <>
            <p className="eyebrow" id="case-type">{activeData.type}</p>
            <h2 id="case-title">{activeData.title}</h2>
            <p id="case-intro" className="about-lead">{activeData.intro}</p>
            <h3>The challenge</h3>
            <p id="case-challenge">{activeData.challenge}</p>
            <h3>The approach</h3>
            <p id="case-approach">{activeData.approach}</p>
            <div className="stack" id="case-stack">
              {activeData.stack.map((s, i) => <span key={i}>{s}</span>)}
            </div>
            <p className="case-note">{activeData.note}</p>
          </>
        )}
      </dialog>
    </>
  );
}
