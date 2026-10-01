"use client";

import React from "react";
import Link from "next/link";
import { useMotion } from "./MotionProvider";

export default function NedHeader() {
  const { motion, toggleMotion } = useMotion();
  
  return (
    <header className="case-nav">
      <Link className="brand" href="/">teichi<span>®</span></Link>
      <Link href="/#products">← Back to portfolio</Link>
      <button id="motion" aria-pressed={!motion} onClick={toggleMotion}>
        {motion ? "Motion on" : "Motion off"}
      </button>
    </header>
  );
}
