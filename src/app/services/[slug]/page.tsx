import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageIntro, PublicShell } from "@/components/marketing/public-shell";
import { services } from "@/modules/catalog/services";
import { ServiceJsonLd } from "@/components/seo/service-json-ld";

import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return services.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  return { title: service?.name ?? "Service" };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();
  const Icon = service.icon;
  return (
    <PublicShell>
      <ServiceJsonLd name={service.name} description={service.description} url={`https://petsaathi.com/services/${slug}`} />
      <BreadcrumbJsonLd items={[{ name: "Home", url: "https://petsaathi.com" }, { name: "Services", url: "https://petsaathi.com/services" }, { name: service.name, url: `https://petsaathi.com/services/${slug}` }]} />
      <PageIntro eyebrow={service.kicker} title={service.name} description={service.description} />
      <section className="container-shell">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
          <article className="rounded-5xl bg-ink p-8 text-paper sm:p-10">
            <Icon className="h-8 w-8 text-saffron" />
            <h2 className="mt-14 font-display text-4xl font-semibold">What the service records</h2>
            <ul className="mt-7 space-y-3 text-paper/80">{["Authorised start and finish milestones","Relevant care observations and concerns","Structured report card after completion","A clear path to human support when needed"].map((item) => <li key={item} className="border-b border-paper/10 pb-3">{item}</li>)}</ul>
          </article>
          <article className="glass-panel rounded-5xl p-8 sm:p-10">
            <h2 className="font-display text-4xl font-semibold">Before a booking</h2>
            <p className="mt-5 leading-7 text-ink/80">Pet details, risk factors, caregiver permissions, schedule and local capacity are checked before a match is confirmed. Exact availability and price are shown in the booking context.</p>
            <a href="/book" className="mt-8 inline-flex rounded-full bg-saffron px-6 py-4 text-sm font-bold">Check Availability</a>
          </article>
        </div>

        {/* Pricing Transparency Section */}
        <div className="mx-auto mt-6 max-w-5xl rounded-5xl border border-indigo/10 bg-paper p-8 shadow-lifted sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-indigo/10 pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-leaf font-outfit">Transparent Pricing Model</span>
              <h3 className="mt-1 font-display text-2xl font-bold text-ink">Estimated Rates & Factors</h3>
            </div>
            <span className="rounded-full bg-leaf/15 px-4 py-2 text-base font-bold text-leaf font-outfit w-fit">
              {service.startingPrice}
            </span>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 text-sm leading-relaxed text-ink/80">
            <div>
              <h4 className="font-bold text-ink mb-1">What Determines the Quote</h4>
              <p>{service.pricingNotes}</p>
            </div>
            <div>
              <h4 className="font-bold text-ink mb-1">Server-Verified Price</h4>
              <p>No hidden surprise fees. Exact rates are verified on the server and clearly shown before you approve a Saathi match or pay.</p>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
