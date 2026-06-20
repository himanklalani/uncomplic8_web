'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';
import { ProjectCarousel } from '@/components/ui/project-carousel';

gsap.registerPlugin(ScrollTrigger);

export interface FlowSectionProps {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  'aria-label'?: string;
}

export const FlowSection: React.FC<FlowSectionProps> = ({
  className,
  style = {},
  children,
  'aria-label': ariaLabel,
}) => (
  <section
    data-flow-section
    aria-label={ariaLabel}
    className={cn('relative min-h-[80vh] w-full overflow-hidden', className)}
  >
    <div
      data-flow-inner
      className={cn(
        'flow-art-container relative flex min-h-[80vh] w-full flex-col justify-between gap-4 px-6 md:px-[4vw] pt-[clamp(1.5rem,5vw,3vw)] pb-[5vw] md:pb-[3vw]',
        'will-change-transform',
      )}
      style={{ transformOrigin: 'bottom left', ...style }}
    >
      {children}
    </div>
  </section>
);

export interface FlowArtProps {
  children: React.ReactNode;
  className?: string;
  'aria-label'?: string;
}

const childCount = (children: React.ReactNode) => React.Children.count(children);

export const FlowArt: React.FC<FlowArtProps> = ({
  children,
  className,
  'aria-label': ariaLabel = 'Story scroll',
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useGSAP(
    () => {
      if (!containerRef.current || reducedMotion) return;

      const sections = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>('[data-flow-section]'),
      );
      if (sections.length === 0) return;

      const triggers: ScrollTrigger[] = [];

      const isMobile = window.innerWidth < 768;
      const pinOffset = isMobile ? "300vh" : "100vh";

      sections.forEach((section, i) => {
        gsap.set(section, { zIndex: i + 1 });

        const inner = section.querySelector<HTMLElement>('.flow-art-container');
        if (!inner) return;

        if (i > 0) {
          gsap.set(inner, { rotation: 30, transformOrigin: 'bottom left' });
          const tween = gsap.to(inner, {
            rotation: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'top 25%',
              scrub: true,
            },
          });
          if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
        }

        if (i < sections.length - 1) {
          triggers.push(
            ScrollTrigger.create({
              trigger: section,
              start: 'bottom bottom',
              end: `bottom top-=${pinOffset}`,
              pin: true,
              pinSpacing: false,
            }),
          );
        }
      });

      ScrollTrigger.refresh();

      return () => {
        triggers.forEach((t) => t.kill());
      };
    },
    { scope: containerRef, dependencies: [childCount(children), reducedMotion] },
  );

  return (
    <main
      ref={containerRef}
      aria-label={ariaLabel}
      className={cn('w-full overflow-x-hidden', className)}
    >
      {children}
    </main>
  );
};

