"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

// ─────────────────────────────────────────────────────────────────────────────
// Premium cinematic preloader — 3-stage GSAP sequence
//  Stage 1: Mechanical counter (0 → 100)
//  Stage 2: Brand flash  ("UNCOMPLIC8" slams in)
//  Stage 3: Cinematic split-wipe (panels fly off screen)
// ─────────────────────────────────────────────────────────────────────────────

export function IntroPreloader() {
  const rootRef     = useRef<HTMLDivElement>(null);
  const topPanelRef = useRef<HTMLDivElement>(null);
  const botPanelRef = useRef<HTMLDivElement>(null);
  const counterRef  = useRef<HTMLSpanElement>(null);
  const countWrapRef = useRef<HTMLDivElement>(null);
  const brandRef    = useRef<HTMLDivElement>(null);
  const lineRef     = useRef<HTMLDivElement>(null);
  const tagRef      = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const root      = rootRef.current;
    const topPanel  = topPanelRef.current;
    const botPanel  = botPanelRef.current;
    const counter   = counterRef.current;
    const countWrap = countWrapRef.current;
    const brand     = brandRef.current;
    const line      = lineRef.current;
    const tag       = tagRef.current;

    if (!root || !topPanel || !botPanel || !counter || !countWrap || !brand || !line || !tag) return;

    // Respect reduced motion — instant remove
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTimeout(() => root.remove(), 300);
      return;
    }

    // ── Initial states ──────────────────────────────────────────────────────
    // Use autoAlpha for better visibility toggling
    gsap.set(brand,     { yPercent: 40, autoAlpha: 0 });
    gsap.set(tag,       { yPercent: 40, autoAlpha: 0 });
    gsap.set(line,      { scaleX: 0, transformOrigin: "left center" });
    gsap.set(countWrap, { autoAlpha: 1 });
    gsap.set(topPanel,  { yPercent: 0 });
    gsap.set(botPanel,  { yPercent: 0 });

    // ── Master timeline ──────────────────────────────────────────────────────
    const tl = gsap.timeline({
      onComplete: () => {
        // Fully remove from DOM after wipe is done
        if (root) root.style.display = "none";
      },
    });

    // Stage 1: Counter ticks up
    const obj = { val: 0 };
    tl.to(obj, {
      val: 100,
      duration: 1.1,
      ease: "power2.inOut",
      onUpdate: () => {
        if (counter) counter.textContent = String(Math.floor(obj.val)).padStart(3, "0");
      },
    });

    // Stage 1b: Progress line tracks with counter (runs in parallel)
    tl.to(line, {
      scaleX: 1,
      duration: 1.1,
      ease: "power2.inOut",
    }, "<");

    // Stage 2: Swap — counter exits, brand enters
    tl.to(countWrap, {
      yPercent: -60,
      autoAlpha: 0,
      duration: 0.4,
      ease: "power4.in",
    });

    tl.to([brand, tag], {
      yPercent: 0,
      autoAlpha: 1,
      duration: 0.8,
      ease: "expo.out",
      stagger: 0.08,
    }, "-=0.1"); // slightly overlap the entrance with counter exit

    // Brief hold
    tl.to({}, { duration: 0.6 });

    // Stage 3: Cinematic split-wipe — panels fly away AND text exits
    tl.to(topPanel, {
      yPercent: -100,
      duration: 0.85,
      ease: "power4.inOut",
    });
    
    tl.to(botPanel, {
      yPercent: 100,
      duration: 0.85,
      ease: "power4.inOut",
    }, "<");

    // Brand text exits by scaling up and fading out just as the wipe starts
    tl.to([brand, tag], {
      scale: 1.15,
      autoAlpha: 0,
      duration: 0.45,
      ease: "power2.in",
    }, "<");

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* ── Top half panel ── */}
      <div
        ref={topPanelRef}
        style={{
          position: "absolute",
          inset: "0 0 50% 0",
          background: "#151412",
          zIndex: 2,
        }}
      />

      {/* ── Bottom half panel ── */}
      <div
        ref={botPanelRef}
        style={{
          position: "absolute",
          inset: "50% 0 0 0",
          background: "#151412",
          zIndex: 2,
        }}
      />

      {/* ── Content layer (sits between panels in z-order during animation) ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        {/* Counter */}
        <div
          ref={countWrapRef}
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <span
            ref={counterRef}
            style={{
              fontFamily: "'Courier New', 'Courier', monospace",
              fontSize: "clamp(5rem, 18vw, 14rem)",
              fontWeight: 900,
              lineHeight: 1,
              color: "#F5F0E8",
              letterSpacing: "-0.04em",
              tabularNums: "tabular-nums",
              userSelect: "none",
            } as React.CSSProperties}
          >
            000
          </span>

          {/* Mechanical progress bar */}
          <div
            style={{
              width: "clamp(160px, 40vw, 400px)",
              height: "1px",
              background: "rgba(245,240,232,0.15)",
              position: "relative",
            }}
          >
            <div
              ref={lineRef}
              style={{
                position: "absolute",
                inset: 0,
                background: "#fd5200",
                transformOrigin: "left center",
              }}
            />
          </div>
        </div>

        {/* Brand name — enters after counter */}
        <div
          ref={brandRef}
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.75rem",
            opacity: 0,           // Prevent FOUC
            visibility: "hidden", // Prevent FOUC
          }}
        >
          <h1
            style={{
              fontFamily: "'Arial Black', 'Helvetica Neue', 'Impact', sans-serif",
              fontSize: "clamp(2.5rem, 9vw, 8rem)",
              fontWeight: 900,
              lineHeight: 0.88,
              color: "#F5F0E8",
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              margin: 0,
              userSelect: "none",
            }}
          >
            UNCOMPLIC
            <span style={{ color: "#fd5200" }}>8</span>
          </h1>

          <p
            ref={tagRef}
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "clamp(0.55rem, 1.2vw, 0.75rem)",
              fontWeight: 400,
              color: "rgba(245,240,232,0.4)",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              margin: 0,
              userSelect: "none",
              opacity: 0,           // Prevent FOUC
              visibility: "hidden", // Prevent FOUC
            }}
          >
            Tech Agency &mdash; Web · SEO · Automation · Ownership
          </p>
        </div>
      </div>
    </div>
  );
}
