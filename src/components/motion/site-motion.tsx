"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const motionSelector = "[data-motion]:not([data-motion-skip] *):not([data-motion-skip])";

function motionKind(element: HTMLElement) {
  if (element.dataset.motion && element.dataset.motion !== "true") return element.dataset.motion;
  if (element.matches(".section-title, h1")) return "split";
  if (element.matches(".eyebrow")) return "wipe";
  if (element.matches("article")) return "depth";
  if (element.matches("form, table, dl")) return "focus";
  return "rise";
}

export function SiteMotion() {
  const pathname = usePathname();

  useEffect(() => {
    // Completely disable automated DOM mutation on authenticated application and portal routes
    const isPortalRoute =
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/customer") ||
      pathname.startsWith("/saathi") ||
      pathname.startsWith("/pets") ||
      pathname.startsWith("/bookings") ||
      pathname.startsWith("/addresses") ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/book") ||
      pathname.startsWith("/login");

    if (isPortalRoute) return;

    const root = document.documentElement;
    let intersectionObserver: IntersectionObserver | undefined;
    let mutationObserver: MutationObserver | undefined;
    let idleId: number | undefined;
    let timeoutId: number | undefined;
    let cancelled = false;
    const requestIdle = window.requestIdleCallback?.bind(window);
    const cancelIdle = window.cancelIdleCallback?.bind(window);

    const start = () => {
      if (cancelled) return;

      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (media.matches || typeof IntersectionObserver === "undefined") {
        root.dataset.motion = "reduced";
        return;
      }

      root.dataset.motion = "ready";
      const prepared = new WeakSet<HTMLElement>();
      intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          element.dataset.motionVisible = "true";
          intersectionObserver?.unobserve(element);
        });
      }, { rootMargin: "50px 0px 50px 0px", threshold: 0.02 });

      const prepare = (scope: ParentNode) => {
        const elements = scope.querySelectorAll<HTMLElement>(motionSelector);
        if (elements.length === 0) return;

        elements.forEach((element) => {
          if (prepared.has(element) || element.closest("[data-motion-skip]")) return;
          prepared.add(element);
          element.dataset.motionAuto = motionKind(element);

          const siblings = element.parentElement ? Array.from(element.parentElement.children) : [];
          const siblingIndex = Math.max(0, siblings.indexOf(element));
          element.style.setProperty("--motion-delay", `${Math.min(siblingIndex % 6, 5) * 45}ms`);

          intersectionObserver?.observe(element);
        });
      };

      prepare(document);

      let rafMutationId: number | null = null;
      mutationObserver = new MutationObserver(() => {
        if (rafMutationId !== null) return;
        rafMutationId = window.requestAnimationFrame(() => {
          rafMutationId = null;
          prepare(document);
        });
      });
      mutationObserver.observe(document.body, { childList: true, subtree: true });
    };

    const scheduleStart = () => {
      const delayedStart = () => {
        if (requestIdle) {
          idleId = requestIdle(start, { timeout: 1_200 });
        } else {
          start();
        }
      };
      timeoutId = window.setTimeout(delayedStart, 600);
    };

    if (document.readyState === "complete") scheduleStart();
    else window.addEventListener("load", scheduleStart, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", scheduleStart);
      if (idleId !== undefined) cancelIdle?.(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      intersectionObserver?.disconnect();
      mutationObserver?.disconnect();
      delete root.dataset.motion;
    };
  }, [pathname]);

  return null;
}
