# Uncomplic8 Tech — Project Rules & Architecture

This document serves as the master reference for the Uncomplic8 Tech portfolio project, outlining the technical stack, architectural patterns, design system, and core interaction rules. 

## 1. Technology Stack
- **Framework:** Next.js 16 (App Router) with React 19 and TypeScript.
- **Styling:** Tailwind CSS v4. Custom theme values are defined using the `@theme` directive in `globals.css` rather than a `tailwind.config.ts` file.
- **Animation Engine:** GSAP (GreenSock) heavily utilized alongside `@gsap/react` and `ScrollTrigger`. `Framer Motion` (via `motion/react`) is also used for specific component-level interactions (like mobile swiping cards).
- **Icons:** Lucide React and Huge Icons.

## 2. Design System & Aesthetics (Hallmark · Editorial)
The project aims for a premium, agency-tier aesthetic, explicitly avoiding generic AI or template-driven looks.
- **Macrostructure:** Flow-Based (story-scroll narrative sections) + Marquee Heroes.
- **Color Palette:**
  - **Light Mode:** Soft beige paper (`#F5F0E8`), dark gray text (`#1a1a1a`).
  - **Dark Mode:** Dark brownish gray (`#151412`), soft beige text (`#F5F0E8`).
  - **Accent:** Terracotta Orange (`#fd5200`) used sparingly (≤ 5% per viewport) to draw attention and add punchiness.
- **Typography:**
  - *Display / Serifs:* `Instrument Serif` (Expressive, highly tracked-in headings).
  - *Sans / Body:* `Plus Jakarta Sans`, `Inter`, and `Geist`.
- **UI Textures & Depth:**
  - *Skeuomorphism:* Deep physical cards with drop shadows, inset borders, and dynamic lighting reacting to mouse coordinates (e.g., in `CinematicHero`).
  - *Liquid Glass:* Custom backdrop-filter effects (`.liquid-glass`) with luminosity blends.
  - *Hardware Mockups:* Detailed, CSS-driven hardware frames (e.g., iPhone bezels with physical buttons and dynamic island notches).

## 3. Core Components & Interaction Patterns
Almost all major components override default scrolling behavior using GSAP pinning and scrubbing to create a cinematic experience.

- **`PrismaHero` (`prisma-hero.tsx`):**
  - A 400vh deep scroll-scrubbed hero section.
  - Features a pinned video background masked dynamically via `clip-path`.
  - Staggered typography reveals and animated UI elements (top bar, scroll indicator).
- **`FlowArt` / `FlowSection` (`story-scroll.tsx`):**
  - Narrative scrolling sections that pin and reveal sequentially.
  - Minimalist, wide editorial typography with horizontal dividers separating content blocks.
- **`CinematicHero` (`cinematic-landing-hero.tsx`):**
  - A highly complex, interactive 3D component.
  - Implements high-performance mouse tracking via `requestAnimationFrame` to rotate a physical card and phone mockup in 3D space.
  - Features animated widgets, floating badges, and progress rings.
- **`RadialScrollGallery` (`portfolio-and-image-gallery.tsx`):**
  - A scroll-driven circular wheel interaction pinned on scroll to showcase the agency workflow.
- **`MobileWorkflowVariant` (`animated-cards-stack.tsx`):**
  - An alternative to the radial gallery for mobile devices. 
  - Implements Tinder-like swiping stacked cards using Framer Motion's `drag` properties.
- **`Skiper39` & `CrowdScene` (`crowd-canvas.tsx`):**
  - A dense, moving crowd footer strip.
  - Spawns a pool of DOM images (Open Peeps) and animates them horizontally with a walking bob effect using GSAP timelines.
- **`ContactFAB` (`crowd-canvas.tsx`):**
  - An expandable floating action button utilizing GSAP spring animations to reveal contact links (WhatsApp, Phone, Email) radially/vertically.

## 4. Engineering Guidelines
- **Performance First:** Use `will-change-transform` and hardware acceleration (e.g., `translateZ(0)`) on heavy animations. Prefer opacity and transform animations over layout-triggering properties.
- **Responsive Animations:** Conditionally apply or tweak animations based on viewport size (e.g., scaling down the crowd scene density on mobile, using swiping cards instead of a complex radial gallery).
- **Accessibility:** Respect `prefers-reduced-motion` where appropriate to disable or simplify GSAP timelines.
- **DOM Purity:** Avoid over-nesting. Build isolated GSAP contexts (`useGSAP`) to prevent memory leaks and ensure clean timeline teardowns on unmount.
