import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { mkdtempSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const options = parseArguments(process.argv.slice(2));
if (options.help) {
  console.log("Usage: node scripts/create-pilot-human-evidence-packet.mjs --root <external-folder> --tenant-id <id> --package-id <id> --unit-key <key> [--delivery-mode hosted-pwa|closed-local|hybrid] [--hosted-persistence-opt-in]");
  process.exit(0);
}
if (options.selfTest) {
  await runSelfTest();
  process.exit(0);
}
for (const name of ["root", "tenantId", "packageId", "unitKey"]) {
  if (!options[name]) fail(`Missing --${name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}.`);
}

const root = resolve(options.root);
const repositoryRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
if (isWithin(repositoryRoot, root)) fail("Human evidence must be created outside the LivingTextbook repository.");

const policyPath = join(root, "delivery-policy.json");
const releasePath = join(root, "release-authorization.json");
const packageReviewPath = join(root, "package-review-evidence.json");
for (const path of [policyPath, releasePath, packageReviewPath]) {
  try {
    await access(path);
    fail(`Refusing to overwrite an existing evidence record: ${path}`);
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}

await mkdir(root, { recursive: true });
const identity = {
  tenantId: options.tenantId,
  packageId: options.packageId,
  unitKey: options.unitKey,
  mode: normalizeDeliveryMode(options.deliveryMode),
  hostedPersistenceOptIn: options.hostedPersistenceOptIn,
};
const policy = {
  recordVersion: 1,
  status: "draft",
  ...identity,
  policyVersion: "REPLACE_WITH_POLICY_VERSION",
  reviewerId: "REPLACE_WITH_NAMED_REVIEWER",
  approvedAt: "REPLACE_WITH_ISO_APPROVAL_TIMESTAMP",
  retentionPolicyRef: "REPLACE_WITH_RETENTION_POLICY_REF",
  backupPolicyRef: "REPLACE_WITH_BACKUP_POLICY_REF",
  costPolicyRef: "REPLACE_WITH_COST_POLICY_REF",
  rollbackPolicyRef: "REPLACE_WITH_ROLLBACK_POLICY_REF",
  studentIdentityPolicyRef: "REPLACE_WITH_STUDENT_IDENTITY_POLICY_REF",
};
const release = {
  recordVersion: 1,
  status: "draft",
  ...identity,
  reviewerId: "REPLACE_WITH_NAMED_REVIEWER",
  approvedAt: "REPLACE_WITH_ISO_APPROVAL_TIMESTAMP",
  qrPrintAuthorization: "pending",
  studentUseAuthorization: "pending",
  browserRehearsalEvidenceRef: "REPLACE_WITH_BROWSER_REHEARSAL_EVIDENCE_REF",
  rollbackEvidenceRef: "REPLACE_WITH_ROLLBACK_EVIDENCE_REF",
  finalChecksums: [
    { kind: "source", sha256: "REPLACE_WITH_SHA256" },
    { kind: "package", sha256: "REPLACE_WITH_SHA256" },
    { kind: "qr-print-artifact", sha256: "REPLACE_WITH_SHA256" },
  ],
};
const packageReview = {
  recordVersion: 1,
  status: "draft",
  ...identity,
  reviewPacketId: "REPLACE_WITH_REVIEW_PACKET_ID",
  reviewerId: "REPLACE_WITH_NAMED_REVIEWER",
  reviewedAt: "REPLACE_WITH_ISO_REVIEW_TIMESTAMP",
  sourceInventoryChecksumSha256: "REPLACE_WITH_SHA256_PREFIXED_SOURCE_INVENTORY_CHECKSUM",
  packageChecksumSha256: "REPLACE_WITH_SHA256_PREFIXED_PACKAGE_CHECKSUM",
  gamePathwayIds: ["REPLACE_WITH_CURATED_GAME_ID"],
  audioCoverage: "REPLACE_WITH_REVIEW_STATUS",
  accessibilityCoverage: "REPLACE_WITH_REVIEW_STATUS",
  rightsCoverage: "REPLACE_WITH_REVIEW_STATUS",
  reviewedLanes: ["content", "game", "audio", "video", "image", "font", "accessibility", "rights"].map((lane) => ({ lane, status: "REPLACE_WITH_REVIEW_STATUS", evidenceRefs: [`REPLACE_WITH_${lane.toUpperCase()}_EVIDENCE_REF`] })),
  promotionAllowed: false,
  studentFacingActivationAllowed: false,
};
await writeFile(policyPath, `${JSON.stringify(policy, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
await writeFile(releasePath, `${JSON.stringify(release, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
await writeFile(packageReviewPath, `${JSON.stringify(packageReview, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
await writeFile(join(root, "README.md"), createReadme(identity), { encoding: "utf8", flag: "wx" });
console.log(JSON.stringify({ root, policyPath, releasePath, packageReviewPath, reviewOnly: true, writesEnabled: false, studentActivationAllowed: false }, null, 2));

function createReadme(identity) {
  return `# Pilot Human Evidence Packet\n\nThis create-once packet is for ${identity.tenantId} / ${identity.packageId} / ${identity.unitKey}.\n\nDeclared delivery mode: **${identity.mode}**. Hosted persistence opt-in: **${identity.hostedPersistenceOptIn ? "requested for review" : "not requested"}**.\n\nReplace every REPLACE_WITH_* value and obtain the required named human decisions. Keep the folder outside LivingTextbook. The package-review-evidence.json record must list the reviewed content, game, audio, video, image, font, accessibility, and rights lanes; use not-applicable only with explicit evidence.\n\nRun:\n\n    npm run verify:pilot-human-evidence -- --root "${identity.tenantId}-human-evidence"\n\nThe validator must pass before the packet can advance the saleability audit. This packet never uploads, assembles, prints, activates persistence, or enables students.\n`;
}

function parseArguments(args) {
  const result = { root: "", tenantId: "", packageId: "", unitKey: "", deliveryMode: "hybrid", hostedPersistenceOptIn: false, help: false, selfTest: false };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--root") result.root = args[++index] ?? "";
    else if (arg === "--tenant-id") result.tenantId = args[++index] ?? "";
    else if (arg === "--package-id") result.packageId = args[++index] ?? "";
    else if (arg === "--unit-key") result.unitKey = args[++index] ?? "";
    else if (arg === "--delivery-mode") result.deliveryMode = args[++index] ?? "";
    else if (arg === "--hosted-persistence-opt-in") result.hostedPersistenceOptIn = true;
    else if (arg === "--self-test") result.selfTest = true;
    else if (arg === "--help" || arg === "-h") result.help = true;
    else fail(`Unknown argument: ${arg}`);
  }
  return result;
}

function normalizeDeliveryMode(value) {
  const normalized = String(value || "hybrid").trim().toLowerCase();
  if (!["hosted-pwa", "hosted", "closed-local", "hybrid"].includes(normalized)) fail(`Unsupported delivery-mode: ${value}`);
  if (normalized === "hosted-pwa") return "hosted";
  if (normalized === "closed-local" && options.hostedPersistenceOptIn) fail("closed-local delivery cannot opt in to hosted persistence.");
  return normalized;
}

function isWithin(parent, child) {
  const parentPath = resolve(parent).toLowerCase();
  const childPath = resolve(child).toLowerCase();
  return childPath === parentPath || childPath.startsWith(`${parentPath}\\`);
}

function fail(message) { console.error(`ERROR ${message}`); process.exit(2); }

async function runSelfTest() {
  const root = mkdtempSync(join(tmpdir(), "living-textbook-human-evidence-generator-"));
  try {
    const args = [fileURLToPath(import.meta.url), "--root", root, "--tenant-id", "self-test", "--package-id", "self-test-package", "--unit-key", "series:book:L1:U1", "--delivery-mode", "hosted-pwa", "--hosted-persistence-opt-in"];
    const generated = spawnSync(process.execPath, args, { encoding: "utf8" });
    if (generated.status !== 0) fail(`generator self-test failed: ${generated.stderr || generated.stdout}`);
    const policy = JSON.parse(await readFile(join(root, "delivery-policy.json"), "utf8"));
    const release = JSON.parse(await readFile(join(root, "release-authorization.json"), "utf8"));
    const packageReview = JSON.parse(await readFile(join(root, "package-review-evidence.json"), "utf8"));
    if (policy.status !== "draft" || release.status !== "draft" || packageReview.status !== "draft" || policy.tenantId !== "self-test" || release.packageId !== "self-test-package" || packageReview.unitKey !== "series:book:L1:U1" || policy.mode !== "hosted" || policy.hostedPersistenceOptIn !== true) fail("generator self-test did not preserve draft identity-bound delivery choices.");
    const overwrite = spawnSync(process.execPath, args, { encoding: "utf8" });
    if (overwrite.status === 0 || !overwrite.stderr.includes("Refusing to overwrite")) fail("generator self-test allowed an overwrite.");
    const invalid = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--root", join(root, "invalid"), "--tenant-id", "self-test", "--package-id", "self-test-package", "--unit-key", "series:book:L1:U1", "--delivery-mode", "closed-local", "--hosted-persistence-opt-in"], { encoding: "utf8" });
    if (invalid.status === 0 || !invalid.stderr.includes("closed-local delivery cannot opt in")) fail("generator self-test allowed a closed-local hosted opt-in.");
    console.log("PASS pilot human evidence generator creates external draft templates, preserves identity, and refuses overwrite.");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}
