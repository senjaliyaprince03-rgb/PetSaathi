"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
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

  const Icon =
    toast.type === "error"
      ? AlertCircle
      : toast.type === "success"
        ? CheckCircle2
        : toast.type === "warning"
          ? AlertTriangle
          : Info;

  const styleConfig =
    toast.type === "error"
      ? "bg-[#FFF5F3] border-[#FCA5A5] text-[#991B1B] shadow-[0_8px_30px_rgba(239,68,68,0.15)]"
      : toast.type === "success"
        ? "bg-[#F0FDF4] border-[#86EFAC] text-[#166534] shadow-[0_8px_30px_rgba(34,197,94,0.15)]"
        : toast.type === "warning"
          ? "bg-[#FFFBEB] border-[#FDE68A] text-[#92400E] shadow-[0_8px_30px_rgba(245,158,11,0.15)]"
          : "bg-white border-ink/10 text-ink shadow-[0_8px_30px_rgba(48,31,48,0.12)]";

  const iconColor =
    toast.type === "error"
      ? "text-red-600 bg-red-100"
      : toast.type === "success"
        ? "text-emerald-600 bg-emerald-100"
        : toast.type === "warning"
          ? "text-amber-600 bg-amber-100"
          : "text-indigo bg-indigo/10";

  return (
    <div className={`pointer-events-auto relative flex w-full items-start gap-3.5 overflow-hidden rounded-2xl border p-4 backdrop-blur-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${styleConfig}`}>
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconColor}`}>
        <Icon className="h-5 w-5" />
      </span>
      <div className="flex flex-1 flex-col gap-0.5 pt-0.5">
        <p className="text-sm font-bold tracking-tight">{toast.title}</p>
        {toast.description && <p className="text-xs opacity-90 leading-relaxed font-medium">{toast.description}</p>}
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="inline-flex shrink-0 rounded-lg p-1.5 opacity-60 transition-opacity hover:opacity-100 focus:opacity-100 hover:bg-black/5"
      >
        <X className="h-4 w-4" />
      </button>
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
