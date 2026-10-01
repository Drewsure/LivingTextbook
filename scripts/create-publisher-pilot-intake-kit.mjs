import { access, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const options = parseArguments(process.argv.slice(2));
if (options.help) {
  console.log("Usage: node scripts/create-publisher-pilot-intake-kit.mjs --root <folder> --tenant-id <id> --publisher-name <name> --book-title <title> --unit-key <key>");
  process.exit(0);
}
if (options.selfTest) {
  await runSelfTest();
  process.exit(0);
}

for (const name of ["root", "tenantId", "publisherName", "bookTitle", "unitKey"]) {
  if (!options[name]) fail(`Missing --${name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}.`);
}

const root = resolve(options.root);
const briefPath = join(root, "publisher-pilot-intake.json");
try {
  await access(briefPath);
  fail(`Refusing to overwrite an existing brief: ${briefPath}`);
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}

const brief = createBrief(options);
const validationErrors = validateBrief(brief);
if (validationErrors.length > 0) fail(validationErrors.join(" "));
await mkdir(root, { recursive: true });
for (const directory of ["source", "media/images", "media/audio", "media/video", "media/transcripts", "media/fonts", "media/background"]) {
  await mkdir(join(root, directory), { recursive: true });
}
await writeFile(briefPath, `${JSON.stringify(brief, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
await writeFile(join(root, "README.md"), createReadme(brief), { encoding: "utf8", flag: "wx" });
console.log(JSON.stringify({ root, briefPath, directoriesCreated: 7, reviewOnly: true, packageAssemblyAllowed: false, studentFacingUseAllowed: false }, null, 2));

function createBrief(options) {
  return {
    recordVersion: 1,
    briefId: `publisher-pilot-intake:${options.tenantId}:${options.unitKey}`,
    tenantId: options.tenantId,
    publisherName: options.publisherName,
    seriesName: "REPLACE_WITH_SERIES_NAME",
    bookTitle: options.bookTitle,
    edition: "REPLACE_WITH_EDITION",
    version: "REPLACE_WITH_VERSION",
    targetLanguage: "en",
    supportLanguages: ["ja"],
    unitKey: options.unitKey,
    sourceOwner: "REPLACE_WITH_RIGHTS_OWNER",
    sourceFiles: ["source/unit-1.pdf"],
    mediaRequests: [
      { kind: "image", relativePath: "media/images/unit-1-diagram.png", unitKey: options.unitKey, required: false, purpose: "Optional labelled diagram or game image." },
      { kind: "audio", relativePath: "media/audio/unit-1-learning-audio.mp3", unitKey: options.unitKey, required: true, purpose: "Target-language text and instruction audio." },
      { kind: "video", relativePath: "media/video/unit-1-video.mp4", unitKey: options.unitKey, required: false, purpose: "Optional publisher-owned unit video." },
      { kind: "transcript", relativePath: "media/transcripts/unit-1-video.vtt", unitKey: options.unitKey, required: false, purpose: "Transcript or captions for supplied video." },
      { kind: "font", relativePath: "media/fonts/tenant-font.woff2", unitKey: options.unitKey, required: false, purpose: "Optional licensed tenant font." },
      { kind: "background-media", relativePath: "media/background/unit-1-background.ogg", unitKey: options.unitKey, required: false, purpose: "Optional approved game background media." },
    ],
    deliveryMode: "hybrid",
    hostedPersistenceOptIn: false,
    qrPageReferences: ["REPLACE_WITH_TEXTBOOK_PAGE_OR_SECTION"],
    qrReferences: [{ referenceId: "unit-1-entry", pageReference: "REPLACE_WITH_TEXTBOOK_PAGE_OR_SECTION", unitId: "unit-1", activitySlug: "unit-1-entry", targetType: "unit-launch", language: "en" }],
    retentionPolicy: "REPLACE_WITH_SCHOOL_RETENTION_POLICY",
    reportingPolicy: "REPLACE_WITH_TEACHER_REPORTING_POLICY",
    reviewOnly: true,
    packageAssemblyAllowed: false,
    studentFacingUseAllowed: false,
  };
}

function createReadme(brief) {
  return `# Publisher Pilot Intake Kit\n\nThis folder is a review-only handoff for **${brief.publisherName}** / **${brief.bookTitle}**.\n\n1. Replace every REPLACE_WITH_* value in publisher-pilot-intake.json.\n2. Place the publisher's source and media files at the declared relative paths.\n3. Add rights, accessibility, transcript, caption, and replacement evidence through the teacher review workflow.\n4. Run the source preflight before sending the folder to Living Textbook review.\n\nThe brief deliberately keeps package assembly and student-facing use disabled. A completed kit is evidence for review, not a release approval.\n\nRequired checks before handoff:\n- named rights owner and edition/version\n- page or section mapping for every QR reference\n- target-language audio for student-facing text and instructions\n- support language marked as support-only\n- media rights, accessibility, checksum, and replacement evidence\n- chosen hosted, closed-local, or hybrid delivery policy\n`;
}

function validateBrief(brief) {
  const errors = [];
  for (const key of ["briefId", "tenantId", "publisherName", "seriesName", "bookTitle", "edition", "version", "targetLanguage", "unitKey", "sourceOwner", "retentionPolicy", "reportingPolicy"]) {
    if (!brief[key]?.trim()) errors.push(`${key} is required.`);
  }
  if (!brief.sourceFiles.length || !brief.mediaRequests.length || !brief.qrPageReferences.length || !brief.qrReferences.length) errors.push("source, media, and structured QR placeholders are required.");
  if (brief.reviewOnly !== true || brief.packageAssemblyAllowed !== false || brief.studentFacingUseAllowed !== false) errors.push("safety flags are invalid.");
  return errors;
}

function parseArguments(args) {
  const result = { root: "", tenantId: "", publisherName: "", bookTitle: "", unitKey: "", help: false, selfTest: false };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--help" || arg === "-h") result.help = true;
    else if (arg === "--self-test") result.selfTest = true;
    else if (["root", "tenant-id", "publisher-name", "book-title", "unit-key"].includes(arg.slice(2))) result[toCamelCase(arg.slice(2))] = args[++index] ?? "";
    else fail(`Unknown argument: ${arg}`);
  }
  return result;
}

function toCamelCase(value) { return value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()); }

async function runSelfTest() {
  const root = resolve(`${process.env.TEMP ?? process.env.TMP ?? "."}/living-textbook-pilot-kit-self-test`);
  await rm(root, { recursive: true, force: true });
  const generated = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--root", root, "--tenant-id", "self-test", "--publisher-name", "Example Publisher", "--book-title", "Example Book", "--unit-key", "example:book:L1:U1"], { encoding: "utf8" });
  if (generated.status !== 0) fail(`self-test generator failed: ${generated.stderr}`);
  const stored = JSON.parse(await readFile(join(root, "publisher-pilot-intake.json"), "utf8"));
  if (stored.reviewOnly !== true || stored.mediaRequests.length !== 6 || stored.deliveryMode !== "hybrid") fail("self-test did not preserve the review-only pilot brief.");
  await rm(root, { recursive: true, force: true });
  console.log("PASS publisher pilot intake kit creates a safe review-only brief and media folder scaffold.");
}

function fail(message) { console.error(`ERROR ${message}`); process.exit(2); }
