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
  const [isEnabled, setIsEnabled] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncAvailability = () => {
      setIsEnabled(finePointer.matches && !reducedMotion.matches);
    };

    syncAvailability();
    finePointer.addEventListener("change", syncAvailability);
    reducedMotion.addEventListener("change", syncAvailability);

    return () => {
      finePointer.removeEventListener("change", syncAvailability);
      reducedMotion.removeEventListener("change", syncAvailability);
    };
  }, []);

  useEffect(() => {
    if (!isEnabled) return;

    const updatePosition = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;

      // Viewport coordinates and a body portal keep the halo locked to the OS pointer during scroll.
      cursorRef.current?.style.setProperty(
        "transform",
        `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
      );
      setIsVisible(true);
    };

    const updateInteraction = (event: PointerEvent) => {
      const target = event.target;
      setIsInteractive(
        target instanceof Element && Boolean(target.closest(INTERACTIVE_SELECTOR))
      );
    };

    const hideCursor = () => setIsVisible(false);

    window.addEventListener("pointermove", updatePosition, { passive: true });
    document.addEventListener("pointerover", updateInteraction, { passive: true });
    document.documentElement.addEventListener("mouseleave", hideCursor);
    window.addEventListener("blur", hideCursor);

    return () => {
      window.removeEventListener("pointermove", updatePosition);
      document.removeEventListener("pointerover", updateInteraction);
      document.documentElement.removeEventListener("mouseleave", hideCursor);
      window.removeEventListener("blur", hideCursor);
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  return createPortal(
    <div
      ref={cursorRef}
      aria-hidden="true"
      data-testid="luxury-cursor-halo"
      className={`pointer-events-none fixed left-0 top-0 z-[9999] hidden transition-opacity duration-200 md:block ${
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
