import { Camera, CheckCircle2, HeartPulse, Scissors, Sparkles } from "lucide-react";

import { DashboardPanel } from "@/components/portal/dashboard-ui";

type GroomingReport = {
  servicesCompleted: string[];
  coatCondition: string;
  behaviour: string;
  skinObservations: string;
  productsUsed: string[];
  nextGroomingWindow?: string;
  beforePhotos?: string[];
  afterPhotos?: string[];
};

export function GroomingReportCard({ report }: { report: GroomingReport }) {
  return (
    <DashboardPanel tone="cream" className="overflow-hidden p-0 sm:p-0">
      <div className="bg-indigo/5 px-6 py-5 border-b border-indigo/10">
        <h3 className="flex items-center gap-2 font-display text-2xl font-semibold text-indigo">
          <Sparkles className="h-6 w-6" /> Grooming Report
        </h3>
        <p className="mt-1 text-sm text-ink/80">Observations and care details from the session</p>
      </div>

      <div className="p-6 grid gap-6 sm:grid-cols-2">
        <div className="space-y-4">
          <div>
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-coral">Assessment</p>
            <div className="mt-2 grid gap-2 text-sm">
              <p className="flex justify-between border-b border-ink/5 pb-2">
                <span className="text-ink/80">Coat Condition</span>
                <span className="font-semibold">{report.coatCondition}</span>
              </p>
              <p className="flex justify-between border-b border-ink/5 pb-2">
                <span className="text-ink/80">Behaviour</span>
                <span className="font-semibold">{report.behaviour}</span>
              </p>
              <p className="flex justify-between border-b border-ink/5 pb-2">
                <span className="text-ink/80">Skin Observations</span>
                <span className="font-semibold">{report.skinObservations}</span>
              </p>
            </div>
          </div>

          <div>
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-coral">Services Completed</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {report.servicesCompleted.map((service, idx) => (
                <li key={idx} className="flex items-center gap-1.5 rounded-full bg-paper px-3 py-1 text-xs font-semibold border border-ink/10">
                  <CheckCircle2 className="h-3.5 w-3.5 text-leaf" />
                  {service}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-coral">Products Used</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {report.productsUsed.map((product, idx) => (
                <span key={idx} className="rounded-md bg-cream border border-ink/5 px-2 py-1 text-xs text-ink/80">
                  {product}
                </span>
              ))}
            </div>
          </div>

          {report.nextGroomingWindow && (
            <div className="mt-4 rounded-2xl bg-saffron/10 p-4 border border-saffron/20">
              <p className="flex items-center gap-2 text-sm font-semibold text-saffron">
                <Scissors className="h-4 w-4" /> Next Recommended Grooming
              </p>
              <p className="mt-1 text-sm text-ink/80">{report.nextGroomingWindow}</p>
            </div>
          )}

          {(report.beforePhotos?.length || report.afterPhotos?.length) ? (
            <div>
              <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-coral flex items-center gap-1">
                <Camera className="h-3 w-3" /> Session Photos
              </p>
              <div className="mt-2 flex gap-3 overflow-x-auto pb-2">
                {report.beforePhotos?.map((url, idx) => (
                  <div key={`before-${idx}`} className="relative h-20 w-20 shrink-0 rounded-xl bg-ink/5 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="Before grooming" className="h-full w-full object-cover" />
                    <span className="absolute bottom-0 left-0 right-0 bg-ink/50 text-[10px] text-paper text-center py-0.5">Before</span>
                  </div>
                ))}
                {report.afterPhotos?.map((url, idx) => (
                  <div key={`after-${idx}`} className="relative h-20 w-20 shrink-0 rounded-xl bg-ink/5 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="After grooming" className="h-full w-full object-cover" />
                    <span className="absolute bottom-0 left-0 right-0 bg-leaf/80 text-[10px] text-paper text-center py-0.5">After</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </DashboardPanel>
  );
}
