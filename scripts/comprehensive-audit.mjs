import fetch from "node-fetch";

const base = "https://petsaathi-two.vercel.app";
const startPages = [
  "/",
  "/services",
  "/services/dog-walking",
  "/services/home-pet-sitting",
  "/services/boarding-beta",
  "/saathis",
  "/caregivers",
  "/become-a-saathi",
  "/safety",
  "/societies",
  "/membership",
  "/about",
  "/journal",
  "/contact",
  "/book",
  "/login",
  "/privacy",
  "/terms",
  "/refund-policy"
];

async function run() {
  const visited = new Set();
  const queue = [...startPages];
  const pageStatuses = [];
  const brokenLinks = [];
  const assetMap = new Map();

  while (queue.length > 0) {
    const path = queue.shift();
    if (visited.has(path)) continue;
    visited.add(path);

    try {
      const res = await fetch(base + path, { redirect: "manual" });
      const status = res.status;
      pageStatuses.push({ path, status });

      if (status >= 400) {
        brokenLinks.push({ path, status });
        continue;
      }

      if (status >= 300 && status < 400) {
        continue;
      }

      const html = await res.text();

      // Collect links
      const linkRegex = /href="(\/[^"'#\s?]+)/g;
      let match;
      while ((match = linkRegex.exec(html)) !== null) {
        const link = match[1];
        if (
          !link.startsWith("/_next") &&
          !link.startsWith("/api") &&
          !visited.has(link) &&
          !queue.includes(link)
        ) {
          queue.push(link);
        }
      }

      // Collect images
      const imgRegex = /src="([^"'\s]+)"/g;
      while ((match = imgRegex.exec(html)) !== null) {
        const src = match[1];
        if (!src.startsWith("data:")) {
          if (!assetMap.has(src)) {
            assetMap.set(src, [path]);
          } else {
            assetMap.get(src).push(path);
          }
        }
      }
    } catch (e) {
      brokenLinks.push({ path, error: e.message });
    }
  }

  console.log(`\n=== Crawled ${visited.size} Total Routes ===`);
  const brokenAssets = [];
  console.log(`\nTesting ${assetMap.size} unique image assets...`);
  
  for (const [src, pages] of assetMap.entries()) {
    // Next.js img URLs with &amp; should be cleaned to &
    const cleanSrc = src.replace(/&amp;/g, "&");
    const fullUrl = cleanSrc.startsWith("http") ? cleanSrc : (base + cleanSrc);
    try {
      const res = await fetch(fullUrl, { method: "HEAD" });
      if (res.status >= 400) {
        brokenAssets.push({ src: cleanSrc, status: res.status, usedOn: pages.slice(0, 3) });
      }
    } catch (err) {
      brokenAssets.push({ src: cleanSrc, error: err.message, usedOn: pages.slice(0, 3) });
    }
  }

  console.log("\n=== BROKEN LINKS ===");
  if (brokenLinks.length === 0) {
    console.log("None! All crawled links are valid.");
  } else {
    console.table(brokenLinks);
  }

  console.log("\n=== BROKEN ASSETS ===");
  if (brokenAssets.length === 0) {
    console.log("None! All image assets load with 200 OK.");
  } else {
    console.table(brokenAssets);
  }

  console.log("\n=== ROUTE STATUS SUMMARY ===");
  for (const item of pageStatuses) {
    console.log(`${item.status} ${item.path}`);
  }
}

run();
