# Teichi D. Portfolio

A professional portfolio focusing on Web3, Blockchain, and Creative Engineering, built with Next.js, TypeScript, GSAP, and Lenis.

## Features

- **Next.js App Router**: Fast, optimized server-first architecture.
- **GSAP & Lenis**: Smooth scrolling and fine-tuned scroll-based animations.
- **Canvas 2D**: Highly optimized pixel art companion (Mây) and interactive background field.
- **Responsive & Accessible**: Works perfectly across devices while respecting system preferences like reduced motion.

## Getting Started

### Installation

Clone the repository and install the dependencies:

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build & Production

To build the application for production:

```bash
npm run build
```

After building, start the production server:

```bash
npm run start
```

## Modifying Content

The portfolio data is separated from the UI presentation to make content updates easy. 

To edit your projects, skills, or other portfolio information, open `src/data/portfolio.ts` and modify the structures there. The UI components will automatically reflect your changes.

## Deployment

This Next.js app is pre-configured and ready to be deployed on platforms like Vercel. Simply import your repository into Vercel and it will automatically detect the settings and deploy.

## Acknowledgements

- Built with [Next.js](https://nextjs.org/)
- Animation powered by [GSAP](https://gsap.com/)
- Smooth scrolling by [Lenis](https://lenis.darkroom.engineering/)
