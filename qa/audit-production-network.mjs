import https from "node:https";
import { performance } from "node:perf_hooks";

const PROD_BASE = "https://petsaathi-blue.vercel.app";

function fetchAsset(url) {
  return new Promise((resolve) => {
    const fullUrl = url.startsWith("http") ? url : PROD_BASE + url;
    const t0 = performance.now();
    const req = https.get(
      fullUrl,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          "Accept-Encoding": "gzip, deflate, br",
        },
        timeout: 10000,
      },
      (res) => {
        let len = 0;
        res.on("data", (c) => (len += c.length));
        res.on("end", () => {
          resolve({
            url,
            status: res.statusCode,
            duration: Math.round(performance.now() - t0),
            size: len,
            type: res.headers["content-type"],
            cache: res.headers["x-vercel-cache"] || "NONE",
            cacheControl: res.headers["cache-control"] || "",
            encoding: res.headers["content-encoding"] || "identity",
          });
        });
      }
    );
    req.on("error", (e) => resolve({ url, error: e.message }));
    req.on("timeout", () => {
      req.destroy();
      resolve({ url, error: "TIMEOUT" });
    });
  });
}

async function getHtml(path) {
  return new Promise((resolve) => {
    https.get(PROD_BASE + path, (res) => {
      let d = "";
      res.on("data", (c) => (d += c));
      res.on("end", () => resolve(d));
    });
  });
}

async function run() {
  console.log("================================================================================");
  console.log("   PETSAATHI PRODUCTION NETWORK & WATERFALL AUDIT (petsaathi-blue.vercel.app)   ");
  console.log("================================================================================\n");

  const fullHtml = await getHtml("/");

  // Regex extractions
  const scriptRegex = /<script[^>]*src=["']([^"']+)["'][^>]*>/gi;
  const cssRegex = /<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi;
  const preloadRegex = /<link[^>]*rel=["']preload["'][^>]*href=["']([^"']+)["'][^>]*>/gi;
  const imgRegex = /<img[^>]*src=["']([^"']+)["'][^>]*>/gi;
  const videoRegex = /<video[^>]*src=["']([^"']+)["'][^>]*>/gi;
  const sourceRegex = /<source[^>]*src=["']([^"']+)["'][^>]*>/gi;

  const scripts = [];
  let m;
  while ((m = scriptRegex.exec(fullHtml)) !== null) scripts.push(m[1]);
  const css = [];
  while ((m = cssRegex.exec(fullHtml)) !== null) css.push(m[1]);
  const preloads = [];
  while ((m = preloadRegex.exec(fullHtml)) !== null) preloads.push(m[1]);
  const imgs = [];
  while ((m = imgRegex.exec(fullHtml)) !== null) imgs.push(m[1]);
  const videos = [];
  while ((m = videoRegex.exec(fullHtml)) !== null) videos.push(m[1]);
  while ((m = sourceRegex.exec(fullHtml)) !== null) videos.push(m[1]);

  console.log("--- 1. Discovery on Home (/) ---");
  console.log(`Scripts in HTML: ${scripts.length}`);
  console.log(`Stylesheets: ${css.length}`);
  console.log(`Preload tags: ${preloads.length}`);
  console.log(`Images in markup: ${imgs.length}`);
  console.log(`Videos in markup: ${videos.length}`);

  console.log("\n--- 2. CSS Delivery & Cache Validation ---");
  for (const c of css) {
    const r = await fetchAsset(c);
    console.log(`[CSS] ${r.url.slice(-45).padEnd(45)} | Status: ${r.status} | Size: ${(r.size / 1024).toFixed(1)} KB | CDN: ${r.cache.padEnd(4)} | Time: ${r.duration}ms | Enc: ${r.encoding}`);
  }

  console.log("\n--- 3. JavaScript Chunks Delivery & Cache Validation ---");
  for (const s of scripts) {
    const r = await fetchAsset(s);
    console.log(`[JS]  ${r.url.slice(-45).padEnd(45)} | Status: ${r.status} | Size: ${(r.size / 1024).toFixed(1)} KB | CDN: ${r.cache.padEnd(4)} | Time: ${r.duration}ms | Enc: ${r.encoding}`);
  }

  console.log("\n--- 4. Preloaded Resources & Cache Validation ---");
  for (const p of preloads) {
    const r = await fetchAsset(p);
    console.log(`[PRELOAD] ${r.url.slice(-50).padEnd(50)} | Status: ${r.status} | Size: ${(r.size / 1024).toFixed(1)} KB | CDN: ${r.cache.padEnd(4)} | Time: ${r.duration}ms`);
  }

  console.log("\n--- 5. Key Image Assets Delivery & Optimization ---");
  const uniqueImgs = [...new Set(imgs)].slice(0, 10);
  for (let img of uniqueImgs) {
    img = img.replaceAll("&amp;", "&");
    const r = await fetchAsset(img);
    console.log(`[IMG] ${r.url.slice(-50).padEnd(50)} | Status: ${r.status} | Size: ${(r.size / 1024).toFixed(1)} KB | CDN: ${r.cache.padEnd(4)} | Time: ${r.duration}ms | Type: ${r.type}`);
  }

  console.log("\n--- 6. Video Assets Audit ---");
  if (videos.length > 0) {
    for (const v of videos) {
      const r = await fetchAsset(v);
      console.log(`[VIDEO] ${r.url} | Status: ${r.status} | Size: ${(r.size / 1024).toFixed(1)} KB | CDN: ${r.cache}`);
    }
  } else {
    console.log("Verified: No auto-downloading <video> or <source> elements in initial homepage HTML.");
  }
}

run().catch(console.error);
