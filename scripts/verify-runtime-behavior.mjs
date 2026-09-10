import { createRequire } from "node:module";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
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

  const contentModelAlias = join(aiOutput, "node_modules", "@living-textbook", "content-model");
  mkdirSync(contentModelAlias, { recursive: true });
  writeFileSync(join(contentModelAlias, "package.json"), JSON.stringify({
    name: "@living-textbook/content-model",
    main: "../../../packages/content-model/src/index.js",
  }), "utf8");

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
  const contentModel = require(join(output, "index.js"));
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

  const localRecoveryRequest = {
    tenantId: "tenant-1", packageId: "package-1", recoveryId: "recovery-local-1", operation: "restore",
    requestedState: "executing", mode: "local-classroom", persistenceReady: true, backupManifestReady: true,
    checksumVerified: true, encryptionReady: true, accessControlReady: true, retentionPolicyAccepted: true,
    schoolPolicyAccepted: true, reportIntegrityReady: true, rollbackReady: true, releaseApprovalAccepted: true,
    rawLearnerAudioExcluded: true, rawLearnerTranscriptsExcluded: true, localFallbackReviewed: false,
  };
  const localRecoveryErrors = recovery.validateRecoveryRuntimeRequest(localRecoveryRequest);
  assertIncludes(localRecoveryErrors, "local fallback review is required for non-hosted recovery");
  assertEqual(recovery.createReviewOnlyRecoveryRuntimeAdapter().execute(localRecoveryRequest).sideEffect, "none");

  const hostedRecoveryRequest = {
    tenantId: "tenant-1", packageId: "package-1", recoveryId: "recovery-hosted-1", operation: "backup",
    requestedState: "ready", mode: "hosted-managed", persistenceReady: true, backupManifestReady: true,
    checksumVerified: true, encryptionReady: true, accessControlReady: true, retentionPolicyAccepted: true,
    schoolPolicyAccepted: true, reportIntegrityReady: true, rollbackReady: true, releaseApprovalAccepted: true,
    rawLearnerAudioExcluded: true, rawLearnerTranscriptsExcluded: true, localFallbackReviewed: false,
  };
  assertEqual(recovery.validateRecoveryRuntimeRequest(hostedRecoveryRequest).length, 0);
  assertEqual(recovery.createReviewOnlyRecoveryRuntimeAdapter().execute(hostedRecoveryRequest).sideEffect, "none");

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

  const audioUnit = {
    unitMeta: {
      tenantId: "tenant-1", curriculumId: "curriculum-1", level: 1, module: 1, unit: 1,
      theme: "Greetings", gameMode: "flashcards", gameFamily: "vocabulary-matching", engineId: "selection",
    },
    pedagogicalPayload: {
      vocabularyTerms: ["hello", "goodbye", "teacher", "friend", "morning", "afternoon", "please", "thank you"],
      targetSentences: ["Hello, teacher.", "Thank you, friend."],
    },
    visualRules: { avatarFamily: "tenant", characterFocus: "student", blacklistCheck: { passed: true, notes: "test" } },
    teacherLaunchProtocol: { hook: "hook", activity: "activity", review: "review" },
  };
  const audioUnitKey = contentModel.getUnitKey(audioUnit.unitMeta);
  const audioCues = [
    ...audioUnit.pedagogicalPayload.vocabularyTerms.map((text, index) => ({
      audioCueId: `audio-term-${index + 1}`, tenantId: "tenant-1", kind: "term", text, language: "en",
      source: "text-to-speech", unitKey: audioUnitKey,
    })),
    ...audioUnit.pedagogicalPayload.targetSentences.map((text, index) => ({
      audioCueId: `audio-sentence-${index + 1}`, tenantId: "tenant-1", kind: "sentence", text, language: "en",
      source: "text-to-speech", unitKey: audioUnitKey,
    })),
  ];
  const audioPlan = {
    unitKey: audioUnitKey, targetLanguage: "en", required: true,
    vocabularyAudioCueIds: audioCues.slice(0, 8).map((cue) => cue.audioCueId),
    sentenceAudioCueIds: audioCues.slice(8).map((cue) => cue.audioCueId),
  };
  const audioPackage = {
    meta: {
      packageId: "audio-package-1", tenantId: "tenant-1", curriculumId: "curriculum-1",
      sourceType: "manual", reviewStatus: "draft", createdAt: "2026-01-01T00:00:00.000Z",
    },
    units: [audioUnit], audioCues, audioSupportPlans: [audioPlan],
  };
  const missingAudioPlanErrors = contentModel.validateContentPackage({ ...audioPackage, audioSupportPlans: [] });
  assertEqual(contentModel.validateContentPackage(audioPackage).length, 0);
  for (const kind of ["term", "sentence"]) {
    const firstCue = audioCues.find((cue) => cue.kind === kind);
    const repeatedTextPackage = {
      ...audioPackage,
      audioCues: audioCues.map((cue) => cue.kind === kind ? { ...cue, text: firstCue.text } : cue),
    };
    const coverageLabel = kind === "term" ? "vocabulary term" : "target sentence";
    assertIncludes(contentModel.validateContentPackage(repeatedTextPackage),
      `Audio support plan for ${audioUnitKey} must include a cue for every ${coverageLabel}.`);
  }
  const alternateCue = { ...audioCues[0], audioCueId: "alternate-hello" };
  assertEqual(contentModel.validateContentPackage({
    ...audioPackage,
    audioCues: [...audioCues, alternateCue],
    audioSupportPlans: [{ ...audioPlan, vocabularyAudioCueIds: [...audioPlan.vocabularyAudioCueIds, alternateCue.audioCueId] }],
  }).length, 0);
  assertEqual(contentModel.validateContentPackage({
    ...audioPackage,
    audioCues: audioCues.map((cue) => ({ ...cue, text: `  ${cue.text.toUpperCase()}  ` })),
    audioSupportPlans: [{ ...audioPlan, vocabularyAudioCueIds: [...audioPlan.vocabularyAudioCueIds].reverse() }],
  }).length, 0);
  assertIncludes(missingAudioPlanErrors, `Unit ${audioUnitKey} must include an audio support plan for learner-facing text.`);
  const wrongCueLanguageErrors = contentModel.validateContentPackage({
    ...audioPackage,
    audioCues: audioCues.map((cue) => ({ ...cue, language: "ja" })),
  });
  assertIncludes(wrongCueLanguageErrors, `Audio support plan for ${audioUnitKey} must keep every learner-facing cue in the target language en.`);
  const wrongCueKindErrors = contentModel.validateContentPackage({
    ...audioPackage,
    audioSupportPlans: [{
      ...audioPlan,
      vocabularyAudioCueIds: ["audio-sentence-1", ...audioPlan.vocabularyAudioCueIds.slice(1)],
    }],
  });
  assertIncludes(wrongCueKindErrors, `Audio support plan for ${audioUnitKey} must use term cues for vocabulary coverage.`);
  const wrongCueTextErrors = contentModel.validateContentPackage({
    ...audioPackage,
    audioCues: audioCues.map((cue, index) => index === 0 ? { ...cue, text: "not hello" } : cue),
  });
  assertIncludes(wrongCueTextErrors, `Audio support plan for ${audioUnitKey} must match every vocabulary cue to a canonical vocabulary term.`);
  const wrongCueUnitErrors = contentModel.validateContentPackage({
    ...audioPackage,
    audioCues: audioCues.map((cue, index) => index === 0 ? { ...cue, unitKey: "other-unit" } : cue),
  });
  assertIncludes(wrongCueUnitErrors, `Audio support plan for ${audioUnitKey} must use unit-bound cues for vocabulary coverage.`);
  assertIncludes(wrongCueUnitErrors, `Audio support plan for ${audioUnitKey} must keep every learner-facing cue bound to the same unit.`);
  const wrongSentenceTextErrors = contentModel.validateContentPackage({
    ...audioPackage,
    audioCues: audioCues.map((cue, index) => index === 8 ? { ...cue, text: "Not a target sentence." } : cue),
  });
  assertIncludes(wrongSentenceTextErrors, `Audio support plan for ${audioUnitKey} must match every sentence cue to a canonical target sentence.`);
  const invalidGameModeAudioErrors = contentModel.validateContentPackage({
    ...audioPackage,
    audioSupportPlans: [{
      ...audioPlan,
      gameModeAudioCueIds: { "not-a-game-mode": ["audio-term-1"] },
    }],
  });
  assertIncludes(invalidGameModeAudioErrors, `Audio support plan for ${audioUnitKey} references unsupported game mode not-a-game-mode.`);
  const invalidGameCueKindErrors = contentModel.validateContentPackage({
    ...audioPackage,
    audioCues: audioCues.map((cue, index) => index === 0 ? { ...cue, kind: "ui-label" } : cue),
    audioSupportPlans: [{ ...audioPlan, gameModeAudioCueIds: { flashcards: ["audio-term-1"] } }],
  });
  assertIncludes(invalidGameCueKindErrors, `Audio support plan for ${audioUnitKey} must use learner-facing cue kinds for game mode coverage.`);
  const mismatchedGameModeCueErrors = contentModel.validateContentPackage({
    ...audioPackage,
    audioCues: audioCues.map((cue, index) => index === 0 ? { ...cue, gameMode: "memory-match" } : cue),
    audioSupportPlans: [{ ...audioPlan, gameModeAudioCueIds: { flashcards: ["audio-term-1"] } }],
  });
  assertIncludes(mismatchedGameModeCueErrors, "Audio cue audio-term-1 declares game mode memory-match but is used for flashcards coverage.");
  const wrongInstructionFeedbackCueErrors = contentModel.validateContentPackage({
    ...audioPackage,
    audioSupportPlans: [{
      ...audioPlan,
      instructionAudioCueIds: ["audio-term-1"],
      feedbackAudioCueIds: ["audio-sentence-1"],
    }],
  });
  assertIncludes(wrongInstructionFeedbackCueErrors, `Audio support plan for ${audioUnitKey} must use instruction cues for instruction coverage.`);
  assertIncludes(wrongInstructionFeedbackCueErrors, `Audio support plan for ${audioUnitKey} must use feedback cues for feedback coverage.`);
  const duplicateAudioCoverageErrors = contentModel.validateContentPackage({
    ...audioPackage,
    audioSupportPlans: [{
      ...audioPlan,
      vocabularyAudioCueIds: ["audio-term-1", "audio-term-1", ...audioPlan.vocabularyAudioCueIds.slice(2)],
      gameModeAudioCueIds: { "memory-match": ["audio-term-1", "audio-term-1"] },
    }],
  });
  assertIncludes(duplicateAudioCoverageErrors, `Audio support plan for ${audioUnitKey} must not repeat cue audio-term-1 within vocabulary coverage.`);
  assertIncludes(duplicateAudioCoverageErrors, `Audio support plan for ${audioUnitKey} must not repeat cue audio-term-1 within game mode memory-match coverage.`);
  const wrongPlanLanguageErrors = contentPackage.validateContentPackageRuntimeRequest({
    tenantId: "tenant-1", packageId: "audio-package-1", targetLanguage: "ja", contentPackage: audioPackage,
    curatedPathwayReviewed: true, storagePolicyAccepted: false, persistenceReady: false,
    teacherReleaseApproved: false, studentFacingUseRequested: false, qrActivationRequested: false,
  });
  assertIncludes(wrongPlanLanguageErrors, `Unit ${audioUnitKey} audio support plan must match the runtime target language ja.`);
  const invalidPackageTimestampErrors = contentModel.validateContentPackage({
    ...audioPackage,
    meta: { ...audioPackage.meta, createdAt: "not-a-timestamp", updatedAt: "2025-01-01T00:00:00.000Z" },
  });
  assertIncludes(invalidPackageTimestampErrors, "Content package metadata must include a valid created timestamp.");
  const reversedPackageTimestampErrors = contentModel.validateContentPackage({
    ...audioPackage,
    meta: { ...audioPackage.meta, createdAt: "2026-01-02T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
  });
  assertIncludes(reversedPackageTimestampErrors, "Content package metadata updated timestamp must not precede creation.");
  const duplicateAudioCueErrors = contentModel.validateContentPackage({
    ...audioPackage,
    audioCues: [...audioPackage.audioCues, { ...audioPackage.audioCues[0] }],
  });
  assertIncludes(duplicateAudioCueErrors, "Content package must not contain duplicate audio cue audio-term-1.");
  const invalidMediaAssetErrors = contentModel.validateContentPackage({
    ...audioPackage,
    mediaAssets: [{
      mediaAssetId: "", tenantId: "tenant-1", title: "", type: "other-audio", kind: "audio",
      rightsStatus: "owned", durationSeconds: -1, unitKey: audioUnitKey,
    }],
  });
  assertIncludes(invalidMediaAssetErrors, "Media assets must include a non-empty asset identifier.");
  assertIncludes(invalidMediaAssetErrors, "Media asset (unnamed) must include a title.");
  assertIncludes(invalidMediaAssetErrors, "Media asset  must use a non-negative finite duration.");
  const approvedRightsErrors = contentModel.validateContentPackage({
    ...audioPackage,
    meta: { ...audioPackage.meta, reviewStatus: "approved" },
    mediaAssets: [{
      mediaAssetId: "media-unknown-rights", tenantId: "tenant-1", title: "Unreviewed media",
      type: "other-audio", kind: "audio", rightsStatus: "unknown", unitKey: audioUnitKey,
    }],
  });
  assertIncludes(approvedRightsErrors, "Approved content packages cannot include media asset media-unknown-rights with unknown rights.");
  const approvedMediaProvenanceErrors = contentModel.validateContentPackage({
    ...audioPackage,
    meta: { ...audioPackage.meta, reviewStatus: "approved" },
    mediaAssets: [{
      mediaAssetId: "media-no-provenance", tenantId: "tenant-1", title: "Unlocated media",
      type: "other-audio", kind: "audio", rightsStatus: "owned", unitKey: audioUnitKey,
    }],
  });
  assertIncludes(approvedMediaProvenanceErrors, "Approved content packages must identify the owner of media asset media-no-provenance.");
  assertIncludes(approvedMediaProvenanceErrors, "Approved content packages must provide a hosted or local locator for media asset media-no-provenance.");
  const approvedVideoAccessibilityErrors = contentModel.validateContentPackage({
    ...audioPackage,
    meta: { ...audioPackage.meta, reviewStatus: "approved" },
    mediaAssets: [{
      mediaAssetId: "media-video-no-accessibility", tenantId: "tenant-1", title: "Uncaptioned lesson",
      type: "lesson-video", kind: "video", rightsStatus: "owned", sourceUri: "/media/lesson.mp4",
      ownerName: "Tenant media team", unitKey: audioUnitKey,
    }],
  });
  assertIncludes(approvedVideoAccessibilityErrors, "Approved video media asset media-video-no-accessibility must include a poster reference.");
  assertIncludes(approvedVideoAccessibilityErrors, "Approved video media asset media-video-no-accessibility must include a transcript or caption reference.");
  const missingAudioCueMediaErrors = contentModel.validateContentPackage({
    ...audioPackage,
    audioCues: audioPackage.audioCues.map((cue, index) => index === 0 ? { ...cue, mediaAssetId: "missing-audio-media" } : cue),
  });
  assertIncludes(missingAudioCueMediaErrors, "Audio cue audio-term-1 references missing media asset missing-audio-media.");
  const invalidAudioCueMediaBindingErrors = contentModel.validateContentPackage({
    ...audioPackage,
    mediaAssets: [{
      mediaAssetId: "media-wrong-audio-binding", tenantId: "tenant-2", title: "Wrong unit media",
      type: "other-audio", kind: "audio", rightsStatus: "owned", unitKey: "other-unit",
    }],
    audioCues: audioPackage.audioCues.map((cue, index) => index === 0
      ? { ...cue, mediaAssetId: "media-wrong-audio-binding" }
      : cue),
  });
  assertIncludes(invalidAudioCueMediaBindingErrors, "Audio cue audio-term-1 must not reference media asset media-wrong-audio-binding from another tenant.");
  assertIncludes(invalidAudioCueMediaBindingErrors, "Audio cue audio-term-1 must not reference media asset media-wrong-audio-binding from another unit.");
  const videoAudioCueErrors = contentModel.validateContentPackage({
    ...audioPackage,
    mediaAssets: [{
      mediaAssetId: "media-video-binding", tenantId: "tenant-1", title: "Video media",
      type: "lesson-video", kind: "video", rightsStatus: "owned", unitKey: audioUnitKey,
    }],
    audioCues: audioPackage.audioCues.map((cue, index) => index === 0
      ? { ...cue, mediaAssetId: "media-video-binding" }
      : cue),
  });
  assertIncludes(videoAudioCueErrors, "Audio cue audio-term-1 must reference an audio media asset.");
  const missingRecordedAudioLocatorErrors = contentModel.validateContentPackage({
    ...audioPackage,
    audioCues: audioPackage.audioCues.map((cue, index) => index === 0
      ? { ...cue, source: "recorded", mediaAssetId: undefined, sourceUri: undefined, localBundlePath: undefined }
      : cue),
  });
  assertIncludes(missingRecordedAudioLocatorErrors, "Audio cue audio-term-1 with source recorded must include a media asset or delivery locator.");
  const approvedPlaceholderAudioErrors = contentModel.validateContentPackage({
    ...audioPackage,
    meta: { ...audioPackage.meta, reviewStatus: "approved" },
    audioCues: audioPackage.audioCues.map((cue, index) => index === 0 ? { ...cue, source: "placeholder" } : cue),
  });
  assertIncludes(approvedPlaceholderAudioErrors, "Approved content packages cannot include placeholder audio cue audio-term-1.");
  const invalidPlaylistErrors = contentModel.validateContentPackage({
    ...audioPackage,
    playlists: [{
      playlistId: "", tenantId: "tenant-1", title: "", unitKey: audioUnitKey,
      mediaAssetIds: [],
    }],
  });
  assertIncludes(invalidPlaylistErrors, "Playlists must include a non-empty playlist identifier.");
  assertIncludes(invalidPlaylistErrors, "Playlist (unnamed) must include a title.");
  assertIncludes(invalidPlaylistErrors, "Playlist (unnamed) must include at least one media asset.");
  const invalidPlaylistRoleErrors = contentModel.validateContentPackage({
    ...audioPackage,
    playlists: [{
      playlistId: "playlist-background-role", tenantId: "tenant-1", title: "Background media",
      unitKey: audioUnitKey, mediaAssetIds: ["media-background"], playbackContext: "game-background", usageRole: "primary",
    }],
    mediaAssets: [{
      mediaAssetId: "media-background", tenantId: "tenant-1", title: "Background audio", type: "other-audio",
      kind: "audio", rightsStatus: "owned", unitKey: audioUnitKey,
    }],
  });
  assertIncludes(invalidPlaylistRoleErrors, "Playlist playlist-background-role must use the background role for game-background playback.");
  const invalidMediaEnumErrors = contentModel.validateContentPackage({
    ...audioPackage,
    mediaAssets: [{
      mediaAssetId: "media-invalid-enums", tenantId: "tenant-1", title: "Invalid media", type: "not-a-media-type",
      kind: "not-a-media-kind", rightsStatus: "not-a-rights-status", unitKey: audioUnitKey,
    }],
    audioCues: [{
      ...audioCues[0], audioCueId: "audio-invalid-enums", kind: "not-a-cue-kind", source: "not-a-cue-source",
    }],
    playlists: [{
      playlistId: "playlist-invalid-enums", tenantId: "tenant-1", title: "Invalid playlist", unitKey: audioUnitKey,
      mediaAssetIds: ["media-invalid-enums"], usageRole: "not-a-usage-role", playbackContext: "not-a-playback-context",
    }],
  });
  assertIncludes(invalidMediaEnumErrors, "Media asset media-invalid-enums uses an unsupported media type not-a-media-type.");
  assertIncludes(invalidMediaEnumErrors, "Media asset media-invalid-enums uses an unsupported media kind not-a-media-kind.");
  assertIncludes(invalidMediaEnumErrors, "Media asset media-invalid-enums uses an unsupported rights status not-a-rights-status.");
  assertIncludes(invalidMediaEnumErrors, "Audio cue audio-invalid-enums uses an unsupported cue kind not-a-cue-kind.");
  assertIncludes(invalidMediaEnumErrors, "Audio cue audio-invalid-enums uses an unsupported cue source not-a-cue-source.");
  assertIncludes(invalidMediaEnumErrors, "Playlist playlist-invalid-enums uses an unsupported usage role not-a-usage-role.");
  assertIncludes(invalidMediaEnumErrors, "Playlist playlist-invalid-enums uses an unsupported playback context not-a-playback-context.");
  const repeatedPlaylistMediaErrors = contentModel.validateContentPackage({
    ...audioPackage,
    playlists: [{
      playlistId: "playlist-1", tenantId: "tenant-1", title: "Greetings", unitKey: audioUnitKey,
      mediaAssetIds: ["media-1", "media-1"],
    }],
    mediaAssets: [{
      mediaAssetId: "media-1", tenantId: "tenant-1", title: "Greeting audio", type: "other-audio",
      kind: "audio", rightsStatus: "owned", unitKey: audioUnitKey,
    }],
  });
  assertIncludes(repeatedPlaylistMediaErrors, "Playlist playlist-1 must not repeat media asset media-1.");
  const duplicateMultimediaPlanErrors = contentModel.validateContentPackage({
    ...audioPackage,
    multimediaPlans: [
      { unitKey: audioUnitKey, backgroundEnabledByDefault: true },
      { unitKey: audioUnitKey },
    ],
  });
  assertIncludes(duplicateMultimediaPlanErrors, `Content package must not contain duplicate multimedia plan for ${audioUnitKey}.`);
  assertIncludes(duplicateMultimediaPlanErrors, `Multimedia plan for ${audioUnitKey} cannot enable background media by default without a background asset.`);
  const invalidBackgroundGameModeErrors = contentModel.validateContentPackage({
    ...audioPackage,
    multimediaPlans: [{
      unitKey: audioUnitKey,
      allowedBackgroundGameModes: ["memory-match", "memory-match", "not-a-game-mode"],
    }],
  });
  assertIncludes(invalidBackgroundGameModeErrors, `Multimedia plan for ${audioUnitKey} must not repeat allowed background game mode memory-match.`);
  assertIncludes(invalidBackgroundGameModeErrors, `Multimedia plan for ${audioUnitKey} references unsupported background game mode not-a-game-mode.`);
  const disallowedBackgroundGameModeErrors = contentModel.validateContentPackage({
    ...audioPackage,
    multimediaPlans: [{ unitKey: audioUnitKey, allowedBackgroundGameModes: ["flashcards"] }],
  });
  assertIncludes(disallowedBackgroundGameModeErrors, `Multimedia plan for ${audioUnitKey} cannot use background media in game mode flashcards.`);

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
  const invalidTextErrors = aiService.validateAiGenerationServiceRequest({
    ...aiRequest,
    vocabularyTerms: ["hello", "hello", "teacher", "friend", "morning", "afternoon", "please", ""],
    targetSentences: ["", "Thank you, friend."],
  });
  assertIncludes(invalidTextErrors, "Vocabulary terms must not be empty.");
  assertIncludes(invalidTextErrors, "Vocabulary terms must be unique.");
  assertIncludes(invalidTextErrors, "Target sentence structures must not be empty.");
  const invalidUnitStructureErrors = contentModel.validateUnitPayload({
    ...audioUnit,
    unitMeta: { ...audioUnit.unitMeta, level: 0, module: 0, unit: 0, theme: "", gameMode: "", gameFamily: "", engineId: "" },
    visualRules: { ...audioUnit.visualRules, avatarFamily: "", characterFocus: "" },
    teacherLaunchProtocol: { hook: "", activity: "", review: "" },
  });
  assertIncludes(invalidUnitStructureErrors, "Unit level must be an integer between 1 and 8.");
  assertIncludes(invalidUnitStructureErrors, "Unit module must be a positive integer.");
  assertIncludes(invalidUnitStructureErrors, "Unit theme is required.");
  assertIncludes(invalidUnitStructureErrors, "Unit game mode, game family, and parent engine identifiers are required.");
  const invalidUnitCatalogErrors = contentModel.validateUnitPayload({
    ...audioUnit,
    unitMeta: {
      ...audioUnit.unitMeta,
      gameMode: "unsupported-mode",
      gameFamily: "unsupported-family",
      engineId: "unsupported-engine",
    },
  });
  assertIncludes(invalidUnitCatalogErrors, "Unit game mode unsupported-mode is not supported by the curated game catalog.");
  assertIncludes(invalidUnitCatalogErrors, "Unit game family unsupported-family is not supported by the curated game catalog.");
  assertIncludes(invalidUnitCatalogErrors, "Unit parent engine unsupported-engine is not supported by the engine catalog.");
  const invalidUnitCompatibilityErrors = contentModel.validateUnitPayload({
    ...audioUnit,
    unitMeta: {
      ...audioUnit.unitMeta,
      level: 1,
      gameMode: "sentence-builder",
      gameFamily: "vocabulary-matching",
      engineId: "selection",
    },
  });
  assertIncludes(invalidUnitCompatibilityErrors, "Unit game mode sentence-builder must use game family syntax-construction.");
  assertIncludes(invalidUnitCompatibilityErrors, "Unit game mode sentence-builder must use parent engine text-spelling.");
  assertIncludes(invalidUnitCompatibilityErrors, "Unit game mode sentence-builder is not available for level 1.");
  assertIncludes(invalidUnitStructureErrors, "Unit visual rules must include an avatar family and character focus.");
  assertIncludes(invalidUnitStructureErrors, "Teacher launch protocol must include hook, activity, and review copy.");
  const aiResult = aiService.prepareReviewOnlyAiGenerationRequest(aiRequest);
  assertEqual(aiResult.status, "review-only");
  assertEqual(aiResult.providerDispatchAllowed, false);
  assertIncludes(aiResult.blockedActions, "No provider model call");

  const earlyJapanesePlan = {
    unitKey: "tenant-1:curriculum-1:L1:U1", targetLanguage: "en", assistLanguage: "ja",
    scriptPolicy: "reviewed-mixed-script", levelBand: "foundation", source: "human-reviewed",
    reviewStatus: "reviewed", studentVisibility: "student-toggle", vocabularyGlosses: { hello: "先生" },
    sentenceGlosses: ["こんにちは。", "ありがとう。"],
  };
  const earlyJapaneseErrors = contentModel.validateAssistLanguageScriptPolicy(earlyJapanesePlan);
  assertIncludes(earlyJapaneseErrors, "Japanese assist language plan for tenant-1:curriculum-1:L1:U1 must use hiragana-only policy for foundation level bands.");

  const hiraganaOnlyPlan = {
    unitKey: "tenant-1:curriculum-1:L1:U1", targetLanguage: "en", assistLanguage: "ja",
    scriptPolicy: "hiragana-only", levelBand: "foundation", source: "human-reviewed",
    reviewStatus: "reviewed", studentVisibility: "student-toggle", vocabularyGlosses: { hello: "先生" },
    sentenceGlosses: ["こんにちは。", "ありがとう。"],
  };
  const hiraganaOnlyErrors = contentModel.validateAssistLanguageScriptPolicy(hiraganaOnlyPlan);
  assertIncludes(hiraganaOnlyErrors, "Hiragana-only assist language plan for tenant-1:curriculum-1:L1:U1 must not include katakana or kanji.");

  const laterJapanesePlan = {
    unitKey: "tenant-1:curriculum-1:L4:U1", targetLanguage: "en", assistLanguage: "ja",
    scriptPolicy: "reviewed-mixed-script", levelBand: "silver-or-later", source: "human-reviewed",
    reviewStatus: "reviewed", studentVisibility: "student-toggle", vocabularyGlosses: { hello: "先生" },
    sentenceGlosses: ["こんにちは。", "ありがとう。"],
  };
  assertEqual(contentModel.validateAssistLanguageScriptPolicy(laterJapanesePlan).length, 0);

  const progressionSession = contentModel.createLaunchSession({
    launchCode: "launch-deterministic-1", tenantId: "tenant-1", curriculumId: "curriculum-1",
    unitKey: "tenant-1:curriculum-1:L1:U1", entryMode: "flashcards",
    recommendedNextModes: ["match-up", "memory-match"], openedAt: "2026-01-01T00:00:00.000Z",
  });
  const initialProgression = contentModel.getInitialStudentProgression({
    studentSessionId: "launch-deterministic-1:student-1", launchSession: progressionSession,
  });
  assertEqual(initialProgression.currentStep, "entry-practice");
  assertEqual(initialProgression.unlockedGameModes.length, 1);
  const unlockedProgression = contentModel.completeEntryPractice({
    progression: initialProgression, launchSession: progressionSession, occurredAt: "2026-01-01T00:05:00.000Z",
  });
  assertEqual(unlockedProgression.currentStep, "recommended-game");
  assertEqual(unlockedProgression.completedGameModes.includes("flashcards"), true);
  assertEqual(unlockedProgression.unlockedGameModes.includes("memory-match"), true);

  const dustInput = { masteredTerms: 12, totalTerms: 12, masteredSyntaxChecks: 2, totalSyntaxChecks: 2, bonusRatio: 1 };
  const dustFirst = contentModel.calculateStarDust(dustInput);
  const dustSecond = contentModel.calculateStarDust(dustInput);
  assertEqual(JSON.stringify(dustFirst), JSON.stringify(dustSecond));
  assertEqual(dustFirst.total, 1000);
  assertEqual(contentModel.calculateStarDust({ ...dustInput, masteredTerms: 20, masteredSyntaxChecks: 20, bonusRatio: 3 }).total, 1000);
  assertEqual(contentModel.calculateStarDust({ masteredTerms: -2, totalTerms: 12, masteredSyntaxChecks: -1, totalSyntaxChecks: 2, bonusRatio: -1 }).total, 0);
  assertEqual(contentModel.calculateStarDust({ masteredTerms: Number.POSITIVE_INFINITY, totalTerms: 12, masteredSyntaxChecks: 2, totalSyntaxChecks: 2, bonusRatio: Number.NaN }).total, 300);

  const microphoneRequest = {
    tenantId: "tenant-1", packageId: "package-1", entitlementId: "entitlement-mic-1",
    feature: "microphone-practice", requestedState: "enabled", mode: "review-only", packageTier: "premium",
    teacherApprovalAccepted: true, schoolPolicyAccepted: true, privacyPolicyAccepted: true,
    costPolicyAccepted: true, persistenceReady: true, releaseApprovalAccepted: true,
    allowedLevelsDeclared: true, usageLimitDeclared: true, targetLanguageAudioReady: true,
  };
  const microphoneErrors = entitlement.validateEntitlementRuntimeRequest(microphoneRequest);
  assertIncludes(microphoneErrors, "microphone practice remains disabled in review-only mode");
  assertEqual(entitlement.createReviewOnlyEntitlementRuntimeAdapter().execute(microphoneRequest).sideEffect, "none");

  const premiumTutorRequest = {
    tenantId: "tenant-1", packageId: "package-1", entitlementId: "entitlement-ai-1",
    feature: "ai-tutor", requestedState: "enabled", mode: "hosted-managed", packageTier: "premium",
    teacherApprovalAccepted: true, schoolPolicyAccepted: true, privacyPolicyAccepted: true,
    costPolicyAccepted: true, persistenceReady: true, releaseApprovalAccepted: true,
    allowedLevelsDeclared: true, usageLimitDeclared: true, targetLanguageAudioReady: true,
  };
  assertEqual(entitlement.validateEntitlementRuntimeRequest(premiumTutorRequest).length, 0);
  assertEqual(entitlement.createReviewOnlyEntitlementRuntimeAdapter().execute(premiumTutorRequest).sideEffect, "none");

  console.log("PASS runtime behavior harness exercises AI authoring, language policy, package, launch, assignment, persistence, report, progression, recovery, reward, entitlement, asset, source, and release boundaries.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function assertIncludes(values, expected) {
  if (!values.includes(expected)) throw new Error(`Expected runtime behavior marker: ${expected}`);
}

function assertEqual(actual, expected) {
  if (actual !== expected) throw new Error(`Expected ${expected}, received ${actual}`);
}
