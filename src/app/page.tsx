"use client";

import React, { useEffect } from "react";
import { PrismaHero } from "@/components/ui/prisma-hero";
import { FlowArtDefaultDemo } from "@/components/ui/story-scroll";
import { Skiper39 } from "@/components/ui/crowd-canvas";
import { IntroPreloader } from "@/components/ui/intro-preloader";
import { CinematicHero } from "@/components/ui/cinematic-landing-hero";
import { DemoRadialScrollGalleryBasic } from "@/components/ui/portfolio-and-image-gallery";
import { FaqSection } from "@/components/ui/faq-section";

export default function Home() {
  // Prevent hydration layout jumps with GSAP scroll triggers
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="flex min-h-screen flex-col overflow-x-clip bg-background w-full">
      {/* 0. Pixelate Wipe Loader */}
      <IntroPreloader />

      {/* 1. Fullscreen Video Hero: z-0 so orange card stacks over it */}
      <div className="relative z-0">
        <PrismaHero />
      </div>

      {/* 3. Story Scroll: negative margin pulls it up so it slides OVER the pinned hero */}
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
          tagline1="Clean code,"
          tagline2="fast load times."
          cardHeading="Performance and SEO"
          cardDescription={<><span className="text-white font-semibold">Uncomplic8 Tech</span> builds websites and automation tools from scratch. Sub-second page loads, clean code, and zero dependency on heavy plugins.</>}
          metricValue={100}
          metricLabel="Lighthouse Score"
          ctaHeading="Have a project in mind?"
          ctaDescription="Send us a brief or message on WhatsApp. We usually review specs and reply within a few hours."
        />
      </div>

      {/* 3.7 Radial Workflow Gallery */}
      <div className="relative z-20 w-full bg-background">
        <DemoRadialScrollGalleryBasic />
      </div>

      {/* 3.8 SEO FAQ Section */}
      <FaqSection />

      {/* 4. Footer Crowd Canvas - Join Movement */}
      <Skiper39 />
    </main>
  );
}
