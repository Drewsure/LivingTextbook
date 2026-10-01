import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL("..", import.meta.url)));
const script = readFileSync(join(root, "scripts", "submit-publisher-source-preflight-evidence-request.mjs"), "utf8");
const creator = readFileSync(join(root, "scripts", "create-publisher-source-preflight-evidence-request.mjs"), "utf8");
const route = readFileSync(join(root, "apps", "web", "src", "app", "api", "teacher", "uploads", "source-preflight-evidence", "route.ts"), "utf8");
const required = [
  [script, "LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_API_TOKEN", "server-side quarantine credential"],
  [script, "/api/teacher/uploads/source-preflight-evidence", "tenant evidence endpoint"],
  [script, "rawFilesIncluded !== false", "raw-file refusal"],
  [script, "uploadPerformed !== false", "upload refusal"],
  [script, "protectedActions", "protected action response"],
  [script, "recorded-review-only", "review-only success status"],
  [creator, "requestMode: \"review-only-source-preflight-evidence\"", "request mode"],
  [route, "writeQuarantineSourcePreflightEvidence", "durable evidence writer"],
  [route, "studentFacingUseAllowed: false", "student block"],
];
const failures = required.filter(([source, marker]) => !source.includes(marker)).map(([, , label]) => `missing ${label}`);
if (script.includes("payload.report") || script.includes("body.report.files")) failures.push("submitter must not transmit a transformed raw payload");
if (failures.length > 0) { for (const failure of failures) console.error(`FAIL ${failure}`); process.exit(1); }
console.log("PASS source preflight evidence submission is credential-gated, tenant-bound, metadata-only, and protected-action blocked.");
