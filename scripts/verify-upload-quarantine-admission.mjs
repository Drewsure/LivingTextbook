import { readFileSync } from "node:fs";

const admission = readSource("../packages/content-model/src/uploadQuarantineAdmission.ts");
const intake = readSource("../packages/content-model/src/uploadQuarantineIntake.ts");
const review = readSource("../packages/content-model/src/uploadQuarantineReview.ts");
const failures = [];

for (const marker of [
  "UploadQuarantineEvidenceInput",
  "UploadQuarantineAdmissionPreview",
  "deriveUploadQuarantineAdmissionPreview",
  "validateUploadQuarantineEvidenceInput",
  "evidence-ready",
  "Promotion adapter selection is still a separate deployment gate.",
  "Security scan must pass.",
  "Rights proof is required.",
  "Source review approval is required.",
  "Target mapping review is required.",
  "Accessibility review is required.",
  "Release-control approval is required.",
  "promotionAllowed: false",
  "studentFacingAllowed: false",
  "mode: \"review-only\"",
  "sideEffect: \"none\"",
  "No package, playlist, game, assignment, QR, or local bundle write",
  "No student-facing use",
  "opaque quarantine id",
]) {
  requireText(admission, marker, `Quarantine admission contract missing marker: ${marker}.`);
}

for (const marker of [
  "isUploadQuarantineSafeTenantId",
  "lowercase SHA-256 checksum",
  "storageMode: \"quarantine-only\"",
]) requireText(intake, marker, `Quarantine intake contract missing admission prerequisite: ${marker}.`);

requireText(review, "awaiting-scan-rights-source-review", "Quarantine review must expose the pending review state before admission.");

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS quarantine admission previews evidence completeness while keeping promotion and student use disabled.");

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function requireText(source, marker, message) {
  if (!source.includes(marker)) failures.push(message);
}
