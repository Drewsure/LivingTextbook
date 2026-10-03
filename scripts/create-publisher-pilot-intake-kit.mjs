import { access, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const options = parseArguments(process.argv.slice(2));
if (options.help) {
  console.log("Usage: node scripts/create-publisher-pilot-intake-kit.mjs --root <folder> --tenant-id <id> --publisher-name <name> --book-title <title> --unit-key <key> [--source-file source/unit-1.pdf|source/unit-1.docx|source/unit-1.txt|source/unit-1.md|source/unit-1.csv] [--teacher-answer-file teacher/answers/unit-1-answers.pdf] [--target-language en] [--support-languages ja,es] [--delivery-mode hosted-pwa|closed-local|hybrid] [--hosted-persistence-opt-in]");
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
  for (const directory of ["source", "teacher/answers", "media/images", "media/audio", "media/video", "media/transcripts", "media/fonts", "media/background", "evidence"]) {
  await mkdir(join(root, directory), { recursive: true });
}
await writeFile(briefPath, `${JSON.stringify(brief, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
await writeFile(join(root, "README.md"), createReadme(brief), { encoding: "utf8", flag: "wx" });
console.log(JSON.stringify({ root, briefPath, directoriesCreated: 8, reviewOnly: true, packageAssemblyAllowed: false, studentFacingUseAllowed: false }, null, 2));

function createBrief(options) {
  const sourceFile = validateSourceFile(options.sourceFile);
  return {
    recordVersion: 1,
    briefId: `publisher-pilot-intake:${options.tenantId}:${options.unitKey}`,
    tenantId: options.tenantId,
    publisherName: options.publisherName,
    seriesName: "REPLACE_WITH_SERIES_NAME",
    bookTitle: options.bookTitle,
    edition: "REPLACE_WITH_EDITION",
    version: "REPLACE_WITH_VERSION",
    targetLanguage: parseLanguageId(options.targetLanguage, "target-language"),
    supportLanguages: parseSupportLanguages(options.supportLanguages),
    unitKey: options.unitKey,
    sourceOwner: "REPLACE_WITH_RIGHTS_OWNER",
    sourceFiles: [sourceFile],
    teacherAnswerFiles: options.teacherAnswerFile ? [validateTeacherAnswerFile(options.teacherAnswerFile)] : [],
    mediaRequests: [
      { kind: "image", relativePath: "media/images/unit-1-diagram.png", unitKey: options.unitKey, required: false, purpose: "Optional labelled diagram or game image." },
      { kind: "audio", relativePath: "media/audio/unit-1-learning-audio.mp3", unitKey: options.unitKey, required: true, purpose: "Target-language text and instruction audio." },
      { kind: "video", relativePath: "media/video/unit-1-video.mp4", unitKey: options.unitKey, required: false, purpose: "Optional publisher-owned unit video." },
      { kind: "transcript", relativePath: "media/transcripts/unit-1-video.vtt", unitKey: options.unitKey, required: false, purpose: "Transcript or captions for supplied video." },
      { kind: "font", relativePath: "media/fonts/tenant-font.woff2", unitKey: options.unitKey, required: false, purpose: "Optional licensed tenant font." },
      { kind: "background-media", relativePath: "media/background/unit-1-background.ogg", unitKey: options.unitKey, required: false, purpose: "Optional approved game background media." },
    ],
    evidenceRequests: [
      { referenceId: "rights-evidence", kind: "rights", relativePath: "evidence/rights-and-permissions.md", appliesTo: [sourceFile, ...(options.teacherAnswerFile ? [validateTeacherAnswerFile(options.teacherAnswerFile)] : [])], required: true },
      { referenceId: "accessibility-evidence", kind: "accessibility", relativePath: "evidence/accessibility-and-captions.md", appliesTo: ["media/audio/unit-1-learning-audio.mp3", "media/video/unit-1-video.mp4"], required: true },
      { referenceId: "scan-evidence", kind: "scan", relativePath: "evidence/scan-report.json", appliesTo: [sourceFile], required: true },
    ],
    deliveryMode: parseDeliveryMode(options.deliveryMode),
    hostedPersistenceOptIn: options.hostedPersistenceOptIn,
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
  return `# Publisher Pilot Intake Kit\n\nThis folder is a review-only handoff for **${brief.publisherName}** / **${brief.bookTitle}**.\n\n1. Replace every REPLACE_WITH_* value in publisher-pilot-intake.json.\n2. Place the publisher's source and media files at the declared relative paths.\n3. Add rights, accessibility, transcript, caption, and replacement evidence through the teacher review workflow.\n4. Run the source preflight before sending the folder to Living Textbook review.\n\nDeclared target language: **${brief.targetLanguage}**. Declared delivery mode: **${brief.deliveryMode}**. Hosted persistence opt-in: **${brief.hostedPersistenceOptIn ? "requested for review" : "not requested"}**.\n\nThe brief deliberately keeps package assembly and student-facing use disabled. A completed kit is evidence for review, not a release approval.\n\nRequired checks before handoff:\n- named rights owner and edition/version\n- page or section mapping for every QR reference\n- target-language audio for student-facing text and instructions\n- support language marked as support-only\n- media rights, accessibility, checksum, and replacement evidence\n- explicit delivery policy and school approval for any hosted persistence request\n`;
}

function validateSourceFile(value) {
  const normalized = String(value || "source/unit-1.pdf").replaceAll("\\", "/");
  if (!normalized || normalized.startsWith("/") || normalized.includes("//") || normalized.split("/").includes("..") || !normalized.startsWith("source/") || /[<>:\"|?*]/.test(normalized)) {
    fail(`Unsafe textbook source path: ${value}`);
  }
  const extension = normalized.toLowerCase().split(".").pop() ?? "";
  if (!["pdf", "docx", "txt", "md", "csv"].includes(extension)) fail(`Unsupported textbook source extension: ${normalized}`);
  return normalized;
}

function validateTeacherAnswerFile(value) {
  const normalized = String(value || "").replaceAll("\\", "/");
  if (!normalized.startsWith("teacher/answers/") || normalized.startsWith("/") || normalized.includes("//") || normalized.split("/").includes("..") || /[<>:\"|?*]/.test(normalized)) {
    fail(`Unsafe teacher answer-key path: ${value}`);
  }
  const extension = normalized.toLowerCase().split(".").pop() ?? "";
  if (!["pdf", "docx", "txt", "md", "csv"].includes(extension)) fail(`Unsupported teacher answer-key extension: ${normalized}`);
  return normalized;
}

function parseSupportLanguages(value) {
  const languages = String(value || "")
    .split(",")
    .map((language) => language.trim())
    .filter(Boolean);
  const unique = [...new Set(languages)];
  const normalized = unique.map((language) => language.toLowerCase());
  if (normalized.some((language) => !/^[A-Za-z0-9][A-Za-z0-9-]{1,19}$/.test(language))) {
    fail(`Unsupported support-language id: ${value}`);
  }
  return normalized;
}

function parseLanguageId(value, label) {
  const normalized = String(value || "").trim();
  if (!/^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/.test(normalized)) fail(`Unsupported ${label} id: ${value}`);
  return normalized.toLowerCase();
}

function parseDeliveryMode(value) {
  const normalized = String(value || "hybrid").trim().toLowerCase();
  if (!["hosted-pwa", "closed-local", "hybrid"].includes(normalized)) fail(`Unsupported delivery-mode: ${value}`);
  return normalized;
}

function validateBrief(brief) {
  const errors = [];
  for (const key of ["briefId", "tenantId", "publisherName", "seriesName", "bookTitle", "edition", "version", "targetLanguage", "unitKey", "sourceOwner", "retentionPolicy", "reportingPolicy"]) {
    if (!brief[key]?.trim()) errors.push(`${key} is required.`);
  }
  if (!brief.sourceFiles.length || !brief.mediaRequests.length || !brief.evidenceRequests.length || !brief.qrPageReferences.length || !brief.qrReferences.length) errors.push("source, media, evidence, and structured QR placeholders are required.");
  if ((brief.teacherAnswerFiles ?? []).some((path) => !String(path).startsWith("teacher/answers/"))) errors.push("teacher answer-key files must remain under teacher/answers/.");
  if (brief.reviewOnly !== true || brief.packageAssemblyAllowed !== false || brief.studentFacingUseAllowed !== false) errors.push("safety flags are invalid.");
  if (brief.hostedPersistenceOptIn === true && brief.deliveryMode === "closed-local") errors.push("closed-local delivery cannot opt in to hosted persistence.");
  return errors;
}

function parseArguments(args) {
  const result = { root: "", tenantId: "", publisherName: "", bookTitle: "", unitKey: "", sourceFile: "source/unit-1.pdf", teacherAnswerFile: "", targetLanguage: "en", supportLanguages: "", deliveryMode: "hybrid", hostedPersistenceOptIn: false, help: false, selfTest: false };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--help" || arg === "-h") result.help = true;
    else if (arg === "--self-test") result.selfTest = true;
    else if (arg === "--hosted-persistence-opt-in") result.hostedPersistenceOptIn = true;
    else if (["root", "tenant-id", "publisher-name", "book-title", "unit-key", "source-file", "teacher-answer-file", "target-language", "support-languages", "delivery-mode"].includes(arg.slice(2))) result[toCamelCase(arg.slice(2))] = args[++index] ?? "";
    else fail(`Unknown argument: ${arg}`);
  }
  return result;
}

function toCamelCase(value) { return value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()); }

async function runSelfTest() {
  const root = resolve(`${process.env.TEMP ?? process.env.TMP ?? "."}/living-textbook-pilot-kit-self-test`);
  await rm(root, { recursive: true, force: true });
  const generated = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--root", root, "--tenant-id", "self-test", "--publisher-name", "Example Publisher", "--book-title", "Example Book", "--unit-key", "example:book:L1:U1", "--source-file", "source/unit-1.docx", "--teacher-answer-file", "teacher/answers/unit-1-answers.pdf", "--target-language", "ja", "--support-languages", "en,es,en", "--delivery-mode", "closed-local"], { encoding: "utf8" });
  if (generated.status !== 0) fail(`self-test generator failed: ${generated.stderr}`);
  const stored = JSON.parse(await readFile(join(root, "publisher-pilot-intake.json"), "utf8"));
  if (stored.reviewOnly !== true || stored.sourceFiles?.[0] !== "source/unit-1.docx" || stored.teacherAnswerFiles?.[0] !== "teacher/answers/unit-1-answers.pdf" || stored.targetLanguage !== "ja" || JSON.stringify(stored.supportLanguages) !== JSON.stringify(["en", "es"]) || stored.mediaRequests.length !== 6 || stored.evidenceRequests.length !== 3 || stored.deliveryMode !== "closed-local" || stored.hostedPersistenceOptIn !== false) fail("self-test did not preserve the review-only pilot brief, teacher answer-key lane, explicit source type, language choices, or delivery mode.");
  const unsafePath = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--root", join(root, "unsafe-path"), "--tenant-id", "self-test", "--publisher-name", "Example Publisher", "--book-title", "Example Book", "--unit-key", "example:book:L1:U1", "--source-file", "source/../outside.pdf"], { encoding: "utf8" });
  if (unsafePath.status === 0 || !unsafePath.stderr.includes("Unsafe textbook source path")) fail("self-test allowed a source path traversal");
  const unsupportedType = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--root", join(root, "unsupported-type"), "--tenant-id", "self-test", "--publisher-name", "Example Publisher", "--book-title", "Example Book", "--unit-key", "example:book:L1:U1", "--source-file", "source/unit-1.exe"], { encoding: "utf8" });
  if (unsupportedType.status === 0 || !unsupportedType.stderr.includes("Unsupported textbook source extension")) fail("self-test allowed an unsupported source extension");
  const invalidLanguage = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--root", join(root, "invalid-language"), "--tenant-id", "self-test", "--publisher-name", "Example Publisher", "--book-title", "Example Book", "--unit-key", "example:book:L1:U1", "--support-languages", "ja,en us"], { encoding: "utf8" });
  if (invalidLanguage.status === 0 || !invalidLanguage.stderr.includes("Unsupported support-language id")) fail("self-test allowed an unsafe support-language id");
  const hosted = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--root", join(root, "hosted"), "--tenant-id", "self-test", "--publisher-name", "Example Publisher", "--book-title", "Example Book", "--unit-key", "example:book:L1:U1", "--delivery-mode", "hosted-pwa", "--hosted-persistence-opt-in"], { encoding: "utf8" });
  if (hosted.status !== 0 || !JSON.parse(await readFile(join(root, "hosted", "publisher-pilot-intake.json"), "utf8")).hostedPersistenceOptIn) fail("self-test did not preserve explicit hosted persistence opt-in");
  const invalidDelivery = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--root", join(root, "invalid-delivery"), "--tenant-id", "self-test", "--publisher-name", "Example Publisher", "--book-title", "Example Book", "--unit-key", "example:book:L1:U1", "--delivery-mode", "closed-local", "--hosted-persistence-opt-in"], { encoding: "utf8" });
  if (invalidDelivery.status === 0 || !invalidDelivery.stderr.includes("closed-local delivery cannot opt in")) fail("self-test allowed hosted opt-in for closed-local delivery");
  await rm(root, { recursive: true, force: true });
  console.log("PASS publisher pilot intake kit creates a safe review-only brief, supports explicit source formats and optional support languages, and rejects unsafe inputs.");
}

function fail(message) { console.error(`ERROR ${message}`); process.exit(2); }
