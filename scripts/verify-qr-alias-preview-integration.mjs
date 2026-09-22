import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const route = fs.readFileSync(path.join(root, "apps/web/src/app/q/[...segments]/page.tsx"), "utf8");
const failures = [];

for (const fragment of [
  "createReviewOnlyQrAliasRuntimeAdapter",
  "sampleQrAliasRollbackEvidence",
  "rollbackPreview",
  "No live mutation",
  "cannot write a redirect",
]) {
  if (!route.includes(fragment)) failures.push(`QR preview route is missing ${fragment}`);
}

if (/window\.location\s*=|NextResponse\.redirect|redirect\(/.test(route)) {
  failures.push("QR preview route must not perform a redirect mutation");
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `FAIL ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("PASS QR preview consumes the review-only alias adapter without redirect mutation.");
}
