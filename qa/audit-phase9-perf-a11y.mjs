import fs from "node:fs";
import path from "node:path";

const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:3000";

async function auditPhase9() {
  console.log("================================================================================");
  console.log("         PETSAATHI QA AUDIT — PHASE 9: PERFORMANCE & ACCESSIBILITY              ");
  console.log("================================================================================");

  // ---------------------------------------------------------------------------
  // 1. Bundle Size Analysis (.next/static/chunks)
  // ---------------------------------------------------------------------------
  console.log("\n--- 1. Client Bundle Size Analysis ---");
  const chunksDir = path.resolve(".next/static/chunks");
  let chunks = [];

  function scanChunks(dir) {
    if (!fs.existsSync(dir)) return;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) scanChunks(p);
      else if (e.name.endsWith(".js")) {
        const stats = fs.statSync(p);
        chunks.push({
          file: path.relative(process.cwd(), p),
          sizeKb: (stats.size / 1024).toFixed(1),
          rawSize: stats.size,
        });
      }
    }
  }
  scanChunks(chunksDir);

  chunks.sort((a, b) => b.rawSize - a.rawSize);
  console.log(`Found ${chunks.length} client JavaScript chunks.`);
  console.log("Top 10 largest client JS chunks:");
  const top10 = chunks.slice(0, 10);
  console.table(top10.map((c) => ({ File: c.file, "Size (KB)": c.sizeKb })));

  const oversizedChunks = chunks.filter((c) => c.rawSize > 500 * 1024);
  console.log(`Chunks exceeding recommended 500 KB limit: ${oversizedChunks.length}`);

  // ---------------------------------------------------------------------------
  // 2. Image Asset Audit (Public & Next.js Images)
  // ---------------------------------------------------------------------------
  console.log("\n--- 2. Image Optimization & Format Audit ---");
  const publicImgDir = path.resolve("public/images");
  let images = [];

  if (fs.existsSync(publicImgDir)) {
    for (const file of fs.readdirSync(publicImgDir)) {
      const p = path.join(publicImgDir, file);
      const stats = fs.statSync(p);
      images.push({
        file,
        sizeKb: (stats.size / 1024).toFixed(1),
        rawSize: stats.size,
        ext: path.extname(file).toLowerCase(),
      });
    }
  }

  images.sort((a, b) => b.rawSize - a.rawSize);
  console.log(`Found ${images.length} images in public/images.`);
  console.log("Top 10 largest image files:");
  console.table(images.slice(0, 10).map((img) => ({ File: img.file, "Size (KB)": img.sizeKb, Ext: img.ext })));

  const heavyImages = images.filter((img) => img.rawSize > 1024 * 1024); // > 1MB
  console.log(`Images exceeding 1 MB in size: ${heavyImages.length}`);

  // Also scan source code for raw unoptimized <img> tags instead of next/image
  function getSrcFiles(dir) {
    let files = [];
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory() && e.name !== "node_modules" && e.name !== ".next") {
        files = files.concat(getSrcFiles(p));
      } else if (e.name.endsWith(".tsx")) {
        files.push(p);
      }
    }
    return files;
  }

  const tsxFiles = getSrcFiles("src");
  const rawImgTags = [];

  for (const file of tsxFiles) {
    const code = fs.readFileSync(file, "utf8");
    const lines = code.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes("<img ") && !lines[i].includes("//")) {
        rawImgTags.push({
          file: path.relative(process.cwd(), file),
          line: i + 1,
          snippet: lines[i].trim(),
        });
      }
    }
  }
  console.log(`Raw unoptimized <img> elements found in React components: ${rawImgTags.length}`);
  if (rawImgTags.length > 0) {
    console.log("Sample raw <img> elements:", rawImgTags.slice(0, 5));
  }

  // ---------------------------------------------------------------------------
  // 3. Accessibility (a11y) & Semantic Markup Audit
  // ---------------------------------------------------------------------------
  console.log("\n--- 3. Accessibility & Semantic Markup Audit ---");

  const routesToTest = ["/", "/services", "/book", "/cities/ahmedabad", "/login", "/contact"];
  const a11yIssues = [];

  for (const route of routesToTest) {
    const html = await fetch(`${BASE_URL}${route}`).then((r) => r.text());

    // 3.1 Missing alt on img elements in rendered HTML
    const imgMatches = html.match(/<img[^>]*>/gi) || [];
    for (const img of imgMatches) {
      if (!img.includes('alt="') && !img.includes("alt='")) {
        a11yIssues.push({ route, issue: "Missing alt attribute on img", element: img.slice(0, 80) });
      }
    }

    // 3.2 Form inputs without labels or aria-label
    const inputMatches = html.match(/<input[^>]*>/gi) || [];
    for (const input of inputMatches) {
      const isHiddenOrSubmit = input.includes('type="hidden"') || input.includes('type="submit"') || input.includes('type="button"');
      if (!isHiddenOrSubmit) {
        const hasAriaLabel = input.includes("aria-label") || input.includes("aria-labelledby");
        const hasId = input.includes('id="');
        if (!hasAriaLabel && !hasId) {
          a11yIssues.push({ route, issue: "Input missing label/id association or aria-label", element: input.slice(0, 80) });
        }
      }
    }

    // 3.3 Missing or empty page title
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    if (!titleMatch || !titleMatch[1].trim()) {
      a11yIssues.push({ route, issue: "Missing or empty <title> element" });
    }

    // 3.4 Buttons without text or aria-label
    const buttonMatches = html.match(/<button[^>]*>[\s\S]*?<\/button>/gi) || [];
    for (const btn of buttonMatches) {
      const textContent = btn.replace(/<[^>]+>/g, "").trim();
      const hasAriaLabel = btn.includes("aria-label");
      if (!textContent && !hasAriaLabel) {
        a11yIssues.push({ route, issue: "Empty button lacking visible text and aria-label", element: btn.slice(0, 80) });
      }
    }
  }

  console.log(`Found ${a11yIssues.length} accessibility compliance issues across key routes.`);
  if (a11yIssues.length > 0) {
    console.log("Sample accessibility issues (first 10):", a11yIssues.slice(0, 10));
  }

  // ---------------------------------------------------------------------------
  // 4. Mobile Viewport & Responsive Markup Audit
  // ---------------------------------------------------------------------------
  console.log("\n--- 4. Mobile Viewport & CSS Overflow Audit ---");
  const homeHtml = await fetch(`${BASE_URL}/`).then((r) => r.text());
  const hasViewportMeta = homeHtml.includes('name="viewport"');
  console.log("Viewport meta tag present in HTML:", hasViewportMeta);

  // Check for hardcoded pixel widths in CSS or JSX that exceed mobile screen (375px)
  const hardcodedWidths = [];
  for (const file of tsxFiles) {
    const code = fs.readFileSync(file, "utf8");
    const matches = code.match(/w-\[\d{3,4}px\]|min-w-\[\d{3,4}px\]|width:\s*['"]\d{3,4}px['"]/g);
    if (matches) {
      for (const m of matches) {
        const num = parseInt(m.match(/\d+/)?.[0] || "0", 10);
        if (num > 375 && !code.includes("overflow-x-auto") && !code.includes("overflow-x-scroll")) {
          hardcodedWidths.push({ file: path.relative(process.cwd(), file), match: m, width: num });
        }
      }
    }
  }
  console.log(`Hardcoded CSS widths exceeding 375px: ${hardcodedWidths.length}`);
  if (hardcodedWidths.length > 0) {
    console.log("Sample hardcoded fixed widths > 375px:", hardcodedWidths.slice(0, 10));
  }

  console.log("================================================================================");
}

auditPhase9().catch(console.error);
