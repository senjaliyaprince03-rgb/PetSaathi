import fetch from "node-fetch";

const routes = [
  "/",
  "/services",
  "/caregivers",
  "/become-a-saathi",
  "/safety",
  "/societies",
  "/membership",
  "/about",
  "/journal",
  "/contact",
  "/login",
  "/book"
];

async function checkImages() {
  const allImages = new Set();
  for (const r of routes) {
    try {
      const res = await globalThis.fetch("https://petsaathi-two.vercel.app" + r);
      const html = await res.text();
      const matches = html.matchAll(/(\/_next\/image\?url=[^"'\s&]+|\/images\/[^"'\s]+|\/icons\/[^"'\s]+|\/videos\/[^"'\s]+)/g);
      for (const m of matches) {
        allImages.add(m[1].split("&")[0]); // clean base url
      }
    } catch (err) {
      console.error("Failed to fetch route:", r, err.message);
    }
  }

  console.log("Found", allImages.size, "unique images/assets across pages. Testing statuses...");
  const broken = [];
  for (const img of allImages) {
    const cleanImg = img.replace(/&amp;/g, "&");
    const url = cleanImg.startsWith("http") ? cleanImg : "https://petsaathi-two.vercel.app" + cleanImg;
    try {
      const res = await globalThis.fetch(url, { method: "HEAD" });
      if (res.status >= 400) {
        console.error("❌ BROKEN:", res.status, cleanImg);
        broken.push({ img: cleanImg, status: res.status });
      }
    } catch (e) {
      console.error("❌ ERROR:", cleanImg, e.message);
      broken.push({ img: cleanImg, error: e.message });
    }
  }
  console.log("Done! Broken assets count:", broken.length);
  if (broken.length > 0) {
    console.log("Broken assets:", JSON.stringify(broken, null, 2));
  }
}
checkImages();
