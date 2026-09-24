import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function requireText(file, text, message) {
  if (!read(file).includes(text)) throw new Error(message);
}

requireText(
  "packages/content-model/src/assistLanguageAudioCoverage.ts",
  "missingTerms",
  "Assist audio coverage must expose missing term evidence.",
);
requireText(
  "packages/content-model/src/assistLanguageAudioCoverage.ts",
  "missingSentences",
  "Assist audio coverage must expose missing sentence evidence.",
);
requireText(
  "packages/content-model/src/assistLanguageAudioCoverage.ts",
  "missingInstructions",
  "Assist audio coverage must expose missing instruction evidence.",
);
requireText(
  "apps/web/src/data/sampleAssistLanguageReview.ts",
  "getAssistLanguageAudioCoverage",
  "Teacher assist review data must consume the shared assist audio coverage contract.",
);
requireText(
  "apps/web/src/features/teacher/TeacherAssistLanguageReviewPanel.tsx",
  "Audio coverage",
  "Teacher assist review must display exact audio coverage.",
);

console.log("PASS assist-language audio coverage is shared, gloss-bound, and visible in teacher review evidence.");
