import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/cn";

export function PetSaathiLogo({ className, compact = false, inverted = false }: { className?: string; compact?: boolean; inverted?: boolean }) {
  if (inverted) {
    return (
      <Link href="/" className={cn("group inline-flex shrink-0 items-center transition-transform hover:scale-[1.02]", className)} aria-label="Pet Saathi home">
        <div className="flex items-center gap-3 rounded-full border border-saffron/35 bg-paper px-6 py-2.5 shadow-lifted">
          <Image
            src="/images/petsaathi-lineart-mark.png"
            alt="PetSaathi"
            width={44}
            height={38}
            className="h-7 w-auto shrink-0 object-contain"
          />
          <div className="flex flex-col text-left whitespace-nowrap">
            <span className="font-display text-sm font-bold tracking-tight text-ink">PETSAATHI</span>
            <span className="text-[0.55rem] font-bold uppercase tracking-[0.22em] text-coral font-outfit">SINCE 2026</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href="/" className={cn("group inline-flex shrink-0 items-center transition-transform hover:scale-[1.02]", className)} aria-label="Pet Saathi home">
      <Image
        src="/images/petsaathi-logo-horizontal-brand.png"
        alt="PetSaathi — Since 2026"
        width={443}
        height={160}
        sizes={compact ? "130px" : "220px"}
        className={cn(
          "h-11 w-auto object-contain transition duration-300 sm:h-12",
          compact && "h-9 sm:h-9"
        )}
        priority
      />
    </Link>
  );
}
