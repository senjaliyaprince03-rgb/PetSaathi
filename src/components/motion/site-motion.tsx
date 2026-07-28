"use client";

import { useEffect } from "react";

const motionSelector = [
  "main [data-motion]",
  "main section",
  "main article",
  "main form",
  "main table",
  "main dl",
  "main .section-title",
  "main .eyebrow"
].join(",");

function motionKind(element: HTMLElement) {
  if (element.dataset.motion) return element.dataset.motion;
  if (element.matches(".section-title, h1")) return "split";
  if (element.matches(".eyebrow")) return "wipe";
  if (element.matches("article")) return "depth";
  if (element.matches("form, table, dl")) return "focus";
  return "rise";
}

export function SiteMotion() {
  useEffect(() => {
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
      }, { rootMargin: "0px 0px -8%", threshold: 0.08 });

      const prepare = (scope: ParentNode) => {
        scope.querySelectorAll<HTMLElement>(motionSelector).forEach((element) => {
          if (prepared.has(element) || element.closest("[data-motion-skip]")) return;
          prepared.add(element);
          element.dataset.motionAuto = motionKind(element);

          const siblings = element.parentElement ? Array.from(element.parentElement.children) : [];
          const siblingIndex = Math.max(0, siblings.indexOf(element));
          element.style.setProperty("--motion-delay", `${Math.min(siblingIndex % 6, 5) * 55}ms`);

          const rect = element.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
            element.dataset.motionVisible = "true";
          } else {
            intersectionObserver?.observe(element);
          }
        });
      };

      prepare(document);
      mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (!(node instanceof HTMLElement)) return;
            if (node.matches(motionSelector)) prepare(node.parentElement ?? document);
            else prepare(node);
          });
        });
      });
      mutationObserver.observe(document.body, { childList: true, subtree: true });
    };

    const scheduleStart = () => {
      // Let React finish hydrating every streamed boundary before mutating SSR markup.
      if (requestIdle) {
        idleId = requestIdle(start, { timeout: 1_200 });
      } else {
        timeoutId = window.setTimeout(start, 0);
      }
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
  }, []);

  return null;
}
