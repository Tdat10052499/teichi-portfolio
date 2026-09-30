export interface ProjectData {
  id: string;
  title: string;
  type: string;
  intro: string;
  challenge: string;
  approach: string;
  stack: string[];
  note: string;
  link?: string;
}

export const studies: ProjectData[] = [
  {
    id: "ned",
    title: "N.E.D Wallet",
    type: "01 / UNIHACKFEST 2026 · PROJECT OWNER",
    intro: "Hold dollars. Invest in US stocks.",
    challenge: "N.E.D Wallet brings a focused financial product idea into UniHackfest 2026: a single wallet experience for holding dollars and investing in US stocks.",
    approach: "I participated as project owner of N.E.D Wallet. This portfolio records the project, its product direction, and my role. Product screenshots, implementation details, and a demo can be added as the project story develops.",
    stack: ["N.E.D Wallet", "Project owner", "UniHackfest 2026"],
    note: "Hackathon project · Product availability and investment services are not offered by this portfolio.",
    link: "/projects/ned-wallet"
  },
  {
    id: "origin",
    title: "Origin Collective",
    type: "02 / CONCEPT · DIGITAL OWNERSHIP",
    intro: "An expressive home for independent digital creators.",
    challenge: "Collecting digital work should preserve the artist’s story while making provenance and ownership clear. Origin explores that balance through an editorial marketplace concept.",
    approach: "Collection pages put the work first, then reveal edition details and ownership history. Considered motion connects browsing, inspecting, and collecting. Wallet states remain legible throughout the experience.",
    stack: ["React", "Three.js", "GSAP", "ERC-721"],
    note: "Concept project · Illustrative portfolio case study",
  },
  {
    id: "relay",
    title: "Relay Network",
    type: "03 / CONCEPT · DEVELOPER EXPERIENCE",
    intro: "Complex infrastructure, a clearer interface.",
    challenge: "Cross-chain actions involve multiple networks and asynchronous steps. Relay explores how to make those transitions understandable without burying users in implementation details.",
    approach: "A unified transaction timeline shows source confirmation, relay progress, and destination settlement. Network selection is explicit, and recoverable errors offer a clear next action.",
    stack: ["TypeScript", "EVM", "React", "Event indexing"],
    note: "Concept project · Illustrative portfolio case study",
  }
];

export const skills = [
  "Solidity", "TypeScript", "React", "Three.js", "Ethereum", "GSAP"
];
