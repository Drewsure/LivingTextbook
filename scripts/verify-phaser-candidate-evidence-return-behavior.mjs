import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-phaser-return-behavior-"));
const tsc = join(root, "node_modules", "typescript", "bin", "tsc");

try {
  writeFileSync(join(output, "package.json"), '{"type":"commonjs"}\n', "utf8");
  const compile = spawnSync(process.execPath, [
    tsc,
    "--module", "commonjs",
    "--target", "ES2022",
    "--moduleResolution", "node",
    "--skipLibCheck",
    "--rootDir", join(root, "packages", "content-model", "src"),
    "--outDir", output,
    "packages/content-model/src/phaserCandidateEvidenceReturnPacket.ts",
    "packages/content-model/src/phaserCandidateIntegrationEligibility.ts",
    "packages/content-model/src/phaserCandidateSourceIdentity.ts",
    "packages/content-model/src/aiPrototypeReturnedPackageManifest.ts",
  ], { cwd: root, encoding: "utf8" });
  if (compile.status !== 0) {
    process.stdout.write(compile.stdout);
    process.stderr.write(compile.stderr);
    process.exit(1);
  }

  const packetModel = require(join(output, "phaserCandidateEvidenceReturnPacket.js"));
  const eligibilityModel = require(join(output, "phaserCandidateIntegrationEligibility.js"));
  const manifestModel = require(join(output, "aiPrototypeReturnedPackageManifest.js"));
  const sourceModel = require(join(output, "phaserCandidateSourceIdentity.js"));
  const eligibility = buildEligibility(eligibilityModel, sourceModel);
  const awaitingManifest = buildManifest(manifestModel, sourceModel, "not-returned");
  const awaitingPacket = buildPacket(packetModel, eligibility, awaitingManifest, "awaiting-return");

  assertEmpty(
    packetModel.validatePhaserCandidateEvidenceReturnPacket(awaitingPacket, awaitingManifest, eligibility),
    "awaiting-return packet",
  );

  const reviewedManifest = buildManifest(manifestModel, sourceModel, "review-only");
  const reviewedPacket = buildPacket(packetModel, eligibility, reviewedManifest, "received-review-only");
  assertEmpty(
    packetModel.validatePhaserCandidateEvidenceReturnPacket(reviewedPacket, reviewedManifest, eligibility),
    "received review-only packet",
  );

  const unknownArtifactPacket = structuredClone(reviewedPacket);
  unknownArtifactPacket.receipts[0].artifactIds = ["artifact-does-not-exist"];
  assertIncludes(
    packetModel.validatePhaserCandidateEvidenceReturnPacket(unknownArtifactPacket, reviewedManifest, eligibility),
    "cites unknown artifact",
    "unknown artifact rejection",
  );

  const unverifiedManifest = structuredClone(reviewedManifest);
  unverifiedManifest.artifacts[0].checksum = "";
  const unverifiedPacket = buildPacket(packetModel, eligibility, unverifiedManifest, "received-review-only");
  assertIncludes(
    packetModel.validatePhaserCandidateEvidenceReturnPacket(unverifiedPacket, unverifiedManifest, eligibility),
    "cites unverified artifact",
    "missing checksum rejection",
  );

  const incompletePacket = structuredClone(reviewedPacket);
  incompletePacket.receipts.pop();
  assertIncludes(
    packetModel.validatePhaserCandidateEvidenceReturnPacket(incompletePacket, reviewedManifest, eligibility),
    "missing lane",
    "incomplete lane rejection",
  );

  const wrongSourcePacket = { ...awaitingPacket, sourceSnapshotId: "mutable-branch" };
  assertIncludes(
    packetModel.validatePhaserCandidateEvidenceReturnPacket(wrongSourcePacket, awaitingManifest, eligibility),
    "source snapshot must be",
    "mutable source rejection",
  );

  console.log("PASS Phaser candidate evidence return behavior accepts valid awaiting/review-only packets and rejects unknown artifacts, missing checksums, incomplete lanes, and mutable source identity.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function buildEligibility(model, sourceModel) {
  return {
    eligibilityId: "memory-match-integration-eligibility",
    tenantId: "ministar",
    queueItemId: "intake-ministar-memory-match-phaser",
    gameMode: "memory-match",
    parentEngine: "pairing",
    sourceSnapshotId: sourceModel.PHASER_CANDIDATE_SOURCE_SNAPSHOT_ID,
    sourceCommitSha: sourceModel.PHASER_CANDIDATE_SOURCE_COMMIT_SHA,
    canonicalRoute: "/memory/[code]",
    canonicalComponent: "apps/web/src/features/game-shell/pairing/PairingMemoryMatchGame.tsx",
    scoringProfile: "pairing-reinforcement-v1",
    status: "blocked",
    sourceIsolationRequired: true,
    evidenceLanes: model.PHASER_CANDIDATE_REQUIRED_EVIDENCE_LANE_IDS.map((laneId) => ({
      laneId,
      label: laneId,
      status: laneId === "wrapper-approval" ? "blocked" : "reviewed",
      sourceRecord: `source-${laneId}`,
      requirement: `Requirement for ${laneId}`,
    })),
    wrapperAllowed: false,
    directImportAllowed: false,
    routeReplacementAllowed: false,
    sceneScoringAllowed: false,
    browserPersistenceAllowed: false,
    packagePromotionAllowed: false,
    studentAssignmentAllowed: false,
    blockedActions: [
      "No direct source import",
      "No wrapper approval",
      "No route replacement",
      "No scene-owned scoring",
      "No browser persistence ownership",
      "No package promotion",
      "No student assignment",
    ],
    nextRequiredEvidence: ["Wrapper decision"],
    note: "Evidence-only candidate gate.",
  };
}

function buildManifest(model, sourceModel, status) {
  const base = {
    manifestId: "returned-package-manifest-memory-match",
    tenantId: "ministar",
    requestId: "ministar-memory-match-evidence-request",
    queueItemId: "intake-ministar-memory-match-phaser",
    status,
    sourceRepository: sourceModel.PHASER_CANDIDATE_SOURCE_REPOSITORY,
    sourceSnapshotId: status === "not-returned" ? "not-returned" : sourceModel.PHASER_CANDIDATE_SOURCE_SNAPSHOT_ID,
    sourceCommitSha: status === "not-returned" ? undefined : sourceModel.PHASER_CANDIDATE_SOURCE_COMMIT_SHA,
    prototypeFolder: status === "not-returned" ? "not-returned" : "candidate/memory-match",
    targetMode: "memory-match",
    parentEngine: "pairing",
    targetSurface: "phaser",
    artifacts: [],
    blockedActions: [...model.AI_PROTOTYPE_RETURNED_BLOCKED_ACTIONS],
  };
  if (status === "not-returned") return base;
  return {
    ...base,
    artifacts: model.AI_PROTOTYPE_RETURNED_REQUIRED_ARTIFACT_KINDS.map((kind, index) => ({
      artifactId: `artifact-${kind}`,
      kind,
      relativePath: kind === "readme" ? "README.md" : `evidence/${kind}.json`,
      checksum: `${String(index + 1).repeat(64)}`,
      status: "reviewed",
    })),
  };
}

function buildPacket(model, eligibility, manifest, status) {
  const receiptArtifactIds = status === "received-review-only"
    ? manifest.artifacts.map((artifact) => artifact.artifactId)
    : [];
  return {
    packetId: `evidence-return-${status}`,
    manifestId: manifest.manifestId,
    eligibilityId: eligibility.eligibilityId,
    tenantId: manifest.tenantId,
    requestId: manifest.requestId,
    queueItemId: manifest.queueItemId,
    gameMode: manifest.targetMode,
    parentEngine: manifest.parentEngine,
    sourceRepository: eligibility.sourceRepository ?? "Drewsure/ministar-lab",
    sourceSnapshotId: eligibility.sourceSnapshotId,
    sourceCommitSha: eligibility.sourceCommitSha,
    status,
    requiredArtifactNames: [...model.PHASER_CANDIDATE_REQUIRED_RETURN_ARTIFACT_NAMES],
    receipts: eligibility.evidenceLanes.map((lane, index) => ({
      laneId: lane.laneId,
      artifactIds: status === "received-review-only" ? [receiptArtifactIds[index % receiptArtifactIds.length]] : [],
      status: status === "received-review-only" ? "reviewed" : "missing",
    })),
    importAllowed: false,
    routeReplacementAllowed: false,
    studentAssignmentAllowed: false,
    codexReviewRequired: true,
    note: "Evidence only.",
  };
}

function assertEmpty(errors, label) {
  if (errors.length > 0) throw new Error(`${label} unexpectedly failed: ${errors.join(" | ")}`);
}

function assertIncludes(errors, expected, label) {
  if (!errors.some((error) => error.includes(expected))) {
    throw new Error(`${label} did not include ${expected}: ${errors.join(" | ")}`);
  }
}
