import { readFileSync } from "node:fs";

const plan = readSource("../apps/web/src/data/sampleAiGameGeneratorPlan.ts");
const engineBindingPlan = readSource("../apps/web/src/data/sampleAiEngineBindingPlan.ts");
const promptPackagePlan = readSource("../apps/web/src/data/sampleAiPromptPackagePlan.ts");
const requestBuilderData = readSource("../apps/web/src/data/sampleAiGenerationRequestBuilder.ts");
const audioCoveragePlan = readSource("../apps/web/src/data/sampleAiGeneratorAudioCoveragePlan.ts");
const gamificationMappingPlan = readSource("../apps/web/src/data/sampleAiGamificationMappingPlan.ts");
const draftPreviewData = readSource("../apps/web/src/data/sampleAiGeneratedDraftPayloadPreview.ts");
const compatibilityMatrix = readSource("../apps/web/src/data/sampleActivityPathwayCompatibility.ts");
const panel = readSource("../apps/web/src/features/content-intake/AiGameGeneratorPlanPanel.tsx");
const engineBindingPanel = readSource("../apps/web/src/features/content-intake/AiEngineBindingPlanPanel.tsx");
const promptPackagePanel = readSource("../apps/web/src/features/content-intake/AiPromptPackagePlanPanel.tsx");
const requestBuilderPanel = readSource("../apps/web/src/features/content-intake/AiGenerationRequestBuilderPanel.tsx");
const audioCoveragePanel = readSource("../apps/web/src/features/content-intake/AiGeneratorAudioCoveragePlanPanel.tsx");
const gamificationMappingPanel = readSource("../apps/web/src/features/content-intake/AiGamificationMappingPanel.tsx");
const draftPreviewPanel = readSource("../apps/web/src/features/content-intake/AiGeneratedDraftPayloadPreviewPanel.tsx");
const modeRecommendationPanel = readSource("../apps/web/src/features/content-intake/AiModeRecommendationPanel.tsx");
const route = readSource("../apps/web/src/app/teacher/generator/[tenantId]/page.tsx");
const teacherIntake = readSource("../apps/web/src/app/teacher/intake/page.tsx");
const routeContracts = readSource("../apps/web/src/features/routes/routeContracts.ts");
const partnerDemo = readSource("../apps/web/src/app/partner-demo/page.tsx");
const activeRouteMatrix = readSource("../apps/web/src/data/sampleActiveRouteMatrix.ts");
const activeRouteList = readSource("../docs/ACTIVE_ROUTE_VERIFICATION_LIST.md");
const routeVerifier = readSource("./verify-active-routes.mjs");
const principles = readSource("../docs/PRINCIPLES_AND_STANDARDS.md");
const handoff = readSource("../docs/AI_AUTHORING_VERIFIER_HANDOFF.md");
const checks = readSource("../docs/verification/AI_TEACHING_GAME_GENERATOR_CHECKS.md");
const packageJson = readSource("../package.json");
const failures = [];

const requiredRules = [
  "8 default vocabulary terms",
  "8-12 allowed terms",
  "Exactly 2 target sentence structures",
  "JSON-first draft package payload",
  "Curated activity pathway",
  "Every target-language text needs audio",
  "Support language cannot unlock progress",
  "Verifier packet required before package review",
];

const blockedActions = [
  "No direct AI publish",
  "No live model call",
  "No student assignment",
  "No unreviewed activity conversion",
  "No support-language-only progression",
  "No API cost without tenant approval",
];

const requiredRecords = [
  "teacher_draft_package",
  "teacher_draft_verifier_submission",
  "activity_compatibility_snapshot",
  "package_game_audio_coverage",
];

for (const rule of requiredRules) {
  requireText(plan, rule, `AI game generator plan missing required output rule: ${rule}.`);
  requireText(routeVerifier, rule, `Active route verifier must check generator output rule: ${rule}.`);
  requireText(checks, rule, `AI game generator checks must mention output rule: ${rule}.`);
}

