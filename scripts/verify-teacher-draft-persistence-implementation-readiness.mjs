import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const root = process.cwd();
const model = readFileSync(join(root, "packages/content-model/src/teacherDraftPersistenceImplementationReadiness.ts"), "utf8");
const durableRecords = readFileSync(join(root, "packages/content-model/src/persistenceRecords.ts"), "utf8");
const persistencePlan = readFileSync(join(root, "apps/web/src/data/samplePersistencePlan.ts"), "utf8");
const fixture = readFileSync(join(root, "apps/web/src/data/sampleTeacherDraftPersistenceImplementationReadiness.ts"), "utf8");
const panel = readFileSync(join(root, "apps/web/src/features/persistence/TeacherDraftPersistenceImplementationReadinessPanel.tsx"), "utf8");

for (const [source, label, markers] of [
  [model, "Teacher draft implementation readiness model", [
    "storageSelectionPreflightId",
    "storageSelectionGateId",
    'storageSelectionStatus: "blocked"',
    "storageSelectionAllowed",
    "Readiness must match storage selection preflight id.",
    "Readiness must match storage selection gate id.",
    "Review storage selection source must remain blocked and disallowed.",
  ]],
  [fixture, "Teacher draft implementation readiness fixture", [
    "storageSelectionPreflightId: samplePersistenceProviderSelectionPreflight.preflightId",
    "storageSelectionGateId: samplePersistenceProviderSelectionPreflight.evidenceStorageGateId",
    'storageSelectionStatus: "blocked"',
    "storageSelectionAllowed: false",
  ]],
  [durableRecords, "Durable persistence readiness record contract", [
    "storageSelectionPreflightId?: string",
    "storageSelectionGateId?: string",
    'storageSelectionStatus?: "blocked"',
    "storageSelectionAllowed?: false",
    "storage selection must remain blocked and disallowed",
  ]],
  [persistencePlan, "Durable persistence readiness record fixture", [
    "storageSelectionPreflightId: sampleStorageSelectionIdentity.storageSelectionPreflightId",
    "storageSelectionGateId: sampleStorageSelectionIdentity.storageSelectionGateId",
    'storageSelectionStatus: "blocked"',
    "storageSelectionAllowed: false",
  ]],
  [panel, "Teacher draft implementation readiness panel", ["Storage preflight", "Storage gate"]],
]) {
  for (const marker of markers) {
    if (!source.includes(marker)) throw new Error(`${label} is missing marker: ${marker}`);
  }
}

const behavior = spawnSync(process.execPath, [join(root, "scripts/verify-teacher-draft-persistence-implementation-readiness-behavior.mjs")], { encoding: "utf8" });
process.stdout.write(behavior.stdout);
process.stderr.write(behavior.stderr);
if (behavior.status !== 0) process.exit(behavior.status ?? 1);

console.log("PASS teacher draft persistence implementation readiness preserves blocked storage identity across source, provider, and review decision boundaries.");
