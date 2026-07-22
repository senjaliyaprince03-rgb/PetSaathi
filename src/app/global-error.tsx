"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { Sentry.captureException(error); }, [error]);
  return <html lang="en"><body><main className="flex min-h-screen items-center justify-center bg-cream p-6"><div className="max-w-lg rounded-5xl border border-coral/20 bg-paper p-10 text-center shadow-soft"><p className="eyebrow">Something interrupted this page</p><h1 className="mt-4 font-display text-4xl font-semibold">Your data has not been guessed or replaced.</h1><p className="mt-4 leading-7 text-ink/60">Retry the protected operation. If it continues, support can use the private error reference without exposing your form contents.</p><button type="button" onClick={reset} className="mt-7 rounded-full bg-ink px-6 py-3 text-sm font-bold text-paper">Try again</button></div></main></body></html>;
}
