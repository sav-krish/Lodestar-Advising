# Lodestar redesign implementation plan

**Goal:** A polished, personal college counseling website with a smooth acceptance letter controlled by scrolling, preserving the existing typography and navy/gold identity.

**Authority:** User explicitly authorizes redesign choices, implementation, and deployment. Proceed without additional design approval.

**Architecture:** Keep React, Vite, TanStack Router, and Tailwind. Use a sticky scroll stage with animation values written directly to CSS properties once per animation frame. No animation dependency. Render offers from `src/data/programs.ts`.

## Constraints

- Preserve Cormorant Garamond, Cinzel, Inter and existing palette tokens.
- Preserve the two current offers and authentic review data; invent no results, credentials, prices, guarantees, or testimonials.
- Native scrolling, keyboard navigation, touch layout, reduced motion, and a skip link must work.
- Existing contact and scheduling destinations remain functional.

## Tasks

- [x] Redesign homepage, founder introduction, service overview, process, proof, and calls to action. Own `src/routes/index.tsx`, `src/components/WhyChooseUs.tsx`, `src/styles/home.css`.
- [x] Replace one-shot acceptance animation with a reversible scroll timeline, dimensional envelope and rotating letter, branded confetti, accessible static fallback, and skip control. Own `src/components/AcceptanceLetter.tsx`, `src/styles/acceptance.css`, and adjacent motion utility/tests.
- [x] Refine shared navigation, remove blocking intro, improve focus/target sizes, and simplify generic reveal effects. Own header/root/styles.
- [x] Validate current offers, motion math, production build, TypeScript, targeted lint, desktop/mobile visuals, keyboard/menu, reduced motion, no horizontal overflow, scrolling forward/back, and direct route navigation.
- [x] Fresh independent code review; fix material findings. Commit and push the verified change, publish to the existing Vercel project, and verify the live domain.

## Review focus

Fast scrolling and reverse scrolling must keep layers synchronized. Short viewports and mobile screens must show the letter without clipping. Reduced motion must bypass the long pinned experience and show useful content immediately. Navigation must remain reachable at tablet widths and with a keyboard. No service scope or review claims may drift from source data.

## Verification record

TypeScript, targeted ESLint, production Vite build, and 12 Bun tests pass. Independent review identified insights routing and short-screen menu issues; both fixed. Visual checks completed at 1280×720, 390×844, 375×667, and 844×390. Native section skip, mobile Escape, reverse scroll, and static short-screen fallback checked. Hero asset changed from 8.18 MB GIF to 333 KB JPG.

Deployment: existing Vercel project `lodestar-advising`; custom domain registration remains with Lovable. Replaced locked hosting records after disconnecting the old apex and www project bindings. Apex redirects to www; both DNS configurations verified and both certificates active. Production homepage and direct services route return HTTP 200.
