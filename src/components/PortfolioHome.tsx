"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SectionMay from "./SectionMay";
import Atmosphere from "./Atmosphere";
import { useMotion } from "./MotionProvider";
import { usePortfolioMotion } from "./usePortfolioMotion";

const prefix = process.env.NODE_ENV === "production" ? "/teichi-portfolio" : "";
const previews = [
  { label: "Home", image: "design-home.webp", title: "Start with something familiar.", copy: "A USDC-first direction that brings everyday money language to a Solana wallet." },
  { label: "xStocks", image: "design-xstocks.webp", title: "Explore before you decide.", copy: "Discover tokenized stocks. Trading in this prototype is simulated." },
  { label: "Asset detail", image: "design-detail.webp", title: "Context before the next step.", copy: "Inspect an asset before trying the sample buy and sell walkthrough." },
];

export default function PortfolioHome() {
  const { motion, toggleMotion, setChapter } = useMotion();
  const [preview, setPreview] = useState(0);
  const [guide, setGuide] = useState(false);
  const [menu, setMenu] = useState(false);
  const [concept, setConcept] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  usePortfolioMotion(root, motion);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) setChapter((e.target as HTMLElement).dataset.chapter || "home");
    }), { rootMargin: "-15% 0px -55% 0px" });
    root.current?.querySelectorAll("[data-chapter]").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [setChapter]);
  useEffect(() => {
    const escape = (e: KeyboardEvent) => { if (e.key === "Escape") { setGuide(false); setMenu(false); } };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, []);
  const current = previews[preview];
  return <div className={`portfolio-v2 ${motion ? "has-motion" : "quiet"}`} ref={root}>
    <a className="v2-skip" href="#products">Skip to products</a>
    <header className="v2-header"><a className="v2-brand" href="#home">teichi<span>®</span></a><button className="v2-menu" aria-controls="v2-navigation" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? "Close" : "Menu"}</button><nav id="v2-navigation" className={menu ? "is-open" : ""} aria-label="Main navigation" onClick={() => setMenu(false)}><a href="#products">Products</a><a href="#research">Research</a><a href="#about">About</a><a href="#contact">Let’s talk ↗</a></nav><button className="v2-motion" onClick={toggleMotion} aria-pressed={!motion}>Motion {motion ? "on" : "off"}</button></header>
    <main>
      <section className="v2-hero hero" id="home" data-chapter="home">
        <Atmosphere /><p className="v2-kicker"><span className="v2-live" /> HỒ DU TUẤN ĐẠT / TEICHI D.</p><h1 data-motion-heading><span className="v2-motion-line"><span className="v2-line-inner">Curious by nature.</span></span><span className="v2-motion-line"><span className="v2-line-inner v2-line-accent">Building with purpose.</span></span></h1><p className="v2-intro">I build thoughtful Web3 products and explore the questions<br className="v2-desktop-break" /> behind secure, dependable technology.</p><div className="v2-actions"><a className="v2-button dark" href="#products">Explore products ↗</a><a className="v2-button" href="#research">Discover research ↓</a></div>
        <div className="v2-hero-footer"><span>VAN LANG UNIVERSITY · VIETNAM</span><button aria-expanded={guide} aria-controls="may-directions" onClick={() => setGuide(!guide)}>Meet Mây ✳</button><span>PRODUCTS · RESEARCH · EXPLORATION</span></div><SectionMay place="hero" />
        {guide && <div id="may-directions" className="v2-guide"><strong>Where shall we start?</strong><a href="#products" onClick={() => setGuide(false)}>Something I’m building ↗</a><a href="#research" onClick={() => setGuide(false)}>A question I’m researching ↗</a><a href="#about" onClick={() => setGuide(false)}>The person behind the work ↗</a></div>}
        <p className="v2-field-hint">A field of possibilities · Move to explore, tap to ripple</p>
      </section>
      <section className="v2-products v2-section" id="products" data-chapter="work"><span id="work" className="v2-anchor" /><div className="v2-section-heading" data-reveal><div><p className="v2-kicker">01 / PRODUCTS & ENGINEERING</p><h2 data-motion-heading><span className="v2-motion-line"><span className="v2-line-inner">Ideas, made</span></span><span className="v2-motion-line"><span className="v2-line-inner v2-line-accent">tangible.</span></span></h2></div><p>Products you can explore.<br />Decisions you can look into.</p></div>
        <article className="v2-feature" data-reveal><div className="v2-feature-copy"><p className="v2-kicker">FEATURED PRODUCT <span className="v2-status">IN DEVELOPMENT</span></p><h3>N.E.D<br />Wallet.</h3><p className="v2-feature-lead">A familiar first step<br />into Web3.</p><p>A Solana wallet exploring how holding dollars and discovering tokenized stocks can feel more approachable.</p><div className="v2-feature-meta"><span>PROJECT OWNER</span><span>UNIHACKFEST 2026</span></div><div className="v2-actions"><Link className="v2-button light" href="/projects/ned-wallet">Read case study ↗</Link><Link className="v2-text-link" href="/projects/ned-wallet#demo">Try sample demo →</Link></div><a className="v2-source" href="https://github.com/Tdat10052499/Unihackfest-2026" target="_blank" rel="noopener noreferrer">View source on GitHub ↗</a></div><div className="v2-product-stage"><span className="v2-stage-watermark" aria-hidden="true">N.E.D</span><div className="v2-phone"><Image key={current.image} src={`${prefix}/assets/ned/${current.image}`} width={277} height={600} alt={`N.E.D ${current.label} design with sample data`} /></div><div className="v2-preview-buttons" role="group" aria-label="Product preview">{previews.map((item,i) => <button key={item.label} aria-pressed={i===preview} onClick={() => setPreview(i)}>{item.label}</button>)}</div><div className="v2-preview-caption" aria-live="polite"><strong>{current.title}</strong><p>{current.copy}</p></div><small>DESIGN PREVIEW · SAMPLE DATA</small></div></article>
        <SectionMay place="products" preview={current.label} />
        <div className="v2-concepts-heading"><h3>Concepts & explorations</h3><p>A place to test a different possibility.</p></div><div className="v2-concepts">{[{name:"Origin Collective",style:"origin",type:"DIGITAL OWNERSHIP",title:<>Own your<br /><em>origin.</em></>},{name:"Relay Network",style:"relay",type:"CROSS-CHAIN EXPERIENCE",title:<>One connection.<br />Every chain.</>}].map(item => <button key={item.name} className={`v2-concept ${item.style}`} data-reveal onClick={e => { trigger.current=e.currentTarget; setConcept(item.name); dialog.current?.showModal(); }}><span className="v2-kicker">CONCEPT / {item.type}</span><strong>{item.title}</strong><span className="v2-concept-bottom">{item.name}<span>↗</span></span></button>)}</div>
      </section>
      <section className="v2-research v2-section" id="research" data-chapter="research"><div className="v2-section-heading" data-reveal><div><p className="v2-kicker">02 / SCIENTIFIC RESEARCH</p><h2 data-motion-heading><span className="v2-motion-line"><span className="v2-line-inner">Better questions.</span></span><span className="v2-motion-line"><span className="v2-line-inner v2-line-accent">Deeper understanding.</span></span></h2></div><p>Examining the systems<br />beneath the experience.</p></div><article className="v2-research-card" data-reveal><div className="v2-research-copy"><span className="v2-status">UNDER REVIEW</span><h3>Signed but Stale.</h3><p className="v2-paper-title">Rolling Back Backdoor Repairs Through Shard-Version Skew in 6G Edge Inference</p><p>A research question at the intersection of security and distributed inference: does a signed update necessarily mean every part of a system is up to date?</p><div className="v2-research-tags"><span>6G EDGE INFERENCE</span><span>SECURITY</span></div><Link className="v2-button dark" href="/research/signed-but-stale">Read research overview ↗</Link></div><div className="v2-research-figure" aria-label="Conceptual illustration of shards with different versions"><div className="v2-figure-top">01 / THE QUESTION <span>∴</span></div><h4>A valid signature.<br /><em>A consistent system?</em></h4><div className="v2-shards"><div><span>SHARD A</span><strong>v.02</strong><small>Updated</small></div><div className="stale"><span>SHARD B</span><strong>v.01</strong><small>Older version</small></div><div><span>SHARD C</span><strong>v.02</strong><small>Updated</small></div></div><p>Concept illustration · not experimental results</p><div className="v2-figure-bottom">HỒ DU TUẤN ĐẠT <span>VAN LANG UNIVERSITY</span></div></div></article><p className="v2-research-footnote">Research track: Recent Advances in 6G Communications: Technologies, Architectures, and Applications. Publication link will be added when available.</p><SectionMay place="research" /></section>
      <section className="v2-about v2-section" id="about" data-chapter="about"><div data-reveal><p className="v2-kicker">03 / THE PERSON BEHIND THE WORK</p><h2 data-motion-heading><span className="v2-motion-line"><span className="v2-line-inner">Technical mind.</span></span><span className="v2-motion-line"><span className="v2-line-inner v2-line-accent">Curious soul.</span></span></h2></div><div className="v2-about-copy" data-reveal><p className="v2-big-copy">Hi, I’m Đạt. You can call me Teichi.</p><p>I’m exploring the space between useful products and the systems that make them possible — from Web3 interfaces to research on secure edge inference.</p><div className="v2-about-facts"><div><small>LEARNING</small><strong>Van Lang University</strong></div><div><small>BUILDING</small><strong>N.E.D Wallet / Project owner</strong></div><div id="hackathon"><small>PARTICIPATING</small><strong>UniHackfest 2026</strong></div></div><a className="v2-text-link" href="https://github.com/Tdat10052499" target="_blank" rel="noopener noreferrer">Follow the work on GitHub ↗</a></div><SectionMay place="about" /></section>
      <section className="v2-contact v2-section" id="contact" data-chapter="contact"><p className="v2-kicker">04 / START A CONVERSATION</p><h2 data-motion-heading><span className="v2-motion-line"><span className="v2-line-inner">Something worth</span></span><span className="v2-motion-line"><span className="v2-line-inner v2-line-accent">building together?</span></span></h2><a className="v2-button dark" href="https://github.com/Tdat10052499" target="_blank" rel="noopener noreferrer">Find me on GitHub ↗</a><SectionMay place="contact" /></section>
    </main><footer className="v2-footer"><a className="v2-brand" href="#home">teichi<span>®</span></a><p>Products. Research. A little curiosity.</p><a href="#home">Back to top ↑</a></footer>
    <dialog className="v2-dialog" ref={dialog} aria-labelledby="concept-title" onClose={() => trigger.current?.focus()} onClick={e => {if(e.target===dialog.current)dialog.current.close();}}><button className="v2-dialog-close" onClick={() => dialog.current?.close()} aria-label="Close concept">×</button><p className="v2-kicker">CONCEPT EXPLORATION</p><h2 id="concept-title">{concept}</h2><p>{concept==="Origin Collective" ? "An editorial marketplace concept exploring how digital creators can tell their story while making provenance and ownership understandable." : "An interface concept exploring how to explain cross-chain actions through a clear transaction timeline and explicit network states."}</p><p>This is a design exploration, not a released product.</p></dialog>
  </div>;
}


