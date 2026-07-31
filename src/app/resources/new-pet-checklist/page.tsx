import type { Metadata } from "next";
import Link from "next/link";

import { PageIntro, PublicShell } from "@/components/marketing/public-shell";

export const metadata: Metadata = {
  title: "New pet checklist",
  description:
    "A practical first-week checklist for calm routines, identification, health records, and safe care handovers.",
};

const sections = [
  {
    title: "Before the first day",
    items: [
      "Confirm identification, collar fit, microchip details, and two reachable emergency contacts.",
      "Choose a quiet sleep area, separate food and water bowls, and remove unsafe plants or loose cables.",
      "Write down the pet’s current food, portions, medication, allergies, and veterinarian contact.",
    ],
  },
  {
    title: "Build a calm routine",
    items: [
      "Keep meals, toilet breaks, walks, play, and rest at predictable times.",
      "Introduce one room and one person at a time; allow the pet to choose distance.",
      "Record appetite, water, toilet habits, sleep, and any behaviour that changes suddenly.",
    ],
  },
  {
    title: "Prepare for assisted care",
    items: [
      "Share only the care information a confirmed Saathi needs for the booked service.",
      "Use a structured handover for access, equipment, routine, temperament, and emergency escalation.",
      "Never place lock codes, payment information, or unnecessary medical details in public messages.",
    ],
  },
] as const;

export default function NewPetChecklistPage() {
  return (
    <PublicShell>
      <PageIntro
        eyebrow="Printable PetSaathi resource"
        title="The calm first-week pet checklist"
        description="A practical starting point for safer routines. It does not replace veterinary advice."
      />
      <main className="container-shell pb-24 print:pb-0">
        <div className="mx-auto max-w-4xl rounded-5xl border border-indigo/10 bg-paper p-7 shadow-lifted sm:p-12 print:border-0 print:p-0 print:shadow-none">
          <div className="grid gap-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="font-display text-3xl font-semibold">{section.title}</h2>
                <ul className="mt-4 grid gap-3">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 rounded-2xl bg-cream/55 p-4 text-sm leading-6"
                    >
                      <span aria-hidden="true" className="mt-1 text-leaf">
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3 print:hidden">
            <Link
              href="/services"
              className="rounded-full bg-indigo px-5 py-3 text-sm font-bold text-paper"
            >
              Explore care services
            </Link>
          </div>
        </div>
      </main>
    </PublicShell>
  );
}
