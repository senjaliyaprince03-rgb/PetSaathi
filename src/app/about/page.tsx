import type { Metadata } from "next";

import { PageIntro, PublicShell } from "@/components/marketing/public-shell";

export const metadata: Metadata = { 
  title: "About Us",
  description: "Learn how PetSaathi is elevating pet parenting standards across India with verified caregivers, transparent handoffs, and neighborhood-first care."
};

export default function AboutPage() {
  return (
    <PublicShell>
      <PageIntro
        eyebrow="Our Mission"
        title="Built for the handoff, not just the search."
        description="Finding a contact number is easy. Feeling confident about caregiver trustworthiness, handling discipline, and what happens when an emergency arises is harder. PetSaathi is engineered around that complete operating thread."
      />
      <section className="container-shell pb-20">
        <div className="mx-auto max-w-5xl rounded-5xl bg-saffron p-8 sm:p-14 text-ink">
          <p className="font-display text-3xl font-semibold leading-tight sm:text-5xl">
            A trusted local pet marketplace should make care predictable before, during, and after each service.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {[
              ["Local Density", "We launch society by society with verified caregiver clusters so schedules stay unhurried."],
              ["Managed Quality", "Every Saathi undergoes government ID verification, reference checks, and supervised sessions."],
              ["Audit-Trail Care", "Real-time geofenced walks, check-in photos, and clinical reports replace informal chat promises."]
            ].map(([title, copy]) => (
              <div key={title} className="rounded-3xl bg-paper/70 p-6 shadow-sm">
                <h2 className="font-display text-2xl font-semibold">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-ink/80">{copy}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Founding Story & Corporate Transparency */}
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2">
          <div className="rounded-4xl border border-ink/10 bg-paper p-8 shadow-lifted">
            <h3 className="font-display text-2xl font-bold text-ink">The PetSaathi Philosophy</h3>
            <p className="mt-4 text-sm leading-7 text-ink/80">
              Indian pet parents in gated communities face a common dilemma: relying on informal domestic help without handling training, or leaving their dogs in overcrowded kennels. PetSaathi was founded in 2026 to pioneer doorstep, high-trust companionship delivered by background-vetted animal lovers who treat your pet like family.
            </p>
          </div>
          <div className="rounded-4xl border border-ink/10 bg-paper p-8 shadow-lifted">
            <h3 className="font-display text-2xl font-bold text-ink">Operational Base & Standards</h3>
            <p className="mt-4 text-sm leading-7 text-ink/80">
              Headquartered in Ahmedabad with pilot operational zones expanding across Bangalore and Pune, PetSaathi combines digital safety protocols with on-ground supervision to protect pets and support independent caregivers with fair living wages.
            </p>
            <div className="mt-6 border-t border-ink/10 pt-4 text-xs text-ink/70 space-y-1">
              <p><strong>Registered Operations:</strong> Ahmedabad, Gujarat 380058, India</p>
              <p><strong>Care Concierge:</strong> <a href="mailto:support@petsaathi.com" className="font-bold text-indigo hover:underline">support@petsaathi.com</a> | +91 80007 38722</p>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
