"use client";

import Lottie from "lottie-react";

import lottiePet from "../../../public/images/lottie-pet.json";

// Isolated so the lottie runtime + animation JSON land in their own async
// chunk instead of the login route's first-load bundle.
export default function LottiePetAnimation() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <Lottie animationData={lottiePet} loop style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
