import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const requiredMarkers = [
  ["packages/content-model/src/sourceDraftImport.ts", ["SourceDraftImportPreview", "validateSourceDraftImportPreviewBinding", "storageWriteAllowed"]],
  ["apps/web/src/data/sampleSourceDraftImport.ts", ["sampleSourceDraftImportPreviews", "sampleSourceDraftImportErrors"]],
  ["apps/web/src/features/content-intake/SourceDraftImportPreviewPanel.tsx", ["Teacher draft import preview", "Storage write", "Assignment"]],
  ["apps/web/src/app/teacher/intake/page.tsx", ["SourceDraftImportPreviewPanel"]],
  ["packages/content-model/src/teacherDraftPersistencePreflight.ts", ["TeacherDraftPersistenceAdmissionPreflight", "writeAllowed", "provider-neutral"]],
  ["apps/web/src/data/sampleTeacherDraftPersistencePreflight.ts", ["sampleTeacherDraftPersistencePreflight", "ownerIdentityBound"]],
  ["apps/web/src/features/content-intake/TeacherDraftPersistenceAdmissionPanel.tsx", ["Tenant-owned storage preflight", "Blocked actions"]],
  ["apps/web/src/app/teacher/authoring/[draftId]/page.tsx", ["TeacherDraftPersistenceAdmissionPanel"]],
  ["packages/content-model/src/teacherDraftOwnerPolicyBinding.ts", ["TeacherDraftOwnerPolicyBinding", "authorizationScope", "schoolPolicyAccepted"]],
  ["apps/web/src/data/sampleTeacherDraftOwnerPolicyBinding.ts", ["sampleTeacherDraftOwnerPolicyBinding", "No owner authorization inferred from policy evidence"]],
  ["apps/web/src/features/content-intake/TeacherDraftOwnerPolicyBindingPanel.tsx", ["Authorization is not acceptance", "Policy not accepted"]],
  ["apps/web/src/app/teacher/authoring/[draftId]/page.tsx", ["TeacherDraftOwnerPolicyBindingPanel"]],
  ["packages/content-model/src/teacherDraftAcceptanceReadiness.ts", ["TeacherDraftAcceptanceReadiness", "retentionAccepted", "No accepted terms stored"]],
  ["apps/web/src/data/sampleTeacherDraftAcceptanceReadiness.ts", ["sampleTeacherDraftAcceptanceReadiness", "exportRetentionDryRunId"]],
  ["apps/web/src/features/content-intake/TeacherDraftAcceptanceReadinessPanel.tsx", ["Draft release readiness remains blocked", "No activation"]],
  ["apps/web/src/app/teacher/authoring/[draftId]/page.tsx", ["TeacherDraftAcceptanceReadinessPanel"]],
  ["packages/content-model/src/teacherDraftPersistenceImplementationReadiness.ts", ["TeacherDraftPersistenceImplementationReadiness", "testExecutionAllowed", "No provider selection"]],
  ["apps/web/src/data/sampleTeacherDraftPersistenceImplementationReadiness.ts", ["sampleTeacherDraftPersistenceImplementationReadiness", "assignment-promotion-guard"]],
  ["apps/web/src/features/persistence/TeacherDraftPersistenceImplementationReadinessPanel.tsx", ["Future adapter work order", "Acceptance tests, review-only"]],
  ["apps/web/src/app/teacher/persistence/page.tsx", ["TeacherDraftPersistenceImplementationReadinessPanel", "sampleTeacherDraftPersistenceImplementationReadiness"]],
];

for (const [relativePath, markers] of requiredMarkers) {
  const source = readFileSync(join(root, relativePath), "utf8");
  for (const marker of markers) {
    if (!source.includes(marker)) throw new Error(`${relativePath} is missing marker: ${marker}`);
  }
}

console.log("PASS source extraction to teacher draft import and persistence admission remain identity-bound, review-only, and promotion-blocked.");
