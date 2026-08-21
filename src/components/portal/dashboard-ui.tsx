import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export function DashboardPanel({
  children,
  className,
  tone = "paper",
  motion = "rise",
}: {
  children: ReactNode;
  className?: string;
  tone?: "paper" | "cream" | "dark" | "lavender";
  motion?: "rise" | "depth" | "focus" | "wipe";
}) {
  const tones = {
    paper: "border-ink/[0.07] bg-paper",
    cream: "border-ink/[0.07] bg-cream/55",
    dark: "border-paper/10 bg-[#281d2b] text-paper",
    lavender: "border-indigo/10 bg-gradient-to-br from-[#f3eafa] via-paper to-[#fff4ec]",
  };

  return (
    <section
      className={cn(
        "rounded-[2rem] border p-5 shadow-[0_20px_60px_-44px_rgb(var(--ink)/0.42)] sm:p-6",
        tones[tone],
        className,
      )}
      data-motion={motion}
    >
      {children}
    </section>
  );
}

export function DashboardHeading({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col justify-between gap-6 sm:flex-row sm:items-end", className)}>
      <div className="max-w-3xl">
        <div className="flex items-center gap-3">
          <span className="h-px w-6 bg-coral/40" />
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-coral">{eyebrow}</p>
        </div>
        <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.04em] text-ink sm:text-5xl">{title}</h2>
        {description ? <p className="mt-3 max-w-2xl text-base leading-7 text-ink/80">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = "indigo",
  className,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  tone?: "indigo" | "coral" | "leaf" | "saffron";
  className?: string;
}) {
  const tones = {
    indigo: "bg-indigo/10 text-indigo",
    coral: "bg-coral/10 text-coral",
    leaf: "bg-leaf/10 text-leaf",
    saffron: "bg-saffron/30 text-ink",
  };

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-[2rem] border border-ink/[0.07] bg-paper p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo/20 hover:shadow-2xl",
        className,
      )}
      data-motion="rise"
    >
      <div className={cn("absolute -right-6 -top-6 h-32 w-32 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-150", tones[tone].split(" ")[0])} />
      <div className="relative">
        <span className={cn("flex h-12 w-12 items-center justify-center rounded-[1.2rem] shadow-sm", tones[tone])}>
          <Icon className="h-5 w-5" />
        </span>
        <p className="mt-6 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-ink/80">{label}</p>
        <p className="mt-1.5 font-display text-3xl font-semibold tracking-[-0.035em] text-ink">{value}</p>
        {hint ? <p className="mt-2 text-xs leading-5 text-ink/80">{hint}</p> : null}
      </div>
    </article>
  );
}

export function StatusPill({ status, className }: { status: string; className?: string }) {
  const normalized = status.toUpperCase();
  const success = ["ACTIVE", "COMPLETED", "FULFILLED", "CLOSED", "READ", "SENT", "QUALIFIED", "REWARDED"].includes(normalized);
  const warning = ["REQUESTED", "QUEUED", "PENDING", "IN_PROGRESS", "UNDER_REVIEW", "SENDING"].some((value) => normalized.includes(value));
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.12em]",
        success ? "bg-leaf/10 text-leaf" : warning ? "bg-saffron/20 text-[#7a5814]" : "bg-indigo/10 text-indigo",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-75" />
      {status.replaceAll("_", " ")}
    </span>
  );
}

export function DashboardEmptyState({
  icon: Icon,
  title,
  description,
  action,
  compact = false,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  compact?: boolean;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-[2rem] border border-dashed border-indigo/20 bg-gradient-to-b from-cream/20 to-cream/5 text-center transition-all duration-500 hover:border-indigo/40 hover:bg-cream/40", compact ? "p-6" : "p-10 sm:p-12")}>
      <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo/15 blur-3xl transition-transform duration-700 hover:scale-150" />
      <div className="absolute bottom-0 left-1/2 h-32 w-32 -translate-x-1/2 translate-y-1/2 rounded-full bg-coral/10 blur-3xl" />
      
      <span className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-paper text-indigo shadow-[0_8px_30px_rgb(var(--indigo)/0.12)] ring-1 ring-indigo/5">
        <Icon className="h-7 w-7 animate-[float_4s_ease-in-out_infinite]" />
      </span>
      
      <div className="relative mt-7">
        <h3 className={cn("font-display font-semibold tracking-[-0.035em] text-ink", compact ? "text-2xl" : "text-3xl")}>{title}</h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink/80">{description}</p>
        {action ? <div className="mt-7 flex justify-center">{action}</div> : null}
      </div>
    </div>
  );
}

export function ProgressRing({ value, label, detail }: { value: number; label: string; detail: string }) {
  const safeValue = Math.min(100, Math.max(0, value));
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (safeValue / 100) * circumference;
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-24 w-24 shrink-0">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-paper/80" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="text-saffron transition-all duration-700" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-display text-xl font-semibold">{Math.round(safeValue)}%</span>
      </div>
      <div>
        <p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-paper/80">{label}</p>
        <p className="mt-2 text-sm leading-6 text-paper/80">{detail}</p>
      </div>
    </div>
  );
}
