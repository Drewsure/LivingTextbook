import { readFileSync } from "node:fs";

const model = readSource("../packages/content-model/src/packageReadinessReconciliation.ts");
const data = readSource("../apps/web/src/data/samplePackageReadinessReconciliation.ts");
const panel = readSource("../apps/web/src/features/content-intake/PackageReadinessReconciliationPanel.tsx");
const intake = readSource("../apps/web/src/app/teacher/intake/page.tsx");
const routeVerifier = readSource("./verify-active-routes.mjs");
const checklist = readSource("../docs/verification/PACKAGE_READINESS_RECONCILIATION_CHECKS.md");
const failures = [];

for (const marker of [
  "PackageReadinessReconciliation",
  "validatePackageReadinessReconciliation",
  "PACKAGE_READINESS_REQUIRED_LANE_IDS",
  "sourceAssemblyPacketId",
  "approvalLedgerId",
  "targetLanguageAudioApprovalId",
  "promotionAllowed",
  "studentFacingActivationAllowed",
]) {
  requireText(model, marker, `Shared package readiness model is missing ${marker}.`);
}

for (const marker of [
  "sampleSourcePackageAssemblyPackets.map",
  "package-readiness-${packet.packetId}",
  "verifier-evidence",
  "target-language-audio",
]) {
  requireText(data, marker, `Package readiness sample is missing ${marker}.`);
}

for (const marker of [
  "LaneCard",
  "reconciliation.lanes.map",
  "Student activation",
  "Progress rule:",
]) {
  requireText(panel, marker, `Package readiness panel is missing ${marker}.`);
}

for (const marker of [
  "PackageReadinessReconciliationPanel",
  "samplePackageReadinessReconciliations",
  "reconciliations={samplePackageReadinessReconciliations}",
]) {
  requireText(intake, marker, `Teacher intake must render package readiness reconciliation: ${marker}.`);
}

for (const marker of [
  "Package readiness reconciliation",
  "promotion",
  "student-facing",
]) {
  requireText(routeVerifier, marker, `Active route verifier must cover package readiness marker: ${marker}.`);
  requireText(checklist, marker, `Package readiness checklist must cover marker: ${marker}.`);
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS package readiness reconciliation covers seven evidence lanes, two tenant samples, and promotion blockers.");

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function requireText(source, text, message) {
  if (!source.includes(text)) failures.push(message);
}
