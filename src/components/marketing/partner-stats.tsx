import { ClipboardCheck, Compass, Headphones, ShieldCheck } from "lucide-react";

export function PartnerStatsBar() {
  return (
    <div className="border-t border-b border-indigo/10 bg-paper py-8">
      <div className="container-shell">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-indigo/10">
          <div className="flex flex-col items-center pt-3 sm:pt-0 px-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo/10 text-indigo mb-2">
              <Compass className="h-5 w-5" />
            </span>
            <span className="text-xl font-display font-bold text-indigo">Launching City by City</span>
            <span className="text-xs font-medium text-ink/80 mt-1 max-w-[220px]">Controlled local rollout with verified caregiver capacity</span>
          </div>
          <div className="flex flex-col items-center pt-4 sm:pt-0 px-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-coral-text/10 text-coral-text mb-2">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <span className="text-xl font-display font-bold text-coral-text">Verified Local Saathis</span>
            <span className="text-xs font-medium text-ink/80 mt-1 max-w-[220px]">Rigorous identity, address and background verification</span>
          </div>
          <div className="flex flex-col items-center pt-4 sm:pt-0 px-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf/10 text-leaf mb-2">
              <ClipboardCheck className="h-5 w-5" />
            </span>
            <span className="text-xl font-display font-bold text-leaf">Structured Care Records</span>
            <span className="text-xs font-medium text-ink/80 mt-1 max-w-[220px]">Live check-ins, photo updates, and detailed report cards</span>
          </div>
          <div className="flex flex-col items-center pt-4 sm:pt-0 px-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8C6212]/10 text-[#8C6212] mb-2">
              <Headphones className="h-5 w-5" />
            </span>
            <span className="text-xl font-display font-bold text-[#8C6212]">Human Support Desk</span>
            <span className="text-xs font-medium text-ink/80 mt-1 max-w-[220px]">Dedicated operational team monitoring every booking</span>
          </div>
        </div>
      </div>
    </div>
  );
}
