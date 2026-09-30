import React from "react";
import MotionProvider from "../components/MotionProvider";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Ticker from "../components/Ticker";
import SelectedWork from "../components/SelectedWork";
import Research from "../components/Research";
import Hackathon from "../components/Hackathon";
import About from "../components/About";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <MotionProvider>
      <a className="skip-link" href="#work">Skip to content</a>
      <Header />
      <main>
        <Hero />
        <Ticker />
        <SelectedWork />
        <Research />
        <Hackathon />
        <About />
        <Contact />
      </main>
      <Footer />
    </MotionProvider>
  );
}
