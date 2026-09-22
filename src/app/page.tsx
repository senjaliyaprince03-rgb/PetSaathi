import { MarketingExperience } from "@/components/marketing/marketing-experience";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function HomePage() {
  return <MarketingExperience footerContent={<MarketingFooter />} />;
}
