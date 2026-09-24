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

const stableTimestampFiles = [
  "apps/web/src/features/teacher/TeacherSessionLocalEvidencePanel.tsx",
  "apps/web/src/features/release/BrowserEvidenceAdjudicationPanel.tsx",
  "apps/web/src/features/pilot/BrowserPrivacyTenantEvidenceAdjudicationPanel.tsx",
  "apps/web/src/features/persistence/TeacherOperationsAccessPanel.tsx",
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

const tenantOwnedTextIdentityChecks = [
  {
    filePath: "apps/web/src/features/printables/PrintableWorksheetPreview.tsx",
    required: "key={`worksheet-sentence-${index + 1}`}",
    forbidden: "key={sentence}",
    message: "Printable worksheet sentences must use positional identity.",
  },
  {
    filePath: "apps/web/src/features/student/components/FlashcardPracticeCard.tsx",
    required: "key={`flashcard-sentence-${index + 1}`}",
    forbidden: "key={sentence}",
    message: "Flashcard target sentences must use positional identity.",
  },
  {
    filePath: "apps/web/src/features/access/FrontDoorTeacherReportPreview.tsx",
    required: "learnerLabels.map((label, index)",
    forbidden: "key={label}",
    message: "Teacher report learner labels must not use visible text as identity.",
  },
  {
    filePath: "apps/web/src/features/release/WhiteLabelReleaseReadinessPanel.tsx",
    required: "key={`quality-check-${index + 1}`}",
    forbidden: "key={label}",
    message: "White-label quality checks must use deterministic row identity.",
  },
  {
    filePath: "apps/web/src/features/teacher/TeacherSessionMonitorPanel.tsx",
    required: "key={`session-metric-${index + 1}`}",
    forbidden: "key={metric.label}",
    message: "Teacher session metrics must not use tenant-visible labels as identity.",
  },
  {
    filePath: "apps/web/src/app/teacher/entitlements/page.tsx",
    required: "key={`cost-control-statement-${index + 1}`}",
    forbidden: "key={statement.label}",
    message: "Entitlement cost-control statements must use positional identity.",
  },
  {
    filePath: "apps/web/src/features/content-intake/TeacherDraftPackagePreviewPanel.tsx",
    required: "key={`draft-sentence-${index + 1}`}",
    forbidden: "key={sentence}",
    message: "Teacher draft sentences must use positional identity.",
  },
  {
    filePath: "apps/web/src/app/teacher/reporting/page.tsx",
    required: "key={`report-metric-${index + 1}`}",
    forbidden: "key={metric.label}",
    message: "Teacher report metrics must not use visible labels as identity.",
  },
];

for (const check of tenantOwnedTextIdentityChecks) {
  const source = readFileSync(new URL(`../${check.filePath}`, import.meta.url), "utf8");
  if (!source.includes(check.required)) {
    failures.push(`${check.filePath} is missing the required stable identity: ${check.message}`);
  }
  if (source.includes(check.forbidden)) {
    failures.push(`${check.filePath} contains a visible-text identity: ${check.forbidden}`);
  }
}

for (const filePath of reviewSurfaceFiles) {
  const source = readFileSync(new URL(`../${filePath}`, import.meta.url), "utf8");
  const matches = source.match(bareKeyPattern);

  if (matches) {
    failures.push(`${filePath} contains bare repeated-text key(s): ${matches.join(", ")}`);
  }
}

for (const filePath of stableTimestampFiles) {
  const source = readFileSync(new URL(`../${filePath}`, import.meta.url), "utf8");
  if (/toLocale(String|DateString|TimeString)\s*\(/.test(source)) {
    failures.push(`${filePath} must not use locale-dependent timestamp rendering.`);
  }
  if (!source.includes("formatStable")) {
    failures.push(`${filePath} must use the shared stable timestamp formatter.`);
  }
}

const stableTimestampFormatter = readFileSync(
  new URL("../apps/web/src/lib/formatStableTimestamp.ts", import.meta.url),
  "utf8",
);
for (const token of ["getUTCFullYear", "getUTCMonth", "getUTCDate", "getUTCHours", "getUTCMinutes", "getUTCSeconds"]) {
  if (!stableTimestampFormatter.includes(token)) {
    failures.push(`Shared timestamp formatter is missing ${token}.`);
  }
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }

  process.exit(1);
}

console.log(`PASS review identity and stable timestamp checks cover ${reviewSurfaceFiles.length} review surface(s) and ${stableTimestampFiles.length} timestamp surface(s).`);
