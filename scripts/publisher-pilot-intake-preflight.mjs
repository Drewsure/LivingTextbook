import { access, mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { dirname, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const options = parseArguments(process.argv.slice(2));
if (options.help) {
  console.log("Usage: node scripts/publisher-pilot-intake-preflight.mjs --root <publisher-pilot-input-folder> [--output <evidence-report.json>]");
  process.exit(0);
}
if (options.selfTest) {
  await runSelfTest();
  process.exit(0);
}
if (!options.root) fail("Missing --root.");

const root = resolve(options.root);
const briefPath = join(root, "publisher-pilot-intake.json");
let brief;
let briefSource;
try {
  briefSource = await readFile(briefPath, "utf8");
  brief = JSON.parse(briefSource);
} catch (error) {
  fail(`Cannot read publisher-pilot-intake.json: ${error.message}`);
}

const missingFiles = [];
const omittedOptionalFiles = [];
const unsafePaths = [];
const declaredFiles = [
  ...(brief.sourceFiles ?? []),
  ...(brief.teacherAnswerFiles ?? []),
  ...(brief.mediaRequests ?? []).map((request) => request.relativePath),
  ...(brief.evidenceRequests ?? []).map((request) => request.relativePath),
];
const requiredFiles = [
  ...(brief.sourceFiles ?? []),
  ...(brief.teacherAnswerFiles ?? []),
  ...(brief.mediaRequests ?? []).filter((request) => request.required).map((request) => request.relativePath),
  ...(brief.evidenceRequests ?? []).filter((request) => request.required).map((request) => request.relativePath),
];
const optionalFiles = (brief.mediaRequests ?? [])
  .filter((request) => !request.required)
  .map((request) => request.relativePath);
for (const relativePath of requiredFiles) {
  if (!isSafeRelativePath(relativePath)) {
    unsafePaths.push(relativePath);
    continue;
  }
  try {
    await access(join(root, relativePath));
  } catch {
    missingFiles.push(relativePath);
  }
}
for (const relativePath of optionalFiles) {
  if (!isSafeRelativePath(relativePath)) {
    unsafePaths.push(relativePath);
    continue;
  }
  try {
    await access(join(root, relativePath));
  } catch {
    omittedOptionalFiles.push(relativePath);
  }
}

const placeholderFields = findPlaceholders(brief);
const structuralErrors = [];
for (const field of ["briefId", "tenantId", "publisherName", "seriesName", "bookTitle", "edition", "version", "targetLanguage", "unitKey", "sourceOwner", "retentionPolicy", "reportingPolicy"]) {
  if (typeof brief[field] !== "string" || !brief[field].trim()) structuralErrors.push(`${field} is required.`);
}
if (brief.reviewOnly !== true) structuralErrors.push("reviewOnly must remain true.");
if (brief.packageAssemblyAllowed !== false) structuralErrors.push("packageAssemblyAllowed must remain false.");
if (brief.studentFacingUseAllowed !== false) structuralErrors.push("studentFacingUseAllowed must remain false.");
if (!Array.isArray(brief.sourceFiles) || brief.sourceFiles.length === 0) structuralErrors.push("At least one source file is required.");
if (!Array.isArray(brief.mediaRequests) || brief.mediaRequests.length === 0) structuralErrors.push("At least one media request is required.");
if (!Array.isArray(brief.evidenceRequests) || brief.evidenceRequests.length === 0) structuralErrors.push("At least one structured evidence request is required.");
if (!Array.isArray(brief.qrReferences) || brief.qrReferences.length === 0) structuralErrors.push("At least one structured QR reference is required.");
if (typeof brief.targetLanguage !== "string" || !/^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/.test(brief.targetLanguage)) structuralErrors.push("targetLanguage must be a bounded language id.");
if (!Array.isArray(brief.supportLanguages) || brief.supportLanguages.some((language) => typeof language !== "string" || !/^[A-Za-z0-9][A-Za-z0-9-]{1,19}$/.test(language))) structuralErrors.push("supportLanguages must contain bounded language ids.");
if (Array.isArray(brief.supportLanguages) && new Set(brief.supportLanguages.map((language) => language.toLowerCase())).size !== brief.supportLanguages.length) structuralErrors.push("supportLanguages must not contain duplicate ids.");
if (!["hosted-pwa", "closed-local", "hybrid"].includes(brief.deliveryMode)) structuralErrors.push("deliveryMode is unsupported.");
if (typeof brief.hostedPersistenceOptIn !== "boolean") structuralErrors.push("hostedPersistenceOptIn must be boolean.");
if (brief.hostedPersistenceOptIn === true && brief.deliveryMode === "closed-local") structuralErrors.push("closed-local delivery cannot opt in to hosted persistence.");

const result = {
  reportVersion: 1,
  briefId: brief.briefId ?? "unknown",
  tenantId: brief.tenantId ?? "unknown",
  briefChecksumSha256: sha256(briefSource),
  deliveryMode: brief.deliveryMode ?? "unknown",
  inventoryStatus: missingFiles.length === 0 && unsafePaths.length === 0 && placeholderFields.length === 0 && structuralErrors.length === 0 ? "complete" : "incomplete",
  declaredFileCount: declaredFiles.length,
  missingFiles,
  omittedOptionalFiles,
  unsafePaths,
  placeholderFields,
  structuralErrors,
  reviewOnly: brief.reviewOnly === true,
  packageAssemblyAllowed: brief.packageAssemblyAllowed === true,
  studentFacingUseAllowed: brief.studentFacingUseAllowed === true,
};
const serializedResult = `${JSON.stringify(result, null, 2)}\n`;
console.log(serializedResult.trimEnd());
if (options.output) {
  const outputPath = resolve(options.output);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, serializedResult, { encoding: "utf8", flag: "wx" });
  console.log(`Evidence report written once to ${outputPath}`);
}
if (result.inventoryStatus !== "complete") process.exit(2);

function findPlaceholders(value, path = "brief") {
  const results = [];
  if (typeof value === "string" && value.includes("REPLACE_WITH_")) results.push(path);
  else if (Array.isArray(value)) value.forEach((item, index) => results.push(...findPlaceholders(item, `${path}[${index}]`)));
  else if (value && typeof value === "object") Object.entries(value).forEach(([key, child]) => results.push(...findPlaceholders(child, `${path}.${key}`)));
  return results;
}

function sha256(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function isSafeRelativePath(value) {
  const normalized = String(value).replaceAll("\\", "/");
  return Boolean(normalized) && !normalized.startsWith("/") && !normalized.includes("//") && !normalized.split("/").includes("..") && !/[<>:"|?*]/.test(normalized);
}

function parseArguments(args) {
  const result = { root: "", output: "", help: false, selfTest: false };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--help" || arg === "-h") result.help = true;
    else if (arg === "--self-test") result.selfTest = true;
    else if (arg === "--root") result.root = args[++index] ?? "";
    else if (arg === "--output") result.output = args[++index] ?? "";
    else fail(`Unknown argument: ${arg}`);
  }
  return result;
}

async function runSelfTest() {
  const root = await mkdtemp(join(tmpdir(), "living-textbook-pilot-preflight-"));
  try {
    const generated = spawnSync(process.execPath, [fileURLToPath(new URL("./create-publisher-pilot-intake-kit.mjs", import.meta.url)), "--root", root, "--tenant-id", "self-test", "--publisher-name", "Example Publisher", "--book-title", "Example Book", "--unit-key", "example:book:L1:U1"], { encoding: "utf8" });
    if (generated.status !== 0) fail(`kit generator failed: ${generated.stderr}`);
    const briefPath = join(root, "publisher-pilot-intake.json");
    const brief = JSON.parse(await readFile(briefPath, "utf8"));
    for (const key of ["seriesName", "edition", "version", "sourceOwner", "retentionPolicy", "reportingPolicy"]) {
      if (typeof brief[key] === "string") brief[key] = brief[key].replace(/^REPLACE_WITH_.*$/, `confirmed-${key}`);
    }
    brief.qrPageReferences = ["page-1"];
    brief.qrReferences = [{ referenceId: "unit-1-entry", pageReference: "page-1", unitId: "unit-1", activitySlug: "unit-1-entry", targetType: "unit-launch", language: "en" }];
    await writeFile(briefPath, `${JSON.stringify(brief, null, 2)}\n`, "utf8");
    for (const relativePath of [...brief.sourceFiles, ...brief.mediaRequests.map((request) => request.relativePath), ...brief.evidenceRequests.map((request) => request.relativePath)]) {
      await mkdir(join(root, relativePath, ".."), { recursive: true });
      await writeFile(join(root, relativePath), "self-test", "utf8");
    }
    const preflight = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--root", root], { encoding: "utf8" });
    if (preflight.status !== 0 || !preflight.stdout.includes('"inventoryStatus": "complete"')) fail(`preflight self-test failed: ${preflight.stderr || preflight.stdout}`);
    const outputPath = join(root, "evidence", "publisher-intake-preflight.json");
    const exported = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--root", root, "--output", outputPath], { encoding: "utf8" });
    if (exported.status !== 0 || !exported.stdout.includes("Evidence report written once") || !exported.stdout.includes('"inventoryStatus": "complete"')) fail(`preflight evidence export self-test failed: ${exported.stderr || exported.stdout}`);
    const overwrite = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--root", root, "--output", outputPath], { encoding: "utf8" });
    if (overwrite.status === 0) fail("preflight evidence export self-test allowed an overwrite.");
    const optionalRoot = await mkdtemp(join(tmpdir(), "living-textbook-pilot-optional-"));
    try {
      const optionalGenerated = spawnSync(process.execPath, [fileURLToPath(new URL("./create-publisher-pilot-intake-kit.mjs", import.meta.url)), "--root", optionalRoot, "--tenant-id", "optional-test", "--publisher-name", "Example Publisher", "--book-title", "Example Book", "--unit-key", "example:book:L1:U1"], { encoding: "utf8" });
      if (optionalGenerated.status !== 0) fail(`optional-media kit generator failed: ${optionalGenerated.stderr}`);
      const optionalBriefPath = join(optionalRoot, "publisher-pilot-intake.json");
      const optionalBrief = JSON.parse(await readFile(optionalBriefPath, "utf8"));
      for (const key of ["seriesName", "edition", "version", "sourceOwner", "retentionPolicy", "reportingPolicy"]) {
        if (typeof optionalBrief[key] === "string") optionalBrief[key] = optionalBrief[key].replace(/^REPLACE_WITH_.*$/, `confirmed-${key}`);
      }
      optionalBrief.qrPageReferences = ["page-1"];
      optionalBrief.qrReferences = [{ referenceId: "unit-1-entry", pageReference: "page-1", unitId: "unit-1", activitySlug: "unit-1-entry", targetType: "unit-launch", language: "en" }];
      await writeFile(optionalBriefPath, `${JSON.stringify(optionalBrief, null, 2)}\n`, "utf8");
      for (const relativePath of [
        ...optionalBrief.sourceFiles,
        ...optionalBrief.mediaRequests.filter((request) => request.required).map((request) => request.relativePath),
        ...optionalBrief.evidenceRequests.filter((request) => request.required).map((request) => request.relativePath),
      ]) {
        await mkdir(join(optionalRoot, relativePath, ".."), { recursive: true });
        await writeFile(join(optionalRoot, relativePath), "required-self-test", "utf8");
      }
      const optionalPreflight = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--root", optionalRoot], { encoding: "utf8" });
      if (optionalPreflight.status !== 0 || !optionalPreflight.stdout.includes('"inventoryStatus": "complete"') || !optionalPreflight.stdout.includes('"omittedOptionalFiles"')) fail(`optional media omission self-test failed: ${optionalPreflight.stderr || optionalPreflight.stdout}`);
    } finally {
      await rm(optionalRoot, { recursive: true, force: true });
    }
    const duplicateLanguageBrief = { ...brief, supportLanguages: ["ja", "JA"] };
    await writeFile(briefPath, `${JSON.stringify(duplicateLanguageBrief, null, 2)}\n`, "utf8");
    const duplicateLanguage = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--root", root], { encoding: "utf8" });
    if (duplicateLanguage.status === 0 || !duplicateLanguage.stdout.includes("supportLanguages must not contain duplicate ids")) fail("preflight self-test allowed duplicate support-language ids");
    const invalidHostedBrief = { ...brief, deliveryMode: "closed-local", hostedPersistenceOptIn: true };
    await writeFile(briefPath, `${JSON.stringify(invalidHostedBrief, null, 2)}\n`, "utf8");
    const invalidHosted = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--root", root], { encoding: "utf8" });
    if (invalidHosted.status === 0 || !invalidHosted.stdout.includes("closed-local delivery cannot opt in")) fail("preflight self-test allowed hosted persistence for closed-local delivery");
    console.log("PASS publisher pilot intake preflight detects placeholders, unsafe paths, missing files, complete inventory, edited language/delivery policy, and create-once evidence export.");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

function fail(message) { console.error(`ERROR ${message}`); process.exit(2); }
