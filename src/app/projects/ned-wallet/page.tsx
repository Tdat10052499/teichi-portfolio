import React from "react";
import MotionProvider from "@/components/MotionProvider";
import NedWalletDemo from "@/components/NedWalletDemo";
import NedScrollEffects from "@/components/NedScrollEffects";
import Link from "next/link";
import "./ned.css";
import "../../portfolio-home.css";
import "./ned-editorial.css";
import Atmosphere from "@/components/Atmosphere";
import SectionMay from "@/components/SectionMay";

import NedArchitecture from "@/components/NedArchitecture";
import NedHeader from "@/components/NedHeader";

export default function NedCaseStudy() {
  const basePath = process.env.NODE_ENV === 'production' ? '/teichi-portfolio' : '';

  return (
    <MotionProvider>
      <div className="portfolio-v2 ned-editorial">
      <a className="skip" href="#ned-chapter-2">Skip to interactive demo</a>
      <NedHeader />
      <NedScrollEffects />
      <main>
        <section className="case-hero" id="ned-chapter-0">
          <Atmosphere />
          <div className="hero-text">
            <p className="eyebrow">PRODUCT NOTES / 2026</p>
            <div className="badges">
              <span>IN DEVELOPMENT</span>
              <span>PROJECT OWNER</span>
            </div>
            <p className="ned-product-name">N.E.D Wallet</p><h1>Familiar money.<br /><em>New possibilities.</em></h1>
            <p className="lead">N.E.D Wallet brings familiar money interactions to Solana: Google sign-in, USDC transfers, and an approachable way to explore tokenized stocks.</p>
            <div className="hero-actions">
              <a className="button lime" href="#ned-chapter-2">Try the prototype <span>↗</span></a>
              <a className="text-link" href="#ned-chapter-1">Explore the story ↓</a>
            </div>
            <dl className="hero-facts">
              <div><dt>Role</dt><dd>Project owner</dd></div>
              <div><dt>Context</dt><dd>UniHackfest 2026</dd></div>
              <div><dt>Platform</dt><dd>Web / Android direction</dd></div>
            </dl>
          </div>
          <div className="hero-art" aria-label="N.E.D Wallet design previews">
            <span className="art-word">N.E.D</span>
            <img className="hero-screen back-screen" src={`${basePath}/assets/ned/design-xstocks.webp`} alt="xStocks list from the product design" width="277" height="600" />
            <img className="hero-screen front-screen" src={`${basePath}/assets/ned/design-home.webp`} alt="N.E.D home design with purple wallet cards" width="277" height="600" />
            <p>PRODUCT DESIGN / SAMPLE BALANCES</p>
          </div>
        </section>
        
        <section className="story-section" id="ned-chapter-1"><span id="story" className="ned-anchor" />
          <div className="section-top">
            <p className="eyebrow">01 / THE PRODUCT QUESTION</p>
            <h2>What if the first step<br />felt <em>familiar?</em></h2>
          </div>
          <div className="story-grid">
            <p className="large-copy">A wallet can speak the language of everyday money, even when the infrastructure underneath is on-chain.</p>
            <div>
              <p>N.E.D explores a Web2.5 experience for people who are unfamiliar with crypto. The direction is USDC-first: reduce jargon, make the next action clear, and explain what a transaction means before asking someone to confirm it.</p>
              <p>I joined UniHackfest 2026 as <strong>project owner</strong>. This case study documents the team's product direction, design and repository state. Individual implementation contributions are not attributed beyond that confirmed role.</p>
              <p className="small-note">Development snapshot: 28 September 2026 · Repository commit <code>68e5cc7</code>. Product capabilities may evolve.</p>
            </div>
          </div>
          <SectionMay place="products" preview="the product direction" />
          <div className="principles">
            <article>
              <span>01</span>
              <h3>Start with Google.</h3>
              <p>Embedded-wallet onboarding aims to make the first step familiar, without asking newcomers to manage a seed phrase in the interface.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Show the money clearly.</h3>
              <p>Cash, tokens and investments get distinct labels. Simple and Crypto are views of the same wallet, not separate accounts.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Review before acting.</h3>
              <p>Fees, estimated output and transaction context belong before confirmation. The user stays in control.</p>
            </article>
          </div>
        </section>

        <NedWalletDemo />

        <section className="design-section" id="ned-chapter-3">
          <div className="section-top">
            <p className="eyebrow">03 / A DISTINCT PRODUCT IDENTITY</p>
            <h2>Calm surfaces.<br /><em>A little personality.</em></h2>
            <p>N.E.D's purple identity lives inside the project. The portfolio frames it with quiet ivory surfaces and Mây as your companion.</p>
          </div>
          <div className="design-strip">
            <div className="swatch purple">
              <span>#7B2FBE</span>
              <strong>N.E.D Purple</strong>
            </div>
            <div className="swatch ink">
              <span>#0A0A0A</span>
              <strong>Dark-first surfaces</strong>
            </div>
            <div className="type-swatch">
              <span>SPACE GROTESK / INTER / SPACE MONO</span>
              <strong>Aa<br />$1,234.56</strong>
            </div>
          </div>
          <div className="gallery">
            <figure>
              <img src={`${basePath}/assets/ned/design-home.webp`} alt="Designed home screen with Cash, Crypto and Stocks cards" loading="lazy" width="277" height="600" />
              <figcaption>Home / Make the balance readable</figcaption>
            </figure>
            <figure>
              <img src={`${basePath}/assets/ned/design-xstocks.webp`} alt="Designed xStocks screen with asset allocation and stock list" loading="lazy" width="277" height="600" />
              <figcaption>xStocks / Explore and compare</figcaption>
            </figure>
            <figure>
              <img src={`${basePath}/assets/ned/design-detail.webp`} alt="Designed Apple token detail with chart, position and buy/sell actions" loading="lazy" width="277" height="600" />
              <figcaption>Asset detail / Context before action</figcaption>
            </figure>
          </div>
          <p className="small-note">Selected screens from the supplied NED Wallet Design System. Figures, balances and market values are design examples, not user results.</p>
        </section>

        <section className="status-section" id="ned-chapter-4">
          <div className="section-top">
            <p className="eyebrow">04 / WHAT EXISTS TODAY</p>
            <h2>A working direction.<br /><em>An honest status.</em></h2>
          </div>
          <div className="status-grid">
            <article>
              <span className="status-tag">IMPLEMENTED IN SOURCE</span>
              <h3>The wallet foundation</h3>
              <ul>
                <li>Google sign-in and embedded Solana wallet through Dynamic.</li>
                <li>Onboarding and on-chain identity records.</li>
                <li>USDC transfer flow on Devnet; username and optional phone lookup.</li>
                <li>Balance, history and dApp-browser code.</li>
              </ul>
              <p>Repository evidence, not a claim of production readiness or a security audit.</p>
            </article>
            <article>
              <span className="status-tag purple-tag">DEMO FLOWS</span>
              <h3>Trading, without settlement</h3>
              <ul>
                <li>SOL/USDC swap review using Jupiter quotes.</li>
                <li>xStocks list, detail, buy/sell and demo ledger.</li>
                <li>Read-only Mainnet market data for the app's demo.</li>
                <li>No signing or broadcast in these demo trading flows.</li>
              </ul>
              <p>The embedded portfolio walkthrough above uses fixed fixtures, not those live APIs.</p>
            </article>
            <article>
              <span className="status-tag muted-tag">DESIGN / ROADMAP</span>
              <h3>The next layers</h3>
              <ul>
                <li>Simple Earn and its deposit/withdraw experience.</li>
                <li>T.E.D “Plan my money”; latest direction is rule-based.</li>
                <li>Complete Simple/Crypto conversion behavior.</li>
                <li>Further device testing and product refinement.</li>
              </ul>
              <p>These should not be presented as fully available product features.</p>
            </article>
          </div>
          <div className="reality-note">
            <strong>Design is not a release note.</strong>
            <p>The supplied PDF includes fee-free wording. The newer project notes say gas sponsorship is not available. Devnet transfers require SOL; example APYs and demo returns are not promises.</p>
          </div>
        </section>

        <section className="engineering-section" id="ned-chapter-5">
          <p className="eyebrow">05 / UNDER THE INTERFACE</p>
          <h2>Built around <em>Solana.</em></h2>
          <p className="engineering-note">Follow an action through the system. Choose a flow, explore each layer, or play a sequence to see how information moves.</p>
          <NedArchitecture />
          <p className="engineering-note">Reanimated, i18next and React Native SVG support the interface. GeckoTerminal supplies chart data and SNS resolves .sol names. The current product is an Expo application; it is separate from the portfolio’s Next.js website.</p>
          <div className="source-links">
            <a className="button" href="https://github.com/Tdat10052499/Unihackfest-2026" target="_blank" rel="noopener noreferrer">Explore the repository ↗</a>
            <a className="text-link" href="https://github.com/Tdat10052499/Unihackfest-2026/blob/68e5cc7fb6a990d8e2fdddbd470a25f2e02a76c7/docs/02-thiet-ke/ui-pdf-alignment.md" target="_blank" rel="noopener noreferrer">Read implementation notes ↗</a>
          </div>
        </section>

        <section className="closing" id="ned-chapter-6">
          <p className="eyebrow">06 / WHAT COMES NEXT</p>
          <h2>Keep testing.<br /><em>Keep making it clearer.</em></h2>
          <p>The next milestone is confidence in the core experience: clear transaction states, consistent sample/live-data labels, and validation on real devices. This case study will grow with the product.</p>
          <Link className="button lime" href="/#contact">Talk about the project ↗</Link><SectionMay place="contact" />
        </section>
      </main>

      <footer>
        <Link href="/">← Teichi D. portfolio</Link>
        <span>N.E.D / UniHackfest 2026 / In development</span>
      </footer>
    </div>
    </MotionProvider>
  );
}
