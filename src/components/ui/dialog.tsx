"use client";

import { useEffect, useRef, ReactNode } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null;

  return (
    <>
      {typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
            onClick={() => onOpenChange(false)}
            aria-hidden="true"
          />
          <div className="relative z-50 w-full max-w-lg scale-100 transform overflow-hidden rounded-4xl border border-indigo/10 bg-paper p-6 text-left shadow-lifted transition-all sm:p-8">
            {children}
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-6 top-6 rounded-full bg-cream p-2 text-ink/50 transition hover:bg-indigo/5 hover:text-ink focus:outline-none focus:ring-2 focus:ring-indigo/40"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

export function DialogHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6">
      <h2 className="font-display text-2xl font-semibold text-ink">{title}</h2>
      {description && <p className="mt-2 text-sm leading-6 text-ink/60">{description}</p>}
    </div>
  );
}

export function DialogFooter({ children }: { children: ReactNode }) {
  return (
    <div className="mt-8 flex flex-col-reverse justify-end gap-3 sm:flex-row">
      {children}
    </div>
  );
}
