"use client";

import React, { useEffect, useRef } from "react";
import { useMotion } from "./MotionProvider";
import { gsap } from "gsap";

export default function Hackathon() {
  const { setChapter } = useMotion();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setChapter("hackathon");
        });
      },
      { rootMargin: "-25% 0px -50% 0px" }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [setChapter]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current?.querySelectorAll(".hack-details") || [], {
        y: 35,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true },
      });

      gsap.fromTo(
        ".hack-pass",
        { rotation: 6, y: 40 },
        { rotation: -3, y: -25, ease: "none", scrollTrigger: { trigger: ".hackathon", start: "top bottom", end: "bottom top", scrub: 1 } }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="hackathon" className="hackathon section" data-chapter="Hackathon" ref={sectionRef}>
      <p className="eyebrow">03 / LEARNING BY BUILDING</p>
      <div className="hack-grid">
        <div>
          <span className="tag">PROJECT OWNER / N.E.D WALLET</span>
          <h2>UniHackfest<br /><em>2026.</em></h2>
          <p className="hack-lead">Hold dollars.<br />Invest in US stocks.</p>
          <p>I joined UniHackfest 2026 as project owner of N.E.D Wallet, bringing a focused financial product idea into the hackathon.</p>
          <div className="hack-details">
            <details open>
              <summary>The project <span>01</span></summary>
              <p>N.E.D Wallet — “Hold dollars. Invest in US stocks.” Built as our UniHackfest 2026 project.</p>
            </details>
            <details>
              <summary>My role <span>02</span></summary>
              <p>Project owner · Hồ Du tuấn Đạt — Teichi D.</p>
            </details>
            <details>
              <summary>The idea <span>03</span></summary>
              <p>A wallet concept bringing dollar holdings and US stock investing into one product experience.</p>
            </details>
          </div>
        </div>
        <div className="hack-pass" data-tilt>
          <div className="pass-header">BUILDER PASS <span>2026</span></div>
          <div className="pass-emblem" aria-hidden="true">{`{`}<span>✳</span>{`}`}</div>
          <h3>UniHackfest</h3>
          <span className="pass-year">20<span>26</span></span>
          <div className="pass-bottom">
            <div>
              <small>N.E.D WALLET / PROJECT OWNER</small>
              <strong>TEICHI D.</strong>
              <span>Van Lang University</span>
            </div>
            <div className="barcode" aria-hidden="true"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
