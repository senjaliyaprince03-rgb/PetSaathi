"use client";

import dynamic from "next/dynamic";

export const LazyAnimatedLogo = dynamic(() => import("@/components/3d/animated-logo").then(mod => mod.AnimatedLogo), {
  ssr: false,
  loading: () => <div className="h-11 w-11 animate-pulse bg-indigo/5 rounded-full" />
});
