"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

// ─────────────────────────────────────────────────────────────────────────────
// Preloader: 3-stage GSAP sequence
//  Stage 1: Counter (0 to 100)
//  Stage 2: Brand flash
//  Stage 3: Split-wipe panel exit
// ─────────────────────────────────────────────────────────────────────────────

const PRELOAD_ASSETS = {
  video:
    "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4",
  images: [
    "https://res.cloudinary.com/dhby5v7rw/image/upload/q_auto/f_auto/v1781360950/Screenshot_2026-06-13_195827_dbbkmp.png",
    "https://res.cloudinary.com/dhby5v7rw/image/upload/q_auto/f_auto/v1781361247/Screenshot_2026-06-13_200333_nikxkj.png",
    "https://res.cloudinary.com/dhby5v7rw/image/upload/q_auto/f_auto/v1781358525/Screenshot_2026-06-13_165337_ztgw5o.png",
    "https://res.cloudinary.com/dhby5v7rw/image/upload/q_auto/f_auto/v1781361497/Screenshot_2026-06-13_200710_k26ya9.png",
    "https://res.cloudinary.com/dhby5v7rw/image/upload/q_auto/f_auto/v1781360692/Screenshot_2026-06-13_195354_olgsmo.png",
    "https://res.cloudinary.com/dhby5v7rw/image/upload/q_auto/f_auto/v1782324734/Screenshot_2026-06-24_234151_uzszlb.png",
    "https://res.cloudinary.com/kouanazg/image/upload/f_auto,q_auto/v1782990313/Screenshot_2026-07-02_163454_og7utu.png",
    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2000&auto=format&fit=crop",
  ],
};

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

    // Respect reduced motion: instant remove
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTimeout(() => root.remove(), 300);
      return;
    }

    // ── Initial states ──────────────────────────────────────────────────────
    gsap.set(brand,     { yPercent: 40, autoAlpha: 0 });
    gsap.set(tag,       { yPercent: 40, autoAlpha: 0 });
    gsap.set(line,      { scaleX: 0, transformOrigin: "left center" });
    gsap.set(countWrap, { autoAlpha: 1 });
    gsap.set(topPanel,  { yPercent: 0 });
    gsap.set(botPanel,  { yPercent: 0 });

    let isCancelled = false;
    const startTime = Date.now();
    const minDisplayDuration = 1200; // minimum 1.2s so counter feels deliberate
    const maxSafetyTimeout   = 5000; // maximum 5s safety failsafe

    // Weights: Video 35%, Fonts 10%, Images 55% (~6.1% per image)
    const videoWeight = 35;
    const fontWeight = 10;
    const imageWeight = 55 / PRELOAD_ASSETS.images.length;

    let loadedScore = 0;
    const displayObj = { val: 0 };

    const updateDisplay = () => {
      if (isCancelled) return;
      const target = Math.min(100, Math.round(loadedScore));
      gsap.to(displayObj, {
        val: target,
        duration: 0.35,
        ease: "power2.out",
        onUpdate: () => {
          if (counter) counter.textContent = String(Math.floor(displayObj.val)).padStart(3, "0");
          if (line) gsap.set(line, { scaleX: displayObj.val / 100 });
        },
      });
    };

    const onItemLoaded = (weight: number) => {
      loadedScore += weight;
      updateDisplay();
    };

    // 1. Preload Hero Video
    const preloadVideoPromise = new Promise<void>((resolve) => {
      const vid = document.createElement("video");
      vid.src = PRELOAD_ASSETS.video;
      vid.preload = "auto";
      vid.muted = true;
      vid.playsInline = true;

      const finish = () => {
        cleanup();
        onItemLoaded(videoWeight);
        resolve();
      };

      const cleanup = () => {
        vid.removeEventListener("canplaythrough", finish);
        vid.removeEventListener("canplay", finish);
        vid.removeEventListener("loadeddata", finish);
        vid.removeEventListener("error", finish);
      };

      vid.addEventListener("canplaythrough", finish, { once: true });
      vid.addEventListener("canplay", finish, { once: true });
      vid.addEventListener("loadeddata", finish, { once: true });
      vid.addEventListener("error", finish, { once: true });

      if (vid.readyState >= 3) {
        finish();
      } else {
        vid.load();
      }
      setTimeout(finish, 4000);
    });

    // 2. Preload Images with GPU decode
    const preloadImagePromises = PRELOAD_ASSETS.images.map((url) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = url;

        const finish = () => {
          onItemLoaded(imageWeight);
          resolve();
        };

        if (img.complete) {
          if ("decode" in img) {
            img.decode().then(finish).catch(finish);
          } else {
            finish();
          }
          return;
        }

        img.onload = () => {
          if ("decode" in img) {
            img.decode().then(finish).catch(finish);
          } else {
            finish();
          }
        };
        img.onerror = finish;
        setTimeout(finish, 3500);
      });
    });

    // 3. Preload Fonts
    const preloadFontsPromise = (document.fonts ? document.fonts.ready : Promise.resolve())
      .then(() => {
        onItemLoaded(fontWeight);
      })
      .catch(() => {
        onItemLoaded(fontWeight);
      });

    const allPreloads = Promise.all([
      preloadVideoPromise,
      ...preloadImagePromises,
      preloadFontsPromise,
    ]);

    const safetyTimeout = new Promise((resolve) => setTimeout(resolve, maxSafetyTimeout));

    Promise.race([allPreloads, safetyTimeout]).then(() => {
      if (isCancelled) return;

      loadedScore = 100;
      const elapsed = Date.now() - startTime;
      const remainingMinTime = Math.max(0, minDisplayDuration - elapsed);

      setTimeout(() => {
        if (isCancelled) return;

        gsap.to(displayObj, {
          val: 100,
          duration: 0.35,
          ease: "power2.out",
          onUpdate: () => {
            if (counter) counter.textContent = "100";
            if (line) gsap.set(line, { scaleX: 1 });
          },
          onComplete: () => {
            if (isCancelled) return;

            // ── Exit Timeline: Brand Flash & Split-Wipe ──
            const exitTl = gsap.timeline({
              onComplete: () => {
                if (root) root.style.display = "none";
              },
            });

            // Stage 2: Swap counter for brand
            exitTl.to(countWrap, {
              yPercent: -60,
              autoAlpha: 0,
              duration: 0.4,
              ease: "power4.in",
            });

            exitTl.to(
              [brand, tag],
              {
                yPercent: 0,
                autoAlpha: 1,
                duration: 0.8,
                ease: "expo.out",
                stagger: 0.08,
              },
              "-=0.1"
            );

            // Brief brand display hold
            exitTl.to({}, { duration: 0.6 });

            // Stage 3: Split-wipe panels exit
            exitTl.to(topPanel, {
              yPercent: -100,
              duration: 0.85,
              ease: "power4.inOut",
            });

            exitTl.to(
              botPanel,
              {
                yPercent: 100,
                duration: 0.85,
                ease: "power4.inOut",
              },
              "<"
            );

            exitTl.to(
              [brand, tag],
              {
                scale: 1.15,
                autoAlpha: 0,
                duration: 0.45,
                ease: "power2.in",
              },
              "<"
            );
          },
        });
      }, remainingMinTime);
    });

    return () => {
      isCancelled = true;
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

        {/* Brand name: enters after counter */}
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
            Web Studio · SEO · Automation · Independent Code
          </p>
        </div>
      </div>
    </div>
  );
}
