"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Exhibition choreography: a scroll-driven text cube, then open chapter stages. */
export function usePortfolioMotion(root: RefObject<HTMLDivElement | null>, enabled: boolean) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    // Route-level hash scrolling can run before ScrollTrigger adds its pin space.
    // Correct it once after layout settles, unless the visitor has started interacting.
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const cancel = () => { cancelled = true; };
    const events = ["wheel", "touchstart", "pointerdown", "keydown"] as const;
    events.forEach(name => window.addEventListener(name, cancel, { passive: true, once: true }));
    const hash = location.hash;
    document.fonts.ready.then(() => {
      if (cancelled || !hash) return;
      timer = setTimeout(() => {
        if (cancelled || location.hash !== hash) return;
        let id: string;
        try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
        const target = document.getElementById(id);
        if (target && root.current?.contains(target)) {
          ScrollTrigger.refresh();
          target.scrollIntoView({ behavior: "instant", block: "start" });
        }
      }, 200);
    });
    return () => { cancelled = true; clearTimeout(timer); events.forEach(name => window.removeEventListener(name, cancel)); };
  }, [root]);
  useEffect(() => {
    const element = root.current;
    if (!element || !enabled) return;
    gsap.registerPlugin(ScrollTrigger);
    let disposed = false;
    const media = gsap.matchMedia();
    media.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        const prologue = element.querySelector<HTMLElement>(".exhibit-prologue");
        const stage = element.querySelector<HTMLElement>(".prologue-stage");
        const track = element.querySelector<HTMLElement>(".prologue-track");
        if (prologue && stage && track) {
          prologue.classList.add("is-choreographed");
          const cube = gsap.timeline({
            scrollTrigger: { trigger: prologue, start: "top top", end: () => `+=${innerHeight * 2}`, pin: stage, scrub: .4, invalidateOnRefresh: true },
          });
          // Each quarter turn reveals the next face; pauses give each sentence reading time.
          cube.set(track, { "--cube-turn": "0deg" })
            .to(track, { "--cube-turn": "90deg", duration: 1, ease: "power2.inOut" }, .4)
            .to(track, { "--cube-turn": "180deg", duration: 1, ease: "power2.inOut" }, 1.9)
            .to({}, { duration: .4 });
        }
        gsap.to(".v2-hero .idea-scene", { y: 65, rotation: 8, ease: "none", scrollTrigger: {trigger:".v2-hero",start:"top top",end:"bottom top",scrub:.5} });
        element.querySelectorAll<HTMLElement>(".v2-products .v2-section-heading").forEach(heading => {
          const lines = heading.querySelectorAll(".v2-line-inner");
          gsap.fromTo(lines, { yPercent: 32 }, { yPercent: 0, stagger: .06, ease: "none", scrollTrigger: { trigger: heading, start: "top 90%", end: "top 38%", scrub: .35 } });
        });
        const research = element.querySelector<HTMLElement>(".v2-research");
        const titleGroup = research?.querySelector<HTMLElement>(".v2-section-heading > div");
        const title = titleGroup?.querySelector<HTMLElement>("h2");
        const figure = research?.querySelector<HTMLElement>(".v2-research-figure");
        if (research && titleGroup && title && figure) {
          research.classList.add("research-docking");
          const reserveSpace = () => research.style.setProperty("--research-title-space", `${titleGroup.offsetHeight + 48}px`);
          reserveSpace();
          const travel = () => Math.max(0, figure.getBoundingClientRect().top - titleGroup.getBoundingClientRect().top + Number(gsap.getProperty(titleGroup, "y")));
          gsap.fromTo(titleGroup, { y: 0 }, {
            y: travel, ease: "none",
            scrollTrigger: {
              trigger: research, start: "top top", end: () => `+=${Math.max(1, travel())}`,
              scrub: true, invalidateOnRefresh: true, onRefreshInit: reserveSpace,
            },
          });
        }
        // Only the exhibit moves. Paragraphs and controls remain stable and readable.
        element.querySelectorAll<HTMLElement>(".v2-product-stage").forEach(scene => {
          gsap.fromTo(scene, {y:55}, {y:0,ease:"none",scrollTrigger:{trigger:scene,start:"top bottom",end:"top 22%",scrub:.4}});
        });
      }, element);
      return () => {
        context.revert();
        const research = element.querySelector<HTMLElement>(".v2-research");
        research?.classList.remove("research-docking");
        research?.style.removeProperty("--research-title-space");
        element.querySelector(".exhibit-prologue")?.classList.remove("is-choreographed");
      };
    });
    document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh(); });
    const refresh = () => ScrollTrigger.refresh();
    element.addEventListener("load", refresh, true);
    return () => { disposed = true; element.removeEventListener("load", refresh, true); media.revert(); };
  }, [root, enabled]);
}
