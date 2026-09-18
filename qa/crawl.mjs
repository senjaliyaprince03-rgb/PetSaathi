import fs from "fs";

const BASE_ORIGIN = "http://localhost:3000";
const MAX_DEPTH = 4;

const visited = new Set();
const queue = [{ url: `${BASE_ORIGIN}/`, depth: 0 }];
const results = [];
const imageCache = new Map();

function normalizeUrl(rawUrl, currentUrl) {
  try {
    const parsed = new URL(rawUrl, currentUrl);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    if (parsed.host !== "localhost:3000" && parsed.host !== "127.0.0.1:3000") return null;
    parsed.hash = "";
    // Keep query strings for services/topics if relevant, or normalize
    let clean = parsed.origin + parsed.pathname;
    if (parsed.search) clean += parsed.search;
    return clean;
  } catch {
    return null;
  }
}

function extractHrefLinks(html, currentUrl) {
  const links = new Set();
  const hrefRegex = /href=["']([^"']+)["']/gi;
  let match;
  while ((match = hrefRegex.exec(html)) !== null) {
    const raw = match[1].trim();
    if (!raw) continue;
    if (raw.startsWith("mailto:") || raw.startsWith("tel:") || raw.includes("wa.me")) continue;
    if (raw.startsWith("javascript:") || raw.startsWith("#")) continue;
    const normalized = normalizeUrl(raw, currentUrl);
    if (normalized) links.add(normalized);
  }
  return Array.from(links);
}

function extractTagContent(html, regex) {
  const match = regex.exec(html);
  return match ? match[1].trim() : null;
}

async function checkImageContentType(imageUrl) {
  if (!imageUrl) return { ok: false, error: "Missing og:image" };
  try {
    let resolvedUrl = imageUrl;
    if (imageUrl.startsWith("/")) {
      resolvedUrl = `${BASE_ORIGIN}${imageUrl}`;
    }
    if (imageCache.has(resolvedUrl)) return imageCache.get(resolvedUrl);

    const res = await fetch(resolvedUrl, { method: "HEAD" });
    const ctype = res.headers.get("content-type") || "";
    const isImage = res.ok && ctype.startsWith("image/");
    const result = { ok: isImage, status: res.status, contentType: ctype };
    imageCache.set(resolvedUrl, result);
    return result;
  } catch (err) {
    const result = { ok: false, error: err.message };
    imageCache.set(imageUrl, result);
    return result;
  }
}

