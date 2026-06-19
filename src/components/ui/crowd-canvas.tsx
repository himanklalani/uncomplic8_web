"use client";

import { gsap } from "gsap";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { ThemeToggleButton } from "./theme-toggle";

/* ─────────────────────────────────────────────────────────────────────────────
   BUST PEEP SRCS — Open Peeps Bust PNGs (head + torso on white bg)
   mix-blend-mode: multiply drops white → clean ink figures on any bg
───────────────────────────────────────────────────────────────────────────── */
const BUST_SRCS = Array.from({ length: 50 }, (_, i) => `/images/busts/bust-${i + 1}.png`);

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ─────────────────────────────────────────────────────────────────────────────
   CrowdScene
   ─ Pool of individual walkers, randomized speed/direction based on user logic
   ─ 45 overlapping instances, continuous loop
───────────────────────────────────────────────────────────────────────────── */
export const CrowdScene = () => {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    // Dynamically scale crowd based on screen size to prevent mobile GPU crashes
    const isMobile = window.innerWidth < 768;
    const PEEP_COUNT = isMobile ? 70 : 150; 
    
    const walkers: { el: HTMLImageElement; tl: gsap.core.Timeline | null }[] = [];

    const randomRange = (min: number, max: number) => min + Math.random() * (max - min);

    // 1. Create DOM pool
    for (let i = 0; i < PEEP_COUNT; i++) {
      const el = document.createElement("img");
      el.draggable = false;
      el.alt = "";
      el.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        pointer-events: none;
        user-select: none;
        transform-origin: bottom center;
      `;
      stage.appendChild(el);
      walkers.push({ el, tl: null });
    }

    // 2. Launch individual walker
    const launchWalker = (walker: typeof walkers[0], isInitial = false) => {
      const el = walker.el;
      const stageW = stage.offsetWidth;

      // Random bust
      el.src = BUST_SRCS[Math.floor(Math.random() * BUST_SRCS.length)];

      const direction = Math.random() > 0.5 ? 1 : -1;
      
      // Depth sorting: split into 6 distinct rows
      const NUM_ROWS = 6;
      // Bias slightly towards the back rows (lower indices)
      const rowIndex = Math.floor(Math.pow(Math.random(), 1.2) * NUM_ROWS); 
      const depth = rowIndex / (NUM_ROWS - 1); // 0 = back, 1 = front

      // Use row index for base Z, plus random jitter to avoid completely identical z-indices
      const zIndex = (rowIndex * 10) + Math.floor(Math.random() * 5);
      
      const minSize = 70;
      const maxSize = 210;
      const size = minSize + depth * (maxSize - minSize);
      
      const maxBottomOffset = 260;
      // Shift down to hide transparent padding inside the PNGs and crop them cleanly
      const BASE_SHIFT = 50;
      const bottomOffset = ((1 - depth) * maxBottomOffset) - BASE_SHIFT;

      el.style.width = `${size}px`;
      el.style.zIndex = `${zIndex}`;
      el.style.bottom = `${bottomOffset}px`;

      let startX: number;
      let endX: number;

      if (direction === 1) { // Left to right
        startX = -size;
        endX = stageW + size;
        gsap.set(el, { scaleX: 1 });
      } else { // Right to left
        startX = stageW + size;
        endX = -size;
        gsap.set(el, { scaleX: -1 });
      }

      gsap.set(el, { x: startX, y: 0 });

      // Core logic imported from the original snippet
      const xDuration = 10;
      const yDuration = 0.25;

      const tl = gsap.timeline({
        onComplete: () => launchWalker(walker), // Loop when off-screen
      });
      
      tl.timeScale(randomRange(0.5, 1.5));
      
      // Horizontal walk
      tl.to(el, {
        duration: xDuration,
        x: endX,
        ease: "none",
      }, 0);
      
      // Vertical bob (walking bounce)
      // Since bottom is now pushed down, y bob won't expose the bottom edge
      tl.to(el, {
        duration: yDuration,
        repeat: Math.ceil(xDuration / yDuration),
        yoyo: true,
        y: -10, 
        ease: "sine.inOut"
      }, 0);

      walker.tl = tl;
      
      // Randomize initial positions so the crowd is fully populated on load
      if (isInitial) {
        tl.progress(Math.random());
      }
    };

    // 3. Start pool
    walkers.forEach((walker) => launchWalker(walker, true));

    return () => {
      walkers.forEach((w) => w.tl?.kill());
      while (stage.firstChild) stage.removeChild(stage.firstChild);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      aria-hidden="true"
      className="absolute bottom-0 left-0 w-full pointer-events-none"
      style={{
        height: "clamp(320px, 32vw, 420px)",
        overflow: "hidden",
        zIndex: 10,
      }}
    />
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   ContactFAB — Expandable floating contact button
   Opens: WhatsApp · Phone · Mail  (GSAP spring, all 8 states)
───────────────────────────────────────────────────────────────────────────── */
const PHONE         = "+919167672850";
const PHONE_DISPLAY = "+91 91676 72850";
const WA_URL        = `https://wa.me/${PHONE}?text=Hi%2C%20I%27d%20love%20to%20connect!`;
const MAIL          = "himanklalani@gmail.com";
const MAIL_URL      = `mailto:${MAIL}`;
const CALL_URL      = `tel:${PHONE}`;

type FABAction = { id: string; label: string; href: string; icon: React.ReactNode; color: string; target?: string };

const FAB_ACTIONS: FABAction[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    href: WA_URL,
    color: "#25D366",
    target: "_blank",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
  {
    id: "phone",
    label: PHONE_DISPLAY,
    href: CALL_URL,
    color: "#1a1a1a",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.8 9.87 19.79 19.79 0 01.74 1.22 2 2 0 012.73 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/>
      </svg>
    ),
  },
  {
    id: "mail",
    label: MAIL,
    href: MAIL_URL,
    color: "#fd5200",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/>
      </svg>
    ),
  },
];

