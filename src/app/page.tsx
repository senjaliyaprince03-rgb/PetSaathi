import { MarketingExperience } from "@/components/marketing/marketing-experience";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export const revalidate = 10;

export default function HomePage() {
  return <MarketingExperience footerContent={<MarketingFooter />} />;
}
