import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Lock, Eye, RefreshCw, CheckCircle2 } from "lucide-react";
import { PageIntro, PublicShell } from "@/components/marketing/public-shell";

export const metadata: Metadata = {
  title: "Privacy Policy | DPDP Act 2023 Compliant",
  description: "PetSaathi Privacy Policy. Compliant with Digital Personal Data Protection Act (DPDP Act 2023) India. Clear information on data collection, consent, usage, and deletion rights.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <PublicShell>
      <PageIntro
        eyebrow="Trust, Privacy & Consent"
        title="Privacy Policy"
        description="Transparent and compliant with the Digital Personal Data Protection (DPDP) Act, 2023 of India."
      />

      <section className="container-shell pb-20">
        <div className="mx-auto max-w-4xl space-y-10 rounded-5xl border border-ink/10 bg-paper p-8 text-ink/80 shadow-lifted sm:p-12">
          
          <div className="rounded-3xl border border-indigo/20 bg-indigo/5 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <Lock className="h-6 w-6 text-indigo" />
              <h2 className="font-display text-xl font-bold text-ink">Our Commitment Under DPDP Act 2023</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink/80">
              PetSaathi values your personal trust. We process all personal and digital data in strict compliance with the Digital Personal Data Protection Act (DPDP Act 2023) of India. We only collect data necessary for pet care coordination, ensure explicit consent, encrypt sensitive data, and provide complete data erasure upon your request.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-ink">1. Information We Collect</h2>
            <p className="mt-3 leading-relaxed">
              We collect clear, lawful information to deliver pet care services:
            </p>
            <ul className="mt-4 space-y-2.5 text-sm list-disc pl-6 leading-relaxed">
              <li><strong>Parent & Caregiver Profile:</strong> Name, verified Indian mobile phone number, email address, home society/residential address.</li>
              <li><strong>Pet Passport & Health Data:</strong> Pet breed, vaccination dates, veterinary records, dietary needs, temperament tags, and emergency veterinary contacts.</li>
              <li><strong>Real-Time Session Telemetry:</strong> Live GPS walking paths, milestone photo updates, timestamped pee/poop records, and check-in times (only during active booked care sessions).</li>
              <li><strong>Payment Transaction Data:</strong> Transaction references, method (UPI, Netbanking, Card), and billing address processed via RBI-authorized payment aggregator (Razorpay). PetSaathi does not store raw credit/debit card numbers.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-ink">2. Purpose of Processing & Consent</h2>
            <p className="mt-3 leading-relaxed">
              Your data is processed strictly for:
            </p>
            <ul className="mt-4 space-y-2 text-sm list-disc pl-6 leading-relaxed">
              <li>Verifying sitter identity and criminal background for pet safety.</li>
              <li>Enabling live location tracking for parents while dogs are walked outside.</li>
              <li>Executing instant automated refunds under our cancellation policy.</li>
              <li>Sending essential transactional updates (SMS, WhatsApp, and push notifications) regarding your booking status.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-ink">3. Your Rights as a Data Principal (India)</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-ink/10 bg-surface-raised p-5">
                <h3 className="font-display text-base font-bold text-ink">Right to Access &amp; Summary</h3>
                <p className="mt-2 text-xs text-ink/70 leading-relaxed">
                  You can review all personal data and pet medical passports associated with your account anytime in Account Settings.
                </p>
              </div>
              <div className="rounded-2xl border border-ink/10 bg-surface-raised p-5">
                <h3 className="font-display text-base font-bold text-ink">Right to Correction &amp; Erasure</h3>
                <p className="mt-2 text-xs text-ink/70 leading-relaxed">
                  Request immediate deletion of your personal data and account via settings or by contacting our Grievance Officer.
                </p>
              </div>
              <div className="rounded-2xl border border-ink/10 bg-surface-raised p-5">
                <h3 className="font-display text-base font-bold text-ink">Right of Grievance Redressal</h3>
                <p className="mt-2 text-xs text-ink/70 leading-relaxed">
                  Fast resolution of any data complaints within 7 business days by our designated Indian Data Protection Officer.
                </p>
              </div>
              <div className="rounded-2xl border border-ink/10 bg-surface-raised p-5">
                <h3 className="font-display text-base font-bold text-ink">Right to Nominate</h3>
                <p className="mt-2 text-xs text-ink/70 leading-relaxed">
                  Nominate an individual to exercise your data rights in event of incapacity or demise.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-ink">4. Grievance Officer & Contact Details</h2>
            <div className="mt-4 rounded-2xl border border-ink/10 bg-surface-raised p-6 space-y-2 text-sm leading-relaxed">
              <p><strong>Grievance Officer:</strong> Trust &amp; Safety Lead, PetSaathi Technologies Pvt. Ltd.</p>
              <p><strong>Email:</strong> <a href="mailto:grievance@petsaathi.com" className="font-bold text-indigo hover:underline">grievance@petsaathi.com</a> / <a href="mailto:privacy@petsaathi.com" className="font-bold text-indigo hover:underline">privacy@petsaathi.com</a></p>
              <p><strong>Response Timeline:</strong> Within 24-48 hours (maximum 7 business days as stipulated by DPDP Act 2023).</p>
            </div>
          </div>

        </div>
      </section>
    </PublicShell>
  );
}