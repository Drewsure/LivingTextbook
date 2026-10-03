import { existsSync, mkdtempSync, readFileSync, realpathSync, rmSync, statSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, resolve, sep } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { validatePilotPackageReviewEvidence, validateTeacherAnswerKeyEvidence } from "./pilot-package-review-evidence.mjs";

const options = parseArguments(process.argv.slice(2));
if (options.help) {
  console.log("Usage: node scripts/verify-pilot-human-evidence.mjs --root <evidence-folder> [--publisher-root <publisher-folder>] [--json]");
  process.exit(0);
}
if (options.selfTest) {
  runSelfTest();
  process.exit(0);
}
if (!options.root) fail("Missing --root.");

const repositoryRoot = realpathSync(resolve(fileURLToPath(new URL("..", import.meta.url))));
const evidenceRoot = resolve(options.root);
if (!existsDirectory(evidenceRoot)) fail(`Human evidence root does not exist: ${evidenceRoot}`);
const evidenceRealPath = realpathSync(evidenceRoot);
if (isWithin(repositoryRoot, evidenceRealPath)) fail("Human evidence must remain outside the LivingTextbook repository.");

const errors = [];
const policy = readJson(join(evidenceRealPath, "delivery-policy.json"), "delivery-policy.json");
const release = readJson(join(evidenceRealPath, "release-authorization.json"), "release-authorization.json");
const packageReview = readJson(join(evidenceRealPath, "package-review-evidence.json"), "package-review-evidence.json");

const policyErrorCount = errors.length;
validatePolicy(policy);
const policyValid = policy && errors.length === policyErrorCount;
const releaseErrorCount = errors.length;
validateRelease(release);
const releaseValid = release && errors.length === releaseErrorCount;
const packageReviewErrorCount = errors.length;
if (packageReview) errors.push(...validatePilotPackageReviewEvidence(packageReview));
const packageReviewValid = packageReview && errors.length === packageReviewErrorCount;
if (policy && release) {
  for (const key of ["tenantId", "packageId", "unitKey", "mode"]) {
    if (policy[key] !== release[key]) errors.push(`Policy and release ${key} must match.`);
  }
  if (policy.hostedPersistenceOptIn !== release.hostedPersistenceOptIn) errors.push("Policy and release hostedPersistenceOptIn must match.");
}
if (policy && packageReview) {
  for (const key of ["tenantId", "packageId", "unitKey"]) {
    if (policy[key] !== packageReview[key]) errors.push(`Policy and package review ${key} must match.`);
  }
  const packageChecksum = release?.finalChecksums?.find((checksum) => checksum?.kind === "package")?.sha256;
  if (packageChecksum && packageReview.packageChecksumSha256 !== `sha256:${packageChecksum}`) errors.push("Package review package checksum must match release package checksum.");
}

if (options.publisherRoot && policy) {
  const publisherRootPath = resolve(options.publisherRoot);
  const publisherBrief = readJson(join(publisherRootPath, "publisher-pilot-intake.json"), "publisher-pilot-intake.json");
  const publisherSourcePreflight = readJson(join(publisherRootPath, "evidence", "publisher-source-preflight.json"), "publisher-source-preflight.json");
  if (publisherBrief) {
    if (policy.tenantId !== publisherBrief.tenantId) errors.push("Human evidence tenantId must match the publisher intake tenantId.");
    if (policy.unitKey !== publisherBrief.unitKey) errors.push("Human evidence unitKey must match the publisher intake unitKey.");
  }
  if (packageReview && publisherSourcePreflight && packageReview.sourceInventoryChecksumSha256 !== publisherSourcePreflight.inventoryChecksumSha256) {
    errors.push("Package review source inventory checksum must match publisher source preflight.");
  }
  if (publisherBrief?.teacherAnswerFiles?.length) {
    const teacherAnswerErrors = validateTeacherAnswerKeyEvidence(packageReview?.teacherAnswerKeyEvidence, {
      tenantId: policy.tenantId,
      packageId: policy.packageId,
      unitKey: policy.unitKey,
      expectedPaths: publisherBrief.teacherAnswerFiles,
      readFileChecksum(relativePath) {
        try {
          return `sha256:${createHash("sha256").update(readFileSync(join(publisherRootPath, relativePath))).digest("hex")}`;
        } catch {
          return "";
        }
      },
    });
    errors.push(...teacherAnswerErrors);
  }
}

const report = {
  status: errors.length === 0 ? "passed" : "blocked",
  evidenceRoot: evidenceRealPath,
  checks: {
    deliveryPolicy: policyValid ? "proved" : "blocked",
    releaseAuthorization: releaseValid ? "proved" : "blocked",
    packageReviewEvidence: packageReviewValid ? "proved" : "blocked",
    identityBinding: errors.some((error) => error.includes("must match")) ? "blocked" : "proved",
  },
  errors,
  sideEffect: "none",
  writesEnabled: false,
  studentActivationAllowed: false,
};

