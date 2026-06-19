"use client";

import { motion } from "framer-motion";
import { GripHorizontal } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const Skiper26 = () => {
  const [variant, setVariant] = useState<AnimationVariant>("rectangle");
  const [start, setStart] = useState<AnimationStart>("bottom-up");
  const [blur, setBlur] = useState<boolean>(false);
  const [gifType, setGifType] = useState<"1" | "2" | "3" | "custom">("1");
  const [gifUrl, setGifUrl] = useState<string>(
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
  );

  return (
    <div className="relative flex min-h-[80vh] w-full flex-col items-center justify-center bg-background text-foreground z-10 py-32 overflow-hidden">
      <div className="mx-auto max-w-lg space-y-5 px-6 text-center lg:text-left relative z-20">
        <h2 className="mt-16 lg:mt-36 text-4xl font-medium tracking-tight">
          07.09.2025 <br />
          Experience Mode Switch
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          The toggle isn't just a switch. It's an entire visual transformation crafted specifically to ensure the mood matches the hour. Seamless view transitions powered by modern browser APIs.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Change the animation styles and variants using the floating options panel. Then click the toggle below to witness the metamorphosis.
        </p>
      </div>

      <div className="text-foreground grid content-start justify-items-center gap-6 py-20 text-center relative z-20">
        <span className="after:from-background after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:content-['']">
          Click to toggle the theme
        </span>
      </div>

      <div className="relative z-30">
        <ThemeToggleButton
          variant={variant}
          start={start}
          blur={blur}
          gifUrl={gifUrl}
        />
      </div>

      <Options
        variant={variant}
        start={start}
        blur={blur}
        gifType={gifType}
        gifUrl={gifUrl}
        setVariant={setVariant}
        setStart={setStart}
        setBlur={setBlur}
        setGifType={setGifType}
        setGifUrl={setGifUrl}
      />
    </div>
  );
};

