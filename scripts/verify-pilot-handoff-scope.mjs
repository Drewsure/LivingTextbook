import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const canonicalPackageId = "sample-publisher-l1-u1-routines-package";
const sources = {
  handoff: readSource("../apps/web/src/data/samplePilotHandoffPackage.ts"),
  publishGate: readSource("../apps/web/src/data/samplePackagePublishGate.ts"),
  approvalLedger: readSource("../apps/web/src/data/samplePackageApprovalLedger.ts"),
  preflight: readSource("../apps/web/src/data/samplePersistenceActivationPreflight.ts"),
  classroomGate: readSource("../apps/web/src/data/sampleClassroomLaunchGate.ts"),
  dryRun: readSource("../apps/web/src/data/sampleTeacherDryRunRehearsal.ts"),
  validator: readSource("../packages/content-model/src/pilotHandoff.ts"),
};
const failures = [];

requireText(sources.handoff, `samplePilotHandoffPackageId = "${canonicalPackageId}"`, "Pilot handoff must declare the canonical package id.");
requireText(sources.handoff, 'routeKey: "sample-publisher-first-handoff"', "Pilot handoff must keep a stable route key separate from package scope.");
requireText(sources.publishGate, `packageId: "${canonicalPackageId}"`, "Package publish gate must use the canonical package id.");
requireText(sources.publishGate, 'routeKey: "starter-english-level-1-unit-1"', "Package publish gate must keep a stable route key separate from package scope.");
requireText(sources.approvalLedger, `packageId: "${canonicalPackageId}"`, "Approval ledger must use the canonical package id.");
requireText(sources.preflight, `packageId: "${canonicalPackageId}"`, "Activation preflight must use the canonical package id.");
requireText(sources.classroomGate, "gate.routeKey", "Classroom launch routes must use a stable route key rather than package scope.");
requireText(sources.dryRun, "handoffPackage.routeKey", "Teacher dry-run routes must use a stable route key rather than package scope.");
requireText(sources.validator, "Pilot handoff report snapshot package must match the handoff package.", "Handoff validator must reject report package drift.");
requireText(sources.validator, "Pilot handoff persistence gate package must match the handoff package.", "Handoff validator must reject persistence package drift.");
requireText(sources.validator, "Pilot handoff release-control package must match the handoff package.", "Handoff validator must reject release-control package drift.");
requireText(sources.validator, "Pilot handoff approval package must match the handoff package.", "Handoff validator must reject approval package drift.");
requireText(sources.handoff, "approvalEvidence", "Pilot handoff fixture must carry approval evidence.");

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log(`PASS pilot handoff, release, approval, persistence, and activation evidence share package scope ${canonicalPackageId}.`);

function readSource(relativePath) {
  return readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8");
}

function requireText(source, text, message) {
  if (!source.includes(text)) failures.push(message);
}
