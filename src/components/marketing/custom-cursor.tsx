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
  const animationFrameRef = useRef<number | null>(null);
  const nextPositionRef = useRef({ x: -100, y: -100 });
  const visibilityRef = useRef(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

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
        setIsVisible(false);
        setIsInteractive(false);
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

    const commitPosition = () => {
      animationFrameRef.current = null;
      const { x, y } = nextPositionRef.current;
      cursorRef.current?.style.setProperty(
        "transform",
        `translate3d(${x}px, ${y}px, 0)`
      );
    };

    const updatePosition = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;

      // Viewport coordinates and a body portal keep the halo locked to the OS pointer during scroll.
      nextPositionRef.current = { x: event.clientX, y: event.clientY };
      if (animationFrameRef.current === null) {
        animationFrameRef.current = window.requestAnimationFrame(commitPosition);
      }

      if (!visibilityRef.current) {
        visibilityRef.current = true;
        setIsVisible(true);
      }
    };

    const updateInteraction = (event: PointerEvent) => {
      const target = event.target;
      setIsInteractive(
        target instanceof Element && Boolean(target.closest(INTERACTIVE_SELECTOR))
      );
    };

    const hideCursor = () => {
      visibilityRef.current = false;
      setIsVisible(false);
      setIsInteractive(false);
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
      className={`pointer-events-none fixed left-0 top-0 z-[9999] hidden h-px w-px will-change-transform transition-opacity duration-200 md:block ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full border shadow-[0_4px_24px_rgba(48,31,48,0.12)] backdrop-blur-[1.5px] transition-[width,height,border-color,background-color,box-shadow] duration-300 ease-out ${
          isInteractive
            ? "h-12 w-12 border-saffron/90 bg-saffron/[0.12] shadow-[0_4px_30px_rgba(244,185,96,0.28)]"
            : "h-7 w-7 border-indigo/35 bg-paper/[0.08]"
        }`}
      >
        <span
          className={`absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo shadow-[0_0_10px_rgba(91,61,122,0.38)] transition-[width,height,background-color] duration-300 ${
            isInteractive ? "h-1.5 w-1.5 bg-coral" : "h-1 w-1"
          }`}
        />
      </div>
    </div>,
    document.body
  );
}
