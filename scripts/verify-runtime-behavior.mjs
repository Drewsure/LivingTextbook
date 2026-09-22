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
const adapterOutput = join(output, "adapter");

try {
  writeFileSync(join(output, "package.json"), '{"type":"commonjs"}\n', "utf8");
  const tsc = join(root, "node_modules", "typescript", "bin", "tsc");
  const compile = spawnSync(process.execPath, [
    tsc,
    "--module", "commonjs",
    "--target", "ES2022",
    "--moduleResolution", "node",
    "--resolveJsonModule",
    "--esModuleInterop",
    "--skipLibCheck",
    "--rootDir", join(root, "packages", "content-model", "src"),
    "--outDir", output,
    "packages/content-model/src/progressEventTaxonomy.ts",
    "packages/content-model/src/canonicalGameIntegration.ts",
    "packages/content-model/src/canonicalGameReport.ts",
    "packages/content-model/src/progressionRuntime.ts",
    "packages/content-model/src/recoveryRuntime.ts",
    "packages/content-model/src/rewardRuntime.ts",
    "packages/content-model/src/entitlementRuntime.ts",
    "packages/content-model/src/assetRuntime.ts",
    "packages/content-model/src/sourceRuntime.ts",
    "packages/content-model/src/sourceExtractionPreview.ts",
    "packages/content-model/src/sourcePackageAssembly.ts",
    "packages/content-model/src/packageApprovalLedger.ts",
    "packages/content-model/src/packageReadinessReconciliation.ts",
    "packages/content-model/src/packageReadinessPersistence.ts",
    "packages/content-model/src/releaseRuntime.ts",
    "packages/content-model/src/contentPackageRuntime.ts",
    "packages/content-model/src/launchRuntime.ts",
    "packages/content-model/src/assignmentRuntime.ts",
    "packages/content-model/src/persistenceRuntime.ts",
    "packages/content-model/src/hostedProgressionPersistence.ts",
    "packages/content-model/src/persistenceRecords.ts",
    "packages/content-model/src/persistenceAdapter.ts",
    "packages/content-model/src/persistenceConsistency.ts",
    "packages/content-model/src/persistenceHandoff.ts",
    "packages/content-model/src/pilotHandoff.ts",
    "packages/content-model/src/reportRuntime.ts",
    "packages/content-model/src/teacherReportPersistenceRuntime.ts",
    "packages/content-model/src/teacherLaunchReportAggregation.ts",
    "packages/content-model/src/teacherReportPackageSnapshot.ts",
    "packages/content-model/src/teacherReportPackageSnapshotRuntime.ts",
    "packages/content-model/src/aiPrototypeEvidenceAlignment.ts",
    "packages/content-model/src/aiPrototypeReturnedPackageManifest.ts",
    "packages/content-model/src/aiPrototypeReturnedPackageAlignment.ts",
    "packages/content-model/src/aiPrototypeIntegrationReadinessGate.ts",
    "packages/content-model/src/aiPrototypeCodexIntegrationDecision.ts",
    "packages/content-model/src/aiGeneratedDraftPayload.ts",
    "packages/content-model/src/prototypeIntakeAlert.ts",
    "packages/content-model/src/prototypeIntakeReadinessSummary.ts",
    "packages/content-model/src/prototypeReturnReadiness.ts",
    "packages/content-model/src/prototypeReturnReadinessSummary.ts",
    "packages/content-model/src/reviewSurfaceScope.ts",
    "packages/content-model/src/phaserCandidateContractReview.ts",
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
      resolveJsonModule: true,
      esModuleInterop: true,
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

  const adapterTsconfig = join(output, "adapter-tsconfig.json");
  writeFileSync(adapterTsconfig, JSON.stringify({
    compilerOptions: {
      module: "commonjs",
      target: "ES2022",
      moduleResolution: "node",
      resolveJsonModule: true,
      esModuleInterop: true,
      skipLibCheck: true,
      rootDir: root,
      outDir: adapterOutput,
      baseUrl: root,
      paths: { "@living-textbook/content-model": ["packages/content-model/src/index.ts"] },
    },
    files: [
      join(root, "apps", "web", "src", "features", "progression", "localProgressionAdapter.ts"),
      join(root, "packages", "content-model", "src", "index.ts"),
    ],
  }, null, 2), "utf8");
  const adapterCompile = spawnSync(process.execPath, [tsc, "-p", adapterTsconfig], { cwd: root, encoding: "utf8" });
  if (adapterCompile.status !== 0) {
    process.stdout.write(adapterCompile.stdout);
    process.stderr.write(adapterCompile.stderr);
    process.exit(1);
  }

  const contentModelAlias = join(aiOutput, "node_modules", "@living-textbook", "content-model");
  mkdirSync(contentModelAlias, { recursive: true });
  writeFileSync(join(contentModelAlias, "package.json"), JSON.stringify({
    name: "@living-textbook/content-model",
    main: "../../../packages/content-model/src/index.js",
  }), "utf8");

  const adapterContentModelAlias = join(adapterOutput, "node_modules", "@living-textbook", "content-model");
  mkdirSync(adapterContentModelAlias, { recursive: true });
  writeFileSync(join(adapterContentModelAlias, "package.json"), JSON.stringify({
    name: "@living-textbook/content-model",
    main: "../../../packages/content-model/src/index.js",
  }), "utf8");

  const progression = require(join(output, "progressionRuntime.js"));
  const recovery = require(join(output, "recoveryRuntime.js"));
  const reward = require(join(output, "rewardRuntime.js"));
  const entitlement = require(join(output, "entitlementRuntime.js"));
  const asset = require(join(output, "assetRuntime.js"));
  const source = require(join(output, "sourceRuntime.js"));
  const sourceExtractionPreview = require(join(output, "sourceExtractionPreview.js"));
  const sourcePackageAssembly = require(join(output, "sourcePackageAssembly.js"));
  const packageApprovalLedger = require(join(output, "packageApprovalLedger.js"));
  const packageReadinessReconciliation = require(join(output, "packageReadinessReconciliation.js"));
  const packageReadinessPersistence = require(join(output, "packageReadinessPersistence.js"));
  const release = require(join(output, "releaseRuntime.js"));
  const contentPackage = require(join(output, "contentPackageRuntime.js"));
  const launch = require(join(output, "launchRuntime.js"));
  const assignment = require(join(output, "assignmentRuntime.js"));
  const assignmentPlan = require(join(output, "teacherAssignment.js"));
  const persistence = require(join(output, "persistenceRuntime.js"));
  const hostedProgression = require(join(output, "hostedProgressionPersistence.js"));
  const persistenceRecords = require(join(output, "persistenceRecords.js"));
  const persistenceAdapter = require(join(output, "persistenceAdapter.js"));
  const persistenceConsistency = require(join(output, "persistenceConsistency.js"));
  const persistenceHandoff = require(join(output, "persistenceHandoff.js"));
  const pilotHandoff = require(join(output, "pilotHandoff.js"));
  const report = require(join(output, "reportRuntime.js"));
  const teacherReportPersistence = require(join(output, "teacherReportPersistenceRuntime.js"));
  const teacherLaunchReportAggregation = require(join(output, "teacherLaunchReportAggregation.js"));
  const teacherReportPackageSnapshot = require(join(output, "teacherReportPackageSnapshot.js"));
  const teacherReportPackageSnapshotRuntime = require(join(output, "teacherReportPackageSnapshotRuntime.js"));
  const prototypeAlignment = require(join(output, "aiPrototypeEvidenceAlignment.js"));
  const returnedPackageManifest = require(join(output, "aiPrototypeReturnedPackageManifest.js"));
  const returnedPackageAlignment = require(join(output, "aiPrototypeReturnedPackageAlignment.js"));
  const integrationReadiness = require(join(output, "aiPrototypeIntegrationReadinessGate.js"));
  const codexDecision = require(join(output, "aiPrototypeCodexIntegrationDecision.js"));
  const prototypeIntakeAlert = require(join(output, "prototypeIntakeAlert.js"));
  const prototypeIntakeReadinessSummary = require(join(output, "prototypeIntakeReadinessSummary.js"));
  const prototypeReturnReadiness = require(join(output, "prototypeReturnReadiness.js"));
  const prototypeReturnReadinessSummary = require(join(output, "prototypeReturnReadinessSummary.js"));
  const reviewSurfaceScope = require(join(output, "reviewSurfaceScope.js"));
  const phaserCandidateReview = require(join(output, "phaserCandidateContractReview.js"));
  const contentModel = require(join(output, "index.js"));
  const aiDraftPayload = require(join(output, "aiGeneratedDraftPayload.js"));
  const canonicalGame = require(join(output, "canonicalGameIntegration.js"));
  const canonicalGameReport = require(join(output, "canonicalGameReport.js"));
  const aiService = require(join(aiOutput, "apps", "ai-service", "src", "index.js"));
  const progressionAdapter = require(join(adapterOutput, "apps", "web", "src", "features", "progression", "localProgressionAdapter.js"));

  const continuityEnvelope = {
    continuityId: "continuity-1",
    tenantId: "tenant-1",
    packageId: "package-1",
    launchCode: "launch-1",
    studentSessionId: "session-1",
    unitKey: "tenant-1:curriculum-1:L1:U1",
    sourceRoute: "/launch/demo-unit-1",
    destinationRoute: "/memory/demo-unit-1",
    issuedAt: "2026-01-01T00:05:00.000Z",
    eventCursor: 7,
    mode: "review-only",
    snapshot: {
      tenantId: "tenant-1",
      studentSessionId: "session-1",
      launchCode: "launch-1",
      unitKey: "tenant-1:curriculum-1:L1:U1",
      entryMode: "flashcards",
      currentStep: "recommended-game",
      unlockedGameModes: ["flashcards", "memory-match"],
      completedGameModes: ["flashcards"],
      earnedStarDust: 300,
      masteryStatus: "in-progress",
      lastEventAt: "2026-01-01T00:04:00.000Z",
    },
    rawLearnerAudioIncluded: false,
    learnerTranscriptIncluded: false,
    supportLanguageEvidenceIncluded: false,
    mediaOnlyEvidenceIncluded: false,
  };
  assertEqual(progression.validateProgressionContinuityEnvelope(continuityEnvelope).length, 0);
  assertIncludes(
    progression.validateProgressionContinuityRuntimeRequest({
      expectedTenantId: "tenant-2",
      expectedPackageId: "package-1",
      expectedLaunchCode: "launch-1",
      expectedStudentSessionId: "session-1",
      envelope: continuityEnvelope,
    }),
    "Progression continuity tenant must match the expected tenant.",
  );
  assertIncludes(
    progression.validateProgressionContinuityEnvelope({
      ...continuityEnvelope,
      supportLanguageEvidenceIncluded: true,
    }),
    "Progression continuity supportLanguageEvidenceIncluded must remain false.",
  );
  assertIncludes(
    progression.validateProgressionContinuityEnvelope({
      ...continuityEnvelope,
      snapshot: { ...continuityEnvelope.snapshot, completedGameModes: ["quiz"] },
    }),
    "Progression continuity snapshot completedGameModes must be unlocked.",
  );
  assertIncludes(
    progression.validateProgressionContinuityEnvelope({
      ...continuityEnvelope,
      snapshot: { ...continuityEnvelope.snapshot, tenantId: "tenant-2" },
    }),
    "Progression continuity snapshot tenantId must match the envelope.",
  );
  assertEqual(
    progression.createReviewOnlyProgressionContinuityAdapter().execute({
      expectedTenantId: "tenant-1",
      expectedPackageId: "package-1",
      expectedLaunchCode: "launch-1",
      expectedStudentSessionId: "session-1",
      envelope: continuityEnvelope,
    }).sideEffect,
    "none",
  );
  assertIncludes(
    progression.validateProgressionContinuityRuntimeRequest({
      expectedTenantId: undefined,
      expectedPackageId: "package-1",
      expectedLaunchCode: "launch-1",
      expectedStudentSessionId: "session-1",
      envelope: continuityEnvelope,
    }),
    "expectedTenantId is required.",
  );
  assertEqual(
    contentModel.validateProgressionLaunchIdentity(
      { unitKey: "tenant-1:curriculum-1:L1:U1", launchCode: "launch-1", studentSessionId: "session-1" },
      { unitKey: "tenant-1:curriculum-1:L1:U1", launchCode: "launch-1", studentSessionId: "session-1" },
    ).length,
    0,
  );
  const mismatchedProgressionIdentityErrors = contentModel.validateProgressionLaunchIdentity(
    { unitKey: "tenant-1:curriculum-1:L1:U1", launchCode: "launch-2", studentSessionId: "session-1" },
    { unitKey: "tenant-1:curriculum-1:L1:U1", launchCode: "launch-1", studentSessionId: "session-1" },
  );
  assertIncludes(mismatchedProgressionIdentityErrors, "Progression launch identity launchCode must match; progression has launch-2, launch session has launch-1.");

  const canonicalReplaySeed = "replay-v1:tenant-1:curriculum-1:L1:U1:flashcards";
  const canonicalEventContext = {
    unitKey: "tenant-1:curriculum-1:L1:U1",
    gameMode: "flashcards",
    launchCode: "launch-1",
    studentSessionId: "session-1",
    occurredAt: new Date().toISOString(),
  };
  const canonicalEvents = [
    { ...canonicalEventContext, type: "game_started", metadata: { tenantId: "tenant-1", replaySeed: canonicalReplaySeed } },
    { ...canonicalEventContext, type: "round_shown", metadata: { tenantId: "tenant-1", replaySeed: canonicalReplaySeed } },
    { ...canonicalEventContext, type: "answer_submitted", metadata: { tenantId: "tenant-1", replaySeed: canonicalReplaySeed } },
    { ...canonicalEventContext, type: "answer_result", metadata: { tenantId: "tenant-1", replaySeed: canonicalReplaySeed, correct: true } },
    { ...canonicalEventContext, type: "audio_requested", metadata: { tenantId: "tenant-1", replaySeed: canonicalReplaySeed, masteryCreditAllowed: false, cueKind: "instruction", cueText: "Listen to the word.", language: "en" } },
    {
      ...canonicalEventContext,
      type: "mastery_updated",
      metadata: { tenantId: "tenant-1", replaySeed: canonicalReplaySeed, completed: true, earnedStarDust: 200, scoringProfileId: "entry-vocabulary-practice", parentEngine: "selection" },
    },
    { ...canonicalEventContext, type: "game_completed", metadata: { tenantId: "tenant-1", replaySeed: canonicalReplaySeed, earnedStarDust: 200, scoringProfileId: "entry-vocabulary-practice", parentEngine: "selection" } },
  ];
  const canonicalReport = canonicalGame.validateCanonicalGameEventSequence(
    canonicalEvents,
    "flashcards",
    "tenant-1",
    200,
    { unitKey: canonicalEventContext.unitKey, launchCode: canonicalEventContext.launchCode, studentSessionId: canonicalEventContext.studentSessionId },
  );
  assertEqual(canonicalReport.valid, true);
  const audioBeforeRoundErrors = canonicalGame.validateCanonicalGameEventSequence(
    [
      canonicalEvents[0],
      canonicalEvents[4],
      canonicalEvents[1],
      canonicalEvents[2],
      canonicalEvents[3],
      canonicalEvents[5],
      canonicalEvents[6],
    ],
    "flashcards",
  ).errors;
  assertIncludes(audioBeforeRoundErrors, "Canonical game event sequence must include audio_requested evidence after round_shown.");
  const audioAfterCompletionErrors = canonicalGame.validateCanonicalGameEventSequence(
    [...canonicalEvents, { ...canonicalEvents[4], occurredAt: "2026-09-14T00:00:07.000Z" }],
    "flashcards",
  ).errors;
  assertIncludes(audioAfterCompletionErrors, "Canonical game event sequence must not include audio_requested after game_completed.");
  const audioAfterMasteryErrors = canonicalGame.validateCanonicalGameEventSequence(
    [
      canonicalEvents[0],
      canonicalEvents[1],
      canonicalEvents[2],
      canonicalEvents[3],
      canonicalEvents[5],
      { ...canonicalEvents[4], occurredAt: "2026-09-14T00:00:05.500Z" },
      canonicalEvents[6],
    ],
    "flashcards",
  ).errors;
  assertIncludes(audioAfterMasteryErrors, "Canonical game event sequence must not include audio_requested after mastery_updated.");
  const overCapCanonicalErrors = canonicalGame.validateCanonicalGameEventSequence(
    canonicalEvents.map((event) => (
      ["mastery_updated", "game_completed"].includes(event.type)
        ? { ...event, metadata: { ...event.metadata, earnedStarDust: 301 } }
        : event
    )),
    "flashcards",
  ).errors;
  assertIncludes(overCapCanonicalErrors, "Canonical game mastery_updated event must not exceed 300 Star Dust for game mode flashcards; found 301.");
  assertIncludes(overCapCanonicalErrors, "Canonical game game_completed event must not exceed 300 Star Dust for game mode flashcards; found 301.");
  assertIncludes(
    canonicalGame.validateCanonicalGameEventSequence(
      canonicalEvents.map((event) => event.type === "game_started" ? { ...event, metadata: { ...event.metadata, tenantId: undefined } } : event),
      "flashcards",
    ).errors,
    "Canonical game event game_started must include tenantId metadata.",
  );
  assertIncludes(
    canonicalGame.validateCanonicalGameEventSequence(
      canonicalEvents.map((event) => event.type === "game_started" ? { ...event, launchCode: undefined } : event),
      "flashcards",
    ).errors,
    "Canonical game event game_started must include launch identity.",
  );
  const mixedReplayErrors = canonicalGame.validateCanonicalGameEventSequence(
    canonicalEvents.map((event) => event.type === "audio_requested" ? { ...event, metadata: { ...event.metadata, replaySeed: "replay-v1:other-layout" } } : event),
    "flashcards",
  ).errors;
  assertEqual(mixedReplayErrors.some((error) => error.includes("audio_requested must preserve replay seed") && error.includes("replay-v1:other-layout")), true);
  assertIncludes(
    canonicalGame.validateCanonicalGameEventSequence(
      canonicalEvents.map((event) => event.type === "game_completed" ? { ...event, metadata: { ...event.metadata, scoringProfileId: undefined } } : event),
      "flashcards",
    ).errors,
    "Canonical game game_completed event must identify its deterministic scoring profile.",
  );
  assertIncludes(
    canonicalGame.validateCanonicalGameEventSequence(
      canonicalEvents.map((event) => event.type === "game_completed" ? { ...event, metadata: { ...event.metadata, scoringProfileId: "different-profile" } } : event),
      "flashcards",
    ).errors,
    "Canonical game mastery and completion scoring profiles must agree; found entry-vocabulary-practice and different-profile.",
  );
  const wrongModeScoringProfileErrors = canonicalGame.validateCanonicalGameEventSequence(
    canonicalEvents.map((event) => ["mastery_updated", "game_completed"].includes(event.type)
      ? { ...event, metadata: { ...event.metadata, scoringProfileId: "pairing-reinforcement-v1" } }
      : event),
    "flashcards",
  ).errors;
  assertIncludes(
    wrongModeScoringProfileErrors,
    "Canonical game mastery_updated event must use scoring profile entry-vocabulary-practice for game mode flashcards; found pairing-reinforcement-v1.",
  );
  assertIncludes(
    wrongModeScoringProfileErrors,
    "Canonical game game_completed event must use scoring profile entry-vocabulary-practice for game mode flashcards; found pairing-reinforcement-v1.",
  );
  const missingParentEngineErrors = canonicalGame.validateCanonicalGameEventSequence(
    canonicalEvents.map((event) => event.type === "mastery_updated"
      ? { ...event, metadata: { ...event.metadata, parentEngine: undefined } }
      : event),
    "flashcards",
  ).errors;
  assertIncludes(
    missingParentEngineErrors,
    "Canonical game mastery_updated event must identify its parent engine.",
  );
  const wrongParentEngineErrors = canonicalGame.validateCanonicalGameEventSequence(
    canonicalEvents.map((event) => ["mastery_updated", "game_completed"].includes(event.type)
      ? { ...event, metadata: { ...event.metadata, parentEngine: "pairing" } }
      : event),
    "flashcards",
  ).errors;
  assertIncludes(
    wrongParentEngineErrors,
    "Canonical game mastery_updated event must use parent engine selection for game mode flashcards; found pairing.",
  );
  assertIncludes(
    wrongParentEngineErrors,
    "Canonical game game_completed event must use parent engine selection for game mode flashcards; found pairing.",
  );
  const missingCanonicalReplayErrors = canonicalGame.validateCanonicalGameEventSequence(
    canonicalEvents.map((event) => event.type === "answer_result" ? { ...event, metadata: { ...event.metadata, replaySeed: undefined } } : event),
    "flashcards",
  ).errors;
  assertIncludes(missingCanonicalReplayErrors, "Canonical game event answer_result must carry replay-v1 evidence.");
  const emptyCanonicalReplayErrors = canonicalGame.validateCanonicalGameEventSequence(
    canonicalEvents.map((event) => event.type === "round_shown" ? { ...event, metadata: { ...event.metadata, replaySeed: "replay-v1:" } } : event),
    "flashcards",
  ).errors;
  assertIncludes(emptyCanonicalReplayErrors, "Canonical game event round_shown must carry replay-v1 evidence.");
  const malformedCanonicalIdentityErrors = canonicalGame.validateCanonicalGameEventSequence(
    canonicalEvents.map((event) => event.type === "round_shown" ? { ...event, unitKey: undefined } : event),
    "flashcards",
  ).errors;
  assertIncludes(malformedCanonicalIdentityErrors, "Canonical game event round_shown must include unit identity.");
  const malformedCanonicalShapeErrors = canonicalGame.validateCanonicalGameEventSequence(
    [null, ...canonicalEvents],
    "flashcards",
  ).errors;
  assertIncludes(malformedCanonicalShapeErrors, "Canonical game event sequence contains malformed event entries.");
  assertIncludes(
    canonicalGame.validateCanonicalGameEventSequence(null, "flashcards").errors,
    "Canonical game event sequence must be provided as an array.",
  );
  const postCompletionGameplayErrors = canonicalGame.validateCanonicalGameEventSequence(
    [...canonicalEvents, { ...canonicalEvents[1], occurredAt: canonicalEvents[6].occurredAt }],
    "flashcards",
  ).errors;
  assertIncludes(
    postCompletionGameplayErrors,
    "Canonical game event sequence must not include round_shown after game_completed.",
  );
  const unsupportedCanonicalEventErrors = canonicalGame.validateCanonicalGameEventSequence(
    canonicalEvents.map((event) => event.type === "round_shown" ? { ...event, type: "unsupported_event" } : event),
    "flashcards",
  ).errors;
  assertIncludes(
    unsupportedCanonicalEventErrors,
    "Canonical game event sequence contains unsupported event type unsupported_event.",
  );

  const suppliedReplaySeed = "replay-v1:platform-supplied-memory-match-seed";
  assertEqual(
    contentModel.resolveCanonicalGameReplaySeed({
      unitKey: "tenant-1:curriculum-1:L1:U1",
      gameMode: "memory-match",
      platformReplaySeed: suppliedReplaySeed,
    }),
    suppliedReplaySeed,
  );
  assertEqual(
    contentModel.resolveCanonicalGameReplaySeed({
      unitKey: "tenant-1:curriculum-1:L1:U1",
      gameMode: "memory-match",
      platformReplaySeed: "replay-v1:",
    }),
    contentModel.createCanonicalGameReplaySeed({ unitKey: "tenant-1:curriculum-1:L1:U1", gameMode: "memory-match" }),
  );
  const adapterLaunchSession = {
    tenantId: "tenant-1",
    unitKey: "tenant-1:curriculum-1:L1:U1",
    launchCode: "launch-1",
    studentSessionId: "session-1",
    entryMode: "flashcards",
    accessMode: "teacher-qr",
  };
  const adapterProgression = {
    unitKey: adapterLaunchSession.unitKey,
    launchCode: adapterLaunchSession.launchCode,
    studentSessionId: adapterLaunchSession.studentSessionId,
    unlockedGameModes: ["memory-match"],
    completedGameModes: [],
    earnedStarDust: 0,
    masteryStatus: "in-progress",
    lastEventAt: "2026-01-01T00:00:00.000Z",
  };
  const entryLaunchSession = {
    ...adapterLaunchSession,
    entryMode: "flashcards",
    recommendedNextModes: ["match-up", "memory-match"],
  };
  const entryUnit = {
    pedagogicalPayload: {
      vocabularyTerms: ["hello", "goodbye", "teacher", "friend", "morning", "afternoon", "please", "thank you"],
      targetSentences: ["Hello, teacher.", "Thank you, friend."],
    },
  };
  const partialEntry = progressionAdapter.completeFlashcardEntryPractice({
    progression: { ...adapterProgression, unlockedGameModes: ["flashcards", "memory-match"] },
    launchSession: entryLaunchSession,
    unit: entryUnit,
    occurredAt: "2026-01-01T00:00:30.000Z",
    targetLanguageEngagedItems: 8,
    requiredTargetLanguageItems: 10,
  });
  assertEqual(partialEntry.completed, false);
  assertEqual(partialEntry.blockedReason, "target-language-gate");
  assertEqual(partialEntry.events.length, 0);
  const completedEntry = progressionAdapter.completeFlashcardEntryPractice({
    progression: { ...adapterProgression, unlockedGameModes: ["flashcards", "memory-match"] },
    launchSession: entryLaunchSession,
    unit: entryUnit,
    occurredAt: "2026-01-01T00:00:40.000Z",
    targetLanguageEngagedItems: 10,
    requiredTargetLanguageItems: 10,
  });
  assertEqual(completedEntry.completed, true);
  assertEqual(completedEntry.dust.total, 300);
  assertEqual(completedEntry.progression.completedGameModes.includes("flashcards"), true);
  assertEqual(completedEntry.events[0]?.type, "entry_practice_completed");
  assertEqual(completedEntry.events[0]?.metadata?.supportLanguageUnlockAllowed, false);
  assertEqual(completedEntry.events[0]?.metadata?.targetLanguageGateSatisfied, undefined);
  assertEqual(completedEntry.events.slice(1).every((event) => event.metadata?.targetLanguageGateSatisfied === true), true);
  assertEqual(completedEntry.events.slice(1).every((event) => event.metadata?.supportLanguageUnlockAllowed === false), true);
  const repeatedEntry = progressionAdapter.completeFlashcardEntryPractice({
    progression: completedEntry.progression,
    launchSession: entryLaunchSession,
    unit: entryUnit,
    occurredAt: "2026-01-01T00:00:50.000Z",
    targetLanguageEngagedItems: 10,
    requiredTargetLanguageItems: 10,
  });
  assertEqual(repeatedEntry.completed, true);
  assertEqual(repeatedEntry.dust.total, 0);
  assertEqual(repeatedEntry.events.length, 0);
  assertEqual(repeatedEntry.progression.earnedStarDust, completedEntry.progression.earnedStarDust);
  const adapterStarted = progressionAdapter.startUnlockedGameMode({
    progression: adapterProgression,
    launchSession: adapterLaunchSession,
    gameMode: "memory-match",
    occurredAt: "2026-01-01T00:01:00.000Z",
    replaySeed: suppliedReplaySeed,
  });
  const adapterRound = progressionAdapter.createGameInteractionEvent({
    type: "round_shown",
    progression: adapterProgression,
    launchSession: adapterLaunchSession,
    gameMode: "memory-match",
    occurredAt: "2026-01-01T00:02:00.000Z",
    replaySeed: suppliedReplaySeed,
  });
  const adapterAudio = progressionAdapter.createAudioRequestedEvent({
    progression: adapterProgression,
    launchSession: adapterLaunchSession,
    gameMode: "memory-match",
    occurredAt: "2026-01-01T00:03:00.000Z",
    replaySeed: suppliedReplaySeed,
    cueKind: "instruction",
    cueText: "Find the matching pair.",
    language: "en",
  });
  const adapterCompletion = progressionAdapter.completeGameMode({
    progression: adapterProgression,
    launchSession: adapterLaunchSession,
    gameMode: "memory-match",
    earnedStarDust: 200,
    occurredAt: "2026-01-01T00:04:00.000Z",
    replaySeed: suppliedReplaySeed,
  });
  assertEqual(adapterStarted?.metadata?.replaySeed, suppliedReplaySeed);
  assertEqual(adapterRound.metadata?.replaySeed, suppliedReplaySeed);
  assertEqual(adapterAudio.metadata?.replaySeed, suppliedReplaySeed);
  assertEqual(adapterCompletion.event?.metadata?.replaySeed, suppliedReplaySeed);

  const overCapAdapterCompletion = progressionAdapter.completeGameMode({
    progression: adapterProgression,
    launchSession: adapterLaunchSession,
    gameMode: "memory-match",
    earnedStarDust: 999,
    occurredAt: "2026-01-01T00:04:00.000Z",
    replaySeed: suppliedReplaySeed,
  });
  assertEqual(overCapAdapterCompletion.earnedStarDust, 200);
  assertEqual(overCapAdapterCompletion.event?.metadata?.earnedStarDust, 200);

  const nearUnitCapAdapterCompletion = progressionAdapter.completeGameMode({
    progression: { ...adapterProgression, earnedStarDust: 950 },
    launchSession: adapterLaunchSession,
    gameMode: "memory-match",
    earnedStarDust: 999,
    occurredAt: "2026-01-01T00:04:00.000Z",
    replaySeed: suppliedReplaySeed,
  });
  assertEqual(nearUnitCapAdapterCompletion.earnedStarDust, 50);

  const metadataSeedRound = progressionAdapter.createGameInteractionEvent({
    type: "round_shown",
    progression: adapterProgression,
    launchSession: adapterLaunchSession,
    gameMode: "memory-match",
    occurredAt: "2026-01-01T00:02:00.000Z",
    metadata: { replaySeed: suppliedReplaySeed },
  });
  const metadataSeedCompletion = progressionAdapter.completeGameMode({
    progression: adapterProgression,
    launchSession: adapterLaunchSession,
    gameMode: "memory-match",
    earnedStarDust: 200,
    occurredAt: "2026-01-01T00:04:00.000Z",
    metadata: { replaySeed: suppliedReplaySeed },
  });
  assertEqual(metadataSeedRound.metadata?.replaySeed, suppliedReplaySeed);
  assertEqual(metadataSeedCompletion.event?.metadata?.replaySeed, suppliedReplaySeed);
  const normalizedReplaySeed = "replay-v1:tenant-1-curriculum-1-l1-u1:memory-match";
  const invalidSeedStarted = progressionAdapter.startUnlockedGameMode({
    progression: adapterProgression,
    launchSession: adapterLaunchSession,
    gameMode: "memory-match",
    occurredAt: "2026-01-01T00:01:00.000Z",
    replaySeed: "provider-seed-without-replay-contract",
  });
  const invalidSeedRound = progressionAdapter.createGameInteractionEvent({
    type: "round_shown",
    progression: adapterProgression,
    launchSession: adapterLaunchSession,
    gameMode: "memory-match",
    occurredAt: "2026-01-01T00:02:00.000Z",
    replaySeed: "provider-seed-without-replay-contract",
  });
  const invalidSeedAudio = progressionAdapter.createAudioRequestedEvent({
    progression: adapterProgression,
    launchSession: adapterLaunchSession,
    gameMode: "memory-match",
    occurredAt: "2026-01-01T00:03:00.000Z",
    replaySeed: "provider-seed-without-replay-contract",
    cueKind: "instruction",
    cueText: "Find the matching pair.",
    language: "en",
  });
  const invalidSeedCompletion = progressionAdapter.completeGameMode({
    progression: adapterProgression,
    launchSession: adapterLaunchSession,
    gameMode: "memory-match",
    earnedStarDust: 200,
    occurredAt: "2026-01-01T00:04:00.000Z",
    replaySeed: "provider-seed-without-replay-contract",
  });
  assertEqual(invalidSeedStarted?.metadata?.replaySeed, normalizedReplaySeed);
  assertEqual(invalidSeedRound.metadata?.replaySeed, normalizedReplaySeed);
  assertEqual(invalidSeedAudio.metadata?.replaySeed, normalizedReplaySeed);
  assertEqual(invalidSeedCompletion.event?.metadata?.replaySeed, normalizedReplaySeed);
  const missingCanonicalAudioErrors = canonicalGame.validateCanonicalGameEventSequence(
    canonicalEvents.filter((event) => event.type !== "audio_requested"),
    "flashcards",
  ).errors;
  assertIncludes(missingCanonicalAudioErrors, "Canonical game event sequence must include audio_requested evidence.");
  const malformedCanonicalAudioErrors = canonicalGame.validateCanonicalGameEventSequence(
    canonicalEvents.map((event) => event.type === "audio_requested" ? { ...event, metadata: { ...event.metadata, cueText: "", language: "", cueKind: "unknown" } } : event),
    "flashcards",
  ).errors;
  assertIncludes(malformedCanonicalAudioErrors, "Canonical game audio_requested events must include non-blank cueText.");
  assertIncludes(malformedCanonicalAudioErrors, "Canonical game audio_requested events must include a language.");
  assertIncludes(malformedCanonicalAudioErrors, "Canonical game audio_requested events must include a supported cueKind.");
  const wrongTargetLanguageAudioErrors = canonicalGame.validateCanonicalGameEventSequence(
    canonicalEvents,
    "flashcards",
    undefined,
    undefined,
    undefined,
    "ja",
  ).errors;
  assertIncludes(wrongTargetLanguageAudioErrors, "Canonical game audio_requested events must use target language ja; found en.");
  const compatibleTargetLanguageAudioErrors = canonicalGame.validateCanonicalGameEventSequence(
    canonicalEvents,
    "flashcards",
    undefined,
    undefined,
    undefined,
    "en-US",
  ).errors;
  assertEqual(compatibleTargetLanguageAudioErrors.length, 0);
  const lateAnswerEvents = [
    ...canonicalEvents.slice(0, 6),
    { ...canonicalEvents[2], type: "answer_submitted", metadata: { tenantId: "tenant-1", replaySeed: canonicalReplaySeed, late: true } },
    { ...canonicalEvents[3], type: "answer_result", metadata: { tenantId: "tenant-1", replaySeed: canonicalReplaySeed, correct: true, late: true } },
    canonicalEvents[6],
  ];
  const lateAnswerErrors = canonicalGame.validateCanonicalGameEventSequence(lateAnswerEvents, "flashcards").errors;
  assertIncludes(lateAnswerErrors, "Canonical game event sequence must place all answer activity before mastery_updated.");
  const outOfOrderErrors = canonicalGame.validateCanonicalGameEventSequence(
    canonicalEvents.map((event, index) => ({ ...event, occurredAt: new Date(Date.parse(event.occurredAt) + (index === 4 ? -1000 : 0)).toISOString() })),
    "flashcards",
  ).errors;
  assertIncludes(outOfOrderErrors, "Canonical game event sequence must be chronological by occurredAt.");
  const canonicalReportEvidence = canonicalGameReport.validateCanonicalGameReportEvidence(canonicalEvents, "tenant-1", "launch-1", "en");
  assertEqual(canonicalReportEvidence.valid, true);
  const wrongTargetLanguageReportEvidence = canonicalGameReport.validateCanonicalGameReportEvidence(
    canonicalEvents,
    "tenant-1",
    "launch-1",
    "ja",
  );
  assertIncludes(wrongTargetLanguageReportEvidence.errors, "flashcards: Canonical game audio_requested events must use target language ja; found en.");
  const retriedReportEvidence = canonicalGameReport.validateCanonicalGameReportEvidence(
    [...canonicalEvents, ...canonicalEvents],
    "tenant-1",
    "launch-1",
  );
  assertEqual(retriedReportEvidence.valid, true);
  assertEqual(retriedReportEvidence.groups.length, 2);
  const incompleteReportEvidence = canonicalGameReport.validateCanonicalGameReportEvidence(canonicalEvents.slice(0, 4), "tenant-1", "launch-1");
  assertEqual(incompleteReportEvidence.valid, false);
  assertIncludes(incompleteReportEvidence.errors, "flashcards: Canonical game event sequence must include mastery_updated.");
  const mismatchedReportEvidence = canonicalGameReport.validateCanonicalGameReportEvidence(canonicalEvents, "tenant-2", "launch-1");
  assertIncludes(mismatchedReportEvidence.errors, "flashcards: Canonical game event sequence must preserve tenant tenant-2; game_started has tenant tenant-1.");

  const curatedOfferMapFixture = {
    mapId: "runtime-offer-map-1",
    tenantId: "tenant-1",
    contentPackageId: "tenant-1-package-1",
    label: "Runtime curated offer map",
    decisionRule: "Reviewed offers only.",
    level: 1,
    offers: [{
      offerId: "runtime-flashcards-1",
      unitKey: "tenant-1:curriculum-1:L1:U1",
      gameMode: "flashcards",
      family: "vocabulary-matching",
      engineId: "selection",
      readiness: "ready",
      launchRoute: "/flashcards/launch-1",
      audioRequirement: "All learner-facing text has audio.",
      reportingRequirement: "Report the entry completion event.",
      nextStep: "Review the next curated activity.",
    }],
  };
  assertEqual(contentModel.validateCuratedGameOfferMap(curatedOfferMapFixture).length, 0);
  const invalidCuratedOfferMapErrors = contentModel.validateCuratedGameOfferMap({
    ...curatedOfferMapFixture,
    offers: [{ ...curatedOfferMapFixture.offers[0], engineId: "pairing" }],
  });
  assertIncludes(
    invalidCuratedOfferMapErrors,
    "Unit game offer runtime-flashcards-1 must use engine selection; found pairing.",
  );
  const unsupportedLevelOfferErrors = contentModel.validateCuratedGameOfferMap({
    ...curatedOfferMapFixture,
    offers: [{ ...curatedOfferMapFixture.offers[0], gameMode: "sentence-builder", engineId: "text-spelling" }],
  });
  assertIncludes(
    unsupportedLevelOfferErrors,
    "Unit game offer runtime-flashcards-1 is not available for level 1; mark it blocked until the curriculum level is supported.",
  );

  const phaserReviewFixture = {
    reviewId: "runtime-phaser-review-1",
    tenantId: "tenant-1",
    queueItemId: "runtime-phaser-queue-1",
    sourceRepository: "Drewsure/ministar-lab",
    sourceSnapshotId: "frozen-2026-09-12-aaa-stable",
    sourceCommitSha: "eb79ddf5940ab47cc3c45c119c67ee1b6b958e55",
    sourceFiles: [
      { path: "src/game/scenes/MemoryMatchScene.ts", sha256: "d1c60fa17bf4bee63627e485ae0b096894832705fdcf173576bf3b28b8656888" },
    ],
    gameMode: "memory-match",
    parentEngine: "pairing",
    status: "mapped-review-only",
    approval: {
      decisionId: "runtime-phaser-decision-1",
      status: "blocked",
      decidedAt: "2026-09-13T00:00:00.000Z",
      blockers: ["Pairing payload adapter review"],
    },
    summary: "Runtime fixture for a blocked external candidate review.",
    findings: [
      {
        findingId: "runtime-phaser-finding-1",
        area: "payload",
        status: "gap",
        observedBehavior: "Candidate consumes source-owned input.",
        platformRequirement: "Wrapper must consume the validated platform payload.",
        evidenceReference: "src/game/scenes/MemoryMatchScene.ts:buildGrid",
      },
    ],
    missingEvidence: ["Pairing payload adapter review"],
    blockedActions: [
      "No direct source import",
      "No route replacement",
      "No scene-owned scoring",
      "No browser persistence ownership",
      "No package promotion",
      "No student assignment",
    ],
  };
  assertEqual(phaserCandidateReview.validatePhaserCandidateContractReview(phaserReviewFixture).length, 0);
  const unsafePhaserSourcePathErrors = phaserCandidateReview.validatePhaserCandidateContractReview({
    ...phaserReviewFixture,
    sourceFiles: [{ ...phaserReviewFixture.sourceFiles[0], path: "C:\\outside\\candidate.ts" }],
  });
  assertIncludes(
    unsafePhaserSourcePathErrors,
    "Phaser candidate contract review runtime-phaser-review-1 must use unique repository-relative source paths.",
  );
  const malformedPhaserReviewErrors = phaserCandidateReview.validatePhaserCandidateContractReview({
    ...phaserReviewFixture,
    sourceFiles: [null],
    findings: [null],
    approval: { ...phaserReviewFixture.approval, blockers: undefined },
    missingEvidence: undefined,
    blockedActions: undefined,
  });
  assertIncludes(
    malformedPhaserReviewErrors,
    "Phaser candidate contract review runtime-phaser-review-1 requires hashed source-file evidence.",
  );
  assertIncludes(
    malformedPhaserReviewErrors,
    "Phaser candidate contract review runtime-phaser-review-1 requires observed contract findings.",
  );
  assertEqual(
    phaserCandidateReview.validatePhaserCandidateContractReviews(null)[0],
    "Phaser candidate contract reviews must be provided as an array.",
  );
  const mismatchedPhaserProfileErrors = phaserCandidateReview.validatePhaserCandidateContractReview({
    ...phaserReviewFixture,
    parentEngine: "selection",
  });
  assertIncludes(
    mismatchedPhaserProfileErrors,
    "Phaser candidate contract review runtime-phaser-review-1 must use parent engine pairing for memory-match; found selection.",
  );
  const mismatchedPhaserSourceErrors = phaserCandidateReview.validatePhaserCandidateContractReview({
    ...phaserReviewFixture,
    sourceSnapshotId: "frozen-2026-09-12-other",
  });
  assertIncludes(
    mismatchedPhaserSourceErrors,
    "Phaser candidate source snapshot must be frozen-2026-09-12-aaa-stable.",
  );
  const invalidPhaserApprovalErrors = phaserCandidateReview.validatePhaserCandidateContractReview({
    ...phaserReviewFixture,
    approval: { ...phaserReviewFixture.approval, status: "approved-for-wrapper" },
  });
  assertIncludes(
    invalidPhaserApprovalErrors,
    "Phaser candidate contract review runtime-phaser-review-1 cannot approve a wrapper with blockers or missing evidence.",
  );

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
    unit_key: "tenant-1:curriculum-1:L1:U1",
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
  const malformedProgressionFlagErrors = progression.validateProgressionRuntimeRequest({
    ...progressionRequest,
    progressionPolicyAccepted: "true",
    persistenceReady: "true",
    reportRuntimeReady: "true",
    rewardPolicyReady: "true",
    targetLanguageEvidence: "false",
  });
  assertIncludes(malformedProgressionFlagErrors, "progressionPolicyAccepted must be a boolean");
  assertIncludes(malformedProgressionFlagErrors, "targetLanguageEvidence must be a boolean");
  assertEqual(progression.createReviewOnlyProgressionRuntimeAdapter().execute(progressionRequest).sideEffect, "none");
  const malformedTimestampErrors = progression.validateProgressionRuntimeRequest({
    ...progressionRequest,
    envelope: { ...supportEnvelope, occurred_at: "2026-01-01" },
  });
  assertIncludes(malformedTimestampErrors, "Progress event envelope audio_requested must include an ISO occurred_at timestamp.");
  const unknownGameModeErrors = progression.validateProgressionRuntimeRequest({
    ...progressionRequest,
    envelope: { ...supportEnvelope, game_mode: "unknown-mode" },
  });
  assertIncludes(unknownGameModeErrors, "Progress event envelope audio_requested must use a supported game_mode.");
  const malformedUnitKeyErrors = progression.validateProgressionRuntimeRequest({
    ...progressionRequest,
    envelope: { ...supportEnvelope, unit_key: "unit-1" },
  });
  assertIncludes(malformedUnitKeyErrors, "Progress event envelope audio_requested must use a canonical unit_key.");
  const incompatibleModeLevelErrors = progression.validateProgressionRuntimeRequest({
    ...progressionRequest,
    envelope: { ...supportEnvelope, game_mode: "sentence-builder" },
  });
  assertIncludes(incompatibleModeLevelErrors, "Progress event envelope audio_requested must use game_mode sentence-builder at a supported unit level.");
  const unknownEventTypeErrors = progression.validateProgressionRuntimeRequest({
    ...progressionRequest,
    envelope: { ...supportEnvelope, event_type: "unknown-event" },
  });
  assertIncludes(unknownEventTypeErrors, "Progress event envelope unknown-event must use a supported event_type.");
  let progressEnvelopeFactoryError = "";
  try {
    contentModel.createProgressEventEnvelope({
      event: {
        type: "unknown-event",
        unitKey: "tenant-1:curriculum-1:L1:U1",
        gameMode: "flashcards",
        occurredAt: supportEnvelope.occurred_at,
        metadata: {},
      },
      registry,
      eventId: "event-unknown",
      eventAcceptanceGateId: "gate-1",
      settingsContext: supportEnvelope.settings_context,
    });
  } catch (error) {
    progressEnvelopeFactoryError = error instanceof Error ? error.message : String(error);
  }
  assertEqual(
    progressEnvelopeFactoryError,
    "Cannot create progress event envelope for unsupported event type unknown-event.",
  );
  const mixedStreamContextErrors = contentModel.validateProgressEventEnvelopeStream([
    { ...supportEnvelope, launch_code: "launch-1", student_session_id: "session-1" },
    {
      ...supportEnvelope,
      event_id: "event-2",
      unit_key: "tenant-1:curriculum-1:L1:U2",
      launch_code: "launch-2",
      student_session_id: "session-2",
    },
  ], registry);
  assertIncludes(mixedStreamContextErrors, "Progress event envelope stream must target one unit_key value, found: tenant-1:curriculum-1:L1:U1, tenant-1:curriculum-1:L1:U2.");
  assertIncludes(mixedStreamContextErrors, "Progress event envelope stream must target one launch_code value, found: launch-1, launch-2.");
  assertEqual(mixedStreamContextErrors.includes("Progress event envelope stream must target one student_session_id value, found: session-1, session-2."), false);
  const mixedAcceptanceGateErrors = contentModel.validateProgressEventEnvelopeStream([
    { ...supportEnvelope, launch_code: "launch-1", event_acceptance_gate_id: "gate-1" },
    {
      ...supportEnvelope,
      event_id: "event-2",
      launch_code: "launch-1",
      student_session_id: "session-2",
      event_acceptance_gate_id: "gate-2",
    },
  ], registry);
  assertIncludes(mixedAcceptanceGateErrors, "Progress event envelope stream must use one event_acceptance_gate_id value, found: gate-1, gate-2.");
  const mixedStreamContractErrors = contentModel.validateProgressEventEnvelopeStream([
    { ...supportEnvelope, launch_code: "launch-1", taxonomy_version: "taxonomy-1" },
    {
      ...supportEnvelope,
      event_id: "event-2",
      launch_code: "launch-1",
      student_session_id: "session-2",
      taxonomy_version: "taxonomy-2",
      settings_context: { ...supportEnvelope.settings_context, settings_contract_id: "settings-2" },
    },
  ], registry);
  assertIncludes(mixedStreamContractErrors, "Progress event envelope stream must use one taxonomy_version value, found: taxonomy-1, taxonomy-2.");
  assertIncludes(mixedStreamContractErrors, "Progress event envelope stream must use one settings_contract_id value, found: settings-1, settings-2.");
  const outOfOrderStreamErrors = contentModel.validateProgressEventEnvelopeStream([
    { ...supportEnvelope, occurred_at: "2026-01-01T00:02:00.000Z" },
    { ...supportEnvelope, event_id: "event-2", occurred_at: "2026-01-01T00:01:00.000Z" },
  ], registry);
  assertIncludes(outOfOrderStreamErrors, "Progress event envelope stream must preserve chronological occurred_at order.");
  assertEqual(
    contentModel.validateProgressEventEnvelopeStream(null, registry)[0],
    "Progress event envelope stream must be provided as an array.",
  );
  assertEqual(
    contentModel.getProgressEventEnvelopeStreamWarnings({ envelopes: [] }, registry)[0],
    "Progress event envelope stream must be an array before report preview.",
  );

  const rewardRequest = {
    tenantId: "tenant-1", packageId: "package-1", learnerSlotId: "slot-1", rewardId: "reward-1",
    rewardKind: "outfit", sourceEventId: "event-2", sourceEventType: "mastery_updated", earnedByMastery: true,
    deterministicRuleId: "rule-1", ownershipProvenanceReady: true, policyAccepted: true, persistenceReady: true,
    releaseApprovalAccepted: true, randomRewardRequested: true, gachaPressureRequested: false,
    purchaseRequired: false, spinWheelTicketRequested: false,
  };
  const rewardErrors = reward.validateRewardRuntimeRequest(rewardRequest);
  assertIncludes(rewardErrors, "random reward generation must remain disabled");
  const malformedRewardFlagErrors = reward.validateRewardRuntimeRequest({
    ...rewardRequest,
    earnedByMastery: "true",
    ownershipProvenanceReady: "true",
    policyAccepted: "true",
    persistenceReady: "true",
    releaseApprovalAccepted: "true",
    randomRewardRequested: "false",
    gachaPressureRequested: "false",
    purchaseRequired: "false",
    spinWheelTicketRequested: "false",
  });
  assertIncludes(malformedRewardFlagErrors, "earnedByMastery must be a boolean");
  assertIncludes(malformedRewardFlagErrors, "spinWheelTicketRequested must be a boolean");

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
  const malformedRecoveryFlagErrors = recovery.validateRecoveryRuntimeRequest({
    ...localRecoveryRequest,
    persistenceReady: "true",
    backupManifestReady: "true",
    checksumVerified: "true",
    encryptionReady: "true",
    accessControlReady: "true",
    retentionPolicyAccepted: "true",
    schoolPolicyAccepted: "true",
    reportIntegrityReady: "true",
    rollbackReady: "true",
    releaseApprovalAccepted: "true",
    rawLearnerAudioExcluded: "true",
    rawLearnerTranscriptsExcluded: "true",
    localFallbackReviewed: "true",
  });
  assertIncludes(malformedRecoveryFlagErrors, "persistenceReady must be a boolean");
  assertIncludes(malformedRecoveryFlagErrors, "localFallbackReviewed must be a boolean");
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

  const assetRequest = {
    tenantId: "tenant-1", assetId: "asset-1", unitKey: "unit-1", operation: "promote",
    kind: "audio", mimeType: "audio/mpeg", sizeBytes: 1000, checksum: "checksum-1",
    scanStatus: "passed", rightsStatus: "owned", sourceReviewStatus: "approved",
    targetMappingReviewed: true, storagePolicyAccepted: true, releaseApproved: true,
    sizeBudgetAccepted: true, containsLearnerMedia: true, learnerUpload: false,
    studentFacingUseRequested: true,
  };
  const assetErrors = asset.validateAssetRuntimeRequest(assetRequest);
  assertIncludes(assetErrors, "learner-recorded media is excluded from the core asset runtime");

  const malformedAssetFlagErrors = asset.validateAssetRuntimeRequest({
    ...assetRequest,
    targetMappingReviewed: "true",
    storagePolicyAccepted: "true",
    releaseApproved: "true",
    sizeBudgetAccepted: "true",
    containsLearnerMedia: "false",
    learnerUpload: "false",
    studentFacingUseRequested: "false",
  });
  assertIncludes(malformedAssetFlagErrors, "targetMappingReviewed must be a boolean");
  assertIncludes(malformedAssetFlagErrors, "studentFacingUseRequested must be a boolean");
  assertEqual(asset.createReviewOnlyAssetRuntimeAdapter().execute({
    tenantId: "tenant-1", assetId: "asset-1", operation: "intake", kind: "image",
    mimeType: "image/png", sizeBytes: 1000, checksum: "checksum-1", scanStatus: "pending",
    rightsStatus: "unknown", sourceReviewStatus: "unreviewed", targetMappingReviewed: false,
    storagePolicyAccepted: false, releaseApproved: false, sizeBudgetAccepted: false,
    containsLearnerMedia: false, learnerUpload: false, studentFacingUseRequested: false,
  }).sideEffect, "none");

  const sourceRequest = {
    tenantId: "tenant-1", sourceId: "source-1", targetPackageId: "package-1", sourceType: "pdf",
    sourceChecksum: "checksum-1", extractionMethod: "pdf-text", contentReviewStatus: "draft",
    filePolicyAccepted: true, scanPassed: true, sourceLineageReviewed: true, rightsReviewAccepted: true,
    extractionReviewStatus: "accepted", ocrUsed: false, ocrConfidenceReviewed: true,
    segmentationReviewed: true, schemaReviewPassed: true, targetMappingReviewed: true,
    packageRuntimeApproved: true, teacherReleaseApproved: true, rawSourceAsStudentPayloadRequested: true,
    draftCreationRequested: true, aiExtractionRequested: false, studentFacingUseRequested: true,
  };
  const sourceErrors = source.validateSourceRuntimeRequest(sourceRequest);
  assertIncludes(sourceErrors, "raw source files cannot become student payloads");
  const malformedSourceFlagErrors = source.validateSourceRuntimeRequest({
    ...sourceRequest,
    filePolicyAccepted: "true",
    scanPassed: "true",
    sourceLineageReviewed: "true",
    rightsReviewAccepted: "true",
    ocrUsed: "false",
    ocrConfidenceReviewed: "true",
    segmentationReviewed: "true",
    schemaReviewPassed: "true",
    targetMappingReviewed: "true",
    packageRuntimeApproved: "true",
    teacherReleaseApproved: "true",
    rawSourceAsStudentPayloadRequested: "false",
    draftCreationRequested: "false",
    aiExtractionRequested: "false",
    studentFacingUseRequested: "false",
  });
  assertIncludes(malformedSourceFlagErrors, "filePolicyAccepted must be a boolean");
  assertIncludes(malformedSourceFlagErrors, "studentFacingUseRequested must be a boolean");
  assertEqual(source.createReviewOnlySourceRuntimeAdapter().execute({
    tenantId: "tenant-1", sourceId: "source-1", targetPackageId: "package-1", sourceType: "pdf",
    sourceChecksum: "checksum-1", extractionMethod: "pdf-text", contentReviewStatus: "draft",
    filePolicyAccepted: false, scanPassed: false, sourceLineageReviewed: false, rightsReviewAccepted: false,
    extractionReviewStatus: "not-started", ocrUsed: false, ocrConfidenceReviewed: false,
    segmentationReviewed: false, schemaReviewPassed: false, targetMappingReviewed: false,
    packageRuntimeApproved: false, teacherReleaseApproved: false, rawSourceAsStudentPayloadRequested: false,
    draftCreationRequested: false, aiExtractionRequested: false, studentFacingUseRequested: false,
  }).sideEffect, "none");

  const validSourcePackageAssemblyPacket = {
    packetId: "assembly-1",
    tenantId: "tenant-1",
    sourceId: "source-1",
    targetPackageId: "package-1",
    targetLanguage: "en",
    assistLanguages: ["ja"],
    extractionPacketId: "extraction-1",
    extractionPreviewId: "preview-1",
    label: "Candidate package assembly",
    mode: "review-only",
    status: "draft-candidate",
    sourceChecksum: "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    candidateUnitKeys: ["tenant-1:curriculum:L1:U1"],
    candidateMediaAssetIds: ["audio-1"],
    approvalLedgerId: "ledger-1",
    approvalLedgerLinked: true,
    requiredRecords: ["source_extraction_review_packet", "teacher_draft_package", "teacher_draft_review_handoff"],
    blockers: ["Rights review remains open."],
    sourceLineageReviewed: true,
    extractionReviewAccepted: true,
    mediaRightsReviewed: false,
    targetMappingReviewed: true,
    teacherReviewHandoffPresent: true,
    draftCreationAllowed: false,
    studentFacingPayloadAllowed: false,
    packagePromotionAllowed: false,
    approvalCaptureAllowed: false,
  };
  assertEqual(sourcePackageAssembly.validateSourcePackageAssemblyPacket(validSourcePackageAssemblyPacket).length, 0);
  const sourcePreviewResult = sourceExtractionPreview.createReviewOnlySourceExtractionPreview({
    previewId: "preview-1",
    tenantId: "tenant-1",
    sourceId: "source-1",
    targetPackageId: "package-1",
    sourceType: "pdf",
    sourceChecksum: validSourcePackageAssemblyPacket.sourceChecksum,
    extractionMethod: "pdf-text",
    candidateUnitKeys: validSourcePackageAssemblyPacket.candidateUnitKeys,
    segments: [{
      segmentId: "preview-1-segment-1",
      pageNumber: 1,
      sequence: 1,
      kind: "body",
      unitKey: "tenant-1:curriculum:L1:U1",
      text: "Hello world.",
    }],
    mode: "review-only",
  });
  assertEqual(sourcePreviewResult.valid, true);
  assertEqual(sourcePackageAssembly.validateSourcePackageAssemblyExtractionPreviewBinding(validSourcePackageAssemblyPacket, sourcePreviewResult.preview).length, 0);
  assertIncludes(
    sourcePackageAssembly.validateSourcePackageAssemblyExtractionPreviewBinding(
      { ...validSourcePackageAssemblyPacket, candidateUnitKeys: ["tenant-1:curriculum:L1:U2"] },
      sourcePreviewResult.preview,
    ),
    "Source package assembly extraction preview binding candidate unit tenant-1:curriculum:L1:U2 is not declared by the preview.",
  );
  assertIncludes(
    sourcePackageAssembly.validateSourcePackageAssemblyExtractionPreviewBinding(
      validSourcePackageAssemblyPacket,
      { ...sourcePreviewResult.preview, tenantId: "other-tenant" },
    ),
    "Source package assembly extraction preview binding tenantId does not match the preview.",
  );
  const validSourceContentPackage = {
    meta: { packageId: "package-1", tenantId: "tenant-1" },
    units: [{ unitMeta: { tenantId: "tenant-1", curriculumId: "curriculum", level: 1, unit: 1 } }],
    mediaAssets: [{ mediaAssetId: "audio-1", tenantId: "tenant-1", unitKey: "tenant-1:curriculum:L1:U1" }],
  };
  assertEqual(
    sourcePackageAssembly.validateSourcePackageAssemblyContentPackageBinding(validSourcePackageAssemblyPacket, validSourceContentPackage).length,
    0,
  );
  assertIncludes(
    sourcePackageAssembly.validateSourcePackageAssemblyContentPackageBinding(
      validSourcePackageAssemblyPacket,
      { ...validSourceContentPackage, mediaAssets: [] },
    ),
    "Source package assembly content package binding media asset audio-1 is not declared by the content package.",
  );
  const missingSourceLanguagePolicyErrors = sourcePackageAssembly.validateSourcePackageAssemblyPacket({
    ...validSourcePackageAssemblyPacket,
    targetLanguage: "ja",
    assistLanguages: ["en"],
  });
  assertIncludes(missingSourceLanguagePolicyErrors, "Non-English source package assembly requires an explicit target-language policy.");
  const validJapaneseSourceAssembly = sourcePackageAssembly.validateSourcePackageAssemblyPacket({
    ...validSourcePackageAssemblyPacket,
    targetLanguage: "ja",
    assistLanguages: ["en"],
    targetLanguagePolicy: {
      language: "ja", progressionRole: "target", scriptPolicy: "hiragana-first",
      segmentationPolicy: "japanese-aware", targetLanguageAudioRequired: true,
      supportLanguageProgressAllowed: false,
    },
  });
  assertEqual(validJapaneseSourceAssembly.length, 0);
  assertIncludes(
    sourcePackageAssembly.validateSourcePackageAssemblyPacket({
      ...validSourcePackageAssemblyPacket,
      mode: "hosted-managed",
    }),
    "Source package assembly must remain review-only.",
  );
  assertIncludes(
    sourcePackageAssembly.validateSourcePackageAssemblyPacket({
      ...validSourcePackageAssemblyPacket,
      packagePromotionAllowed: true,
    }),
    "Source package assembly promotion flags must remain false in review-only mode.",
  );
  assertIncludes(
    sourcePackageAssembly.validateSourcePackageAssemblyPacket({
      ...validSourcePackageAssemblyPacket,
      requiredRecords: [],
    }),
    "Source package assembly is missing required record source_extraction_review_packet.",
  );
  assertIncludes(
    sourcePackageAssembly.validateSourcePackageAssemblyPacket({
      ...validSourcePackageAssemblyPacket,
      sourceChecksum: "checksum-1",
    }),
    "Source package assembly sourceChecksum must use the sha256:<64 hexadecimal characters> format.",
  );
  assertIncludes(
    sourcePackageAssembly.validateSourcePackageAssemblyPacket({
      ...validSourcePackageAssemblyPacket,
      candidateUnitKeys: ["tenant-1:curriculum:L1:U1", "tenant-1:curriculum:L1:U1"],
    }),
    "Source package assembly candidateUnitKeys must contain unique identifiers.",
  );
  assertIncludes(
    sourcePackageAssembly.validateSourcePackageAssemblyPacket({
      ...validSourcePackageAssemblyPacket,
      teacherReviewHandoffPresent: false,
    }),
    "Draft-candidate source package assembly requires teacherReviewHandoffPresent.",
  );

  const validPackageApprovalLedger = {
    ledgerId: "ledger-1",
    tenantId: "tenant-1",
    packageId: "package-1",
    releaseCandidate: "candidate-1",
    label: "Package approval ledger preview",
    summary: "Evidence-only approval review preview.",
    approvalRule: "All required sign-offs remain review-only.",
    mode: "review-only",
    state: "evidence-only",
    approvalCaptureAllowed: false,
    packagePromotionAllowed: false,
    signoffs: [
      ...["content", "media", "games", "qr", "policy", "deployment", "platform"].map((role) => ({
        signoffId: `${role}-signoff`,
        label: `${role} review`,
        role,
        status: "needs-signoff",
        owner: "Preview owner",
        requiredBeforePilot: true,
        evidence: "Evidence remains preview-only.",
        nextStep: "Collect governed evidence.",
        cannotApproveWhile: ["Review-only mode is active"],
      })),
    ],
    auditRules: ["No approval capture", "No package promotion"],
  };
  assertEqual(packageApprovalLedger.validatePackageApprovalLedger(validPackageApprovalLedger).length, 0);
  assertIncludes(
    packageApprovalLedger.validatePackageApprovalLedger({
      ...validPackageApprovalLedger,
      approvalCaptureAllowed: true,
    }),
    "Package approval capture must remain blocked in the foundation.",
  );
  assertIncludes(
    packageApprovalLedger.validatePackageApprovalLedger({
      ...validPackageApprovalLedger,
      signoffs: validPackageApprovalLedger.signoffs.slice(1),
    }),
    "Package approval ledger is missing required role: content.",
  );

  const validPackageReadinessReconciliation = {
    reconciliationId: "readiness-1",
    tenantId: "tenant-1",
    packageId: "package-1",
    releaseCandidate: "candidate-1",
    label: "Package readiness reconciliation",
    summary: "Review-only evidence chain.",
    mode: "review-only",
    status: "blocked",
    sourceAssemblyPacketId: "assembly-1",
    sourceExtractionPreviewId: "preview-1",
    sourceAssemblyChecksum: "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    approvalLedgerId: "ledger-1",
    verifierEvidencePacketId: "verifier-1",
    targetLanguageAudioApprovalId: "audio-1",
    mediaRightsEvidenceId: "rights-1",
    publishGateId: "publish-1",
    assignmentRolloutGateId: "assignment-1",
    targetLanguageProgressionRule: "Target-language activity drives progress; support language cannot unlock progression.",
    lanes: [
      ...["source-assembly", "approval-ledger", "verifier-evidence", "target-language-audio", "media-rights", "publish-gate", "assignment-rollout"].map((laneId) => ({
        laneId,
        label: `${laneId} lane`,
        status: laneId === "source-assembly" ? "ready-preview" : "blocked",
        sourceRecord: `${laneId}_record`,
        referenceId: `${laneId}-1`,
        evidence: "Review-only evidence.",
        blocksRelease: laneId !== "source-assembly",
      })),
    ],
    blockedActions: [...packageReadinessReconciliation.PACKAGE_READINESS_BLOCKED_ACTIONS],
    promotionAllowed: false,
    studentFacingActivationAllowed: false,
  };
  assertEqual(packageReadinessReconciliation.validatePackageReadinessReconciliation(validPackageReadinessReconciliation).length, 0);
  assertIncludes(
    packageReadinessReconciliation.validatePackageReadinessReconciliation({
      ...validPackageReadinessReconciliation,
      promotionAllowed: true,
    }),
    "Package readiness reconciliation promotion must remain blocked.",
  );
  assertIncludes(
    packageReadinessReconciliation.validatePackageReadinessReconciliation({
      ...validPackageReadinessReconciliation,
      lanes: validPackageReadinessReconciliation.lanes.filter((lane) => lane.laneId !== "target-language-audio"),
    }),
    "Package readiness reconciliation is missing lane: target-language-audio.",
  );
  assertIncludes(
    packageReadinessReconciliation.validatePackageReadinessReconciliation({
      ...validPackageReadinessReconciliation,
      sourceAssemblyChecksum: "checksum-1",
    }),
    "Package readiness reconciliation sourceAssemblyChecksum must use the sha256:<64 hexadecimal characters> format.",
  );
  assertEqual(
    packageReadinessReconciliation.validatePackageReadinessSourceAssemblyBinding(
      validPackageReadinessReconciliation,
      {
        packetId: "assembly-1",
        tenantId: "tenant-1",
        extractionPreviewId: "preview-1",
        targetPackageId: "package-1",
        sourceChecksum: "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      },
    ).length,
    0,
  );
  assertEqual(
    packageReadinessReconciliation.validatePackageReadinessExtractionPreviewBinding(
      validPackageReadinessReconciliation,
      sourcePreviewResult.preview,
    ).length,
    0,
  );
  assertEqual(
    packageReadinessReconciliation.validatePackageReadinessLineageBinding(
      validPackageReadinessReconciliation,
      validSourcePackageAssemblyPacket,
      sourcePreviewResult.preview,
      validSourceContentPackage,
    ).length,
    0,
  );
  assertIncludes(
    packageReadinessReconciliation.validatePackageReadinessLineageBinding(
      validPackageReadinessReconciliation,
      { ...validSourcePackageAssemblyPacket, candidateUnitKeys: ["tenant-1:curriculum:L1:U2"] },
      sourcePreviewResult.preview,
      validSourceContentPackage,
    ),
    "Package readiness lineage Source package assembly extraction preview binding candidate unit tenant-1:curriculum:L1:U2 is not declared by the preview.",
  );
  assertIncludes(
    packageReadinessReconciliation.validatePackageReadinessLineageBinding(
      validPackageReadinessReconciliation,
      validSourcePackageAssemblyPacket,
      { ...sourcePreviewResult.preview, segments: [{ ...sourcePreviewResult.preview.segments[0], normalizedText: "drifted" }] },
      validSourceContentPackage,
    ),
    "Package readiness lineage Source extraction preview segment preview-1-segment-1 normalizedText must match normalized text.",
  );
  assertIncludes(
    packageReadinessReconciliation.validatePackageReadinessLineageBinding(
      validPackageReadinessReconciliation,
      validSourcePackageAssemblyPacket,
      sourcePreviewResult.preview,
      { ...validSourceContentPackage, mediaAssets: [] },
    ),
    "Package readiness lineage Source package assembly content package binding media asset audio-1 is not declared by the content package.",
  );
  assertIncludes(
    packageReadinessReconciliation.validatePackageReadinessExtractionPreviewBinding(
      validPackageReadinessReconciliation,
      { ...sourcePreviewResult.preview, sourceChecksum: "sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb" },
    ),
    "Package readiness extraction preview binding sourceAssemblyChecksum does not match the preview.",
  );
  assertIncludes(
    packageReadinessReconciliation.validatePackageReadinessSourceAssemblyBinding(
      validPackageReadinessReconciliation,
      {
        packetId: "assembly-1",
        tenantId: "other-tenant",
        extractionPreviewId: "preview-1",
        targetPackageId: "package-1",
        sourceChecksum: "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      },
    ),
    "Package readiness source binding tenantId does not match the source assembly.",
  );
  assertIncludes(
    packageReadinessReconciliation.validatePackageReadinessSourceAssemblyBinding(
      { ...validPackageReadinessReconciliation, sourceExtractionPreviewId: "preview-2" },
      {
        packetId: "assembly-1",
        tenantId: "tenant-1",
        extractionPreviewId: "preview-1",
        targetPackageId: "package-1",
        sourceChecksum: "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      },
    ),
    "Package readiness source binding sourceExtractionPreviewId does not match the source assembly.",
  );

  const validPackageReadinessPersistenceIntent = packageReadinessPersistence.buildPackageReadinessPersistenceIntent(
    validPackageReadinessReconciliation,
    "hosted-database",
  );
  assertEqual(
    packageReadinessPersistence.validatePackageReadinessPersistenceIntent(validPackageReadinessPersistenceIntent).length,
    0,
  );
  assertIncludes(
    packageReadinessPersistence.validatePackageReadinessPersistenceIntent({
      ...validPackageReadinessPersistenceIntent,
      writeAllowed: true,
    }),
    "Package readiness persistence intent writeAllowed must remain false.",
  );
  assertIncludes(
    packageReadinessPersistence.validatePackageReadinessPersistenceIntent({
      ...validPackageReadinessPersistenceIntent,
      evidenceLaneRefs: { ...validPackageReadinessPersistenceIntent.evidenceLaneRefs, publishGateId: "" },
    }),
    "Package readiness persistence intent requires publishGateId.",
  );

  const releaseRequest = {
    tenantId: "tenant-1", packageId: "package-1", releaseId: "release-1", requestedState: "active",
    currentState: "release-candidate", contentReviewStatus: "approved", verifierEvidenceStatus: "passed",
    sourceExtractionAccepted: true, assetRightsAccepted: true, targetLanguageAudioReady: true,
    curatedPathwayReviewed: true, packageRuntimeApproved: true, teacherApprovalAccepted: true,
    schoolPolicyAccepted: true, persistenceReady: true, rollbackReady: true,
    qrMutationRequested: true, studentFacingActivationRequested: true,
  };
  const releaseErrors = release.validateReleaseRuntimeRequest(releaseRequest);
  assertEqual(releaseErrors.length, 0);
  const malformedReleaseFlagErrors = release.validateReleaseRuntimeRequest({
    ...releaseRequest,
    sourceExtractionAccepted: "true",
    assetRightsAccepted: "true",
    targetLanguageAudioReady: "true",
    curatedPathwayReviewed: "true",
    packageRuntimeApproved: "true",
    teacherApprovalAccepted: "true",
    schoolPolicyAccepted: "true",
    persistenceReady: "true",
    rollbackReady: "true",
    qrMutationRequested: "true",
    studentFacingActivationRequested: "true",
  });
  assertIncludes(malformedReleaseFlagErrors, "sourceExtractionAccepted must be a boolean");
  assertIncludes(malformedReleaseFlagErrors, "studentFacingActivationRequested must be a boolean");
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
  const malformedPackageFlagErrors = contentPackage.validateContentPackageRuntimeRequest({
    ...packageRequest,
    curatedPathwayReviewed: "true",
    storagePolicyAccepted: "true",
    persistenceReady: "true",
    teacherReleaseApproved: "false",
    studentFacingUseRequested: "false",
    qrActivationRequested: "false",
  });
  assertIncludes(malformedPackageFlagErrors, "curatedPathwayReviewed must be a boolean");
  assertIncludes(malformedPackageFlagErrors, "storagePolicyAccepted must be a boolean");
  assertIncludes(malformedPackageFlagErrors, "studentFacingUseRequested must be a boolean");

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
  const japaneseTargetPolicy = {
    language: "ja", progressionRole: "target", scriptPolicy: "hiragana-first",
    segmentationPolicy: "japanese-aware", targetLanguageAudioRequired: true,
    supportLanguageProgressAllowed: false,
  };
  const japanesePolicyPackage = {
    ...audioPackage,
    meta: {
      ...audioPackage.meta, targetLanguage: "ja", assistLanguages: ["en"],
      targetLanguagePolicy: japaneseTargetPolicy,
    },
    mediaAssets: [{
      mediaAssetId: "japanese-lesson-video", tenantId: "tenant-1", title: "Greeting lesson",
      type: "lesson-video", kind: "video", rightsStatus: "partner-provided", language: "ja",
      languageRole: "target", unitKey: audioUnitKey,
    }],
  };
  assertEqual(contentModel.validateContentPackage(japanesePolicyPackage).length, 0);
  const japaneseMediaLanguageErrors = contentModel.validateContentPackage({
    ...japanesePolicyPackage,
    mediaAssets: japanesePolicyPackage.mediaAssets.map((asset) => ({ ...asset, language: "en" })),
  });
  assertIncludes(japaneseMediaLanguageErrors, "Target-language media asset japanese-lesson-video must match package target language ja.");
  const japaneseMediaRoleErrors = contentModel.validateContentPackage({
    ...japanesePolicyPackage,
    mediaAssets: japanesePolicyPackage.mediaAssets.map(({ languageRole, ...asset }) => asset),
  });
  assertIncludes(japaneseMediaRoleErrors, "Language-bound media asset japanese-lesson-video must declare target, assist, or neutral language role.");
  const japanesePolicyProgressErrors = contentModel.validateContentPackage({
    ...japanesePolicyPackage,
    meta: {
      ...japanesePolicyPackage.meta,
      targetLanguagePolicy: { ...japaneseTargetPolicy, supportLanguageProgressAllowed: true },
    },
  });
  assertIncludes(japanesePolicyProgressErrors, "Target-language policy must keep support-language progress disabled.");
  const japaneseRuntimeBindingErrors = contentPackage.validateContentPackageRuntimeRequest({
    tenantId: "tenant-1", packageId: "audio-package-1", targetLanguage: "en",
    contentPackage: japanesePolicyPackage, curatedPathwayReviewed: true,
    storagePolicyAccepted: false, persistenceReady: false, teacherReleaseApproved: false,
    studentFacingUseRequested: false, qrActivationRequested: false,
  });
  assertIncludes(japaneseRuntimeBindingErrors, "content package target language must match the runtime target language");
  const audioGameCues = [
    ...audioCues,
    {
      audioCueId: "audio-instruction-memory-match", tenantId: "tenant-1", kind: "instruction",
      text: "Find the matching greeting cards.", language: "en", source: "text-to-speech",
      unitKey: audioUnitKey, gameMode: "memory-match",
    },
  ];
  const readyGameAudio = contentModel.getGameAudioCoverage({
    unit: audioUnit, audioCues: audioGameCues, gameMode: "memory-match", targetLanguage: "en",
  });
  assertEqual(readyGameAudio.ready, true);
  assertEqual(readyGameAudio.coveredTermCount, 8);
  assertEqual(readyGameAudio.coveredSentenceCount, 2);
  assertEqual(readyGameAudio.instructionReady, true);
  const planScopedInstructionAudio = contentModel.getGameAudioCoverage({
    unit: audioUnit,
    audioCues: [
      ...audioCues,
      ...audioGameCues.filter((cue) => cue.kind === "instruction"),
    ],
    audioSupportPlan: {
      ...audioPlan,
      gameModeAudioCueIds: {
        "memory-match": [
          ...audioPlan.vocabularyAudioCueIds,
          "audio-instruction-memory-match",
        ],
      },
    },
    gameMode: "memory-match",
    targetLanguage: "en",
  });
  assertEqual(planScopedInstructionAudio.instructionCueCount, 1);
  assertEqual(planScopedInstructionAudio.ready, true);
  const unapprovedInstructionAudio = contentModel.getGameAudioCoverage({
    unit: audioUnit,
    audioCues: audioGameCues,
    audioSupportPlan: {
      ...audioPlan,
      gameModeAudioCueIds: { "memory-match": audioPlan.vocabularyAudioCueIds },
    },
    gameMode: "memory-match",
    targetLanguage: "en",
  });
  assertEqual(unapprovedInstructionAudio.instructionCueCount, 0);
  assertEqual(unapprovedInstructionAudio.instructionReady, false);
  assertEqual(unapprovedInstructionAudio.ready, false);
  const crossTenantAudio = contentModel.getGameAudioCoverage({
    unit: audioUnit,
    audioCues: audioGameCues.map((cue) => ({ ...cue, tenantId: "tenant-2" })),
    gameMode: "memory-match",
    targetLanguage: "en",
  });
  assertEqual(crossTenantAudio.ready, false);
  assertEqual(crossTenantAudio.missingTerms.includes("hello"), true);
  const authorizedPlaybackCues = contentModel.getGameAudioCues({
    unit: audioUnit,
    audioCues: audioGameCues,
    audioSupportPlan: {
      ...audioPlan,
      gameModeAudioCueIds: {
        "memory-match": [
          ...audioPlan.vocabularyAudioCueIds,
          "audio-instruction-memory-match",
        ],
      },
    },
    gameMode: "memory-match",
    targetLanguage: "en",
  });
  assertEqual(authorizedPlaybackCues.some((cue) => cue.audioCueId === "audio-instruction-memory-match"), true);
  assertEqual(authorizedPlaybackCues.every((cue) => cue.tenantId === "tenant-1"), true);
  const crossModeTermAudio = contentModel.getGameAudioCoverage({
    unit: audioUnit,
    audioCues: audioGameCues.map((cue) => cue.audioCueId === "audio-term-1" ? { ...cue, gameMode: "quiz" } : cue),
    gameMode: "memory-match",
    targetLanguage: "en",
  });
  assertEqual(crossModeTermAudio.ready, false);
  assertEqual(crossModeTermAudio.missingTerms.includes("hello"), true);
  const incompleteGameAudio = contentModel.getGameAudioCoverage({
    unit: audioUnit,
    audioCues: audioGameCues.filter((cue) => cue.audioCueId !== "audio-term-1"),
    gameMode: "memory-match",
    targetLanguage: "en",
  });
  assertEqual(incompleteGameAudio.ready, false);
  assertEqual(incompleteGameAudio.missingTerms.includes("hello"), true);
  assertEqual(incompleteGameAudio.instructionReady, true);
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
  assertIncludes(wrongPlanLanguageErrors, "non-English target packages require an explicit target-language policy");
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
  const malformedLaunchFlagErrors = launch.validateLaunchRuntimeRequest({
    ...launchRequest,
    teacherRoleVerified: "true",
    packageRuntimeApproved: "true",
    assignmentRuntimeApproved: "true",
    teacherQrOrFrontDoorReviewed: "true",
    stableQrReady: "true",
    localFallbackReady: "false",
    schoolPolicyAccepted: "true",
    rosterPolicyAccepted: "true",
    persistenceReady: "true",
    reportingPolicyAccepted: "true",
    targetLanguageAudioReady: "true",
    supportLanguageProgressAllowed: "false",
    mediaOnlyProgressAllowed: "false",
    realLearnerDataRequested: "false",
    studentLaunchRequested: "false",
  });
  assertIncludes(malformedLaunchFlagErrors, "teacherRoleVerified must be a boolean");
  assertIncludes(malformedLaunchFlagErrors, "stableQrReady must be a boolean");
  assertIncludes(malformedLaunchFlagErrors, "studentLaunchRequested must be a boolean");

  const assignmentRequest = {
    tenantId: "tenant-1",
    assignmentPlan: {
      assignmentId: "assignment-1", tenantId: "tenant-1", packageId: "package-1", launchCode: "launch-1",
      label: "Assignment", audience: "whole-class", readiness: "requires-persistence", curriculumLevel: 1,
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
  const unsupportedAssignmentErrors = assignmentPlan.validateTeacherAssignmentPlan({
    ...assignmentRequest.assignmentPlan,
    targetGameModes: ["flashcards", "sentence-builder"],
    audioCoveredGameModes: ["flashcards", "sentence-builder"],
  });
  assertIncludes(
    unsupportedAssignmentErrors,
    "Teacher assignment includes game modes unsupported at level 1: sentence-builder.",
  );
  const malformedAssignmentFlagErrors = assignment.validateAssignmentRuntimeRequest({
    ...assignmentRequest,
    teacherRoleVerified: "true",
    packageRuntimeApproved: "true",
    launchRuntimeApproved: "true",
    privateLinkPolicyAccepted: "true",
    rosterPolicyAccepted: "true",
    persistenceReady: "true",
    reportingPolicyAccepted: "true",
    targetLanguageAudioReady: "true",
    supportLanguageProgressAllowed: "false",
    mediaOnlyProgressAllowed: "false",
    studentFacingUseRequested: "false",
    privateLinkActivationRequested: "false",
    assignmentWriteRequested: "false",
  });
  assertIncludes(malformedAssignmentFlagErrors, "teacherRoleVerified must be a boolean");
  assertIncludes(malformedAssignmentFlagErrors, "targetLanguageAudioReady must be a boolean");
  assertIncludes(malformedAssignmentFlagErrors, "assignmentWriteRequested must be a boolean");

  const persistenceRequest = {
    operation: "write", tenantId: "tenant-1", recordId: "record-1", category: "student-progress",
    containsStudentData: true, containsRawAudio: true, containsTranscript: false,
    requiresSchoolPolicy: true, schoolPolicyAccepted: false, releaseApproved: false,
  };
  const persistenceErrors = persistence.validatePersistenceRuntimeRequest(persistenceRequest);
  assertIncludes(persistenceErrors, "raw learner audio is not a core persistence field");
  assertIncludes(persistenceErrors, "release approval is required before mutation or export");
  assertEqual(persistence.createReviewOnlyPersistenceAdapter().execute(persistenceRequest).sideEffect, "none");
  const hostedClientWrite = {
    expectedTenantId: "tenant-1",
    expectedPackageId: "package-1",
    expectedLaunchCode: "launch-1",
    expectedStudentSessionId: "session-1",
    envelope: continuityEnvelope,
    requestedMode: "durable-managed",
  };
  assertEqual(hostedProgression.validateHostedProgressionPersistenceClientWrite(hostedClientWrite).valid, true);
  assertIncludes(
    hostedProgression.validateHostedProgressionPersistenceClientWrite({
      ...hostedClientWrite,
      policy: { mode: "durable-managed", allowDurableWrite: true, schoolPolicyAccepted: true },
    }).errors,
    "Hosted progression policy is server-owned and cannot be supplied by the browser.",
  );
  const serverOwnedHostedWrite = hostedProgression.createServerOwnedHostedProgressionPersistenceWriteRequest(
    hostedClientWrite,
    { mode: "durable-managed", allowDurableWrite: false, schoolPolicyAccepted: false, retentionPolicyAccepted: false, releaseApprovalAccepted: false },
  );
  assertEqual(serverOwnedHostedWrite.policy.allowDurableWrite, false);
  assertEqual(serverOwnedHostedWrite.policy.schoolPolicyAccepted, false);
  const progressWriteWithoutIdempotencyKeyErrors = persistence.validatePersistenceRuntimeRequest({
    ...persistenceRequest,
    category: "progress-event-stream",
    containsRawAudio: false,
    schoolPolicyAccepted: true,
    releaseApproved: true,
    completionIdentity: {
      tenantId: "tenant-1", unitKey: "unit-1", launchCode: "launch-1", studentSessionId: "student-1", gameMode: "memory-match",
    },
  });
  assertIncludes(progressWriteWithoutIdempotencyKeyErrors, "progress event writes require a completion idempotency key");
  const progressWriteWithIdempotencyKeyErrors = persistence.validatePersistenceRuntimeRequest({
    ...persistenceRequest,
    category: "progress-event-stream",
    containsRawAudio: false,
    schoolPolicyAccepted: true,
    releaseApproved: true,
    idempotencyKey: "completion-v1:tenant-1:unit-1:launch-1:student-1:memory-match",
    completionIdentity: {
      tenantId: "tenant-1", unitKey: "unit-1", launchCode: "launch-1", studentSessionId: "student-1", gameMode: "memory-match",
    },
  });
  assertEqual(progressWriteWithIdempotencyKeyErrors.length, 0);
  const progressWriteWithMismatchedIdentityErrors = persistence.validatePersistenceRuntimeRequest({
    ...persistenceRequest,
    category: "progress-event-stream",
    containsRawAudio: false,
    schoolPolicyAccepted: true,
    releaseApproved: true,
    idempotencyKey: "completion-v1:tenant-1:unit-1:launch-1:student-1:memory-match",
    completionIdentity: {
      tenantId: "tenant-1", unitKey: "unit-2", launchCode: "launch-1", studentSessionId: "student-1", gameMode: "memory-match",
    },
  });
  assertIncludes(progressWriteWithMismatchedIdentityErrors, "completion idempotency key does not match canonical completion identity");
  const completionCandidate = {
    idempotencyKey: "completion-v1:tenant-1:unit-1:launch-1:student-1:memory-match",
    payloadHash: "sha256:completion-a",
    recordId: "progress-event-1",
  };
  assertEqual(contentModel.planCanonicalCompletionWrite(completionCandidate).outcome, "create");
  assertEqual(
    contentModel.planCanonicalCompletionWrite(completionCandidate, completionCandidate).outcome,
    "return-existing",
  );
  assertEqual(
    contentModel.planCanonicalCompletionWrite({ ...completionCandidate, payloadHash: "sha256:completion-b" }, completionCandidate).outcome,
    "conflict",
  );
  assertIncludes(
    contentModel.planCanonicalCompletionWrite({ ...completionCandidate, payloadHash: "" }).errors,
    "completion payload hash is required",
  );
  const alignedProgressRecord = {
    recordId: "progress-event-record",
    category: "progress-event-stream",
    preservesTenantBoundary: true,
    tenantBoundaryKey: "tenant_id",
    preservesCompletionIdempotency: true,
    completionIdempotencyKeyFields: ["tenant_id", "unit_key", "launch_code", "student_session_id", "game_mode"],
    rejectsDuplicateCompletionWrites: true,
    requiresAtomicCompletionWrite: true,
  };
  const alignedProgressIntent = {
    intentId: "progress-event-intent",
    category: "progress-event-stream",
    preservesTenantBoundary: true,
    tenantBoundaryKey: "tenant_id",
    preservesCompletionIdempotency: true,
    completionIdempotencyKeyFields: ["tenant_id", "unit_key", "launch_code", "student_session_id", "game_mode"],
    rejectsDuplicateCompletionWrites: true,
    requiresAtomicCompletionWrite: true,
  };
  assertEqual(
    persistenceConsistency.validatePersistenceContractAlignment({
      durableRecords: [alignedProgressRecord],
      requiredCategories: ["progress-event-stream"],
      adapterPlans: [{ writeIntents: [alignedProgressIntent] }],
    }).length,
    0,
  );
  assertIncludes(
    persistenceConsistency.validatePersistenceContractAlignment({
      durableRecords: [alignedProgressRecord],
      requiredCategories: ["progress-event-stream"],
      adapterPlans: [{
        writeIntents: [{
          ...alignedProgressIntent,
          completionIdempotencyKeyFields: ["tenant_id", "unit_key", "launch_code", "student_session_id"],
        }],
      }],
    }),
    "Persistence alignment requires progress-event-stream adapter intent progress-event-intent to preserve completion idempotency key field game_mode.",
  );
  assertIncludes(
    persistenceConsistency.validatePersistenceContractAlignment({
      durableRecords: [alignedProgressRecord],
      requiredCategories: ["progress-event-stream"],
      adapterPlans: [{
        writeIntents: [{ ...alignedProgressIntent, requiresAtomicCompletionWrite: false }],
      }],
    }),
    "Persistence alignment requires progress-event-stream adapter intent progress-event-intent to match durable atomic completion writes.",
  );
  const validPersistenceHandoffPacket = {
    packetId: "handoff-packet-1",
    label: "Provider-neutral persistence handoff",
    mode: "review-only",
    summary: "Review-only handoff evidence.",
    selectedProvider: null,
    checks: [
      { checkId: "contract-alignment", label: "Alignment", status: "passed", detail: "Aligned." },
      { checkId: "provider-selection", label: "Provider", status: "passed", detail: "Unselected." },
      { checkId: "side-effects", label: "Side effects", status: "passed", detail: "Blocked." },
    ],
    categoryCoverage: persistenceRecords.TENANT_BOUND_PERSISTENCE_RECORD_CATEGORIES.map((category) => ({
      category,
      durableRecord: true,
      hostedIntent: true,
      localIntent: true,
    })),
  };
  assertEqual(persistenceHandoff.validatePersistenceHandoffPacket(validPersistenceHandoffPacket).length, 0);
  assertIncludes(
    persistenceHandoff.validatePersistenceHandoffPacket({
      ...validPersistenceHandoffPacket,
      selectedProvider: "unexpected-provider",
    }),
    "Persistence handoff packet must not select a provider.",
  );
  assertIncludes(
    persistenceHandoff.validatePersistenceHandoffPacket({
      ...validPersistenceHandoffPacket,
      categoryCoverage: validPersistenceHandoffPacket.categoryCoverage.slice(1),
    }),
    `Persistence handoff packet is missing tenant-bound category coverage for ${persistenceRecords.TENANT_BOUND_PERSISTENCE_RECORD_CATEGORIES[0]}.`,
  );
  const validPilotHandoffPackage = {
    packageId: "pilot-package-1",
    routeKey: "pilot-handoff-1",
    tenantId: "tenant-1",
    label: "Pilot handoff",
    mode: "review-only",
    recommendedPilotWindow: "8 weeks",
    recommendedDeployment: "Hosted PWA first",
    summary: "Review-only pilot handoff.",
    reportSnapshotEvidence: {
      snapshotId: "teacher-report-package-snapshot-v1:tenant-1:pilot-package-1:launch-1",
      tenantId: "tenant-1",
      packageId: "pilot-package-1",
      launchCode: "launch-1",
      snapshotFingerprint: "teacher-report-package-snapshot-fnv1a-v1:12345678",
      deploymentModes: ["hosted-managed", "local-classroom"],
      recoveryPacketsValid: true,
      exportAllowed: false,
      writesAllowed: false,
      rawLearnerAudioIncluded: false,
      learnerTranscriptIncluded: false,
      realLearnerIdentifiersIncluded: false,
    },
    persistenceGateEvidence: {
      status: "blocked",
      mode: "durable-managed",
      ready: false,
      tenantId: "tenant-1",
      packageId: "pilot-package-1",
      launchCode: "launch-1",
      checkedAt: "2026-09-18T00:00:00.000Z",
      blockedReasons: ["Durable write approval is not enabled."],
      writesAllowed: false,
    },
    activationPreflightEvidence: {
      packetId: "activation-preflight-1",
      tenantId: "tenant-1",
      packageId: "pilot-package-1",
      deploymentDecisionId: "deployment-decision-1",
      policyAcceptancePreflightId: "school-policy-preflight-1",
      acceptanceRecordPreviewId: "school-policy-acceptance-preview-1",
      deploymentSelectionStatus: "unselected",
      policyAcceptanceStatus: "not-accepted",
      requestedMode: "durable-managed",
      status: "blocked",
      passedChecks: 3,
      openChecks: 1,
      blockedChecks: 1,
      blockedReasons: ["School policy is missing."],
      canActivate: false,
    },
    releaseControlEvidence: {
      bindingId: "release-binding-1",
      releaseGateId: "release-gate-1",
      tenantId: "tenant-1",
      packageId: "pilot-package-1",
      packageVersion: "1.0.0",
      decision: "needs-review",
      releaseBlockingReasons: ["Media evidence open."],
      requiredApprovals: ["Media rights approval"],
      blockedActions: ["package-publish"],
      promotionAllowed: false,
      studentFacingAllowed: false,
      localActivationAllowed: false,
      mode: "review-only",
      sideEffect: "none",
    },
    approvalEvidence: {
      ledgerId: "approval-ledger-1",
      tenantId: "tenant-1",
      packageId: "pilot-package-1",
      status: "blocked",
      totalRequiredSignoffs: 2,
      signedRequiredSignoffs: 1,
      openRequiredSignoffs: 1,
      blockedRequiredSignoffs: 1,
      approvalCaptureAllowed: false,
      packagePromotionAllowed: false,
      mode: "review-only",
    },
    routes: [
      { routeId: "front-door", label: "Front door", path: "/enter/tenant-1", status: "ready", purpose: "Entry." },
      { routeId: "launch", label: "Launch", path: "/launch/unit-1", status: "ready", purpose: "Launch." },
      { routeId: "session", label: "Session", path: "/teacher/sessions/unit-1", status: "needs-review", purpose: "Review." },
    ],
    assets: [{ assetId: "unit", label: "Unit", status: "ready", owner: "codex", evidence: "Reviewed.", nextStep: "Replace sample." }],
    decisions: [{ decisionId: "student-data-policy", label: "Student data", status: "blocked", owner: "school", costImpact: "controlled", note: "Policy required." }],
    handoffNotes: ["Do not promise classroom launch."],
  };
  assertEqual(pilotHandoff.validatePilotHandoffPackage(validPilotHandoffPackage).length, 0);
  const validPilotLineageSources = {
    deploymentDecision: {
      decisionId: "deployment-decision-1",
      tenantId: "tenant-1",
      packageId: "pilot-package-1",
      policyAcceptancePreflightId: "school-policy-preflight-1",
      acceptanceRecordPreviewId: "school-policy-acceptance-preview-1",
      selectionStatus: "unselected",
      policyAcceptanceStatus: "not-accepted",
      status: "review-only",
      policyAccepted: false,
      persistenceActivationAllowed: false,
      classroomLaunchAllowed: false,
    },
    policyAcceptancePreflight: {
      preflightId: "school-policy-preflight-1",
      tenantId: "tenant-1",
      packageId: "pilot-package-1",
      acceptanceStatus: "Acceptance blocked",
    },
    acceptanceRecordPreview: {
      previewId: "school-policy-acceptance-preview-1",
      tenantId: "tenant-1",
      packageId: "pilot-package-1",
      statusLabel: "Acceptance record blocked",
    },
  };
  assertEqual(pilotHandoff.validatePilotHandoffLineageBinding(validPilotHandoffPackage, validPilotLineageSources).length, 0);
  assertIncludes(
    pilotHandoff.validatePilotHandoffLineageBinding(
      { ...validPilotHandoffPackage, activationPreflightEvidence: { ...validPilotHandoffPackage.activationPreflightEvidence, acceptanceRecordPreviewId: "other-preview" } },
      validPilotLineageSources,
    ),
    "Pilot handoff lineage acceptance preview id must match both source records.",
  );
  assertIncludes(
    pilotHandoff.validatePilotHandoffLineageBinding(
      validPilotHandoffPackage,
      { ...validPilotLineageSources, policyAcceptancePreflight: { ...validPilotLineageSources.policyAcceptancePreflight, tenantId: "other-tenant" } },
    ),
    "Pilot handoff lineage policy preflight tenant must match the handoff tenant.",
  );
  assertIncludes(
    pilotHandoff.validatePilotHandoffPackage({
      ...validPilotHandoffPackage,
      releaseControlEvidence: { ...validPilotHandoffPackage.releaseControlEvidence, promotionAllowed: true },
    }),
    "Pilot handoff release-control evidence must keep promotion, student-facing use, and local activation false.",
  );
  assertIncludes(
    pilotHandoff.validatePilotHandoffPackage({
      ...validPilotHandoffPackage,
      approvalEvidence: { ...validPilotHandoffPackage.approvalEvidence, packageId: "other-package" },
    }),
    "Pilot handoff approval package must match the handoff package.",
  );
  assertIncludes(
    pilotHandoff.validatePilotHandoffPackage({
      ...validPilotHandoffPackage,
      approvalEvidence: { ...validPilotHandoffPackage.approvalEvidence, openRequiredSignoffs: 0 },
    }),
    "Pilot handoff approval sign-off counts must reconcile.",
  );
  assertIncludes(
    pilotHandoff.validatePilotHandoffPackage({
      ...validPilotHandoffPackage,
      persistenceGateEvidence: { ...validPilotHandoffPackage.persistenceGateEvidence, ready: true },
    }),
    "Pilot handoff persistence gate ready flag must match its status.",
  );
  assertIncludes(
    pilotHandoff.validatePilotHandoffPackage({
      ...validPilotHandoffPackage,
      persistenceGateEvidence: { ...validPilotHandoffPackage.persistenceGateEvidence, blockedReasons: ["School policy is missing.", ""] },
    }),
    "Pilot handoff persistence gate blockedReasons must contain only non-empty strings.",
  );
  assertIncludes(
    pilotHandoff.validatePilotHandoffPackage({
      ...validPilotHandoffPackage,
      activationPreflightEvidence: { ...validPilotHandoffPackage.activationPreflightEvidence, blockedReasons: ["School policy is missing.", "School policy is missing."] },
    }),
    "Pilot handoff activation preflight blockedReasons must be unique.",
  );
  assertIncludes(
    pilotHandoff.validatePilotHandoffPackage({
      ...validPilotHandoffPackage,
      handoffNotes: ["Do not promise classroom launch.", "Do not promise classroom launch."],
    }),
    "Pilot handoff notes must be unique.",
  );
  assertIncludes(
    pilotHandoff.validatePilotHandoffPackage({
      ...validPilotHandoffPackage,
      mode: "live",
    }),
    "Pilot handoff package must remain review-only.",
  );
  assertIncludes(
    pilotHandoff.validatePilotHandoffPackage({
      ...validPilotHandoffPackage,
      reportSnapshotEvidence: { ...validPilotHandoffPackage.reportSnapshotEvidence, exportAllowed: true },
    }),
    "Pilot handoff report snapshot exportAllowed must remain false.",
  );
  assertIncludes(
    pilotHandoff.validatePilotHandoffPackage({
      ...validPilotHandoffPackage,
      reportSnapshotEvidence: { ...validPilotHandoffPackage.reportSnapshotEvidence, launchCode: "other-launch" },
    }),
    "Pilot handoff report snapshot id must match its tenant, package, and launch scope.",
  );
  assertIncludes(
    pilotHandoff.validatePilotHandoffPackage({
      ...validPilotHandoffPackage,
      reportSnapshotEvidence: { ...validPilotHandoffPackage.reportSnapshotEvidence, packageId: "other-package" },
    }),
    "Pilot handoff report snapshot package must match the handoff package.",
  );
  assertIncludes(
    pilotHandoff.validatePilotHandoffPackage({
      ...validPilotHandoffPackage,
      persistenceGateEvidence: { ...validPilotHandoffPackage.persistenceGateEvidence, packageId: "other-package" },
    }),
    "Pilot handoff persistence gate package must match the handoff package.",
  );
  assertIncludes(
    pilotHandoff.validatePilotHandoffPackage({
      ...validPilotHandoffPackage,
      releaseControlEvidence: { ...validPilotHandoffPackage.releaseControlEvidence, packageId: "other-package" },
    }),
    "Pilot handoff release-control package must match the handoff package.",
  );
  assertIncludes(
    pilotHandoff.validatePilotHandoffPackage({
      ...validPilotHandoffPackage,
      reportSnapshotEvidence: { ...validPilotHandoffPackage.reportSnapshotEvidence, snapshotFingerprint: "unverified-fingerprint" },
    }),
    "Pilot handoff report snapshot fingerprint must use the canonical snapshot fingerprint prefix.",
  );
  assertIncludes(
    pilotHandoff.validatePilotHandoffPackage({
      ...validPilotHandoffPackage,
      routes: validPilotHandoffPackage.routes.slice(1),
    }),
    "Pilot handoff package must include a route beginning with /enter/.",
  );
  assertIncludes(
    pilotHandoff.validatePilotHandoffPackage({
      ...validPilotHandoffPackage,
      decisions: [{ ...validPilotHandoffPackage.decisions[0], status: "ready" }],
    }),
    "Pilot handoff student-data-policy decision must remain blocked before a real classroom pilot.",
  );
  const malformedPersistenceFlagErrors = persistence.validatePersistenceRuntimeRequest({
    ...persistenceRequest,
    containsStudentData: "true",
    containsRawAudio: "false",
    containsTranscript: "false",
    requiresSchoolPolicy: "true",
    schoolPolicyAccepted: "true",
    releaseApproved: "true",
  });
  assertIncludes(malformedPersistenceFlagErrors, "containsStudentData must be a boolean");
  assertIncludes(malformedPersistenceFlagErrors, "requiresSchoolPolicy must be a boolean");
  assertIncludes(malformedPersistenceFlagErrors, "releaseApproved must be a boolean");

  const prototypeGateRecord = {
    recordId: "prototype-gate-record",
    category: "ai-prototype-integration-readiness-gate",
    label: "AI prototype integration readiness gate record",
    readiness: "durable-required",
    sourceOfTruth: "prototype integration readiness evidence",
    requiredBeforePilot: false,
    containsStudentData: false,
    containsMediaRights: false,
    supportsLocalDeployment: true,
    storesRawAudio: false,
    storesTranscript: false,
    recommendedFirstPilotStore: ["hosted-database", "local-classroom-store"],
  };
  assertIncludes(
    persistenceRecords.validateDurableRecordContracts([prototypeGateRecord]),
    "ai-prototype-integration-readiness-gate durable record prototype-gate-record must preserve tenant boundary.",
  );

  const prototypeGateIntent = {
    intentId: "prototype-gate-intent",
    category: "ai-prototype-integration-readiness-gate",
    label: "Write prototype integration readiness gates",
    readiness: "requires-backend",
    targetStore: ["hosted-database"],
    deploymentChannels: ["hosted-web"],
    requiredBeforePilot: false,
    containsStudentData: false,
    requiresSchoolPolicy: false,
    canRunOffline: false,
    allowsExport: true,
    rejectsRawAudio: true,
    rejectsTranscripts: true,
    note: "Prototype readiness gate remains review-only.",
  };
  assertIncludes(
    persistenceAdapter.validatePersistenceAdapterPlan({
      planId: "prototype-gate-plan",
      label: "Prototype gate plan",
      writeIntents: [prototypeGateIntent],
      handoffSteps: ["Review"],
    }),
    "ai-prototype-integration-readiness-gate write intent prototype-gate-intent must preserve tenant boundary.",
  );

  assertIncludes(
    persistenceRecords.validateDurableRecordContracts([
      { ...prototypeGateRecord, recordId: "codex-decision-record", category: "codex-integration-review-decision" },
    ]),
    "codex-integration-review-decision durable record codex-decision-record must preserve tenant boundary.",
  );
  assertIncludes(
    persistenceAdapter.validatePersistenceAdapterPlan({
      planId: "codex-decision-plan",
      label: "Codex decision plan",
      writeIntents: [
        { ...prototypeGateIntent, intentId: "codex-decision-intent", category: "codex-integration-review-decision" },
      ],
      handoffSteps: ["Review"],
    }),
    "codex-integration-review-decision write intent codex-decision-intent must preserve tenant boundary.",
  );

  assertIncludes(
    persistenceRecords.validateDurableRecordContracts([
      { ...prototypeGateRecord, preservesTenantBoundary: true },
    ]),
    "ai-prototype-integration-readiness-gate durable record prototype-gate-record must name its tenant boundary key.",
  );
  assertIncludes(
    persistenceAdapter.validatePersistenceAdapterPlan({
      planId: "prototype-gate-key-plan",
      label: "Prototype gate key plan",
      writeIntents: [{ ...prototypeGateIntent, preservesTenantBoundary: true }],
      handoffSteps: ["Review"],
    }),
    "ai-prototype-integration-readiness-gate write intent prototype-gate-intent must name its tenant boundary key.",
  );

  assertIncludes(
    persistenceRecords.validateDurableRecordContracts([
      {
        ...prototypeGateRecord,
        recordId: "prototype-audio-report-record",
        category: "ai-prototype-audio-coverage-report",
      },
    ]),
    "ai-prototype-audio-coverage-report durable record prototype-audio-report-record must preserve tenant boundary.",
  );

  const alignedPrototypeRecord = {
    ...prototypeGateRecord,
    preservesTenantBoundary: true,
    tenantBoundaryKey: "tenant_id",
  };
  const alignedPrototypeIntent = {
    ...prototypeGateIntent,
    preservesTenantBoundary: true,
    tenantBoundaryKey: "tenant_id",
  };
  assertEqual(
    persistenceConsistency.validatePersistenceContractAlignment({
      durableRecords: [alignedPrototypeRecord],
      requiredCategories: ["ai-prototype-integration-readiness-gate"],
      adapterPlans: [{
        planId: "aligned-prototype-plan",
        label: "Aligned prototype plan",
        mode: "hosted-managed",
        recommendedForFirstPilot: false,
        costPosture: "controlled",
        deploymentChannels: ["hosted-web"],
        writeIntents: [alignedPrototypeIntent],
        handoffSteps: ["Review"],
        note: "Test alignment",
      }],
    }).length,
    0,
  );
  assertIncludes(
    persistenceConsistency.validatePersistenceContractAlignment({
      durableRecords: [alignedPrototypeRecord],
      requiredCategories: ["ai-prototype-integration-readiness-gate"],
      adapterPlans: [{
        planId: "mismatched-prototype-plan",
        label: "Mismatched prototype plan",
        mode: "hosted-managed",
        recommendedForFirstPilot: false,
        costPosture: "controlled",
        deploymentChannels: ["hosted-web"],
        writeIntents: [{ ...alignedPrototypeIntent, tenantBoundaryKey: "canonical_unit_key.tenant_id" }],
        handoffSteps: ["Review"],
        note: "Test alignment mismatch",
      }],
    }),
    "Persistence alignment requires ai-prototype-integration-readiness-gate adapter intent prototype-gate-intent to use a durable-record tenant boundary key.",
  );

  const reportRequest = {
    tenantId: "tenant-1", launchCode: "launch-1", targetLanguage: "en", format: "csv-summary", scopes: ["teacher-summary"],
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
  assertIncludes(
    report.validateTeacherReportRuntimeRequest({ ...reportRequest, targetLanguage: "  " }),
    "targetLanguage is required and must be non-blank",
  );
  assertEqual(report.createReviewOnlyTeacherReportRuntimeAdapter().execute(reportRequest).sideEffect, "none");
  assertEqual(report.validateTeacherReportCanonicalGameEvents(canonicalEvents, "tenant-1", "launch-1", "en").length, 0);
  assertIncludes(
    report.validateTeacherReportCanonicalGameEvents(canonicalEvents, "tenant-1", "launch-1", "ja"),
    "teacher report canonical game evidence: flashcards: Canonical game audio_requested events must use target language ja; found en.",
  );
  assertEqual(report.validateTeacherReportCanonicalGameEvents([
    { ...canonicalEvents[4], type: "audio_requested" },
  ], "tenant-1", "launch-1", "en").length, 0);
  assertIncludes(
    report.validateTeacherReportCanonicalGameEvents(canonicalEvents.slice(0, 4), "tenant-1", "launch-1", "en"),
    "teacher report canonical game evidence: flashcards: Canonical game event sequence must include mastery_updated.",
  );
  const malformedReportFlagErrors = report.validateTeacherReportRuntimeRequest({
    ...reportRequest,
    teacherRoleVerified: "true",
    policyAccepted: "true",
    persistenceReady: "true",
    exportApproved: "true",
    releaseApproved: "true",
    includesRawAudio: "false",
    includesTranscripts: "false",
  });
  assertIncludes(malformedReportFlagErrors, "teacherRoleVerified must be a boolean");
  assertIncludes(malformedReportFlagErrors, "policyAccepted must be a boolean");
  assertIncludes(malformedReportFlagErrors, "exportApproved must be a boolean");

  const reportPersistenceIntent = {
    intentId: "hosted-teacher-report-package-write",
    category: "teacher-report-package",
    label: "Write teacher report package boundaries",
    readiness: "requires-policy",
    targetStore: ["hosted-database", "school-policy"],
    deploymentChannels: ["hosted-web"],
    requiredBeforePilot: true,
    containsStudentData: true,
    requiresSchoolPolicy: true,
    canRunOffline: false,
    allowsExport: true,
    rejectsRawAudio: true,
    rejectsTranscripts: true,
    preservesTenantBoundary: true,
    tenantBoundaryKey: "canonical_unit_key.tenant_id",
    preservesReportEventAcceptanceSummary: true,
    preservesSettingsContext: true,
    note: "Test teacher report persistence intent",
  };
  const reportPersistenceRecord = {
    recordId: "teacher-report-package-record",
    category: "teacher-report-package",
    label: "Teacher report package durable record",
    readiness: "policy-required",
    sourceOfTruth: "teacher report package persistence contract",
    requiredBeforePilot: true,
    containsStudentData: true,
    containsMediaRights: false,
    supportsLocalDeployment: true,
    storesRawAudio: false,
    storesTranscript: false,
    recommendedFirstPilotStore: ["hosted-database", "local-classroom-store", "school-policy"],
    preservesTenantBoundary: true,
    tenantBoundaryKey: "canonical_unit_key.tenant_id",
    preservesReportEventAcceptanceSummary: true,
    preservesSettingsContext: true,
  };
  const readyReportRequest = {
    ...reportRequest,
    reportPlan: {
      ...reportRequest.reportPlan,
      readiness: "ready",
      policyAccepted: true,
      persistenceReady: true,
      excludesRawAudio: true,
      excludesTranscripts: true,
      note: "Ready report persistence rehearsal",
    },
    taxonomy: registry,
    eventEnvelopes: [],
    learnerIdentityMode: "pseudonymous-slots-only",
    policyAccepted: true,
    persistenceReady: true,
    exportApproved: true,
    releaseApproved: true,
    includesRawAudio: false,
    includesTranscripts: false,
  };
  const reportPersistenceRequest = {
    operation: "export",
    reportRequest: readyReportRequest,
    persistenceIntent: reportPersistenceIntent,
    durableRecord: reportPersistenceRecord,
    snapshot: teacherReportPackageSnapshot.createTeacherReportPackageSnapshot({
      scope: { tenantId: "tenant-1", packageId: "package-1", launchCode: "launch-1" },
      deploymentMode: "hosted-managed",
      createdAt: "2026-09-22T00:00:00.000Z",
      report: teacherLaunchReportAggregation.createTeacherLaunchReportAggregation([], { tenantId: "tenant-1", packageId: "package-1", launchCode: "launch-1" }),
      boundary: {
        boundaryId: "teacher-report-package:launch-1",
        label: "Teacher report package boundary",
        status: "export-blocked",
        decision: "Preview only",
        summary: "Review-only package",
        metrics: [],
        includedEvidence: ["learning evidence"],
        supportOnlySignals: ["media engagement"],
        excludedSensitiveFields: ["raw learner audio", "learner transcripts", "private identifiers"],
        requiredBeforeExport: ["policy acceptance"],
      },
      reportPlan: readyReportRequest.reportPlan,
      eventAcceptance: { gateId: "event-acceptance:launch-1", status: "demo-only", items: [] },
      eventEnvelope: { gateId: "progress-event-envelope:launch-1", status: "demo-only", taxonomyVersion: "taxonomy-v2026.07.foundation", envelopeCount: 0, blockedCount: 0, warningCount: 0 },
    }),
  };
  assertEqual(
    teacherReportPersistence.validateTeacherReportPersistenceRuntimeRequest(reportPersistenceRequest).length,
    0,
  );
  const reportRecoveryPacket = teacherReportPackageSnapshotRuntime.createTeacherReportPackageSnapshotRecoveryPacket(
    reportPersistenceRequest.snapshot,
    "local-classroom",
    "2026-09-22T00:01:00.000Z",
  );
  assertEqual(teacherReportPackageSnapshotRuntime.validateTeacherReportPackageSnapshotRecoveryPacket(reportRecoveryPacket).length, 0);
  const reportSnapshotAdapter = teacherReportPackageSnapshotRuntime.createReviewOnlyTeacherReportPackageSnapshotAdapter();
  const reportSnapshotRecoveryResult = reportSnapshotAdapter.execute({
    snapshot: reportPersistenceRequest.snapshot,
    operation: "restore",
    expectedDeploymentMode: "hosted-managed",
    targetDeploymentMode: "local-classroom",
    recoveryPacket: reportRecoveryPacket,
  });
  assertEqual(reportSnapshotRecoveryResult.decision.allowed, false);
  assertEqual(reportSnapshotRecoveryResult.sideEffect, "none");
  assertEqual(reportSnapshotRecoveryResult.snapshotValid, true);
  assertEqual(reportSnapshotRecoveryResult.recoveryPacketValid, true);
  assertIncludes(reportSnapshotRecoveryResult.decision.reasons, "No restore execution");
  assertIncludes(
    teacherReportPackageSnapshotRuntime.validateTeacherReportPackageSnapshotRecoveryPacket({
      ...reportRecoveryPacket,
      snapshotFingerprint: "tampered",
    }),
    "Teacher report snapshot recovery fingerprint does not match the snapshot.",
  );
  const reportPersistenceDecision = teacherReportPersistence
    .createReviewOnlyTeacherReportPersistenceAdapter()
    .execute(reportPersistenceRequest);
  assertEqual(reportPersistenceDecision.decision.allowed, false);
  assertEqual(reportPersistenceDecision.decision.reasonCode, "review-only-teacher-report-persistence");
  assertEqual(reportPersistenceDecision.sideEffect, "none");
  assertIncludes(reportPersistenceDecision.decision.reasons, "No teacher report package write");
  assertIncludes(reportPersistenceDecision.decision.reasons, "No teacher report export");
  assertIncludes(
    teacherReportPersistence.validateTeacherReportPersistenceRuntimeRequest({
      ...reportPersistenceRequest,
      snapshot: { ...reportPersistenceRequest.snapshot, exportAllowed: true },
    }),
    "Teacher report package snapshot exportAllowed must remain false.",
  );
  assertIncludes(
    teacherReportPersistence.validateTeacherReportPersistenceRuntimeRequest({
      ...reportPersistenceRequest,
      persistenceIntent: { ...reportPersistenceIntent, preservesSettingsContext: false },
    }),
    "Teacher report persistence intent must preserve settings context summaries.",
  );
  assertIncludes(
    teacherReportPersistence.validateTeacherReportPersistenceRuntimeRequest({
      ...reportPersistenceRequest,
      durableRecord: { ...reportPersistenceRecord, tenantBoundaryKey: "wrong.tenant_id" },
    }),
    "Teacher report persistence intent and durable record must use the same tenant boundary key.",
  );
  const mismatchedReportLaunchErrors = report.validateTeacherReportRuntimeRequest({
    ...reportRequest,
    taxonomy: registry,
    eventEnvelopes: [{ ...supportEnvelope, launch_code: "launch-2" }],
  });
  assertIncludes(mismatchedReportLaunchErrors, "teacher report event envelopes must use runtime launchCode launch-1; found: launch-2.");
  const missingReportLaunchErrors = report.validateTeacherReportRuntimeRequest({
    ...reportRequest,
    taxonomy: registry,
    eventEnvelopes: [supportEnvelope],
  });
  assertIncludes(missingReportLaunchErrors, "teacher report event envelopes must include launch_code matching runtime launchCode");
  const mismatchedReportTenantErrors = report.validateTeacherReportRuntimeRequest({
    ...reportRequest,
    taxonomy: registry,
    eventEnvelopes: [{
      ...supportEnvelope,
      launch_code: "launch-1",
      unit_key: "tenant-2:curriculum-1:L1:U1",
    }],
  });
  assertIncludes(mismatchedReportTenantErrors, "teacher report event envelopes must use runtime tenantId tenant-1; found: tenant-2.");

  const aiRequest = {
    requestId: "request-1", tenantId: "tenant-1", contentPackageId: "package-1",
    sourceReviewStatus: "draft", targetLanguage: "en", assistLanguage: "ja", level: 1,
    theme: "Greetings", gameMode: "flashcards", engineId: "pairing",
    vocabularyTerms: ["hello", "goodbye", "teacher", "friend", "morning", "afternoon", "please"],
    targetSentences: ["Hello, teacher."], targetLanguageAudioReady: false, mediaRightsReady: false,
    sourceEvidencePacketId: "source-evidence-1",
    activityCompatibilitySnapshotId: "activity-compatibility-1",
    audioCoverageRequirementId: "audio-coverage-1",
    mediaRightsManifestId: "media-rights-1",
    premiumAiCostGateId: "premium-cost-gate-1",
    supportLanguagePolicy: { progressionAllowed: false, scriptPolicy: "hiragana-only", levelBand: "foundation" },
    audioCoverageTargetLanguage: "en",
    teacherApprovalReady: false, premiumCostPolicyReady: false,
  };
  const aiErrors = aiService.validateAiGenerationServiceRequest(aiRequest);
  assertIncludes(aiErrors, "vocabularyTerms must contain between 8 and 12 terms");
  assertIncludes(aiErrors, "targetSentences must contain exactly 2 structures");
  assertIncludes(aiErrors, "target-language audio coverage is required");
  const malformedAiErrors = aiService.validateAiGenerationServiceRequest({});
  assertIncludes(malformedAiErrors, "requestId is required");
  assertIncludes(malformedAiErrors, "vocabularyTerms must be an array");
  assertIncludes(malformedAiErrors, "supportLanguagePolicy is required");
  assertIncludes(malformedAiErrors, "targetLanguageAudioReady must be a boolean");
  assertIncludes(malformedAiErrors, "teacherApprovalReady must be a boolean");
  assertIncludes(aiService.validateAiGenerationServiceRequest(null), "request must be an object");
  assertIncludes(aiErrors, "gameMode flashcards is not compatible with engineId pairing; expected selection");
  const missingEvidenceErrors = aiService.validateAiGenerationServiceRequest({
    ...aiRequest,
    sourceEvidencePacketId: "",
    mediaRightsManifestId: "",
  });
  assertIncludes(missingEvidenceErrors, "sourceEvidencePacketId is required");
  assertIncludes(missingEvidenceErrors, "mediaRightsManifestId is required");
  const wrongAudioLanguageErrors = aiService.validateAiGenerationServiceRequest({
    ...aiRequest,
    audioCoverageTargetLanguage: "ja",
  });
  assertIncludes(wrongAudioLanguageErrors, "audioCoverageTargetLanguage ja must match targetLanguage en");
  const malformedReadinessErrors = aiService.validateAiGenerationServiceRequest({
    ...aiRequest,
    targetLanguageAudioReady: "true",
    mediaRightsReady: "true",
    teacherApprovalReady: "false",
    premiumCostPolicyReady: "false",
  });
  assertIncludes(malformedReadinessErrors, "targetLanguageAudioReady must be a boolean");
  assertIncludes(malformedReadinessErrors, "mediaRightsReady must be a boolean");
  assertIncludes(malformedReadinessErrors, "teacherApprovalReady must be a boolean");
  assertIncludes(malformedReadinessErrors, "premiumCostPolicyReady must be a boolean");
  const unsafeSupportPolicyErrors = aiService.validateAiGenerationServiceRequest({
    ...aiRequest,
    supportLanguagePolicy: { progressionAllowed: true },
  });
  assertIncludes(unsafeSupportPolicyErrors, "supportLanguagePolicy.progressionAllowed must be false");
  const invalidAiLevelErrors = aiService.validateAiGenerationServiceRequest({
    ...aiRequest,
    level: 1,
    gameMode: "sentence-builder",
    engineId: "text-spelling",
  });
  assertIncludes(invalidAiLevelErrors, "gameMode sentence-builder is not available for level 1");
  const sameLanguageErrors = aiService.validateAiGenerationServiceRequest({
    ...aiRequest,
    assistLanguage: "en",
  });
  assertIncludes(sameLanguageErrors, "assistLanguage must differ from targetLanguage; assist language is support-only");
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
  assertIncludes(aiResult.reviewWarnings, "Assist language is comprehension support only and cannot satisfy scoring, mastery, or progression.");
  const malformedAiWarningResult = aiService.prepareReviewOnlyAiGenerationRequest({
    ...aiRequest,
    teacherApprovalReady: "false",
    premiumCostPolicyReady: "false",
  });
  assertIncludes(malformedAiWarningResult.reviewWarnings, "Teacher approval evidence is still required before any live handoff.");
  assertIncludes(malformedAiWarningResult.reviewWarnings, "Premium AI cost policy is not approved; provider billing remains blocked.");

  const alignmentMode = [{ modeId: "flashcards", parentEngine: "pairing" }];
  const alignmentBundle = {
    returnReview: { reviewId: "review-1", tenantId: "tenant-1", requestId: "request-1", modeReviews: alignmentMode },
    returnedPackageManifest: {
      manifestId: "manifest-1",
      tenantId: "tenant-1",
      requestId: "request-1",
      queueItemId: "queue-1",
      status: "not-returned",
      sourceRepository: "Drewsure/ministar-lab",
      sourceSnapshotId: "not-returned",
      prototypeFolder: "not-returned",
      targetMode: "flashcards",
      parentEngine: "pairing",
      targetSurface: "dom-reference",
      artifacts: [],
      blockedActions: [
        "No archive import",
        "No direct file copy into apps/web",
        "No direct file copy into apps/ai-service",
        "No active route replacement",
        "No scoring mutation",
        "No audio manifest mutation",
        "No package promotion",
        "No student assignment",
      ],
    },
    integrationPlan: { planId: "plan-1", tenantId: "tenant-1", requestId: "request-1", returnReviewId: "review-1", modePlans: alignmentMode },
    wrapperAdapterReview: { tenantId: "tenant-1", requestId: "request-1", integrationPlanId: "plan-1", modeReviews: alignmentMode },
    fixtureReplayReport: { tenantId: "tenant-1", requestId: "request-1", integrationPlanId: "plan-1", modeReports: alignmentMode },
    eventReplayReport: { tenantId: "tenant-1", requestId: "request-1", integrationPlanId: "plan-1", modeReports: alignmentMode },
    audioCoverageReport: { tenantId: "tenant-1", requestId: "request-1", integrationPlanId: "plan-1", modeReports: alignmentMode },
    mobileAccessibilityReport: { tenantId: "tenant-1", requestId: "request-1", integrationPlanId: "plan-1", modeReports: alignmentMode },
    scoringReplayReport: { tenantId: "tenant-1", requestId: "request-1", integrationPlanId: "plan-1", modeReports: alignmentMode },
    codexIntegrationDecision: { tenantId: "tenant-1", requestId: "request-1" },
    integrationReadinessGate: { tenantId: "tenant-1", requestId: "request-1", integrationPlanId: "plan-1" },
  };
  assertEqual(prototypeAlignment.validateAiPrototypeEvidenceAlignment(alignmentBundle).length, 0);
  assertIncludes(
    prototypeAlignment.validateAiPrototypeEvidenceAlignment({
      ...alignmentBundle,
      eventReplayReport: { ...alignmentBundle.eventReplayReport, requestId: "request-2" },
    }),
    "event replay report requestId does not match the return review request.",
  );
  assertIncludes(
    prototypeAlignment.validateAiPrototypeEvidenceAlignment({
      ...alignmentBundle,
      returnedPackageManifest: { ...alignmentBundle.returnedPackageManifest, requestId: "request-2" },
    }),
    "returned package manifest requestId does not match the return review request.",
  );
  assertIncludes(
    prototypeAlignment.validateAiPrototypeEvidenceAlignment({
      ...alignmentBundle,
      scoringReplayReport: {
        ...alignmentBundle.scoringReplayReport,
        modeReports: [{ modeId: "flashcards", parentEngine: "selection" }],
      },
    }),
    "scoring replay report changes the parent engine for mode flashcards.",
  );
  assertIncludes(
    prototypeAlignment.validateAiPrototypeEvidenceAlignmentBundles([
      alignmentBundle,
      { ...alignmentBundle, integrationPlan: { ...alignmentBundle.integrationPlan, planId: "plan-2" } },
    ]),
    "AI prototype evidence alignment collection must not repeat tenant and request pairs.",
  );
  assertIncludes(
    prototypeAlignment.validateAiPrototypeEvidenceAlignmentBundles([
      alignmentBundle,
      { ...alignmentBundle, returnReview: { ...alignmentBundle.returnReview, reviewId: "review-2", requestId: "request-2" } },
    ]),
    "AI prototype evidence alignment collection must not repeat integration plan IDs.",
  );
  assertIncludes(
    prototypeAlignment.validateAiPrototypeEvidenceAlignmentBundles([
      alignmentBundle,
      {
        ...alignmentBundle,
        returnReview: { ...alignmentBundle.returnReview, reviewId: "review-1", requestId: "request-2" },
        integrationPlan: { ...alignmentBundle.integrationPlan, planId: "plan-2", requestId: "request-2", returnReviewId: "review-1" },
        returnedPackageManifest: { ...alignmentBundle.returnedPackageManifest, manifestId: "manifest-2", requestId: "request-2" },
      },
    ]),
    "AI prototype evidence alignment collection must not repeat return review IDs.",
  );

  const returnedPackagePreview = {
    manifestId: "returned-package-preview-1",
    tenantId: "tenant-1",
    requestId: "request-1",
    queueItemId: "queue-1",
    status: "not-returned",
    sourceRepository: "Drewsure/ministar-lab",
    sourceSnapshotId: "not-returned",
    prototypeFolder: "not-returned",
    targetMode: "flashcards",
    parentEngine: "pairing",
    targetSurface: "dom-reference",
    artifacts: [],
    blockedActions: [
      "No archive import",
      "No direct file copy into apps/web",
      "No direct file copy into apps/ai-service",
      "No active route replacement",
      "No scoring mutation",
      "No audio manifest mutation",
      "No package promotion",
      "No student assignment",
    ],
  };
  assertEqual(returnedPackageManifest.validateAiPrototypeReturnedPackageManifest(returnedPackagePreview).length, 0);
  const phaserReturnedPackageProvenanceErrors = returnedPackageManifest.validateAiPrototypeReturnedPackageManifest({
    ...returnedPackagePreview,
    status: "review-only",
    targetSurface: "hybrid",
    sourceSnapshotId: "frozen-2026-09-12-other",
    sourceCommitSha: "eb79ddf5940ab47cc3c45c119c67ee1b6b958e55",
  });
  assertIncludes(
    phaserReturnedPackageProvenanceErrors,
    "Phaser returned package phaser candidate source snapshot must be frozen-2026-09-12-aaa-stable.",
  );
  assertIncludes(
    returnedPackageManifest.validateAiPrototypeReturnedPackageManifest({
      ...returnedPackagePreview,
      sourceRepository: "Drewsure/LivingTextbook",
    }),
    "AI prototype returned package manifest must use approved repository Drewsure/ministar-lab.",
  );
  assertIncludes(
    returnedPackageManifest.validateAiPrototypeReturnedPackageManifest({
      ...returnedPackagePreview,
      status: "review-only",
      sourceSnapshotId: "main",
      artifacts: [],
    }),
    "Returned prototype package sourceSnapshotId must be immutable and cannot use latest or main.",
  );
  assertIncludes(
    returnedPackageManifest.validateAiPrototypeReturnedPackageManifest({
      ...returnedPackagePreview,
      targetMode: "",
    }),
    "AI prototype returned package manifest must include targetMode, parentEngine, and targetSurface.",
  );
  assertIncludes(
    returnedPackageManifest.validateAiPrototypeReturnedPackageManifest({
      ...returnedPackagePreview,
      targetSurface: "canvas-only",
    }),
    "AI prototype returned package manifest targetSurface must be dom-reference, phaser, or hybrid.",
  );
  assertIncludes(
    returnedPackageManifest.validateAiPrototypeReturnedPackageManifest({
      ...returnedPackagePreview,
      artifacts: [{ artifactId: "bad-artifact", kind: "unknown", relativePath: "x", checksum: "", status: "present" }],
    }),
    "Returned prototype package artifact kind unknown is not supported.",
  );
  const reviewOnlyArtifacts = returnedPackageManifest.AI_PROTOTYPE_RETURNED_REQUIRED_ARTIFACT_KINDS.map((kind) => ({
    artifactId: `artifact-${kind}`,
    kind,
    relativePath: `evidence/${kind}.json`,
    checksum: "sha256:fixture",
    status: "reviewed",
  }));
  assertIncludes(
    returnedPackageManifest.validateAiPrototypeReturnedPackageManifest({
      ...returnedPackagePreview,
      status: "review-only",
      sourceSnapshotId: "abc123",
      prototypeFolder: "prototypes/flashcards",
      artifacts: reviewOnlyArtifacts.map((artifact) => ({ ...artifact, status: "present" })),
    }),
    "Returned prototype package review-only evidence for source-archive must be marked reviewed.",
  );
  const returnedPackageChecklist = {
    checklistId: "checklist-1",
    tenantId: "tenant-1",
    requestId: "request-1",
    queueItemId: "queue-1",
    status: "not-returned",
    sourceRepository: "Drewsure/ministar-lab",
    targetMode: "flashcards",
    parentEngine: "pairing",
    targetSurface: "dom-reference",
  };
  assertEqual(
    returnedPackageAlignment.validateAiPrototypeReturnedPackageAlignment(returnedPackagePreview, returnedPackageChecklist).length,
    0,
  );
  assertIncludes(
    returnedPackageAlignment.validateAiPrototypeReturnedPackageAlignment(
      { ...returnedPackagePreview, targetMode: "sentence-builder" },
      returnedPackageChecklist,
    ),
    "Returned package manifest targetMode does not match the return checklist.",
  );
  assertIncludes(
    returnedPackageAlignment.validateAiPrototypeReturnedPackageAlignment(
      { ...returnedPackagePreview, requestId: "request-2" },
      returnedPackageChecklist,
    ),
    "Returned package manifest requestId does not match the return checklist request.",
  );
  assertIncludes(
    returnedPackageAlignment.validateAiPrototypeReturnedPackageAlignment(
      { ...returnedPackagePreview, status: "review-only", sourceSnapshotId: "abc123" },
      returnedPackageChecklist,
    ),
    "A review-only returned package requires a return checklist ready-for-return-review status.",
  );
  const returnedPackageIntake = {
    itemId: "queue-1",
    tenantId: "tenant-1",
    requestId: "request-1",
    sourceRepository: "Drewsure/ministar-lab",
    targetMode: "flashcards",
    parentEngine: "pairing",
    targetSurface: "dom-reference",
  };
  assertEqual(
    returnedPackageAlignment.validateAiPrototypeReturnedPackageIntakeAlignment(returnedPackagePreview, returnedPackageIntake).length,
    0,
  );
  assertIncludes(
    returnedPackageAlignment.validateAiPrototypeReturnedPackageIntakeAlignment(
      { ...returnedPackagePreview, parentEngine: "selection" },
      returnedPackageIntake,
    ),
    "Returned package manifest parentEngine does not match the intake queue.",
  );
  assertIncludes(
    returnedPackageAlignment.validateAiPrototypeReturnedPackageIntakeAlignment(
      { ...returnedPackagePreview, requestId: "request-2" },
      returnedPackageIntake,
    ),
    "Returned package manifest requestId does not match the intake queue request.",
  );
  const prototypeIntakeAlertFixture = {
    alertId: "zai-alert-1",
    label: "Z.ai prototype intake alert",
    tenantId: "platform",
    status: "not-ready",
    summary: "The LivingTextbook foundation gate is open and the frozen Z.ai snapshot has been received.",
    humanSignalRule: "Human handoff signal: the exact Z.ai branch, commit, tag, and verification record are now identified; Codex must complete evidence and wrapper review before issuing an integration green light.",
    currentHumanAction: "Current human action: preserve the frozen main branch and tag in Drewsure/ministar-lab; no source copy is needed while Codex reviews the candidate.",
    notNeededYet: ["No handoff yet"],
    readyWhen: ["Parent engine readiness"],
    requiredEvidence: [...prototypeIntakeAlert.PROTOTYPE_INTAKE_ALERT_REQUIRED_EVIDENCE],
    blockedUntilReady: [...prototypeIntakeAlert.PROTOTYPE_INTAKE_ALERT_REQUIRED_BLOCKED_ACTIONS],
    ownerRule: "Codex owns architecture, schema discipline, wrapper/integration review, final merge decisions, and the user alert.",
  };
  assertEqual(prototypeIntakeAlert.validatePrototypeIntakeAlert(prototypeIntakeAlertFixture).length, 0);
  const prototypeIntakeReadinessSummaryFixture = {
    summaryId: "summary-1",
    label: "Prototype intake readiness summary",
    tenantId: "platform",
    status: "not-ready",
    codexAlertState: "Codex alert not issued",
    summary: "Review-only readiness summary.",
    lanes: [{ laneId: "returned-package-availability", label: "Returned prototype package", status: "missing", summary: "No package." }],
    blockedNextActions: ["No import"],
  };
  assertEqual(
    prototypeIntakeReadinessSummary.validatePrototypeIntakeReadinessSummary(prototypeIntakeReadinessSummaryFixture).length,
    0,
  );
  assertIncludes(
    prototypeIntakeReadinessSummary.validatePrototypeIntakeReadinessSummary({
      ...prototypeIntakeReadinessSummaryFixture,
      status: "ready-for-codex-alert",
    }),
    "Prototype intake readiness summary status must match its lanes: not-ready.",
  );
  assertIncludes(
    prototypeIntakeReadinessSummary.validatePrototypeIntakeReadinessSummary({
      ...prototypeIntakeReadinessSummaryFixture,
      lanes: [
        ...prototypeIntakeReadinessSummaryFixture.lanes,
        { ...prototypeIntakeReadinessSummaryFixture.lanes[0] },
      ],
    }),
    "Prototype intake readiness lane ID must be unique: returned-package-availability.",
  );
  const prototypeReturnReadinessSummaryFixture = {
    summaryId: "return-summary-1",
    label: "Prototype return readiness summary",
    tenantId: "platform",
    status: "not-ready",
    codexReviewState: "Codex return review not opened",
    summary: "Review-only return summary.",
    lanes: [{ laneId: "source-manifest-missing", label: "Source archive manifest", status: "missing", summary: "No manifest." }],
    blockedNextActions: ["No archive import"],
  };
  assertEqual(
    prototypeReturnReadinessSummary.validatePrototypeReturnReadinessSummary(prototypeReturnReadinessSummaryFixture).length,
    0,
  );
  assertIncludes(
    prototypeReturnReadinessSummary.validatePrototypeReturnReadinessSummary({
      ...prototypeReturnReadinessSummaryFixture,
      status: "ready-for-codex-return-review",
    }),
    "Prototype return readiness summary status must match its lanes: not-ready.",
  );
  assertIncludes(
    prototypeReturnReadinessSummary.validatePrototypeReturnReadinessSummary({
      ...prototypeReturnReadinessSummaryFixture,
      lanes: [
        ...prototypeReturnReadinessSummaryFixture.lanes,
        { ...prototypeReturnReadinessSummaryFixture.lanes[0] },
      ],
    }),
    "Prototype return readiness lane ID must be unique: source-manifest-missing.",
  );
  assertEqual(reviewSurfaceScope.validateReviewSurfaceScope("platform").length, 0);
  assertIncludes(
    reviewSurfaceScope.validateReviewSurfaceScope("mixed"),
    "Review surface scope must be platform or tenant.",
  );
  assertIncludes(
    persistenceRecords.validateDurableRecordContracts([
      {
        recordId: "evidence-packet-without-scope",
        category: "evidence-packet",
        label: "Evidence packet",
        readiness: "durable-required",
        sourceOfTruth: "test",
        requiredBeforePilot: false,
        containsStudentData: false,
        containsMediaRights: true,
        supportsLocalDeployment: true,
        recommendedFirstPilotStore: ["local-classroom-store"],
        storesRawAudio: false,
        storesTranscript: false,
      },
    ]),
    "evidence-packet durable record evidence-packet-without-scope: Review surface scope must be platform or tenant.",
  );
  const evidenceScopeRecord = {
    recordId: "evidence-scope-record",
    category: "evidence-packet",
    label: "Evidence packet",
    readiness: "durable-required",
    sourceOfTruth: "test",
    requiredBeforePilot: false,
    containsStudentData: false,
    containsMediaRights: true,
    supportsLocalDeployment: true,
    recommendedFirstPilotStore: ["local-classroom-store"],
    storesRawAudio: false,
    storesTranscript: false,
    scopeKind: "platform",
  };
  const evidenceScopeIntent = {
    intentId: "evidence-scope-intent",
    category: "evidence-packet",
    label: "Write evidence packets",
    readiness: "requires-backend",
    targetStore: ["local-classroom-store"],
    deploymentChannels: ["local-classroom-server"],
    requiredBeforePilot: false,
    containsStudentData: false,
    requiresSchoolPolicy: false,
    canRunOffline: true,
    allowsExport: true,
    rejectsRawAudio: true,
    rejectsTranscripts: true,
    note: "Test evidence scope mismatch.",
  };
  assertIncludes(
    persistenceAdapter.validatePersistenceAdapterPlan({
      planId: "evidence-scope-plan",
      label: "Evidence scope plan",
      mode: "local-classroom",
      recommendedForFirstPilot: false,
      costPosture: "lowest",
      deploymentChannels: ["local-classroom-server"],
      writeIntents: [evidenceScopeIntent],
      handoffSteps: ["Review"],
      note: "Test evidence scope",
    }),
    "evidence-packet write intent evidence-scope-intent: Review surface scope must be platform or tenant.",
  );
  assertIncludes(
    persistenceConsistency.validatePersistenceContractAlignment({
      durableRecords: [evidenceScopeRecord],
      requiredCategories: ["evidence-packet"],
      adapterPlans: [{
        planId: "evidence-scope-alignment-plan",
        label: "Evidence scope alignment plan",
        mode: "local-classroom",
        recommendedForFirstPilot: false,
        costPosture: "lowest",
        deploymentChannels: ["local-classroom-server"],
        writeIntents: [{ ...evidenceScopeIntent, scopeKind: "tenant" }],
        handoffSteps: ["Review"],
        note: "Test evidence scope alignment",
      }],
    }),
    "Persistence alignment requires evidence-packet adapter intent evidence-scope-intent to preserve durable-record scope_kind platform.",
  );
  assertEqual(
    prototypeIntakeAlert.validatePrototypeIntakeAlertTenantScope(prototypeIntakeAlertFixture, "platform").length,
    0,
  );
  assertIncludes(
    prototypeIntakeAlert.validatePrototypeIntakeAlertTenantScope(prototypeIntakeAlertFixture, "sample-publisher"),
    "Prototype intake alert tenantId must match the route tenant: sample-publisher.",
  );
  assertEqual(
    prototypeIntakeAlert.validatePrototypeIntakeAlertAlignment(prototypeIntakeAlertFixture, {
      status: "not-ready",
      tenantId: "platform",
      lanes: [{ laneId: "returned-package-availability", status: "missing" }],
    }).length,
    0,
  );
  assertIncludes(
    prototypeIntakeAlert.validatePrototypeIntakeAlertAlignment(
      { ...prototypeIntakeAlertFixture, status: "ready-for-review" },
      { status: "not-ready", tenantId: "platform", lanes: [{ laneId: "returned-package-availability", status: "missing" }] },
    ),
    "Prototype intake alert status must match the readiness decision: not-ready.",
  );
  assertIncludes(
    prototypeIntakeAlert.validatePrototypeIntakeAlertAlignment(prototypeIntakeAlertFixture, {
      status: "not-ready",
      tenantId: "sample-publisher",
      lanes: [{ laneId: "returned-package-availability", status: "missing" }],
    }),
    "Prototype intake alert tenantId must match the readiness signal tenant: sample-publisher.",
  );
  assertIncludes(
    prototypeIntakeAlert.validatePrototypeIntakeAlert({
      ...prototypeIntakeAlertFixture,
      blockedUntilReady: [],
    }),
    "Prototype intake alert must block action: No direct app file writes.",
  );
  assertEqual(
    prototypeIntakeAlert.derivePrototypeIntakeAlertDecision({
      status: "not-ready",
      lanes: [
        { laneId: "returned-package-manifest-contract", status: "ready" },
        { laneId: "returned-package-availability", status: "missing" },
      ],
    }),
    "not-ready",
  );
  assertEqual(
    prototypeIntakeAlert.derivePrototypeIntakeAlertDecision({
      status: "not-ready",
      lanes: [{ laneId: "returned-package-manifest-contract", status: "blocked" }],
    }),
    "blocked",
  );
  assertEqual(
    prototypeIntakeAlert.derivePrototypeIntakeAlertDecision({
      status: "ready-for-codex-alert",
      lanes: [{ laneId: "returned-package-manifest-contract", status: "ready" }],
    }),
    "ready-for-review",
  );
  assertEqual(
    prototypeIntakeAlert.derivePrototypeIntakeReadinessStatus([
      { status: "ready" },
      { status: "missing" },
    ]),
    "not-ready",
  );
  assertEqual(
    prototypeIntakeAlert.derivePrototypeIntakeReadinessStatus([
      { status: "ready" },
      { status: "blocked" },
    ]),
    "evidence-review-needed",
  );
  assertEqual(
    prototypeIntakeAlert.derivePrototypeIntakeReadinessStatus([
      { status: "ready" },
      { status: "ready" },
    ]),
    "ready-for-codex-alert",
  );
  assertEqual(
    prototypeIntakeAlert.derivePrototypeIntakeCodexAlertState("not-ready"),
    "Codex alert not issued",
  );
  assertEqual(
    prototypeIntakeAlert.derivePrototypeIntakeCodexAlertState("blocked"),
    "Codex alert blocked by structural evidence",
  );
  assertEqual(
    prototypeIntakeAlert.derivePrototypeIntakeCodexAlertState("ready-for-review"),
    "Codex alert ready",
  );
  assertEqual(
    prototypeReturnReadiness.derivePrototypeReturnReadinessStatus([
      { status: "ready" },
      { status: "missing" },
      { status: "blocked" },
    ]),
    "not-ready",
  );
  assertEqual(
    prototypeReturnReadiness.derivePrototypeReturnReadinessStatus([
      { status: "ready" },
      { status: "blocked" },
    ]),
    "evidence-review-needed",
  );
  assertEqual(
    prototypeReturnReadiness.derivePrototypeReturnReadinessStatus([
      { status: "ready" },
      { status: "ready" },
    ]),
    "ready-for-codex-return-review",
  );
  assertEqual(
    prototypeReturnReadiness.derivePrototypeReturnReviewState("not-ready"),
    "Codex return review not opened",
  );
  assertEqual(
    prototypeReturnReadiness.derivePrototypeReturnReviewState("evidence-review-needed"),
    "Codex return review blocked by evidence",
  );
  assertEqual(
    prototypeReturnReadiness.derivePrototypeReturnReviewState("ready-for-codex-return-review"),
    "Codex return review ready",
  );
  assertEqual(
    integrationReadiness.deriveAiPrototypeIntegrationReadinessGateStatus([]),
    "blocked",
  );
  assertEqual(
    integrationReadiness.deriveAiPrototypeIntegrationReadinessGateStatus([
      { status: "reviewed" },
      { status: "pending-review" },
    ]),
    "review-only",
  );
  assertEqual(
    integrationReadiness.deriveAiPrototypeIntegrationReadinessGateStatus([
      { status: "reviewed" },
      { status: "reviewed" },
    ]),
    "ready-for-codex-review",
  );
  const integrationEvidenceChecks = integrationReadiness.AI_PROTOTYPE_INTEGRATION_READINESS_REQUIRED_EVIDENCE_RECORDS.map(
    (sourceRecord) => ({
      checkId: sourceRecord,
      label: sourceRecord,
      sourceRecord,
      status: "blocked",
      requiredBeforeIntegration: true,
      blocker: "Evidence remains blocked until review.",
    }),
  );
  const integrationGateFixture = {
    gateId: "integration-gate-1",
    tenantId: "tenant-1",
    requestId: "request-1",
    integrationPlanId: "plan-1",
    label: "AI prototype integration readiness gate",
    status: "blocked",
    summary: "Review-only rollup proving that every returned prototype has wrapper, fixture, event, audio, mobile, scoring, and Codex decision evidence before any apps/web integration patch can be proposed.",
    sourceRecords: [...integrationReadiness.AI_PROTOTYPE_INTEGRATION_READINESS_REQUIRED_SOURCE_RECORDS],
    evidenceChecks: integrationEvidenceChecks,
    integrationPolicy: [...integrationReadiness.AI_PROTOTYPE_INTEGRATION_READINESS_REQUIRED_POLICY],
    blockedActions: [...integrationReadiness.AI_PROTOTYPE_INTEGRATION_READINESS_BLOCKED_ACTIONS],
    nextRequiredRecords: [...integrationReadiness.AI_PROTOTYPE_INTEGRATION_READINESS_NEXT_RECORDS],
  };
  assertEqual(
    integrationReadiness.validateAiPrototypeIntegrationReadinessGate(integrationGateFixture).length,
    0,
  );
  assertIncludes(
    integrationReadiness.validateAiPrototypeIntegrationReadinessGate({
      ...integrationGateFixture,
      status: "ready-for-codex-review",
    }),
    "AI prototype integration readiness gate status must match its evidence checks: expected blocked, received ready-for-codex-review.",
  );
  assertEqual(
    codexDecision.deriveAiPrototypeCodexIntegrationDecisionStatus([]),
    "blocked",
  );
  assertEqual(
    codexDecision.deriveAiPrototypeCodexIntegrationDecisionStatus([
      { status: "reviewed" },
      { status: "pending-review" },
    ]),
    "review-only",
  );
  assertEqual(
    codexDecision.deriveAiPrototypeCodexIntegrationDecisionStatus([
      { status: "reviewed" },
      { status: "reviewed" },
    ]),
    "ready-for-review",
  );

  const codexDecisionFixture = {
    decisionId: "decision-1",
    tenantId: "tenant-1",
    requestId: "request-1",
    label: "Codex integration review decision",
    status: "blocked",
    summary: "Manual Codex review remains blocked until the evidence packet is complete.",
    selectedDecision: "No decision recorded",
    sourceRecords: [...codexDecision.AI_PROTOTYPE_CODEX_DECISION_REQUIRED_SOURCE_RECORDS],
    checks: codexDecision.AI_PROTOTYPE_CODEX_DECISION_REQUIRED_CHECKS.map((check, index) => ({
      label: check.label,
      status: index === 0 ? "blocked" : "pending-review",
      evidence: "Evidence remains blocked until review.",
      requiredRecord: check.requiredRecord,
    })),
    decisionOptions: [...codexDecision.AI_PROTOTYPE_CODEX_DECISION_OPTIONS],
    requiredBeforeDecision: [...codexDecision.AI_PROTOTYPE_CODEX_DECISION_REQUIRED_BEFORE_DECISION],
    blockedActions: [...codexDecision.AI_PROTOTYPE_CODEX_DECISION_BLOCKED_ACTIONS],
  };
  assertEqual(codexDecision.validateAiPrototypeCodexIntegrationDecision(codexDecisionFixture).length, 0);
  assertIncludes(
    codexDecision.validateAiPrototypeCodexIntegrationDecision({
      ...codexDecisionFixture,
      checks: [
        ...codexDecisionFixture.checks,
        { ...codexDecisionFixture.checks[0] },
      ],
    }),
    "AI prototype Codex integration decision checks must not repeat labels.",
  );
  assertIncludes(
    codexDecision.validateAiPrototypeCodexIntegrationDecision({
      ...codexDecisionFixture,
      checks: codexDecisionFixture.checks.map((check, index) =>
        index === 1 ? { ...check, requiredRecord: codexDecisionFixture.checks[0].requiredRecord } : check,
      ),
    }),
    "AI prototype Codex integration decision checks must not repeat required records.",
  );
  assertIncludes(
    codexDecision.validateAiPrototypeCodexIntegrationDecisions([
      codexDecisionFixture,
      { ...codexDecisionFixture, decisionId: "decision-2" },
    ]),
    "AI prototype Codex integration decision collection must not repeat tenant and request pairs.",
  );
  assertIncludes(
    codexDecision.validateAiPrototypeCodexIntegrationDecisions([
      codexDecisionFixture,
      { ...codexDecisionFixture, tenantId: "tenant-2", requestId: "request-2" },
    ]),
    "AI prototype Codex integration decision collection must not repeat decision IDs.",
  );

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

  assertEqual(
    contentModel.resolveTargetLanguage({ tenantTargetLanguage: "ja", unitLanguage: "en" }),
    "ja",
  );
  assertEqual(
    contentModel.resolveTargetLanguage({ tenantTargetLanguage: "", unitLanguage: "ja" }),
    "ja",
  );
  assertEqual(
    contentModel.resolveTargetLanguage({ tenantTargetLanguage: "  ", unitLanguage: "  ", fallback: "fr" }),
    "fr",
  );
  assertEqual(contentModel.resolveTargetLanguage(), "en");
  assertIncludes(
    aiDraftPayload.validateAiGeneratedDraftPayload({}),
    "AI generated draft payload must include a non-empty unit_meta.target_language.",
  );

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
  const futureModeSession = contentModel.createLaunchSession({
    ...progressionSession,
    launchCode: "launch-level-aware-1",
    recommendedNextModes: ["sentence-builder", "match-up"],
  });
  const futureModeProgression = contentModel.completeEntryPractice({
    progression: contentModel.getInitialStudentProgression({
      studentSessionId: "launch-level-aware-1:student-1",
      launchSession: futureModeSession,
    }),
    launchSession: futureModeSession,
    occurredAt: "2026-01-01T00:05:00.000Z",
  });
  assertEqual(futureModeProgression.unlockedGameModes.includes("sentence-builder"), false);
  assertEqual(futureModeProgression.unlockedGameModes.includes("match-up"), true);

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
  const malformedEntitlementFlagErrors = entitlement.validateEntitlementRuntimeRequest({
    ...premiumTutorRequest,
    teacherApprovalAccepted: "true",
    schoolPolicyAccepted: "true",
    privacyPolicyAccepted: "true",
    costPolicyAccepted: "true",
    persistenceReady: "true",
    releaseApprovalAccepted: "true",
    allowedLevelsDeclared: "true",
    usageLimitDeclared: "true",
    targetLanguageAudioReady: "true",
  });
  assertIncludes(malformedEntitlementFlagErrors, "teacherApprovalAccepted must be a boolean");
  assertIncludes(malformedEntitlementFlagErrors, "targetLanguageAudioReady must be a boolean");

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
