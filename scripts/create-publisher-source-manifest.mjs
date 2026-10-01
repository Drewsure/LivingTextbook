import { access, mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { join, resolve, posix } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const acceptedExtensionsByKind = {
  "textbook-source": ["pdf", "docx", "txt", "md", "csv"],
  image: ["png", "jpg", "jpeg", "webp", "svg"],
  audio: ["mp3", "wav", "m4a", "ogg"],
  video: ["mp4", "webm", "mov"],
  transcript: ["txt", "vtt", "srt"],
  font: ["woff2", "woff", "ttf", "otf"],
  "background-media": ["mp3", "wav", "m4a", "ogg", "mp4", "webm", "mov"],
};
const acceptedTypesByKind = {
  "textbook-source": ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain", "text/markdown", "text/csv"],
  image: ["image/png", "image/jpeg", "image/webp", "image/svg+xml"],
  audio: ["audio/mpeg", "audio/wav", "audio/mp4", "audio/ogg"],
  video: ["video/mp4", "video/webm", "video/quicktime"],
  transcript: ["text/plain", "text/vtt", "application/x-subrip"],
  font: ["font/woff2", "font/woff", "font/ttf", "font/otf"],
  "background-media": ["audio/mpeg", "audio/wav", "audio/mp4", "audio/ogg", "video/mp4", "video/webm", "video/quicktime"],
};

const options = parseArguments(process.argv.slice(2));
if (options.help) {
  printUsage();
  process.exit(0);
}
if (options.selfTest) {
  await runSelfTest();
  process.exit(0);
}

const required = ["root", "tenantId", "packageId", "version", "unitKey", "source"];
for (const name of required) {
  if (!options[name]) fail(`Missing --${name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}.`);
}

const root = resolve(options.root);
const manifestPath = join(root, "publisher-source-manifest.json");
try {
  await access(manifestPath);
  fail(`Refusing to overwrite an existing manifest: ${manifestPath}`);
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}

const entries = [createEntry("textbook-source", options.source, options.unitKey, true)];
for (const asset of options.assets) {
  const [kind, relativePath] = asset.split("=", 2);
  if (!acceptedExtensionsByKind[kind]) fail(`Unsupported --asset kind: ${kind}`);
  if (!relativePath) fail(`Asset ${asset} must use kind=relative/path.ext.`);
  entries.push(createEntry(kind, relativePath, options.unitKey, false));
}

await mkdir(root, { recursive: true });
const manifest = {
  recordVersion: 1,
  manifestId: `publisher-source:${options.tenantId}:${options.packageId}:${options.version}`,
  tenantId: options.tenantId,
  packageId: options.packageId,
  version: options.version,
  entries,
  reviewOnly: true,
  quarantineWriteAllowed: false,
  packageAssemblyAllowed: false,
  studentFacingUseAllowed: false,
};
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
console.log(JSON.stringify({ manifestPath, entryCount: entries.length, contentFilesCreated: false, nextStep: "Place the declared publisher files in the same root, then run preflight:publisher-source." }, null, 2));

function createEntry(kind, relativePath, unitKey, requiredEntry) {
  const safePath = validateRelativePath(relativePath);
  const extension = safePath.split(".").pop()?.toLowerCase() ?? "";
  const acceptedExtensions = acceptedExtensionsByKind[kind];
  const acceptedTypes = acceptedTypesByKind[kind];
  if (!acceptedExtensions.includes(extension)) fail(`${kind} path must use one of: ${acceptedExtensions.join(", ")}.`);
  const assetId = `${kind}-${safePath.replace(/[^A-Za-z0-9]+/g, "-").toLowerCase().replace(/^-|-$/g, "")}`;
  return { assetId, kind, relativePath: safePath, unitKey, acceptedTypes, required: requiredEntry };
}

function validateRelativePath(value) {
  const normalized = String(value).replaceAll("\\", "/");
  if (!normalized || normalized.startsWith("/") || normalized.includes("//") || normalized.split("/").includes("..") || normalized === "publisher-source-manifest.json") {
    fail(`Unsafe relative path: ${value}`);
  }
  const parsed = posix.normalize(normalized);
  if (parsed !== normalized || parsed.includes("..")) fail(`Unsafe relative path: ${value}`);
  return normalized;
}

function parseArguments(args) {
  const result = { root: "", tenantId: "", packageId: "", version: "", unitKey: "", source: "", assets: [], help: false, selfTest: false };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--help" || arg === "-h") result.help = true;
    else if (arg === "--self-test") result.selfTest = true;
    else if (arg === "--asset") result.assets.push(args[++index] ?? "");
    else if (["root", "tenant-id", "package-id", "version", "unit-key", "source"].includes(arg.slice(2))) result[toCamelCase(arg.slice(2))] = args[++index] ?? "";
    else fail(`Unknown argument: ${arg}`);
  }
  return result;
}

