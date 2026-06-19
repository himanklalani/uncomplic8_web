"use client" 

import * as React from "react"

import { VariantProps, cva } from "class-variance-authority"
import {
  HTMLMotionProps,
  MotionValue,
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "motion/react"
import { Search, Map, PenTool, Code, Rocket } from "lucide-react"

import { cn } from "@/lib/utils"

const cardVariants = cva("absolute will-change-transform shadow-xl", {
  variants: {
    variant: {
      default: "flex size-full flex-col items-start justify-between gap-4 rounded-3xl border border-border bg-card p-6 md:p-8 backdrop-blur-md text-card-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

interface CardStickyProps
  extends HTMLMotionProps<"div">,
    VariantProps<typeof cardVariants> {
  arrayLength: number
  index: number
  incrementY?: number
  incrementZ?: number
  incrementRotation?: number
}
interface ContainerScrollContextValue {
  scrollYProgress: MotionValue<number>
}

const ContainerScrollContext = React.createContext<
  ContainerScrollContextValue | undefined
>(undefined)

function useContainerScrollContext() {
  const context = React.useContext(ContainerScrollContext)
  if (context === undefined) {
    throw new Error(
      "useContainerScrollContext must be used within a ContainerScrollContextProvider"
    )
  }
  return context
}

export const ContainerScroll: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ children, style, className, ...props }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start center", "end end"],
  })

  return (
    <ContainerScrollContext.Provider value={{ scrollYProgress }}>
      <div
        ref={scrollRef}
        className={cn("relative min-h-svh w-full", className)}
        style={{ perspective: "1000px", ...style }}
        {...props}
      >
        {children}
      </div>
    </ContainerScrollContext.Provider>
  )
}
ContainerScroll.displayName = "ContainerScroll"

export const CardsContainer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      style={{ perspective: "1000px", ...props.style }}
      {...props}
    >
      {children}
    </div>
  )
}
CardsContainer.displayName = "CardsContainer"

export const CardTransformed = React.forwardRef<
  HTMLDivElement,
  CardStickyProps
>(
  (
    {
      arrayLength,
      index,
      incrementY = 12,
      incrementZ = 10,
      incrementRotation = -index + 90,
      className,
      variant,
      style,
      ...props
    },
    ref
  ) => {
    const { scrollYProgress } = useContainerScrollContext()

    const start = index / (arrayLength + 1)
    const end = (index + 1) / (arrayLength + 1)
    const range = React.useMemo(() => [start, end], [start, end])
    const rotateRange = [range[0] - 1.5, range[1] / 1.5]

    const y = useTransform(scrollYProgress, range, ["0%", "-180%"])
    const rotate = useTransform(scrollYProgress, rotateRange, [
      incrementRotation,
      0,
    ])
    const transform = useMotionTemplate`translateZ(${
      index * incrementZ
    }px) translateY(${y}) rotate(${rotate}deg)`

    const dx = useTransform(scrollYProgress, rotateRange, [4, 0])
    const dy = useTransform(scrollYProgress, rotateRange, [4, 12])
    const blur = useTransform(scrollYProgress, rotateRange, [2, 24])
    const alpha = useTransform(scrollYProgress, rotateRange, [0.1, 0.15])
    
    // Always apply filter for our unified theme
    const filter = useMotionTemplate`drop-shadow(${dx}px ${dy}px ${blur}px rgba(0,0,0,${alpha}))`

    const cardStyle = {
      top: index * incrementY,
      transform,
      backfaceVisibility: "hidden" as const,
      zIndex: (arrayLength - index) * incrementZ,
      filter,
      ...style,
    }
    return (
      <motion.div
        layout="position"
        ref={ref}
        style={cardStyle}
        className={cn(cardVariants({ variant, className }))}
        {...props}
      />
    )
  }
)
CardTransformed.displayName = "CardTransformed"


const WORKFLOW_STEPS = [
  { step: "01", title: "Discovery", desc: "Requirements gathering and deep-dive strategy sessions.", icon: Search },
  { step: "02", title: "Strategy", desc: "Actionable roadmaps and precise technical architecture.", icon: Map },
  { step: "03", title: "Design", desc: "Intuitive interface design and user experience prototyping.", icon: PenTool },
  { step: "04", title: "Build", desc: "Robust development and rigorous quality assurance.", icon: Code },
  { step: "05", title: "Launch", desc: "Seamless deployment and continuous post-launch support.", icon: Rocket },
]

export function MobileWorkflowVariant() {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50;
    // If swiped significantly in ANY direction, advance to next card (looping)
    if (Math.abs(info.offset.x) > swipeThreshold || Math.abs(info.offset.y) > swipeThreshold) {
      setActiveIndex((prev) => (prev + 1) % WORKFLOW_STEPS.length);
    }
  };

  return (
    <section className="bg-background px-4 py-16 md:hidden block relative w-full overflow-hidden min-h-[90svh] flex flex-col">
      <div className="mb-12 relative z-20 shrink-0">
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground uppercase tracking-wider">
             Workflow
          </div>
        </div>
        <h2 className="text-center text-4xl sm:text-5xl font-bold tracking-tighter">The Process</h2>
        <p className="mx-auto mt-3 max-w-[280px] text-center text-sm text-foreground/60">
          Swipe up or down to navigate steps.
        </p>
      </div>
      
      <div className="relative w-full flex-1 flex flex-col items-center justify-start pt-8 pb-32 perspective-[1000px]">
        <div className="relative mx-auto w-full max-w-[300px] h-[360px]">
          {WORKFLOW_STEPS.map((step, index) => {
            const Icon = step.icon;
            
            // Calculate relative position to active index (looping)
            const diff = (index - activeIndex + WORKFLOW_STEPS.length) % WORKFLOW_STEPS.length;
            
            // Cards stack infinitely. Active is 0. Behind are 1, 2, 3, 4.
            const y = diff * 25; // Push down 25px per step behind
            const scale = 1 - diff * 0.05; // Shrink by 5% per step behind
            const opacity = 1; // 100% opaque to prevent text bleeding
            const zIndex = 10 - diff;

            // Only the top card is draggable
            const isDraggable = diff === 0;

            return (
              <motion.div
                key={step.step}
                className="absolute top-0 left-0 w-full h-full flex flex-col items-start justify-between gap-4 rounded-3xl border border-border/80 bg-background md:p-8 p-6 shadow-xl text-foreground will-change-transform"
                initial={false}
                animate={{ y, scale, opacity, zIndex }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                drag={isDraggable ? true : false}
                dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={handleDragEnd}
                style={{

                  touchAction: "none" // Prevent scroll when swiping card
                }}
              >
                <div className="w-full flex justify-between items-start pointer-events-none">
                  <span className="font-mono text-xl text-foreground/30 font-medium">{step.step}</span>
                  <div className="flex size-14 items-center justify-center rounded-full bg-foreground/5 text-foreground border border-border/30">
                    <Icon className="w-6 h-6 opacity-80" strokeWidth={1.5} />
                  </div>
                </div>
                
                <div className="mt-6 w-full pointer-events-none">
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-foreground/60 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Pagination Dots */}
        <div className="mt-16 flex gap-2 justify-center z-20">
          {WORKFLOW_STEPS.map((_, i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-300 ${
                i === activeIndex ? "w-8 bg-foreground" : "w-2 bg-foreground/20"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

