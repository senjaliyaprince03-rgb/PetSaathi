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
    <div className={cn("flex flex-col justify-between gap-4 sm:flex-row sm:items-end", className)}>
      <div className="max-w-3xl">
        <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-coral">{eyebrow}</p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{title}</h2>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/50">{description}</p> : null}
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
        "group rounded-[1.6rem] border border-ink/[0.07] bg-paper p-5 transition duration-300 hover:-translate-y-1 hover:border-indigo/20 hover:shadow-lifted",
        className,
      )}
      data-motion="rise"
    >
      <span className={cn("flex h-10 w-10 items-center justify-center rounded-2xl", tones[tone])}>
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <p className="mt-5 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-ink/35">{label}</p>
      <p className="mt-1.5 font-display text-2xl font-semibold tracking-[-0.035em]">{value}</p>
      {hint ? <p className="mt-1.5 text-xs leading-5 text-ink/42">{hint}</p> : null}
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
    <div className={cn("relative overflow-hidden rounded-[1.75rem] border border-dashed border-indigo/15 bg-cream/35 text-center", compact ? "p-6" : "p-9 sm:p-10")}>
      <div className="absolute left-1/2 top-0 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo/10 blur-3xl" />
      <span className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-paper text-indigo shadow-lifted">
        <Icon className="h-6 w-6 animate-[float_4s_ease-in-out_infinite]" />
      </span>
      <h3 className={cn("relative mt-5 font-display font-semibold tracking-[-0.035em]", compact ? "text-2xl" : "text-3xl")}>{title}</h3>
      <p className="relative mx-auto mt-2 max-w-md text-sm leading-6 text-ink/48">{description}</p>
      {action ? <div className="relative mt-5">{action}</div> : null}
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
          <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-paper/10" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="text-saffron transition-all duration-700" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-display text-xl font-semibold">{Math.round(safeValue)}%</span>
      </div>
      <div>
        <p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-paper/40">{label}</p>
        <p className="mt-2 text-sm leading-6 text-paper/65">{detail}</p>
      </div>
    </div>
  );
}
