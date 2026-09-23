"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { PetCompanionIllustration } from "@/components/brand/pet-companion";

// Lazy-load Lottie without blocking first render
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function LottiePetAnimation() {
  const [lottieData, setLottieData] = useState<any>(null);
  const [hasLottieError, setHasLottieError] = useState(false);

  useEffect(() => {
    // Dynamically fetch cleaned animation JSON in background
    import("../../../public/images/lottie-pet.json")
      .then((mod) => setLottieData(mod.default || mod))
      .catch(() => setHasLottieError(true));
  }, []);

  if (hasLottieError || !lottieData) {
    // Instant, beautiful vector companion fallback: zero delay, zero eval, zero CSP risk
    return <PetCompanionIllustration className="h-28 w-28 sm:h-52 sm:w-52" />;
  }

  return (
    <div className="pointer-events-none h-28 w-28 drop-shadow-2xl sm:h-52 sm:w-52 flex items-center justify-center">
      <Lottie
        animationData={lottieData}
        loop={true}
        onError={() => setHasLottieError(true)}
      />
    </div>
  );
}