export const Options = ({
  variant,
  start,
  blur,
  gifType,
  gifUrl,
  setVariant,
  setStart,
  setBlur,
  setGifType,
  setGifUrl,
}: {
  variant: AnimationVariant;
  start: AnimationStart;
  blur: boolean;
  gifType: "1" | "2" | "3" | "custom";
  gifUrl: string;
  setVariant: (variant: AnimationVariant) => void;
  setStart: (start: AnimationStart) => void;
  setBlur: (blur: boolean) => void;
  setGifType: (type: "1" | "2" | "3" | "custom") => void;
  setGifUrl: (url: string) => void;
}) => {
  return (
    <motion.div
      drag
      className="absolute top-10 right-1/2 z-50 flex w-[265px] translate-x-1/2 flex-col gap-3 rounded-2xl border border-border bg-muted2/90 p-4 backdrop-blur-md shadow-2xl lg:right-10 lg:translate-x-0"
    >
      <div className="flex items-center justify-between">
        <span className="size-4 cursor-grab active:cursor-grabbing text-muted-foreground">
          <GripHorizontal className="size-4" />
        </span>

        <p className="group flex cursor-pointer items-center justify-center gap-1 rounded-lg px-2 py-1 text-xs font-medium uppercase tracking-widest opacity-60">
          Transition
        </p>
      </div>

      <div className="flex flex-col text-foreground">
        <div className="mt-1 flex justify-between py-1 border-t border-border/50">
          <p className="w-20 whitespace-nowrap text-xs uppercase opacity-50 mt-1">Variant</p>
          <div className="flex flex-wrap items-center justify-end gap-1">
            {["circle", "rectangle", "gif", "polygon", "circle-blur"].map((v) => (
              <button
                key={v}
                onClick={() => setVariant(v as AnimationVariant)}
                className={cn(
                  "cursor-pointer px-1.5 py-0.5 rounded text-xs transition-colors",
                  variant === v
                    ? "bg-foreground/10 font-medium"
                    : "opacity-60 hover:opacity-100 hover:bg-foreground/5",
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-2 flex justify-between py-1 border-t border-border/50">
          <p className="w-20 whitespace-nowrap text-xs uppercase opacity-50 mt-1">Blur</p>
          <div className="flex flex-wrap items-center justify-end gap-1">
            <button
              onClick={() => setBlur(false)}
              className={cn(
                "cursor-pointer px-1.5 py-0.5 rounded text-xs transition-colors",
                !blur ? "bg-foreground/10 font-medium" : "opacity-60 hover:opacity-100 hover:bg-foreground/5"
              )}
            >
              off
            </button>
            <button
              onClick={() => setBlur(true)}
              className={cn(
                "cursor-pointer px-1.5 py-0.5 rounded text-xs transition-colors",
                blur ? "bg-foreground/10 font-medium" : "opacity-60 hover:opacity-100 hover:bg-foreground/5"
              )}
            >
              on
            </button>
          </div>
        </div>

        {(variant === "circle" || variant === "rectangle" || variant === "polygon" || variant === "circle-blur") && (
          <div className="mt-2 flex justify-between py-1 border-t border-border/50">
            <p className="w-20 whitespace-nowrap text-xs uppercase opacity-50 mt-1">Start</p>
            <div className="flex flex-wrap items-center justify-end gap-1">
              {(variant === "circle" || variant === "circle-blur") && (
                <button
                  onClick={() => setStart("center")}
                  className={cn("cursor-pointer px-1.5 py-0.5 rounded text-xs transition-colors", start === "center" ? "bg-foreground/10" : "opacity-60 hover:opacity-100 hover:bg-foreground/5")}
                >
                  center
                </button>
              )}

              {variant === "rectangle" && (
                <>
                  {["bottom-up", "top-down", "left-right", "right-left"].map(d => (
                    <button
                      key={d}
                      onClick={() => setStart(d as AnimationStart)}
                      className={cn("cursor-pointer px-1.5 py-0.5 rounded text-xs transition-colors", start === d ? "bg-foreground/10" : "opacity-60 hover:opacity-100 hover:bg-foreground/5")}
                    >
                      {d}
                    </button>
                  ))}
                </>
              )}

              {(variant === "circle" || variant === "polygon" || variant === "circle-blur") && (
                <>
                  {["top-left", "top-right"].map(d => (
                    <button
                      key={d}
                      onClick={() => setStart(d as AnimationStart)}
                      className={cn("cursor-pointer px-1.5 py-0.5 rounded text-xs transition-colors", start === d ? "bg-foreground/10" : "opacity-60 hover:opacity-100 hover:bg-foreground/5")}
                    >
                      {d}
                    </button>
                  ))}
                  {variant !== "polygon" && (
                    <>
                      {["bottom-left", "bottom-right"].map(d => (
                        <button
                          key={d}
                          onClick={() => setStart(d as AnimationStart)}
                          className={cn("cursor-pointer px-1.5 py-0.5 rounded text-xs transition-colors", start === d ? "bg-foreground/10" : "opacity-60 hover:opacity-100 hover:bg-foreground/5")}
                        >
                          {d}
                        </button>
                      ))}
                    </>
                  )}
                </>
              )}

              {(variant === "circle" || variant === "circle-blur") && (
                <>
                  {["top-center", "bottom-center"].map(d => (
                    <button
                      key={d}
                      onClick={() => setStart(d as AnimationStart)}
                      className={cn("cursor-pointer px-1.5 py-0.5 rounded text-xs transition-colors", start === d ? "bg-foreground/10" : "opacity-60 hover:opacity-100 hover:bg-foreground/5")}
                    >
                      {d}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        )}

        {variant === "gif" && (
          <div className="mt-2 flex justify-between py-1 border-t border-border/50">
            <p className="w-20 text-xs uppercase opacity-50 mt-1">Image :</p>
            <div className="flex flex-wrap items-center justify-end gap-1">
              <button
                onClick={() => {
                  setGifType("1");
                  setGifUrl("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop");
                }}
                className={cn("cursor-pointer px-1.5 py-0.5 rounded text-xs transition-colors", gifType === "1" ? "bg-foreground/10" : "opacity-60 hover:opacity-100 hover:bg-foreground/5")}
              >
                1
              </button>
              <button
                onClick={() => {
                  setGifType("2");
                  setGifUrl("https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop");
                }}
                className={cn("cursor-pointer px-1.5 py-0.5 rounded text-xs transition-colors", gifType === "2" ? "bg-foreground/10" : "opacity-60 hover:opacity-100 hover:bg-foreground/5")}
              >
                2
              </button>
              <button
                onClick={() => setGifType("custom")}
                className={cn("cursor-pointer px-1.5 py-0.5 rounded text-xs transition-colors", gifType === "custom" ? "bg-foreground/10" : "opacity-60 hover:opacity-100 hover:bg-foreground/5")}
              >
                url
              </button>
            </div>
          </div>
        )}

        {variant === "gif" && gifType === "custom" && (
          <div className="mt-2 flex flex-col gap-2 py-2 border-t border-border/50">
            <p className="text-xs uppercase opacity-50">URL</p>
            <input
              type="text"
              value={gifUrl}
              onChange={(e) => setGifUrl(e.target.value)}
              placeholder="Enter Image URL"
              className="text-foreground placeholder:text-foreground/30 w-full rounded-md border border-border/50 bg-background/50 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-foreground/20"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const useThemeToggle = ({
  variant = "circle",
  start = "center",
  blur = false,
  gifUrl = "",
}: {
  variant?: AnimationVariant;
  start?: AnimationStart;
  blur?: boolean;
  gifUrl?: string;
} = {}) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(resolvedTheme === "dark");
  }, [resolvedTheme]);

  const styleId = "theme-transition-styles";

  const updateStyles = useCallback((css: string, name: string) => {
    if (typeof window === "undefined") return;

    let styleElement = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = css;
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark(!isDark);
    const animation = createAnimation(variant, start, blur, gifUrl);
    updateStyles(animation.css, animation.name);

    if (typeof window === "undefined") return;

    const switchTheme = () => {
      setTheme(theme === "light" ? "dark" : "light");
    };

    if (!document.startViewTransition) {
      switchTheme();
      return;
    }

    document.startViewTransition(switchTheme);
  }, [theme, setTheme, variant, start, blur, gifUrl, updateStyles, isDark, setIsDark]);

  return { isDark, toggleTheme };
};

export const ThemeToggleButton = ({
  className = "",
  variant = "circle",
  start = "center",
  blur = false,
  gifUrl = "",
}: {
  className?: string;
  variant?: AnimationVariant;
  start?: AnimationStart;
  blur?: boolean;
  gifUrl?: string;
}) => {
  const { isDark, toggleTheme } = useThemeToggle({
    variant,
    start,
    blur,
    gifUrl,
  });

  return (
    <button
      type="button"
      className={cn(
        "size-12 cursor-pointer rounded-full bg-foreground text-background shadow-lg hover:scale-105 transition-all duration-300 active:scale-95 flex items-center justify-center p-2",
        className,
      )}
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      <span className="sr-only">Toggle theme</span>
      <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <motion.g
          animate={{ rotate: isDark ? -180 : 0 }}
          transition={{ ease: "easeInOut", duration: 0.5 }}
        >
          <path
            d="M120 67.5C149.25 67.5 172.5 90.75 172.5 120C172.5 149.25 149.25 172.5 120 172.5"
            fill="currentColor"
          />
          <path
            d="M120 67.5C90.75 67.5 67.5 90.75 67.5 120C67.5 149.25 90.75 172.5 120 172.5"
            fill="currentColor"
            opacity="0.3"
          />
        </motion.g>
        <motion.path
          animate={{ rotate: isDark ? 180 : 0 }}
          transition={{ ease: "easeInOut", duration: 0.5 }}
          d="M120 3.75C55.5 3.75 3.75 55.5 3.75 120C3.75 184.5 55.5 236.25 120 236.25C184.5 236.25 236.25 184.5 236.25 120C236.25 55.5 184.5 3.75 120 3.75ZM120 214.5V172.5C90.75 172.5 67.5 149.25 67.5 120C67.5 90.75 90.75 67.5 120 67.5V25.5C172.5 25.5 214.5 67.5 214.5 120C214.5 172.5 172.5 214.5 120 214.5Z"
          fill="currentColor"
        />
      </svg>
    </button>
  );
};

export type AnimationVariant = "circle" | "rectangle" | "gif" | "polygon" | "circle-blur";
export type AnimationStart = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center" | "top-center" | "bottom-center" | "bottom-up" | "top-down" | "left-right" | "right-left";

interface Animation { name: string; css: string; }

const getPositionCoords = (position: AnimationStart) => {
  switch (position) {
    case "top-left": return { cx: "0", cy: "0" };
    case "top-right": return { cx: "40", cy: "0" };
    case "bottom-left": return { cx: "0", cy: "40" };
    case "bottom-right": return { cx: "40", cy: "40" };
    case "top-center": return { cx: "20", cy: "0" };
    case "bottom-center": return { cx: "20", cy: "40" };
    default: return { cx: "20", cy: "20" };
  }
};

const generateSVG = (variant: AnimationVariant, start: AnimationStart) => {
  if (variant === "circle-blur") {
    if (start === "center") {
      return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><filter id="blur"><feGaussianBlur stdDeviation="2"/></filter></defs><circle cx="20" cy="20" r="18" fill="white" filter="url(%23blur)"/></svg>`;
    }
    const { cx, cy } = getPositionCoords(start)!;
    return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><filter id="blur"><feGaussianBlur stdDeviation="2"/></filter></defs><circle cx="${cx}" cy="${cy}" r="18" fill="white" filter="url(%23blur)"/></svg>`;
  }
  if (start === "center") return "";
  if (variant === "rectangle") return "";

  const { cx, cy } = getPositionCoords(start)!;
  if (variant === "circle") {
    return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="${cx}" cy="${cy}" r="20" fill="white"/></svg>`;
  }
  return "";
};

const getTransformOrigin = (start: AnimationStart) => {
  switch (start) {
    case "top-left": return "top left";
    case "top-right": return "top right";
    case "bottom-left": return "bottom left";
    case "bottom-right": return "bottom right";
    case "top-center": return "top center";
    case "bottom-center": return "bottom center";
    default: return "center";
  }
};

export const createAnimation = (variant: AnimationVariant, start: AnimationStart = "center", blur = false, url?: string): Animation => {
  const svg = generateSVG(variant, start);
  const transformOrigin = getTransformOrigin(start);

  if (variant === "rectangle") {
    const getClipPath = (direction: AnimationStart) => {
      switch (direction) {
        case "bottom-up": return { from: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)", to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" };
        case "top-down": return { from: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)", to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" };
        case "left-right": return { from: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)", to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" };
        case "right-left": return { from: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)", to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" };
        case "top-left": return { from: "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)", to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" };
        case "top-right": return { from: "polygon(100% 0%, 100% 0%, 100% 0%, 100% 0%)", to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" };
        case "bottom-left": return { from: "polygon(0% 100%, 0% 100%, 0% 100%, 0% 100%)", to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" };
        case "bottom-right": return { from: "polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)", to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" };
        default: return { from: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)", to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" };
      }
    };
    const clipPath = getClipPath(start);
    return {
      name: `${variant}-${start}${blur ? "-blur" : ""}`,
      css: `
      ::view-transition-new(root) { animation-name: reveal-light-${start}${blur ? "-blur" : ""}; ${blur ? "filter: blur(2px);" : ""} }
      ::view-transition-old(root), .dark::view-transition-old(root) { animation: none; z-index: -1; }
      .dark::view-transition-new(root) { animation-name: reveal-dark-${start}${blur ? "-blur" : ""}; ${blur ? "filter: blur(2px);" : ""} }
      @keyframes reveal-dark-${start}${blur ? "-blur" : ""} { from { clip-path: ${clipPath.from}; ${blur ? "filter: blur(8px);" : ""} } ${blur ? "50% { filter: blur(4px); }" : ""} to { clip-path: ${clipPath.to}; ${blur ? "filter: blur(0px);" : ""} } }
      @keyframes reveal-light-${start}${blur ? "-blur" : ""} { from { clip-path: ${clipPath.from}; ${blur ? "filter: blur(8px);" : ""} } ${blur ? "50% { filter: blur(4px); }" : ""} to { clip-path: ${clipPath.to}; ${blur ? "filter: blur(0px);" : ""} } }
      `,
    };
  }

  if (variant === "circle" && start == "center") {
    return {
      name: `${variant}-${start}${blur ? "-blur" : ""}`,
      css: `
      ::view-transition-new(root) { animation-name: reveal-light${blur ? "-blur" : ""}; ${blur ? "filter: blur(2px);" : ""} }
      ::view-transition-old(root), .dark::view-transition-old(root) { animation: none; z-index: -1; }
      .dark::view-transition-new(root) { animation-name: reveal-dark${blur ? "-blur" : ""}; ${blur ? "filter: blur(2px);" : ""} }
      @keyframes reveal-dark${blur ? "-blur" : ""} { from { clip-path: circle(0% at 50% 50%); ${blur ? "filter: blur(8px);" : ""} } ${blur ? "50% { filter: blur(4px); }" : ""} to { clip-path: circle(100.0% at 50% 50%); ${blur ? "filter: blur(0px);" : ""} } }
      @keyframes reveal-light${blur ? "-blur" : ""} { from { clip-path: circle(0% at 50% 50%); ${blur ? "filter: blur(8px);" : ""} } ${blur ? "50% { filter: blur(4px); }" : ""} to { clip-path: circle(100.0% at 50% 50%); ${blur ? "filter: blur(0px);" : ""} } }
      `,
    };
  }

  if (variant === "gif") {
    return {
      name: `${variant}-${start}`,
      css: `
      ::view-transition-group(root) { animation-timing-function: var(--expo-in); }
      ::view-transition-new(root) { mask: url('${url}') center / 0 no-repeat; animation: scale 3s; }
      ::view-transition-old(root), .dark::view-transition-old(root) { animation: scale 3s; }
      @keyframes scale { 0% { mask-size: 0; } 10% { mask-size: 50vmax; } 90% { mask-size: 50vmax; } 100% { mask-size: 2000vmax; } }`,
    };
  }

  if (variant === "circle-blur") {
    if (start === "center") {
      return {
        name: `${variant}-${start}`,
        css: `
        ::view-transition-new(root) { mask: url('${svg}') center / 0 no-repeat; mask-origin: content-box; animation: scale 1s; transform-origin: center; }
        ::view-transition-old(root), .dark::view-transition-old(root) { animation: scale 1s; transform-origin: center; z-index: -1; }
        @keyframes scale { to { mask-size: 350vmax; } }
        `,
      };
    }
    return {
      name: `${variant}-${start}`,
      css: `
      ::view-transition-new(root) { mask: url('${svg}') ${start.replace("-", " ")} / 0 no-repeat; mask-origin: content-box; animation: scale 1s; transform-origin: ${transformOrigin}; }
      ::view-transition-old(root), .dark::view-transition-old(root) { animation: scale 1s; transform-origin: ${transformOrigin}; z-index: -1; }
      @keyframes scale { to { mask-size: 350vmax; } }
      `,
    };
  }

  if (variant === "polygon") {
    const getPolygonClipPaths = (position: AnimationStart) => {
      switch (position) {
        case "top-left":
          return { darkFrom: "polygon(50% -71%, -50% 71%, -50% 71%, 50% -71%)", darkTo: "polygon(50% -71%, -50% 71%, 50% 171%, 171% 50%)", lightFrom: "polygon(171% 50%, 50% 171%, 50% 171%, 171% 50%)", lightTo: "polygon(171% 50%, 50% 171%, -50% 71%, 50% -71%)" };
        case "top-right":
          return { darkFrom: "polygon(150% -71%, 250% 71%, 250% 71%, 150% -71%)", darkTo: "polygon(150% -71%, 250% 71%, 50% 171%, -71% 50%)", lightFrom: "polygon(-71% 50%, 50% 171%, 50% 171%, -71% 50%)", lightTo: "polygon(-71% 50%, 50% 171%, 250% 71%, 150% -71%)" };
        default:
          return { darkFrom: "polygon(50% -71%, -50% 71%, -50% 71%, 50% -71%)", darkTo: "polygon(50% -71%, -50% 71%, 50% 171%, 171% 50%)", lightFrom: "polygon(171% 50%, 50% 171%, 50% 171%, 171% 50%)", lightTo: "polygon(171% 50%, 50% 171%, -50% 71%, 50% -71%)" };
      }
    };
    const clipPaths = getPolygonClipPaths(start);
    return {
      name: `${variant}-${start}${blur ? "-blur" : ""}`,
      css: `
      ::view-transition-new(root) { animation-name: reveal-light-${start}${blur ? "-blur" : ""}; ${blur ? "filter: blur(2px);" : ""} }
      ::view-transition-old(root), .dark::view-transition-old(root) { animation: none; z-index: -1; }
      .dark::view-transition-new(root) { animation-name: reveal-dark-${start}${blur ? "-blur" : ""}; ${blur ? "filter: blur(2px);" : ""} }
      @keyframes reveal-dark-${start}${blur ? "-blur" : ""} { from { clip-path: ${clipPaths.darkFrom}; ${blur ? "filter: blur(8px);" : ""} } ${blur ? "50% { filter: blur(4px); }" : ""} to { clip-path: ${clipPaths.darkTo}; ${blur ? "filter: blur(0px);" : ""} } }
      @keyframes reveal-light-${start}${blur ? "-blur" : ""} { from { clip-path: ${clipPaths.lightFrom}; ${blur ? "filter: blur(8px);" : ""} } ${blur ? "50% { filter: blur(4px); }" : ""} to { clip-path: ${clipPaths.lightTo}; ${blur ? "filter: blur(0px);" : ""} } }
      `,
    };
  }

  if (variant === "circle" && start !== "center") {
    const getClipPathPosition = (position: AnimationStart) => {
      switch (position) {
        case "top-left": return "0% 0%";
        case "top-right": return "100% 0%";
        case "bottom-left": return "0% 100%";
        case "bottom-right": return "100% 100%";
        case "top-center": return "50% 0%";
        case "bottom-center": return "50% 100%";
        default: return "50% 50%";
      }
    };
    const clipPosition = getClipPathPosition(start);
    return {
      name: `${variant}-${start}${blur ? "-blur" : ""}`,
      css: `
      ::view-transition-new(root) { animation-name: reveal-light-${start}${blur ? "-blur" : ""}; ${blur ? "filter: blur(2px);" : ""} }
      ::view-transition-old(root), .dark::view-transition-old(root) { animation: none; z-index: -1; }
      .dark::view-transition-new(root) { animation-name: reveal-dark-${start}${blur ? "-blur" : ""}; ${blur ? "filter: blur(2px);" : ""} }
      @keyframes reveal-dark-${start}${blur ? "-blur" : ""} { from { clip-path: circle(0% at ${clipPosition}); ${blur ? "filter: blur(8px);" : ""} } ${blur ? "50% { filter: blur(4px); }" : ""} to { clip-path: circle(150.0% at ${clipPosition}); ${blur ? "filter: blur(0px);" : ""} } }
      @keyframes reveal-light-${start}${blur ? "-blur" : ""} { from { clip-path: circle(0% at ${clipPosition}); ${blur ? "filter: blur(8px);" : ""} } ${blur ? "50% { filter: blur(4px); }" : ""} to { clip-path: circle(150.0% at ${clipPosition}); ${blur ? "filter: blur(0px);" : ""} } }
      `,
    };
  }

  return {
    name: `${variant}-${start}${blur ? "-blur" : ""}`,
    css: `
      ::view-transition-group(root) { animation-timing-function: var(--expo-in); }
      ::view-transition-new(root) { mask: url('${svg}') ${start.replace("-", " ")} / 0 no-repeat; mask-origin: content-box; animation: scale-${start}${blur ? "-blur" : ""} 1s; transform-origin: ${transformOrigin}; ${blur ? "filter: blur(2px);" : ""} }
      ::view-transition-old(root), .dark::view-transition-old(root) { animation: scale-${start}${blur ? "-blur" : ""} 1s; transform-origin: ${transformOrigin}; z-index: -1; }
      @keyframes scale-${start}${blur ? "-blur" : ""} { from { ${blur ? "filter: blur(8px);" : ""} } ${blur ? "50% { filter: blur(4px); }" : ""} to { mask-size: 2000vmax; ${blur ? "filter: blur(0px);" : ""} } }
    `,
  };
};
