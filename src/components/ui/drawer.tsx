"use client";

import { useEffect, ReactNode } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  side?: "left" | "right";
}

export function Drawer({ open, onOpenChange, children, side = "right" }: DrawerProps) {
  if (!open) return null;

  return (
    <>
      {typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
            onClick={() => onOpenChange(false)}
            aria-hidden="true"
          />
          <div
            className={`relative z-50 flex h-full w-full max-w-md flex-col overflow-y-auto bg-paper px-6 py-8 shadow-2xl transition-transform ${
              side === "right" ? "ml-auto" : "mr-auto"
            }`}
          >
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-6 top-6 rounded-full bg-cream p-2 text-ink/50 transition hover:bg-indigo/5 hover:text-ink focus:outline-none focus:ring-2 focus:ring-indigo/40"
              aria-label="Close drawer"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="mt-8 flex-1">{children}</div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

export function DrawerHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6">
      <h2 className="font-display text-2xl font-semibold text-ink">{title}</h2>
      {description && <p className="mt-2 text-sm leading-6 text-ink/60">{description}</p>}
    </div>
  );
}
