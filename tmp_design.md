# Portfolio design handoff — 2026-10-01

Source branch: `feat/portfolio-products-research`.

## Scope

A light editorial homepage with separate Products and Research, responsive layouts, phrase reveals, soft section transitions, contextual Mây companions and an interactive contour background. Source is native Next.js App Router, not a static HTML replacement. `WORKSPACE_PROMPT.md` is the current integration prompt. The previous N.E.D-only prompt is retained at `handoff/NED_WORKSPACE_PROMPT.md` for historical context; its old homepage palette is superseded.

## File map

| File | Responsibility |
| --- | --- |
| src/app/page.tsx | Homepage entry and motion provider |
| src/app/portfolio-home.css | Scoped layout, responsive styles, motion and Mây gestures |
| src/components/PortfolioHome.tsx | Products, research, about, contact, preview and dialog |
| src/components/Atmosphere.tsx | Decorative Canvas 2D contours, pointer response, ripples and scroll |
| src/components/SectionMay.tsx | Five contextual sprite scenes, visibility and interaction lifecycle |
| src/components/usePortfolioMotion.ts | GSAP headings, sections and parallax |
| src/components/MotionProvider.tsx | Motion preference, Lenis and anchor navigation |
| src/components/MayMascot.tsx | Keep legacy mascot DOM owned by React |
| src/app/research/signed-but-stale/page.tsx | Research overview, under review |

Existing assets: `public/assets/may-sprite.png`, `public/assets/ned/design-home.webp`, `design-xstocks.webp`, `design-detail.webp`. Dependencies already in package-lock.json: Next.js, React, GSAP, Lenis. No new runtime package required.

## Routes

- `/`: redesigned homepage; anchors `#home`, `#products` (`#work` alias), `#research`, `#about`, `#hackathon`, `#contact`.
- `/projects/ned-wallet` and `#demo`: preserve existing case study and sample demo.
- `/research/signed-but-stale`: overview; back link to `/#research`.
- Development: no prefix. Current static production export: `/teichi-portfolio` via next.config.ts. Next Link handles the prefix; public asset URLs use the same production prefix.

## Integration

Fetch the source branch and compare with your actual workspace HEAD. Merge or selectively port changes after preserving local edits. Keep existing user work and the latest main changes. Do not overwrite the app with legacy handoff/dist files. Do not execute legacy fix scripts as part of integration. Read WORKSPACE_PROMPT.md for the full instructions.

## Validation and release

Build, TypeScript and lint of modified components were checked locally. Browser checks covered widths 320–2560, section-contained Mây, interactions, route navigation, reduced motion and canvas motion-off. Review layout again after integrating any workspace-specific CSS. Mây gestures reuse the existing sprite poses plus transforms, not newly drawn animation frames.

Pushing this branch does not publish the website. The existing Pages workflow deploys main/nextjs-migration; merging the PR to main can trigger deployment. No deployment configuration is changed by this handoff.
