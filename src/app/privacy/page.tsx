import type { Metadata } from "next";

import { PageIntro, PublicShell } from "@/components/marketing/public-shell";

export const metadata: Metadata = {
  title: "Privacy Notice",
  robots: {
    index: false,
    follow: false
  }
};

export default function PrivacyPage() {
  return (
    <PublicShell>
      <PageIntro
        eyebrow="Commitment to Privacy"
        title="Privacy Notice"
        description="How we collect, use, and protect your data."
      />
      <section className="container-shell">
        <div className="mx-auto max-w-4xl space-y-8 rounded-5xl border border-ink/10 bg-paper p-8 text-ink/80 shadow-lifted sm:p-12">
          
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">1. Data We Collect</h2>
            <p className="mt-4 leading-7">
              At PetSaathi, we collect only the information necessary to facilitate safe, reliable pet care services. This includes:
            </p>
            <ul className="mt-4 list-disc pl-6 space-y-2 leading-7">
              <li><strong>Profile Information:</strong> Name, contact details, and pet information securely stored and authenticated via Supabase.</li>
              <li><strong>Location Data:</strong> To match you with nearby caregivers and enable active service tracking (e.g., dog walking routes), we collect location data. This is feature-gated and strictly time-limited to the duration of the service.</li>
              <li><strong>Payment Details:</strong> Transaction records and billing information are processed securely by Razorpay. We do not store full credit card numbers on our servers.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">2. How Data is Used & Stored</h2>
            <p className="mt-4 leading-7">
              Your data is never sold to third parties. We use it solely to authorize bookings, process payments, and ensure safety.
              Location data collected during a walk is retained only for 30 days post-service to facilitate dispute resolution, after which it is anonymized or permanently deleted. Profile records in Supabase are retained as long as your account is active.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">3. Analytics & Cookies</h2>
            <p className="mt-4 leading-7">
              With your explicit consent via our cookie banner, we use Google Analytics to understand how our platform is used. You can withdraw this consent at any time. Essential cookies required for security and session management (handled by NextAuth/Supabase) are strictly necessary and cannot be disabled.
            </p>
          </div>

        </div>
      </section>
    </PublicShell>
  );
}
