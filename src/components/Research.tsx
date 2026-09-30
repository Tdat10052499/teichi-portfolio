"use client";

import React, { useEffect, useRef } from "react";
import { useMotion } from "./MotionProvider";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Research() {
  const { setChapter } = useMotion();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setChapter("research");
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

      gsap.from(sectionRef.current?.querySelectorAll(".section-heading > p, .research-copy") || [], {
        y: 35,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true },
      });

      gsap.fromTo(
        ".paper",
        { rotation: -7, y: 45 },
        { rotation: 2, y: -25, ease: "none", scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1 } }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="research" className="research section" data-chapter="Research" ref={sectionRef}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">02 / SCIENTIFIC RESEARCH</p>
          <h2>Stay curious.<br /><em>Go deeper.</em></h2>
        </div>
        <p>Questions lead to experiments.<br />Experiments lead to understanding.</p>
      </div>
      <div className="research-grid">
        <div className="research-copy">
          <span className="tag review-status">UNDER REVIEW</span>
          <h3>Signed but Stale.</h3>
          <p>Rolling Back Backdoor Repairs Through Shard-Version Skew in 6G Edge Inference.</p>
          <p className="research-summary">Exploring the security of distributed inference at the 6G edge — where a signed update and an up-to-date system are not always the same thing.</p>
          <dl className="research-facts">
            <div>
              <dt>Researcher</dt>
              <dd>Hồ Du tuấn Đạt</dd>
            </div>
            <div>
              <dt>University</dt>
              <dd>Van Lang University</dd>
            </div>
            <div>
              <dt>Track</dt>
              <dd>Recent Advances in 6G Communications: Technologies, Architectures, and Applications</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>Under review</dd>
            </div>
          </dl>
        </div>
        <div className="paper-wrap" data-tilt>
          <article className="paper">
            <div className="paper-top">
              <span>TEICHI D. / RESEARCH</span>
              <span>01</span>
            </div>
            <div className="paper-symbol" aria-hidden="true">∴</div>
            <h3>Signed<br />but Stale.</h3>
            <p className="paper-subtitle">Rolling Back Backdoor Repairs Through Shard-Version Skew in 6G Edge Inference</p>
            <p className="paper-author">Hồ Du tuấn Đạt<br />Van Lang University</p>
            <div className="paper-rule"></div>
            <span className="paper-caption">SCIENTIFIC RESEARCH PAPER</span>
            <p className="paper-pending">Under review · Publication link to follow</p>
          </article>
          <span className="paper-side">IDEAS, EXAMINED.</span>
        </div>
      </div>
    </section>
  );
}
