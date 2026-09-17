"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";

const INTERACTIVE_SELECTOR = [
  "a",
  "button",
  "input",
  "select",
  "textarea",
  "label",
  "summary",
  "[role='button']",
  "[role='link']",
  "[data-cursor='interactive']",
  ".cursor-hover"
].join(",");

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const nextPositionRef = useRef({ x: -100, y: -100 });
  const visibilityRef = useRef(false);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncAvailability = () => {
      const desktopFallback =
        !coarsePointer.matches &&
        navigator.maxTouchPoints === 0 &&
        window.innerWidth >= 768;
      const enabled =
        (finePointer.matches || desktopFallback) && !reducedMotion.matches;
      setIsEnabled(enabled);

      if (!enabled) {
        visibilityRef.current = false;
        if (cursorRef.current) cursorRef.current.style.opacity = "0";
      }
    };

    syncAvailability();
    finePointer.addEventListener("change", syncAvailability);
    coarsePointer.addEventListener("change", syncAvailability);
    reducedMotion.addEventListener("change", syncAvailability);
    window.addEventListener("resize", syncAvailability, { passive: true });

    return () => {
      finePointer.removeEventListener("change", syncAvailability);
      coarsePointer.removeEventListener("change", syncAvailability);
      reducedMotion.removeEventListener("change", syncAvailability);
      window.removeEventListener("resize", syncAvailability);
    };
  }, []);

  useEffect(() => {
    if (!isEnabled) return;
    const cursorElement = cursorRef.current;
    const ringElement = ringRef.current;
    const dotElement = dotRef.current;

    const commitPosition = () => {
      animationFrameRef.current = null;
      const { x, y } = nextPositionRef.current;
      cursorElement?.style.setProperty(
        "transform",
        `translate3d(${x}px, ${y}px, 0)`
      );
    };

    const updatePosition = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;

      nextPositionRef.current = { x: event.clientX, y: event.clientY };
      if (animationFrameRef.current === null) {
        animationFrameRef.current = window.requestAnimationFrame(commitPosition);
      }

      if (!visibilityRef.current) {
        visibilityRef.current = true;
        if (cursorElement) cursorElement.style.opacity = "1";
      }
    };

    const updateInteraction = (event: PointerEvent) => {
      const target = event.target;
      const isInteractive =
        target instanceof Element && Boolean(target.closest(INTERACTIVE_SELECTOR));
      
      if (ringElement && dotElement) {
        if (isInteractive) {
          ringElement.style.width = "3rem";
          ringElement.style.height = "3rem";
          ringElement.style.borderColor = "rgba(244, 185, 96, 0.9)";
          ringElement.style.backgroundColor = "rgba(244, 185, 96, 0.15)";
          dotElement.style.width = "0.375rem";
          dotElement.style.height = "0.375rem";
          dotElement.style.backgroundColor = "rgb(225, 102, 73)";
        } else {
          ringElement.style.width = "1.75rem";
          ringElement.style.height = "1.75rem";
          ringElement.style.borderColor = "rgba(91, 61, 122, 0.35)";
          ringElement.style.backgroundColor = "rgba(255, 253, 250, 0.12)";
          dotElement.style.width = "0.25rem";
          dotElement.style.height = "0.25rem";
          dotElement.style.backgroundColor = "rgb(91, 61, 122)";
        }
      }
    };

    const hideCursor = () => {
      visibilityRef.current = false;
      if (cursorElement) cursorElement.style.opacity = "0";
    };

    window.addEventListener("pointermove", updatePosition, { passive: true });
    document.addEventListener("pointerover", updateInteraction, { passive: true });
    document.documentElement.addEventListener("mouseleave", hideCursor);
    window.addEventListener("blur", hideCursor);
    cursorElement?.setAttribute("data-ready", "true");

    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      window.removeEventListener("pointermove", updatePosition);
      document.removeEventListener("pointerover", updateInteraction);
      document.documentElement.removeEventListener("mouseleave", hideCursor);
      window.removeEventListener("blur", hideCursor);
      cursorElement?.removeAttribute("data-ready");
      hideCursor();
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  return createPortal(
    <div
      ref={cursorRef}
      aria-hidden="true"
      data-testid="luxury-cursor-halo"
      data-ready="true"
      style={{ opacity: 0 }}
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-px w-px will-change-transform transition-opacity duration-200 md:block"
    >
      <div
        ref={ringRef}
        className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-indigo/35 bg-paper/[0.12] shadow-[0_2px_16px_rgba(48,31,48,0.08)] transition-[width,height,border-color,background-color] duration-200 ease-out h-7 w-7"
      >
        <span
          ref={dotRef}
          className="absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo transition-[width,height,background-color] duration-200 h-1 w-1"
        />
      </div>
    </div>,
    document.body
  );
}
