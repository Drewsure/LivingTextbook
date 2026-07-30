import { readFileSync } from "node:fs";

const plan = readSource("../apps/web/src/data/sampleAiGameGeneratorPlan.ts");
const tenantCoverage = readSource("../apps/web/src/data/sampleAiGeneratorTenantCoverage.ts");
const engineBindingPlan = readSource("../apps/web/src/data/sampleAiEngineBindingPlan.ts");
const promptPackagePlan = readSource("../apps/web/src/data/sampleAiPromptPackagePlan.ts");
const costEntitlementGate = readSource("../apps/web/src/data/sampleAiGeneratorCostEntitlementGate.ts");
const requestBuilderData = readSource("../apps/web/src/data/sampleAiGenerationRequestBuilder.ts");
const audioCoveragePlan = readSource("../apps/web/src/data/sampleAiGeneratorAudioCoveragePlan.ts");
const gamificationMappingPlan = readSource("../apps/web/src/data/sampleAiGamificationMappingPlan.ts");
const rewardReadinessGate = readSource("../apps/web/src/data/sampleAiRewardReadinessGate.ts");
const verifierSubmissionPacket = readSource("../apps/web/src/data/sampleAiVerifierSubmissionPacket.ts");
const generatedPackageManifest = readSource("../apps/web/src/data/sampleAiGeneratedPackageManifest.ts");
const generatedPublishReadinessGate = readSource("../apps/web/src/data/sampleAiGeneratedPublishReadinessGate.ts");
const draftPreviewData = readSource("../apps/web/src/data/sampleAiGeneratedDraftPayloadPreview.ts");
const draftPayloadValidator = readSource("../packages/content-model/src/aiGeneratedDraftPayload.ts");
const correctionQueueData = readSource("../apps/web/src/data/sampleAiDraftCorrectionQueue.ts");
const compatibilityMatrix = readSource("../apps/web/src/data/sampleActivityPathwayCompatibility.ts");
const panel = readSource("../apps/web/src/features/content-intake/AiGameGeneratorPlanPanel.tsx");
const tenantCoveragePanel = readSource("../apps/web/src/features/content-intake/AiGeneratorTenantCoveragePanel.tsx");
const engineBindingPanel = readSource("../apps/web/src/features/content-intake/AiEngineBindingPlanPanel.tsx");
const promptPackagePanel = readSource("../apps/web/src/features/content-intake/AiPromptPackagePlanPanel.tsx");
const costEntitlementGatePanel = readSource("../apps/web/src/features/content-intake/AiGeneratorCostEntitlementGatePanel.tsx");
const requestBuilderPanel = readSource("../apps/web/src/features/content-intake/AiGenerationRequestBuilderPanel.tsx");
const audioCoveragePanel = readSource("../apps/web/src/features/content-intake/AiGeneratorAudioCoveragePlanPanel.tsx");
const gamificationMappingPanel = readSource("../apps/web/src/features/content-intake/AiGamificationMappingPanel.tsx");
const rewardReadinessGatePanel = readSource("../apps/web/src/features/content-intake/AiRewardReadinessGatePanel.tsx");
const verifierSubmissionPanel = readSource("../apps/web/src/features/content-intake/AiVerifierSubmissionPacketPanel.tsx");
const generatedPackageManifestPanel = readSource("../apps/web/src/features/content-intake/AiGeneratedPackageManifestPanel.tsx");
const generatedPublishReadinessGatePanel = readSource(
  "../apps/web/src/features/content-intake/AiGeneratedPublishReadinessGatePanel.tsx",
);
const draftPreviewPanel = readSource("../apps/web/src/features/content-intake/AiGeneratedDraftPayloadPreviewPanel.tsx");
const correctionQueuePanel = readSource("../apps/web/src/features/content-intake/AiDraftCorrectionQueuePanel.tsx");
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
requireText(tenantCoverage, "sampleAiGeneratorTenantCoverage", "AI generator tenant coverage data must exist.");
requireText(tenantCoverage, "ai_game_generator_request", "AI generator tenant coverage must include the request record lane.");
requireText(tenantCoverage, "ai_prompt_package", "AI generator tenant coverage must include prompt package coverage.");
requireText(tenantCoverage, "ai_generation_request_packet", "AI generator tenant coverage must include request builder coverage.");
requireText(tenantCoverage, "ai_audio_coverage_plan", "AI generator tenant coverage must include audio coverage.");
requireText(tenantCoverage, "ai_reward_readiness_gate", "AI generator tenant coverage must include reward readiness coverage.");
requireText(tenantCoverage, "ai_generated_draft_payload_preview", "AI generator tenant coverage must include draft JSON coverage.");
requireText(tenantCoverage, "ai_generated_publish_readiness_gate", "AI generator tenant coverage must include publish readiness coverage.");
requireText(tenantCoverage, "Missing generator preview records", "AI generator tenant coverage must make missing records visible.");
requireText(tenantCoverage, "No generator request submission", "AI generator tenant coverage must block generator submission.");
requireText(tenantCoverage, "No live model call", "AI generator tenant coverage must block live model calls.");
requireText(tenantCoverage, "No student assignment", "AI generator tenant coverage must block student assignment.");
requireText(tenantCoveragePanel, "AI generator tenant coverage", "AI generator tenant coverage panel must expose heading.");
requireText(
  tenantCoveragePanel,
  "White-label generator records by tenant",
  "AI generator tenant coverage panel must expose white-label heading.",
);
requireText(
  tenantCoveragePanel,
  "Tenant-specific records required",
  "AI generator tenant coverage panel must expose tenant-specific requirement.",
);
requireText(tenantCoveragePanel, "Tenant record lanes", "AI generator tenant coverage panel must expose lane list.");
requireText(tenantCoveragePanel, "Blocked generator actions", "AI generator tenant coverage panel must expose blocked actions.");
requireText(tenantCoveragePanel, "Next tenant requirements", "AI generator tenant coverage panel must expose next requirements.");
requireText(engineBindingPlan, "sampleAiEngineBindingPlans", "AI engine binding plan data must exist.");
requireText(engineBindingPlan, "MiniStar generated-mode engine binding", "AI engine binding plan must include MiniStar request seed.");
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
requireText(promptPackagePlan, "MiniStar generator prompt package", "AI prompt package plan must include MiniStar request seed.");
requireText(promptPackagePlan, "ministar-l1-greetings-game-draft", "AI prompt package plan must bind to MiniStar greetings request.");
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
requireText(costEntitlementGate, "sampleAiGeneratorCostEntitlementGates", "AI generator cost gate data must exist.");
requireText(costEntitlementGate, "MiniStar AI cost and entitlement gate", "AI generator cost gate data must include MiniStar request seed.");
requireText(costEntitlementGate, "premium_ai_cost_gate", "AI generator cost gate must name premium AI cost gate.");
requireText(costEntitlementGate, "tenant_ai_generation_entitlement", "AI generator cost gate must name tenant entitlement.");
requireText(costEntitlementGate, "usage_budget_ceiling", "AI generator cost gate must name usage budget ceilings.");
requireText(costEntitlementGate, "model_rate_card_snapshot", "AI generator cost gate must name model rate cards.");
requireText(costEntitlementGate, "voice_generation_separate_package", "AI generator cost gate must separate voice generation package.");
requireText(costEntitlementGate, "cost_estimate_preview", "AI generator cost gate must name cost estimate preview.");
requireText(costEntitlementGate, "school_approval_required", "AI generator cost gate must name school approval requirement.");
requireText(costEntitlementGate, "No live model billing", "AI generator cost gate must block live model billing.");
requireText(costEntitlementGate, "Teacher self-enable blocked", "AI generator cost gate must block teacher self-enablement.");
requireText(costEntitlementGate, "Enable AI Tutor blocked", "AI generator cost gate must block AI Tutor enablement.");
requireText(costEntitlementGate, "Show premium upsell to children blocked", "AI generator cost gate must block child-facing upsell.");
requireText(costEntitlementGatePanel, "AI generator cost and entitlement gate", "AI generator cost gate panel must expose heading.");
requireText(costEntitlementGatePanel, "Premium package required", "AI generator cost gate panel must expose premium package state.");
requireText(costEntitlementGatePanel, "No live model billing", "AI generator cost gate panel must expose billing block.");
requireText(costEntitlementGatePanel, "Entitlement checks", "AI generator cost gate panel must expose entitlement checks.");
requireText(costEntitlementGatePanel, "Cost estimate preview", "AI generator cost gate panel must expose estimate preview.");
requireText(costEntitlementGatePanel, "Hard cost ceilings", "AI generator cost gate panel must expose hard ceilings.");
requireText(requestBuilderData, "sampleAiGenerationRequestBuilders", "AI request builder data must exist.");
requireText(requestBuilderData, "requestId: string", "AI request builder data must be request-specific.");
requireText(requestBuilderData, "MiniStar AI game request builder", "AI request builder data must include MiniStar request seed.");
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
requireText(audioCoveragePlan, "MiniStar AI audio coverage plan", "AI generator audio plan must include MiniStar request seed.");
requireText(audioCoveragePlan, "ja-hiragana", "AI generator audio plan must preserve hiragana-only support audio for early MiniStar levels.");
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
requireText(gamificationMappingPlan, "MiniStar AI gamification map", "AI gamification mapping must include MiniStar request seed.");
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
requireText(rewardReadinessGate, "sampleAiRewardReadinessGates", "AI reward readiness gate data must exist.");
requireText(rewardReadinessGate, "1,000 Star Dust unit cap", "AI reward gate must preserve the unit reward cap.");
requireText(rewardReadinessGate, "75% mastery threshold", "AI reward gate must preserve the mastery threshold.");
requireText(rewardReadinessGate, "Deterministic collection unlocks", "AI reward gate must preserve deterministic collection unlocks.");
requireText(rewardReadinessGate, "Accepted learning events only", "AI reward gate must restrict rewards to accepted events.");
requireText(rewardReadinessGate, "Correction queue clear before rewards", "AI reward gate must depend on correction queue state.");
requireText(rewardReadinessGate, "Reward publish blocked", "AI reward gate must block reward publishing.");
requireText(rewardReadinessGate, "Collection inventory write blocked", "AI reward gate must block inventory writes.");
requireText(rewardReadinessGate, "Generated surprise reward blocked", "AI reward gate must block generated surprise rewards.");
requireText(rewardReadinessGate, "Spin Wheel ticket issuance blocked", "AI reward gate must block ticket issuance.");
requireText(rewardReadinessGate, "Avatar evolution write blocked", "AI reward gate must block avatar evolution writes.");
requireText(rewardReadinessGatePanel, "AI reward readiness gate", "AI reward gate panel must expose heading.");
requireText(
  rewardReadinessGatePanel,
  "Generated rewards stay deterministic",
  "AI reward gate panel must expose deterministic reward label.",
);
requireText(rewardReadinessGatePanel, "No generated surprise rewards", "AI reward gate panel must expose surprise reward block.");
requireText(rewardReadinessGatePanel, "Reward readiness checks", "AI reward gate panel must expose readiness checks.");
requireText(rewardReadinessGatePanel, "Required before student use", "AI reward gate panel must expose required records.");
requireText(verifierSubmissionPacket, "sampleAiVerifierSubmissionPackets", "AI verifier submission packet data must exist.");
requireText(verifierSubmissionPacket, "ai_verifier_submission_packet", "AI verifier packet must name verifier submission packet.");
requireText(verifierSubmissionPacket, "schema_validation_packet", "AI verifier packet must name schema validation packet.");
requireText(verifierSubmissionPacket, "pedagogical_lock_packet", "AI verifier packet must name pedagogical lock packet.");
requireText(verifierSubmissionPacket, "audio_coverage_packet", "AI verifier packet must name audio coverage packet.");
requireText(verifierSubmissionPacket, "engine_binding_packet", "AI verifier packet must name engine binding packet.");
requireText(verifierSubmissionPacket, "gamification_mapping_packet", "AI verifier packet must name gamification mapping packet.");
requireText(
  verifierSubmissionPacket,
  "activity_compatibility_snapshot",
  "AI verifier packet must name activity compatibility snapshot.",
);
requireText(verifierSubmissionPacket, "media_rights_manifest", "AI verifier packet must name media rights manifest.");
requireText(verifierSubmissionPacket, "teacher_approval_packet", "AI verifier packet must name teacher approval packet.");
requireText(verifierSubmissionPacket, "Submit verifier packet blocked", "AI verifier packet must block verifier submission.");
requireText(verifierSubmissionPacket, "Approve generated package blocked", "AI verifier packet must block package approval.");
requireText(
  verifierSubmissionPacket,
  "Create student assignment from verifier packet blocked",
  "AI verifier packet must block student assignment creation.",
);
requireText(verifierSubmissionPanel, "AI verifier submission packet", "AI verifier packet panel must expose heading.");
requireText(verifierSubmissionPanel, "Vision/reasoning preflight", "AI verifier packet panel must expose preflight label.");
requireText(verifierSubmissionPanel, "Required verifier packets", "AI verifier packet panel must show required packets.");
requireText(verifierSubmissionPanel, "Verifier checks", "AI verifier packet panel must show verifier checks.");
requireText(verifierSubmissionPanel, "Evidence", "AI verifier packet panel must show evidence.");
requireText(verifierSubmissionPanel, "Rejection rule", "AI verifier packet panel must show rejection rules.");
requireText(generatedPackageManifest, "sampleAiGeneratedPackageManifests", "AI generated package manifest data must exist.");
requireText(generatedPackageManifest, "ai_generated_package_manifest", "AI generated package manifest must name manifest record.");
requireText(generatedPackageManifest, "teacher_draft_package", "AI generated package manifest must name teacher draft package record.");
requireText(generatedPackageManifest, "teacher_draft_verifier_submission", "AI generated package manifest must name verifier submission record.");
requireText(generatedPackageManifest, "package_game_audio_coverage", "AI generated package manifest must name audio coverage record.");
requireText(generatedPackageManifest, "engine_mode_config_binding", "AI generated package manifest must name engine binding record.");
requireText(generatedPackageManifest, "collection_unlock_binding", "AI generated package manifest must name collection unlock record.");
requireText(generatedPackageManifest, "media_rights_manifest", "AI generated package manifest must name media rights manifest.");
requireText(generatedPackageManifest, "teacher_approval_packet", "AI generated package manifest must name teacher approval packet.");
requireText(generatedPackageManifest, "Package assembly blocked", "AI generated package manifest must block package assembly.");
requireText(generatedPackageManifest, "No route registry write", "AI generated package manifest must block route registry writes.");
requireText(generatedPackageManifest, "No media playlist write", "AI generated package manifest must block playlist writes.");
requireText(generatedPackageManifest, "No assignment write", "AI generated package manifest must block assignment writes.");
requireText(
  generatedPackageManifest,
  "Assign generated package from manifest blocked",
  "AI generated package manifest must block assignment from manifest.",
);
requireText(generatedPackageManifestPanel, "AI generated package manifest", "AI generated package manifest panel must expose heading.");
requireText(generatedPackageManifestPanel, "One bundle, many gates", "AI generated package manifest panel must expose bundle gate label.");
requireText(generatedPackageManifestPanel, "Manifest links", "AI generated package manifest panel must show manifest links.");
requireText(generatedPackageManifestPanel, "Package records", "AI generated package manifest panel must show package records.");
requireText(generatedPackageManifestPanel, "Release locks", "AI generated package manifest panel must show release locks.");
requireText(generatedPackageManifestPanel, "Blocked package actions", "AI generated package manifest panel must show blocked package actions.");
requireText(
  generatedPublishReadinessGate,
  "sampleAiGeneratedPublishReadinessGates",
  "AI generated publish readiness gate data must exist.",
);
requireText(
  generatedPublishReadinessGate,
  "Student route publish blocked",
  "AI generated publish readiness gate must block student route publishing.",
);
requireText(
  generatedPublishReadinessGate,
  "Correction queue clear",
  "AI generated publish readiness gate must depend on the correction queue.",
);
requireText(
  generatedPublishReadinessGate,
  "Verifier packet approved",
  "AI generated publish readiness gate must depend on verifier approval.",
);
requireText(
  generatedPublishReadinessGate,
  "Manifest records complete",
  "AI generated publish readiness gate must depend on manifest completeness.",
);
requireText(
  generatedPublishReadinessGate,
  "Reward readiness passed",
  "AI generated publish readiness gate must depend on reward readiness.",
);
requireText(
  generatedPublishReadinessGate,
  "Release-control binding attached",
  "AI generated publish readiness gate must require release-control binding.",
);
requireText(
  generatedPublishReadinessGate,
  "Teacher approval ledger captured",
  "AI generated publish readiness gate must require teacher approval ledger capture.",
);
requireText(
  generatedPublishReadinessGate,
  "Create launch route from generated package blocked",
  "AI generated publish readiness gate must block launch route creation.",
);
requireText(
  generatedPublishReadinessGate,
  "Write tenant route registry entry blocked",
  "AI generated publish readiness gate must block route registry writes.",
);
requireText(
  generatedPublishReadinessGate,
  "Write media playlist from generated package blocked",
  "AI generated publish readiness gate must block playlist writes.",
);
requireText(
  generatedPublishReadinessGate,
  "Mark generated package student-ready blocked",
  "AI generated publish readiness gate must block student-ready markers.",
);
requireText(
  generatedPublishReadinessGatePanel,
  "AI generated publish readiness gate",
  "AI generated publish readiness panel must expose heading.",
);
requireText(
  generatedPublishReadinessGatePanel,
  "No generated package can skip release control",
  "AI generated publish readiness panel must expose release-control rule.",
);
requireText(
  generatedPublishReadinessGatePanel,
  "Route creation blocked",
  "AI generated publish readiness panel must expose route creation block.",
);
requireText(
  generatedPublishReadinessGatePanel,
  "Publish readiness checks",
  "AI generated publish readiness panel must expose readiness checks.",
);
requireText(
  generatedPublishReadinessGatePanel,
  "Allowed now",
  "AI generated publish readiness panel must expose allowed review actions.",
);
requireText(
  generatedPublishReadinessGatePanel,
  "Blocked publish actions",
  "AI generated publish readiness panel must expose blocked publish actions.",
);
requireText(
  generatedPublishReadinessGatePanel,
  "Next publish records",
  "AI generated publish readiness panel must expose next publish records.",
);
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
requireText(draftPreviewData, "sampleAiGeneratedDraftPayloadPreviewErrors", "Generator draft payload preview must expose shared validator errors.");
requireText(draftPreviewData, "sampleAiGeneratedDraftPayloadPreviewWarnings", "Generator draft payload preview must expose shared validator warnings.");
requireText(draftPreviewData, "MiniStar Draft JSON preview", "MiniStar generator must expose a draft JSON preview.");
requireText(draftPreviewData, "ai-draft-preview-ministar-l1-greetings-v1", "MiniStar generator draft preview must be request-specific.");
requireText(draftPreviewData, "Hello, teacher.", "MiniStar generator draft preview must include the first target sentence.");
requireText(draftPreviewData, "Thank you, friend.", "MiniStar generator draft preview must include the second target sentence.");
requireText(draftPreviewData, "ja-hiragana", "MiniStar generator draft preview must preserve hiragana-only support language metadata.");
requireText(
  draftPreviewData,
  "Use Japanese support to unlock progress blocked",
  "MiniStar generator draft preview must block support-language progression.",
);
requireText(
  draftPreviewData,
  "validateAiGeneratedDraftPayloadPreview",
  "Generator draft payload preview data must call the shared preview validator.",
);
requireText(
  draftPreviewData,
  "getAiGeneratedDraftPayloadPreviewWarnings",
  "Generator draft payload preview data must call the shared preview warning helper.",
);
requireText(draftPayloadValidator, "validateAiGeneratedDraftPayload", "Shared content model must validate generated draft payloads.");
requireText(draftPayloadValidator, "getAiGeneratedDraftPayloadWarnings", "Shared content model must expose generated draft warnings.");
requireText(
  draftPayloadValidator,
  "validateAiGeneratedDraftPayloadPreview",
  "Shared content model must validate generated draft preview shells.",
);
requireText(
  draftPayloadValidator,
  "AI generated draft payload vocabulary_terms count must be between 8 and 12.",
  "Shared draft validator must enforce the 8-12 vocabulary range.",
);
requireText(
  draftPayloadValidator,
  "AI generated draft payload must include exactly 2 target_sentences.",
  "Shared draft validator must enforce exactly two target sentences.",
);
requireText(
  draftPayloadValidator,
  "target_language_progress_trigger as target-language-only",
  "Shared draft validator must enforce target-language-only progress.",
);
requireText(
  draftPayloadValidator,
  "support_language_progress_allowed: false",
  "Shared draft validator must block support-language progress.",
);
requireText(
  draftPayloadValidator,
  "media_only_progress_allowed: false",
  "Shared draft validator must block media-only progress.",
);
requireText(
  draftPayloadValidator,
  "target-language audio cues must be approved before student assignment",
  "Shared draft validator must block unapproved target-language audio.",
);
requireText(
  draftPayloadValidator,
  "AI_GENERATED_DRAFT_REQUIRED_BLOCKED_ACTIONS",
  "Shared draft validator must name required blocked actions.",
);
requireText(
  draftPayloadValidator,
  "AI_GENERATED_DRAFT_REQUIRED_NEXT_RECORDS",
  "Shared draft validator must name next required records.",
);
requireText(draftPreviewPanel, "AI draft payload preview", "Generator draft payload panel must expose heading.");
requireText(draftPreviewPanel, "Draft JSON preview", "Generator draft payload panel must expose JSON preview label.");
requireText(draftPreviewPanel, "Schema guard active", "Generator draft payload panel must expose schema guard status.");
requireText(draftPreviewPanel, "Student use blocked", "Generator draft payload panel must expose student-use block status.");
requireText(draftPreviewPanel, "Schema guard blocks", "Generator draft payload panel must show validation blocks.");
requireText(draftPreviewPanel, "Schema guard warnings", "Generator draft payload panel must show validation warnings.");
requireText(correctionQueueData, "sampleAiDraftCorrectionQueues", "AI draft correction queue data must exist.");
requireText(correctionQueueData, "validateAiGeneratedDraftPayloadPreview", "AI draft correction queue must use shared validator blocks.");
requireText(correctionQueueData, "getAiGeneratedDraftPayloadPreviewWarnings", "AI draft correction queue must use shared validator warnings.");
requireText(correctionQueueData, "Audio coverage repair lane", "AI draft correction queue must route audio issues.");
requireText(correctionQueueData, "Progress policy repair lane", "AI draft correction queue must route progress policy issues.");
requireText(correctionQueueData, "Pedagogical payload repair lane", "AI draft correction queue must route payload issues.");
requireText(correctionQueueData, "No auto-fix from AI draft", "AI draft correction queue must block auto-fix.");
requireText(correctionQueueData, "No regenerate live AI", "AI draft correction queue must block live regeneration.");
requireText(correctionQueueData, "No student assignment", "AI draft correction queue must block student assignment.");
requireText(correctionQueuePanel, "AI draft correction queue", "AI draft correction queue panel must expose heading.");
requireText(correctionQueuePanel, "Repair before review", "AI draft correction queue panel must expose repair-before-review label.");
requireText(correctionQueuePanel, "Schema/audio/progress repair lanes", "AI draft correction queue panel must expose repair lanes.");
requireText(correctionQueuePanel, "Required owner", "AI draft correction queue panel must expose ownership.");
requireText(correctionQueuePanel, "Next record", "AI draft correction queue panel must expose next records.");
requireText(correctionQueuePanel, "Student-use effect", "AI draft correction queue panel must expose student-use effect.");
requireText(correctionQueuePanel, "Blocked correction actions", "AI draft correction queue panel must expose blocked actions.");
requireText(route, "AiGameGeneratorPlanPanel", "Generator route must render the generator panel.");
requireText(route, "AiGeneratorTenantCoveragePanel", "Generator route must render the tenant coverage panel.");
requireText(route, "AiEngineBindingPlanPanel", "Generator route must render the engine binding panel.");
requireText(route, "AiPromptPackagePlanPanel", "Generator route must render the prompt package plan panel.");
requireText(route, "AiGeneratorCostEntitlementGatePanel", "Generator route must render the cost entitlement gate panel.");
requireText(route, "AiGenerationRequestBuilderPanel", "Generator route must render the request builder panel.");
requireText(route, "AiGeneratorAudioCoveragePlanPanel", "Generator route must render the audio coverage plan panel.");
requireText(route, "AiGamificationMappingPanel", "Generator route must render the gamification mapping panel.");
requireText(route, "AiRewardReadinessGatePanel", "Generator route must render the reward readiness gate panel.");
requireText(route, "AiVerifierSubmissionPacketPanel", "Generator route must render the verifier submission packet panel.");
requireText(route, "AiModeRecommendationPanel", "Generator route must render the mode recommendation panel.");
requireText(route, "AiGeneratedPackageManifestPanel", "Generator route must render the generated package manifest panel.");
requireText(route, "AiGeneratedPublishReadinessGatePanel", "Generator route must render the generated publish readiness gate panel.");
requireText(route, "AiGeneratedDraftPayloadPreviewPanel", "Generator route must render the draft payload preview panel.");
requireText(route, "AiDraftCorrectionQueuePanel", "Generator route must render the draft correction queue panel.");
requireText(route, "sampleAiGameGeneratorPlan", "Generator route must use the sample generator plan.");
requireText(route, "sampleAiGeneratorTenantCoverage", "Generator route must use tenant coverage data.");
requireText(route, "sampleAiEngineBindingPlans", "Generator route must use the sample engine binding plan data.");
requireText(route, "sampleAiPromptPackagePlans", "Generator route must use the sample prompt package plan data.");
requireText(route, "sampleAiGeneratorCostEntitlementGates", "Generator route must use the sample cost entitlement gate data.");
requireText(route, "sampleActivityPathwayCompatibilityMatrix", "Generator route must use the compatibility matrix.");
requireText(route, "sampleAiGeneratorAudioCoveragePlans", "Generator route must use the sample audio coverage plan data.");
requireText(route, "sampleAiGamificationMappingPlans", "Generator route must use the sample gamification mapping plan data.");
requireText(route, "sampleAiRewardReadinessGates", "Generator route must use the sample reward readiness gate data.");
requireText(route, "sampleAiVerifierSubmissionPackets", "Generator route must use the sample verifier submission packet data.");
requireText(route, "sampleAiGeneratedPackageManifests", "Generator route must use the sample generated package manifest data.");
requireText(
  route,
  "sampleAiGeneratedPublishReadinessGates",
  "Generator route must use the sample generated publish readiness gate data.",
);
requireText(route, "sampleAiGenerationRequestBuilders", "Generator route must use request builder data.");
requireText(route, "sampleAiGeneratedDraftPayloadPreviews", "Generator route must use the sample draft payload preview data.");
requireText(route, "sampleAiDraftCorrectionQueues", "Generator route must use the sample draft correction queue data.");
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
requireText(activeRouteMatrix, "/teacher/generator/ministar", "Active route matrix must include the MiniStar generator route.");
requireText(activeRouteList, "http://127.0.0.1:3000/teacher/generator/sample-publisher", "Active route list must include the sample publisher generator route.");
requireText(activeRouteList, "http://127.0.0.1:3000/teacher/generator/ministar", "Active route list must include the MiniStar generator route.");
requireText(routeVerifier, "/teacher/generator/sample-publisher", "Active route verifier must check the generator route.");
requireText(routeVerifier, "/teacher/generator/ministar", "Active route verifier must check the MiniStar generator route.");
requireText(routeVerifier, "51 checked routes", "Active route verifier must expect the updated route count.");
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
