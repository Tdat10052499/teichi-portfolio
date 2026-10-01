"use client";
import { useEffect } from "react";
import { useMotion } from "./MotionProvider";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const chapters = ['Overview', 'The idea', 'Try it', 'Design', 'Status', 'Engineering', 'Next'];
export default function NedScrollEffects() {
  const { motion } = useMotion();
  useEffect(() => {
    const root = document.querySelector('.ned-editorial');
    if (!root) return;
    root.classList.toggle('has-motion', motion);
    root.classList.toggle('quiet', !motion);
    gsap.registerPlugin(ScrollTrigger);
    const sections = Array.from(root.querySelectorAll('main > section'));
    const links = Array.from(root.querySelectorAll('.ned-chapters a'));
    const update = () => {
      let active = 0;
      sections.forEach((section, i) => { if (section.getBoundingClientRect().top < innerHeight * .45) active = i; });
      links.forEach((link, i) => { if (i === active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
    };
    window.addEventListener('scroll', update, { passive: true }); update();
    const ctx = gsap.context(() => {
      if (!motion || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      root.querySelectorAll('h2, .principles article, .gallery figure, .status-grid article').forEach(el => {
        gsap.from(el, { y: 22, duration: .75, ease: 'power3.out', clearProps: 'transform', scrollTrigger: { trigger: el, start: 'top 94%', once: true } });
      });
      gsap.fromTo('.front-screen', { y: 8 }, { y: -20, ease: 'none', scrollTrigger: { trigger: '.case-hero', start: 'top top', end: 'bottom top', scrub: .7 } });
      gsap.fromTo('.back-screen', { y: -8 }, { y: 24, ease: 'none', scrollTrigger: { trigger: '.case-hero', start: 'top top', end: 'bottom top', scrub: .7 } });
    }, root);
    const refresh = () => ScrollTrigger.refresh();
    root.addEventListener('load', refresh, true);
    return () => { ctx.revert(); window.removeEventListener('scroll', update); root.removeEventListener('load', refresh, true); };
  }, [motion]);
  return <nav className="ned-chapters" aria-label="Case study chapters">{chapters.map((name, i) => <a key={name} href={`#ned-chapter-${i}`}><span>{String(i).padStart(2, '0')}</span>{name}</a>)}</nav>;
}
