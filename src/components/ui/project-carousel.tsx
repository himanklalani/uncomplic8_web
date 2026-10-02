"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
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

interface SlotStyle {
  left: string;
  scale: number;
  rotateY: number;
  zIndex: number;
  opacity: number;
  brightness: number;
  pointerEvents: "auto" | "none";
}

const getSlotStyle = (diff: number, isMobile: boolean): SlotStyle => {
  if (diff === 0) {
    return {
      left: "50%",
      scale: 1,
      rotateY: 0,
      zIndex: 40,
      opacity: 1,
      brightness: 1,
      pointerEvents: "auto",
    };
  }

  if (isMobile) {
    // Mobile: cards at 72vw with prominent 3D peek and inward angle
    if (diff === 1) {
      return {
        left: "74%",
        scale: 0.85,
        rotateY: -8,
        zIndex: 30,
        opacity: 0.85,
        brightness: 0.65,
        pointerEvents: "auto",
      };
    }
    if (diff === -1) {
      return {
        left: "26%",
        scale: 0.85,
        rotateY: 8,
        zIndex: 30,
        opacity: 0.85,
        brightness: 0.65,
        pointerEvents: "auto",
      };
    }
    if (diff === 2) {
      return {
        left: "88%",
        scale: 0.72,
        rotateY: -14,
        zIndex: 20,
        opacity: 0.4,
        brightness: 0.45,
        pointerEvents: "auto",
      };
    }
    if (diff === -2) {
      return {
        left: "12%",
        scale: 0.72,
        rotateY: 14,
        zIndex: 20,
        opacity: 0.4,
        brightness: 0.45,
        pointerEvents: "auto",
      };
    }
    return {
      left: "50%",
      scale: 0.6,
      rotateY: 0,
      zIndex: 5,
      opacity: 0,
      brightness: 0.2,
      pointerEvents: "none",
    };
  }

  // Desktop Framer-exact staggered 3D geometry
  if (diff === 1) {
    return {
      left: "58.5%",
      scale: 0.9,
      rotateY: -5,
      zIndex: 30,
      opacity: 0.85,
      brightness: 0.75,
      pointerEvents: "auto",
    };
  }
  if (diff === -1) {
    return {
      left: "41.5%",
      scale: 0.9,
      rotateY: 5,
      zIndex: 30,
      opacity: 0.85,
      brightness: 0.75,
      pointerEvents: "auto",
    };
  }
  if (diff === 2) {
    return {
      left: "66%",
      scale: 0.8,
      rotateY: -10,
      zIndex: 20,
      opacity: 0.55,
      brightness: 0.55,
      pointerEvents: "auto",
    };
  }
  if (diff === -2) {
    return {
      left: "34%",
      scale: 0.8,
      rotateY: 10,
      zIndex: 20,
      opacity: 0.55,
      brightness: 0.55,
      pointerEvents: "auto",
    };
  }
  if (diff === 3) {
    return {
      left: "72%",
      scale: 0.7,
      rotateY: -14,
      zIndex: 10,
      opacity: 0.2,
      brightness: 0.4,
      pointerEvents: "none",
    };
  }
  if (diff === -3) {
    return {
      left: "28%",
      scale: 0.7,
      rotateY: 14,
      zIndex: 10,
      opacity: 0.2,
      brightness: 0.4,
      pointerEvents: "none",
    };
  }
  return {
    left: "50%",
    scale: 0.6,
    rotateY: 0,
    zIndex: 5,
    opacity: 0,
    brightness: 0.3,
    pointerEvents: "none",
  };
};

