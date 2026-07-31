import { WifiOff } from "lucide-react";
import Link from "next/link";
import { PublicShell } from "@/components/marketing/public-shell";
import { buttonVariants } from "@/components/ui/button";

export default function OfflinePage() {
  return (
    <PublicShell>
      <div className="flex min-h-[70vh] flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="flex justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-saffron/20 text-saffron shadow-lifted">
              <WifiOff className="h-10 w-10" />
            </div>
          </div>
          <div>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink">You are offline</h1>
            <p className="mt-4 text-center text-lg leading-7 text-ink/70">
              It seems you&apos;ve lost your internet connection. We&apos;ll be right here when you get back online.
            </p>
          </div>
          <div className="flex justify-center pt-4">
            <Link
              href="/"
              className={buttonVariants({ variant: "primary", size: "lg" })}
            >
              Try again
            </Link>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
