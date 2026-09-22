import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const resolverPath = fileURLToPath(new URL("../apps/web/src/data/sampleLaunchResolver.ts", import.meta.url));
const source = readFileSync(resolverPath, "utf8");
const failures = [];

for (const required of [
  'const reviewedLaunchCodes = new Set([samplePartnerLaunchCode, "demo-unit-1"]);',
  "if (!reviewedLaunchCodes.has(code))",
  "notFound();",
]) {
  if (!source.includes(required)) failures.push(`Missing fail-closed resolver rule: ${required}`);
}

if (source.includes('code.startsWith("partner-")')) {
  failures.push("Launch resolution must not authorize tenant context by partner-* prefix.");
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `FAIL ${failure}`).join("\n"));
  process.exit(1);
}

console.log("PASS sample launch resolution is exact-code, tenant-bound, and fail-closed for unknown paths.");
