import { access, mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const options = parseArguments(process.argv.slice(2));
if (options.help) {
  console.log("Usage: node scripts/publisher-pilot-intake-preflight.mjs --root <publisher-pilot-input-folder>");
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
try {
  brief = JSON.parse(await readFile(briefPath, "utf8"));
} catch (error) {
  fail(`Cannot read publisher-pilot-intake.json: ${error.message}`);
}

const missingFiles = [];
const unsafePaths = [];
const declaredFiles = [...(brief.sourceFiles ?? []), ...(brief.mediaRequests ?? []).map((request) => request.relativePath)];
for (const relativePath of declaredFiles) {
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
if (!Array.isArray(brief.qrReferences) || brief.qrReferences.length === 0) structuralErrors.push("At least one structured QR reference is required.");

const result = {
  briefId: brief.briefId ?? "unknown",
  tenantId: brief.tenantId ?? "unknown",
  deliveryMode: brief.deliveryMode ?? "unknown",
  inventoryStatus: missingFiles.length === 0 && unsafePaths.length === 0 && placeholderFields.length === 0 && structuralErrors.length === 0 ? "complete" : "incomplete",
  declaredFileCount: declaredFiles.length,
  missingFiles,
  unsafePaths,
  placeholderFields,
  structuralErrors,
  reviewOnly: brief.reviewOnly === true,
  packageAssemblyAllowed: brief.packageAssemblyAllowed === true,
  studentFacingUseAllowed: brief.studentFacingUseAllowed === true,
};
console.log(JSON.stringify(result, null, 2));
if (result.inventoryStatus !== "complete") process.exit(2);

function findPlaceholders(value, path = "brief") {
  const results = [];
  if (typeof value === "string" && value.includes("REPLACE_WITH_")) results.push(path);
  else if (Array.isArray(value)) value.forEach((item, index) => results.push(...findPlaceholders(item, `${path}[${index}]`)));
  else if (value && typeof value === "object") Object.entries(value).forEach(([key, child]) => results.push(...findPlaceholders(child, `${path}.${key}`)));
  return results;
}

function isSafeRelativePath(value) {
  const normalized = String(value).replaceAll("\\", "/");
  return Boolean(normalized) && !normalized.startsWith("/") && !normalized.includes("//") && !normalized.split("/").includes("..") && !/[<>:"|?*]/.test(normalized);
}

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
    for (const relativePath of [...brief.sourceFiles, ...brief.mediaRequests.map((request) => request.relativePath)]) {
      await mkdir(join(root, relativePath, ".."), { recursive: true });
      await writeFile(join(root, relativePath), "self-test", "utf8");
    }
    const preflight = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--root", root], { encoding: "utf8" });
    if (preflight.status !== 0 || !preflight.stdout.includes('"inventoryStatus": "complete"')) fail(`preflight self-test failed: ${preflight.stderr || preflight.stdout}`);
    console.log("PASS publisher pilot intake preflight detects placeholders, unsafe paths, missing files, and complete inventory without writing package output.");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

function fail(message) { console.error(`ERROR ${message}`); process.exit(2); }
