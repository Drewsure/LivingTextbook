import { readFileSync } from "node:fs";

const requiredGameModes = ["flashcards", "match-up", "label-it", "memory-match", "balloon-pop", "quiz", "true-false", "type-answer", "spelling-practice", "fill-in-the-blank", "sentence-builder", "speak-it"];
const requiredReadinessGates = [
  "content-review",
  "payload-validation",
  "audio-support",
  "media-assets",
  "route-and-games",
  "assist-language",
  "teacher-release",
];
const packageFiles = [
  {
    label: "MiniStar sample package",
    path: "../apps/web/src/data/sampleMultimediaPackage.ts",
    readinessMarker: "buildUnitPackageReadiness(sampleMultimediaContentPackage)",
    activePaths: [
      "/enter/ministar",
      "/launch/demo-unit-1",
      "/activities/demo-unit-1",
      "/flashcards/demo-unit-1",
      "/training/demo-unit-1",
      "/memory/demo-unit-1",
      "/match/demo-unit-1",
      "/label-it/demo-unit-1",
      "/balloon/demo-unit-1",
      "/quiz/demo-unit-1",
      "/true-false/demo-unit-1",
      "/type-answer/demo-unit-1",
      "/spelling/demo-unit-1",
      "/fill/demo-unit-1",
      "/sentence/demo-unit-1",
      "/speak/demo-unit-1",
      "/media/playlist-ministar-l1-u1-greetings",
      "/teacher/sessions/demo-unit-1",
      "/teacher/sessions/demo-unit-1/report-package",
    ],
  },
  {
    label: "Sample publisher package",
    path: "../apps/web/src/data/samplePartnerPackage.ts",
    readinessMarker: "buildUnitPackageReadiness(samplePartnerContentPackage)",
    activePaths: [
      "/enter/sample-publisher",
      "/launch/partner-demo-unit-1",
      "/activities/partner-demo-unit-1",
      "/flashcards/partner-demo-unit-1",
      "/training/partner-demo-unit-1",
      "/memory/partner-demo-unit-1",
      "/match/partner-demo-unit-1",
      "/label-it/partner-demo-unit-1",
      "/balloon/partner-demo-unit-1",
      "/quiz/partner-demo-unit-1",
      "/true-false/partner-demo-unit-1",
      "/type-answer/partner-demo-unit-1",
      "/spelling/partner-demo-unit-1",
      "/fill/partner-demo-unit-1",
      "/sentence/partner-demo-unit-1",
      "/speak/partner-demo-unit-1",
      "/media/playlist-sample-publisher-l1-u1-routines",
      "/teacher/sessions/partner-demo-unit-1",
      "/teacher/sessions/partner-demo-unit-1/report-package",
    ],
  },
];

const readiness = readSource("../apps/web/src/data/sampleUnitPackageReadiness.ts");
const offerMap = readSource("../apps/web/src/data/sampleUnitGameOfferMap.ts");
const contentModel = readSource("../packages/content-model/src/index.ts");
const activeRoutes = readSource("../docs/ACTIVE_ROUTE_VERIFICATION_LIST.md");
const failures = [];

for (const gateId of requiredReadinessGates) {
  requireText(readiness, `gateId: "${gateId}"`, `Package readiness gate missing: ${gateId}`);
}

requireText(readiness, "audioCoveredGameModes", "Package readiness summary must expose audio-covered game modes.");
requireText(contentModel, "duplicate unit", "Content model must reject duplicate units inside a content package.");
requireText(contentModel, "content package tenant", "Content model must reject cross-tenant package references.");
requireText(contentModel, "missing media asset", "Content model must reject orphan media references.");
requireText(contentModel, "from another unit", "Content model must reject cross-unit playlist media references.");
requireText(contentModel, "same unit", "Content model must keep multimedia bindings within the same unit.");
requireText(contentModel, "AssistLanguageScriptPolicy", "Content model must expose assist-language script policy.");
requireText(contentModel, "levelBand", "Content model must expose assist-language level-band policy.");
requireText(contentModel, "hiragana-only", "Content model must enforce early-level hiragana-only support.");
requireText(contentModel, "reviewed-mixed-script", "Content model must gate later mixed-script support behind review.");
requireText(
  readiness,
  "Support language remains optional comprehension support and never unlocks target-language progression.",
  "Package readiness must preserve support-language-as-support-only rule.",
);

for (const mode of requiredGameModes) {
  requireText(offerMap, `gameMode: "${mode}"`, `Unit game offer map missing active game mode: ${mode}`);
}

