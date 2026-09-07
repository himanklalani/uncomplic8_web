"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useMotionValueEvent, animate } from "motion/react";
import { cn } from "@/lib/utils";
import {
  Globe,
  Stethoscope,
  Monitor,
  Gem,
  Home,
  Bot,
  ExternalLink,
  Printer,
  Package,
  Glasses,
  Briefcase,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const PROJECTS = [
  {
    id: "srs-dental",
    label: "SRS Dental Care",
    icon: Stethoscope,
    href: "https://www.srsdentalcare.in/",
    image:
      "https://res.cloudinary.com/dhby5v7rw/image/upload/q_auto/f_auto/v1781360950/Screenshot_2026-06-13_195827_dbbkmp.png",
    description:
      "Website for an established dental clinic with treatment guides, doctor profiles, and direct appointment scheduling.",
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
      "Online store and repair portal for a Mumbai computer hardware shop, featuring custom PC quotes and component inventory.",
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
      "E-commerce store for fashion jewellery featuring product filtering, photo lookbooks, and direct WhatsApp ordering.",
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
      "Digital portfolio for a property consultant featuring active listings, area guides, and direct enquiry forms.",
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
      "Clinic appointment software with patient record management and automated WhatsApp reminder alerts through the Meta Cloud API.",
    tag: "SaaS · Automation",
  },
  {
    id: "rex-international",
    label: "Rex International",
    icon: Printer,
    href: "https://www.rexinternational.store/",
    image:
      "https://res.cloudinary.com/dhby5v7rw/image/upload/q_auto/f_auto/v1782324734/Screenshot_2026-06-24_234151_uzszlb.png",
    description:
      "Product catalogue and distributor website for an industrial supplier of office printers, toner cartridges, and repair parts.",
    tag: "Manufacturing · B2B",
  },
  {
    id: "polyveda",
    label: "Polyveda",
    icon: Package,
    href: "https://polyveda-tan.vercel.app/",
    image:
      "https://res.cloudinary.com/kouanazg/image/upload/f_auto,q_auto/v1782990313/Screenshot_2026-07-02_163454_og7utu.png",
    description:
      "B2B product showcase for an industrial packaging manufacturer specializing in reusable polypropylene crates and dunnage.",
    tag: "Manufacturing · B2B",
  },
  {
    id: "jemy-eyewear",
    label: "Jemy Eyewear",
    icon: Glasses,
    href: "https://jemy-seven.vercel.app/",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=2000&auto=format&fit=crop",
    description:
      "E-commerce store for prescription glasses and sunglasses with frame measurements and prescription lens upload options.",
    tag: "E-Commerce · Fashion",
  },
  {
    id: "nolkha-co",
    label: "Nolkha & Co",
    icon: Briefcase,
    href: "https://nolkha-zeta.vercel.app/",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2000&auto=format&fit=crop",
    description:
      "Corporate website for a chartered accountancy practice, outlining statutory audit, GST filing, and cross-border tax advisory services.",
    tag: "Finance · Corporate",
  },
];

export function ProjectCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [stepSize, setStepSize] = useState(620);

  const x = useMotionValue(0);

  // Recalculate dimensions on resize
  const updateMeasurements = useCallback(() => {
    if (!containerRef.current || !trackRef.current) return;
    const containerWidth = containerRef.current.clientWidth;
    const trackWidth = trackRef.current.scrollWidth;

    const firstCard = trackRef.current.children[0] as HTMLElement | undefined;
    const secondCard = trackRef.current.children[1] as HTMLElement | undefined;

    let computedStep = 620;
    if (firstCard && secondCard) {
      computedStep = secondCard.offsetLeft - firstCard.offsetLeft;
    } else if (firstCard) {
      computedStep = firstCard.offsetWidth + 24;
    }
    setStepSize(computedStep);

    const calculatedMax = Math.max(0, trackWidth - containerWidth);
    setMaxScroll(calculatedMax);
  }, []);

  useEffect(() => {
    updateMeasurements();
    window.addEventListener("resize", updateMeasurements);
    const timeout = setTimeout(updateMeasurements, 250);
    return () => {
      window.removeEventListener("resize", updateMeasurements);
      clearTimeout(timeout);
    };
  }, [updateMeasurements]);

  // Keep activeIndex synchronized with current scroll translation
  useMotionValueEvent(x, "change", (latest) => {
    if (stepSize <= 0) return;
    const index = Math.round(-latest / stepSize);
    const clamped = Math.max(0, Math.min(PROJECTS.length - 1, index));
    if (clamped !== activeIndex) {
      setActiveIndex(clamped);
    }
  });

  const scrollToIndex = useCallback(
    (index: number) => {
      const clampedIndex = Math.max(0, Math.min(PROJECTS.length - 1, index));
      const target = Math.max(-maxScroll, Math.min(0, -clampedIndex * stepSize));
      animate(x, target, {
        type: "spring",
        stiffness: 220,
        damping: 28,
      });
    },
    [maxScroll, stepSize, x]
  );

  const handlePrev = () => {
    scrollToIndex(Math.max(0, activeIndex - 1));
  };

  const handleNext = () => {
    scrollToIndex(Math.min(PROJECTS.length - 1, activeIndex + 1));
  };

  return (
    <div className="w-full mt-6 md:mt-10 mb-8 md:mb-16">
      {/* Section Header & Minimal Arrow Affordance */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6 md:mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-60 mb-2 text-white">
            Our Projects
          </p>
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight leading-none text-white">
            Selected Works
          </h3>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-6">
          <p className="text-xs sm:text-sm opacity-60 max-w-[34ch] leading-relaxed text-white">
            Curated client solutions engineered for high performance, smooth interactivity, and conversion.
          </p>

          {/* Minimal chevron arrows */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handlePrev}
              disabled={activeIndex === 0}
              aria-label="Previous project card"
              className={cn(
                "w-10 h-10 rounded-full border border-white/15 flex items-center justify-center transition-all duration-200 select-none",
                activeIndex === 0
                  ? "opacity-20 cursor-not-allowed text-white/30"
                  : "text-white/80 hover:text-white hover:border-white/40 hover:bg-white/5 active:scale-95 cursor-pointer"
              )}
            >
              <ChevronLeft size={20} className="stroke-[2.5]" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={activeIndex === PROJECTS.length - 1}
              aria-label="Next project card"
              className={cn(
                "w-10 h-10 rounded-full border border-white/15 flex items-center justify-center transition-all duration-200 select-none",
                activeIndex === PROJECTS.length - 1
                  ? "opacity-20 cursor-not-allowed text-white/30"
                  : "text-white/80 hover:text-white hover:border-white/40 hover:bg-white/5 active:scale-95 cursor-pointer"
              )}
            >
              <ChevronRight size={20} className="stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Project Selector Pills */}
      <div className="flex items-center gap-2 md:gap-3 overflow-x-auto scrollbar-none pb-3 mb-6 md:mb-8 select-none">
        {PROJECTS.map((project, index) => {
          const Icon = project.icon;
          const isActive = index === activeIndex;

          return (
            <button
              key={project.id}
              type="button"
              onClick={() => scrollToIndex(index)}
              className={cn(
                "flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 shrink-0 border select-none",
                isActive
                  ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-[0_0_18px_rgba(253,82,0,0.4)]"
                  : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon size={14} className="stroke-[2]" />
              <span>{project.label}</span>
            </button>
          );
        })}
      </div>

      {/* Fluid Horizontal Track with Start Boundary Rubber-Banding */}
      <div
        ref={containerRef}
        className="w-full overflow-hidden cursor-grab active:cursor-grabbing select-none relative"
      >
        <motion.div
          ref={trackRef}
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -maxScroll, right: 0 }}
          dragElastic={{ left: 0, right: 0.2 }}
          dragTransition={{
            power: 0.2,
            timeConstant: 250,
            bounceStiffness: 300,
            bounceDamping: 30,
          }}
          onDragStart={() => {
            isDraggingRef.current = true;
          }}
          onDragEnd={() => {
            // Short timeout so accidental link clicks on mouse release are prevented
            setTimeout(() => {
              isDraggingRef.current = false;
            }, 50);
          }}
          className="flex items-center gap-5 sm:gap-6 md:gap-8 w-max will-change-transform py-2"
        >
          {PROJECTS.map((project, index) => {
            const isActive = index === activeIndex;

            return (
              <div
                key={project.id}
                className={cn(
                  "relative shrink-0 w-[84vw] sm:w-[480px] md:w-[580px] lg:w-[640px] aspect-[16/10] rounded-2xl md:rounded-3xl overflow-hidden border transition-all duration-500 shadow-2xl bg-[#161616] group select-none",
                  isActive
                    ? "border-white/25 ring-1 ring-white/10"
                    : "border-white/10 opacity-75 hover:opacity-100"
                )}
              >
                {/* Image */}
                <img
                  src={project.image}
                  alt={project.label}
                  draggable={false}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none select-none"
                />

                {/* Bottom Card Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/95 via-[#09090b]/40 to-transparent flex flex-col justify-end p-4 sm:p-5 md:p-6 pointer-events-none">
                  <div className="flex flex-col gap-1.5 mb-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] border border-white/15 w-fit truncate">
                        {project.tag}
                      </div>

                      <a
                        href={project.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          if (isDraggingRef.current) {
                            e.preventDefault();
                          }
                        }}
                        className="pointer-events-auto inline-flex items-center gap-1.5 sm:gap-2 bg-[var(--accent)] text-white font-bold text-[9px] sm:text-[10px] uppercase tracking-widest px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full hover:brightness-110 active:scale-95 transition-all duration-200 shadow-lg shadow-[var(--accent)]/25 group/btn"
                      >
                        <Globe size={12} />
                        <span>View Project</span>
                        <ExternalLink
                          size={12}
                          className="opacity-70 group-hover/btn:opacity-100 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"
                        />
                      </a>
                    </div>

                    <h4 className="text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-tight text-white mt-1">
                      {project.label}
                    </h4>
                  </div>

                  <p className="text-xs sm:text-sm text-white/60 line-clamp-2 max-w-[48ch] leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* SEO & Backlinks: Project Directory & Case Studies */}
      <div className="mt-14 md:mt-20 border-t border-white/10 pt-8">
        <h4 className="text-white/30 text-xs font-bold uppercase tracking-[0.2em] mb-6">
          Project Directory & Case Studies
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {PROJECTS.map((project) => (
            <div key={project.id} className="flex flex-col gap-2.5">
              <h5 className="text-white/80 font-medium text-base md:text-lg flex items-center gap-2">
                <project.icon className="w-4 h-4 text-[var(--accent)]" />
                {project.label}
              </h5>
              <p className="text-xs md:text-sm text-white/50 leading-relaxed">
                As part of our <strong>{project.tag}</strong> portfolio, we developed the{" "}
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[var(--accent)] underline decoration-white/30 hover:decoration-[var(--accent)] underline-offset-4 transition-all font-medium"
                >
                  {project.label}
                </a>{" "}
                digital experience. {project.description} This project highlights our expertise in delivering scalable, high-performance web solutions tailored to client needs.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectCarousel;
