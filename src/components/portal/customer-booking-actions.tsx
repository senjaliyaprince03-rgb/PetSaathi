"use client";

import { Check, CreditCard, LoaderCircle, Star, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

type RazorpayResult = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
type RazorpayInstance = { open: () => void };
type RazorpayConstructor = new (options: Record<string, unknown>) => RazorpayInstance;

declare global { interface Window { Razorpay?: RazorpayConstructor } }

export function CustomerApprovalAction({ bookingId, assignmentId }: { bookingId: string; assignmentId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function approve() {
    setPending(true); setError(null);
    const response = await fetch(`/api/bookings/${bookingId}/approve-assignment`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ assignmentId }) });
    setPending(false);
    if (!response.ok) return setError("This proposal is no longer available for approval.");
    router.refresh();
  }
  return <div className="rounded-3xl bg-saffron/14 p-5"><p className="text-sm leading-6 text-ink/65">Approve this Saathi only after reviewing the service-specific trust details. Payment opens next.</p><Button type="button" variant="accent" className="mt-4" onClick={approve} disabled={pending}>{pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}Approve Saathi</Button>{error && <p className="mt-3 text-sm font-semibold text-coral" role="alert">{error}</p>}</div>;
}

export function PaymentAction({ bookingId, reference, amountPaise }: { bookingId: string; reference: string; amountPaise: number }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pay() {
    setPending(true); setError(null);
    try {
      await loadRazorpay();
      const response = await fetch(`/api/bookings/${bookingId}/payment-order`, { method: "POST" });
      const result = await response.json().catch(() => null) as { order?: { id: string; amount: number; currency: string; keyId?: string }; message?: string } | null;
      if (!response.ok || !result?.order?.keyId || !window.Razorpay) throw new Error(result?.message ?? "Payments are not configured yet.");
      if (result.order.amount !== amountPaise) throw new Error("The payment amount changed. Refresh before continuing.");

      const checkout = new window.Razorpay({
        key: result.order.keyId,
        order_id: result.order.id,
        amount: result.order.amount,
        currency: result.order.currency,
        name: "PetSaathi",
        description: `Care booking ${reference}`,
        theme: { color: "#f5ad2e" },
        modal: { ondismiss: () => setPending(false) },
        handler: async (payment: RazorpayResult) => {
          const verification = await fetch("/api/payments/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId: payment.razorpay_order_id, paymentId: payment.razorpay_payment_id, signature: payment.razorpay_signature }) });
          setPending(false);
          if (!verification.ok) return setError("Payment response could not be verified. No booking status was changed.");
          router.refresh();
        }
      });
      checkout.open();
    } catch (caught) {
      setPending(false);
      setError(caught instanceof Error ? caught.message : "Payment could not be opened.");
    }
  }

  return <div className="rounded-3xl bg-indigo p-5 text-paper"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-paper/45">Verified full prepayment</p><p className="mt-2 text-sm text-paper/65">The amount comes from the server quote.</p></div><p className="font-display text-3xl font-semibold">₹{(amountPaise / 100).toLocaleString("en-IN")}</p></div><Button type="button" variant="accent" className="mt-5" onClick={pay} disabled={pending}>{pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}Pay securely</Button>{error && <p className="mt-3 text-sm font-semibold text-saffron" role="alert">{error}</p>}</div>;
}

export function ReviewAction({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [publish, setPublish] = useState(false);
  const [consent, setConsent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function submit() {
    setPending(true); setError(null);
    const response = await fetch(`/api/bookings/${bookingId}/review`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rating, body, publishPublicly: publish, publicationConsent: consent }) });
    setPending(false);
    if (!response.ok) return setError("Review could not be saved. Publication requires separate consent.");
    router.refresh();
  }
  return <div className="rounded-3xl border border-ink/10 bg-paper p-5"><p className="font-display text-2xl font-semibold">How did care feel?</p><div className="mt-4 flex gap-2" aria-label="Rating">{[1,2,3,4,5].map((value) => <button key={value} type="button" aria-label={`${value} star${value === 1 ? "" : "s"}`} onClick={() => setRating(value)} className={value <= rating ? "text-saffron" : "text-ink/15"}><Star className="h-7 w-7 fill-current" /></button>)}</div><textarea value={body} onChange={(event) => setBody(event.target.value)} className="mt-4 min-h-24 w-full rounded-2xl border border-ink/15 bg-cream/40 p-4 outline-none" placeholder="Private feedback unless you opt in below" /><label className="mt-4 flex items-start gap-3 text-sm"><input type="checkbox" checked={publish} onChange={(event) => { setPublish(event.target.checked); if (!event.target.checked) setConsent(false); }} className="mt-1 accent-indigo" />Allow PetSaathi to consider this review for public display</label>{publish && <label className="mt-3 flex items-start gap-3 text-sm"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1 accent-indigo" />I separately consent to publication after moderation</label>}<Button type="button" variant="accent" className="mt-5" onClick={submit} disabled={pending}>{pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Star className="h-4 w-4" />}Save review</Button>{error && <p className="mt-3 text-sm font-semibold text-coral" role="alert">{error}</p>}</div>;
}

export function CustomerCancelAction({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function cancel() {
    setPending(true); setError(null);
    const response = await fetch(`/api/bookings/${bookingId}/cancel`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reason }) });
    const result = await response.json().catch(() => null) as { message?: string } | null;
    setPending(false);
    if (!response.ok) return setError(result?.message ?? "Cancellation could not be completed.");
    router.refresh();
  }
  return <div className="rounded-3xl border border-coral/20 bg-coral/5 p-5"><p className="font-display text-2xl font-semibold">Need to cancel?</p><p className="mt-2 text-sm leading-6 text-ink/60">Before payment, cancellation releases the held service-area capacity atomically. Paid bookings require a support review.</p><textarea value={reason} onChange={(event) => setReason(event.target.value)} minLength={5} maxLength={500} className="mt-4 min-h-20 w-full rounded-2xl border border-ink/15 bg-paper p-4 text-sm outline-none focus:border-coral" placeholder="Tell operations why the plan changed" /><Button type="button" variant="outline" className="mt-3" onClick={cancel} disabled={pending || reason.trim().length < 5}>{pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}Cancel request</Button>{error && <p className="mt-3 text-sm font-semibold text-coral" role="alert">{error}</p>}</div>;
}

function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) { existing.addEventListener("load", () => resolve(), { once: true }); existing.addEventListener("error", () => reject(new Error("Payment interface failed to load.")), { once: true }); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Payment interface failed to load."));
    document.head.appendChild(script);
  });
}