function toCamelCase(value) { return value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()); }

async function runSelfTest() {
  const root = await mkdtemp(join(tmpdir(), "living-textbook-publisher-manifest-"));
  try {
    const args = [
      fileURLToPath(import.meta.url),
      "--root", root,
      "--tenant-id", "self-test-tenant",
      "--package-id", "self-test-package",
      "--version", "1.0.0",
      "--unit-key", "self-test:series:L1:U1",
      "--source", "unit-1/source.pdf",
      "--asset", "image=unit-1/diagram.svg",
      "--asset", "audio=unit-1/greetings.m4a",
      "--asset", "video=unit-1/lesson.mov",
      "--asset", "transcript=unit-1/lesson.vtt",
      "--asset", "background-media=unit-1/background.ogg",
    ];
    await mkdir(join(root, "unit-1"), { recursive: true });
    for (const file of ["source.pdf", "diagram.svg", "greetings.m4a", "lesson.mov", "lesson.vtt", "background.ogg"]) await writeFile(join(root, "unit-1", file), `fixture:${file}`, "utf8");
    const generated = spawnSync(process.execPath, args, { encoding: "utf8" });
    if (generated.status !== 0) throw new Error(`manifest template CLI failed: ${generated.stderr}`);
    const manifestPath = join(root, "publisher-source-manifest.json");
    const stored = JSON.parse(await readFile(manifestPath, "utf8"));
    if (stored.entries.length !== 6 || stored.entries[1].acceptedTypes[0] !== "image/png" || stored.entries[2].acceptedTypes.includes("audio/mp4") !== true || stored.entries[0].required !== true || stored.entries[2].kind !== "audio") throw new Error("manifest template self-test did not preserve MIME and entry metadata");
    const preflight = spawnSync(process.execPath, ["--experimental-strip-types", fileURLToPath(new URL("./publisher-source-preflight.mjs", import.meta.url))], { encoding: "utf8", env: { ...process.env, LIVING_TEXTBOOOK_PUBLISHER_SOURCE_DIRECTORY: root } });
    if (preflight.status !== 0 || !preflight.stdout.includes('"inventoryStatus": "complete"')) throw new Error(`generated manifest was not accepted by source preflight: ${preflight.stdout}\n${preflight.stderr}`);
    console.log("PASS publisher source manifest template creates safe MIME declarations accepted by source preflight without package side effects.");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

function fail(message) {
  console.error(`ERROR ${message}`);
  process.exit(2);
}

function printUsage() {
  console.log(`Usage:\n  node scripts/create-publisher-source-manifest.mjs --root <folder> --tenant-id <id> --package-id <id> --version <version> --unit-key <key> --source <relative/path.pdf> [--asset kind=relative/path.ext]\n\nSupported asset kinds: ${Object.keys(acceptedExtensionsByKind).join(", ")}\nThe command creates only publisher-source-manifest.json and refuses to overwrite it.`);
}
