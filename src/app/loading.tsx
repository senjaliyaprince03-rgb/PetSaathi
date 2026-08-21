import { PetSaathiLogo } from "@/components/brand/logo";

export default function Loading() {
  return (
    <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-cream/95 backdrop-blur-md" role="status" aria-label="Loading PetSaathi">
      <div className="flex flex-col items-center justify-center animate-pulse">
        <PetSaathiLogo className="mb-6 scale-125" />
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-indigo/40 animate-[bounce_1s_infinite_0ms]" />
          <div className="h-1.5 w-1.5 rounded-full bg-indigo/40 animate-[bounce_1s_infinite_200ms]" />
          <div className="h-1.5 w-1.5 rounded-full bg-indigo/40 animate-[bounce_1s_infinite_400ms]" />
        </div>
      </div>
    </div>
  );
}
