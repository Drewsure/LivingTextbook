import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../packages/content-model/src/teacherReportPackageSnapshotRuntime.ts", import.meta.url), "utf8");
const failures = [];

for (const marker of [
  "TeacherReportPackageSnapshotRecoveryPacket",
  "TeacherReportPackageSnapshotAdapter",
  "createTeacherReportPackageSnapshotRecoveryPacket",
  "validateTeacherReportPackageSnapshotRecoveryPacket",
  "fingerprintTeacherReportPackageSnapshot",
  "createReviewOnlyTeacherReportPackageSnapshotAdapter",
  "hosted-managed",
  "local-classroom",
  "provider-neutral",
  "No snapshot provider activation",
  "No hosted database write",
  "No local classroom write",
  "No backup creation",
  "No restore execution",
  "No export archive creation",
  "restoreAllowed: false",
  "exportAllowed: false",
  "writesAllowed: false",
  "sideEffect: \"none\"",
  "must not embed raw event records",
]) {
  if (!source.includes(marker)) failures.push(`snapshot runtime contract missing marker: ${marker}`);
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS report snapshot runtime keeps hosted/local recovery provider-neutral and review-only.");
