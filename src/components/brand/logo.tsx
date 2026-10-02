import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/cn";

export type LogoSize = "compact" | "default" | "large" | "xl";

export function PetSaathiLogo({ 
  className, 
  imageClassName,
  compact = false, 
  size,
  inverted = false, 
  href = "/" 
}: { 
  className?: string; 
  imageClassName?: string;
  compact?: boolean; 
  size?: LogoSize;
  inverted?: boolean; 
  href?: string; 
}) {
  const resolvedSize: LogoSize = size ?? (compact ? "compact" : "default");

  const invertedHeightClasses: Record<LogoSize, string> = {
    compact: "h-8 sm:h-8",
    default: "h-10 sm:h-11",
    large: "h-14 sm:h-16",
    xl: "h-16 sm:h-20",
  };

  const standardHeightClasses: Record<LogoSize, string> = {
    compact: "h-9 sm:h-9",
    default: "h-11 sm:h-12 md:h-13",
    large: "h-14 sm:h-16",
    xl: "h-16 sm:h-20",
  };

  const sizesAttr: Record<LogoSize, string> = {
    compact: "140px",
    default: "220px",
    large: "320px",
    xl: "400px",
  };

  if (inverted) {
    return (
      <Link 
        href={href as any} 
        className={cn(
          "group inline-flex shrink-0 items-center rounded-2xl bg-white px-3.5 py-1.5 shadow-sm transition-all duration-200 hover:bg-white/95 hover:shadow-md hover:scale-[1.02]", 
          className
        )} 
        aria-label="PetSaathi Home"
      >
        <Image
          src="/images/petsaathi-logo-master-official.png"
          alt="PetSaathi — Since 2026"
          width={890}
          height={340}
          sizes={sizesAttr[resolvedSize]}
          style={{ aspectRatio: "890 / 340" }}
          className={cn(
            "w-auto object-contain",
            invertedHeightClasses[resolvedSize],
            imageClassName
          )} 
          priority 
          fetchPriority="high" 
        />
      </Link>
    );
  }

  return (
    <Link 
      href={href as any} 
      className={cn("group inline-flex shrink-0 items-center transition-transform hover:scale-[1.02]", className)} 
      aria-label="PetSaathi Home"
    >
      <Image
        src="/images/petsaathi-logo-official-hd.png"
        alt="PetSaathi — Since 2026"
        width={910}
        height={312}
        sizes={sizesAttr[resolvedSize]}
        style={{ aspectRatio: "910 / 312" }}
        className={cn(
          "w-auto object-contain",
          standardHeightClasses[resolvedSize],
          imageClassName
        )} 
        priority 
        fetchPriority="high" 
      />
    </Link>
  );
}
