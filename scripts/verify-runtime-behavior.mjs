import { createRequire } from "node:module";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-runtime-"));
const aiOutput = join(output, "ai");

try {
  writeFileSync(join(output, "package.json"), '{"type":"commonjs"}\n', "utf8");
  const tsc = join(root, "node_modules", "typescript", "bin", "tsc");
  const compile = spawnSync(process.execPath, [
    tsc,
    "--module", "commonjs",
    "--target", "ES2022",
    "--moduleResolution", "node",
    "--skipLibCheck",
    "--rootDir", join(root, "packages", "content-model", "src"),
    "--outDir", output,
    "packages/content-model/src/progressEventTaxonomy.ts",
    "packages/content-model/src/progressionRuntime.ts",
    "packages/content-model/src/recoveryRuntime.ts",
    "packages/content-model/src/rewardRuntime.ts",
    "packages/content-model/src/entitlementRuntime.ts",
    "packages/content-model/src/assetRuntime.ts",
    "packages/content-model/src/sourceRuntime.ts",
    "packages/content-model/src/releaseRuntime.ts",
    "packages/content-model/src/contentPackageRuntime.ts",
    "packages/content-model/src/launchRuntime.ts",
    "packages/content-model/src/assignmentRuntime.ts",
    "packages/content-model/src/persistenceRuntime.ts",
    "packages/content-model/src/reportRuntime.ts",
  ], { cwd: root, encoding: "utf8" });

  if (compile.status !== 0) {
    process.stdout.write(compile.stdout);
    process.stderr.write(compile.stderr);
    process.exit(1);
  }

  const aiTsconfig = join(output, "ai-tsconfig.json");
  writeFileSync(aiTsconfig, JSON.stringify({
    compilerOptions: {
      module: "commonjs",
      target: "ES2022",
      moduleResolution: "node",
      skipLibCheck: true,
      rootDir: root,
      outDir: aiOutput,
      baseUrl: root,
      paths: { "@living-textbook/content-model": ["packages/content-model/src/index.ts"] },
    },
    files: [
      join(root, "apps", "ai-service", "src", "index.ts"),
      join(root, "packages", "content-model", "src", "index.ts"),
    ],
  }, null, 2), "utf8");
  const aiCompile = spawnSync(process.execPath, [tsc, "-p", aiTsconfig], { cwd: root, encoding: "utf8" });
  if (aiCompile.status !== 0) {
    process.stdout.write(aiCompile.stdout);
    process.stderr.write(aiCompile.stderr);
    process.exit(1);
  }

  const progression = require(join(output, "progressionRuntime.js"));
  const recovery = require(join(output, "recoveryRuntime.js"));
  const reward = require(join(output, "rewardRuntime.js"));
  const entitlement = require(join(output, "entitlementRuntime.js"));
  const asset = require(join(output, "assetRuntime.js"));
  const source = require(join(output, "sourceRuntime.js"));
  const release = require(join(output, "releaseRuntime.js"));
  const contentPackage = require(join(output, "contentPackageRuntime.js"));
  const launch = require(join(output, "launchRuntime.js"));
  const assignment = require(join(output, "assignmentRuntime.js"));
  const persistence = require(join(output, "persistenceRuntime.js"));
  const report = require(join(output, "reportRuntime.js"));
  const aiService = require(join(aiOutput, "apps", "ai-service", "src", "index.js"));

  const registry = {
    taxonomyVersion: "test",
    events: [{ eventType: "audio_requested", effect: "support-only" }],
  };
  const supportEnvelope = {
    event_id: "event-1",
    event_type: "audio_requested",
    event_effect: "support-only",
    taxonomy_version: "test",
    event_acceptance_gate_id: "gate-1",
    unit_key: "unit-1",
    game_mode: "flashcards",
    occurred_at: new Date().toISOString(),
    metadata: {},
    settings_context: {
      game_mode_settings_profile_id: "profile-1",
      teacher_game_mode_settings_snapshot_id: "snapshot-1",
      settings_contract_id: "settings-1",
      progress_trigger_policy: "target-language-only",
      support_language_progress_allowed: false,
      media_only_progress_allowed: false,
      scoring_profile_override_allowed: false,
    },
  };
  const progressionRequest = {
    tenantId: "tenant-1",
    packageId: "package-1",
    sessionId: "session-1",
    mode: "review-only",
    envelope: supportEnvelope,
    registry,
    progressionPolicyAccepted: true,
    persistenceReady: true,
    reportRuntimeReady: true,
    rewardPolicyReady: true,
    targetLanguageEvidence: false,
  };
  const progressionErrors = progression.validateProgressionRuntimeRequest(progressionRequest);
  assertIncludes(progressionErrors, "support-only events cannot enter the progression authority");
  assertEqual(progression.createReviewOnlyProgressionRuntimeAdapter().execute(progressionRequest).sideEffect, "none");

  const rewardErrors = reward.validateRewardRuntimeRequest({
    tenantId: "tenant-1", packageId: "package-1", learnerSlotId: "slot-1", rewardId: "reward-1",
    rewardKind: "outfit", sourceEventId: "event-2", sourceEventType: "mastery_updated", earnedByMastery: true,
    deterministicRuleId: "rule-1", ownershipProvenanceReady: true, policyAccepted: true, persistenceReady: true,
    releaseApprovalAccepted: true, randomRewardRequested: true, gachaPressureRequested: false,
    purchaseRequired: false, spinWheelTicketRequested: false,
  });
  assertIncludes(rewardErrors, "random reward generation must remain disabled");

  const recoveryErrors = recovery.validateRecoveryRuntimeRequest({
    tenantId: "tenant-1", packageId: "package-1", recoveryId: "recovery-1", operation: "restore",
    requestedState: "executing", mode: "local-classroom", persistenceReady: true, backupManifestReady: true,
    checksumVerified: true, encryptionReady: true, accessControlReady: true, retentionPolicyAccepted: true,
    schoolPolicyAccepted: true, reportIntegrityReady: true, rollbackReady: true, releaseApprovalAccepted: true,
    rawLearnerAudioExcluded: false, rawLearnerTranscriptsExcluded: true, localFallbackReviewed: true,
  });
  assertIncludes(recoveryErrors, "raw learner audio exclusion is required");

  const entitlementErrors = entitlement.validateEntitlementRuntimeRequest({
    tenantId: "tenant-1", packageId: "package-1", entitlementId: "entitlement-1", feature: "ai-tutor",
    requestedState: "enabled", mode: "hosted-managed", packageTier: "core", teacherApprovalAccepted: true,
    schoolPolicyAccepted: true, privacyPolicyAccepted: true, costPolicyAccepted: true, persistenceReady: true,
    releaseApprovalAccepted: true, allowedLevelsDeclared: true, usageLimitDeclared: true,
    targetLanguageAudioReady: true,
  });
  assertIncludes(entitlementErrors, "AI Tutor requires premium or enterprise entitlement");

  const assetErrors = asset.validateAssetRuntimeRequest({
    tenantId: "tenant-1", assetId: "asset-1", unitKey: "unit-1", operation: "promote",
    kind: "audio", mimeType: "audio/mpeg", sizeBytes: 1000, checksum: "checksum-1",
    scanStatus: "passed", rightsStatus: "owned", sourceReviewStatus: "approved",
    targetMappingReviewed: true, storagePolicyAccepted: true, releaseApproved: true,
    sizeBudgetAccepted: true, containsLearnerMedia: true, learnerUpload: false,
    studentFacingUseRequested: true,
  });
  assertIncludes(assetErrors, "learner-recorded media is excluded from the core asset runtime");
  assertEqual(asset.createReviewOnlyAssetRuntimeAdapter().execute({
    tenantId: "tenant-1", assetId: "asset-1", operation: "intake", kind: "image",
    mimeType: "image/png", sizeBytes: 1000, checksum: "checksum-1", scanStatus: "pending",
    rightsStatus: "unknown", sourceReviewStatus: "unreviewed", targetMappingReviewed: false,
    storagePolicyAccepted: false, releaseApproved: false, sizeBudgetAccepted: false,
    containsLearnerMedia: false, learnerUpload: false, studentFacingUseRequested: false,
  }).sideEffect, "none");

  const sourceErrors = source.validateSourceRuntimeRequest({
    tenantId: "tenant-1", sourceId: "source-1", targetPackageId: "package-1", sourceType: "pdf",
    sourceChecksum: "checksum-1", extractionMethod: "pdf-text", contentReviewStatus: "draft",
    filePolicyAccepted: true, scanPassed: true, sourceLineageReviewed: true, rightsReviewAccepted: true,
    extractionReviewStatus: "accepted", ocrUsed: false, ocrConfidenceReviewed: true,
    segmentationReviewed: true, schemaReviewPassed: true, targetMappingReviewed: true,
    packageRuntimeApproved: true, teacherReleaseApproved: true, rawSourceAsStudentPayloadRequested: true,
    draftCreationRequested: true, aiExtractionRequested: false, studentFacingUseRequested: true,
  });
  assertIncludes(sourceErrors, "raw source files cannot become student payloads");
  assertEqual(source.createReviewOnlySourceRuntimeAdapter().execute({
    tenantId: "tenant-1", sourceId: "source-1", targetPackageId: "package-1", sourceType: "pdf",
    sourceChecksum: "checksum-1", extractionMethod: "pdf-text", contentReviewStatus: "draft",
    filePolicyAccepted: false, scanPassed: false, sourceLineageReviewed: false, rightsReviewAccepted: false,
    extractionReviewStatus: "not-started", ocrUsed: false, ocrConfidenceReviewed: false,
    segmentationReviewed: false, schemaReviewPassed: false, targetMappingReviewed: false,
    packageRuntimeApproved: false, teacherReleaseApproved: false, rawSourceAsStudentPayloadRequested: false,
    draftCreationRequested: false, aiExtractionRequested: false, studentFacingUseRequested: false,
  }).sideEffect, "none");

  const releaseErrors = release.validateReleaseRuntimeRequest({
    tenantId: "tenant-1", packageId: "package-1", releaseId: "release-1", requestedState: "active",
    currentState: "release-candidate", contentReviewStatus: "approved", verifierEvidenceStatus: "passed",
    sourceExtractionAccepted: true, assetRightsAccepted: true, targetLanguageAudioReady: true,
    curatedPathwayReviewed: true, packageRuntimeApproved: true, teacherApprovalAccepted: true,
    schoolPolicyAccepted: true, persistenceReady: true, rollbackReady: true,
    qrMutationRequested: true, studentFacingActivationRequested: true,
  });
  assertEqual(releaseErrors.length, 0);
  assertEqual(release.createReviewOnlyReleaseRuntimeAdapter().execute({
    tenantId: "tenant-1", packageId: "package-1", releaseId: "release-1", requestedState: "active",
    currentState: "release-candidate", contentReviewStatus: "approved", verifierEvidenceStatus: "passed",
    sourceExtractionAccepted: true, assetRightsAccepted: true, targetLanguageAudioReady: true,
    curatedPathwayReviewed: true, packageRuntimeApproved: true, teacherApprovalAccepted: true,
    schoolPolicyAccepted: true, persistenceReady: true, rollbackReady: true,
    qrMutationRequested: true, studentFacingActivationRequested: true,
  }).sideEffect, "none");

  const packageRequest = {
    tenantId: "tenant-1", packageId: "package-1", targetLanguage: "en",
    contentPackage: {
      meta: {
        packageId: "package-other", tenantId: "tenant-other", curriculumId: "curriculum-1",
        sourceType: "manual", reviewStatus: "draft", createdAt: "2026-01-01T00:00:00.000Z",
      },
      units: [],
    },
    curatedPathwayReviewed: false, storagePolicyAccepted: false, persistenceReady: false,
    teacherReleaseApproved: false, studentFacingUseRequested: true, qrActivationRequested: true,
  };
  const packageErrors = contentPackage.validateContentPackageRuntimeRequest(packageRequest);
  assertIncludes(packageErrors, "content package tenant must match runtime tenantId");
  assertEqual(contentPackage.createReviewOnlyContentPackageRuntimeAdapter().execute(packageRequest).sideEffect, "none");

  const launchRequest = {
    tenantId: "tenant-1", packageId: "package-1",
    launchSession: {
      launchCode: "launch-1", tenantId: "tenant-1", curriculumId: "curriculum-1", unitKey: "unit-1",
      status: "open", accessMode: "teacher-qr", entryMode: "flashcards", recommendedNextModes: [],
      openedAt: "2026-01-01T00:00:00.000Z",
    },
    accessMode: "teacher-qr", teacherRoleVerified: true, packageRuntimeApproved: true,
    assignmentRuntimeApproved: true, teacherQrOrFrontDoorReviewed: true, stableQrReady: true,
    localFallbackReady: false, schoolPolicyAccepted: true, rosterPolicyAccepted: true,
    persistenceReady: true, reportingPolicyAccepted: true, targetLanguageAudioReady: true,
    supportLanguageProgressAllowed: true, mediaOnlyProgressAllowed: false, realLearnerDataRequested: false,
    studentLaunchRequested: true,
  };
  const launchErrors = launch.validateLaunchRuntimeRequest(launchRequest);
  assertIncludes(launchErrors, "support language progress must remain disabled");
  assertEqual(launch.createReviewOnlyLaunchRuntimeAdapter().execute(launchRequest).sideEffect, "none");

  const assignmentRequest = {
    tenantId: "tenant-1",
    assignmentPlan: {
      assignmentId: "assignment-1", tenantId: "tenant-1", packageId: "package-1", launchCode: "launch-1",
      label: "Assignment", audience: "whole-class", readiness: "requires-persistence",
      targetGameModes: ["flashcards"], audioCoveredGameModes: ["flashcards"],
      access: {
        accessMode: "teacher-qr", routePath: "/launch/launch-1", entryCodeRequired: false,
        userCodeRequired: false, anonymousPracticeAllowed: true, stableQrReady: true, localFallbackReady: false,
      },
      controls: [], requiredBeforePilot: [], note: "Test assignment",
    },
    teacherRoleVerified: true, packageRuntimeApproved: true, launchRuntimeApproved: true,
    privateLinkPolicyAccepted: true, rosterPolicyAccepted: true, persistenceReady: true,
    reportingPolicyAccepted: true, targetLanguageAudioReady: true, supportLanguageProgressAllowed: true,
    mediaOnlyProgressAllowed: false, studentFacingUseRequested: false, privateLinkActivationRequested: false,
    assignmentWriteRequested: false,
  };
  const assignmentErrors = assignment.validateAssignmentRuntimeRequest(assignmentRequest);
  assertIncludes(assignmentErrors, "support language progress must remain disabled");
  assertEqual(assignment.createReviewOnlyAssignmentRuntimeAdapter().execute(assignmentRequest).sideEffect, "none");

  const persistenceRequest = {
    operation: "write", tenantId: "tenant-1", recordId: "record-1", category: "student-progress",
    containsStudentData: true, containsRawAudio: true, containsTranscript: false,
    requiresSchoolPolicy: true, schoolPolicyAccepted: false, releaseApproved: false,
  };
  const persistenceErrors = persistence.validatePersistenceRuntimeRequest(persistenceRequest);
  assertIncludes(persistenceErrors, "raw learner audio is not a core persistence field");
  assertIncludes(persistenceErrors, "release approval is required before mutation or export");
  assertEqual(persistence.createReviewOnlyPersistenceAdapter().execute(persistenceRequest).sideEffect, "none");

  const reportRequest = {
    tenantId: "tenant-1", launchCode: "launch-1", format: "csv-summary", scopes: ["teacher-summary"],
    reportPlan: {
      launchCode: "launch-1", tenantId: "tenant-1", readiness: "demo-preview",
      allowedFormats: ["csv-summary"], includedScopes: ["teacher-summary"], requiresTeacherRole: true,
      requiresAcceptedPolicy: true, policyAccepted: false, persistenceReady: false,
      retentionPolicy: "demo-only", excludesRawAudio: true, excludesTranscripts: true, note: "Test report",
    },
    taxonomy: { taxonomyVersion: "test", label: "Test", status: "active-scaffold", requiredEventFields: [], storageRule: "test", changeControl: "test", events: [] },
    eventEnvelopes: [], learnerIdentityMode: "real-identifiers", teacherRoleVerified: true,
    policyAccepted: false, persistenceReady: false, exportApproved: false, releaseApproved: false,
    includesRawAudio: true, includesTranscripts: false,
  };
  const reportErrors = report.validateTeacherReportRuntimeRequest(reportRequest);
  assertIncludes(reportErrors, "core teacher reports must use pseudonymous learner slots only");
  assertIncludes(reportErrors, "raw learner audio is excluded from core teacher reports");
  assertEqual(report.createReviewOnlyTeacherReportRuntimeAdapter().execute(reportRequest).sideEffect, "none");

  const aiRequest = {
    requestId: "request-1", tenantId: "tenant-1", contentPackageId: "package-1",
    sourceReviewStatus: "draft", targetLanguage: "en", assistLanguage: "ja", level: 1,
    theme: "Greetings", gameMode: "flashcards", engineId: "pairing",
    vocabularyTerms: ["hello", "goodbye", "teacher", "friend", "morning", "afternoon", "please"],
    targetSentences: ["Hello, teacher."], targetLanguageAudioReady: false, mediaRightsReady: false,
    teacherApprovalReady: false, premiumCostPolicyReady: false,
  };
  const aiErrors = aiService.validateAiGenerationServiceRequest(aiRequest);
  assertIncludes(aiErrors, "vocabularyTerms must contain between 8 and 12 terms");
  assertIncludes(aiErrors, "targetSentences must contain exactly 2 structures");
  assertIncludes(aiErrors, "target-language audio coverage is required");
  const aiResult = aiService.prepareReviewOnlyAiGenerationRequest(aiRequest);
  assertEqual(aiResult.status, "review-only");
  assertEqual(aiResult.providerDispatchAllowed, false);
  assertIncludes(aiResult.blockedActions, "No provider model call");

  console.log("PASS runtime behavior harness exercises AI authoring, package, launch, assignment, persistence, report, progression, recovery, reward, entitlement, asset, source, and release boundaries.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function assertIncludes(values, expected) {
  if (!values.includes(expected)) throw new Error(`Expected runtime behavior marker: ${expected}`);
}

function assertEqual(actual, expected) {
  if (actual !== expected) throw new Error(`Expected ${expected}, received ${actual}`);
}
