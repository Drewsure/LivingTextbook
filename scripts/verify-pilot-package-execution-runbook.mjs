import { readFileSync } from "node:fs";

const root = process.cwd();
const runbook = readFileSync(`${root}/docs/PILOT_PACKAGE_EXECUTION_RUNBOOK.md`, "utf8");
const operator = readFileSync(`${root}/scripts/run-local-package-operator.mjs`, "utf8");
const draft = readFileSync(`${root}/scripts/create-local-package-request-draft.mjs`, "utf8");
const runbookText = runbook.toLowerCase();
const required = [
  "ready-for-assembly",
  "LIVING_TEXTBOOOK_PILOT_DELIVERY_API_TOKEN",
  "LIVING_TEXTBOOOK_LOCAL_PACKAGE_ROOT",
  "LIVING_TEXTBOOOK_APPROVED_ASSET_ROOT",
  "LIVING_TEXTBOOOK_OPERATOR_LOCAL_PACKAGE_WRITE_CONFIRMATION",
  "ASSEMBLE_LOCAL_PACKAGE",
  "metadata/package-integrity.json",
  "metadata/qr-print-sheet.html",
  "hosted persistence remains a separate opt-in",
  "never put it",
];
const failures = [];
for (const marker of required) {
  if (!runbookText.includes(marker.toLowerCase())) failures.push(`runbook missing required marker: ${marker}`);
}
for (const marker of ["--preflight", "--assemble", "No request was sent", "performedWrite", "relativeDirectory"]) {
  if (!operator.includes(marker)) failures.push(`operator command missing marker: ${marker}`);
}
for (const marker of ["--review-packet", "--bundle-review-id", "never overwrites"]) {
  if (!draft.includes(marker)) failures.push(`request draft helper missing marker: ${marker}`);
}
if (!runbook.includes('LIVING_TEXTBOOOK_PILOT_DELIVERY_API_TOKEN = "<tenant-scoped-secret>"')) {
  failures.push("runbook must document a placeholder token, not an omitted secret boundary");
}
if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}
console.log("PASS pilot package execution runbook preserves preflight-first, tenant-scoped, secret-safe, explicit local assembly, integrity read-back, and hosted-opt-in boundaries.");
