"use client";

import React, { useEffect, useRef } from "react";
import { useMotion } from "./MotionProvider";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Contact() {
  const { setChapter } = useMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setChapter("contact");
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

      gsap.to(".contact-star", {
        rotation: 100,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1 }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleOpen = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
      document.documentElement.style.overflow = 'hidden';
    }
  };

  const handleClose = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
      document.documentElement.style.overflow = '';
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const brief = formData.get("brief") as string;
    window.location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent('Let’s build something together')}&body=${encodeURIComponent(brief)}`;
  };

  return (
    <>
      <section id="contact" className="contact section" ref={sectionRef}>
        <p className="eyebrow">05 / YOUR NEXT BIG THING</p>
        <p className="contact-intro">Have an idea that won’t leave you alone?</p>
        <h2>Let’s make<br /><em>it real.</em><span className="contact-star">✳</span></h2>
        <button id="contact-button" className="primary" onClick={handleOpen}>
          Start a conversation <span className="small-square"></span>
        </button>
        <p className="contact-note" id="contact-note">Great things start with a simple hello.</p>
      </section>

      <dialog 
        id="contact-dialog" 
        ref={dialogRef}
        data-lenis-prevent
        onClick={(e) => {
          if (e.target === dialogRef.current) handleClose();
        }}
        onClose={handleClose}
      >
        <button className="close" aria-label="Close contact" onClick={handleClose}>×</button>
        <p className="eyebrow">LET’S BUILD SOMETHING</p>
        <h2>Your next chapter.</h2>
        <p>This portfolio is ready for your story. Add your contact email below to prepare a message in your email app.</p>
        <form id="contact-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Portfolio owner’s email</label>
          <input id="email" name="email" type="email" required placeholder="you@yourdomain.com" />
          <label htmlFor="brief">What would you like to build?</label>
          <textarea id="brief" name="brief" required rows={4} placeholder="Tell me about your idea…"></textarea>
          <button className="primary" type="submit">Open email draft</button>
          <p className="case-note">Opens your email app. No message is sent by this website.</p>
        </form>
      </dialog>
    </>
  );
}
