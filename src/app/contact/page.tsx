import type { Metadata } from "next";

import { ContactForm } from "@/components/forms/contact-form";
import { PageIntro, PublicShell } from "@/components/marketing/public-shell";

import Link from "next/link";
import { Mail, Phone, ShieldCheck } from "lucide-react";

export const metadata: Metadata = { 
  title: "Contact Care Concierge",
  description: "Get in touch with PetSaathi care specialists for booking assistance, society onboarding, or emergency support."
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const { topic } = await searchParams;
  return (
    <PublicShell>
      <PageIntro 
        eyebrow="talk to a human" 
        title="Questions deserve a clear next step." 
        description="Choose the reason for your message. Your enquiry is stored privately and routed only to the authorised team." 
      />
      <section className="container-shell pb-16">
        <ContactForm defaultTopic={topic} />

        {/* Clickable Direct Contact Channels */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <a
            href="mailto:support@petsaathi.com"
            className="flex items-center gap-3.5 p-4 rounded-2xl bg-paper border border-ink/10 shadow-soft hover:border-indigo/40 transition-all group"
          >
            <span className="w-10 h-10 rounded-xl bg-indigo/10 text-indigo flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mail className="w-5 h-5" />
            </span>
            <div>
              <span className="text-xs text-ink/60 block font-medium">Customer Support Desk</span>
              <span className="text-sm font-bold text-ink group-hover:text-indigo transition-colors">support@petsaathi.com</span>
            </div>
          </a>

          <a
            href="tel:+918000738722"
            className="flex items-center gap-3.5 p-4 rounded-2xl bg-paper border border-ink/10 shadow-soft hover:border-emerald-500/40 transition-all group"
          >
            <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Phone className="w-5 h-5" />
            </span>
            <div>
              <span className="text-xs text-ink/60 block font-medium">Priority Hotline</span>
              <span className="text-sm font-bold text-ink group-hover:text-emerald-700 transition-colors">+91 8000 PETSAATHI</span>
            </div>
          </a>
        </div>
      </section>
    </PublicShell>
  );
}
