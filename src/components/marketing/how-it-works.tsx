import { Search, CalendarCheck, MapPin } from "lucide-react";
import { ScrollReveal } from "@/components/3d/scroll-reveal";

export function HowItWorksSection() {
  const steps = [
    {
      icon: Search,
      title: "1. Find a Verified Saathi",
      description: "Browse trusted, background-checked pet caregivers in your local area based on your pet's specific needs.",
    },
    {
      icon: CalendarCheck,
      title: "2. Book & Confirm",
      description: "Select your required dates and services. Review upfront pricing and confirm your booking securely on our platform.",
    },
    {
      icon: MapPin,
      title: "3. Track & Relax",
      description: "Get real-time GPS tracking for walks, photo updates, and structured report cards right to your phone.",
    }
  ];

  return (
    <section className="py-16 bg-paper">
      <div className="container-shell">
        <ScrollReveal direction="up">
          <div className="text-center max-w-2xl mx-auto">
            <p className="eyebrow font-outfit text-indigo uppercase tracking-widest text-xs font-bold">Simple Process</p>
            <h2 className="section-title mt-4 text-4xl sm:text-5xl font-display font-semibold text-ink">
              How PetSaathi Works
            </h2>
          </div>
        </ScrollReveal>

        <div className="mt-16 grid md:grid-cols-3 gap-12 relative">
          {/* Connecting Line for Desktop */}
          <div className="hidden md:block absolute top-[2.5rem] left-[15%] right-[15%] h-0.5 bg-indigo/10 z-0" />
          
          {steps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-cream border border-indigo/20 rounded-full flex items-center justify-center text-indigo mb-6 shadow-sm">
                <step.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-display font-bold text-ink mb-3">{step.title}</h3>
              <p className="text-ink/70 leading-relaxed max-w-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
