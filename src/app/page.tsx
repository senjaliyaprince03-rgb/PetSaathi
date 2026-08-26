import { MarketingExperience } from "@/components/marketing/marketing-experience";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { getCurrentIdentity } from "@/modules/auth/session";

export default async function HomePage() {
  const identity = await getCurrentIdentity();
  return <MarketingExperience currentUser={identity} footerContent={<MarketingFooter />} />;
}
