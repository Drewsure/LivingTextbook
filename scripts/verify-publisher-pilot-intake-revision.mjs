import { access, lstat, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join, relative, resolve } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const options = parseArguments(process.argv.slice(2));
if (options.help) {
  console.log("Usage: node scripts/verify-publisher-pilot-intake-revision.mjs --root <external-revision-folder>");
  process.exit(0);
}
if (options.selfTest) {
  await runSelfTest();
  process.exit(0);
}
if (!options.root) fail("Missing --root.");

const repositoryRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const root = resolve(options.root);
assertExternalRoot(root, repositoryRoot);
const briefPath = join(root, "publisher-pilot-intake.json");
const recordPath = join(root, "evidence", "publisher-handoff-revision.json");
const briefSource = await readText(briefPath, "publisher-pilot-intake.json");
const brief = parseJson(briefSource, "publisher-pilot-intake.json");
const record = parseJson(await readText(recordPath, "evidence/publisher-handoff-revision.json"), "evidence/publisher-handoff-revision.json");
const errors = await validateRevision(root, brief, briefSource, record);
if (errors.length > 0) fail(errors.join(" "));

console.log(JSON.stringify({
  root,
  revisionId: record.revisionId,
  sourceBriefChecksumSha256: record.sourceBriefChecksumSha256,
  revisionBriefChecksumSha256: record.revisionBriefChecksumSha256,
  copiedFileCount: record.copiedFiles.length,
  missingRequiredFileCount: record.missingRequiredFiles.length,
  omittedOptionalFileCount: record.omittedOptionalFiles.length,
  reviewOnly: true,
  packageAssemblyAllowed: false,
  studentFacingUseAllowed: false,
}, null, 2));

async function validateRevision(root, brief, briefSource, record) {
  const errors = [];
  if (record.recordVersion !== 1) errors.push("Revision evidence recordVersion must be 1.");
  for (const field of ["revisionId", "sourceRootName", "sourceBriefChecksumSha256", "revisionBriefChecksumSha256", "generatedAt"]) {
    if (typeof record[field] !== "string" || !record[field].trim()) errors.push(`Revision evidence ${field} is required.`);
  }
  for (const field of ["copiedFiles", "missingRequiredFiles", "omittedOptionalFiles", "excludedFiles"]) {
    if (!Array.isArray(record[field])) errors.push(`Revision evidence ${field} must be an array.`);
  }
  if (record.reviewOnly !== true || record.packageAssemblyAllowed !== false || record.studentFacingUseAllowed !== false) errors.push("Revision evidence safety flags are invalid.");
  const checksum = sha256(briefSource);
  if (record.revisionBriefChecksumSha256 !== checksum) errors.push("Revision brief checksum does not match the current brief.");
  if (record.sourceBriefChecksumSha256 !== record.revisionBriefChecksumSha256) errors.push("Source and revision brief checksums drifted.");
  if (Number.isNaN(Date.parse(record.generatedAt))) errors.push("Revision evidence generatedAt is invalid.");

  const declaredPaths = new Set([
    "publisher-pilot-intake.json",
    "README.md",
    ...(brief.sourceFiles ?? []),
    ...(brief.mediaRequests ?? []).map((request) => request.relativePath),
    ...(brief.evidenceRequests ?? []).map((request) => request.relativePath),
  ]);
  for (const path of [...record.copiedFiles, ...record.missingRequiredFiles, ...record.omittedOptionalFiles, ...record.excludedFiles]) {
    if (!isSafeRelativePath(path)) errors.push(`Revision evidence contains unsafe path: ${path}`);
  }
  for (const path of record.copiedFiles) {
    if (!declaredPaths.has(path)) errors.push(`Revision evidence copied an undeclared path: ${path}`);
    if (!(await existsAsRegularFile(join(root, path)))) errors.push(`Revision evidence copied file is missing: ${path}`);
  }
  for (const path of [...record.missingRequiredFiles, ...record.omittedOptionalFiles]) {
    if (await existsAsAnyPath(join(root, path))) errors.push(`Revision evidence marks an existing path absent: ${path}`);
  }
  for (const path of ["publisher-source-manifest.json", "evidence/publisher-intake-preflight.json", "evidence/publisher-source-preflight.json"]) {
    if (await existsAsAnyPath(join(root, path))) errors.push(`Revision contains excluded stale artifact: ${path}`);
  }
  if (!record.excludedFiles.includes("publisher-source-manifest.json") || !record.excludedFiles.includes("evidence/publisher-source-preflight.json")) errors.push("Revision evidence must name excluded stale artifacts.");
  return errors;
}

