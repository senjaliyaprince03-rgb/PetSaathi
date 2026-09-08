"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { ScrollReveal } from "@/components/3d/scroll-reveal";

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    city: "Mumbai",
    service: "Dog Walking",
    rating: 5,
    quote: "PetSaathi has completely changed how I manage my work trips. My Labrador gets the same loving walk every evening, and the live GPS tracking gives me total peace of mind.",
    image: "/images/avatar-1.webp"
  },
  {
    id: 2,
    name: "Rahul Verma",
    city: "Delhi",
    service: "Home Pet Sitting",
    rating: 5,
    quote: "Finding a reliable sitter for my indie dog was stressful until I found PetSaathi. The caregiver was incredibly professional, shared photos twice a day, and followed his diet perfectly.",
    image: "/images/avatar-2.webp"
  },
  {
    id: 3,
    name: "Ananya Desai",
    city: "Bangalore",
    service: "Pet Grooming",
    rating: 5,
    quote: "The at-home grooming service is a lifesaver. My Persian cat hates car rides, so having a verified professional come home made the whole process calm and easy.",
    image: "/images/avatar-3.webp"
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-cream border-t border-indigo/10">
      <div className="container-shell">
        <ScrollReveal direction="up">
          <div className="text-center max-w-2xl mx-auto">
            <p className="eyebrow font-outfit text-indigo uppercase tracking-widest text-xs font-bold">Trusted by Pet Parents</p>
            <h2 className="section-title mt-4 text-4xl sm:text-5xl font-display font-semibold text-ink">
              Stories from our community
            </h2>
            <p className="mt-4 text-ink/80 text-lg">
              Hear what pet parents across India have to say about their PetSaathi experience.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-3 mt-12">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-paper border border-indigo/10 rounded-[2rem] p-8 shadow-soft flex flex-col">
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < t.rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-200'}`} 
                  />
                ))}
              </div>
              <blockquote className="text-ink/80 leading-7 flex-1 mb-8">
                "{t.quote}"
              </blockquote>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 relative rounded-full overflow-hidden border-2 border-indigo/10">
                  <Image src={t.image} alt={t.name} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-ink text-sm">{t.name}</h4>
                  <p className="text-xs text-ink/60">{t.city} • {t.service}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
