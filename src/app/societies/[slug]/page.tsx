import { notFound } from "next/navigation";
import { Building2, CalendarDays, MapPin } from "lucide-react";

import { PublicShell } from "@/components/marketing/public-shell";
import { prisma } from "@/lib/db";
import { SocietyJoinForm } from "@/components/forms/society-join-form";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const society = await prisma.society.findUnique({ where: { slug } });
  if (!society) return { title: "Not Found" };
  return { title: `${society.name} | PetSaathi Partnerships` };
}

export default async function SocietyLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const society = await prisma.society.findUnique({ 
    where: { slug },
    include: {
      events: {
        where: { endsAt: { gte: new Date() }, status: "ACTIVE" },
        orderBy: { startsAt: "asc" }
      }
    }
  });

  if (!society) notFound();

  return (
    <PublicShell>
      <section className="bg-ink pt-28 pb-16 text-paper sm:pt-36 sm:pb-24">
        <div className="container-shell text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo/20 text-indigo shadow-lg">
            <Building2 className="h-10 w-10" />
          </div>
          <p className="mt-6 text-sm font-bold uppercase tracking-widest text-saffron">Verified Community Partner</p>
          <h1 className="mt-4 font-display text-4xl font-bold sm:text-6xl">{society.name}</h1>
          <p className="mt-4 flex items-center justify-center gap-2 text-paper/70">
            <MapPin className="h-4 w-4 text-coral" /> {society.locality}, {society.city}
          </p>
        </div>
      </section>

      <section className="bg-paper py-16 sm:py-24">
        <div className="container-shell grid gap-10 md:grid-cols-2 lg:gap-20 items-start">
          <div>
            <h2 className="font-display text-3xl font-semibold text-ink">Welcome, {society.name} Residents!</h2>
            <p className="mt-4 text-ink/70 leading-relaxed">
              We have partnered with your community management to bring you a trusted, localized pet care experience. By joining the {society.name} PetSaathi portal, you get access to verified caregivers familiar with your society&apos;s protocols and exclusive community events.
            </p>
            
            <div className="mt-10">
              <h3 className="font-semibold text-ink mb-4">Upcoming Community Events</h3>
              {society.events.length > 0 ? (
                <div className="grid gap-4">
                  {society.events.map((event) => (
                    <div key={event.id} className="rounded-2xl border border-indigo/10 bg-[#f3eafa]/30 p-5">
                      <h4 className="font-bold text-lg text-indigo">{event.title}</h4>
                      <p className="text-sm text-ink/60 mt-1">{event.description}</p>
                      <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-coral">
                        <CalendarDays className="h-4 w-4" /> 
                        {event.startsAt.toLocaleDateString("en-IN", { dateStyle: "medium" })}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-ink/50 italic">No upcoming events scheduled at the moment.</p>
              )}
            </div>
          </div>

          <div className="sticky top-24 rounded-4xl border border-ink/10 bg-white p-8 shadow-2xl">
            <h3 className="font-display text-2xl font-bold">Join the Community</h3>
            <p className="mt-2 text-sm text-ink/60 mb-6">Link your PetSaathi account to verify your residency and unlock community features.</p>
            <SocietyJoinForm societyId={society.id} />
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
