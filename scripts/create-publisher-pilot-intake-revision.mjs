import { access, copyFile, lstat, mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const options = parseArguments(process.argv.slice(2));
if (options.help) {
  printUsage();
  process.exit(0);
}
if (options.selfTest) {
  await runSelfTest();
  process.exit(0);
}
if (!options.sourceRoot) fail("Missing --source-root.");
if (!options.outputRoot) fail("Missing --output-root.");

const repositoryRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const sourceRoot = resolve(options.sourceRoot);
const outputRoot = resolve(options.outputRoot);
assertExternalPath(sourceRoot, repositoryRoot, "source root");
assertExternalPath(outputRoot, repositoryRoot, "output root");
if (sourceRoot === outputRoot) fail("Source and output roots must be different.");
await requireDirectory(sourceRoot, "source root");
await requireAbsentOrEmptyDirectory(outputRoot);

const briefPath = join(sourceRoot, "publisher-pilot-intake.json");
const brief = await readJsonFile(briefPath, "publisher-pilot-intake.json");
validateReviewOnlyBrief(brief);
await mkdir(outputRoot, { recursive: true });

const declared = uniquePaths([
  "publisher-pilot-intake.json",
  "README.md",
  ...(brief.sourceFiles ?? []),
  ...(brief.mediaRequests ?? []).map((request) => request.relativePath),
  ...(brief.evidenceRequests ?? []).map((request) => request.relativePath),
]);
const required = new Set([
  "publisher-pilot-intake.json",
  ...(brief.sourceFiles ?? []),
  ...(brief.mediaRequests ?? []).filter((request) => request.required).map((request) => request.relativePath),
  ...(brief.evidenceRequests ?? []).filter((request) => request.required).map((request) => request.relativePath),
]);
const copiedFiles = [];
const missingRequiredFiles = [];
const omittedOptionalFiles = [];

for (const relativePath of declared) {
  validateRelativePath(relativePath);
  await assertNoLinkSegments(sourceRoot, relativePath);
  const sourcePath = join(sourceRoot, relativePath);
  const targetPath = join(outputRoot, relativePath);
  const sourceStat = await optionalRegularFile(sourcePath);
  if (sourceStat === "missing") {
    if (required.has(relativePath)) missingRequiredFiles.push(relativePath);
    else omittedOptionalFiles.push(relativePath);
    continue;
  }
  if (sourceStat === "symlink") fail(`Refusing symlinked publisher input: ${relativePath}`);
  await mkdir(resolve(targetPath, ".."), { recursive: true });
  await copyFile(sourcePath, targetPath);
  copiedFiles.push(relativePath);
}

const excludedFiles = [
  "publisher-source-manifest.json",
  "evidence/publisher-intake-preflight.json",
  "evidence/publisher-source-preflight.json",
];
const result = {
  recordVersion: 1,
  sourceRoot,
  outputRoot,
  copiedFiles,
  missingRequiredFiles,
  omittedOptionalFiles,
  excludedFiles,
  reviewOnly: true,
  packageAssemblyAllowed: false,
  studentFacingUseAllowed: false,
  nextSteps: [
    "Add or replace publisher files only at the declared relative paths.",
    "Run publisher-pilot-intake-preflight.mjs with a new evidence output path.",
    "Regenerate publisher-source-manifest.json only after the intake brief is complete.",
  ],
};
// Custody markers: reviewOnly: true; missingRequiredFiles; omittedOptionalFiles;
// exclude stale reports/manifests; outside the LivingTextbook repository.
console.log(JSON.stringify(result, null, 2));

function validateReviewOnlyBrief(brief) {
  if (!brief || typeof brief !== "object" || Array.isArray(brief)) fail("Publisher intake brief must be an object.");
  if (brief.reviewOnly !== true || brief.packageAssemblyAllowed !== false || brief.studentFacingUseAllowed !== false) fail("Source brief must remain review-only and protected-action blocked.");
  if (!Array.isArray(brief.sourceFiles) || brief.sourceFiles.length === 0) fail("Source brief must declare at least one source file.");
  if (!Array.isArray(brief.mediaRequests) || !Array.isArray(brief.evidenceRequests)) fail("Source brief must declare media and evidence requests.");
  for (const path of brief.sourceFiles) validateRelativePath(path);
  for (const request of [...brief.mediaRequests, ...brief.evidenceRequests]) {
    if (!request || typeof request.relativePath !== "string") fail("Every declared request must contain a relativePath.");
    validateRelativePath(request.relativePath);
  }
}

async function optionalRegularFile(path) {
  try {
    const stat = await lstat(path);
    if (stat.isSymbolicLink()) return "symlink";
    if (!stat.isFile()) fail(`Publisher input is not a regular file: ${path}`);
    return "file";
  } catch (error) {
    if (error?.code === "ENOENT") return "missing";
    throw error;
  }
}

async function assertNoLinkSegments(root, relativePath) {
  let current = root;
  for (const segment of relativePath.split("/")) {
    current = join(current, segment);
    try {
      const stat = await lstat(current);
      if (stat.isSymbolicLink()) fail(`Refusing linked publisher path: ${relativePath}`);
    } catch (error) {
      if (error?.code === "ENOENT") return;
      throw error;
    }
  }
}

async function requireDirectory(path, label) {
  try {
    const stat = await lstat(path);
    if (!stat.isDirectory() || stat.isSymbolicLink()) fail(`${label} must be a real directory: ${path}`);
  } catch (error) {
    if (error?.code === "ENOENT") fail(`${label} does not exist: ${path}`);
    throw error;
  }
}

async function requireAbsentOrEmptyDirectory(path) {
  try {
    const stat = await lstat(path);
    if (stat.isSymbolicLink() || !stat.isDirectory()) fail(`Output root must be a new empty directory: ${path}`);
    const entries = await readdir(path);
    if (entries.length > 0) fail(`Refusing to overwrite a non-empty output root: ${path}`);
  } catch (error) {
    if (error?.code === "ENOENT") return;
    throw error;
  }
}

function assertExternalPath(candidate, repositoryRoot, label) {
  const pathRelation = relative(repositoryRoot, candidate);
  if (pathRelation === "" || (pathRelation && !pathRelation.startsWith("..") && !pathRelation.includes(":") && !pathRelation.startsWith("/"))) {
    fail(`${label} must be outside the LivingTextbook repository: ${candidate}`);
  }
}

function validateRelativePath(value) {
  const normalized = String(value).replaceAll("\\", "/");
  if (!normalized || normalized.startsWith("/") || normalized.includes("//") || normalized.split("/").includes("..") || normalized.includes(":") || /[<>|?*]/.test(normalized)) {
    fail(`Unsafe declared publisher path: ${value}`);
  }
  return normalized;
}

function uniquePaths(paths) { return [...new Set(paths.map((path) => validateRelativePath(path)))]; }

async function readJsonFile(path, label) {
  try { return JSON.parse(await readFile(path, "utf8")); }
  catch (error) { fail(`Cannot read ${label}: ${error.message}`); }
}

function parseArguments(args) {
  const result = { sourceRoot: "", outputRoot: "", help: false, selfTest: false };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--help" || arg === "-h") result.help = true;
    else if (arg === "--self-test") result.selfTest = true;
    else if (arg === "--source-root") result.sourceRoot = args[++index] ?? "";
    else if (arg === "--output-root") result.outputRoot = args[++index] ?? "";
    else fail(`Unknown argument: ${arg}`);
  }
  return result;
}

