import fs from "fs";
import path from "path";

const targets = [
  "src/app/not-found.tsx",
  "src/app/(portal)/customer/wallet/page.tsx",
  "src/app/caregivers/page.tsx",
  "src/app/journal/page.tsx",
  "src/app/membership/page.tsx",
  "src/app/safety/page.tsx",
  "src/app/services/page.tsx",
  "src/app/societies/page.tsx",
  "src/components/brand/logo.tsx",
  "src/components/marketing/marketing-experience.tsx",
  "src/components/motion/parallax-totem-background.tsx"
];

for (const target of targets) {
  const filePath = path.join(process.cwd(), target);
  let content = fs.readFileSync(filePath, "utf-8");
  
  // Replace priority alone inside <Image ...>
  // We look for spaces around it to be safe
  content = content.replace(/\s+priority\s+/g, ' priority fetchPriority="high" ');
  content = content.replace(/\n\s*priority\n/g, '\n              priority fetchPriority="high"\n');
  content = content.replace(/priority(\s+sizes)/g, 'priority fetchPriority="high"$1');
  
  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`Added fetchPriority to ${target}`);
}
