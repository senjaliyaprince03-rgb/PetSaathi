"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

type ToastType = "default" | "success" | "error" | "warning";

interface Toast {
  id: string;
  title: string;
  description?: string;
  type?: ToastType;
}

interface ToastContextType {
  toast: (props: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(({ title, description, type = "default" }: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type }]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {typeof document !== "undefined" && createPortal(
        <div className="fixed bottom-0 right-0 z-[100] m-4 flex w-full max-w-sm flex-col gap-2 sm:m-6">
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const bg =
    toast.type === "error"
      ? "bg-coral/10 border-coral/20 text-coral"
      : toast.type === "success"
        ? "bg-leaf/10 border-leaf/20 text-leaf"
        : toast.type === "warning"
          ? "bg-saffron/20 border-saffron/30 text-saffron-dark"
          : "bg-paper border-indigo/10 text-ink";

  return (
    <div className={`pointer-events-auto relative flex w-full flex-col overflow-hidden rounded-2xl border p-4 shadow-lifted backdrop-blur-xl transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-bottom-full sm:data-[state=open]:slide-in-from-bottom-0 sm:data-[state=open]:slide-in-from-right-full ${bg}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">{toast.title}</p>
          {toast.description && <p className="text-xs opacity-90">{toast.description}</p>}
        </div>
        <button
          onClick={onDismiss}
          className="inline-flex shrink-0 rounded-md p-1 opacity-50 transition-opacity hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-indigo/40"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