export const ContactFAB = () => {
  const [open, setOpen] = useState(false);
  const menuRef  = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Set initial hidden state
  useEffect(() => {
    gsap.set(itemRefs.current.filter(Boolean), { y: 0, opacity: 0, scale: 0.6 });
    gsap.set(labelRefs.current.filter(Boolean), { opacity: 0, x: 10 });
  }, []);

  // Animate open / close
  useEffect(() => {
    const items  = itemRefs.current.filter(Boolean) as HTMLAnchorElement[];
    const labels = labelRefs.current.filter(Boolean) as HTMLSpanElement[];

    if (open) {
      gsap.to(items, {
        y: (i) => -(60 + i * 62),
        opacity: 1,
        scale: 1,
        duration: 0.42,
        stagger: 0.07,
        ease: "back.out(1.6)",
      });
      gsap.to(labels, {
        opacity: 1,
        x: 0,
        duration: 0.3,
        stagger: 0.07,
        delay: 0.12,
        ease: "power2.out",
      });
    } else {
      gsap.to(items, {
        y: 0,
        opacity: 0,
        scale: 0.6,
        duration: 0.2,
        stagger: { each: 0.04, from: "end" },
        ease: "power2.in",
      });
      gsap.to(labels, {
        opacity: 0,
        x: 10,
        duration: 0.14,
        ease: "power2.in",
      });
    }
  }, [open]);

  const toggle = useCallback(() => setOpen((o) => !o), []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div
      ref={menuRef}
      className="fixed bottom-20 right-4 md:bottom-24 md:right-6 z-[999]"
      style={{ width: 56, height: 56 }}
    >
      {/* Action items — stack above trigger via GSAP y */}
      {FAB_ACTIONS.map((action, i) => (
        <a
          key={action.id}
          href={action.href}
          id={`fab-${action.id}`}
          aria-label={action.label}
          target={action.target}
          rel="noopener noreferrer"
          ref={(el) => { itemRefs.current[i] = el; }}
          onClick={() => setOpen(false)}
          className="absolute inset-0 flex items-center justify-center rounded-full shadow-lg
                     transition-shadow duration-200 hover:shadow-xl
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                     active:scale-95"
          style={{
            background: "white",
            color: action.color,
            border: `2px solid ${action.color}25`,
          }}
        >
          {action.icon}
          {/* Tooltip */}
          <span
            ref={(el) => { labelRefs.current[i] = el; }}
            className="pointer-events-none absolute right-[calc(100%+10px)] whitespace-nowrap
                       rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide shadow-md"
            style={{
              background: "white",
              color: "#1a1a1a",
              border: "1px solid rgba(26,26,26,0.08)",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            {action.label}
          </span>
        </a>
      ))}

      {/* Trigger */}
      <button
        id="fab-contact-trigger"
        aria-label={open ? "Close contact options" : "Open contact options"}
        aria-expanded={open}
        onClick={toggle}
        className="absolute inset-0 z-10 flex items-center justify-center rounded-full shadow-xl
                   transition-transform duration-200 hover:scale-110 active:scale-95
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fd5200] focus-visible:ring-offset-2"
        style={{ background: "var(--accent, #fd5200)", color: "white", border: "none", cursor: "pointer" }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
          )}
        </span>

        {/* Pulse ring when idle */}
        {!open && (
          <span
            className="absolute inset-0 rounded-full animate-ping"
            style={{ background: "var(--accent, #fd5200)", opacity: 0.22 }}
          />
        )}
      </button>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Footer data
───────────────────────────────────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: "Work",    href: "#work"    },
  { label: "About",   href: "#about"   },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];
