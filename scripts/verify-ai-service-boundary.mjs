import { readFileSync } from "node:fs";

const service = readSource("../apps/ai-service/src/index.ts");
const packageFile = readSource("../apps/ai-service/package.json");
const readme = readSource("../apps/ai-service/README.md");
const failures = [];

for (const marker of [
  "AiGenerationServiceRequest",
  "validateAiGenerationServiceRequest",
  "prepareReviewOnlyAiGenerationRequest",
  "vocabularyTerms must contain between 8 and 12 terms",
  "targetSentences must contain exactly 2 structures",
  "target-language audio coverage is required",
  "media rights evidence is required",
  "No provider model call",
  "No generated package write",
  "No support-language progression",
  'status: "review-only"',
  "providerDispatchAllowed: false",
]) {
  if (!service.includes(marker)) failures.push(`AI service contract missing marker: ${marker}`);
}

for (const marker of ['"name": "@living-textbook/ai-service"', '"typecheck": "tsc -p tsconfig.json --noEmit"']) {
  if (!packageFile.includes(marker)) failures.push(`AI service package missing marker: ${marker}`);
}

for (const marker of ["Provider-neutral backend boundary", "does not call a model", "Target-language content remains the only progression authority"]) {
  if (!readme.includes(marker)) failures.push(`AI service README missing marker: ${marker}`);
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS AI service boundary keeps review-only generation, pedagogical locks, and blocked live actions explicit.");

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}
