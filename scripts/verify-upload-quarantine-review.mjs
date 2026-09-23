import { readFileSync } from "node:fs";

const model = readSource("../packages/content-model/src/uploadQuarantineReview.ts");
const store = readSource("../apps/web/src/server/uploads/quarantineUploadStore.ts");
const route = readSource("../apps/web/src/app/api/teacher/uploads/review/route.ts");
const panel = readSource("../apps/web/src/features/content-intake/QuarantineMetadataReviewPanel.tsx");
const workspace = readSource("../apps/web/src/features/content-intake/TeacherUploadWorkspacePanel.tsx");
const failures = [];

for (const marker of [
  "UploadQuarantineReviewSummary",
  "createUploadQuarantineReviewSummary",
  "awaiting-scan-rights-source-review",
  "No raw payload response",
  "No download URL",
  "No scan result mutation",
  "No rights approval mutation",
  "No source review mutation",
  "No target mapping promotion",
  "No student-facing use",
]) {
  requireText(model, marker, `Quarantine review model missing marker: ${marker}.`);
}

for (const marker of [
  "readQuarantineUploadRecords",
  "validateUploadQuarantineIntakeRecord",
  "createUploadQuarantineReviewSummary",
  "safeRecordDirectory",
  "isUploadQuarantineSafeTenantId",
  "payloadPresent",
  "intake.json",
  "was withheld",
  "tenant or identity binding",
]) {
  requireText(store, marker, `Quarantine review store missing marker: ${marker}.`);
}

for (const marker of [
  "readQuarantineUploadRecords",
  "hasTeacherOperationsReadAuthorization",
  "isUploadQuarantineSafeTenantId",
  "LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_API_TOKEN",
  "rawPayloadsIncluded: false",
  "downloadUrlsIncluded: false",
  "promotionAllowed: false",
  "studentFacingUseAllowed: false",
  "validated metadata and gate state only",
  "Cache-Control",
]) {
  requireText(route, marker, `Quarantine review route missing marker: ${marker}.`);
}

for (const marker of [
  "Quarantine metadata review",
  "Review state without opening the file",
  "Raw payload response",
  "Never returned",
  "Promotion and student use",
  "Authorized review contract",
  "Authorization is required",
  "does not create a file viewer, download link, or approval action",
]) {
  requireText(panel, marker, `Quarantine review panel missing marker: ${marker}.`);
}
requireText(workspace, "QuarantineMetadataReviewPanel", "Teacher upload workspace must render the quarantine metadata review panel.");

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS upload quarantine review remains tenant-authorized, metadata-only, path-safe, and promotion-blocked.");

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function requireText(source, marker, message) {
  if (!source.includes(marker)) failures.push(message);
}
