'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  Ref,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

function useMergeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  return useMemo(() => {
    if (refs.every((ref) => ref == null)) return null;
    return (node: T) => {
      refs.forEach((ref) => {
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref != null) {
          (ref as React.MutableRefObject<T | null>).current = node;
        }
      });
    };
  }, [refs]);
}

function useResponsiveValue(baseValue: number, mobileValue: number) {
  const [value, setValue] = useState(baseValue);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setValue(window.innerWidth < 768 ? mobileValue : baseValue);
    };

    handleResize();

    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [baseValue, mobileValue]);

  return value;
}

export interface RadialScrollGalleryProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Render function that returns the array of items to be placed on the wheel.
   * Receives the currently `hoveredIndex` to allow for parent-controlled hover states.
   */
  children: (hoveredIndex: number | null) => ReactNode[];
  /**
   * The vertical scroll distance (in pixels) required to complete one full 360-degree rotation.
   * Defaults to 2500.
   */
  scrollDuration?: number;
  /**
   * Percentage of the circle visible above the fold (0-100).
   * Determines how "deep" the wheel is buried. Defaults to 45.
   */
  visiblePercentage?: number;
  /** Radius of the circle on desktop devices (>=768px). */
  baseRadius?: number;
  /** Radius of the circle on mobile devices (<768px). */
  mobileRadius?: number;
  /**
   * GSAP ScrollTrigger start position string (e.g., "top 80%", "center center").
   */
  startTrigger?: string;
  /** Callback fired when an item is clicked or selected via keyboard. */
  onItemSelect?: (index: number) => void;
  /** Rotational direction of the wheel. */
  direction?: 'ltr' | 'rtl';
  /** Disables all interactions and applies a grayscale effect. */
  disabled?: boolean;
}

/**
 * A scroll-driven interaction that rotates items along a large, partially hidden circle.
 * The component pins itself to the viewport while the user scrolls through the rotational progress.
 */
export const RadialScrollGallery = forwardRef<
  HTMLDivElement,
  RadialScrollGalleryProps
