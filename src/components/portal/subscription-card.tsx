"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";

interface SubscriptionCardProps {
  plan: {
    id: string;
    name: string;
    pricePaise: number;
    billingInterval: string;
    totalBillingCycles: number;
  };
  features: string[];
  isSubscribed?: boolean;
}

export function SubscriptionCard({ plan, features, isSubscribed }: SubscriptionCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubscribe() {
    setLoading(true);
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planVersionId: plan.id }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        if (data.error === "subscription_already_exists") {
          alert("You already have an active subscription for this plan.");
        } else {
          throw new Error(data.error);
        }
        return;
      }

      if (data.subscription?.checkoutUrl) {
        window.location.href = data.subscription.checkoutUrl;
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to initiate subscription checkout.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="flex flex-col justify-between rounded-[2rem] border border-ink/[0.07] bg-paper p-6 shadow-lifted transition hover:-translate-y-1 hover:border-indigo/20">
      <div>
        <h3 className="font-display text-2xl font-semibold">{plan.name}</h3>
        <p className="mt-4 font-display text-4xl font-bold">
          ₹{(plan.pricePaise / 100).toLocaleString("en-IN")}
          <span className="text-base font-medium text-ink/80">/{plan.billingInterval.toLowerCase()}</span>
        </p>
        <ul className="mt-8 space-y-3">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-ink/80">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-leaf" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-10">
        {isSubscribed ? (
          <div className="w-full rounded-2xl bg-leaf/10 py-3 text-center text-sm font-bold text-leaf">Active Subscription</div>
        ) : (
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className={buttonVariants({ variant: "primary", className: "w-full" })}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Subscribe Now
          </button>
        )}
      </div>
    </article>
  );
}