export function ProjectCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const mouseStartX = useRef<number | null>(null);
  const isMouseDown = useRef(false);

  // Responsive breakpoint tracking
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + PROJECTS.length) % PROJECTS.length);
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % PROJECTS.length);
  }, []);

  // Infinite Gallery subtle auto-play (pauses on hover or user interaction)
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % PROJECTS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isHovered]);

  // Touch handlers that preserve full vertical page scrolling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setIsHovered(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsHovered(false);
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Only switch slides if horizontal swipe exceeds vertical drag and exceeds threshold
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 35) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("a, button")) return;
    mouseStartX.current = e.clientX;
    isMouseDown.current = true;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isMouseDown.current || mouseStartX.current === null) return;
    const deltaX = e.clientX - mouseStartX.current;
    if (Math.abs(deltaX) > 45) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    isMouseDown.current = false;
    mouseStartX.current = null;
  };

  return (
    <div className="w-full mt-2 sm:mt-6 md:mt-10 mb-6 md:mb-16">
      {/* Section Header */}
      <div className="mb-2 sm:mb-6 md:mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-60 mb-2 text-white">
          Our Projects
        </p>
        <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight leading-none text-white">
          Selected Works
        </h3>
      </div>

      {/* Infinite Gallery Stage */}
      <div
        className="relative w-full h-[225px] sm:h-[350px] md:h-[480px] lg:h-[520px] flex items-center justify-center overflow-hidden my-1 sm:my-4 select-none"
        style={{ perspective: "1000px" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          isMouseDown.current = false;
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {/* Left Click Zone (Prev) with hover indicator */}
        <div
          role="button"
          aria-label="Previous project"
          onClick={handlePrev}
          className="absolute left-0 top-0 w-[16%] sm:w-[22%] h-full z-35 cursor-w-resize group/left flex items-center justify-start pl-2 sm:pl-6 pointer-events-auto select-none"
        >
          <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/60 group-hover/left:text-white group-hover/left:border-white/40 group-hover/left:bg-black/80 transition-all opacity-0 group-hover/left:opacity-100 sm:group-hover/left:scale-105 shadow-xl">
            <ChevronLeft size={20} className="stroke-[2.5]" />
          </div>
        </div>

        {/* Right Click Zone (Next) with hover indicator */}
        <div
          role="button"
          aria-label="Next project"
          onClick={handleNext}
          className="absolute right-0 top-0 w-[16%] sm:w-[22%] h-full z-35 cursor-e-resize group/right flex items-center justify-end pr-2 sm:pr-6 pointer-events-auto select-none"
        >
          <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/60 group-hover/right:text-white group-hover/right:border-white/40 group-hover/right:bg-black/80 transition-all opacity-0 group-hover/right:opacity-100 sm:group-hover/right:scale-105 shadow-xl">
            <ChevronRight size={20} className="stroke-[2.5]" />
          </div>
        </div>

        {/* Layered Orbit Cards */}
        {PROJECTS.map((project, index) => {
          let diff = index - activeIndex;
          const total = PROJECTS.length;
          while (diff > total / 2) diff -= total;
          while (diff < -total / 2) diff += total;

          const isActive = diff === 0;
          const style = getSlotStyle(diff, isMobile);

          return (
            <motion.div
              key={project.id}
              animate={{
                left: style.left,
                scale: style.scale,
                rotateY: style.rotateY,
                opacity: style.opacity,
                filter: `brightness(${style.brightness})`,
              }}
              transition={{
                type: "spring",
                bounce: 0.2,
                duration: 0.45,
              }}
              style={{
                position: "absolute",
                top: "50%",
                x: "-50%",
                y: "-50%",
                zIndex: style.zIndex,
                pointerEvents: style.pointerEvents,
              }}
              onClick={() => {
                if (!isActive) {
                  setActiveIndex(index);
                }
              }}
              className={cn(
                "shrink-0 w-[72vw] max-w-[285px] sm:w-[500px] md:w-[600px] lg:w-[640px] sm:max-w-[640px] aspect-[16/11] sm:aspect-[16/10] rounded-2xl md:rounded-3xl overflow-hidden border transition-[box-shadow,border-color] duration-500 bg-[#121214] select-none group",
                isActive
                  ? "border-white/30 ring-1 ring-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_35px_rgba(253,82,0,0.22)] cursor-default"
                  : "border-white/10 shadow-2xl hover:border-white/25 cursor-pointer"
              )}
            >
              {/* Background Project Image */}
              <img
                src={project.image}
                alt={project.label}
                draggable={false}
                className={cn(
                  "w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 ease-out",
                  isActive && "group-hover:scale-105"
                )}
              />

              {/* Gradient Vignette & Card Content Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent flex flex-col justify-end p-3 sm:p-5 md:p-6 select-none">
                <div className="flex flex-col gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                  <div className="flex items-center justify-between gap-3">
                    {/* Category Tag */}
                    <div className="bg-white/10 backdrop-blur-md text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] border border-white/15 w-fit truncate">
                      {project.tag}
                    </div>

                    {/* CTA Button: Active on front card */}
                    {isActive ? (
                      <a
                        href={project.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="pointer-events-auto inline-flex items-center gap-1 sm:gap-2 bg-[var(--accent)] text-white font-bold text-[8px] sm:text-[10px] uppercase tracking-widest px-2.5 sm:px-4 py-1 sm:py-2 rounded-full hover:brightness-110 active:scale-95 transition-all duration-200 shadow-lg shadow-[var(--accent)]/30 group/btn"
                      >
                        <Globe className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        <span>View Project</span>
                        <ExternalLink
                          className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-70 group-hover/btn:opacity-100 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"
                        />
                      </a>
                    ) : (
                      <div className="opacity-0 sm:opacity-40 text-white/40 text-[9px] uppercase tracking-wider font-semibold">
                        Click to view
                      </div>
                    )}
                  </div>

                  {/* Project Title */}
                  <h4 className="text-sm sm:text-xl md:text-2xl font-bold uppercase tracking-tight text-white mt-0.5">
                    {project.label}
                  </h4>
                </div>

                {/* Description */}
                <p
                  className={cn(
                    "text-[10px] sm:text-xs md:text-sm text-white/70 leading-snug transition-opacity duration-300 max-w-[48ch]",
                    isActive ? "line-clamp-2 opacity-100" : "line-clamp-1 opacity-0 sm:opacity-50"
                  )}
                >
                  {project.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* SEO & Backlinks: Project Directory & Case Studies */}
      <div className="mt-6 sm:mt-14 md:mt-20 border-t border-white/10 pt-6 sm:pt-8">
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