async function existsAsRegularFile(path) {
  try { const stat = await lstat(path); return stat.isFile() && !stat.isSymbolicLink(); }
  catch (error) { if (error?.code === "ENOENT") return false; throw error; }
}

async function existsAsAnyPath(path) {
  try { await lstat(path); return true; }
  catch (error) { if (error?.code === "ENOENT") return false; throw error; }
}

function isSafeRelativePath(value) {
  const normalized = String(value).replaceAll("\\", "/");
  return Boolean(normalized) && !normalized.startsWith("/") && !normalized.includes("//") && !normalized.split("/").includes("..") && !normalized.includes(":") && !/[<>|?*]/.test(normalized);
}

function assertExternalRoot(candidate, repositoryRoot) {
  const relation = relative(repositoryRoot, candidate);
  if (relation === "" || (relation && !relation.startsWith("..") && !relation.includes(":") && !relation.startsWith("/"))) fail(`Revision root must be outside the LivingTextbook repository: ${candidate}`);
}

async function readText(path, label) {
  try { return await readFile(path, "utf8"); }
  catch (error) { fail(`Cannot read ${label}: ${error.message}`); }
}

function parseJson(source, label) {
  try { return JSON.parse(source); }
  catch (error) { fail(`Cannot parse ${label}: ${error.message}`); }
}

function sha256(value) { return createHash("sha256").update(value).digest("hex"); }

function parseArguments(args) {
  const result = { root: "", help: false, selfTest: false };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--help" || arg === "-h") result.help = true;
    else if (arg === "--self-test") result.selfTest = true;
    else if (arg === "--root") result.root = args[++index] ?? "";
    else fail(`Unknown argument: ${arg}`);
  }
  return result;
}

async function runSelfTest() {
  const root = await mkdtemp(join(tmpdir(), "living-textbook-revision-verifier-"));
  const sourceRoot = join(root, "source");
  const revisionRoot = join(root, "revision");
  try {
    const generator = fileURLToPath(new URL("./create-publisher-pilot-intake-revision.mjs", import.meta.url));
    const generated = spawnSync(process.execPath, [fileURLToPath(new URL("./create-publisher-pilot-intake-kit.mjs", import.meta.url)), "--root", sourceRoot, "--tenant-id", "self-test", "--publisher-name", "Example Publisher", "--book-title", "Example Book", "--unit-key", "example:book:L1:U1", "--source-file", "source/unit-1.docx"], { encoding: "utf8" });
    if (generated.status !== 0) fail(`revision verifier kit setup failed: ${generated.stderr}`);
    const briefPath = join(sourceRoot, "publisher-pilot-intake.json");
    const brief = JSON.parse(await readFile(briefPath, "utf8"));
    Object.assign(brief, { seriesName: "Example Series", edition: "2026", version: "1.0.0", sourceOwner: "Example Publisher", retentionPolicy: "School policy", reportingPolicy: "Teacher reports", qrPageReferences: ["page-1"], qrReferences: [{ ...brief.qrReferences[0], pageReference: "page-1" }] });
    await writeFile(briefPath, `${JSON.stringify(brief, null, 2)}\n`, "utf8");
    for (const path of [...brief.sourceFiles, ...brief.mediaRequests.map((request) => request.relativePath), ...brief.evidenceRequests.map((request) => request.relativePath)]) await writeFile(join(sourceRoot, path), `fixture:${path}`, "utf8");
    const copied = spawnSync(process.execPath, [generator, "--source-root", sourceRoot, "--output-root", revisionRoot], { encoding: "utf8" });
    if (copied.status !== 0) fail(`revision verifier revision setup failed: ${copied.stderr}`);
    const verified = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--root", revisionRoot], { encoding: "utf8" });
    if (verified.status !== 0 || !verified.stdout.includes('"reviewOnly": true')) fail(`revision evidence verifier rejected a valid revision: ${verified.stderr || verified.stdout}`);
    const recordPath = join(revisionRoot, "evidence", "publisher-handoff-revision.json");
    const record = JSON.parse(await readFile(recordPath, "utf8"));
    record.revisionBriefChecksumSha256 = "tampered";
    await writeFile(recordPath, `${JSON.stringify(record, null, 2)}\n`, "utf8");
    const tampered = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--root", revisionRoot], { encoding: "utf8" });
    if (tampered.status === 0 || !tampered.stderr.includes("checksum")) fail("revision evidence verifier accepted checksum drift");
    console.log("PASS publisher revision evidence verifier reopens valid custody records and rejects checksum drift.");
  } finally { await rm(root, { recursive: true, force: true }); }
}

function fail(message) { console.error(`ERROR ${message}`); process.exit(2); }
