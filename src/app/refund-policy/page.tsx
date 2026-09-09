import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, RefreshCw, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { PageIntro, PublicShell } from "@/components/marketing/public-shell";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description: "PetSaathi transparent refund and cancellation policy. Full refunds for cancellations >24 hours, 50% refund 4-24 hours, and 100% money-back guarantee if a sitter cancels.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RefundPolicyPage() {
  return (
    <PublicShell>
      <PageIntro
        eyebrow="Trust & Transparency"
        title="Refund & Cancellation Policy"
        description="Clear, fair, and automated refund rules designed to protect both pet parents and verified caregivers across India."
      />

      <section className="container-shell pb-20">
        <div className="mx-auto max-w-4xl space-y-10 rounded-5xl border border-ink/10 bg-paper p-8 text-ink/80 shadow-lifted sm:p-12">
          
          {/* Summary Box */}
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-emerald-700" />
              <h2 className="font-display text-xl font-bold text-emerald-900">Parent Protection Guarantee</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-emerald-800">
              At PetSaathi, booking payments are held securely through Razorpay until your pet care session is completed and milestone check-ins are verified. If you ever cancel within permitted cancellation windows or if a sitter is unable to fulfill a service, your refund is credited automatically to your source payment method or PetSaathi wallet.
            </p>
          </div>

          {/* Cancellation Tiers */}
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">1. Standard Parent Cancellation Tiers</h2>
            <p className="mt-3 leading-relaxed">
              When canceling a scheduled booking, your refund amount is calculated strictly based on the time remaining before the scheduled start time:
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-ink/10 bg-surface-raised p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">100% Refund</span>
                  <Clock className="h-4 w-4 text-emerald-700" />
                </div>
                <h3 className="mt-3 font-display text-lg font-bold text-ink">&gt; 24 Hours Notice</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink/70">
                  Cancel anytime at least 24 hours prior to service start for a full 100% refund with zero cancellation fee.
                </p>
              </div>

              <div className="rounded-2xl border border-ink/10 bg-surface-raised p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">50% Refund</span>
                  <Clock className="h-4 w-4 text-amber-700" />
                </div>
                <h3 className="mt-3 font-display text-lg font-bold text-ink">4 – 24 Hours Notice</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink/70">
                  50% refund returned to your source account. 50% is disbursed to the caregiver to compensate for reserved schedule time.
                </p>
              </div>

              <div className="rounded-2xl border border-ink/10 bg-surface-raised p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-100 px-2.5 py-1 rounded-full">No Refund</span>
                  <AlertCircle className="h-4 w-4 text-rose-700" />
                </div>
                <h3 className="mt-3 font-display text-lg font-bold text-ink">&lt; 4 Hours Notice</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink/70">
                  Cancellations within 4 hours are non-refundable as the caregiver has already mobilized and committed their schedule.
                </p>
              </div>
            </div>
          </div>

          {/* Sitter Cancellation Guarantee */}
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">2. Caregiver Cancellation Guarantee</h2>
            <div className="mt-4 rounded-2xl border border-ink/10 bg-surface-raised p-6 space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-700 mt-0.5 shrink-0" />
                <p className="text-sm leading-relaxed">
                  <strong>100% Instant Refund:</strong> If a verified caregiver cancels your booking at any time, you receive a guaranteed 100% immediate refund to your original payment method.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-700 mt-0.5 shrink-0" />
                <p className="text-sm leading-relaxed">
                  <strong>Priority Replacement Sitter:</strong> Our emergency operations team immediately dispatches another verified top-rated Saathi in your society/neighborhood with zero additional cost.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-700 mt-0.5 shrink-0" />
                <p className="text-sm leading-relaxed">
                  <strong>₹250 Apology Credit:</strong> We credit ₹250 directly to your PetSaathi wallet for any disruption caused by sitter cancellation.
                </p>
              </div>
            </div>
          </div>

          {/* Processing Timelines */}
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">3. Refund Processing Timelines</h2>
            <p className="mt-3 leading-relaxed">
              Refunds are initiated immediately by PetSaathi upon cancellation confirmation. In compliance with RBI and Indian banking settlement rails (via Razorpay):
            </p>
            <ul className="mt-4 space-y-2.5 text-sm list-disc pl-6 leading-relaxed">
              <li><strong>UPI (GPay, PhonePe, Paytm, BHIM):</strong> 2 to 24 hours to reflect back in your bank account.</li>
              <li><strong>Net Banking (SBI, HDFC, ICICI, Axis, etc.):</strong> 2 to 4 working days depending on your bank.</li>
              <li><strong>Debit / Credit Cards (Visa, Mastercard, RuPay):</strong> 5 to 7 working days as per card network settlement standards.</li>
              <li><strong>PetSaathi Wallet / In-App Credit:</strong> Instant credit (0 seconds) available for your next booking immediately.</li>
            </ul>
          </div>

          {/* ₹50,000 Emergency Vet Assistance Protocol (Beta) */}
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">4. ₹50,000 Emergency Vet Medical Assistance Protocol (Beta)</h2>
            <p className="mt-3 leading-relaxed">
              Pet safety is our primary pledge. Confirmed, active bookings on PetSaathi are protected by our ₹50,000 Emergency Veterinary Medical Assistance Protocol (Beta). If any unexpected medical emergency occurs directly during an active, tracked care window:
            </p>
            <p className="mt-2 text-sm leading-relaxed">
              Submit your veterinarian invoice, formal clinical prescription, and session summary within 72 hours via the app or email. Our Trust &amp; Safety board reviews and reimburses qualifying clinical emergency treatments up to ₹50,000 in accordance with our safety guidelines and pet passport disclosures. This protocol represents platform-sponsored assistance and is not an insurance policy.
            </p>
          </div>

          {/* Contact Support */}
          <div className="border-t border-ink/10 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-base font-bold text-ink">Need assistance with a refund?</h3>
              <p className="text-xs text-ink/70 mt-1">Our dedicated PetSaathi Trust &amp; Safety desk is available 24/7 across India.</p>
            </div>
            <div className="flex gap-3">
              <a href="mailto:support@petsaathi.com" className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-xs font-bold text-paper transition hover:bg-ink/90">
                Email Support
              </a>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl border border-ink/20 px-4 py-2.5 text-xs font-bold text-ink transition hover:bg-surface-raised">
                Contact Us
              </Link>
            </div>
          </div>

        </div>
      </section>
    </PublicShell>
  );
}