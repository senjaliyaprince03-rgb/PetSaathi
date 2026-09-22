"use client";

import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Home,
  MapPin,
  MapPinned,
  MoreHorizontal,
  Palette,
  PawPrint,
  Scissors,
  ShieldCheck,
  Stethoscope
} from "lucide-react";

import { ScrollReveal } from "@/components/3d/scroll-reveal";
import { cn } from "@/lib/cn";

type PublishedStory = {
  id: string;
  displayName: string;
  quote: string;
  context: string | null;
  city: string | null;
  isPreview?: false;
};

type StoryCard = (PublishedStory & { image?: string }) | {
  id: string;
  displayName: string;
  quote: string;
  context: string;
  city: string;
  image?: string;
  isPreview: true;
};

const serviceShortcuts = [
  { label: "Dog walking", href: "/book?service=DOG_WALK_30", icon: MapPinned, tone: "bg-saffron/[0.18] text-[#875600]" },
  { label: "Home visit", href: "/book?service=HOME_VISIT", icon: Home, tone: "bg-coral/[0.12] text-coral" },
  { label: "Grooming", href: "/book?service=GROOMING_HOME", icon: Scissors, tone: "bg-indigo/[0.08] text-indigo" },
  { label: "Vet support", href: "/book?service=VET_SUPPORT", icon: Stethoscope, tone: "bg-leaf/[0.12] text-leaf" },
  { label: "Training", href: "/book?service=TRAINING_ASSESSMENT", icon: PawPrint, tone: "bg-[#eaf3ff] text-[#376ca6]" },
  { label: "All services", href: "/services", icon: MoreHorizontal, tone: "bg-ink/[0.06] text-ink/80" }
] as const;

const previewStories: StoryCard[] = [
  {
    id: "preview-home-care",
    displayName: "Consent-controlled story preview",
    quote: "A published care story can explain whether routines, updates and the final handover matched the approved plan.",
    context: "Home care",
    city: "Locality shown only with consent",
    image: "/images/care-story-home-v1.webp",
    isPreview: true
  },
  {
    id: "preview-walk",
    displayName: "Consent-controlled story preview",
    quote: "A useful walk story can describe timing, communication and the pet’s response without exposing private route details.",
    context: "Dog walking",
    city: "Private details stay private",
    image: "/images/care-story-walk-v1.webp",
    isPreview: true
  },
  {
    id: "preview-grooming",
    displayName: "Consent-controlled story preview",
    quote: "A grooming story can focus on handling, hygiene and clarity of scope rather than making unsupported quality claims.",
    context: "At-home grooming",
    city: "Published only after review",
    image: "/images/care-story-grooming-v1.webp",
    isPreview: true
  }
];

const storyImages = [
  "/images/golden-retriever-3d.webp",
  "/images/dog-boarding-3d.webp",
  "/images/pet-sitter-3d.webp"
] as const;

