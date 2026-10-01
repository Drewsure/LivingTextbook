import { access, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const acceptedTypesByKind = {
  "textbook-source": { pdf: "application/pdf", docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", txt: "text/plain", md: "text/markdown", csv: "text/csv" },
  image: { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp", svg: "image/svg+xml" },
  audio: { mp3: "audio/mpeg", wav: "audio/wav", m4a: "audio/mp4", ogg: "audio/ogg" },
  video: { mp4: "video/mp4", webm: "video/webm", mov: "video/quicktime" },
  transcript: { txt: "text/plain", vtt: "text/vtt", srt: "application/x-subrip" },
  font: { woff2: "font/woff2", woff: "font/woff", ttf: "font/ttf", otf: "font/otf" },
  "background-media": { mp3: "audio/mpeg", wav: "audio/wav", m4a: "audio/mp4", ogg: "audio/ogg", mp4: "video/mp4", webm: "video/webm", mov: "video/quicktime" },
};

const options = parseArguments(process.argv.slice(2));
if (options.help) { printUsage(); process.exit(0); }
if (options.selfTest) { await runSelfTest(); process.exit(0); }
if (!options.root) fail("Missing --root.");

const root = resolve(options.root);
const briefPath = join(root, "publisher-pilot-intake.json");
const manifestPath = join(root, "publisher-source-manifest.json");
const brief = await readBrief(briefPath);
validateBriefForBridge(brief);
try {
  await access(manifestPath);
  fail(`Refusing to overwrite an existing manifest: ${manifestPath}`);
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}

const manifest = createManifest(brief);
await mkdir(root, { recursive: true });
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
console.log(JSON.stringify({ manifestPath, entryCount: manifest.entries.length, contentFilesCreated: false, uploadPerformed: false, packageAssemblyAllowed: false, nextStep: "Run preflight:publisher-source against this folder." }, null, 2));

async function readBrief(path) {
  try { return JSON.parse(await readFile(path, "utf8")); }
  catch { fail(`Pilot intake brief could not be read as JSON: ${path}`); }
}

function validateBriefForBridge(brief) {
  if (!brief || typeof brief !== "object" || Array.isArray(brief)) fail("Pilot intake brief must be an object.");
  if (JSON.stringify(brief).includes("REPLACE_WITH_")) fail("The intake brief still contains unresolved REPLACE_WITH_* placeholders.");
  for (const field of ["tenantId", "unitKey", "version"]) if (typeof brief[field] !== "string" || !brief[field].trim()) fail(`${field} is required in the intake brief.`);
  if (brief.reviewOnly !== true || brief.packageAssemblyAllowed !== false || brief.studentFacingUseAllowed !== false) fail("The intake brief must remain review-only and protected-action blocked.");
  if (!Array.isArray(brief.sourceFiles) || brief.sourceFiles.length === 0) fail("The intake brief must declare at least one source file.");
  if (!Array.isArray(brief.mediaRequests)) fail("The intake brief mediaRequests field must be an array.");
  for (const path of brief.sourceFiles) validateRelativePath(path);
  for (const request of brief.mediaRequests) {
    if (!request || typeof request !== "object") fail("Every media request must be an object.");
    if (!acceptedTypesByKind[request.kind]) fail(`Unsupported media request kind: ${request.kind}`);
    validateRelativePath(request.relativePath);
    if (typeof request.required !== "boolean") fail(`Media request ${request.relativePath} must declare required as boolean.`);
  }
}

function createManifest(brief) {
  const entries = [];
  for (const sourcePath of brief.sourceFiles) entries.push(createEntry("textbook-source", sourcePath, brief.unitKey, true));
  for (const request of brief.mediaRequests) entries.push(createEntry(request.kind, request.relativePath, request.unitKey || brief.unitKey, request.required));
  const packageId = `${slug(brief.tenantId)}-${slug(brief.unitKey)}-pilot`;
  return { recordVersion: 1, manifestId: `publisher-source:${brief.tenantId}:${packageId}:${brief.version}`, tenantId: brief.tenantId, packageId, version: brief.version, entries, reviewOnly: true, quarantineWriteAllowed: false, packageAssemblyAllowed: false, studentFacingUseAllowed: false };
}

function createEntry(kind, relativePath, unitKey, required) {
  const safePath = validateRelativePath(relativePath);
  const extension = safePath.toLowerCase().split(".").pop() ?? "";
  if (!acceptedTypesByKind[kind]?.[extension]) fail(`${kind} path must use a supported extension: ${relativePath}`);
  const assetId = `${kind}-${slug(safePath)}`;
  return { assetId, kind, relativePath: safePath, unitKey, acceptedTypes: [...new Set(Object.values(acceptedTypesByKind[kind]))], required };
}

function validateRelativePath(value) {
  const normalized = String(value).replaceAll("\\", "/");
  if (!normalized || normalized.startsWith("/") || normalized.includes("//") || normalized.split("/").includes("..") || normalized === "publisher-source-manifest.json" || /[<>:"|?*]/.test(normalized)) fail(`Unsafe relative path: ${value}`);
  return normalized;
}

function slug(value) { return String(value).replace(/[^A-Za-z0-9]+/g, "-").toLowerCase().replace(/^-|-$/g, "") || "item"; }

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
  const root = await mkdtemp(join(tmpdir(), "living-textbook-pilot-bridge-"));
  try {
    const kitGenerator = fileURLToPath(new URL("./create-publisher-pilot-intake-kit.mjs", import.meta.url));
    const generated = spawnSync(process.execPath, [kitGenerator, "--root", root, "--tenant-id", "self-test", "--publisher-name", "Example Publisher", "--book-title", "Example Book", "--unit-key", "example:book:L1:U1"], { encoding: "utf8" });
    if (generated.status !== 0) throw new Error(`intake kit generator failed: ${generated.stderr}`);
    const briefPath = join(root, "publisher-pilot-intake.json");
    const brief = JSON.parse(await readFile(briefPath, "utf8"));
    Object.assign(brief, { seriesName: "Example Series", edition: "2026", version: "1.0.0", sourceOwner: "Example Publisher", retentionPolicy: "School policy", reportingPolicy: "Teacher reports", qrPageReferences: ["page-1"], qrReferences: [{ ...brief.qrReferences[0], pageReference: "page-1" }] });
    await writeFile(briefPath, `${JSON.stringify(brief, null, 2)}\n`, "utf8");
    for (const relativePath of [...brief.sourceFiles, ...brief.mediaRequests.map((request) => request.relativePath)]) {
      const absolute = join(root, relativePath);
      await mkdir(join(absolute, ".."), { recursive: true });
      await writeFile(absolute, `fixture:${relativePath}`, "utf8");
    }
    const converted = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--root", root], { encoding: "utf8" });
    if (converted.status !== 0) throw new Error(`bridge conversion failed: ${converted.stderr}`);
    const manifest = JSON.parse(await readFile(join(root, "publisher-source-manifest.json"), "utf8"));
    if (manifest.entries.length !== 7 || manifest.reviewOnly !== true || manifest.packageAssemblyAllowed !== false || manifest.entries.find((entry) => entry.kind === "audio")?.acceptedTypes.includes("audio/mpeg") !== true) throw new Error("bridge did not create the expected review-only canonical manifest");
    const preflight = spawnSync(process.execPath, ["--experimental-strip-types", fileURLToPath(new URL("./publisher-source-preflight.mjs", import.meta.url))], { encoding: "utf8", env: { ...process.env, LIVING_TEXTBOOOK_PUBLISHER_SOURCE_DIRECTORY: root } });
    if (preflight.status !== 0 || !preflight.stdout.includes('"inventoryStatus": "complete"')) throw new Error(`bridged manifest was not accepted by source preflight: ${preflight.stdout}\n${preflight.stderr}`);
    const second = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--root", root], { encoding: "utf8" });
    if (second.status === 0 || !second.stderr.includes("Refusing to overwrite")) throw new Error("bridge must refuse to overwrite an existing manifest");
    console.log("PASS publisher pilot intake bridges to the canonical review-only source manifest, passes source preflight, and refuses overwrite.");
  } finally { await rm(root, { recursive: true, force: true }); }
}

function fail(message) { console.error(`ERROR ${message}`); process.exit(2); }
function printUsage() { console.log("Usage: node scripts/create-publisher-source-manifest-from-pilot-kit.mjs --root <completed-publisher-pilot-kit>\n\nReads publisher-pilot-intake.json and creates only publisher-source-manifest.json. It refuses overwrite and never copies, uploads, assembles, prints QR codes, or enables students."); }
