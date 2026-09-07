import { createRequire } from "node:module";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-runtime-"));

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
  ], { cwd: root, encoding: "utf8" });

  if (compile.status !== 0) {
    process.stdout.write(compile.stdout);
    process.stderr.write(compile.stderr);
    process.exit(1);
  }

  const progression = require(join(output, "progressionRuntime.js"));
  const recovery = require(join(output, "recoveryRuntime.js"));
  const reward = require(join(output, "rewardRuntime.js"));
  const entitlement = require(join(output, "entitlementRuntime.js"));

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

  console.log("PASS runtime behavior harness rejects support-only progression, random rewards, unsafe recovery, and core-tier AI Tutor activation.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function assertIncludes(values, expected) {
  if (!values.includes(expected)) throw new Error(`Expected runtime behavior marker: ${expected}`);
}

function assertEqual(actual, expected) {
  if (actual !== expected) throw new Error(`Expected ${expected}, received ${actual}`);
}
