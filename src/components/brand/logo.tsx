import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/cn";

export function PetSaathiLogo({ 
  className, 
  compact = false, 
  inverted = false, 
  href = "/" 
}: { 
  className?: string; 
  compact?: boolean; 
  inverted?: boolean; 
  href?: string; 
}) {
  return (
    <Link 
      href={href as any} 
      className={cn("group inline-flex shrink-0 items-center transition-transform hover:scale-[1.02]", className)} 
      aria-label="PetSaathi Home"
    >
      <Image
        src={inverted ? "/images/petsaathi-logo-horizontal-inverted.png" : "/images/petsaathi-logo-official-hd.png"}
        alt="PetSaathi — Since 2026"
        width={910}
        height={312}
        sizes={compact ? "140px" : "220px"}
        className={cn(
          "w-auto object-contain transition-all duration-200",
          compact ? "h-9 sm:h-9" : "h-11 sm:h-12 md:h-13"
        )} priority fetchPriority="high" />
    </Link>
  );
}
