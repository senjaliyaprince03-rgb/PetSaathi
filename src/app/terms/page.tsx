import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, FileText, Lock, HelpCircle } from "lucide-react";
import { PageIntro, PublicShell } from "@/components/marketing/public-shell";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read PetSaathi's Terms of Service outlining booking policies, caregiver verification, ₹50,000 Vet Medical Assistance Protocol, GPS tracking, grievance redressal, and cancellation terms.",
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
              These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between you and <strong>[TO BE COMPLETED: Legal Entity Name]</strong> (CIN: <strong>[TO BE COMPLETED: Corporate Identification Number (CIN)]</strong>), having its registered office at <strong>[TO BE COMPLETED: Registered Office Address]</strong> (hereinafter referred to as &quot;PetSaathi&quot;, &quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
            </p>
            <p className="mt-3 leading-7">
              PetSaathi operates a managed, verified pet care discovery and coordination platform connecting pet parents with verified, background-screened independent caregivers (&quot;Saathis&quot;) for dog walking, home sitting, grooming, and veterinary support services in designated residential societies and localities across India.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">2. Independent Caregiver Relationship</h2>
            <p className="mt-4 leading-7">
              Saathis are independent service providers registered on the PetSaathi platform and are not direct employees or agents of PetSaathi. PetSaathi establishes operating standards, conducts identity and safety vetting, provides tooling (GPS tracking, session reports, milestone logging), and administers payment collection and discretionary dispute assistance on behalf of users.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">3. Caregiver Verification & Trust Standards</h2>
            <p className="mt-4 leading-7">
              Saathis undergo structured identity document verification, reference interviews, behavioral handling reviews, and emergency protocol orientation prior to receiving active service dispatch permissions. Where automated third-party criminal checks are pending integration, in-person document scrutiny and manual background interviews are enforced. Parents agree to provide accurate medical, dietary, and behavioral notes for their pets in their digital passports.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">4. ₹50,000 Vet Medical Assistance Protocol (Beta)</h2>
            <p className="mt-4 leading-7">
              PetSaathi operates a managed emergency medical assistance protocol covering up to ₹50,000 for documented veterinary emergency medical treatments necessitated by incidents occurring directly during an active, tracked service window. This platform safeguard is discretionary assistance subject to incident review, verified receipts from a registered veterinary practitioner, and compliance with our pet disclosure rules. It is not an insurance policy or contract of underwriting.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">5. Live GPS Tracking & Society Handoffs</h2>
            <p className="mt-4 leading-7">
              During outdoor walks and doorstep care sessions, real-time geofenced GPS tracking, milestone photo check-ins, and pee/poop records are generated and securely transmitted to the parent portal. In web and PWA browsers, continuous GPS tracking requires the caregiver&apos;s device screen to remain active; background telemetry is optimized across session check-ins. Caregivers adhere strictly to residential gated community entry protocols and double-leash safety standards.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">6. Payments, Cancellations & Refunds</h2>
            <p className="mt-4 leading-7">
              Transactions are processed securely through Razorpay PCI-DSS compliant banking channels. Booking funds are held until session fulfilment and milestone review. Cancellations strictly follow our verified tier structure:
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
            <h2 className="font-display text-2xl font-semibold text-ink">7. Limitation of Liability & Governing Law</h2>
            <p className="mt-4 leading-7">
              To the maximum extent permitted by applicable Indian law, PetSaathi&apos;s total aggregate liability arising out of or related to any booking or platform use shall be limited to the total service fee paid by the user for the specific booking giving rise to the claim, or the discretionary assistance under our Emergency Medical Protocol (if eligible). These Terms are governed by and construed in accordance with the laws of India, with exclusive jurisdiction resting in the courts of Ahmedabad, Gujarat.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">8. Grievance Redressal & Statutory Officer</h2>
            <p className="mt-4 leading-7">
              In accordance with Rule 4(4) and Rule 5(3)(b) of the Consumer Protection (E-Commerce) Rules, 2020, and the Information Technology Act, 2000 read with applicable rules, the details of the designated Grievance Officer for PetSaathi are as follows:
            </p>
            <div className="mt-3 rounded-2xl border border-ink/10 bg-ink/5 p-4 text-sm leading-relaxed">
              <p><strong>Officer Name:</strong> [TO BE COMPLETED: Named Grievance Officer]</p>
              <p><strong>Designation:</strong> [TO BE COMPLETED: Grievance Officer Designation]</p>
              <p><strong>Contact Telephone:</strong> [TO BE COMPLETED: Grievance Officer Telephone Number]</p>
              <p><strong>Email:</strong> <a href="mailto:grievance@petsaathi.com" className="font-bold text-indigo hover:underline">grievance@petsaathi.com</a></p>
              <p><strong>Registered Office / Postal Address:</strong> [TO BE COMPLETED: Registered Office Address]</p>
              <p className="mt-2"><strong>Response Timeline:</strong> Grievances are acknowledged within 48 hours and redressed within 30 days of receipt.</p>
              <p><strong>Support Desk:</strong> <a href="mailto:support@petsaathi.com" className="font-bold text-indigo hover:underline">support@petsaathi.com</a> (Mon–Sat, 8 AM – 8 PM IST, with 24/7 priority emergency incident escalation during active bookings).</p>
            </div>
          </div>

        </div>
      </section>
    </PublicShell>
  );
}
