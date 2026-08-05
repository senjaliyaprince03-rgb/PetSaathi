"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play, PawPrint, Volume2, VolumeX } from "lucide-react";
import { ParallaxScroll, RotateOnScroll } from "@/components/3d/scroll-reveal";

const videoAssetExists = (src: string) => {
  if (typeof window === "undefined") return true;

  const video = document.createElement("video");
  video.src = src;
  return video.canPlayType("video/mp4") !== "";
};

const careFilms = [
  {
    slug: "dog-walking",
    title: "Premium dog walking",
    eyebrow: "Movement & companionship",
    description: "A familiar outdoor rhythm, shaped around the pet and the day."
  },
  {
    slug: "home-pet-sitting",
    title: "Home pet sitting",
    eyebrow: "Care in familiar spaces",
    description: "Meals, water and routines handled with calm attention at home."
  },
  {
    slug: "dog-training",
    title: "Dog training",
    eyebrow: "Patient guidance",
    description: "Positive, consistent cues that help people and pets understand each other."
  },
  {
    slug: "pet-grooming",
    title: "Pet grooming",
    eyebrow: "Comfort-led grooming",
    description: "A composed grooming experience designed around gentleness and hygiene."
  },
  {
    slug: "veterinary-support",
    title: "Veterinary support",
    eyebrow: "Health support",
    description: "Thoughtful coordination when a pet needs professional clinical attention."
  },
  {
    slug: "premium-boarding",
    title: "Premium boarding",
    eyebrow: "A considered stay",
    description: "A comfortable setting for approved stays when home care is not the right fit."
  }
] as const;

