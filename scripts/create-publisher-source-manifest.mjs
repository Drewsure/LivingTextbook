import { access, mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join, resolve, posix } from "node:path";
import { tmpdir } from "node:os";

const acceptedTypesByKind = {
  "textbook-source": ["pdf", "docx", "txt"],
  image: ["png", "jpg", "jpeg", "webp"],
  audio: ["mp3", "wav"],
  video: ["mp4", "webm"],
  transcript: ["txt", "vtt", "srt"],
  font: ["woff2", "woff", "ttf", "otf"],
  "background-media": ["mp3", "wav", "mp4", "webm"],
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
  if (!acceptedTypesByKind[kind]) fail(`Unsupported --asset kind: ${kind}`);
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
  const acceptedTypes = acceptedTypesByKind[kind];
  if (!acceptedTypes.includes(extension)) fail(`${kind} path must use one of: ${acceptedTypes.join(", ")}.`);
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
    const args = { root, tenantId: "self-test-tenant", packageId: "self-test-package", version: "1.0.0", unitKey: "self-test:series:L1:U1", source: "unit-1/source.pdf", assets: ["image=unit-1/diagram.png", "audio=unit-1/greetings.mp3", "video=unit-1/lesson.mp4"] };
    const entries = [createEntry("textbook-source", args.source, args.unitKey, true), ...args.assets.map((asset) => { const [kind, path] = asset.split("=", 2); return createEntry(kind, path, args.unitKey, false); })];
    if (entries.length !== 4 || entries[1].acceptedTypes[0] !== "png") throw new Error("manifest template self-test did not create the expected entries");
    await mkdir(root, { recursive: true });
    const manifestPath = join(root, "publisher-source-manifest.json");
    await writeFile(manifestPath, JSON.stringify({ entries }, null, 2), "utf8");
    const stored = JSON.parse(await readFile(manifestPath, "utf8"));
    if (stored.entries[0].required !== true || stored.entries[2].kind !== "audio") throw new Error("manifest template self-test did not preserve entry metadata");
    console.log("PASS publisher source manifest template creates safe, review-only, multi-media declarations without creating publisher content files.");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

function fail(message) {
  console.error(`ERROR ${message}`);
  process.exit(2);
}

function printUsage() {
  console.log(`Usage:\n  node scripts/create-publisher-source-manifest.mjs --root <folder> --tenant-id <id> --package-id <id> --version <version> --unit-key <key> --source <relative/path.pdf> [--asset kind=relative/path.ext]\n\nSupported asset kinds: ${Object.keys(acceptedTypesByKind).join(", ")}\nThe command creates only publisher-source-manifest.json and refuses to overwrite it.`);
}