requireText(offerMap, "sampleMinistarUnitGameOfferMap", "Unit game offer map must include the MiniStar flagship tenant map.");
requireText(offerMap, "samplePartnerUnitGameOfferMap", "Unit game offer map must include the sample publisher tenant map.");
requireText(offerMap, "sampleUnitGameOfferMaps", "Unit game offer maps must be exported as a multi-tenant list.");
requireText(offerMap, "reportingRequirement", "Unit game offer map entries must declare reporting requirements.");
requireText(
  offerMap,
  "support-language listens remain report-only",
  "Unit game offer map reporting must preserve support-language report-only status.",
);
requireText(
  offerMap,
  "without storing raw audio or transcripts",
  "Speak It reporting must block raw audio and transcript storage in the offer map.",
);
requireText(
  offerMap,
  "ministar-l1-u1-greetings-package",
  "Unit game offer map must preserve the MiniStar package binding.",
);
requireText(
  offerMap,
  "sample-publisher-l1-u1-routines-package",
  "Unit game offer map must preserve the sample publisher package binding.",
);
requireText(
  offerMap,
  "Support language does not unlock progress",
  "Unit game offer map must preserve target-language progress trigger.",
);
requireText(
  offerMap,
  "Japanese/support-language-only completion",
  "Unit game offer map must explicitly block support-language-only completion.",
);

for (const packageFile of packageFiles) {
  const source = readSource(packageFile.path);

  requireText(readiness, packageFile.readinessMarker, `${packageFile.label} is not included in package readiness summaries.`);
  requireText(source, 'reviewStatus: "reviewed"', `${packageFile.label} must remain human-reviewed before pilot use.`);
  requireText(source, 'kind: "audio"', `${packageFile.label} must include at least one audio media asset.`);
  requireText(source, 'kind: "video"', `${packageFile.label} must include at least one video media asset.`);
  requireText(source, "localBundlePath:", `${packageFile.label} media assets must include local bundle paths.`);
  requireText(source, "playlists:", `${packageFile.label} must include a unit-linked playlist.`);
  requireText(source, "multimediaPlans:", `${packageFile.label} must include a multimedia plan.`);
  requireText(source, "backgroundEnabledByDefault: false", `${packageFile.label} background media must default off.`);
  requireText(source, "requiresTeacherEnablement: true", `${packageFile.label} background media must be teacher-gated.`);
  requireText(source, "entryCodeRequired: true", `${packageFile.label} front door must require an entry code.`);
  requireText(source, "userCodeRequired: true", `${packageFile.label} front door must require a learner/user code.`);
  requireText(source, "reportProgressToTeacher: true", `${packageFile.label} front door must support teacher reporting.`);
  requireText(source, "allowAnonymousPractice: false", `${packageFile.label} must not allow anonymous pilot progress.`);
  requireText(source, 'targetType: "front-door"', `${packageFile.label} permanent QR must target the front door.`);
  requireText(source, "fallbackPath:", `${packageFile.label} permanent QR must include a fallback path.`);
  requireText(source, "audioSupportPlans:", `${packageFile.label} must include an audio support plan.`);
  if (packageFile.label === "MiniStar sample package") {
    requireText(source, 'scriptPolicy: "hiragana-only"', "MiniStar Japanese assist must declare hiragana-only script policy.");
    requireText(source, 'levelBand: "foundation"', "MiniStar Japanese assist must declare its early curriculum level band.");
  }
  requireText(source, "required: true", `${packageFile.label} audio support plan must be required.`);
  requireText(source, "aiTutorPlans:", `${packageFile.label} must explicitly declare AI Tutor policy.`);
  requireText(source, "enabled: false", `${packageFile.label} AI Tutor must default off.`);
  requireText(source, 'entitlementRequired: "premium"', `${packageFile.label} AI Tutor must stay a premium entitlement.`);
  requireText(source, "minimumLevel: 6", `${packageFile.label} AI Tutor must stay upper-level by default.`);

  if (source.includes('rightsStatus: "unknown"')) {
    failures.push(`${packageFile.label} has unknown media rights status.`);
  }

  for (const mode of requiredGameModes) {
    if (!hasGameModeAudioCue(source, mode)) {
      failures.push(`${packageFile.label} audio support plan missing game mode cue coverage: ${mode}`);
    }
  }

  for (const path of packageFile.activePaths) {
    requireText(activeRoutes, `http://127.0.0.1:3000${path}`, `${packageFile.label} active route list missing: ${path}`);
  }
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }

  process.exit(1);
}

console.log(
  `PASS package readiness covers ${packageFiles.length} sample package(s), ${requiredGameModes.length} active game mode(s), and ${requiredReadinessGates.length} readiness gate(s).`,
);

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function requireText(source, text, message) {
  if (!source.includes(text)) {
    failures.push(message);
  }
}

function hasGameModeAudioCue(source, mode) {
  const escaped = mode.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const keyPattern = mode.includes("-") ? `"${escaped}"` : `(?:"${escaped}"|${escaped})`;

  return new RegExp(`${keyPattern}:\\s*\\[`, "m").test(source);
}
