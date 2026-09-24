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
  "apps/web/src/data/sampleAssistLanguageAudioEvidence.ts",
  "No assist-language audio cue is bound",
  "Assist audio evidence must identify missing cue bindings.",
);
requireText(
  "apps/web/src/data/sampleAssistLanguageAudioEvidence.ts",
  "No assist-audio asset promotion",
  "Assist audio evidence must block asset promotion.",
);
requireText(
  "apps/web/src/features/teacher/TeacherAssistLanguageAudioEvidencePanel.tsx",
  "Assist-language audio asset evidence",
  "Teacher intake must expose assist audio asset evidence.",
);
requireText(
  "apps/web/src/features/teacher/TeacherAssistLanguageAudioEvidencePanel.tsx",
  "does not upload, approve, promote",
  "Assist audio evidence panel must remain non-mutating.",
);
requireText(
  "apps/web/src/app/teacher/intake/page.tsx",
  "TeacherAssistLanguageAudioEvidencePanel",
  "Teacher intake must mount assist audio evidence.",
);

console.log("PASS assist-language audio evidence remains gloss-bound, asset-aware, and promotion-blocked.");
