import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const candidateRootValue = process.env.LIVING_TEXTBOOOK_ZAI_CANDIDATE_ROOT;
if (!candidateRootValue) {
  console.error("NOT READY No candidate package supplied. Set LIVING_TEXTBOOOK_ZAI_CANDIDATE_ROOT to the isolated return folder.");
  process.exit(2);
}

const candidateRoot = resolve(candidateRootValue);
const returnPackagePath = join(candidateRoot, "evidence", "return-package.json");
if (!existsSync(candidateRoot) || !existsSync(returnPackagePath)) {
  fail(`Candidate package must contain evidence/return-package.json under ${candidateRoot}.`);
}

let manifest;
try {
  manifest = JSON.parse(readFileSync(returnPackagePath, "utf8"));
} catch (error) {
  fail(`Candidate return-package.json is not valid JSON: ${error.message}`);
}

if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) {
  fail("Candidate return-package.json must contain a JSON object.");
}

const failures = [];
const requiredArtifactKinds = [
  "source-archive",
  "fixture",
  "readme",
  "event-replay",
  "audio-coverage",
  "scoring-replay",
  "mobile-evidence",
  "wrapper-notes",
];
const requiredBlockedActions = [
  "No archive import",
  "No direct file copy into apps/web",
  "No direct file copy into apps/ai-service",
  "No active route replacement",
  "No scoring mutation",
  "No audio manifest mutation",
  "No package promotion",
  "No student assignment",
];

requireValue(manifest.sourceRepository === "Drewsure/ministar-lab", "sourceRepository must be Drewsure/ministar-lab.");
requireValue(manifest.sourceSnapshotId === "frozen-2026-09-12-aaa-stable", "sourceSnapshotId must be the immutable frozen snapshot tag.");
requireValue(manifest.sourceCommitSha === "eb79ddf5940ab47cc3c45c119c67ee1b6b958e55", "sourceCommitSha must match the frozen source commit.");
requireValue(manifest.targetMode === "memory-match", "targetMode must be memory-match.");
requireValue(manifest.parentEngine === "pairing", "parentEngine must be pairing.");
requireValue(manifest.targetSurface === "phaser" || manifest.targetSurface === "hybrid", "targetSurface must be phaser or hybrid.");
requireValue(["review-only", "blocked"].includes(manifest.status), "status must remain review-only or blocked.");
requireValue(isNonBlankString(manifest.tenantId), "tenantId is required.");
requireValue(isNonBlankString(manifest.requestId), "requestId is required.");
requireValue(isNonBlankString(manifest.queueItemId), "queueItemId is required.");
requireValue(isNonBlankString(manifest.prototypeFolder), "prototypeFolder is required.");
requireValue(isSafeRelativePath(manifest.prototypeFolder), "prototypeFolder must be a safe relative path.");

const artifacts = Array.isArray(manifest.artifacts) ? manifest.artifacts : [];
requireValue(artifacts.length === requiredArtifactKinds.length, `artifacts must contain exactly ${requiredArtifactKinds.length} entries.`);

const seenKinds = new Set();
const seenIds = new Set();
for (const artifact of artifacts) {
  if (!artifact || typeof artifact !== "object") {
    failures.push("Every artifact must be a JSON object.");
    continue;
  }

  if (!requiredArtifactKinds.includes(artifact.kind)) failures.push(`Unsupported artifact kind: ${artifact.kind || "(missing)"}.`);
  if (seenKinds.has(artifact.kind)) failures.push(`Artifact kind is repeated: ${artifact.kind}.`);
  seenKinds.add(artifact.kind);
  if (!isNonBlankString(artifact.artifactId)) failures.push("Every artifact requires artifactId.");
  if (seenIds.has(artifact.artifactId)) failures.push(`Artifact id is repeated: ${artifact.artifactId}.`);
  seenIds.add(artifact.artifactId);
  if (artifact.status !== "reviewed") failures.push(`Artifact ${artifact.artifactId || artifact.kind} must be marked reviewed.`);
  if (!/^[0-9a-f]{64}$/i.test(artifact.checksum || "")) {
    failures.push(`Artifact ${artifact.artifactId || artifact.kind} requires a SHA-256 checksum.`);
    continue;
  }
  if (!isSafeRelativePath(artifact.relativePath)) {
    failures.push(`Artifact ${artifact.artifactId || artifact.kind} requires a safe relative path.`);
    continue;
  }

  const artifactPath = resolve(candidateRoot, artifact.relativePath);
  if (!isWithin(candidateRoot, artifactPath)) {
    failures.push(`Artifact ${artifact.artifactId || artifact.kind} resolves outside the candidate root.`);
    continue;
  }
  if (!existsSync(artifactPath)) {
    failures.push(`Artifact ${artifact.artifactId || artifact.kind} is missing at ${artifact.relativePath}.`);
    continue;
  }
  const actualChecksum = createHash("sha256").update(readFileSync(artifactPath)).digest("hex");
  if (actualChecksum !== artifact.checksum.toLowerCase()) {
    failures.push(`Artifact ${artifact.artifactId || artifact.kind} checksum mismatch: expected ${artifact.checksum}, found ${actualChecksum}.`);
  }
}

for (const kind of requiredArtifactKinds) {
  if (!seenKinds.has(kind)) failures.push(`Required artifact kind is missing: ${kind}.`);
}

const blockedActions = Array.isArray(manifest.blockedActions) ? manifest.blockedActions : [];
for (const action of requiredBlockedActions) {
  if (!blockedActions.includes(action)) failures.push(`Missing blocked action: ${action}.`);
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `FAIL ${failure}`).join("\n"));
  process.exit(1);
}

console.log(`PASS Memory Match candidate package is hash-verified, frozen-source-bound, and remains review-only (${relative(candidateRoot, returnPackagePath)}).`);

function requireValue(condition, message) {
  if (!condition) failures.push(message);
}

function isNonBlankString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isSafeRelativePath(value) {
  return (
    isNonBlankString(value) &&
    !value.startsWith("/") &&
    !value.includes("..") &&
    !value.includes("\\") &&
    !value.includes(":")
  );
}

function isWithin(root, target) {
  const rootWithSeparator = root.endsWith("\\") || root.endsWith("/") ? root : `${root}\\`;
  return target === root || target.startsWith(rootWithSeparator);
}

function fail(message) {
  console.error(`FAIL ${message}`);
  process.exit(1);
}
