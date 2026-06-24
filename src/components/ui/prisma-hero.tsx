"use client";

import { ArrowDown } from "lucide-react";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* -------------------------------------------------------
   PrismaHero
   ─ Outer wrapper: 300vh tall (gives GSAP scroll distance)
   ─ Inner sticky panel: 100vh tall (stays pinned)
   ─ All elements animate in synced with the clip-path expansion
------------------------------------------------------- */
export const PrismaHero = () => {
  const outerRef    = useRef<HTMLDivElement>(null);
  const stickyRef   = useRef<HTMLDivElement>(null);
  const videoRef    = useRef<HTMLDivElement>(null);
  const overlayRef  = useRef<HTMLDivElement>(null);
  const h1Ref       = useRef<HTMLHeadingElement>(null);
  const paraRef     = useRef<HTMLParagraphElement>(null);
  const indRef      = useRef<HTMLDivElement>(null);
  const topBarRef   = useRef<HTMLDivElement>(null);
  const tagsRef     = useRef<HTMLDivElement>(null);
  const statsRef    = useRef<HTMLDivElement>(null);
  const dividerRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer   = outerRef.current;
    const video   = videoRef.current;
    const h1      = h1Ref.current;
    const para    = paraRef.current;
    const ind     = indRef.current;
    const overlay = overlayRef.current;
    const topBar  = topBarRef.current;
    const tags    = tagsRef.current;
    const stats   = statsRef.current;
    const divider = dividerRef.current;

    if (!outer || !video || !h1 || !para || !ind || !overlay) return;

    const chars = Array.from(h1.querySelectorAll<HTMLSpanElement>(".ph-char"));

    const isMobile = window.innerWidth < 768;
    const startClip = isMobile ? "inset(20px round 20px)" : "inset(28px round 28px)";
    const endClip   = "inset(0px round 0px)";

    /* ── Initial hidden states ── */
    gsap.set(video,   { clipPath: startClip });
    gsap.set(overlay, { opacity: 0.25 });
    gsap.set(chars,   { y: 90, opacity: 0 });
    gsap.set(para,    { y: 40, opacity: 0 });
    gsap.set(ind,     { opacity: 1 });
    if (topBar)  gsap.set(topBar,  { y: -40, opacity: 0 });
    if (tags)    gsap.set(tags,    { y: 30, opacity: 0 });
    if (stats)   gsap.set(stats,   { y: 30, opacity: 0 });
    if (divider) gsap.set(divider, { scaleX: 0, opacity: 0 });

    /* ── Scrubbed timeline ── */
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: outer,
        start:   "top top",
        end:     "bottom bottom",
        scrub:   1.2,
        pin:     stickyRef.current,
        pinSpacing: false,
        snap: {
          snapTo: [0, 0.5, 1],
          duration: { min: 0.4, max: 0.8 },
          ease: "power2.inOut",
          delay: 0.05,
        },
      },
    });

    /* Phase 1 — expand + reveal all elements in staggered waves */
    tl.to(video,   { clipPath: endClip, ease: "power2.inOut", duration: 1 }, 0);
    tl.to(overlay, { opacity: 0.65,     ease: "power1.inOut", duration: 1 }, 0);
    tl.to(ind,     { opacity: 0,        ease: "power1.in",    duration: 0.2 }, 0);

    // Top bar slides down from above
    if (topBar) tl.to(topBar, { y: 0, opacity: 1, ease: "power2.out", duration: 0.6 }, 0.05);

    // Divider line sweeps across
    if (divider) tl.to(divider, { scaleX: 1, opacity: 1, ease: "power2.inOut", duration: 0.5 }, 0.15);

    // Main brand title characters stagger up
    tl.to(chars, {
      y: 0, opacity: 1,
      stagger: 0.04,
      ease: "power3.out",
      duration: 0.8,
    }, 0.1);

    // Tags row slides up
    if (tags) tl.to(tags, { y: 0, opacity: 1, ease: "power2.out", duration: 0.6 }, 0.3);

    // Paragraph
    tl.to(para, { y: 0, opacity: 1, ease: "power2.out", duration: 0.7 }, 0.35);

    // Stats counter row slides up last
    if (stats) tl.to(stats, { y: 0, opacity: 1, ease: "power2.out", duration: 0.6 }, 0.45);

    /* Phase 2 – hold */
    tl.to({}, { duration: 1.5 });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const BRAND = "Uncomplic8".split("");

  return (
    <div ref={outerRef} style={{ height: "400vh" }} className="relative w-full">

      <div
        ref={stickyRef}
        className="sticky top-0 w-full bg-background"
        style={{ height: "100vh" }}
      >
        {/* Video wrapper */}
        <div ref={videoRef} className="relative w-full h-full overflow-hidden bg-black">
          <video
            autoPlay loop muted playsInline
            className="absolute inset-0 w-full h-full object-cover"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4"
          />

          {/* Grain */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay z-10"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundSize: "128px 128px" }}
          />

          {/* Gradient */}
          <div
            ref={overlayRef}
            className="pointer-events-none absolute inset-0 z-10"
            style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 35%, rgba(0,0,0,0.80) 100%)" }}
          />

          {/* ── TOP BAR ── */}
          <div
            ref={topBarRef}
            className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 pt-6 md:px-12 md:pt-8"
          >
            {/* Left: agency tagline */}
            <p className="text-white/50 text-[0.65rem] md:text-xs uppercase tracking-[0.2em] font-medium">
              Digital Engineering Agency
            </p>

            {/* Right: year + status pill */}
            <div className="flex items-center gap-3">
              <span className="text-white/30 text-[0.65rem] uppercase tracking-widest">Est. 2022</span>
              <span className="flex items-center gap-1.5 text-[0.6rem] uppercase tracking-widest text-white/60 border border-white/15 rounded-full px-2.5 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Available
              </span>
            </div>
          </div>

          {/* ── SCROLL INDICATOR ── */}
          <div
            ref={indRef}
            className="absolute bottom-32 md:bottom-40 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3 text-white/50 uppercase tracking-[0.2em] mix-blend-difference"
            style={{ fontSize: "0.6rem" }}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 animate-bounce">
              <ArrowDown className="h-4 w-4" />
            </span>
            Scroll
          </div>

          {/* ── BOTTOM CONTENT ── */}
          <div className="absolute bottom-0 left-0 right-0 z-20 px-6 pb-8 md:px-12 md:pb-10">

            {/* Horizontal divider */}
            <div
              ref={dividerRef}
              className="w-full h-px bg-white/15 mb-5 origin-left"
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">

              {/* LEFT: Brand name + tags */}
              <div className="lg:col-span-7 flex flex-col gap-3">
                {/* Tags row */}
                <div ref={tagsRef} className="flex flex-wrap gap-2">
                  {["Web Development", "UI/UX Design", "Performance", "SEO"].map((tag) => (
                    <span
                      key={tag}
                      className="text-[0.6rem] uppercase tracking-widest text-white/50 border border-white/15 rounded-full px-3 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Brand name */}
                <h1
                  ref={h1Ref}
                  className="font-medium leading-none flex flex-wrap"
                  aria-label="Uncomplic8"
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontSize: "clamp(3rem, 9.5vw, 9.5rem)",
                    color: "#E1E0CC",
                    letterSpacing: "-0.04em",
                  }}
                >
                  {BRAND.map((char, i) => (
                    <span key={i} aria-hidden="true" className="ph-char inline-block" style={{ display: "inline-block" }}>
                      {char}
                    </span>
                  ))}
                </h1>
              </div>

              {/* RIGHT: Para + stats + scroll */}
              <div className="lg:col-span-5 flex flex-col gap-5 lg:pb-2">

                {/* Sub paragraph */}
                <p
                  ref={paraRef}
                  className="text-white/60"
                  style={{ fontSize: "clamp(0.8rem, 1.3vw, 0.95rem)", lineHeight: 1.5, maxWidth: "30ch" }}
                >
                  We architect elite digital experiences delivering high-performance platforms with structured precision and scalable engineering.
                </p>

                {/* Stats row */}
                <div ref={statsRef} className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-white font-semibold text-xl md:text-2xl leading-none">100%</span>
                    <span className="text-white/40 text-[0.6rem] uppercase tracking-widest mt-0.5">Custom Code</span>
                  </div>
                  <div className="w-px h-8 bg-white/15" />
                  <div className="flex flex-col">
                    <span className="text-white font-semibold text-xl md:text-2xl leading-none">Zero</span>
                    <span className="text-white/40 text-[0.6rem] uppercase tracking-widest mt-0.5">Templates</span>
                  </div>
                  <div className="w-px h-8 bg-white/15" />
                  <div className="flex flex-col">
                    <span className="text-white font-semibold text-xl md:text-2xl leading-none">Native</span>
                    <span className="text-white/40 text-[0.6rem] uppercase tracking-widest mt-0.5">Performance</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