for (const action of blockedActions) {
  requireText(plan, action, `AI game generator plan missing blocked action: ${action}.`);
  requireText(routeVerifier, action, `Active route verifier must check blocked generator action: ${action}.`);
}

for (const record of requiredRecords) {
  requireText(plan, record, `AI game generator plan missing draft record: ${record}.`);
  requireText(routeVerifier, record, `Active route verifier must check generator draft record: ${record}.`);
}

requireText(plan, "Sample publisher daily routines game draft", "Generator plan must include sample publisher request.");
requireText(plan, "MiniStar greetings entry-sequence draft", "Generator plan must include MiniStar request.");
requireText(plan, "Upper-level AI tutor role-play draft", "Generator plan must include upper-level premium AI Tutor request.");
requireText(plan, "API cost package gate: premium AI Tutor is optional", "Generator plan must preserve optional premium AI Tutor cost gate.");
requireText(plan, "No premium upsell shown to children", "Generator plan must block child-facing premium upsell.");
requireText(panel, "AI teaching game generator", "Generator panel must expose heading.");
requireText(panel, "Generator request preview", "Generator panel must expose request previews.");
requireText(panel, "API cost package gate", "Generator panel must expose API cost gate.");
requireText(panel, "Target-language audio rule", "Generator panel must expose target-language audio rule.");
requireText(panel, "Assist language policy", "Generator panel must expose assist-language policy.");
requireText(engineBindingPlan, "sampleAiEngineBindingPlans", "AI engine binding plan data must exist.");
requireText(engineBindingPlan, "ai_engine_binding_plan", "AI engine binding plan must name the binding record.");
requireText(engineBindingPlan, "game_mode_catalog_snapshot", "AI engine binding plan must name the game catalog snapshot.");
requireText(engineBindingPlan, "engine_mode_config_binding", "AI engine binding plan must name engine mode config binding.");
requireText(engineBindingPlan, "scoring_profile_binding", "AI engine binding plan must name scoring profile binding.");
requireText(engineBindingPlan, "standard_event_contract", "AI engine binding plan must name standard event contract.");
requireText(engineBindingPlan, "Generated game code blocked", "AI engine binding plan must block generated game code.");
requireText(engineBindingPlan, "Bypass parent engine blocked", "AI engine binding plan must block bypassing parent engines.");
requireText(engineBindingPlan, "Z.ai prototypes stay isolated until integration review", "AI engine binding plan must govern Z.ai prototype adoption.");
requireText(engineBindingPanel, "AI engine binding preview", "AI engine binding panel must expose heading.");
requireText(engineBindingPanel, "Use existing parent engines", "AI engine binding panel must expose existing parent engine rule.");
requireText(engineBindingPanel, "Game mode catalog binding", "AI engine binding panel must show catalog binding.");
requireText(engineBindingPanel, "No generated game code", "AI engine binding panel must block generated game code.");
requireText(engineBindingPanel, "Parent engine", "AI engine binding panel must show parent engine details.");
requireText(engineBindingPanel, "Scoring profile", "AI engine binding panel must show scoring profile details.");
requireText(promptPackagePlan, "sampleAiPromptPackagePlans", "AI prompt package plan data must exist.");
requireText(promptPackagePlan, "ai-generator-prompt-v2026.07.foundation", "AI prompt package must be versioned.");
requireText(promptPackagePlan, "Model use disabled until tenant AI package approval", "AI prompt package must keep model use disabled.");
requireText(promptPackagePlan, "Usage budget required", "AI prompt package must require usage budget.");
requireText(promptPackagePlan, "No raw student data in prompt", "AI prompt package must block raw student data.");
requireText(promptPackagePlan, "No prompt edits by students", "AI prompt package must block student prompt edits.");
requireText(promptPackagePlan, "JSON schema lock", "AI prompt package must preserve JSON schema lock.");
requireText(promptPackagePlan, "Tenant brand rules", "AI prompt package must include tenant brand rules.");
requireText(promptPackagePlan, "Voice generation separate package", "AI prompt package must separate voice generation from text generation.");
requireText(promptPackagePanel, "AI prompt package preview", "AI prompt package panel must expose heading.");
requireText(promptPackagePanel, "Versioned generation prompt", "AI prompt package panel must expose versioned prompt label.");
requireText(promptPackagePanel, "Prompt template version", "AI prompt package panel must expose template version.");
requireText(promptPackagePanel, "Model use disabled", "AI prompt package panel must expose disabled model status.");
requireText(promptPackagePanel, "Output schema locks", "AI prompt package panel must expose output schema locks.");
requireText(promptPackagePanel, "Cost controls", "AI prompt package panel must expose cost controls.");
requireText(requestBuilderData, "sampleAiGenerationRequestBuilders", "AI request builder data must exist.");
requireText(requestBuilderData, "Source evidence packet", "AI request builder must include source evidence packet field.");
requireText(requestBuilderData, "Target level", "AI request builder must include target level field.");
requireText(requestBuilderData, "Unit theme", "AI request builder must include unit theme field.");
requireText(requestBuilderData, "Target language", "AI request builder must include target language field.");
requireText(requestBuilderData, "Curated mode pathway", "AI request builder must include curated mode pathway field.");
requireText(requestBuilderData, "Audio coverage requirement", "AI request builder must include audio coverage field.");
requireText(requestBuilderData, "AI package state", "AI request builder must include AI package state field.");
requireText(requestBuilderData, "ai_generation_request_packet", "AI request builder must name generation request packet.");
requireText(requestBuilderData, "request_builder_review_packet", "AI request builder must name request builder review packet.");
requireText(requestBuilderData, "premium_ai_cost_gate", "AI request builder must name premium AI cost gate.");
requireText(requestBuilderData, "Generate draft blocked", "AI request builder must block draft generation.");
requireText(requestBuilderData, "Estimate API cost blocked", "AI request builder must block API cost estimation.");
requireText(requestBuilderData, "Submit request blocked", "AI request builder must block request submission.");
requireText(requestBuilderData, "No live prompt dispatch", "AI request builder must block live prompt dispatch.");
requireText(requestBuilderData, "No model billing", "AI request builder must block model billing.");
requireText(requestBuilderPanel, "AI generation request builder", "AI request builder panel must expose heading.");
requireText(requestBuilderPanel, "Disabled generator setup form", "AI request builder panel must expose disabled form label.");
requireText(audioCoveragePlan, "sampleAiGeneratorAudioCoveragePlans", "AI generator audio coverage plan data must exist.");
requireText(audioCoveragePlan, "ai_audio_coverage_plan", "AI generator audio plan must name the audio coverage plan record.");
requireText(audioCoveragePlan, "audio_cue_manifest", "AI generator audio plan must name the audio cue manifest.");
requireText(audioCoveragePlan, "Learning audio wins over background music", "AI generator audio plan must prioritize learning audio.");
requireText(audioCoveragePlan, "Support-language audio cannot unlock progress", "AI generator audio plan must block support-language audio progression.");
requireText(audioCoveragePlan, "Media-only listening cannot count toward mastery", "AI generator audio plan must block media-only mastery.");
requireText(audioCoveragePlan, "Generate target audio blocked", "AI generator audio plan must block live target audio generation.");
requireText(audioCoveragePlan, "API voice cost blocked", "AI generator audio plan must block voice API cost.");
requireText(audioCoveragePanel, "AI audio coverage planner", "AI generator audio panel must expose heading.");
requireText(audioCoveragePanel, "Target-language audio map", "AI generator audio panel must expose target-language map.");
requireText(audioCoveragePanel, "Audio-first generation gate", "AI generator audio panel must expose audio-first gate.");
requireText(audioCoveragePanel, "Learning audio priority", "AI generator audio panel must expose learning-audio priority.");
requireText(audioCoveragePanel, "Progress policy", "AI generator audio panel must expose progress policies.");
requireText(audioCoveragePanel, "Review note", "AI generator audio panel must expose review notes.");
requireText(gamificationMappingPlan, "sampleAiGamificationMappingPlans", "AI gamification mapping plan data must exist.");
requireText(gamificationMappingPlan, "ai_gamification_mapping_plan", "AI gamification mapping must name the mapping record.");
requireText(gamificationMappingPlan, "game_scoring_profile_snapshot", "AI gamification mapping must name scoring profile snapshot.");
requireText(gamificationMappingPlan, "collection_unlock_binding", "AI gamification mapping must name collection unlock binding.");
requireText(gamificationMappingPlan, "progress_event_acceptance_map", "AI gamification mapping must name event acceptance map.");
requireText(gamificationMappingPlan, "Random reward generation blocked", "AI gamification mapping must block random reward generation.");
requireText(gamificationMappingPlan, "Generated gacha blocked", "AI gamification mapping must block generated gacha.");
requireText(gamificationMappingPlan, "Media-only Star Dust blocked", "AI gamification mapping must block media-only Star Dust.");
requireText(gamificationMappingPlan, "Support-language-only mastery blocked", "AI gamification mapping must block support-language mastery.");
requireText(gamificationMappingPanel, "AI gamification mapping preview", "AI gamification panel must expose heading.");
requireText(gamificationMappingPanel, "Deterministic reward plan", "AI gamification panel must expose deterministic reward plan.");
requireText(gamificationMappingPanel, "Mastery unlocks only", "AI gamification panel must show mastery-only unlocks.");
requireText(gamificationMappingPanel, "No random rewards", "AI gamification panel must reject random rewards.");
requireText(gamificationMappingPanel, "Star Dust allocation", "AI gamification panel must show Star Dust allocation.");
requireText(gamificationMappingPanel, "Accepted events", "AI gamification panel must show accepted events.");
requireText(compatibilityMatrix, "This matrix defines which student games", "Generator mode recommendations must reuse the compatibility matrix.");
requireText(modeRecommendationPanel, "AI mode recommendation preview", "Mode recommendation panel must expose heading.");
requireText(modeRecommendationPanel, "Recommended generated pathway", "Mode recommendation panel must expose recommended pathway.");
requireText(modeRecommendationPanel, "Do not generate broad switch panel", "Mode recommendation panel must block broad switch panels.");
requireText(modeRecommendationPanel, "Blocked conversion guardrails", "Mode recommendation panel must expose blocked conversions.");
requireText(modeRecommendationPanel, "Payload fit:", "Mode recommendation panel must show payload fit.");
requireText(modeRecommendationPanel, "Compatibility rule:", "Mode recommendation panel must show compatibility rule.");
requireText(draftPreviewData, "sampleAiGeneratedDraftPayloadPreviews", "Generator draft payload preview data must exist.");
requireText(draftPreviewData, "Draft JSON preview", "Generator draft payload preview must name the JSON preview.");
requireText(draftPreviewData, "target_language_progress_trigger", "Generator draft payload preview must expose target-language trigger.");
requireText(draftPreviewData, "target-language-only", "Generator draft payload preview must keep target language as the progress trigger.");
requireText(draftPreviewData, "support_language_progress_allowed", "Generator draft payload preview must include support-language progress flag.");
requireText(draftPreviewData, "support_language_progress_allowed: false", "Generator draft payload preview must block support-language progress.");
requireText(draftPreviewData, "audio_coverage_status: required-not-approved", "Generator draft payload preview must block unapproved target audio.");
requireText(draftPreviewData, "Copy JSON blocked", "Generator draft payload preview must block JSON copy in the foundation.");
requireText(draftPreviewData, "Submit to verifier blocked", "Generator draft payload preview must block verifier submission in the foundation.");
requireText(draftPreviewData, "Create student assignment blocked", "Generator draft payload preview must block assignment creation.");
requireText(draftPreviewPanel, "AI draft payload preview", "Generator draft payload panel must expose heading.");
requireText(draftPreviewPanel, "Draft JSON preview", "Generator draft payload panel must expose JSON preview label.");
requireText(route, "AiGameGeneratorPlanPanel", "Generator route must render the generator panel.");
requireText(route, "AiEngineBindingPlanPanel", "Generator route must render the engine binding panel.");
requireText(route, "AiPromptPackagePlanPanel", "Generator route must render the prompt package plan panel.");
requireText(route, "AiGenerationRequestBuilderPanel", "Generator route must render the request builder panel.");
requireText(route, "AiGeneratorAudioCoveragePlanPanel", "Generator route must render the audio coverage plan panel.");
requireText(route, "AiGamificationMappingPanel", "Generator route must render the gamification mapping panel.");
requireText(route, "AiModeRecommendationPanel", "Generator route must render the mode recommendation panel.");
requireText(route, "AiGeneratedDraftPayloadPreviewPanel", "Generator route must render the draft payload preview panel.");
requireText(route, "sampleAiGameGeneratorPlan", "Generator route must use the sample generator plan.");
requireText(route, "sampleAiEngineBindingPlans", "Generator route must use the sample engine binding plan data.");
requireText(route, "sampleAiPromptPackagePlans", "Generator route must use the sample prompt package plan data.");
requireText(route, "sampleActivityPathwayCompatibilityMatrix", "Generator route must use the compatibility matrix.");
requireText(route, "sampleAiGeneratorAudioCoveragePlans", "Generator route must use the sample audio coverage plan data.");
requireText(route, "sampleAiGamificationMappingPlans", "Generator route must use the sample gamification mapping plan data.");
requireText(route, "sampleAiGenerationRequestBuilders", "Generator route must use request builder data.");
requireText(route, "sampleAiGeneratedDraftPayloadPreviews", "Generator route must use the sample draft payload preview data.");
requireText(route, "samplePublisherTenant", "Generator route must support sample publisher tenant.");
requireText(route, "ministarTenant", "Generator route must support MiniStar tenant.");
requireText(teacherIntake, "AiGameGeneratorPlanPanel", "Teacher intake must render the generator panel.");
requireText(teacherIntake, "sampleAiGameGeneratorPlan", "Teacher intake must pass the generator plan.");
requireText(routeContracts, "teacher-ai-game-generator", "Route contracts must register the teacher AI game generator.");
requireText(routeContracts, "getTeacherAiGameGeneratorPath", "Route contracts must expose the generator route helper.");
requireText(routeContracts, "/teacher/generator/[tenantId]", "Route contracts must include the generator route pattern.");
requireText(partnerDemo, "AI teaching game generator", "Partner demo must link to the generator route.");
requireText(partnerDemo, "getTeacherAiGameGeneratorPath", "Partner demo must use the generator route helper.");
requireText(activeRouteMatrix, "teacher-ai-game-generator", "Active route matrix must include the generator route.");
requireText(activeRouteMatrix, "/teacher/generator/sample-publisher", "Active route matrix must include the sample publisher generator route.");
requireText(activeRouteList, "http://127.0.0.1:3000/teacher/generator/sample-publisher", "Active route list must include the sample publisher generator route.");
requireText(routeVerifier, "/teacher/generator/sample-publisher", "Active route verifier must check the generator route.");
requireText(routeVerifier, "50 checked routes", "Active route verifier must expect the updated route count.");
requireText(principles, "AI teaching game generator creates draft package requests", "Principles must preserve generator-as-draft rule.");
requireText(handoff, "The AI teaching game generator creates draft package requests", "AI handoff must include generator boundary.");
requireText(packageJson, '"verify:ai-generator"', "package.json must expose verify:ai-generator.");
requireText(packageJson, "npm run verify:ai-generator", "verify:foundation must include verify:ai-generator.");

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }

  process.exit(1);
}

console.log(
  `PASS AI teaching game generator keeps ${requiredRules.length} output rule(s), ${blockedActions.length} blocked action(s), and ${requiredRecords.length} draft record(s) under review.`,
);

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function requireText(source, text, message) {
  if (!source.includes(text)) {
    failures.push(message);
  }
}