async function crawl() {
  console.log(`Starting crawl from ${BASE_ORIGIN} (max depth: ${MAX_DEPTH})...`);

  while (queue.length > 0) {
    const { url, depth } = queue.shift();
    if (visited.has(url)) continue;
    visited.add(url);

    const start = performance.now();
    let status = null;
    let redirectTarget = null;
    let html = "";

    try {
      const response = await fetch(url, {
        redirect: "manual",
        headers: {
          "User-Agent": "PetSaathi-CrawlBot/1.0",
          Accept: "text/html,application/xhtml+xml",
        },
      });

      status = response.status;
      const durationMs = Math.round(performance.now() - start);

      if (status >= 300 && status < 400) {
        redirectTarget = response.headers.get("location");
        results.push({
          url,
          status,
          redirectTarget,
          title: null,
          description: null,
          canonical: null,
          ogImage: null,
          ogUrl: null,
          durationMs,
          imageStatus: null,
        });

        if (redirectTarget && depth < MAX_DEPTH) {
          const normRedirect = normalizeUrl(redirectTarget, url);
          if (normRedirect && !visited.has(normRedirect)) {
            queue.push({ url: normRedirect, depth: depth + 1 });
          }
        }
        continue;
      }

      html = await response.text();

      const titleMatch = /<title[^>]*>([^<]*)<\/title>/i.exec(html);
      const title = titleMatch ? titleMatch[1].trim() : null;

      const descMatch = /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i.exec(html)
        || /<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i.exec(html);
      const description = descMatch ? descMatch[1].trim() : null;

      const canMatch = /<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i.exec(html)
        || /<link\s+href=["']([^"']*)["']\s+rel=["']canonical["']/i.exec(html);
      const canonical = canMatch ? canMatch[1].trim() : null;

      const ogImageMatch = /<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/i.exec(html)
        || /<meta\s+content=["']([^"']*)["']\s+property=["']og:image["']/i.exec(html);
      const ogImage = ogImageMatch ? ogImageMatch[1].trim() : null;

      const ogUrlMatch = /<meta\s+property=["']og:url["']\s+content=["']([^"']*)["']/i.exec(html)
        || /<meta\s+content=["']([^"']*)["']\s+property=["']og:url["']/i.exec(html);
      const ogUrl = ogUrlMatch ? ogUrlMatch[1].trim() : null;

      const imageCheck = await checkImageContentType(ogImage);

      results.push({
        url,
        status,
        redirectTarget,
        title,
        description,
        canonical,
        ogImage,
        ogUrl,
        durationMs,
        imageCheck,
      });

      console.log(`[${status}] (${durationMs}ms) ${url} - Title: ${title?.slice(0, 30) || "NONE"}`);

      if (depth < MAX_DEPTH) {
        const foundLinks = extractHrefLinks(html, url);
        for (const link of foundLinks) {
          if (!visited.has(link) && !queue.some((item) => item.url === link)) {
            queue.push({ url: link, depth: depth + 1 });
          }
        }
      }
    } catch (err) {
      results.push({
        url,
        status: "ERROR",
        error: err.message,
        durationMs: Math.round(performance.now() - start),
      });
      console.error(`ERROR fetching ${url}:`, err.message);
    }
  }

  // Flags analysis
  console.log("\n=======================================================");
  console.log("=== CRAWL ANALYSIS & FLAGGED FINDINGS ===");
  console.log(`Total Pages Crawled: ${results.length}`);

  const non200 = results.filter((r) => r.status !== 200);
  console.log(`\n1. NON-200 RESPONSES (${non200.length}):`);
  non200.forEach((r) => console.log(`   [${r.status}] ${r.url} -> Redirect: ${r.redirectTarget || "N/A"}`));

  const titles = new Map();
  results.forEach((r) => {
    if (r.title) {
      if (!titles.has(r.title)) titles.set(r.title, []);
      titles.get(r.title).push(r.url);
    }
  });
  const dupTitles = Array.from(titles.entries()).filter(([t, urls]) => urls.length > 1);
  console.log(`\n2. DUPLICATE TITLES (${dupTitles.length}):`);
  dupTitles.forEach(([t, urls]) => {
    console.log(`   "${t}" on ${urls.length} pages:`);
    urls.forEach((u) => console.log(`      - ${u}`));
  });

  const missingMeta = results.filter((r) => r.status === 200 && (!r.title || !r.description || !r.canonical || !r.ogImage));
  console.log(`\n3. MISSING METADATA ON STATUS 200 PAGES (${missingMeta.length}):`);
  missingMeta.forEach((r) => {
    const missing = [];
    if (!r.title) missing.push("title");
    if (!r.description) missing.push("description");
    if (!r.canonical) missing.push("canonical");
    if (!r.ogImage) missing.push("ogImage");
    console.log(`   ${r.url} -> Missing: ${missing.join(", ")}`);
  });

  const badCanonical = results.filter((r) => {
    if (!r.canonical) return false;
    try {
      const parsed = new URL(r.canonical);
      return parsed.host !== "localhost:3000" && parsed.host !== "petsaathi.in" && parsed.host !== "petsaathi-two.vercel.app";
    } catch {
      return true;
    }
  });
  console.log(`\n4. CANONICALS POINTING TO FOREIGN/STALE DOMAINS (${badCanonical.length}):`);
  badCanonical.forEach((r) => console.log(`   ${r.url} -> Canonical: ${r.canonical}`));

  const brokenOgImage = results.filter((r) => r.status === 200 && r.ogImage && !r.imageCheck?.ok);
  console.log(`\n5. BROKEN OG:IMAGE URLS (${brokenOgImage.length}):`);
  brokenOgImage.forEach((r) => console.log(`   ${r.url} -> og:image: ${r.ogImage} (Status: ${r.imageCheck?.status}, ContentType: ${r.imageCheck?.contentType})`));

  fs.writeFileSync("qa/crawl-results.json", JSON.stringify(results, null, 2));
  console.log("\nFull crawl results written to qa/crawl-results.json");
}

crawl();
