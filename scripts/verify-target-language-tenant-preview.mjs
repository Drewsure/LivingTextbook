import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataFile = path.join(root, "apps/web/src/data/sampleTargetLanguageTenantPreview.ts");
const panelFile = path.join(root, "apps/web/src/features/language/TargetLanguageTenantPreviewPanel.tsx");
const intakeFile = path.join(root, "apps/web/src/app/teacher/intake/page.tsx");

for (const file of [dataFile, panelFile, intakeFile]) {
  if (!fs.existsSync(file)) throw new Error(`Missing target-language tenant preview file: ${file}`);
}

const data = fs.readFileSync(dataFile, "utf8");
const panel = fs.readFileSync(panelFile, "utf8");
const intake = fs.readFileSync(intakeFile, "utf8");

const required = [
  [data, "sampleJapaneseTargetTenantPreview", "Japanese target tenant preview data must exist."],
  [data, 'status: "blocked"', "Japanese student activation must remain blocked."],
  [data, 'registryStatus: "not-registered"', "Japanese route registration must remain explicit and inactive."],
  [data, 'packageStatus: "not-created"', "Japanese package creation must remain explicit and inactive."],
  [data, "Target-language audio approval", "Japanese audio approval must be a visible gate."],
  [data, "Language-aware segmentation", "Japanese segmentation must be a visible gate."],
  [data, "English support cannot unlock progress", "Support language must not trigger progress."],
  [panel, "White-label tenant preview", "Teacher intake must label the preview as white-label evidence."],
  [panel, "Student route blocked", "The preview must visibly block student activation."],
  [panel, "Progression rule", "The preview must expose the progression boundary."],
  [panel, "Blocked until evidence is approved", "The preview must expose blocked actions."],
  [intake, "TargetLanguageTenantPreviewPanel", "Teacher intake must render the tenant preview panel."],
  [intake, "sampleJapaneseTargetTenantPreview", "Teacher intake must bind the Japanese preview data."],
];

const failures = required.filter(([source, marker]) => !source.includes(marker));
if (failures.length > 0) {
  throw new Error(failures.map(([, marker, message]) => `${message} Missing: ${marker}`).join("\n"));
}

console.log("PASS Japanese target-language tenant preview is explicit, review-only, and blocked from student activation.");
