import { readFileSync } from "node:fs";

const reviewSurfaceFiles = [
  "apps/web/src/features/content-intake/LabelledDiagramAssetReadinessPanel.tsx",
  "apps/web/src/features/content-intake/MultimediaAssetReadinessPanel.tsx",
  "apps/web/src/features/content-intake/UploadChannelReadinessPanel.tsx",
  "apps/web/src/features/content-intake/UploadFilePolicyPanel.tsx",
  "apps/web/src/features/content-intake/UploadPromotionReadinessPanel.tsx",
  "apps/web/src/features/content-intake/UploadReviewQueuePanel.tsx",
  "apps/web/src/features/content-intake/AiGeneratedPackageWriterRoutePlaylistWriteGuardPanel.tsx",
  "apps/web/src/features/content-intake/AiGeneratedPackageWriterLocalCompanionPackageGuardPanel.tsx",
  "apps/web/src/features/content-intake/AiGeneratedPackageWriterAssignmentShellGuardPanel.tsx",
  "apps/web/src/features/content-intake/AiGeneratedPackageWriterAssignmentHandoffEvidencePacketPanel.tsx",
  "apps/web/src/features/evidence/EvidenceAttachmentStorageReadinessPanel.tsx",
  "apps/web/src/features/evidence/EvidenceExportReadinessPanel.tsx",
  "apps/web/src/features/evidence/EvidencePacketAssemblyGatePanel.tsx",
  "apps/web/src/features/evidence/EvidencePacketFlowPanel.tsx",
  "apps/web/src/features/evidence/EvidencePacketHandoffPanel.tsx",
  "apps/web/src/features/evidence/EvidencePacketReviewIndexPanel.tsx",
  "apps/web/src/features/game-assets/LabelledDiagramAssetWorkspacePanel.tsx",
  "apps/web/src/features/multimedia/MediaAssetWorkspacePanel.tsx",
  "apps/web/src/features/multimedia/TeacherMediaLibraryPanel.tsx",
  "apps/web/src/features/persistence/BackendDecisionMatrixPanel.tsx",
  "apps/web/src/features/persistence/BackendMigrationPlanPanel.tsx",
  "apps/web/src/features/persistence/BackendMigrationSpecPanel.tsx",
  "apps/web/src/features/persistence/BackendSchemaDraftPanel.tsx",
  "apps/web/src/features/persistence/PersistenceAdapterReadinessPanel.tsx",
  "apps/web/src/features/persistence/PersistenceBoundaryPanel.tsx",
];

const bareKeyPattern = /key=\{(?:item|warning|record|action|rule|error|step)\}/g;
const failures = [];

for (const filePath of reviewSurfaceFiles) {
  const source = readFileSync(new URL(`../${filePath}`, import.meta.url), "utf8");
  const matches = source.match(bareKeyPattern);

  if (matches) {
    failures.push(`${filePath} contains bare repeated-text key(s): ${matches.join(", ")}`);
  }
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }

  process.exit(1);
}

console.log(`PASS review list key stability covers ${reviewSurfaceFiles.length} active review surface(s).`);
