"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function SocietyJoinForm({ societyId }: { societyId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/customer/society/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ societyId }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          router.push(`/login?returnTo=${window.location.pathname}`);
          return;
        }
        setError(data.error || "Failed to join society");
        return;
      }
      setSuccess("Successfully joined the community!");
      router.refresh();
      // Optionally redirect to customer dashboard
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-xs text-ink/70">
        Clicking the button below will securely link your profile to this community. If you are not logged in, you will be prompted to sign in first.
      </p>
      
      {error && <p className="rounded-xl bg-coral/10 p-3 text-sm font-semibold text-coral">{error}</p>}
      {success && <p className="rounded-xl bg-leaf/10 p-3 text-sm font-semibold text-leaf">{success}</p>}
      
      <button 
        type="submit" 
        disabled={pending || success !== null} 
        className="mt-2 flex h-12 w-full items-center justify-center rounded-xl bg-indigo font-bold text-white transition hover:bg-indigo/90 disabled:opacity-50"
      >
        {pending ? <LoaderCircle className="h-5 w-5 animate-spin" /> : "Link My Account"}
      </button>
    </form>
  );
}
