import { createRequire } from "node:module";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-ai-service-"));
const failures = [];

try {
  writeFileSync(join(output, "package.json"), '{"type":"commonjs"}\n', "utf8");
  const tsc = join(root, "node_modules", "typescript", "bin", "tsc");
  const compile = spawnSync(process.execPath, [
    tsc,
    "--module", "commonjs",
    "--target", "ES2022",
    "--moduleResolution", "node",
    "--resolveJsonModule",
    "--esModuleInterop",
    "--skipLibCheck",
    "--rootDir", root,
    "--outDir", output,
    "apps/ai-service/src/index.ts",
    "packages/content-model/src/index.ts",
  ], { cwd: root, encoding: "utf8" });

  if (compile.status !== 0) {
    process.stdout.write(compile.stdout);
    process.stderr.write(compile.stderr);
    process.exit(1);
  }

  const packageDir = join(output, "node_modules", "@living-textbook", "content-model");
  mkdirSync(packageDir, { recursive: true });
  writeFileSync(join(packageDir, "package.json"), JSON.stringify({
    name: "@living-textbook/content-model",
    main: "../../../packages/content-model/src/index.js",
    type: "commonjs",
  }), "utf8");

  const service = require(join(output, "apps", "ai-service", "src", "index.js"));
  const validRequest = {
    requestId: "request-1",
    tenantId: "tenant-1",
    contentPackageId: "package-1",
    sourceReviewStatus: "reviewed",
    targetLanguage: "en",
    assistLanguage: "ja",
    level: 1,
    theme: "Greetings",
    gameMode: "flashcards",
    engineId: "selection",
    vocabularyTerms: ["hello", "goodbye", "teacher", "friend", "morning", "afternoon", "please", "thank you"],
    targetSentences: ["Hello, teacher.", "Thank you, friend."],
    sourceEvidencePacketId: "source-evidence-1",
    activityCompatibilitySnapshotId: "compatibility-1",
    audioCoverageRequirementId: "audio-1",
    mediaRightsManifestId: "rights-1",
    premiumAiCostGateId: "cost-1",
    supportLanguagePolicy: { progressionAllowed: false },
    audioCoverageTargetLanguage: "en",
    targetLanguageAudioReady: true,
    mediaRightsReady: true,
    teacherApprovalReady: false,
    premiumCostPolicyReady: false,
  };

  assert(service.validateAiGenerationServiceRequest(validRequest).length === 0, "valid reviewed request must pass validation");
  assert(service.validateAiGenerationServiceRequest(null).includes("request must be an object"), "null request must fail closed");

  const malformed = service.validateAiGenerationServiceRequest({
    ...validRequest,
    assistLanguage: "en",
    vocabularyTerms: ["hello", "hello", "teacher"],
    targetSentences: ["Hello, teacher."],
    supportLanguagePolicy: { progressionAllowed: true },
    targetLanguageAudioReady: "true",
  });
  assert(malformed.some((error) => error.includes("assistLanguage must differ")), "same target and assist language must be rejected");
  assert(malformed.some((error) => error.includes("between 8 and 12")), "short vocabulary must be rejected");
  assert(malformed.some((error) => error.includes("exactly 2")), "incorrect sentence count must be rejected");
  assert(malformed.some((error) => error.includes("progressionAllowed must be false")), "support-language progression must be rejected");
  assert(malformed.some((error) => error.includes("targetLanguageAudioReady must be a boolean")), "string readiness flags must be rejected");
  assert(malformed.some((error) => error.includes("Vocabulary terms must be unique")), "duplicate vocabulary must be rejected");

  const prepared = service.prepareReviewOnlyAiGenerationRequest(validRequest);
  assert(prepared.status === "review-only", "prepared AI request must remain review-only");
  assert(prepared.providerDispatchAllowed === false, "provider dispatch must remain blocked");
  assert(prepared.blockedActions.includes("No provider model call"), "provider model call must remain blocked");
  assert(prepared.reviewWarnings.some((warning) => warning.includes("Teacher approval")), "missing teacher approval must remain visible");
  assert(prepared.reviewWarnings.some((warning) => warning.includes("Premium AI cost policy")), "missing premium cost policy must remain visible");
} finally {
  rmSync(output, { recursive: true, force: true });
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exitCode = 1;
} else {
  console.log("PASS AI service runtime validation preserves pedagogical, language, evidence, cost, and no-dispatch boundaries.");
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}