export function HeroVideoShowcase() {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  const activeFilm = careFilms[activeIndex] ?? careFilms[0];
  const [hasVideo, setHasVideo] = useState(true);

  const selectFilm = useCallback((index: number) => {
    setProgress(0);
    setActiveIndex(index);
  }, []);

  const showNext = useCallback(() => {
    selectFilm((activeIndex + 1) % careFilms.length);
  }, [activeIndex, selectFilm]);

  const showPrevious = useCallback(() => {
    selectFilm((activeIndex - 1 + careFilms.length) % careFilms.length);
  }, [activeIndex, selectFilm]);

  useEffect(() => {
    const src = `/videos/${activeFilm.slug}.mp4?v=clean2026_v3`;
    setHasVideo(videoAssetExists(src));
  }, [activeFilm.slug]);

  // Handle changing videos
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (reduceMotion || userPaused.current) {
      video.pause();
      setIsPlaying(false);
      return;
    }

    try {
      video.load();
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    } catch {
      setIsPlaying(false);
    }
  }, [activeIndex, reduceMotion]);

  // Handle muting dynamically without reloading the video
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = isMuted;
      if (!isMuted) {
        video.volume = 1.0;
      }
    }
  }, [isMuted]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      userPaused.current = false;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    } else {
      userPaused.current = true;
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (!reduceMotion && !userPaused.current) showNext();
  };

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, x: 48, scale: 0.985 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.85, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto w-full max-w-xl lg:max-w-2xl lg:mr-0"
      data-motion-skip
    >
      <RotateOnScroll className="absolute -inset-8 -z-10 h-[calc(100%+4rem)] w-[calc(100%+4rem)]">
        <div className="h-full w-full rounded-[4rem] bg-gradient-to-br from-saffron/10 via-coral/5 to-indigo/10 blur-3xl" />
      </RotateOnScroll>

      <ParallaxScroll speed={0.05}>
        <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-ink shadow-2xl sm:rounded-[2.5rem]">
          <div className="relative">
            {hasVideo ? (
              <video
                key={activeFilm.slug}
                ref={videoRef}
                id="hero-care-film"
                className="block aspect-video h-auto w-full object-cover rounded-t-[2rem] sm:rounded-t-[2.5rem]"
                poster={`/videos/${activeFilm.slug}.jpg?v=clean2026_v3`}
                preload="auto"
                autoPlay
                muted={isMuted}
                playsInline
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={handleEnded}
                onTimeUpdate={(event) => {
                  const video = event.currentTarget;
                  setProgress(video.duration ? (video.currentTime / video.duration) * 100 : 0);
                }}
                aria-label={`${activeFilm.title} care film`}
                aria-describedby="hero-care-film-description"
              >
                <source src={`/videos/${activeFilm.slug}.mp4?v=clean2026_v3`} type="video/mp4" />
                Your browser does not support embedded video.
              </video>
            ) : (
              <div className="flex aspect-video items-center justify-center rounded-t-[2rem] bg-ink/90 text-center text-sm text-paper sm:rounded-t-[2.5rem]">
                <p className="max-w-sm px-6">The care film preview is currently unavailable, but the experience remains fully accessible.</p>
              </div>
            )}

            <div className="pointer-events-none absolute inset-0" />
            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-4 sm:p-6">
              <span className="flex items-center gap-2 rounded-2xl bg-ink/75 px-4 py-2 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-paper shadow-sm backdrop-blur-md">
                <PawPrint className="h-4 w-4 text-saffron" /> Six moments of care
              </span>
              <span className="rounded-full border border-paper/20 bg-ink/35 px-3 py-2 text-[0.62rem] font-bold tracking-[0.16em] text-paper/80 backdrop-blur-xl">
                {String(activeIndex + 1).padStart(2, "0")} / {String(careFilms.length).padStart(2, "0")}
              </span>
            </div>

            {!isPlaying ? (
              <button
                type="button"
                onClick={togglePlayback}
                className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-paper/30 bg-paper/90 text-ink shadow-soft transition hover:scale-105 hover:bg-paper focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-saffron/50"
                aria-label={`Play ${activeFilm.title} film`}
              >
                <Play className="ml-1 h-6 w-6 fill-current" />
              </button>
            ) : null}
          </div>

          <div className="border-t border-paper/10 bg-ink p-4 sm:p-5">
            <motion.div
              key={activeFilm.slug}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.42 }}
              className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="max-w-md text-paper">
                <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-saffron">{activeFilm.eyebrow}</p>
                <h2 className="mt-1.5 font-display text-2xl font-semibold leading-none sm:text-3xl">{activeFilm.title}</h2>
                <p id="hero-care-film-description" className="mt-2 hidden max-w-sm text-xs leading-5 text-paper/65 sm:block">
                  {activeFilm.description}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button type="button" onClick={showPrevious} className="hero-film-control" aria-label="Show previous care film">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button type="button" onClick={togglePlayback} className="hero-film-control" aria-label={isPlaying ? "Pause care film" : "Play care film"}>
                  {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="ml-0.5 h-4 w-4 fill-current" />}
                </button>
                <button type="button" onClick={() => setIsMuted((muted) => !muted)} className="hero-film-control" aria-label={isMuted ? "Turn care film sound on" : "Mute care film"}>
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
                <button type="button" onClick={showNext} className="hero-film-control" aria-label="Show next care film">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>

            <div className="mt-4 h-0.5 overflow-hidden rounded-full bg-paper/15" aria-hidden="true">
              <span className="block h-full rounded-full bg-saffron transition-[width] duration-150" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </ParallaxScroll>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3" role="tablist" aria-label="Choose a PetSaathi care film">
        {careFilms.map((film, index) => {
          const selected = index === activeIndex;
          return (
            <button
              key={film.slug}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="hero-care-film"
              onClick={() => selectFilm(index)}
              className={`group flex min-h-12 items-center gap-3 rounded-[1.25rem] border px-4 py-2.5 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-saffron/35 ${
                selected
                  ? "border-transparent bg-surface-container-lowest text-on-surface shadow-md"
                  : "border-transparent bg-surface-container-lowest/50 text-on-surface-variant hover:bg-surface-container-lowest/80"
              }`}
            >
              <span className={`h-2 w-2 shrink-0 rounded-full ${selected ? "bg-coral shadow-[0_0_0_5px_rgba(227,102,79,0.12)]" : "bg-ink/20 group-hover:bg-coral/60"}`} />
              <span className="text-[0.67rem] font-bold leading-4">{film.title}</span>
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-center text-[0.62rem] font-semibold text-ink/40">
        Service availability varies by city, care context and verified provider capacity.
      </p>
      <p className="sr-only" aria-live="polite">Now showing {activeFilm.title}.</p>
    </motion.div>
  );
}
