import { readFileSync } from "node:fs";

const model = readSource("../packages/content-model/src/uploadQuarantineIntake.ts");
const store = readSource("../apps/web/src/server/uploads/quarantineUploadStore.ts");
const route = readSource("../apps/web/src/app/api/teacher/uploads/intake/route.ts");
const failures = [];

for (const marker of [
  "UploadQuarantineChannel",
  "UploadQuarantineIntakeRecord",
  "createUploadQuarantineIntakeRecord",
  "validateUploadQuarantineIntakeRecord",
  "quarantine-only",
  "scanStatus: \"pending\"",
  "rightsStatus: \"unknown\"",
  "sourceReviewStatus: \"unreviewed\"",
  "promotionAllowed: false",
  "studentFacingUseAllowed: false",
  "learnerMediaIncluded: false",
  "lowercase SHA-256 checksum",
  "MIME type is not allowed",
  "ASSET_RUNTIME_MAX_BYTES",
]) {
  requireText(model, marker, `Quarantine model missing marker: ${marker}.`);
}

for (const marker of [
  "LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_ROOT",
  "createHash(\"sha256\")",
  "createUploadQuarantineIntakeRecord",
  "writeQuarantineUpload",
  "intake.json",
  "assertInside",
  "tenantDirectory",
  "return { quarantineId, record }",
]) {
  requireText(store, marker, `Quarantine store missing marker: ${marker}.`);
}

for (const marker of [
  "LIVING_TEXTBOOOK_REVIEW_UPLOADS_ENABLED",
  "LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_API_TOKEN",
  "multipart/form-data",
  "validateSameOriginMutation",
  "hasTeacherOperationsReadAuthorization",
  "accepted-quarantine",
  "promotionAllowed: false",
  "studentFacingUseAllowed: false",
  "no raw media, learner records, download URL",
  "256 MiB quarantine limit",
  "writeQuarantineUpload",
]) {
  requireText(route, marker, `Quarantine route missing marker: ${marker}.`);
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS upload quarantine intake keeps enablement, authorization, checksum, tenant scope, scan, rights, and promotion boundaries explicit.");

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function requireText(source, marker, message) {
  if (!source.includes(marker)) failures.push(message);
}
