import { MarketingExperience } from "@/components/marketing/marketing-experience";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export const revalidate = 3600; // Cache for 1 hour

export default function HomePage() {
  return <MarketingExperience footerContent={<MarketingFooter />} />;
}
