import fs from "node:fs";

const component = fs.readFileSync("apps/web/src/features/printables/PrintableWorksheetPreview.tsx", "utf8");
const helper = fs.readFileSync("apps/web/src/data/samplePrintableQrAliasPreview.ts", "utf8");

for (const [source, checks] of [
  [component, [
    "createReviewOnlyQrAliasRuntimeAdapter",
    "createPrintableQrAliasPreview",
    "Printed QR binding preview",
    "QR release blocked",
    "does not generate, publish, mutate, or activate a production redirect",
    "durable alias persistence",
  ]],
  [helper, [
    "QrAliasRuntimeRequest",
    "getPermanentQrPath",
    "hasPermanentTextbookIdentity",
    "textbookReference",
    "deploymentTarget",
    "status: \"draft\"",
    "routeMutationAllowed: false",
    "rollbackExecutionAllowed: false",
  ]],
]) {
  for (const check of checks) {
    if (!source.includes(check)) throw new Error(`QR print preview integration is missing: ${check}`);
  }
}

if (/window\.location\s*=|NextResponse\.redirect|redirect\(/.test(component)) {
  throw new Error("Printable preview must not mutate or redirect QR routes.");
}

console.log("PASS printable worksheet preview consumes the review-only QR alias runtime without redirect mutation.");
