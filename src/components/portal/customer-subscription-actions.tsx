"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

type RazorpayInstance = { open: () => void };
type RazorpayConstructor = new (options: Record<string, unknown>) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

export function CustomerSubscriptionActions({ planVersionId }: { planVersionId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubscribe() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planVersionId })
      });
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to initiate subscription");
      }

      await loadRazorpay();

      if (!window.Razorpay) {
        throw new Error("Razorpay SDK failed to load");
      }
      
      if (result.subscription?.checkoutUrl) {
         window.location.href = result.subscription.checkoutUrl;
         return;
      }
      
      throw new Error("Missing checkout URL");

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-7">
      <button
        onClick={handleSubscribe}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-indigo px-5 py-3 text-sm font-bold text-paper transition hover:bg-ink disabled:opacity-50"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? "Preparing..." : "Subscribe Now"}
      </button>
      {error && <p className="mt-3 text-sm font-semibold text-coral">{error}</p>}
    </div>
  );
}

function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.body.appendChild(script);
  });
}
