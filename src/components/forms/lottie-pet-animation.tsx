"use client";

import Lottie from "lottie-react";

import lottiePet from "../../../public/images/lottie-pet.json";

// Isolated so the lottie runtime + animation JSON land in their own async
// chunk instead of the login route's first-load bundle.
export default function LottiePetAnimation() {
  return (
    <div className="pointer-events-none h-28 w-28 drop-shadow-2xl sm:mb-4 sm:h-64 sm:w-64">
      <Lottie animationData={lottiePet} loop />
    </div>
  );
}
