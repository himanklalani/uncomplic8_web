# Design — Portfolio

A locked design system for this portfolio. Every page redesign reads this file before emitting code.

## Genre
editorial

## Macrostructure family
- Marketing pages: Flow-Based (story-scroll narrative sections) + Marquee Hero
- App pages: N/A
- Content pages: N/A

## Theme
- `--color-background` oklch(14% 0.01 60) /* Very dark brownish gray */
- `--color-foreground` oklch(95% 0.02 60) /* Soft beige paper */
- `--color-muted`      oklch(20% 0.01 60)
- `--color-accent`     oklch(60% 0.18 40) /* Terracotta Orange (#fd5200) */
- `--color-border`     oklch(25% 0.01 60)

## Typography
- Display: var(--font-geist-sans), sans-serif, weight 700
- Body:    var(--font-geist-sans), sans-serif, weight 400
- Display tracking: -0.04em
- Type scale anchor: --text-display = clamp(3.5rem, 12vw, 14rem)

## Spacing
4-point named scale. 

## Motion
- Reveal pattern: fade + vertical slide
- Reduced-motion fallback: opacity-only, ≤ 150 ms.

## What pages MUST share
- The accent colour (Terracotta Orange) placement (≤ 5% per viewport).
- The display + body fonts (Geist).
- Section heading rhythm (numeral + label + display heading pattern).

## Exports
(See globals.css for active Tailwind setup)
