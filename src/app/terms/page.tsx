import type { Metadata } from "next";

import { PageIntro, PublicShell } from "@/components/marketing/public-shell";

export const metadata: Metadata = {
  title: "Terms of Service",
  robots: {
    index: false,
    follow: false
  }
};

export default function TermsPage() {
  return (
    <PublicShell>
      <PageIntro
        eyebrow="Legal Information"
        title="Terms of Service"
        description="Pending legal review."
      />
      <section className="container-shell">
        <div className="mx-auto max-w-4xl space-y-8 rounded-5xl border border-ink/10 bg-paper p-8 text-ink/80 shadow-lifted sm:p-12">

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="font-display text-xl font-semibold text-yellow-800">Pending Legal Review</h2>
            <p className="mt-4 leading-7 text-yellow-700">
              This page is currently under review by our legal counsel. The Terms of Service will be published prior to our public launch.
            </p>
          </div>

        </div>
      </section>
    </PublicShell>
  );
}
