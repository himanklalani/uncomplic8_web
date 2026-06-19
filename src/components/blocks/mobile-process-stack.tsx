"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "motion/react"
import { cn } from "@/lib/utils"

const STEPS = [
  {
    id: "step-1",
    step: "01",
    title: "Discovery",
    description:
      "We dive deep into your brand, understanding your goals, audience, and the core problems we need to solve together.",
    from: "#7c3aed",
    to: "#4f46e5",
  },
  {
    id: "step-2",
    step: "02",
    title: "Strategy",
    description:
      "Mapping out the technical architecture, design system, and timeline to ensure a flawless execution from day one.",
    from: "#0891b2",
    to: "#0284c7",
  },
  {
    id: "step-3",
    step: "03",
    title: "Design",
    description:
      "Crafting beautiful, high-performance UI/UX that captures your brand's unique aesthetic and engages your users.",
    from: "#059669",
    to: "#0d9488",
  },
  {
    id: "step-4",
    step: "04",
    title: "Build",
    description:
      "Writing clean, scalable code with cutting-edge frameworks like Next.js, Framer Motion, and GSAP.",
    from: "#ea580c",
    to: "#d97706",
  },
  {
    id: "step-5",
    step: "05",
    title: "Launch",
    description:
      "Rigorous testing, SEO optimization, and a seamless launch to ensure your project shines in the real world.",
    from: "#e11d48",
    to: "#db2777",
  },
]

interface CardProps {
  step: (typeof STEPS)[number]
  stackIndex: number   // 0 = top card, 1 = second, etc.
  total: number
  onDismiss: () => void
  isDraggable: boolean
}

function ProcessCard({ step, stackIndex, total, onDismiss, isDraggable }: CardProps) {
  const y = useMotionValue(0)
  const opacity = useTransform(y, [-160, -40, 0], [0, 0.6, 1])
  const rotate = useTransform(y, [-200, 0], ["-4deg", "0deg"])
  const dragScale = useTransform(y, [-160, 0], [0.93, 1])

  // stackIndex=0 is the TOP card. Cards behind shift down + shrink.
  const behindScale = 1 - stackIndex * 0.05
  const behindY = stackIndex * 14

  return (
    <motion.div
      initial={{ y: 60, opacity: 0, scale: 0.9 }}
      animate={
        isDraggable
          ? { y: 0, opacity: 1, scale: 1 }
          : { y: behindY, scale: behindScale, opacity: stackIndex < 4 ? 1 - stackIndex * 0.22 : 0 }
      }
      exit={{ y: -500, opacity: 0, transition: { duration: 0.35, ease: "easeIn" } }}
      style={
        isDraggable
          ? { y, opacity, rotate, scale: dragScale, zIndex: total - stackIndex }
          : { zIndex: total - stackIndex }
      }
      drag={isDraggable ? "y" : false}
      dragConstraints={{ top: -400, bottom: 60 }}
      dragElastic={{ top: 0.45, bottom: 0.08 }}
      onDragEnd={(_, info) => {
        if (info.offset.y < -80 || info.velocity.y < -400) {
          onDismiss()
        }
      }}
      className={cn(
        "absolute inset-0 rounded-3xl overflow-hidden",
        isDraggable ? "cursor-grab active:cursor-grabbing select-none" : "pointer-events-none"
      )}
    >
      {/* Gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${step.from}, ${step.to})`,
        }}
      />
      {/* Frosted noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.07] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />

      {/* Card content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-8">
        {/* Top row: step number + progress dots */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-white/50">
            {step.step} / {String(total).padStart(2, "0")}
          </span>
          <div className="flex gap-1.5">
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                className="h-1 rounded-full transition-all duration-300"
                style={{
                  width: i === total - 1 - stackIndex + (total - total) ? 20 : 6,
                  // highlight current card's dot
                  backgroundColor:
                    i === total - STEPS.length + (total - 1 - stackIndex)
                      ? "rgba(255,255,255,0.9)"
                      : "rgba(255,255,255,0.3)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Middle: big step number watermark */}
        <div
          className="font-mono font-black leading-none select-none"
          style={{ fontSize: "clamp(5rem, 25vw, 8rem)", color: "rgba(255,255,255,0.08)" }}
        >
          {step.step}
        </div>

        {/* Bottom: title + description + swipe hint */}
        <div className="space-y-4">
          <h4 className="text-3xl font-bold text-white tracking-tight leading-tight">
            {step.title}
          </h4>
          <p className="text-white/70 text-sm leading-relaxed">
            {step.description}
          </p>
          {isDraggable && (
            <div className="flex items-center gap-2 pt-2">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                className="text-white/40 text-lg"
              >
                ↑
              </motion.div>
              <span className="text-white/40 text-xs uppercase tracking-widest">
                Swipe up to continue
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export function MobileProcessStack({ className }: { className?: string }) {
  const [dismissed, setDismissed] = React.useState(0) // how many cards have been swiped
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => { setIsMounted(true) }, [])

  if (!isMounted) return null

  // remaining[0] = current top card, remaining[1] = card behind it, etc.
  const remaining = STEPS.slice(dismissed)
  const allDone = dismissed >= STEPS.length

  return (
    <div className={className}>
      {/* Header */}
      <div className="pt-10 pb-6 text-center">
        <h3 className="text-4xl font-semibold uppercase tracking-tight">The Process</h3>
        <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground uppercase tracking-widest">
          Swipe each card up to reveal the next step
        </p>
      </div>

      {/* Card stack area */}
      <div className="relative mx-auto w-[88vw] max-w-[340px] h-[440px]">
        <AnimatePresence mode="popLayout">
          {allDone ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center gap-6 border border-border bg-card"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
                className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
                style={{ background: "linear-gradient(135deg, #ea580c, #d97706)" }}
              >
                ✓
              </motion.div>
              <div className="text-center space-y-2 px-8">
                <h4 className="text-2xl font-bold">Ready to Start?</h4>
                <p className="text-sm text-muted-foreground">
                  Every great project begins with a conversation.
                </p>
              </div>
              <button
                onClick={() => setDismissed(0)}
                className="text-xs text-muted-foreground uppercase tracking-widest border border-border rounded-full px-4 py-2 hover:bg-accent transition-colors"
              >
                Replay ↺
              </button>
            </motion.div>
          ) : (
            // Render back-to-front: last item renders on top (highest z-index = top card)
            [...remaining].reverse().map((step, reversedI) => {
              const stackIndex = reversedI // 0 = back, highest = top
              // The top card is the LAST item in remaining[], which gets reversedI = remaining.length-1
              const isTop = reversedI === remaining.length - 1
              return (
                <ProcessCard
                  key={step.id}
                  step={step}
                  stackIndex={isTop ? 0 : remaining.length - 1 - reversedI}
                  total={STEPS.length}
                  isDraggable={isTop}
                  onDismiss={() => setDismissed((d) => d + 1)}
                />
              )
            })
          )}
        </AnimatePresence>
      </div>

      {/* Step counter below stack */}
      {!allDone && (
        <p className="text-center mt-8 text-xs text-muted-foreground uppercase tracking-widest">
          {dismissed + 1} of {STEPS.length}
        </p>
      )}
    </div>
  )
}
