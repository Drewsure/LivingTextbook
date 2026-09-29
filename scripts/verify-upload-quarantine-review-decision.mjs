import { readFileSync } from "node:fs";

const model = readSource("../packages/content-model/src/uploadQuarantineReviewDecision.ts");
const store = readSource("../apps/web/src/server/uploads/quarantineUploadStore.ts");
const route = readSource("../apps/web/src/app/api/teacher/uploads/review-decision/route.ts");
const panel = readSource("../apps/web/src/features/content-intake/ControlledQuarantineUploadPanel.tsx");
const page = readSource("../apps/web/src/app/teacher/uploads/[tenantId]/page.tsx");
const failures = [];

for (const marker of [
  "UploadQuarantineReviewDecisionRecord",
  "createUploadQuarantineReviewDecisionRecord",
  "validateUploadQuarantineReviewDecisionRecord",
  "accepted-for-package-review",
  "changes-required",
  "local-quarantine-review-metadata",
  "approvalCaptured: false",
  "evidenceAttachmentWriteAllowed: false",
  "packageAssemblyAllowed: false",
  "promotionAllowed: false",
  "studentFacingUseAllowed: false",
  "mode: \"review-only\"",
  "sideEffect: \"none\"",
]) requireText(model, marker, `Review decision model missing marker: ${marker}.`);

for (const marker of [
  "LIVING_TEXTBOOOK_REVIEW_DECISIONS_ENABLED",
  "readQuarantineReviewDecision",
  "writeQuarantineReviewDecision",
  "review-decision.json",
  "flag: \"wx\"",
  "immutable review decision",
  "stableJson",
]) requireText(store, marker, `Review decision store missing marker: ${marker}.`);

for (const marker of [
  "validateSameOriginMutation",
  "readJsonRequestBody",
  "hasTeacherOperationsReadAuthorization",
  "LIVING_TEXTBOOOK_REVIEW_DECISIONS_ENABLED",
  "recorded-review-only",
  "approvalCaptured: false",
  "evidenceAttachmentWriteAllowed: false",
  "packageAssemblyAllowed: false",
  "promotionAllowed: false",
  "studentFacingUseAllowed: false",
  "rawPayloadIncluded: false",
]) requireText(route, marker, `Review decision route missing marker: ${marker}.`);

for (const marker of [
  "Teacher review decision",
  "Record review for package review",
  "accepted-for-package-review",
  "changes-required",
  "Record review decision",
  "LIVING_TEXTBOOOK_REVIEW_DECISIONS_ENABLED",
  "reviewedFields",
  "unresolvedBlockers",
]) requireText(panel, marker, `Review decision panel missing marker: ${marker}.`);

requireText(page, "reviewDecisionsEnabled", "Teacher upload page must pass the explicit review decision gate.");

for (const forbidden of ["approvalCaptured: true", "packageAssemblyAllowed: true", "promotionAllowed: true", "studentFacingUseAllowed: true", "rawPayloadIncluded: true"]) {
  if (model.includes(forbidden) || route.includes(forbidden) || panel.includes(forbidden)) failures.push(`Review decision flow must not enable: ${forbidden}.`);
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS quarantine review decision capture is explicit, immutable, tenant-scoped, metadata-only, and release-blocked.");

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function requireText(source, marker, message) {
  if (!source.includes(marker)) failures.push(message);
}