>(
  (
    {
      children,
      scrollDuration = 2500,
      visiblePercentage = 45,
      baseRadius = 550,
      mobileRadius = 220,
      className = '',
      startTrigger = 'center center',
      onItemSelect,
      direction = 'ltr',
      disabled = false,
      ...rest
    },
    ref
  ) => {
    const pinRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLUListElement>(null);
    const childRef = useRef<HTMLLIElement>(null);

    const mergedRef = useMergeRefs(ref, pinRef);

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [childSize, setChildSize] = useState<{ w: number; h: number } | null>(
      null
    );
    const [isMounted, setIsMounted] = useState(false);

    // Clear hover state on scroll to fix mobile "sticky" touch states
    useEffect(() => {
      const handleScroll = () => {
        if (hoveredIndex !== null) setHoveredIndex(null);
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }, [hoveredIndex]);

    const currentRadius = useResponsiveValue(baseRadius, mobileRadius);
    const circleDiameter = currentRadius * 2;

    const { visibleDecimal, hiddenDecimal } = useMemo(() => {
      const clamped = Math.max(10, Math.min(100, visiblePercentage));
      const v = clamped / 100;
      return { visibleDecimal: v, hiddenDecimal: 1 - v };
    }, [visiblePercentage]);

    const childrenNodes = useMemo(
      () => React.Children.toArray(children(hoveredIndex)),
      [children, hoveredIndex]
    );
    const childrenCount = childrenNodes.length;

    // Measure the first child to determine layout buffers.
    // This ensures the container is tall enough to prevent clipping as items rotate.
    useEffect(() => {
      setIsMounted(true);

      if (!childRef.current) return;

      const observer = new ResizeObserver((entries) => {
        let hasChanged = false;
        for (const entry of entries) {
          setChildSize({
            w: entry.contentRect.width,
            h: entry.contentRect.height,
          });
          hasChanged = true;
        }
        if (hasChanged) {
          ScrollTrigger.refresh();
        }
      });

      observer.observe(childRef.current);
      return () => observer.disconnect();
    }, [childrenCount]);

    useGSAP(
      () => {
        if (!pinRef.current || !containerRef.current || childrenCount === 0)
          return;

        const prefersReducedMotion = window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches;
        if (prefersReducedMotion) return;

        // Unified pin + scrub rotation for all devices.
        // refreshPriority ensures it calculates after previously pinned sections.
        gsap.to(containerRef.current, {
          rotation: 360,
          ease: 'none',
          scrollTrigger: {
            trigger: pinRef.current,
            pin: true,
            start: startTrigger,
            end: `+=${scrollDuration}`,
            scrub: 1,
            invalidateOnRefresh: true,
            refreshPriority: 5,
          },
        });
      },
      {
        scope: pinRef,
        dependencies: [
          scrollDuration,
          currentRadius,
          startTrigger,
          childrenCount,
        ],
      }
    );

    if (childrenCount === 0) return null;

    // Calculate the total height required for the pinned container.
    // We need (Visible Circle Height) + (Half Item Height) + (Buffer) to ensure items aren't cut off by the mask.
    const scaleFactor = 1.25;
    const calculatedBuffer = childSize
      ? childSize.h * scaleFactor - childSize.h + 60
      : 150;

    const visibleAreaHeight = childSize
      ? circleDiameter * visibleDecimal + childSize.h / 2 + calculatedBuffer + 50
      : circleDiameter * visibleDecimal + 250;

    return (
      <div
        ref={mergedRef}
        className={`min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-background ${className}`}
        {...rest}
      >
        <div
          className='relative w-full overflow-hidden'
          style={{
            height: `${visibleAreaHeight}px`,
            maskImage:
              'linear-gradient(to top, transparent 0%, black 30%, black 100%)',
            WebkitMaskImage:
              'linear-gradient(to top, transparent 0%, black 30%, black 100%)',
          }}
        >
          <ul
            ref={containerRef}
            className={`
              absolute left-1/2 -translate-x-1/2 will-change-transform m-0 p-0 list-none
              transition-opacity duration-500 ease-out
              ${disabled ? 'opacity-50 pointer-events-none grayscale' : ''}
              ${isMounted ? 'opacity-100' : 'opacity-0'}
            `}
            dir={direction}
            style={{
              width: circleDiameter,
              height: circleDiameter,
              bottom: -(circleDiameter * hiddenDecimal),
            }}
          >
            {childrenNodes.map((child, index) => {
              const angle = (index / childrenCount) * 2 * Math.PI;
              let x = currentRadius * Math.cos(angle);
              const y = currentRadius * Math.sin(angle);

              if (direction === 'rtl') {
                x = -x;
              }

              const rotationAngle = (angle * 180) / Math.PI;
              const isHovered = hoveredIndex === index;
              const isAnyHovered = hoveredIndex !== null;

              return (
                <li
                  key={index}
                  ref={index === 0 ? childRef : null}
                  className='absolute top-1/2 left-1/2'
                  style={{
                    zIndex: isHovered ? 100 : 10,
                    transform: `translate(-50%, -50%) translate3d(${x.toFixed(3)}px, ${y.toFixed(3)}px, 0) rotate(${(rotationAngle + 90).toFixed(3)}deg)`,
                  }}
                >
                  <div
                    role='button'
                    tabIndex={disabled ? -1 : 0}
                    onClick={() => !disabled && onItemSelect?.(index)}
                    onKeyDown={(e) => {
                      if (disabled) return;
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onItemSelect?.(index);
                      }
                    }}
                    onMouseEnter={() => !disabled && setHoveredIndex(index)}
                    onMouseLeave={() => !disabled && setHoveredIndex(null)}
                    onFocus={() => !disabled && setHoveredIndex(index)}
                    onBlur={() => !disabled && setHoveredIndex(null)}
                    className={`
                      block cursor-pointer outline-none text-left
                      focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                      rounded-xl transition-all duration-300 ease-out will-change-transform
                      ${isHovered ? 'scale-110' : 'scale-100 opacity-90'}
                    `}
                  >
                    {child}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
);

RadialScrollGallery.displayName = 'RadialScrollGallery';

import { Check } from 'lucide-react';
import { MobileWorkflowVariant } from '@/components/blocks/animated-cards-stack';

const steps = [
{ step: "01", title: "Discovery", desc: "Requirements" },
{ step: "02", title: "Strategy", desc: "Roadmap" },
{ step: "03", title: "Design", desc: "Interface" },
{ step: "04", title: "Build", desc: "Development" },
{ step: "05", title: "Launch", desc: "Deployment" },
];

export function DemoRadialScrollGalleryBasic() {
  return (
    <>
      {/* DESKTOP ONLY: Radial Workflow */}
      <div className="relative bg-background font-sans text-foreground overflow-hidden w-full hidden md:block">
        {/* Header Section */}
        <div className="h-[300px] flex items-center justify-center px-4 pt-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
               Workflow
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl text-foreground">
              The Process
            </h1>
            <p className="text-foreground/60 text-sm max-w-[300px] mx-auto">
              Scroll down to see the steps.
            </p>
          </div>
        </div>

        <RadialScrollGallery
          baseRadius={350}
          mobileRadius={170}
          scrollDuration={1500}
          visiblePercentage={38}
        >
          {(hoveredIndex) =>
            steps.map((item, index) => {
              const isActive = hoveredIndex === index;
              return (
                <div
                  key={index}
                  className={`
                    w-[150px] h-[220px] sm:w-[190px] sm:h-[270px]
                    rounded-2xl border p-5 flex flex-col justify-between items-start
                    transition-all duration-300 shadow-md
                    ${isActive
                      ? 'bg-[#fd5200] border-[#fd5200] text-white shadow-[0_8px_32px_rgba(253,82,0,0.35)]'
                      : 'bg-card border-border/60 text-foreground'
                    }
                  `}
                >
                  <div className="w-full flex justify-between items-start">
                    <span className={`font-mono text-base ${isActive ? 'text-white/60' : 'text-foreground/40'}`}>
                      {item.step}
                    </span>
                    {isActive && <Check className="w-4 h-4 text-white/80" />}
                  </div>

                  <div>
                    <h3 className={`text-lg font-bold mb-1 ${isActive ? 'text-white' : 'text-foreground'}`}>{item.title}</h3>
                    <p className={`text-xs ${isActive ? 'text-white/70' : 'text-foreground/50'}`}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })
          }
        </RadialScrollGallery>

        <div className="h-[100px] flex items-center justify-center border-t border-border/10">
          <p className="text-foreground/40 text-sm">End of Workflow</p>
        </div>
      </div>

      {/* MOBILE ONLY: Vertical Stacked Cards Workflow */}
      <MobileWorkflowVariant />
    </>
  );
}
