"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotion } from "./MotionProvider";
import "./ned-architecture.css";
import NedModuleModel from "./NedModuleModel";

const flows = {
  transfer: { label: "USDC transfer", badge: "DEVNET / SOURCE FLOW", summary: "A reviewed transfer becomes a signed transaction, then a network result returns to the wallet.", steps: [
    { title: "The experience", tech: "Expo · React Native", icon: "01", action: "Prepare", detail: "The user chooses a recipient and an amount. TypeScript, Expo Router and Zustand organize the interface and application state.", packet: "Transfer intent" },
    { title: "Wallet & identity", tech: "Dynamic · Anchor / Rust", icon: "02", action: "Review & sign", detail: "Dynamic provides Google sign-in and an embedded Solana wallet. Anchor identity PDAs support on-chain identity records; they are not a relay through which every transfer must pass. Signing requires the wallet flow.", packet: "Signed transaction" },
    { title: "Network access", tech: "Solana RPC · Helius", icon: "03", action: "Submit", detail: "The application uses its configured Solana RPC connection to send the transaction and read network state. The transfer path documented in this snapshot targets Devnet.", packet: "Submit / read status" },
    { title: "Settlement", tech: "Solana Devnet · USDC", icon: "04", action: "Confirm", detail: "Devnet processes the transfer. Status and balances are read back into the wallet. SOL is still needed for network fees; this is not a claim of sponsored or production-ready transfers.", packet: "Status → wallet" },
  ]},
  market: { label: "Market data", badge: "READ-ONLY / APP DATA", summary: "Market information supports exploration. Reading a quote or a chart does not execute a trade.", steps: [
    { title: "Explore an asset", tech: "Expo · React Native", icon: "01", action: "Request", detail: "The app selects the token or asset information needed by an exploration or review screen.", packet: "Asset / quote request" },
    { title: "Data providers", tech: "Jupiter · GeckoTerminal", icon: "02", action: "Read", detail: "Jupiter supplies swap quotes and GeckoTerminal supplies chart data. These are separate requests by purpose, grouped here as a conceptual data layer.", packet: "Quote / chart response" },
    { title: "Review context", tech: "Read-only Mainnet data", icon: "03", action: "Explain", detail: "The application presents market context and estimated output. Mainnet data in demo flows is read-only; no transaction is signed or broadcast by those demo trading flows.", packet: "Display data" },
    { title: "An informed screen", tech: "App state · UI", icon: "04", action: "Display", detail: "The response updates the screen. This portfolio’s embedded walkthrough uses fixed fixtures instead of calling these providers.", packet: "No settlement" },
  ]},
  demo: { label: "Portfolio demo", badge: "LOCAL / FIXED FIXTURES", summary: "Follow the demo on this page: all changes stay in the browser’s sample ledger.", steps: [
    { title: "Choose & enter", tech: "Next.js portfolio · React", icon: "01", action: "Input", detail: "Choose AAPLx or NVDAx and enter a sample USD amount. This website is separate from the Expo product application.", packet: "Sample amount" },
    { title: "Validate & quote", tech: "Fixed prices · 0.25% example fee", icon: "02", action: "Validate", detail: "Check the amount and available balance, then calculate a quantity and an illustrative fee from fixed fixtures. No market API or wallet connection is involved.", packet: "Sample quote" },
    { title: "Review & agree", tech: "Explicit sample-data acknowledgement", icon: "03", action: "Review", detail: "The user checks the calculation and acknowledges that only sample data changes. This is not a wallet signature.", packet: "Local confirmation" },
    { title: "Update the ledger", tech: "React state · session only", icon: "04", action: "Update", detail: "Cash and holdings update in memory. Reset or refresh restores the fixtures. No real funds, token ownership or blockchain state changes.", packet: "Balance → screen" },
  ]},
};
type Flow = keyof typeof flows;
export default function NedArchitecture() {
  const { motion } = useMotion();
  const root = useRef<HTMLDivElement>(null);
  const [flow, setFlow] = useState<Flow>("transfer");
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const current = flows[flow];
  useEffect(() => {
    const el = root.current; if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .15 });
    observer.observe(el);
    const visibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", visibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", visibility); };
  }, []);
  useEffect(() => {
    if (!motion || !playing || !visible || !pageVisible) return;
    const timer = window.setInterval(() => setStep(n => (n + 1) % 4), 3200);
    return () => clearInterval(timer);
  }, [motion, playing, visible, pageVisible]);
  useEffect(() => {
    if (!motion) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".ned-node", { y: 65, rotationX: -18, rotationY: -8, scale: .94, duration: 1, stagger: .16, ease: "power3.out", clearProps: "transform", scrollTrigger: { trigger: root.current, start: "top 80%", once: true } });
    }, root);
    return () => ctx.revert();
  }, [motion]);
  const running = motion && playing && visible && pageVisible;
  return <div ref={root} className={`ned-system ${running ? "is-running" : ""}`}>
    <div className="ned-system-toolbar"><div role="group" aria-label="Architecture flow">{(Object.keys(flows) as Flow[]).map(key => <button key={key} aria-pressed={flow === key} onClick={() => {setFlow(key);setStep(0);setPlaying(false);}}>{flows[key].label}</button>)}</div><span>{current.badge}</span></div>
    <p className="ned-system-summary">{current.summary}</p>
    <div className="ned-system-scene" aria-label="Four architecture layers. Select a block for details.">
      {current.steps.map((item, i) => <div className="ned-node-slot" key={i}>
        <button className={`ned-node ${step === i ? "is-active" : ""} ${step > i ? "is-passed" : ""}`} aria-pressed={step === i} aria-controls="ned-system-detail" onClick={() => {setStep(i);setPlaying(false);}}>
          <span className="ned-module-index">MODULE / {item.icon}</span><NedModuleModel index={i} />
          <span className="ned-node-title">{item.title}</span><span className="ned-node-tech">{item.tech}</span>
        </button>
        {i < 3 && <div className={`ned-data-link ${step === i ? "is-active" : ""}`} aria-hidden="true"><span /><i /><b>→</b></div>}
      </div>)}
    </div>
    <div className="ned-system-controls"><span>DATA PATH / {String(step + 1).padStart(2,"0")} OF 04</span><div><button onClick={() => {setStep(n => (n + 3) % 4);setPlaying(false);}} aria-label="Previous data step">←</button><button disabled={!motion} aria-pressed={playing && motion} onClick={() => setPlaying(v => !v)}>{playing && motion ? "Pause flow" : "Play data flow"}</button><button onClick={() => {setStep(n => (n + 1) % 4);setPlaying(false);}} aria-label="Next data step">→</button></div></div>
    <div id="ned-system-detail" className="ned-system-detail" aria-live={playing && motion ? "off" : "polite"}><div><small>{current.steps[step].action}</small><h3>{current.steps[step].title}</h3><span className="ned-payload">{current.steps[step].packet}</span></div><p>{current.steps[step].detail}</p></div>
    <p className="ned-system-note">Conceptual sequence based on the documented source snapshot (28 Sep 2026). Packets illustrate direction, not live network traffic or measured latency. { !motion && "Motion is off. Use the arrows or select a block to follow each step." }</p>
  </div>;
}