if (options.json) console.log(JSON.stringify(report, null, 2));
else {
  console.log(`Pilot human evidence: ${report.status}`);
  for (const [id, status] of Object.entries(report.checks)) console.log(`${status === "proved" ? "PASS" : "BLOCK"} ${id}`);
  for (const error of errors) console.log(`- ${error}`);
}
if (errors.length > 0) process.exit(1);

function validatePolicy(value) {
  if (!value) return;
  if (value.recordVersion !== 1) errors.push("Delivery policy recordVersion must be 1.");
  if (value.status !== "accepted") errors.push("Delivery policy status must be accepted.");
  requireSafeIdentity(value.tenantId, "Delivery policy tenantId");
  requireSafeIdentity(value.packageId, "Delivery policy packageId");
  requireSafeIdentity(value.unitKey, "Delivery policy unitKey");
  requireOneOf(value.mode, ["hosted", "closed-local", "hybrid"], "Delivery policy mode");
  requireBoolean(value.hostedPersistenceOptIn, "Delivery policy hostedPersistenceOptIn");
  if (value.mode === "closed-local" && value.hostedPersistenceOptIn === true) errors.push("Delivery policy closed-local delivery cannot opt in to hosted persistence.");
  requireText(value.policyVersion, "Delivery policy policyVersion");
  requireSafeIdentity(value.reviewerId, "Delivery policy reviewerId");
  requireTimestamp(value.approvedAt, "Delivery policy approvedAt");
  for (const key of ["retentionPolicyRef", "backupPolicyRef", "costPolicyRef", "rollbackPolicyRef", "studentIdentityPolicyRef"]) {
    requireText(value[key], `Delivery policy ${key}`);
  }
}

function validateRelease(value) {
  if (!value) return;
  if (value.recordVersion !== 1) errors.push("Release authorization recordVersion must be 1.");
  if (value.status !== "approved") errors.push("Release authorization status must be approved.");
  requireSafeIdentity(value.tenantId, "Release authorization tenantId");
  requireSafeIdentity(value.packageId, "Release authorization packageId");
  requireSafeIdentity(value.unitKey, "Release authorization unitKey");
  requireOneOf(value.mode, ["hosted", "closed-local", "hybrid"], "Release authorization mode");
  requireBoolean(value.hostedPersistenceOptIn, "Release authorization hostedPersistenceOptIn");
  if (value.mode === "closed-local" && value.hostedPersistenceOptIn === true) errors.push("Release authorization closed-local delivery cannot opt in to hosted persistence.");
  requireSafeIdentity(value.reviewerId, "Release authorization reviewerId");
  requireTimestamp(value.approvedAt, "Release authorization approvedAt");
  requireOneOf(value.qrPrintAuthorization, ["approved"], "Release authorization qrPrintAuthorization");
  requireOneOf(value.studentUseAuthorization, ["approved"], "Release authorization studentUseAuthorization");
  requireText(value.browserRehearsalEvidenceRef, "Release authorization browserRehearsalEvidenceRef");
  requireText(value.rollbackEvidenceRef, "Release authorization rollbackEvidenceRef");
  if (!Array.isArray(value.finalChecksums) || value.finalChecksums.length < 3) {
    errors.push("Release authorization finalChecksums must contain source, package, and QR print artifact checksums.");
  } else {
    const kinds = new Set();
    for (const checksum of value.finalChecksums) {
      if (!checksum || typeof checksum !== "object") errors.push("Release authorization checksums must be objects.");
      else {
        requireText(checksum.kind, "Release authorization checksum kind");
        if (kinds.has(checksum.kind)) errors.push(`Release authorization checksum kind is repeated: ${checksum.kind}.`);
        kinds.add(checksum.kind);
        if (!/^[a-f0-9]{64}$/i.test(checksum.sha256 ?? "")) errors.push(`Release authorization checksum ${checksum.kind ?? "(unnamed)"} must be SHA-256.`);
      }
    }
    for (const requiredKind of ["source", "package", "qr-print-artifact"]) {
      if (!kinds.has(requiredKind)) errors.push(`Release authorization checksum kind is missing: ${requiredKind}.`);
    }
  }
}

function readJson(path, label) {
  if (!existsFile(path)) {
    errors.push(`${label} is required.`);
    return undefined;
  }
  try { return JSON.parse(readFileSync(path, "utf8")); }
  catch (error) { errors.push(`${label} must be valid JSON: ${error.message}`); return undefined; }
}

