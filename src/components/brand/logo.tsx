import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/cn";

export function PetSaathiLogo({ className, compact = false, inverted = false }: { className?: string; compact?: boolean; inverted?: boolean }) {
  return (
    <Link href="/" className={cn("group inline-flex shrink-0 items-center gap-3", className)} aria-label="Pet Saathi home">
      <span className={cn("relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[1.15rem] transition duration-300 group-hover:-translate-y-0.5", inverted && "bg-paper/95 ring-1 ring-paper/15")}>
        <Image
          src="/images/petsaathi-logo-mark.png"
          alt=""
          width={202}
          height={209}
          sizes="48px"
          className="h-[2.9rem] w-auto object-contain"
          priority
        />
      </span>
      {!compact && (
        <span className="relative hidden h-10 w-[8.55rem] min-[420px]:block">
          <Image
            src="/images/petsaathi-logo-wordmark.png"
            alt=""
            fill
            sizes="137px"
            className={cn("object-contain object-left", inverted && "brightness-0 invert")}
            priority
          />
        </span>
      )}
    </Link>
  );
}
