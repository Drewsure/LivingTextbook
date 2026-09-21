import { readFileSync } from "node:fs";

const store = readSource("../apps/web/src/features/persistence/localSessionEvidenceStore.ts");
const teacherPanel = readSource("../apps/web/src/features/teacher/TeacherSessionLocalEvidencePanel.tsx");

for (const marker of [
  "LOCAL_SESSION_EVIDENCE_VERSION = 3",
  "LocalSessionEvidenceLookup",
  "lookup.tenantId",
  "lookup.packageId",
  "lookup.launchCode",
  "lookup.studentSessionId",
  "encodeURIComponent(part)",
  "sameEvidenceLookup(value, lookup)",
]) {
  requireText(store, marker, `Local evidence tenant-key marker missing: ${marker}`);
}

for (const marker of [
  "tenantId: expectedTenantId",
  "packageId: expectedPackageId",
  "studentSessionId: expectedStudentSessionId",
  "subscribeToLocalSessionEvidence({",
]) {
  requireText(teacherPanel, marker, `Teacher evidence lookup marker missing: ${marker}`);
}

console.log("PASS browser rehearsal evidence keys are tenant, package, launch, and student-session scoped.");

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function requireText(source, marker, message) {
  if (!source.includes(marker)) {
    console.error(`FAIL ${message}`);
    process.exit(1);
  }
}
