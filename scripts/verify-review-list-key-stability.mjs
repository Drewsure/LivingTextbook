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
  "apps/web/src/features/policy/PilotPolicyReadinessPanel.tsx",
  "apps/web/src/features/publisher/TeacherPrivateLibraryPanel.tsx",
  "apps/web/src/features/content-intake/TeacherDraftLocalEditPreview.tsx",
  "apps/web/src/features/teacher/TeacherSessionMonitorPanel.tsx",
];

const bareKeyPattern = /key=\{(?:item|warning|record|action|rule|error|step)\}/g;
const failures = [];

const gameSequenceSource = readFileSync(
  new URL("../apps/web/src/features/game-shell/GameSequence.tsx", import.meta.url),
  "utf8",
);
if (!gameSequenceSource.includes("key={item.id}")) {
  failures.push("GameSequence must key sequence rows by domain identity, not the visible label.");
}
if (gameSequenceSource.includes("key={item.label}")) {
  failures.push("GameSequence must not use repeated teacher-visible labels as row identity.");
}

const trainingAcademySource = readFileSync(
  new URL("../apps/web/src/features/training/TrainingAcademyFlow.tsx", import.meta.url),
  "utf8",
);
if (!trainingAcademySource.includes("key={`training-sentence-${index + 1}`}")) {
  failures.push("Training Academy sentence controls must use deterministic positional identity.");
}

const stableLinkKeySource = readFileSync(
  new URL("../apps/web/src/app/teacher/pilot/page.tsx", import.meta.url),
  "utf8",
);
if (!stableLinkKeySource.includes("key={`${link.href}-${link.label}`}")) {
  failures.push("apps/web/src/app/teacher/pilot/page.tsx must key pilot links by href and label together.");
}

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
