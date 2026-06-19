"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import {
  Globe,
  Stethoscope,
  Monitor,
  Gem,
  Home,
  Bot,
  ExternalLink,
} from "lucide-react";

const PROJECTS = [
  {
    id: "srs-dental",
    label: "SRS Dental Care",
    icon: Stethoscope,
    href: "https://srs-website-tan.vercel.app",
    image:
      "https://res.cloudinary.com/dhby5v7rw/image/upload/q_auto/f_auto/v1781360950/Screenshot_2026-06-13_195827_dbbkmp.png",
    description:
      "A modern dental clinic website with online appointment booking, service showcase, and patient testimonials.",
    tag: "Healthcare · Web Design",
  },
  {
    id: "lalani-computers",
    label: "Lalani Computers",
    icon: Monitor,
    href: "https://www.lalanicomputers.com",
    image:
      "https://res.cloudinary.com/dhby5v7rw/image/upload/q_auto/f_auto/v1781361247/Screenshot_2026-06-13_200333_nikxkj.png",
    description:
      "A full-featured e-commerce and services site for a Mumbai-based computer hardware retailer repairs, builds, and more.",
    tag: "E-Commerce · Retail",
  },
  {
    id: "serastore",
    label: "Serastore",
    icon: Gem,
    href: "https://serastore.in",
    image:
      "https://res.cloudinary.com/dhby5v7rw/image/upload/q_auto/f_auto/v1781358525/Screenshot_2026-06-13_165337_ztgw5o.png",
    description:
      "An elegant imitation jewellery brand store with curated collections, lookbooks, and seamless checkout experience.",
    tag: "Fashion · E-Commerce",
  },
  {
    id: "sajag",
    label: "Sajag",
    icon: Home,
    href: "https://sajag-dusky.vercel.app",
    image:
      "https://res.cloudinary.com/dhby5v7rw/image/upload/q_auto/f_auto/v1781361497/Screenshot_2026-06-13_200710_k26ya9.png",
    description:
      "A stunning real estate agent business card website with scroll-driven animations and property showcase.",
    tag: "Real Estate · Landing Page",
  },
  {
    id: "booking-crm",
    label: "Booking + CRM + WhatsApp",
    icon: Bot,
    href: "https://drive.google.com/file/d/1DA80aTOyvsdv_K55eMo9kbNh4jNzdHU3/view?usp=drive_link",
    image:
      "https://res.cloudinary.com/dhby5v7rw/image/upload/q_auto/f_auto/v1781360692/Screenshot_2026-06-13_195354_olgsmo.png",
    description:
      "An end-to-end clinic management system online booking, CRM dashboard, and automated WhatsApp notifications via Meta API.",
    tag: "SaaS · Automation",
  },
];

