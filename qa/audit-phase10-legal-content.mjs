import fs from "node:fs";
import path from "node:path";

const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:3000";

async function auditPhase10() {
  console.log("================================================================================");
  console.log("       PETSAATHI QA AUDIT — PHASE 10: CONTENT, CONSISTENCY & LEGAL             ");
  console.log("================================================================================");

  // 1. Fetch public pages
  const pages = {
    terms: await fetch(`${BASE_URL}/terms`).then((r) => r.text()),
    privacy: await fetch(`${BASE_URL}/privacy`).then((r) => r.text()),
    safety: await fetch(`${BASE_URL}/safety`).then((r) => r.text()),
    refund: await fetch(`${BASE_URL}/refund-policy`).then((r) => r.text()),
    contact: await fetch(`${BASE_URL}/contact`).then((r) => r.text()),
    home: await fetch(`${BASE_URL}/`).then((r) => r.text()),
    becomeSaathi: await fetch(`${BASE_URL}/become-a-saathi`).then((r) => r.text()),
  };

  // ---------------------------------------------------------------------------
  // 1. Grievance Officer & Indian E-Commerce Rules 2020 Compliance
  // ---------------------------------------------------------------------------
  console.log("\n--- 1. Grievance Officer Compliance (IT Rules 2021 & E-Commerce Rules 2020) ---");
  const grievanceTerms = pages.terms.toLowerCase().includes("grievance");
  const grievancePrivacy = pages.privacy.toLowerCase().includes("grievance");
  const grievanceContact = pages.contact.toLowerCase().includes("grievance");

  console.log("Grievance mentioned in /terms:", grievanceTerms);
  console.log("Grievance mentioned in /privacy:", grievancePrivacy);
  console.log("Grievance mentioned in /contact:", grievanceContact);

  // Extract Grievance Officer block from /terms or /privacy
  const termsText = pages.terms;
  const grievanceSection = termsText.match(/grievance[\s\S]{0,600}/i)?.[0] || "Not found in /terms";
  console.log("Grievance section in /terms:\n", grievanceSection.slice(0, 300));

  const hasOfficerName = termsText.includes("Grievance Officer") && (termsText.includes("Prince") || termsText.includes("Name:"));
  const hasPhysicalAddress = termsText.includes("Ahmedabad") || termsText.includes("Registered Office");
  const hasPhone = termsText.includes("+91") || termsText.includes("Phone:");

  console.log("Has named Grievance Officer:", hasOfficerName);
  console.log("Has physical registered address:", hasPhysicalAddress);
  console.log("Has contact phone number:", hasPhone);

  // ---------------------------------------------------------------------------
  // 2. Support Hours Discrepancy Check
  // ---------------------------------------------------------------------------
  console.log("\n--- 2. Support Hours Discrepancies ---");
  const supportClaims = [];

  for (const [name, html] of Object.entries(pages)) {
    const matches247 = html.match(/24\/7[\s\w]*/gi) || [];
    const matchesHours = html.match(/\d{1,2}\s*(?:am|pm)\s*[-–to]+\s*\d{1,2}\s*(?:am|pm)/gi) || [];
    if (matches247.length > 0 || matchesHours.length > 0) {
      supportClaims.push({ page: name, claims247: matches247.slice(0, 3), hours: matchesHours });
    }
  }
  console.table(supportClaims.map((c) => ({ Page: c.page, "24/7 Claims": c.claims247.join("; "), "Specific Hours": c.hours.join("; ") })));

  // ---------------------------------------------------------------------------
  // 3. Safety Claims vs Terms Disclaimers
  // ---------------------------------------------------------------------------
  console.log("\n--- 3. Safety Guarantees vs Legal Disclaimers ---");
  const safetyHasGuarantee = pages.safety.includes("Guarantee") || pages.safety.includes("guarantee");
  const safetyHasInsurance = pages.safety.includes("insurance") || pages.safety.includes("Coverage") || pages.safety.includes("₹");
  const termsDisclaimsLiability = pages.terms.includes("AS IS") || pages.terms.includes("WITHOUT WARRANTY") || pages.terms.includes("LIMITATION OF LIABILITY");

  console.log("Safety page advertises Guarantee/Coverage:", safetyHasGuarantee || safetyHasInsurance);
  console.log("Terms contains total liability disclaimer (AS IS / NO WARRANTY):", termsDisclaimsLiability);

  // Check specific background check claims
  const bgCheckClaims = [];
  if (pages.safety.includes("police")) bgCheckClaims.push("Safety page claims 'police' check");
  if (pages.safety.includes("criminal")) bgCheckClaims.push("Safety page claims 'criminal' check");
  if (pages.becomeSaathi.includes("police")) bgCheckClaims.push("Become Saathi claims 'police' verification");
  console.log("Background check claims:", bgCheckClaims);

  // ---------------------------------------------------------------------------
  // 4. Copyright Year & Entity Consistency
  // ---------------------------------------------------------------------------
  console.log("\n--- 4. Footer Copyright Year & Entity Name ---");
  const copyrightMatches = pages.home.match(/©\s*(\d{4})[\s\S]{0,50}/i);
  console.log("Footer copyright line:", copyrightMatches ? copyrightMatches[0].replace(/<[^>]+>/g, "").trim() : "Not found");

  // Check pricing consistency between marketing and booking
  console.log("\n--- 5. Service Pricing Consistency Check ---");
  const dogWalkPriceMarketing = pages.home.match(/₹\s*(\d+)/g)?.slice(0, 5) || [];
  console.log("Sample prices mentioned on homepage:", dogWalkPriceMarketing);

  console.log("================================================================================");
}

auditPhase10().catch(console.error);
