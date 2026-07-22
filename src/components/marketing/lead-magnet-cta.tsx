"use client";

import { useState } from "react";
import { Download } from "lucide-react";

/**
 * A lead magnet CTA component for embedding in blog articles and city pages.
 * Captures email/phone and sends a request to the lead-magnets API.
 */
export function LeadMagnetCta({
  magnetSlug,
  title,
  description,
}: {
  magnetSlug: string;
  title: string;
  description: string;
}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch("/api/public/lead-magnets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, magnetSlug, source: "BLOG_CTA" }),
      });
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-4xl border border-leaf/20 bg-leaf/5 p-7">
        <Download className="h-6 w-6 text-leaf" />
        <h3 className="mt-4 font-display text-2xl font-semibold text-leaf">Check your email!</h3>
        <p className="mt-2 text-sm leading-6 text-ink/60">
          We&apos;ve sent the download link. No spam — just useful pet care resources.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-4xl border border-indigo/15 bg-indigo/5 p-7">
      <Download className="h-6 w-6 text-indigo" />
      <h3 className="mt-4 font-display text-2xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-ink/60">{description}</p>
      <form onSubmit={handleSubmit} className="mt-5 flex gap-3">
        <input
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-2xl border border-ink/15 bg-paper px-4 py-3 text-sm outline-none focus:border-indigo/40 focus:ring-1 focus:ring-indigo/20"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-indigo px-5 py-3 text-sm font-bold text-paper transition hover:bg-indigo/90 disabled:opacity-50"
        >
          {loading ? "Sending…" : "Get it free"}
        </button>
      </form>
      <p className="mt-3 text-xs text-ink/40">No spam. Unsubscribe anytime.</p>
    </div>
  );
}
