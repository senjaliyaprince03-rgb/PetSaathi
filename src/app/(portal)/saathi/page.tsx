import type { Route } from "next";
import { redirect } from "next/navigation";
import { getCurrentIdentity } from "@/modules/auth/session";
import { prisma } from "@/lib/db";
import { getDefaultDashboardForRoles } from "@/modules/auth/admin-access";
import SaathiDashboardClient from "./SaathiDashboardClient";

export default async function SaathiDashboardPage() {
  const identity = await getCurrentIdentity();
  if (!identity) redirect("/login?returnTo=/saathi");
  if (!identity.roles.includes("SITTER")) {
    redirect(getDefaultDashboardForRoles(identity.roles) as Route);
  }

  const firstName = identity.displayName.split(" ")[0] || "there";
  const initialChar = identity.displayName[0] || "S";

  // Fetch real assignment data safely
  let assignments: any[] = [];
  try {
    assignments = await prisma.bookingAssignment.findMany({
      where: { sitterId: identity.id },
      take: 100,
      include: { booking: true }
    }).catch(() => []);
  } catch (error) {
    console.error("[SaathiDashboardPage] Failed to fetch assignments:", error);
  }

  const completedCount = assignments.filter((a: any) => a?.booking?.status === "COMPLETED").length;
  const upcomingCount = assignments.filter((a: any) => a?.booking?.status === "CONFIRMED" || a?.booking?.status === "REQUESTED").length;

  return (
    <SaathiDashboardClient 
      displayName={identity.displayName}
      firstName={firstName} 
      initialChar={initialChar}
      completedCount={completedCount}
      upcomingCount={upcomingCount}
    />
  );
}

