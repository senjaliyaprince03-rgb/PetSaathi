"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function PortalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="flex min-h-screen items-center justify-center bg-cream p-6"><div className="glass-panel max-w-lg rounded-5xl p-9 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-coral/12 text-coral"><AlertTriangle className="h-6 w-6" /></span><h1 className="mt-6 font-display text-4xl font-semibold">This workspace needs a fresh connection.</h1><p className="mt-4 leading-7 text-ink/60">No action was completed. Reconnect and try loading the protected data again.</p><Button type="button" variant="accent" className="mt-7" onClick={reset}><RotateCcw className="h-4 w-4" />Try again</Button></div></main>;
}
