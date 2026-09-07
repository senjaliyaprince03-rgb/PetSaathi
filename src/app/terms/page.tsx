import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, FileText, Lock, HelpCircle } from "lucide-react";
import { PageIntro, PublicShell } from "@/components/marketing/public-shell";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read PetSaathi's Terms of Service outlining booking policies, caregiver verification, ₹50,000 Vet Guarantee, GPS tracking protocols, and cancellation terms.",
  robots: {
    index: true,
    follow: true
  }
};

export default function TermsPage() {
  return (
    <PublicShell>
      <PageIntro
        eyebrow="Platform Guidelines"
        title="Terms of Service"
        description="Clear, transparent terms governing the PetSaathi care network, parent safeguards, and service commitments."
      />
      <section className="container-shell pb-20">
        <div className="mx-auto max-w-4xl space-y-10 rounded-5xl border border-ink/10 bg-paper p-8 text-ink/80 shadow-lifted sm:p-12">
          
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">1. Service Agreement & Platform Scope</h2>
            <p className="mt-4 leading-7">
              PetSaathi operates a managed, verified pet care platform connecting pet parents with certified, background-checked caregivers (&quot;Saathis&quot;) for dog walking, pet sitting, grooming, and veterinary care services in designated residential societies and localities across India.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">2. Caregiver Verification & Trust Standards</h2>
            <p className="mt-4 leading-7">
              All Saathis undergo mandatory multi-step identity verification, criminal background checks, behavioral handling interviews, and emergency care training prior to receiving active service dispatch permissions. Parents agree to provide accurate medical, dietary, and behavioral notes for their pets in their digital passports.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">3. ₹50,000 Vet Medical Guarantee</h2>
            <p className="mt-4 leading-7">
              Every confirmed booking executed through the PetSaathi platform is protected by our ₹50,000 Emergency Veterinary Medical Guarantee. In the unlikely event of an accidental illness or injury occurring directly during an active service window, PetSaathi reimburses documented emergency medical expenses subject to our safety review protocols.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">4. Live GPS Tracking & Society Handoffs</h2>
            <p className="mt-4 leading-7">
              During outdoor walks and doorstep care sessions, real-time geofenced GPS tracking, milestone photo check-ins, and pee/poop records are generated and securely transmitted to the parent portal. Caregivers adhere strictly to residential gated community entry protocols and double-leash safety standards.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">5. Payments, Cancellations & Refunds</h2>
            <p className="mt-4 leading-7">
              All transactions are securely escrowed and processed through Razorpay. Cancellations strictly follow our verified tier structure:
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-1.5 text-sm leading-relaxed">
              <li><strong>More than 24 hours notice:</strong> 100% full refund to original payment source or wallet.</li>
              <li><strong>Between 4 and 24 hours notice:</strong> 50% refund to source, with 50% paid to caregiver for reserved schedule.</li>
              <li><strong>Less than 4 hours notice:</strong> Non-refundable due to last-minute dispatch lock.</li>
              <li><strong>Caregiver cancellation:</strong> 100% instant refund + priority free replacement + ₹250 wallet apology credit.</li>
            </ul>
            <p className="mt-3 text-xs text-ink/70">
              For complete details and settlement timelines, see our full <Link href={"/refund-policy" as any} className="font-bold text-indigo hover:underline">Refund Policy</Link>.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">6. Questions & Contact</h2>
            <p className="mt-4 leading-7">
              For any questions regarding these terms, please reach our Care Concierge team at{" "}
              <a href="mailto:support@petsaathi.com" className="font-bold text-[#E16649] hover:underline">
                support@petsaathi.com
              </a>{" "}
              or visit our{" "}
              <Link href="/contact" className="font-bold text-indigo hover:underline">
                Contact Page
              </Link>.
            </p>
          </div>

        </div>
      </section>
    </PublicShell>
  );
}
