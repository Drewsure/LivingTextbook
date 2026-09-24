import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function requireText(file, text, message) {
  if (!read(file).includes(text)) {
    throw new Error(message);
  }
}

requireText(
  "apps/web/src/data/sampleAssistLanguageReview.ts",
  "No support-language progression trigger",
  "Assist review packet must show that support language cannot trigger progression.",
);
requireText(
  "apps/web/src/features/teacher/TeacherAssistLanguageReviewPanel.tsx",
  "No approval control is presented here",
  "Assist review panel must remain review-only.",
);
requireText(
  "apps/web/src/features/teacher/TeacherAssistLanguageReviewPanel.tsx",
  "Assist audio cues",
  "Assist review panel must expose assist-language audio coverage.",
);
requireText(
  "apps/web/src/data/sampleMultimediaPackage.ts",
  'scriptPolicy: "hiragana-only"',
  "MiniStar assist review fixture must preserve hiragana-only early-level policy.",
);
requireText(
  "apps/web/src/data/sampleAssistLanguageReview.ts",
  "allowLiveAiFallback",
  "Assist review fixture must expose live AI fallback policy.",
);
requireText(
  "apps/web/src/app/teacher/intake/page.tsx",
  "TeacherAssistLanguageReviewPanel",
  "Teacher intake must expose the assist-language review packet.",
);

console.log("PASS assist-language review packet remains support-only, script-aware, audio-visible, and review-only.");
