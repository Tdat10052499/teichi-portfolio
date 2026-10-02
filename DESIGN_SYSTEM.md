# Portfolio exhibition design system

## Context and goals
Present Teichi’s products and research as distinct, explorable chapters, pairing readable evidence with manipulable geometric studies.

The supplied Shape of Intelligence reference is an editorial exhibition, not an e-commerce storefront. The extracted 65 links, 45 buttons, 12 navigation elements, 9 lists and 4 inputs describe the reference capture; they are not target quotas. Content must remain Teichi’s own. No reference artwork or commercial font files are copied.

## Design tokens and foundations
The `.exhibition` scope in `src/app/exhibition.css` owns semantic tokens. Components must use these tokens for new styling. `--surface-paper` and `--text-ink` are the reading pair; `--surface-dark` and `--text-light` are the inverse pair; `--surface-action` is cobalt. The extracted dark text on black is not an allowed pairing. `--text-muted` is reserved for supporting copy on light surfaces.

`--font-ui` lists ABC Diatype followed by system fallbacks; the font must only be bundled if a suitable license is provided. Body uses `--size-body`, reading copy `--size-reading`, and metadata `--size-note/label`. The supplied small type scale is extended with fluid `--size-title/hero` for exhibition headings. Layout uses `--s-1` through `--s-8` and `--gutter`, extending the source’s micro-spacing scale. Motion uses `--speed-fast/normal/slow`; reduced motion must remove nonessential transitions.

## Component rules

| Family | Anatomy and interaction | Responsive and edge cases |
| --- | --- | --- |
| Chapter navigation | Number, name, active underline; real anchor links; pointer/touch activate and keyboard Tab/Enter navigate. Active state must use aria-current. | Horizontal scrolling must be local to navigation; section titles must clear its sticky height. |
| Hero sculpture | Original projected layers, three preset buttons, labelled native range and explanatory text. Arrow keys adjust; Home/End reach limits. Presets and drag/touch update the same value. | Smaller screens stack scene and controls; the model must not intercept page scrolling. Explicit adjustments remain available with Motion off. |
| Product preview | Screenshot, labelled pressed-state selectors, caption and case-study links. | Long captions must wrap; sample-data context must remain visible. Product imagery retains its own brand. |
| Research experiment | Three labelled version blocks, toggle and explanatory result. Enter/Space and pointer/touch must work. | State must use text as well as color. It must say the illustration is not experimental evidence. |
| Concept dialog | Title, description, close button, native dialog behavior. | Escape must dismiss, focus must return to opener; long content must remain scrollable. |
| Mây | Sprite, contextual note, semantic button in normal flow. | Must not cover other controls; offscreen animation pauses. Image failure must retain the textual fallback. |

Required state contract for each interactive family:
- Default must expose a descriptive label and readable content.
- Hover should change border, underline or surface without shifting surrounding layout.
- Focus-visible must have a visible 3px outline, including on range controls.
- Active/selected must use aria-pressed or aria-current as appropriate, plus a non-color indicator.
- Disabled must use native disabled where supported and must not accept actions.
- Loading is not applicable to the synchronous sculpture/shard controls; future asynchronous controls must use aria-busy, retain dimensions and provide a text status.
- Error must use readable text and aria-invalid for erroneous fields, and provide recovery. Do not create fake loading/error states for synchronous controls.
- Empty states must explain unavailable content; fabricated project or publication data is prohibited.

## Accessibility requirements and acceptance criteria
- Normal text must meet 4.5:1 contrast; large text and meaningful control boundaries must meet 3:1. Measure the actual foreground/background pair.
- Every interactive action must be usable without pointer input; test Tab, Shift+Tab, Enter, Space, range arrows, Home/End and Escape.
- Controls must have at least 24px targets; the implementation should use 44px for primary controls.
- At 320px width and 200% zoom, text and controls must remain available without page-wide horizontal scrolling.
- Motion off and prefers-reduced-motion must stop automatic/decorative transitions without hiding content or disabling manual exploration.
- Decorative geometry must be hidden from assistive technology; equivalent context must be available in text.
- Live updates must be concise and must not announce every automatic animation frame.

## Content and tone
Use concise labels tied to actions: “Align the versions”, “Read research overview”, “Try sample demo”. Keep Products and Research distinct. Say “Under review” rather than “Published” for the paper. Say “Concept exploration” for unshipped work. Do not invent awards, performance results, publication URLs or financial capabilities.

## Anti-patterns and migration
Do not pair dark text with the extracted black surface. Do not constrain all headings to the extracted 16px maximum. Do not add commerce flows, automatic audio, hidden native cursors, scroll traps, copied reference text or unlicensed font files. Do not run older patch scripts.

The homepage receives the exhibition scope; the N.E.D case study preserves its distinct ivory/lavender product context and tested architecture interactions. Existing routes, asset prefix behavior and responsive fallbacks must be preserved. The previous ambient hero canvas remains available to N.E.D; the homepage now uses direct sculpture controls instead.

## QA checklist
- [ ] Compare normal, hover, keyboard focus, selected, disabled and applicable error/loading states.
- [ ] Verify sculpture presets, range keyboard controls and shard toggle outcomes.
- [ ] Check chapter links, product routes, dialog focus return and mobile menu.
- [ ] Inspect 320, 390, 768, 1440 and 2560px layouts and 200% zoom.
- [ ] Verify no inaccessible contrast pairs and no clipped controls.
- [ ] Test reduced motion and Motion off.
- [ ] Run component lint, TypeScript/build and browser error checks.

The checklist defines acceptance work; it is not a claim of a full WCAG audit.

## Exhibition layout revision — 1 October 2026
- Homepage must use a full-width typographic cover, an interactive sculpture and distinct Products / Research / About / Contact chapters.
- Desktop prologue must rotate three authored statements on successive 3D faces in 90-degree steps, with reading pauses. GSAP pins only this stage; scroll direction must reverse the same timeline.
- The prologue must return to normal document flow at 900px and below, when motion is disabled, and for reduced-motion preferences. All three statements must remain available to assistive technology.
- Chapter headings and installations should translate gently with scroll. Body copy and interactive controls must remain readable throughout; no whole-section opacity gates.
- Fixed chapter navigation must leave sufficient footer clearance. Product and research detail routes must retain their existing URLs.
- The reference is https://shapeofintelligence.com/. The implementation reconstructs observed composition and scroll behavior with original portfolio content; exact source timing and proprietary assets are not reused.

Verified this revision: production build, changed-file lint; browser checks at 320, 390, 768 and 2560px for horizontal overflow; desktop prologue scroll and reverse; anchor navigation; motion-off unpinning; keyboard range input; shard alignment control. This is targeted verification, not a full accessibility audit.


## Scroll behavior revision — 2 October 2026
- Research title movement must start at the section top, with zero initial displacement. It must follow scroll distance 1:1 until the top of the title group meets the top of the question figure, then stop translating within the section.
- The title and figure must use separate columns. Space below the title must be reserved so paper details remain unobstructed.
- Research docking must deactivate below 901px, for reduced motion, and when Motion is off. Cleanup must restore normal flow and remove animation-specific spacing.
- Verified: desktop start, intermediate 144px scroll/displacement, and final alignment; TypeScript and changed-component lint. Production build passed with network access restored on 2 October 2026.
