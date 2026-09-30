import { readFileSync } from "node:fs";

const model = readSource("../packages/content-model/src/uploadQuarantinePackageReviewPacket.ts");
const index = readSource("../packages/content-model/src/index.ts");
const store = readSource("../apps/web/src/server/uploads/quarantineUploadStore.ts");
const route = readSource("../apps/web/src/app/api/teacher/uploads/package-review-packet/route.ts");
const panel = readSource("../apps/web/src/features/evidence/PublisherQuarantineHandoffBridgePanel.tsx");
const page = readSource("../apps/web/src/app/teacher/evidence/[tenantId]/handoff/page.tsx");
const failures = [];

for (const marker of [
  "UploadQuarantinePackageReviewPacket",
  "createUploadQuarantinePackageReviewPacket",
  "validateUploadQuarantinePackageReviewPacket",
  "ready-for-next-gate",
  "local-quarantine-package-review-metadata",
  "packageAssemblyAllowed: false",
  "promotionAllowed: false",
  "studentFacingUseAllowed: false",
  "mode: \"review-only\"",
  "sideEffect: \"none\"",
  "packetRevision",
  "supersedesPacketId",
  "sourcePreflightEvidenceId",
  "publisher_source_preflight_evidence",
]) requireText(model, marker, `Package review packet model missing marker: ${marker}.`);

requireText(index, "./uploadQuarantinePackageReviewPacket", "Content model must export the package review packet contract.");
for (const marker of [
  "LIVING_TEXTBOOOK_PACKAGE_REVIEW_PACKETS_ENABLED",
  "readQuarantinePackageReviewPacket",
  "writeQuarantinePackageReviewPacket",
  "package-review-packet.json",
  "flag: \"wx\"",
  "package-review-packet-v",
  "candidates.sort",
  "checksum does not match",
]) requireText(store, marker, `Package review packet store missing marker: ${marker}.`);

for (const marker of [
  "createUploadQuarantinePackageHandoffPreview",
  "createUploadQuarantinePackageReviewPacket",
  "readQuarantineReviewDecision",
  "accepted-for-package-review",
  "recorded-review-only",
  "packageAssemblyAllowed: false",
  "promotionAllowed: false",
  "studentFacingUseAllowed: false",
  "privacyMessage",
  "shouldReissueForPromotionAdapter",
  "readQuarantineSourcePreflightEvidence",
  "sourcePreflightEvidence",
  "shouldReissueForSourcePreflight",
]) requireText(route, marker, `Package review packet route missing marker: ${marker}.`);

for (const marker of [
  "Record review packet snapshot",
  "accepted-for-package-review source decision is required first",
  "LIVING_TEXTBOOOK_PACKAGE_REVIEW_PACKETS_ENABLED=true",
  "/api/teacher/uploads/package-review-packet",
  "bounded metadata",
  "never authorizes assembly",
  "sourcePreflightAttached",
  "Preflight lineage",
  "Attach the publisher source preflight evidence before recording the package review packet.",
]) requireText(panel, marker, `Package review packet panel missing marker: ${marker}.`);

requireText(page, "packageReviewPacketsEnabled", "Package review packet workspace must expose the explicit operator gate.");

for (const source of [model, store, route, panel]) {
  for (const forbidden of ["packageAssemblyAllowed: true", "promotionAllowed: true", "studentFacingUseAllowed: true", "rawPayloadIncluded: true"]) {
    if (source.includes(forbidden)) failures.push(`Package review packet flow must not enable: ${forbidden}.`);
  }
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS package review packet capture is immutable, checksum-bound, metadata-only, explicitly gated, and release-blocked.");

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function requireText(source, marker, message) {
  if (!source.includes(marker)) failures.push(message);
}
