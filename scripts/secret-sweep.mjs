import fs from "node:fs";
import path from "node:path";

function walk(dir) {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) files = files.concat(walk(full));
    else if (full.endsWith(".js") || full.endsWith(".json")) files.push(full);
  }
  return files;
}

const chunks = walk(".next/static");
console.log(`Inspecting ${chunks.length} client chunk files in .next/static...`);

const patterns = [
  { name: "Razorpay Secret", regex: /rzp_(?:test|live)_[a-zA-Z0-9]{14,}/g },
  { name: "MongoDB URI with credentials", regex: /mongodb(?:\+srv)?:\/\/[a-zA-Z0-9_]+:[^@]+@/g },
  { name: "NextAuth Secret Variable Reference", regex: /NEXTAUTH_SECRET/g },
  { name: "Cron Secret", regex: /CRON_SECRET/g },
  { name: "Auth Secret", regex: /AUTH_SECRET/g }
];

let leaks = 0;
for (const f of chunks) {
  const content = fs.readFileSync(f, "utf8");
  for (const p of patterns) {
    const matches = content.match(p.regex);
    if (matches) {
      console.error(`[LEAK DETECTED] ${p.name} in ${f}:`, matches);
      leaks++;
    }
  }
}

if (leaks === 0) {
  console.log("================================================================================");
  console.log("  [PASS] Secret Sweep: 0 leaked secrets found across all client bundles.");
  console.log("================================================================================");
} else {
  console.error("================================================================================");
  console.error(`  [FAIL] ${leaks} secret leak(s) detected!`);
  console.error("================================================================================");
  process.exit(1);
}
