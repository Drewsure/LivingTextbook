import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { mkdtempSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const options = parseArguments(process.argv.slice(2));
if (options.help) {
  console.log("Usage: node scripts/create-pilot-human-evidence-packet.mjs --root <external-folder> --tenant-id <id> --package-id <id> --unit-key <key>");
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
for (const path of [policyPath, releasePath]) {
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
  mode: "REPLACE_WITH_MODE",
  hostedPersistenceOptIn: false,
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
await writeFile(policyPath, `${JSON.stringify(policy, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
await writeFile(releasePath, `${JSON.stringify(release, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
await writeFile(join(root, "README.md"), createReadme(identity), { encoding: "utf8", flag: "wx" });
console.log(JSON.stringify({ root, policyPath, releasePath, reviewOnly: true, writesEnabled: false, studentActivationAllowed: false }, null, 2));

function createReadme(identity) {
  return `# Pilot Human Evidence Packet\n\nThis create-once packet is for ${identity.tenantId} / ${identity.packageId} / ${identity.unitKey}.\n\nReplace every REPLACE_WITH_* value, choose the delivery mode, and obtain the required named human decisions. Keep the folder outside LivingTextbook.\n\nRun:\n\n    npm run verify:pilot-human-evidence -- --root "${identity.tenantId}-human-evidence"\n\nThe validator must pass before the packet can advance the saleability audit. This packet never uploads, assembles, prints, activates persistence, or enables students.\n`;
}

function parseArguments(args) {
  const result = { root: "", tenantId: "", packageId: "", unitKey: "", help: false, selfTest: false };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--root") result.root = args[++index] ?? "";
    else if (arg === "--tenant-id") result.tenantId = args[++index] ?? "";
    else if (arg === "--package-id") result.packageId = args[++index] ?? "";
    else if (arg === "--unit-key") result.unitKey = args[++index] ?? "";
    else if (arg === "--self-test") result.selfTest = true;
    else if (arg === "--help" || arg === "-h") result.help = true;
    else fail(`Unknown argument: ${arg}`);
  }
  return result;
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
    const args = [fileURLToPath(import.meta.url), "--root", root, "--tenant-id", "self-test", "--package-id", "self-test-package", "--unit-key", "series:book:L1:U1"];
    const generated = spawnSync(process.execPath, args, { encoding: "utf8" });
    if (generated.status !== 0) fail(`generator self-test failed: ${generated.stderr || generated.stdout}`);
    const policy = JSON.parse(await readFile(join(root, "delivery-policy.json"), "utf8"));
    const release = JSON.parse(await readFile(join(root, "release-authorization.json"), "utf8"));
    if (policy.status !== "draft" || release.status !== "draft" || policy.tenantId !== "self-test" || release.packageId !== "self-test-package") fail("generator self-test did not preserve draft identity-bound records.");
    const overwrite = spawnSync(process.execPath, args, { encoding: "utf8" });
    if (overwrite.status === 0 || !overwrite.stderr.includes("Refusing to overwrite")) fail("generator self-test allowed an overwrite.");
    console.log("PASS pilot human evidence generator creates external draft templates, preserves identity, and refuses overwrite.");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}
