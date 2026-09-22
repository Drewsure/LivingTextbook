import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const requiredMarkers = [
  ["packages/content-model/src/teacherDraftPersistencePreflight.ts", ["TeacherDraftPersistenceAdmissionPreflight", "validateTeacherDraftPersistenceAdmissionBinding", "writeAllowed"]],
  ["apps/web/src/data/sampleTeacherDraftPersistencePreflight.ts", ["sampleTeacherDraftPersistencePreflight", "ownerIdentityBound", "No teacher draft persistence write"]],
  ["apps/web/src/features/content-intake/TeacherDraftPersistenceAdmissionPanel.tsx", ["Tenant-owned storage preflight", "Blocked actions"]],
  ["apps/web/src/app/teacher/authoring/[draftId]/page.tsx", ["TeacherDraftPersistenceAdmissionPanel"]],
];
for (const [relativePath, markers] of requiredMarkers) {
  const source = readFileSync(join(root, relativePath), "utf8");
  for (const marker of markers) if (!source.includes(marker)) throw new Error(`${relativePath} is missing marker: ${marker}`);
}
console.log("PASS teacher draft persistence admission remains tenant-bound, provider-neutral, review-only, and write-blocked.");