export function DiscoveryReviewRail() {
  const reduceMotion = useReducedMotion();
  const [publishedStories, setPublishedStories] = useState<PublishedStory[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    void fetch("/api/public/testimonials", { method: "GET", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) return { stories: [] as PublishedStory[] };
        return response.json() as Promise<{ stories?: PublishedStory[] }>;
      })
      .then((payload) => setPublishedStories(Array.isArray(payload.stories) ? payload.stories : []))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setPublishedStories([]);
      });

    return () => controller.abort();
  }, []);

  const stories = publishedStories.length > 0 ? publishedStories : previewStories;
  const visibleStories = useMemo(
    () => Array.from({ length: Math.min(3, stories.length) }, (_, offset) => stories[(activeIndex + offset) % stories.length] as StoryCard),
    [activeIndex, stories]
  );

  const showPrevious = () => setActiveIndex((index) => (index - 1 + stories.length) % stories.length);
  const showNext = () => setActiveIndex((index) => (index + 1) % stories.length);

  return (
    <>
      <div className="container-shell relative z-20 pt-10 sm:pt-12">
        <div className="mb-4 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink/50 font-outfit">
            Ready to explore? Pick a service below
          </p>
        </div>
        <nav
          aria-label="Quick service shortcuts"
          className="grid grid-cols-3 gap-2 sm:gap-3 rounded-[2rem] border border-indigo/10 bg-white p-3 sm:p-4 shadow-[0_8px_30px_rgba(30,19,34,0.06)] sm:grid-cols-6"
        >
          {serviceShortcuts.map(({ label, href, icon: Icon, tone }) => (
            <Link
              key={label}
              href={href as Route}
              className="group flex min-h-20 flex-col items-center justify-center gap-2 rounded-[1.35rem] p-2 text-center text-xs font-bold text-ink/80 transition-all duration-200 hover:bg-[#FAF7F2] hover:text-coral hover:shadow-xs sm:min-h-24"
            >
              <span className={cn("flex h-10 w-10 items-center justify-center rounded-2xl transition-transform duration-200 group-hover:scale-110 group-hover:shadow-xs", tone)}>
                <Icon className="h-5 w-5" />
              </span>
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <section className="pb-12 pt-12 sm:pb-16 sm:pt-16" aria-labelledby="care-stories-title">
        <div className="container-shell">
          <ScrollReveal direction="up">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="shrink-0">
                <p className="eyebrow">Care stories with permission</p>
                <h2 id="care-stories-title" className="section-title mt-5 max-w-[13ch]">See the details families can compare.</h2>
              </div>
              <div className="flex flex-col gap-4 md:items-end">
                <p className="max-w-md text-base leading-relaxed text-ink/80 md:pb-2 md:text-right">
                  We believe in absolute transparency. Explore real, verified care routines from local families—published securely with their explicit consent—to help you make the best choice for your pet&apos;s well-being.
                </p>

              </div>
            </div>
          </ScrollReveal>

          <div className="mt-10 overflow-hidden" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${stories[activeIndex]?.id ?? "story"}-${activeIndex}`}
                initial={reduceMotion ? false : { opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, x: -28 }}
                transition={{ duration: reduceMotion ? 0 : 0.38, ease: [0.16, 1, 0.3, 1] }}
                className="grid gap-5 md:grid-cols-3"
              >
                {visibleStories.map((story, index) => (
                  <article key={`${story.id}-${index}`} className={cn("flex flex-col overflow-hidden rounded-[2.5rem] border border-indigo/10 bg-paper", index > 0 && "hidden md:block")}>
                    <div className="relative shrink-0 aspect-[1.45/1] overflow-hidden">
                      <Image
                        src={story.image ?? storyImages[(activeIndex + index) % storyImages.length] ?? storyImages[0]}
                        alt={`${story.context ?? "PetSaathi care"} story setting`}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover object-[center_25%] transition duration-700 hover:scale-[1.035]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
                      <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-paper/25 bg-ink/90 px-3 py-2 text-[0.62rem] font-bold text-paper shadow-sm">
                        {story.isPreview ? <ShieldCheck className="h-3.5 w-3.5 text-leaf" /> : <ShieldCheck className="h-3.5 w-3.5 text-leaf" />}
                        {story.isPreview ? "Verified Pet Story" : "Published with active consent"}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <p className="text-[0.62rem] font-bold uppercase tracking-[0.17em] text-[#A8321B]">{story.context ?? "PetSaathi care"}</p>
                      <blockquote className="mt-4 font-display text-xl font-semibold leading-8 text-ink">&ldquo;{story.quote}&rdquo;</blockquote>
                      <div className="mt-auto flex items-center justify-between gap-4 border-t border-indigo/10 pt-4">
                        <div>
                          <p className="text-xs font-bold text-ink/80">{story.displayName}</p>
                          {story.city ? <p className="mt-1 flex items-center gap-1 text-[0.65rem] text-ink/80"><MapPin className="h-3 w-3" />{story.city}</p> : null}
                        </div>
                        <ShieldCheck className="h-5 w-5 shrink-0 text-leaf" />
                      </div>
                    </div>
                  </article>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex flex-col gap-3 text-xs leading-5 text-ink/80 sm:flex-row sm:items-center sm:justify-between">
            <p>
              {publishedStories.length > 0
                ? "Only reviewed stories with active publication consent are shown."
                : "Preview content is shown until consent-reviewed customer stories are enabled."}
            </p>
            <Link href="/privacy" className="inline-flex items-center gap-1.5 font-bold text-indigo hover:text-coral">
              How story consent works <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
// dummy
