import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const plan = readSource("../apps/web/src/data/sampleTargetLanguageExpansionPlan.ts");
const panel = readSource("../apps/web/src/features/language/TargetLanguageExpansionPanel.tsx");
const progressionAdapter = readSource("../apps/web/src/features/progression/localProgressionAdapter.ts");
const routeVerifier = readSource("./verify-active-routes.mjs");
const assistStandard = readSource("../docs/ASSIST_LANGUAGE_STANDARD.md");
const futureRequirements = readSource("../docs/FUTURE_REQUIREMENTS.md");
const contentModel = readSource("../packages/content-model/src/index.ts");
const teacherMonitor = readSource("../apps/web/src/features/teacher/TeacherSessionMonitorPanel.tsx");
const targetPolicy = readSource("../packages/content-model/src/targetLanguagePolicy.ts");
const japaneseTenant = readSource("../apps/web/src/features/tenant/sampleJapaneseTenant.ts");
const japaneseTenantPreview = readSource("../apps/web/src/data/sampleTargetLanguageTenantPreview.ts");
const japaneseTenantPreviewPanel = readSource("../apps/web/src/features/language/TargetLanguageTenantPreviewPanel.tsx");
const intakePage = readSource("../apps/web/src/app/teacher/intake/page.tsx");
const failures = [];

const requiredLanes = [
  ["target-language-config", "planned"],
  ["japanese-script-policy", "planned"],
  ["segmentation-policy", "blocked"],
  ["audio-pronunciation", "planned"],
  ["typing-input", "planned"],
  ["handwriting-stroke-order", "optional"],
];

const requiredGates = [
  "assist-target-separation",
  "target-language-trigger",
  "furigana-rendering",
  "segmentation-engine",
  "teacher-review",
];

for (const [laneId, status] of requiredLanes) {
  requireLaneStatus(laneId, status);
}

for (const gateId of requiredGates) {
  requireText(plan, `gateId: "${gateId}"`, `Target-language gate missing: ${gateId}`);
}

requireText(plan, "Assist language is not target language", "Plan must keep assist language separate from target language.");
requireText(plan, "Japanese as target language", "Plan must name Japanese as target-language opportunity.");
requireText(plan, "English remains the progression trigger", "MiniStar English must keep English as progression trigger.");
requireText(plan, "Japanese becomes the target-language trigger", "Japanese tenant must use Japanese as target-language trigger.");
requireText(plan, "Furigana", "Plan must include furigana/ruby readiness.");
requireText(plan, "Segmentation policy", "Plan must include segmentation policy.");
requireText(plan, "Kana and kanji input", "Plan must include kana/kanji input readiness.");
requireText(plan, "Japanese audio cues", "Plan must include Japanese audio readiness.");
requireText(panel, "Target language expansion", "Panel must expose target-language expansion heading.");
requireText(panel, "Blocks Japanese target-language pilot", "Panel must show pilot blockers.");
requireText(routeVerifier, "Target language expansion", "Active route verifier must check target-language panel.");
requireText(routeVerifier, "Assist language is not target language", "Active route verifier must check assist/target separation.");
requireText(assistStandard, "Do not treat MiniStar Japanese assist copy as proof", "Assist standard must preserve target-language boundary.");
requireText(futureRequirements, "Japanese As Target Language For White-Label Tenants", "Future requirements must preserve Japanese target-language opportunity.");
requireText(progressionAdapter, "targetLanguageGateSatisfied", "Progression adapter must independently enforce the target-language gate.");
requireText(progressionAdapter, 'blockedReason: "target-language-gate"', "Progression adapter must expose a deterministic blocked gate result.");
requireText(progressionAdapter, "args.targetLanguageEngagedItems >= args.requiredTargetLanguageItems", "Progression adapter must compare target-language evidence with the required count.");
requireText(contentModel, "export function resolveTargetLanguage", "Content model must own the shared target-language resolver.");
requireText(contentModel, "tenantTargetLanguage, unitLanguage, fallback", "Target-language resolver must declare tenant, unit, and fallback precedence inputs.");
requireText(contentModel, "[tenantTargetLanguage, unitLanguage, fallback]", "Target-language resolver must prefer tenant language, then unit language, then baseline.");
requireText(teacherMonitor, "context.tenant.languageSettings?.targetLanguage", "Teacher monitor must resolve tenant target language for evidence display.");
requireText(teacherMonitor, "event.metadata?.language ?? targetLanguage", "Teacher monitor must not hard-code English for missing event language.");
requireText(targetPolicy, "supportLanguageProgressAllowed: false", "Target-language policy must disable support-language progress.");
requireText(targetPolicy, "segmentationPolicy", "Target-language policy must declare language-aware segmentation.");
requireText(targetPolicy, "targetLanguageAudioRequired", "Target-language policy must require target-language audio.");
requireText(japaneseTenant, 'targetLanguage: "ja"', "Japanese target tenant fixture must configure Japanese as the target language.");
requireText(japaneseTenant, 'segmentationPolicy: "japanese-aware"', "Japanese target tenant must use Japanese-aware segmentation.");
requireText(japaneseTenantPreview, "sampleJapaneseTargetTenantPreview", "Japanese target tenant preview must exist.");
requireText(japaneseTenantPreview, 'status: "blocked"', "Japanese target tenant preview must remain blocked.");
requireText(japaneseTenantPreview, 'registryStatus: "not-registered"', "Japanese target tenant route must remain unregistered.");
requireText(japaneseTenantPreview, 'packageStatus: "not-created"', "Japanese target tenant package must remain uncreated.");
requireText(japaneseTenantPreview, "English support cannot unlock progress", "Japanese preview must preserve target-language-only progression.");
requireText(japaneseTenantPreviewPanel, "White-label tenant preview", "Teacher intake must expose the target tenant preview.");
requireText(japaneseTenantPreviewPanel, "Student route blocked", "Target tenant preview must visibly block the student route.");
requireText(intakePage, "TargetLanguageTenantPreviewPanel", "Teacher intake must render the target tenant preview panel.");

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }

  process.exit(1);
}

const policyCheck = spawnSync(
  process.execPath,
  [fileURLToPath(new URL("./verify-target-language-policy.mjs", import.meta.url))],
  { encoding: "utf8" },
);

if (policyCheck.status !== 0) {
  process.stdout.write(policyCheck.stdout ?? "");
  process.stderr.write(policyCheck.stderr ?? "");
  process.exit(policyCheck.status ?? 1);
}

console.log(
  `PASS target-language readiness covers ${requiredLanes.length} expansion lane(s) and ${requiredGates.length} target-language gate(s).`,
);

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function requireText(source, text, message) {
  if (!source.includes(text)) {
    failures.push(message);
  }
}

function requireLaneStatus(laneId, status) {
  const escaped = laneId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`laneId:\\s*"${escaped}"[\\s\\S]*?status:\\s*"${status}"`, "m");

  if (!pattern.test(plan)) {
    failures.push(`Target-language lane ${laneId} must have status ${status}.`);
  }
}
