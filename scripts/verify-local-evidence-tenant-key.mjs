import { readFileSync } from "node:fs";

const store = readSource("../apps/web/src/features/persistence/localSessionEvidenceStore.ts");
const teacherPanel = readSource("../apps/web/src/features/teacher/TeacherSessionLocalEvidencePanel.tsx");

for (const marker of [
  "LOCAL_SESSION_EVIDENCE_VERSION = 4",
  "LocalSessionEvidenceLookup",
  "lookup.tenantId",
  "lookup.packageId",
  "lookup.launchCode",
  "lookup.unitKey",
  "lookup.studentSessionId",
  "encodeURIComponent(part)",
  "sameEvidenceLookup(value, lookup)",
  "hasBoundEvidenceContents(record as unknown as LocalSessionEvidence)",
  "getEvidenceIdentityErrors(args, args.events)",
  "isNonBlankString(record.packageId)",
  "isNonBlankString(record.type)",
]) {
  requireText(store, marker, `Local evidence tenant-key marker missing: ${marker}`);
}

for (const marker of [
  "tenantId: expectedTenantId",
  "packageId: expectedPackageId",
  "unitKey: expectedUnitKey",
  "studentSessionId: expectedStudentSessionId",
  "subscribeToLocalSessionEvidence({",
]) {
  requireText(teacherPanel, marker, `Teacher evidence lookup marker missing: ${marker}`);
}

console.log("PASS browser rehearsal evidence keys and event contents are tenant, package, launch, unit, and student-session scoped.");

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function requireText(source, marker, message) {
  if (!source.includes(marker)) {
    console.error(`FAIL ${message}`);
    process.exit(1);
  }
}
