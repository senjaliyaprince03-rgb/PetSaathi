import { redirect } from "next/navigation";
import { getCurrentIdentity } from "@/modules/auth/session";
import { prisma } from "@/lib/db";
import SaathiDashboardClient from "./SaathiDashboardClient";

export default async function SaathiDashboardPage() {
  const identity = await getCurrentIdentity();
  if (!identity) redirect("/login?returnTo=/saathi");
  if (!identity.roles.includes("SITTER")) {
    if (identity.roles.includes("CUSTOMER")) redirect("/dashboard");
    if (identity.roles.includes("SUPER_ADMIN") || identity.roles.includes("OPERATIONS_ADMIN")) redirect("/admin");
    redirect("/login");
  }

  const firstName = identity.displayName.split(" ")[0] || "there";
  const initialChar = identity.displayName[0] || "S";

  // Fetch real assignment data
  const assignments = await prisma.bookingAssignment.findMany({
    where: { sitterId: identity.id },
    include: { booking: true }
  });

  const completedCount = assignments.filter(a => a.booking.status === "COMPLETED").length;
  const upcomingCount = assignments.filter(a => a.booking.status === "CONFIRMED" || a.booking.status === "REQUESTED").length;

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

