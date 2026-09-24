"use client";

import React from "react";
import { PetCompanionIllustration } from "@/components/brand/pet-companion";

export default function LottiePetAnimation() {
  return (
    <div className="pointer-events-none drop-shadow-2xl flex items-center justify-center">
      <PetCompanionIllustration className="h-32 w-32 sm:h-52 sm:w-52" />
    </div>
  );
}
