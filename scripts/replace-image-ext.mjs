import fs from "fs";
import path from "path";

const optimizedImages = [
  "avatar-1", "avatar-2", "avatar-3", "care-handover-courtyard",
  "care-protocol-constellation", "custom-hero-new", "dog-boarding-3d",
  "dog-walking-3d", "golden-retriever-3d", "hero-care-handover-highres",
  "hero-care-handover", "hero-couple-dog", "hero-dog-woman",
  "journal-hero-luxury-banner", "login-pet-companion", "membership-hero-luxury-banner",
  "pet-sitter-3d", "petsaathi-logo-mark-colored", "petsaathi-logo-master-official",
  "petsaathi-logo", "privacy-stage-illustration", "proposal_home_care_v2",
  "proposal_walks_v2", "saathis-hero-luxury-banner", "safety-hero-luxury-banner",
  "service-dog-training", "service-dog-walking", "service-pet-boarding",
  "service-pet-grooming", "service-pet-sitting", "service-vet-care",
  "services-hero-luxury-banner", "services-section-background",
  "service_dog_walking_v2", "service_pet_sitting_v2", "sitter-man-cinematic",
  "sitter-park-cinematic", "sitter-woman-cinematic", "societies-hero-luxury-banner"
];

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");
  let modified = false;
  
  for (const img of optimizedImages) {
    const pngPattern = new RegExp(`${img}\\.png`, "g");
    if (pngPattern.test(content)) {
      content = content.replace(pngPattern, `${img}.webp`);
      modified = true;
    }
    const jpgPattern = new RegExp(`${img}\\.jpg`, "g");
    if (jpgPattern.test(content)) {
      content = content.replace(jpgPattern, `${img}.webp`);
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, "utf-8");
    console.log(`Updated ${filePath}`);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith(".tsx") || fullPath.endsWith(".ts")) {
      replaceInFile(fullPath);
    }
  }
}

walk(path.join(process.cwd(), "src"));
