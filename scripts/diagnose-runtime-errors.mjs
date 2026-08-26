const baseUrl = "http://127.0.0.1:3110";

const routes = [
  "/",
  "/services",
  "/services/dog-walking",
  "/services/home-pet-sitting",
  "/services/boarding-beta",
  "/services/pet-taxi-beta",
  "/services/veterinary-support-beta",
  "/services/grooming-hygiene",
  "/safety",
  "/societies",
  "/societies/greenwood-estate",
  "/membership",
  "/journal",
  "/journal/safe-home-environment",
  "/contact",
  "/book",
  "/login",
  "/become-a-saathi",
  "/caregivers",
  "/corporate/pet-care-benefits",
  "/resources/new-pet-checklist",
  "/terms",
  "/privacy",
  "/offline",
  "/dashboard",
  "/admin",
  "/saathi",
  "/operator",
  "/society",
  "/partners",
  "/customer/wallet",
  "/bookings",
  "/pets",
  "/notifications",
  "/settings/privacy",
];

const apiEndpoints = [
  { url: "/api/health", method: "GET" },
  { url: "/api/ready", method: "GET" },
  { url: "/api/ai/health", method: "GET" },
  { url: "/api/services", method: "GET" },
  { url: "/api/services/catalogue", method: "GET" },
  { url: "/api/public/testimonials", method: "GET" },
  { url: "/api/public/lead-magnets", method: "GET" },
  { url: "/api/auth/providers", method: "GET" },
  { url: "/api/auth/csrf", method: "GET" },
  { url: "/api/customer/dashboard", method: "GET" },
  { url: "/api/pets", method: "GET" },
  { url: "/api/bookings", method: "GET" },
  { url: "/api/saathi/profile", method: "GET" },
  { url: "/api/admin/users", method: "GET" },
  { url: "/api/tracking/live", method: "GET" },
];

async function testAll() {
  console.log("==========================================");
  console.log("🔍 RUNTIME ROUTE & API DIAGNOSTIC AUDIT");
  console.log("==========================================\n");

  const results = {
    pages: [],
    apis: [],
    errors: [],
  };

  for (const route of routes) {
    try {
      const res = await fetch(`${baseUrl}${route}`, {
        headers: {
          "Accept": "text/html",
          "User-Agent": "PetSaathiRuntimeAudit/1.0",
        },
        redirect: "manual",
      });

      const status = res.status;
      const location = res.headers.get("location");
      const isRedirect = status >= 300 && status < 400;
      const is500 = status >= 500;

      let errorSnippet = "";
      if (is500) {
        const text = await res.text().catch(() => "");
        errorSnippet = text.slice(0, 300);
        results.errors.push({ type: "PAGE_500", route, status, errorSnippet });
      }

      results.pages.push({ route, status, isRedirect, location, is500 });
      console.log(`[PAGE] ${route.padEnd(35)} -> ${status} ${isRedirect ? `(Redirect: ${location})` : ""} ${is500 ? "❌ ERROR 500!" : "✅"}`);
    } catch (err) {
      console.log(`[PAGE] ${route.padEnd(35)} -> ❌ FETCH ERROR: ${err.message}`);
      results.errors.push({ type: "FETCH_FAILED", route, error: err.message });
    }
  }

  console.log("\n------------------------------------------\n");

  for (const api of apiEndpoints) {
    try {
      const res = await fetch(`${baseUrl}${api.url}`, {
        method: api.method,
        headers: {
          "Accept": "application/json",
          "User-Agent": "PetSaathiRuntimeAudit/1.0",
        },
      });

      const status = res.status;
      let bodyText = await res.text().catch(() => "");
      let parsed = null;
      try { parsed = JSON.parse(bodyText); } catch {}

      const is500 = status >= 500;
      if (is500) {
        results.errors.push({ type: "API_500", url: api.url, status, body: bodyText.slice(0, 300) });
      }

      results.apis.push({ url: api.url, status, is500, parsed });
      console.log(`[API]  ${api.url.padEnd(35)} -> ${status} ${is500 ? "❌ ERROR 500!" : "✅"}`);
    } catch (err) {
      console.log(`[API]  ${api.url.padEnd(35)} -> ❌ FETCH ERROR: ${err.message}`);
      results.errors.push({ type: "API_FETCH_FAILED", url: api.url, error: err.message });
    }
  }

  console.log("\n==========================================");
  console.log(`SUMMARY: ${results.pages.length} pages checked, ${results.apis.length} APIs checked.`);
  console.log(`ERRORS FOUND: ${results.errors.length}`);
  console.log("==========================================");

  if (results.errors.length > 0) {
    console.log("\nDETAILED ERRORS:");
    console.log(JSON.stringify(results.errors, null, 2));
  }
}

testAll().catch(console.error);