async function runSelfTest() {
  const root = await mkdtemp(join(tmpdir(), "living-textbook-pilot-revision-"));
  const sourceRoot = join(root, "source");
  const outputRoot = join(root, "revision");
  try {
    const kitGenerator = fileURLToPath(new URL("./create-publisher-pilot-intake-kit.mjs", import.meta.url));
    const generated = spawnSync(process.execPath, [kitGenerator, "--root", sourceRoot, "--tenant-id", "self-test", "--publisher-name", "Example Publisher", "--book-title", "Example Book", "--unit-key", "example:book:L1:U1", "--source-file", "source/unit-1.docx"], { encoding: "utf8" });
    if (generated.status !== 0) fail(`revision self-test kit generation failed: ${generated.stderr}`);
    const briefPath = join(sourceRoot, "publisher-pilot-intake.json");
    const brief = JSON.parse(await readFile(briefPath, "utf8"));
    Object.assign(brief, { seriesName: "Example Series", edition: "2026", version: "1.0.0", sourceOwner: "Example Publisher", retentionPolicy: "School policy", reportingPolicy: "Teacher reports", qrPageReferences: ["page-1"], qrReferences: [{ ...brief.qrReferences[0], pageReference: "page-1" }] });
    await writeFile(briefPath, `${JSON.stringify(brief, null, 2)}\n`, "utf8");
    for (const path of [...brief.sourceFiles, ...brief.mediaRequests.map((request) => request.relativePath), ...brief.evidenceRequests.map((request) => request.relativePath)]) {
      const absolute = join(sourceRoot, path);
      await mkdir(resolve(absolute, ".."), { recursive: true });
      await writeFile(absolute, `fixture:${path}`, "utf8");
    }
    await writeFile(join(sourceRoot, "publisher-source-manifest.json"), "stale manifest", "utf8");
    await writeFile(join(sourceRoot, "evidence", "publisher-intake-preflight.json"), "stale report", "utf8");
    const copied = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--source-root", sourceRoot, "--output-root", outputRoot], { encoding: "utf8" });
    if (copied.status !== 0) fail(`revision creation failed: ${copied.stderr}`);
    if ((await optionalRegularFile(join(outputRoot, "publisher-pilot-intake.json"))) !== "file") fail("revision omitted publisher brief");
    if ((await optionalRegularFile(join(outputRoot, "publisher-source-manifest.json"))) !== "missing") fail("revision copied stale source manifest");
    if ((await optionalRegularFile(join(outputRoot, "evidence", "publisher-intake-preflight.json"))) !== "missing") fail("revision copied stale intake report");
    const second = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--source-root", sourceRoot, "--output-root", outputRoot], { encoding: "utf8" });
    if (second.status === 0 || !second.stderr.includes("non-empty output root")) fail("revision must refuse overwrite");
    const linkedParent = join(sourceRoot, "media", "linked-parent");
    const linkedOutput = join(root, "linked-revision");
    try {
      await mkdir(join(root, "outside"), { recursive: true });
      await symlink(join(root, "outside"), linkedParent, "junction");
      const linkedBrief = { ...brief, mediaRequests: [...brief.mediaRequests, { kind: "audio", relativePath: "media/linked-parent/escape.mp3", unitKey: brief.unitKey, required: false }] };
      await writeFile(briefPath, `${JSON.stringify(linkedBrief, null, 2)}\n`, "utf8");
      const linked = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--source-root", sourceRoot, "--output-root", linkedOutput], { encoding: "utf8" });
      if (linked.status === 0 || !linked.stderr.includes("Refusing linked publisher path")) fail("revision allowed a linked parent directory to escape custody");
    } catch (error) {
      if (!(["EACCES", "EPERM", "ENOSYS"].includes(error?.code))) throw error;
      console.log("SKIP linked-parent escape test: filesystem does not permit junction creation in this environment.");
    }
    const insideRepo = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--source-root", sourceRoot, "--output-root", fileURLToPath(new URL("../revision-self-test", import.meta.url))], { encoding: "utf8" });
    if (insideRepo.status === 0 || !insideRepo.stderr.includes("outside the LivingTextbook repository")) fail("revision allowed repository-local output");
    console.log("PASS publisher pilot revisions copy declared review inputs, exclude stale reports/manifests, and refuse overwrite or repository-local output.");
  } finally {
    await rm(root, { recursive: true, force: true });
    await rm(fileURLToPath(new URL("../revision-self-test", import.meta.url)), { recursive: true, force: true });
  }
}

function fail(message) { console.error(`ERROR ${message}`); process.exit(2); }
function printUsage() { console.log("Usage: node scripts/create-publisher-pilot-intake-revision.mjs --source-root <existing-external-handoff> --output-root <new-external-handoff>\n\nCopies only the declared review inputs, preserves missing-file status, excludes old reports/manifests, refuses overwrite, and never uploads, assembles, prints QR codes, enables persistence, or activates students."); }