function requireSafeIdentity(value, label) {
  if (typeof value !== "string" || !/^[A-Za-z0-9][A-Za-z0-9._:/-]{0,239}$/.test(value) || value.includes("REPLACE_WITH_")) errors.push(`${label} must be a bounded safe identity.`);
}
function requireText(value, label) {
  if (typeof value !== "string" || !value.trim() || value.includes("REPLACE_WITH_")) errors.push(`${label} is required.`);
}
function requireBoolean(value, label) { if (typeof value !== "boolean") errors.push(`${label} must be boolean.`); }
function requireOneOf(value, allowed, label) { if (!allowed.includes(value)) errors.push(`${label} must be one of: ${allowed.join(", ")}.`); }
function requireTimestamp(value, label) { if (typeof value !== "string" || !Number.isFinite(Date.parse(value))) errors.push(`${label} must be an ISO timestamp.`); }
function existsFile(path) { try { return statSync(path).isFile(); } catch { return false; } }
function existsDirectory(path) { try { return statSync(path).isDirectory(); } catch { return false; } }
function isWithin(parent, child) {
  const parentPath = resolve(parent).toLowerCase();
  const childPath = resolve(child).toLowerCase();
  return childPath === parentPath || childPath.startsWith(`${parentPath}${sep}`);
}
function fail(message) { console.error(`ERROR ${message}`); process.exit(2); }

function parseArguments(args) {
  const result = { root: "", publisherRoot: "", json: false, help: false, selfTest: false };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--root") result.root = args[++index] ?? "";
    else if (arg === "--publisher-root") result.publisherRoot = args[++index] ?? "";
    else if (arg === "--json") result.json = true;
    else if (arg === "--self-test") result.selfTest = true;
    else if (arg === "--help" || arg === "-h") result.help = true;
    else fail(`Unknown argument: ${arg}`);
  }
  return result;
}

function runSelfTest() {
  const root = mkdtempSync(join(tmpdir(), "living-textbook-human-evidence-"));
  try {
    const policy = {
      recordVersion: 1, status: "accepted", tenantId: "self-test", packageId: "self-test-package", unitKey: "series:book:L1:U1", mode: "hybrid", hostedPersistenceOptIn: false, policyVersion: "policy-v1", reviewerId: "adult-reviewer", approvedAt: "2026-10-01T00:00:00.000Z", retentionPolicyRef: "retention-v1", backupPolicyRef: "backup-v1", costPolicyRef: "cost-v1", rollbackPolicyRef: "rollback-v1", studentIdentityPolicyRef: "identity-v1",
    };
    const release = {
      recordVersion: 1, status: "approved", tenantId: "self-test", packageId: "self-test-package", unitKey: "series:book:L1:U1", mode: "hybrid", hostedPersistenceOptIn: false, reviewerId: "adult-reviewer", approvedAt: "2026-10-01T00:00:00.000Z", qrPrintAuthorization: "approved", studentUseAuthorization: "approved", browserRehearsalEvidenceRef: "rehearsal-v1", rollbackEvidenceRef: "rollback-v1", finalChecksums: ["source", "package", "qr-print-artifact"].map((kind) => ({ kind, sha256: "a".repeat(64) })),
    };
    const packageReview = {
      recordVersion: 1, status: "reviewed", tenantId: "self-test", packageId: "self-test-package", unitKey: "series:book:L1:U1", reviewPacketId: "review-packet-1", reviewerId: "adult-reviewer", reviewedAt: "2026-10-01T00:00:00.000Z", sourceInventoryChecksumSha256: `sha256:${"a".repeat(64)}`, packageChecksumSha256: `sha256:${"a".repeat(64)}`, gamePathwayIds: ["flashcards", "memory-match"], audioCoverage: "reviewed", accessibilityCoverage: "reviewed", rightsCoverage: "reviewed", reviewedLanes: ["content", "game", "audio", "video", "image", "font", "accessibility", "rights"].map((lane) => ({ lane, status: lane === "video" ? "not-applicable" : "reviewed", evidenceRefs: [`${lane}-review`] })), promotionAllowed: false, studentFacingActivationAllowed: false,
    };
    writeFileSync(join(root, "delivery-policy.json"), `${JSON.stringify(policy)}\n`);
    writeFileSync(join(root, "release-authorization.json"), `${JSON.stringify(release)}\n`);
    writeFileSync(join(root, "package-review-evidence.json"), `${JSON.stringify(packageReview)}\n`);
    const result = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--root", root, "--json"], { encoding: "utf8" });
    if (result.status !== 0 || !result.stdout.includes('"status": "passed"')) fail(`self-test failed: ${result.stderr || result.stdout}`);
    const releasePath = join(root, "release-authorization.json");
    const mismatchedRelease = { ...release, packageId: "different-package" };
    writeFileSync(releasePath, `${JSON.stringify(mismatchedRelease)}\n`);
    const mismatch = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--root", root, "--json"], { encoding: "utf8" });
    if (mismatch.status === 0 || !mismatch.stdout.includes('"identityBinding": "blocked"')) fail("validator self-test allowed policy/release identity drift.");
    console.log("PASS pilot human evidence validator enforces policy, package review, release, identity, checksum, and no-side-effect boundaries.");
  } finally { rmSync(root, { recursive: true, force: true }); }
}
