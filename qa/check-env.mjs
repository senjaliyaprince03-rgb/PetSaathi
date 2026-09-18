import fs from "fs";
import path from "path";

function walk(dir) {
  let res = [];
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    if (f.name === "node_modules" || f.name === ".next" || f.name === ".git") continue;
    const p = path.join(dir, f.name);
    if (f.isDirectory()) res.push(...walk(p));
    else if (/\.(ts|tsx|js|mjs|cjs)$/.test(f.name)) res.push(p);
  }
  return res;
}

const files = walk("src");
const envVarRegex = /process\.env\.([A-Z0-9_]+)/g;
const foundLocations = {};

for (const file of files) {
  const content = fs.readFileSync(file, "utf-8");
  let match;
  while ((match = envVarRegex.exec(content)) !== null) {
    const varName = match[1];
    if (!foundLocations[varName]) foundLocations[varName] = new Set();
    foundLocations[varName].add(file.replace(/\\/g, "/"));
  }
}

function parseEnv(filePath) {
  const vars = new Map();
  if (!fs.existsSync(filePath)) return vars;
  const lines = fs.readFileSync(filePath, "utf-8").split("\n");
  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith("#")) continue;
    const eqIdx = line.indexOf("=");
    if (eqIdx !== -1) {
      const key = line.slice(0, eqIdx).trim();
      const val = line.slice(eqIdx + 1).trim();
      vars.set(key, val);
    }
  }
  return vars;
}

const envExample = parseEnv(".env.example");
const envLocal = parseEnv(".env.local");
const env = parseEnv(".env");

console.log("=== ENVIRONMENT VARIABLE AUDIT ===");
const undefinedVars = [];
const emptyVars = [];
const exposedSecrets = [];

for (const key of Object.keys(foundLocations).sort()) {
  const inExample = envExample.has(key);
  const valLocal = envLocal.get(key);
  const valEnv = env.get(key);
  const isDefined = envLocal.has(key) || env.has(key);
  const rawVal = valLocal !== undefined ? valLocal : valEnv;
  const isBlank = rawVal === '""' || rawVal === "''" || rawVal === "" || rawVal === undefined;

  if (!isDefined) {
    undefinedVars.push({ key, inExample, files: Array.from(foundLocations[key]) });
  } else if (isBlank) {
    emptyVars.push({ key, inExample, files: Array.from(foundLocations[key]) });
  }

  if (key.startsWith("NEXT_PUBLIC_")) {
    if (key.includes("SECRET") || key.includes("KEY") || key.includes("TOKEN") || key.includes("PASSWORD")) {
      exposedSecrets.push({ key, val: rawVal, files: Array.from(foundLocations[key]) });
    }
  }
}

console.log("--- 1. UNDEFINED IN BOTH .env.local AND .env (" + undefinedVars.length + ") ---");
for (const item of undefinedVars) {
  console.log(`- ${item.key} (in .env.example: ${item.inExample}) -> used in ${item.files.slice(0, 2).join(", ")}`);
}

console.log("\n--- 2. DEFINED BUT EMPTY (\"\" / empty) IN ENV (" + emptyVars.length + ") ---");
for (const item of emptyVars) {
  console.log(`- ${item.key} (in .env.example: ${item.inExample}) -> used in ${item.files.slice(0, 2).join(", ")}`);
}

console.log("\n--- 3. NEXT_PUBLIC_ PREFIXED POTENTIAL SECRETS/KEYS (" + exposedSecrets.length + ") ---");
for (const item of exposedSecrets) {
  console.log(`- ${item.key} = ${item.val} -> used in ${item.files.slice(0, 2).join(", ")}`);
}
