import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/cn";

export function PetSaathiLogo({ className, compact = false, inverted = false }: { className?: string; compact?: boolean; inverted?: boolean }) {
  if (inverted) {
    return (
      <Link href="/" className={cn("group inline-flex shrink-0 items-center transition-transform hover:scale-[1.02]", className)} aria-label="Pet Saathi home">
        <div className="rounded-xl bg-white px-5 py-2.5 shadow-md">
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