export function FlowArtDefaultDemo() {
  return (
    <FlowArt aria-label="Presentation Flow Art">
      <FlowSection aria-label="Our Philosophy" style={{ backgroundColor: '#fd5200', color: '#fff' }}>
        <p className="text-xs font-bold uppercase tracking-[0.2em]">01 — Philosophy</p>
        <hr className="my-4 md:my-[1.5vw] border-none border-t border-black opacity-100" />
        <div>
          <h2
            className="text-[clamp(2rem,10vw,10rem)] font-bold leading-[0.85] tracking-tight uppercase"
          >
            Simplify.
            <br />
            Scale.
            <br />
            Succeed.
          </h2>
        </div>
        
        {/* Decorative Space Filler */}
        <div className="flex-1 flex items-center justify-center min-h-[20vh] opacity-[0.08] pointer-events-none md:opacity-[0.04]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="w-[60vw] h-[60vw] md:w-[30vw] md:h-[30vw] animate-[spin_40s_linear_infinite]">
            <path d="M12 2v20M17 5l-10 14M22 12H2M19 17L5 7" />
          </svg>
        </div>
        <hr className="my-4 md:my-[1.5vw] border-none border-t border-black opacity-100" />
        <p className="mt-auto max-w-[50ch] text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed">
          Technology should simplify your business, not complicate it. Because streamlined systems are quicker to scale.
        </p>
      </FlowSection>

      <FlowSection aria-label="Selected Works" style={{ backgroundColor: '#111111', color: '#fff' }}>
        <p className="text-xs font-bold uppercase tracking-[0.2em]">02 — Selected Works</p>
        <hr className="my-4 md:my-[1.5vw] border-none border-t border-white/60" />
        <div>
          <h2
            className="text-[clamp(2rem,10vw,10rem)] font-bold leading-[0.85] tracking-tight uppercase"
          >
            Code
            <br />
            First
            <br />
            Always
          </h2>
        </div>
        <hr className="my-4 md:my-[1.5vw] border-none border-t border-white/60" />
        <p className="max-w-[50ch] text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed">
          Real work, real clients, real results a collection of robust applications built with modern web technologies.
        </p>
        <hr className="my-4 md:my-[1.5vw] border-none border-t border-white/60" />
        {/* Projects carousel */}
        <div className="w-full">
          <ProjectCarousel />
        </div>
        <hr className="my-4 md:my-[1.5vw] border-none border-t border-white/60" />
        <p className="mt-auto ml-auto max-w-[50ch] text-right text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed">
          Every project we take on starts with one question how does this drive business value for the client?
        </p>
      </FlowSection>

      <FlowSection aria-label="Web Dev Workflow" style={{ backgroundColor: '#F5F0E8', color: '#111111' }}>
        <p className="text-xs font-bold uppercase tracking-[0.2em]">03 — Web Dev Workflow</p>
        <hr className="my-4 md:my-[1.5vw] border-none border-t border-black/60" />
        <div>
          <h2
            className="text-[clamp(2rem,10vw,10rem)] font-bold leading-[0.85] tracking-tight uppercase"
          >
            Build.
            <br />
            Optimize.
            <br />
            Ship.
          </h2>
        </div>
        <hr className="my-4 md:my-[1.5vw] border-none border-t border-black/60" />
        <p className="max-w-[50ch] text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed">
          A six-step engineering pipeline. From scalable React architectures to flawless Next.js deployments, zero complexity for you.
        </p>
        <hr className="my-4 md:my-[1.5vw] border-none border-t border-black/60" />
        <div className="flex flex-wrap gap-8 md:gap-[3vw]">
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider">01 — Architecture</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              Deep dive into your system requirements and API integrations before writing a single line of code.
            </p>
          </div>
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider">02 — Frontend</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              Crafting intuitive, high-converting React interfaces that look stunning and feel effortless.
            </p>
          </div>
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider">03 — Core Logic</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              Building lightning-fast, secure backends using modern TypeScript and edge computing.
            </p>
          </div>
        </div>
        <hr className="my-4 md:my-[1.5vw] border-none border-t border-black/60" />
        <div className="flex flex-wrap gap-8 md:gap-[3vw]">
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider">04 — Interaction</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              Implementing cinematic scroll animations and complex GSAP micro-interactions natively.
            </p>
          </div>
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider">05 — SEO & Speed</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              Rigorous performance audits ensuring 100 Lighthouse scores and top-tier search visibility.
            </p>
          </div>
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider">06 — Deployment</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              Deploying globally to edge networks with robust CI/CD pipelines, handing over the keys seamlessly.
            </p>
          </div>
        </div>
      </FlowSection>

      <FlowSection aria-label="True Ownership" style={{ backgroundColor: '#D1CBC0', color: '#111111' }}>
        <p className="text-xs font-bold uppercase tracking-[0.2em]">04 — True Ownership</p>
        <hr className="my-4 md:my-[1.5vw] border-none border-t border-black/50" />
        <div>
          <h2
            className="text-[clamp(2rem,10vw,10rem)] font-bold leading-[0.85] tracking-tight uppercase"
          >
            Future
            <br />
            Proof
            <br />
            Code
          </h2>
        </div>
        <hr className="my-4 md:my-[1.5vw] border-none border-t border-black/50" />
        <p className="max-w-[50ch] text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed">
          How beneficial will working together be? Since we code everything natively, all ownership post-development is 100% yours.
        </p>
        <hr className="my-4 md:my-[1.5vw] border-none border-t border-black/50" />
        <div className="flex flex-wrap gap-8 md:gap-[3vw]">
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider">Zero Lock-in</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              Full source code ownership. No proprietary CMS traps, no hostage situations. You have the freedom to make changes without limitations throughout the project's lifetime.
            </p>
          </div>
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider">Continuous Audits</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              If a solution already exists, we provide thorough audits first. Even post-deployment, regular audits ensure your platform remains highly performant and secure.
            </p>
          </div>
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider">Smooth Sailing</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              After deployment, most projects run completely automatically. If ad-hoc changes are needed later, we step in for a small, transparent fee for that specific time.
            </p>
          </div>
        </div>
        <hr className="my-4 md:my-[1.5vw] border-none border-t border-black/50" />
        <p className="max-w-[50ch] text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed">
          We don't just build websites. We engineer durable digital assets that belong entirely to you, designed to scale as your business grows.
        </p>
      </FlowSection>

      <FlowSection aria-label="Let's Talk" style={{ backgroundColor: '#111111', color: '#fff' }}>
        <p className="text-xs font-bold uppercase tracking-[0.2em]">05 — Let's Talk</p>
        <hr className="my-4 md:my-[1.5vw] border-none border-t border-white/60" />
        <div>
          <h2
            className="text-[clamp(2rem,10vw,10rem)] font-bold leading-[0.85] tracking-tight uppercase"
          >
            Ready
            <br />
            To
            <br />
            Begin?
          </h2>
        </div>

        {/* Decorative Space Filler */}
        <div className="flex-1 flex items-center justify-center min-h-[20vh] opacity-[0.05] pointer-events-none md:opacity-[0.03]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="w-[60vw] h-[60vw] md:w-[30vw] md:h-[30vw] animate-[spin_60s_linear_infinite]">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            <path d="M2 12h20" />
          </svg>
        </div>
        <hr className="my-4 md:my-[1.5vw] border-none border-t border-white/60" />
        <p className="mt-auto max-w-[50ch] text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed">
          Take control of your digital presence. Let's discuss your vision, audit your needs, and build something extraordinary together.
        </p>
      </FlowSection>
    </FlowArt>
  );
}

export default FlowArt;
