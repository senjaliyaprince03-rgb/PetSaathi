import { PawPrint } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-cream/95 backdrop-blur-xl" role="status" aria-label="Loading PetSaathi">
      <div className="text-center [perspective:800px]">
        <div className="relative mx-auto h-24 w-24 animate-[float_2.4s_ease-in-out_infinite] [transform-style:preserve-3d]">
          <div className="absolute inset-0 rotate-6 rounded-[2rem] bg-gradient-to-br from-coral to-saffron shadow-soft [transform:rotateY(-18deg)_rotateX(12deg)]" />
          <div className="absolute inset-2 flex items-center justify-center rounded-[1.6rem] border border-paper/50 bg-paper/20 text-paper backdrop-blur-sm [transform:translateZ(18px)]"><PawPrint className="h-10 w-10" strokeWidth={1.6} /></div>
        </div>
        <p className="mt-7 font-display text-2xl font-semibold tracking-[-0.035em]">PetSaathi</p>
        <p className="mt-2 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-indigo/55">Preparing thoughtful care</p>
      </div>
    </div>
  );
}
