import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import ts from "typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const output = mkdtempSync(join(tmpdir(), "living-textbook-pilot-adapter-"));
const briefPath = join(root, "packages", "content-model", "src", "publisherPilotIntakeBrief.ts");
const manifestPath = join(root, "packages", "content-model", "src", "publisherSubmissionManifest.ts");
const adapterPath = join(root, "packages", "content-model", "src", "publisherPilotSubmissionAdapter.ts");

const compile = (sourcePath) => ts.transpileModule(readFileSync(sourcePath, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
writeFileSync(join(output, "publisherPilotIntakeBrief.js"), compile(briefPath), "utf8");
writeFileSync(join(output, "publisherSubmissionManifest.js"), compile(manifestPath), "utf8");
writeFileSync(join(output, "publisherPilotSubmissionAdapter.js"), compile(adapterPath), "utf8");

try {
  const model = createRequire(import.meta.url)(join(output, "publisherPilotSubmissionAdapter.js"));
  const brief = {
    recordVersion: 1,
    briefId: "brief-a",
    tenantId: "tenant-a",
    publisherName: "Publisher A",
    seriesName: "Series A",
    bookTitle: "Book A",
    edition: "2026",
    version: "1.0.0",
    targetLanguage: "en",
    supportLanguages: ["ja"],
    unitKey: "tenant-a:book:L1:U1",
    sourceOwner: "Publisher A",
    sourceFiles: ["source/unit-1.pdf"],
    teacherAnswerFiles: ["teacher/answers/unit-1-answers.pdf"],
    mediaRequests: [{ kind: "audio", relativePath: "media/audio/unit-1.mp3", unitKey: "tenant-a:book:L1:U1", required: true, purpose: "Learning audio" }],
    evidenceRequests: [
      { referenceId: "rights", kind: "rights", relativePath: "evidence/rights.md", appliesTo: ["source/unit-1.pdf"], required: true },
      { referenceId: "accessibility", kind: "accessibility", relativePath: "evidence/accessibility.md", appliesTo: ["media/audio/unit-1.mp3"], required: true },
      { referenceId: "scan", kind: "scan", relativePath: "evidence/scan.json", appliesTo: ["source/unit-1.pdf"], required: true },
    ],
    deliveryMode: "hybrid",
    hostedPersistenceOptIn: false,
    qrPageReferences: ["page-1"],
    qrReferences: [{ referenceId: "unit-1-entry", pageReference: "page-1", unitId: "unit-1", activitySlug: "unit-1-entry", targetType: "unit-launch", language: "en" }],
    retentionPolicy: "School policy",
    reportingPolicy: "Teacher reports",
    reviewOnly: true,
    packageAssemblyAllowed: false,
    studentFacingUseAllowed: false,
  };
  const manifest = model.createPublisherSubmissionManifestFromPilotIntake(brief, "package-a");
  if (manifest.assets.length !== 8) failures.push("adapter must preserve canonical review lanes and the optional teacher answer-key lane");
  const teacherAnswerAsset = manifest.assets.find((asset) => asset.kind === "teacher-answer-key");
  if (teacherAnswerAsset?.teacherOnly !== true || teacherAnswerAsset?.required !== true) failures.push("teacher answer-key source must remain a required teacher-only asset");
  if (teacherAnswerAsset?.acceptedTypes.includes("pdf") !== true) failures.push("teacher answer-key source must accept the supplied PDF format");
  if (manifest.assets.some((asset) => asset.kind !== "teacher-answer-key" && asset.teacherOnly === true)) failures.push("student-facing asset lanes must never be marked teacher-only");
  if (manifest.assets.find((asset) => asset.kind === "audio")?.required !== true) failures.push("declared required audio must remain required");
  if (manifest.assets.find((asset) => asset.kind === "video")?.label.includes("not declared") !== true) failures.push("undeclared optional video must remain visible as a decision gate");
  if (manifest.evidenceRequests.length !== 3) failures.push("adapter must carry every structured intake evidence request");
  if (manifest.evidenceRequests[0]?.appliesToAssetIds[0] !== manifest.assets.find((asset) => asset.kind === "textbook-source")?.assetId) failures.push("evidence coverage must resolve to canonical manifest asset ids");
  if (manifest.evidenceRequests[0]?.status !== "missing") failures.push("evidence status must remain review-pending at intake");
  if (manifest.reviewOnly !== true || manifest.filePromotionAllowed !== false || manifest.studentFacingUseAllowed !== false) failures.push("adapter must preserve blocked safety flags");
  const teacherRightsEvidence = { ...brief.evidenceRequests[0], appliesTo: ["teacher/answers/unit-1-answers.pdf"] };
  const teacherBrief = { ...brief, evidenceRequests: [teacherRightsEvidence, ...brief.evidenceRequests.slice(1)] };
  const teacherManifest = model.createPublisherSubmissionManifestFromPilotIntake(teacherBrief, "package-teacher-a");
  if (teacherManifest.evidenceRequests[0]?.appliesToAssetIds[0] !== teacherAnswerAsset?.assetId) failures.push("teacher answer-key evidence must resolve to the teacher-only asset id");
  const invalidTeacher = { ...brief, teacherAnswerFiles: ["source/answers.pdf"] };
  try {
    model.createPublisherSubmissionManifestFromPilotIntake(invalidTeacher, "package-a");
    failures.push("teacher answer-key paths outside teacher/answers must block manifest preview");
  } catch {
    // Expected fail-closed behavior.
  }
  const invalid = { ...brief, edition: "REPLACE_WITH_EDITION" };
  try {
    model.createPublisherSubmissionManifestFromPilotIntake(invalid, "package-a");
    failures.push("unresolved placeholders must block manifest preview");
  } catch {
    // Expected fail-closed behavior.
  }
} finally {
  rmSync(output, { recursive: true, force: true });
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}
console.log("PASS publisher pilot intake maps to canonical review lanes plus a teacher-only answer-key lane with evidence traceability without promoting files or hiding omitted media decisions.");
