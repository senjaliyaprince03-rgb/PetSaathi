import { redirect } from "next/navigation";
import { getCurrentIdentity } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const identity = await getCurrentIdentity();
  if (!identity) {
    redirect("/login");
  }
  return <>{children}</>;
}
