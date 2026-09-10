import {
  ClipboardCheck,
  HeartHandshake,
  Radio,
  SlidersHorizontal,
  Sparkles
} from "lucide-react";
import { ScrollReveal } from "@/components/3d/scroll-reveal";

export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      icon: SlidersHorizontal,
      title: "1. Select Service & Location",
      description: "Pick from 7 tailored care services and enter your city, locality or residential society to view verified local availability.",
    },
    {
      number: "02",
      icon: Sparkles,
      title: "2. Care Match Algorithm",
      description: "Our match algorithm evaluates caregiver certifications, pet temperament fit, distance, and real-time schedule capacity.",
    },
    {
      number: "03",
      icon: HeartHandshake,
      title: "3. Meet Your Saathi (Meet & Greet)",
      description: "Arrange a preliminary introduction before your session to ensure mutual comfort, pet familiarity, and routine alignment.",
    },
    {
      number: "04",
      icon: Radio,
      title: "4. Real-Time Service Updates",
      description: "Follow outdoor GPS checkpoints, timestamped check-ins, routine milestones, and direct photo updates on your device.",
    },
    {
      number: "05",
      icon: ClipboardCheck,
      title: "5. Structured Completion & Report Card",
      description: "Receive a comprehensive post-service report card covering meal details, hydration, activity, and behavioral observations.",
    }
  ];

  return (
    <section className="py-16 bg-paper border-t border-indigo/10" id="how-it-works">
      <div className="container-shell">
        <ScrollReveal direction="up">
          <div className="text-center max-w-2xl mx-auto">
            <p className="eyebrow font-outfit text-indigo uppercase tracking-widest text-xs font-bold">Accountable Protocol</p>
            <h2 className="section-title mt-4 text-4xl sm:text-5xl font-display font-semibold text-ink">
              How PetSaathi Works
            </h2>
            <p className="mt-4 text-ink/80 text-base">
              A calm, structured 5-step journey designed to keep you informed and your pet secure at every milestone.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative z-10 flex flex-col items-center text-center p-5 rounded-3xl bg-cream/40 border border-indigo/10 transition-all duration-300 hover:bg-cream hover:shadow-soft"
            >
              <div className="relative mb-5">
                <div className="w-16 h-16 bg-paper border border-indigo/20 rounded-2xl flex items-center justify-center text-indigo shadow-sm">
                  <step.icon className="w-7 h-7" />
                </div>
                <span className="absolute -bottom-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-saffron text-[0.65rem] font-bold text-ink shadow-xs">
                  {step.number}
                </span>
              </div>
              <h3 className="text-base font-display font-bold text-ink mb-2">{step.title}</h3>
              <p className="text-xs text-ink/70 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
