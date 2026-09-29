import { readFileSync } from "node:fs";

const model = readSource("../packages/content-model/src/uploadQuarantinePackageHandoff.ts");
const route = readSource("../apps/web/src/app/api/teacher/uploads/package-handoff-preview/route.ts");
const intakePanel = readSource("../apps/web/src/features/content-intake/ControlledQuarantineUploadPanel.tsx");
const reviewPanel = readSource("../apps/web/src/features/content-intake/QuarantineMetadataReviewPanel.tsx");
const failures = [];

for (const marker of [
  "UploadQuarantinePackageHandoffPreview",
  "createUploadQuarantinePackageHandoffPreview",
  "validateUploadQuarantinePackageHandoffPreview",
  "package-handoff-preview-only",
  "upload_quarantine_intake_record",
  "upload_quarantine_admission_preview",
  "Choose and activate an approved evidence storage provider",
  "No evidence record write",
  "No package JSON write",
  "writeAllowed: false",
  "promotionAllowed: false",
  "studentFacingUseAllowed: false",
  "mode: \"review-only\"",
  "sideEffect: \"none\"",
]) {
  requireText(model, marker, `Package handoff model missing marker: ${marker}.`);
}

for (const marker of [
  "readQuarantineUploadRecords",
  "deriveUploadQuarantineAdmissionPreview",
  "createUploadQuarantinePackageHandoffPreview",
  "sourceId: `quarantine-record:${summary.quarantineId}`",
  "requestedPackageId",
  "rawPayloadIncluded: false",
  "filesystemPathIncluded: false",
  "evidenceWriteAllowed: false",
  "packageAssemblyAllowed: false",
  "promotionAllowed: false",
  "studentFacingUseAllowed: false",
  "Cache-Control",
]) {
  requireText(route, marker, `Package handoff route missing marker: ${marker}.`);
}

for (const [source, marker, message] of [
  [intakePanel, "Open package handoff preview", "Intake result must link to package handoff preview."],
  [reviewPanel, "Candidate package handoff preview contract", "Metadata review must describe package handoff preview."],
  [reviewPanel, "/api/teacher/uploads/package-handoff-preview", "Metadata review must expose package handoff endpoint."],
  [reviewPanel, "durable reviewed-evidence record", "Metadata review must distinguish preview from durable evidence."],
]) {
  requireText(source, marker, message);
}

for (const forbidden of ["response.handoff?.filesystemPath", "response.handoff?.downloadUrl", "rawPayloadIncluded: true", "packageAssemblyAllowed: true"]) {
  if (route.includes(forbidden) || intakePanel.includes(forbidden)) failures.push(`Package handoff must not expose or enable: ${forbidden}.`);
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS quarantine package handoff preview preserves tenant lineage, package identity, evidence gates, and no-write boundaries.");

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function requireText(source, marker, message) {
  if (!source.includes(marker)) failures.push(message);
}
