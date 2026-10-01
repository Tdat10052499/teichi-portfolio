"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Text enters once; only decorative surfaces follow scroll position. */
export function usePortfolioMotion(root: RefObject<HTMLDivElement | null>, enabled: boolean) {
  useEffect(() => {
    const element = root.current;
    if (!element || !enabled || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    let disposed = false;
    const context = gsap.context(() => {
      const compact = matchMedia("(max-width: 700px)").matches;
      const distance = compact ? 14 : 24;
      element.querySelectorAll<HTMLElement>("[data-motion-heading]").forEach(heading => {
        const hero = !!heading.closest(".v2-hero");
        const section = heading.closest("section")!;
        // Do not hide an already-read heading after toggling motion or returning via history.
        const bounds = heading.getBoundingClientRect();
        if (bounds.bottom < 0 || (hero && window.scrollY > 80)) return;
        const lines = heading.querySelectorAll(".v2-line-inner");
        const kicker = heading.parentElement?.querySelector(".v2-kicker");
        const description = hero ? section.querySelector(".v2-intro") : heading.closest(".v2-section-heading")?.querySelector(":scope > p");
        const timeline = gsap.timeline({
          defaults: { ease: "power3.out" },
          ...(hero ? { delay: .08 } : { scrollTrigger: { trigger: heading, start: "top 90%", once: true, fastScrollEnd: true } }),
        });
        if (kicker) timeline.from(kicker, { opacity: 0, y: 8, duration: .4, clearProps: "opacity,transform" }, 0);
        timeline.from(lines, { yPercent: compact ? 65 : 100, opacity: 0, duration: compact ? .65 : .85, stagger: .1, clearProps: "opacity,transform" }, .07);
        if (description) timeline.from(description, { opacity: 0, y: 10, duration: .55, clearProps: "opacity,transform" }, .25);
        if (hero) timeline.from(section.querySelector(".v2-actions"), { opacity: 0, y: 8, duration: .5, clearProps: "opacity,transform" }, .38);
      });
      element.querySelectorAll<HTMLElement>(".v2-feature,.v2-research-card,.v2-about-copy,.v2-concept").forEach(panel => {
        if (panel.getBoundingClientRect().bottom < 0) return;
        // No fading of body copy: the panel is readable before and during its entrance.
        gsap.from(panel, { y: distance, duration: .9, ease: "power3.out", clearProps: "transform", scrollTrigger: { trigger: panel, start: "top 96%", once: true, fastScrollEnd: true } });
      });
      element.querySelectorAll<HTMLElement>(".v2-section").forEach(section => {
        gsap.fromTo(section, { "--section-curve": compact ? "24px" : "64px" }, { "--section-curve": "0px", ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "top 25%", scrub: .45 } });
      });
      if (!compact) {
        gsap.fromTo(".v2-stage-watermark", { y: -20 }, { y: 30, ease: "none", scrollTrigger: { trigger: ".v2-feature", start: "top bottom", end: "bottom top", scrub: .6 } });
        gsap.to(".v2-floating-star", { rotation: 55, y: 35, ease: "none", scrollTrigger: { trigger: ".v2-hero", start: "top top", end: "bottom top", scrub: .6 } });
      }
    }, element);
    document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh(); });
    const onLoad = () => ScrollTrigger.refresh();
    element.addEventListener("load", onLoad, true);
    // Focusing a moving region should immediately expose all of its controls and text.
    const onFocus = (event: FocusEvent) => {
      const section = (event.target as HTMLElement).closest("section");
      if (!section) return;
      context.getTweens().forEach((tween: gsap.core.Tween) => {
        if (tween.targets().some((target: unknown) => target instanceof Element && section.contains(target)) && !tween.scrollTrigger?.vars.scrub) tween.progress(1);
      });
    };
    element.addEventListener("focusin", onFocus);
    return () => { disposed = true; element.removeEventListener("load", onLoad, true); element.removeEventListener("focusin", onFocus); context.revert(); };
  }, [root, enabled]);
}

