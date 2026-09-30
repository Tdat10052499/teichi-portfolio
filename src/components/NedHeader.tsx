"use client";

import React from "react";
import Link from "next/link";
import { useMotion } from "./MotionProvider";

export default function NedHeader() {
  const { motion, toggleMotion } = useMotion();
  
  return (
    <header className="case-nav">
      <Link className="brand" href="/">td<span>®</span></Link>
      <Link href="/#work">← Back to portfolio</Link>
      <button id="motion" aria-pressed={!motion} onClick={toggleMotion}>
        {motion ? "Motion on" : "Motion off"}
      </button>
    </header>
  );
}
