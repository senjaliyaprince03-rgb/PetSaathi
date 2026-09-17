import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, PublicShell } from "@/components/marketing/public-shell";

export const metadata: Metadata = {
  title: "Privacy Notice & Data Rights",
  description: "Learn how PetSaathi protects your personal and pet information with bank-grade encryption, minimal data retention, and strict access controls.",
  robots: {
    index: true,
    follow: true
  }
};

export default function PrivacyPage() {
  return (
    <PublicShell>
      <PageIntro
        eyebrow="Commitment to Privacy"
        title="Privacy Notice"
        description="How we collect, use, and protect your personal and pet health data across India."
      />
      <section className="container-shell pb-20">
        <div className="mx-auto max-w-4xl space-y-8 rounded-5xl border border-ink/10 bg-paper p-8 text-ink/80 shadow-lifted sm:p-12">
          
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">1. Data We Collect & Data Fiduciary Role</h2>
            <p className="mt-4 leading-7">
              PetSaathi acts as a Data Fiduciary under the Digital Personal Data Protection (DPDP) Act, 2023. We collect only the data necessary to coordinate safe, reliable pet care services:
            </p>
            <ul className="mt-4 list-disc pl-6 space-y-2 leading-7">
              <li><strong>Profile Information:</strong> Name, verified mobile number, email, address, and digital pet passport health records. All data is stored in ISO 27001/SOC 2 certified secure cloud infrastructure with AES-256 encryption at rest, TLS in transit, and role-based access isolation.</li>
              <li><strong>Location Data:</strong> Used to match you with nearby verified caregivers and enable live session telemetry during walks. Location sharing is caregiver-initiated and active strictly during scheduled, consented care windows.</li>
              <li><strong>Payment Details:</strong> Transaction records and billing receipts processed securely via Razorpay PCI-DSS Level 1 compliant infrastructure. PetSaathi never stores raw payment card numbers or banking passwords.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">2. How Data is Used & Third-Party Processors</h2>
            <p className="mt-4 leading-7">
              Your personal data is never sold, rented, or monetized. We share data only with authorized service processors strictly necessary for platform operations:
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-2 leading-7">
              <li><strong>Razorpay:</strong> Secure payment collection, escrow milestone verification, and refund disbursement.</li>
              <li><strong>Vercel Cloud:</strong> Secure web application hosting and content delivery network.</li>
              <li><strong>Sentry:</strong> Real-time software error monitoring and diagnostics (all personal identifying telemetry is scrubbed prior to ingestion).</li>
            </ul>
            <p className="mt-4 leading-7">
              Location telemetry collected during outdoor sessions is maintained on a 30-day retention schedule for safety verification and dispute resolution, after which detailed coordinates are permanently purged. Account profile records are retained only while your account remains active.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">3. Children&apos;s Privacy Policy</h2>
            <p className="mt-4 leading-7">
              PetSaathi services and caregiver applications are strictly intended for individuals who are 18 years of age or older. We do not knowingly collect or process personal data relating to minors.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">4. Cookies & Consent Management</h2>
            <p className="mt-4 leading-7">
              We deploy essential functional cookies and, with your explicit consent via our cookie banner, anonymized analytics cookies to enhance browsing stability. You may withdraw or modify cookie preferences at any time.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">5. Your Rights & Grievance Officer</h2>
            <p className="mt-4 leading-7">
              Under the DPDP Act 2023, you have the right to access, correct, update, or withdraw consent and request erasure of your personal data. To exercise any data rights or raise inquiries, contact our Data Protection &amp; Grievance Redressal Desk:
            </p>
            <div className="mt-4 rounded-2xl border border-ink/10 bg-ink/5 p-4 text-sm leading-relaxed">
              <p><strong>Grievance Officer:</strong> Data Protection &amp; Privacy Officer</p>
              <p><strong>Email:</strong> <a href="mailto:privacy@petsaathi.com" className="font-bold text-indigo hover:underline">privacy@petsaathi.com</a> / <a href="mailto:grievance@petsaathi.com" className="font-bold text-indigo hover:underline">grievance@petsaathi.com</a></p>
              <p><strong>Response Timeline:</strong> Acknowledged within 48 hours; resolved within 30 days under Indian statutory rules.</p>
              <p><strong>Physical Address:</strong> PetSaathi Technologies, Ahmedabad, Gujarat 380058, India.</p>
            </div>
          </div>

        </div>
      </section>
    </PublicShell>
  );
}