const SOCIAL_LINKS = [
  { label: "GitHub",   href: "https://github.com"   },
  { label: "Twitter",  href: "https://twitter.com"  },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Dribbble", href: "https://dribbble.com" },
];

/* ─────────────────────────────────────────────────────────────────────────────
   Skiper39 — Portfolio Footer
   Layout (top → bottom, normal document flow):
     1. "CANVAS" label + vertical line
     2. CTA headline + email button       ← ABOVE crowd
     3. Nav / socials / copyright bar     ← ABOVE crowd
     4. CrowdScene strip                  ← fills the bottom
───────────────────────────────────────────────────────────────────────────── */
export const Skiper39 = () => {
  return (
    <footer
      className="relative flex w-full flex-col overflow-x-hidden mt-auto"
      style={{
        minHeight: "100svh",
        background: "var(--background, #F5F0E8)",
        color: "var(--foreground, #1a1a1a)",
      }}
      aria-label="Site footer"
    >
      {/* ── 1. CTA headline ── */}
      <div className="flex flex-col items-center px-4 md:px-6 pt-8 md:pt-12 pb-8 md:pb-12 text-center">
        {/* Label + descender line */}
        <div className="relative mb-6 md:mb-10 flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.35em] opacity-40">Canvas</span>
          <span
            className="block w-px"
            style={{ height: 32, background: "linear-gradient(to bottom, var(--foreground), transparent)" }}
          />
        </div>

        <span
          className="mb-5 inline-block text-[10px] font-semibold uppercase tracking-[0.35em]"
          style={{ color: "var(--accent, #fd5200)" }}
        >
          Open for opportunities
        </span>

        <h2
          className="font-bold uppercase leading-[0.88] tracking-tighter"
          style={{
            fontSize: "clamp(2.6rem, 9vw, 7.5rem)",
            maxWidth: "16ch",
            overflowWrap: "anywhere",
            minWidth: 0,
          }}
        >
          Let&apos;s build
          <br />
          something
          <br />
          <span style={{ color: "var(--accent, #fd5200)" }}>great.</span>
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-5 mt-6 md:mt-10 justify-center w-full max-w-xl mx-auto">
          <a
            href={MAIL_URL}
            id="footer-cta-email"
            className="group inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-full px-6 md:px-8 py-3 md:py-4
                       text-xs md:text-sm font-semibold uppercase tracking-widest
                       transition-all duration-300 hover:scale-105 active:scale-95
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              border: "1.5px solid rgba(26,26,26,0.16)",
              background: "rgba(26,26,26,0.04)",
              color: "inherit",
            }}
          >
            <span>{MAIL}</span>
            <svg
              className="transition-transform duration-300 group-hover:translate-x-1"
              width="16" height="16" viewBox="0 0 16 16" fill="none"
            >
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>

          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            id="footer-cta-wa"
            className="group inline-flex items-center justify-center rounded-full w-12 h-12 md:w-14 md:h-14 self-center sm:self-auto
                       transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-[0_0_15px_rgba(37,211,102,0.3)]
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              border: "1.5px solid rgba(37, 211, 102, 0.3)",
              background: "rgba(37, 211, 102, 0.05)",
            }}
            aria-label="WhatsApp"
          >
            <svg
              className="transition-transform duration-300 group-hover:scale-110"
              width="16" height="16" viewBox="0 0 24 24" fill="#25D366"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* ── 3. Dense moving crowd strip ── */}
      {/* Spacer to make room for absolute crowd in normal flow */}
      <div className="mt-auto w-full pointer-events-none" style={{ height: "clamp(220px, 28vw, 420px)" }} />
      <CrowdScene />

      {/* ── Theme Toggle Button (Standalone) ── */}
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[999]">
        <ThemeToggleButton variant="circle" start="center" blur={true} />
      </div>

      {/* ── Contact FAB ── */}
      <ContactFAB />
    </footer>
  );
};

/**
 * Skiper 39 — Dense crowd footer + contact FAB
 * Illustration by https://www.openpeeps.com/ (Pablo Stanley)
 * Inspired by https://codepen.io/zadvorsky/pen/xxwbBQV
 */
