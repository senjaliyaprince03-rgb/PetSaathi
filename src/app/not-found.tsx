import Link from "next/link";
import Image from "next/image";
import { PublicShell } from "@/components/marketing/public-shell";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <PublicShell>
      <div className="flex min-h-[70vh] flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center space-y-8">
          <div>
            <h1 className="mt-6 font-display text-5xl font-semibold tracking-tight text-ink">Page not found</h1>
            <p className="mt-4 text-center text-lg leading-7 text-ink/70">
              Oops! It seems you&apos;ve wandered off the trail. We couldn&apos;t find the page you&apos;re looking for.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="relative h-48 w-48 rounded-full overflow-hidden border-4 border-paper shadow-lifted bg-cream">
              <Image
                src="/images/petsaathi-lineart-mark.png"
                alt="Illustrated PetSaathi dog and cat companions"
                fill
                sizes="12rem"
                className="object-contain p-4 opacity-90"
              />
            </div>
          </div>
          <div className="flex justify-center pt-4">
            <Link
              href="/"
              className={buttonVariants({ variant: "primary", size: "lg" })}
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
