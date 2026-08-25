import { MarketingExperience } from "@/components/marketing/marketing-experience";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export default function HomePage() {
  // Footer renders on the server: its markup ships as HTML, not client JS.
  return <MarketingExperience footerContent={<MarketingFooter />} />;
}
