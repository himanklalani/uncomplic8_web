"use client";

import React, { useEffect } from "react";
import { PrismaHero } from "@/components/ui/prisma-hero";
import { FlowArtDefaultDemo } from "@/components/ui/story-scroll";
import { Skiper39 } from "@/components/ui/crowd-canvas";
import { IntroPreloader } from "@/components/ui/intro-preloader";
import { CinematicHero } from "@/components/ui/cinematic-landing-hero";
import { DemoRadialScrollGalleryBasic } from "@/components/ui/portfolio-and-image-gallery";

export default function Home() {
  // Prevent hydration layout jumps with GSAP scroll triggers
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="flex min-h-screen flex-col overflow-x-clip bg-background w-full">
      {/* 0. Pixelate Wipe Loader */}
      <IntroPreloader />

      {/* 1. Fullscreen Video Hero — z-0 so orange card stacks over it */}
      <div className="relative z-0">
        <PrismaHero />
      </div>

      {/* 3. Story Scroll — negative margin pulls it up so it slides OVER the pinned hero */}
      <div
        className="relative z-10 bg-background rounded-t-[2.5rem] overflow-hidden"
        style={{ marginTop: "-100vh", boxShadow: "0 -32px 80px rgba(0,0,0,0.30)" }}
      >
        <FlowArtDefaultDemo />
      </div>

      {/* 3.5 Cinematic Hero */}
      <div className="relative z-20 w-full bg-background min-h-screen">
        <CinematicHero 
          brandName="Uncomplic8 Tech"
          tagline1="Crafting code,"
          tagline2="driving growth."
          cardHeading="Performance & SEO."
          cardDescription={<><span className="text-white font-semibold">Uncomplic8 Tech</span> delivers high-performance digital solutions with structured precision, beautiful animations, and scalable architectures.</>}
          metricValue={100}
          metricLabel="Lighthouse Score"
          ctaHeading="Start your project."
          ctaDescription="Let's collaborate to build an extraordinary digital presence that stands out."
        />
      </div>

      {/* 3.7 Radial Workflow Gallery */}
      <div className="relative z-20 w-full bg-background">
        <DemoRadialScrollGalleryBasic />
      </div>

      {/* 4. Footer Crowd Canvas - Join Movement */}
      <Skiper39 />
    </main>
  );
}
