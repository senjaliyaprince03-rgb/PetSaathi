import type { Metadata } from "next";

import { ContactForm } from "@/components/forms/contact-form";
import { PageIntro, PublicShell } from "@/components/marketing/public-shell";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const { topic } = await searchParams;
  return <PublicShell><PageIntro eyebrow="talk to a human" title="Questions deserve a clear next step." description="Choose the reason for your message. Your enquiry is stored privately and routed only to the authorised team." /><section className="container-shell"><ContactForm defaultTopic={topic} /></section></PublicShell>;
}
