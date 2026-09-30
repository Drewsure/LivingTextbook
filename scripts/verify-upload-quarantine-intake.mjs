import { readFileSync } from "node:fs";

const model = readSource("../packages/content-model/src/uploadQuarantineIntake.ts");
const store = readSource("../apps/web/src/server/uploads/quarantineUploadStore.ts");
const pathPolicy = readSource("../apps/web/src/server/uploads/quarantinePathPolicy.ts");
const route = readSource("../apps/web/src/app/api/teacher/uploads/intake/route.ts");
const authorization = readSource("../apps/web/src/server/uploads/uploadQuarantineAuthorization.ts");
const evidencePreviewRoute = readSource("../apps/web/src/app/api/teacher/uploads/evidence-preview/route.ts");
const panel = readSource("../apps/web/src/features/content-intake/ControlledQuarantineUploadPanel.tsx");
const packageIdentity = readSource("../apps/web/src/server/uploads/quarantinePackageIdentity.ts");
const packageIdentityRoutes = [
  "../apps/web/src/app/api/teacher/uploads/delivery-mode-decision/route.ts",
  "../apps/web/src/app/api/teacher/uploads/evidence-review/route.ts",
  "../apps/web/src/app/api/teacher/uploads/package-evidence-review/route.ts",
  "../apps/web/src/app/api/teacher/uploads/package-handoff-preview/route.ts",
  "../apps/web/src/app/api/teacher/uploads/package-readiness-binding/route.ts",
  "../apps/web/src/app/api/teacher/uploads/package-review-packet/route.ts",
  "../apps/web/src/app/api/teacher/uploads/promotion-adapter-decision/route.ts",
].map(readSource);
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
  "portable filename",
  "path separators, control characters, or reserved device names",
  "MIME type is not allowed",
  "ASSET_RUNTIME_MAX_BYTES",
]) {
  requireText(model, marker, `Quarantine model missing marker: ${marker}.`);
}

for (const marker of [
  "LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_ROOT",
  "createHash(\"sha256\")",
  "replaceAll(\"\\\\\", \"/\")",
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
  "validateQuarantineFilesystemPath",
  "realpathSync.native",
  "findExistingAncestor",
  "filesystem path escapes",
  "root must exist",
]) {
  requireText(pathPolicy, marker, `Quarantine filesystem policy missing marker: ${marker}.`);
}

for (const marker of [
  "LIVING_TEXTBOOOK_REVIEW_UPLOADS_ENABLED",
  "hasUploadQuarantineApiToken",
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

for (const marker of [
  "LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_API_TOKEN",
  "LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_ALLOWED_TENANTS",
  "hasUploadQuarantineApiToken",
  "hasUploadQuarantineApiCredential",
  "readAllowedTenants",
  "service credential is intentionally not tenant authority",
]) {
  requireText(authorization, marker, `Quarantine authorization missing marker: ${marker}.`);
}

for (const marker of [
  "deriveUploadQuarantineAdmissionPreview",
  "readQuarantineUploadRecords",
  "evidencePacketId: `evidence-packet:${summary.quarantineId}`",
  "rawPayloadIncluded: false",
  "filesystemPathIncluded: false",
  "downloadUrlIncluded: false",
  "promotionAllowed: false",
  "studentFacingUseAllowed: false",
  "review-only",
  "quarantineId",
]) {
  requireText(evidencePreviewRoute, marker, `Quarantine evidence preview route missing marker: ${marker}.`);
}

for (const marker of [
  "Controlled publisher intake",
  "Quarantine upload is disabled by default",
  "LIVING_TEXTBOOOK_REVIEW_UPLOADS_ENABLED=true",
  "Send one source or media file to quarantine review",
  "/api/teacher/uploads/intake",
  "credentials: \"same-origin\"",
  "accepted-quarantine",
  "Record quarantine intake",
  "No extraction",
  "Promotion blocked",
  "studentFacingUseAllowed",
  "Open evidence packet preview",
]) {
  requireText(panel, marker, `Controlled quarantine upload panel missing marker: ${marker}.`);
}

for (const marker of ["if (!enabled)", "type=\"file\""]) {
  requireText(panel, marker, `Controlled quarantine upload panel must keep the file picker behind the explicit enablement gate: ${marker}.`);
}

for (const forbidden of ["response.record?.path", "response.record?.downloadUrl", "rawPayload"]) {
  if (panel.includes(forbidden)) {
    failures.push(`Controlled quarantine upload panel must not expose raw storage or payload fields: ${forbidden}.`);
  }
}

requireText(packageIdentity, "export function deriveQuarantinePackageId", "Quarantine package identity must expose one shared derivation function.");
requireText(packageIdentity, "-package", "Quarantine package identity must preserve the canonical package suffix.");
for (const [index, routeSource] of packageIdentityRoutes.entries()) {
  requireText(routeSource, "deriveQuarantinePackageId", `Upload review route ${index + 1} must use the shared package identity helper.`);
  if (routeSource.includes("function derivePackageId")) {
    failures.push(`Upload review route ${index + 1} must not define a private package identity helper.`);
  }
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