const AUTO_PLAY_INTERVAL = 3500;
const ITEM_HEIGHT = 54;

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export function ProjectCarousel() {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentIndex =
    ((step % PROJECTS.length) + PROJECTS.length) % PROJECTS.length;

  const nextStep = useCallback(() => setStep((prev) => prev + 1), []);

  const handleChipClick = (index: number) => {
    const diff = (index - currentIndex + PROJECTS.length) % PROJECTS.length;
    if (diff > 0) setStep((s) => s + diff);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextStep, AUTO_PLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [nextStep, isPaused]);

  const getCardStatus = (index: number) => {
    const diff = index - currentIndex;
    const len = PROJECTS.length;
    let n = diff;
    if (diff > len / 2) n -= len;
    if (diff < -len / 2) n += len;
    if (n === 0) return "active";
    if (n === -1) return "prev";
    if (n === 1) return "next";
    return "hidden";
  };

  const activeProject = PROJECTS[currentIndex];

  return (
    <div className="w-full max-w-7xl mx-auto md:p-8 mt-6 md:mt-12 mb-8 md:mb-20">
      {/* Section header */}
      <div className="mb-6 md:mb-12 px-4 md:px-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 md:gap-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-60 mb-2">
            Our Projects
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight leading-none text-white">
            Selected Works
          </h2>
        </div>
        <p className="text-sm opacity-60 max-w-[35ch] leading-relaxed text-white">
          A curated collection of client projects spanning web, e-commerce, and
          automation. Built for performance and conversion.
        </p>
      </div>

      <div className="relative overflow-hidden flex flex-col lg:flex-row min-h-[380px] md:min-h-[480px] lg:h-[520px]">
        {/* Left — vertical label carousel */}
        <div className="w-full lg:w-[45%] min-h-[140px] md:min-h-[300px] lg:h-full relative z-30 flex flex-col items-start justify-center overflow-hidden px-4 md:px-12 text-white">
          <div className="absolute inset-x-0 top-0 h-16 md:h-24 lg:h-32 bg-gradient-to-b from-[#111111] via-[#111111]/80 to-transparent z-40" />
          <div className="absolute inset-x-0 bottom-0 h-16 md:h-24 lg:h-32 bg-gradient-to-t from-[#111111] via-[#111111]/80 to-transparent z-40" />

          <div className="relative w-full h-full flex items-center justify-center lg:justify-start z-20">
            {PROJECTS.map((project, index) => {
              const distance = index - currentIndex;
              const wrappedDistance = wrap(
                -(PROJECTS.length / 2),
                PROJECTS.length / 2,
                distance,
              );
              const isActive = index === currentIndex;
              const Icon = project.icon;

              return (
                <motion.div
                  key={project.id}
                  style={{ height: ITEM_HEIGHT, width: "100%" }}
                  animate={{
                    y: wrappedDistance * ITEM_HEIGHT,
                    opacity: 1 - Math.abs(wrappedDistance) * 0.4,
                    scale: isActive ? 1 : 0.9,
                  }}
                  transition={{ type: "spring", stiffness: 120, damping: 20, mass: 1 }}
                  className="absolute flex items-center justify-start lg:justify-start"
                >
                  <button
                    onClick={() => handleChipClick(index)}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    className={cn(
                      "relative flex items-center gap-6 px-4 py-3 transition-all duration-500 text-left w-full max-w-[400px] group",
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center transition-all duration-500 rounded-full w-12 h-12 shrink-0",
                        isActive ? "bg-[var(--accent)] text-white shadow-[0_0_20px_var(--accent)]" : "bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white",
                      )}
                    >
                      <Icon size={isActive ? 20 : 18} strokeWidth={2} />
                    </div>
                    <span 
                      className={cn(
                        "font-medium text-lg md:text-xl tracking-tight uppercase transition-colors duration-500",
                        isActive ? "text-white" : "text-white/40 group-hover:text-white"
                      )}
                    >
                      {project.label}
                    </span>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right — image card carousel */}
        <div className="flex-1 min-h-[280px] md:min-h-[460px] lg:h-full relative flex items-center justify-center py-4 md:py-12 lg:py-0 px-4 md:px-12 lg:px-10 overflow-visible">
          <div className="relative w-[85vw] md:w-full max-w-[620px] aspect-video flex items-center justify-center">
            {PROJECTS.map((project, index) => {
              const status = getCardStatus(index);
              const isActive = status === "active";
              const isPrev = status === "prev";
              const isNext = status === "next";

              return (
                <motion.div
                  key={project.id}
                  initial={false}
                  animate={{
                    x: isActive ? 0 : isPrev ? -40 : isNext ? 40 : 0,
                    y: isActive ? 0 : isPrev ? 20 : isNext ? 20 : 0,
                    scale: isActive ? 1 : isPrev || isNext ? 0.9 : 0.8,
                    opacity: isActive ? 1 : isPrev || isNext ? 0.3 : 0,
                    rotate: isPrev ? -4 : isNext ? 4 : 0,
                    zIndex: isActive ? 20 : isPrev || isNext ? 10 : 0,
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                  drag={isActive ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(e, info) => {
                    if (info.offset.x < -40) {
                      setStep((s) => s + 1);
                    } else if (info.offset.x > 40) {
                      setStep((s) => s - 1);
                    }
                  }}
                  onPointerDown={() => isActive && setIsPaused(true)}
                  onPointerUp={() => isActive && setIsPaused(false)}
                  onPointerCancel={() => isActive && setIsPaused(false)}
                  className="absolute inset-0 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl origin-bottom touch-pan-y"
                >
                  <img
                    src={project.image}
                    alt={project.label}
                    className={cn(
                      "w-full h-full object-cover transition-all duration-700",
                      isActive ? "scale-100 blur-0 grayscale-0" : "scale-110 blur-[4px] grayscale brightness-50",
                    )}
                  />

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 bg-gradient-to-t from-[#09090b]/80 via-[#09090b]/10 to-transparent flex flex-col justify-end p-4 sm:p-5 md:p-6"
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="flex items-center justify-between gap-4 w-full"
                        >
                          <div className="bg-white/10 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] w-fit border border-white/20 truncate">
                            {project.tag}
                          </div>

                          {/* Click me button */}
                          <a
                            href={project.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex shrink-0 items-center gap-2 bg-[var(--accent)] text-white font-bold text-[9px] md:text-[10px] uppercase tracking-widest px-4 py-2 rounded-full hover:brightness-110 active:scale-95 transition-all duration-200 group"
                          >
                            <Globe size={12} />
                            View Project
                            <ExternalLink
                              size={12}
                              className="opacity-70 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                            />
                          </a>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectCarousel;
