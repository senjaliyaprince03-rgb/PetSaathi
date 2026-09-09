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
            <h2 className="font-display text-2xl font-semibold text-ink">1. Data We Collect</h2>
            <p className="mt-4 leading-7">
              At PetSaathi, we collect only the information necessary to facilitate safe, reliable pet care services. This includes:
            </p>
            <ul className="mt-4 list-disc pl-6 space-y-2 leading-7">
              <li><strong>Profile Information:</strong> Name, phone number, address, and pet medical records stored in MongoDB Atlas with encryption at rest (AES-256) and TLS encryption in transit, isolated by strict application-layer role-based access control.</li>
              <li><strong>Location Data:</strong> Used to match you with nearby verified caregivers and enable live session tracking during walks. In browser/PWA sessions, location sharing is caregiver-initiated and active strictly during the scheduled care window.</li>
              <li><strong>Payment Details:</strong> Transaction records and billing receipts processed securely via Razorpay PCI-DSS compliant infrastructure. PetSaathi never stores raw card or bank credentials.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">2. How Data is Used & Stored</h2>
            <p className="mt-4 leading-7">
              Your data is never sold to third parties. We use it solely to authorize bookings, coordinate safe doorstep handoffs, process payments, and ensure pet safety. Location telemetry collected during outdoor sessions is archived on a 30-day retention schedule for safety verification and dispute resolution, after which detailed coordinates are automatically purged.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">3. Analytics & Cookies</h2>
            <p className="mt-4 leading-7">
              With your explicit consent via our cookie banner, we use privacy-compliant telemetry to improve app performance and user experience. You can modify your preferences at any time in Account Settings.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">4. Data Deletion & Privacy Inquiries</h2>
            <p className="mt-4 leading-7">
              Under Indian data protection frameworks and PetSaathi safety charters, you may request complete account data deletion, export your pet passport records, or raise privacy inquiries by contacting our Data Protection Officer at{" "}
              <a href="mailto:privacy@petsaathi.com" className="font-bold text-[#E16649] hover:underline">
                privacy@petsaathi.com
              </a>{" "}
              or via our{" "}
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
