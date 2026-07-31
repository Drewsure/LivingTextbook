import { readFileSync } from "node:fs";

const plan = readSource("../apps/web/src/data/sampleAiGameGeneratorPlan.ts");
const tenantCoverage = readSource("../apps/web/src/data/sampleAiGeneratorTenantCoverage.ts");
const lineageMap = readSource("../apps/web/src/data/sampleAiGeneratorLineageMap.ts");
const engineBindingPlan = readSource("../apps/web/src/data/sampleAiEngineBindingPlan.ts");
const promptPackagePlan = readSource("../apps/web/src/data/sampleAiPromptPackagePlan.ts");
const costEntitlementGate = readSource("../apps/web/src/data/sampleAiGeneratorCostEntitlementGate.ts");
const requestBuilderData = readSource("../apps/web/src/data/sampleAiGenerationRequestBuilder.ts");
const audioCoveragePlan = readSource("../apps/web/src/data/sampleAiGeneratorAudioCoveragePlan.ts");
const gamificationMappingPlan = readSource("../apps/web/src/data/sampleAiGamificationMappingPlan.ts");
const rewardReadinessGate = readSource("../apps/web/src/data/sampleAiRewardReadinessGate.ts");
const generatedGameBuildBrief = readSource("../apps/web/src/data/sampleAiGeneratedGameBuildBrief.ts");
const prototypeReturnReview = readSource("../apps/web/src/data/sampleAiPrototypeReturnReview.ts");
const prototypeIntegrationPlan = readSource("../apps/web/src/data/sampleAiPrototypeIntegrationPlan.ts");
const prototypeWrapperAdapterReview = readSource("../apps/web/src/data/sampleAiPrototypeWrapperAdapterReview.ts");
const prototypeFixtureReplayReport = readSource("../apps/web/src/data/sampleAiPrototypeFixtureReplayReport.ts");
const verifierSubmissionPacket = readSource("../apps/web/src/data/sampleAiVerifierSubmissionPacket.ts");
const generatedPackageManifest = readSource("../apps/web/src/data/sampleAiGeneratedPackageManifest.ts");
const generatedPackagePromotionChecklist = readSource(
  "../apps/web/src/data/sampleAiGeneratedPackagePromotionChecklist.ts",
);
const generatedPackageReleaseCandidate = readSource("../apps/web/src/data/sampleAiGeneratedPackageReleaseCandidate.ts");
const generatedPublishReadinessGate = readSource("../apps/web/src/data/sampleAiGeneratedPublishReadinessGate.ts");
const draftPreviewData = readSource("../apps/web/src/data/sampleAiGeneratedDraftPayloadPreview.ts");
const draftPayloadValidator = readSource("../packages/content-model/src/aiGeneratedDraftPayload.ts");
const correctionQueueData = readSource("../apps/web/src/data/sampleAiDraftCorrectionQueue.ts");
const compatibilityMatrix = readSource("../apps/web/src/data/sampleActivityPathwayCompatibility.ts");
const panel = readSource("../apps/web/src/features/content-intake/AiGameGeneratorPlanPanel.tsx");
const tenantCoveragePanel = readSource("../apps/web/src/features/content-intake/AiGeneratorTenantCoveragePanel.tsx");
const lineageMapPanel = readSource("../apps/web/src/features/content-intake/AiGeneratorLineageMapPanel.tsx");
const engineBindingPanel = readSource("../apps/web/src/features/content-intake/AiEngineBindingPlanPanel.tsx");
const promptPackagePanel = readSource("../apps/web/src/features/content-intake/AiPromptPackagePlanPanel.tsx");
const costEntitlementGatePanel = readSource("../apps/web/src/features/content-intake/AiGeneratorCostEntitlementGatePanel.tsx");
const requestBuilderPanel = readSource("../apps/web/src/features/content-intake/AiGenerationRequestBuilderPanel.tsx");
const audioCoveragePanel = readSource("../apps/web/src/features/content-intake/AiGeneratorAudioCoveragePlanPanel.tsx");
const gamificationMappingPanel = readSource("../apps/web/src/features/content-intake/AiGamificationMappingPanel.tsx");
const rewardReadinessGatePanel = readSource("../apps/web/src/features/content-intake/AiRewardReadinessGatePanel.tsx");
const generatedGameBuildBriefPanel = readSource(
  "../apps/web/src/features/content-intake/AiGeneratedGameBuildBriefPanel.tsx",
);
const prototypeReturnReviewPanel = readSource(
  "../apps/web/src/features/content-intake/AiPrototypeReturnReviewPanel.tsx",
);
const prototypeIntegrationPlanPanel = readSource(
  "../apps/web/src/features/content-intake/AiPrototypeIntegrationPlanPanel.tsx",
);
const prototypeWrapperAdapterReviewPanel = readSource(
  "../apps/web/src/features/content-intake/AiPrototypeWrapperAdapterReviewPanel.tsx",
);
const prototypeFixtureReplayReportPanel = readSource(
  "../apps/web/src/features/content-intake/AiPrototypeFixtureReplayReportPanel.tsx",
);
const verifierSubmissionPanel = readSource("../apps/web/src/features/content-intake/AiVerifierSubmissionPacketPanel.tsx");
const generatedPackageManifestPanel = readSource("../apps/web/src/features/content-intake/AiGeneratedPackageManifestPanel.tsx");
const generatedPackagePromotionChecklistPanel = readSource(
  "../apps/web/src/features/content-intake/AiGeneratedPackagePromotionChecklistPanel.tsx",
);
const generatedPackageReleaseCandidatePanel = readSource(
  "../apps/web/src/features/content-intake/AiGeneratedPackageReleaseCandidatePanel.tsx",
);
const generatedPublishReadinessGatePanel = readSource(
  "../apps/web/src/features/content-intake/AiGeneratedPublishReadinessGatePanel.tsx",
);
const draftPreviewPanel = readSource("../apps/web/src/features/content-intake/AiGeneratedDraftPayloadPreviewPanel.tsx");
const correctionQueuePanel = readSource("../apps/web/src/features/content-intake/AiDraftCorrectionQueuePanel.tsx");
const modeRecommendationPanel = readSource("../apps/web/src/features/content-intake/AiModeRecommendationPanel.tsx");
const teacherDraftPackages = readSource("../apps/web/src/data/sampleTeacherDraftPackage.ts");
const teacherDraftReviewQueue = readSource("../apps/web/src/data/sampleTeacherDraftReviewQueue.ts");
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
requireText(generatedGameBuildBrief, "sampleAiGeneratedGameBuildBriefPackets", "AI generated game build brief data must exist.");
requireText(generatedGameBuildBrief, "Z.ai prototype brief", "AI generated game build brief must identify external prototype briefs.");
requireText(generatedGameBuildBrief, "standard_event_contract", "AI generated game build brief must require the standard event contract.");
requireText(generatedGameBuildBrief, "audio_cue_manifest", "AI generated game build brief must require audio cue manifests.");
requireText(generatedGameBuildBrief, "Use deterministic scoring only", "AI generated game build brief must require deterministic scoring.");
requireText(generatedGameBuildBrief, "No standalone game promotion", "AI generated game build brief must block standalone promotion.");
requireText(generatedGameBuildBrief, "No Phaser bypass without parent-engine wrapper", "AI generated game build brief must block Phaser bypass.");
requireText(generatedGameBuildBrief, "No generated game route write", "AI generated game build brief must block route writes.");
requireText(
  generatedGameBuildBrief,
  "No student assignment from build brief",
  "AI generated game build brief must block student assignments.",
);
requireText(
  generatedGameBuildBrief,
  "No Japanese support-language scoring or release",
  "MiniStar generated game build brief must block Japanese support-language scoring or release.",
);
requireText(
  generatedGameBuildBriefPanel,
  "AI generated game build brief packet",
  "AI generated game build brief panel must expose heading.",
);
requireText(
  generatedGameBuildBriefPanel,
  "External prototype instructions",
  "AI generated game build brief panel must expose external prototype instructions.",
);
requireText(generatedGameBuildBriefPanel, "Z.ai prototype brief", "AI generated game build brief panel must expose Z.ai brief label.");
requireText(generatedGameBuildBriefPanel, "Mode build briefs", "AI generated game build brief panel must expose mode briefs.");
requireText(generatedGameBuildBriefPanel, "Event contract", "AI generated game build brief panel must expose event contract.");
requireText(generatedGameBuildBriefPanel, "Audio contract", "AI generated game build brief panel must expose audio contract.");
requireText(generatedGameBuildBriefPanel, "Scoring contract", "AI generated game build brief panel must expose scoring contract.");
requireText(generatedGameBuildBriefPanel, "No standalone promotion", "AI generated game build brief panel must block standalone promotion.");
requireText(prototypeReturnReview, "sampleAiPrototypeReturnReviewPackets", "AI prototype return review data must exist.");
requireText(prototypeReturnReview, "External prototype builder / Z.ai return packet", "AI prototype return review must identify external returns.");
requireText(prototypeReturnReview, "Parent-engine wrapper review", "AI prototype return review must require parent-engine wrapper review.");
requireText(prototypeReturnReview, "Standard event replay review", "AI prototype return review must require event replay review.");
requireText(prototypeReturnReview, "Audio cue coverage review", "AI prototype return review must require audio cue coverage review.");
requireText(prototypeReturnReview, "No production merge from returned prototype", "AI prototype return review must block production merge.");
requireText(prototypeReturnReview, "No route registry write", "AI prototype return review must block route writes.");
requireText(prototypeReturnReview, "No scoring profile mutation", "AI prototype return review must block scoring changes.");
requireText(prototypeReturnReview, "No student-facing preview from returned code", "AI prototype return review must block student-facing preview.");
requireText(prototypeReturnReview, "No text hidden inside black buttons", "AI prototype return review must preserve visible button text checks.");
requireText(
  prototypeReturnReview,
  "No Japanese support-language scoring or release",
  "MiniStar prototype return review must block Japanese support-language scoring or release.",
);
requireText(prototypeReturnReviewPanel, "AI prototype return review", "AI prototype return review panel must expose heading.");
requireText(prototypeReturnReviewPanel, "Returned prototype intake gate", "AI prototype return review panel must expose intake gate.");
requireText(prototypeReturnReviewPanel, "No production merge", "AI prototype return review panel must block production merge.");
requireText(prototypeReturnReviewPanel, "Mode return reviews", "AI prototype return review panel must expose mode reviews.");
requireText(prototypeReturnReviewPanel, "Wrapper requirements", "AI prototype return review panel must expose wrapper requirements.");
requireText(prototypeReturnReviewPanel, "Event evidence", "AI prototype return review panel must expose event evidence.");
requireText(prototypeReturnReviewPanel, "Audio evidence", "AI prototype return review panel must expose audio evidence.");
requireText(prototypeReturnReviewPanel, "Scoring evidence", "AI prototype return review panel must expose scoring evidence.");
requireText(prototypeReturnReviewPanel, "Accessibility evidence", "AI prototype return review panel must expose accessibility evidence.");
requireText(prototypeIntegrationPlan, "sampleAiPrototypeIntegrationPlans", "AI prototype integration plan data must exist.");
requireText(prototypeIntegrationPlan, "ai_prototype_return_review", "AI prototype integration plan must depend on prototype return review records.");
requireText(prototypeIntegrationPlan, "prototype_wrapper_adapter_review", "AI prototype integration plan must name wrapper adapter review.");
requireText(prototypeIntegrationPlan, "prototype_fixture_replay_report", "AI prototype integration plan must name fixture replay report.");
requireText(prototypeIntegrationPlan, "prototype_event_replay_report", "AI prototype integration plan must name event replay report.");
requireText(prototypeIntegrationPlan, "prototype_audio_coverage_report", "AI prototype integration plan must name audio coverage report.");
requireText(prototypeIntegrationPlan, "No direct import into apps/web", "AI prototype integration plan must block direct imports.");
requireText(prototypeIntegrationPlan, "No route registry write", "AI prototype integration plan must block route writes.");
requireText(prototypeIntegrationPlan, "No game sequence mutation", "AI prototype integration plan must block game sequence mutation.");
requireText(prototypeIntegrationPlan, "No package promotion", "AI prototype integration plan must block package promotion.");
requireText(prototypeIntegrationPlanPanel, "AI prototype integration plan", "AI prototype integration plan panel must expose heading.");
requireText(prototypeIntegrationPlanPanel, "Wrapper-first integration path", "AI prototype integration plan panel must expose wrapper-first path.");
requireText(prototypeIntegrationPlanPanel, "No direct import", "AI prototype integration plan panel must block direct imports.");
requireText(prototypeIntegrationPlanPanel, "Codex review required", "AI prototype integration plan panel must require Codex review.");
requireText(prototypeIntegrationPlanPanel, "Mode integration plans", "AI prototype integration plan panel must expose mode plans.");
requireText(prototypeIntegrationPlanPanel, "Integration sequence", "AI prototype integration plan panel must expose integration sequence.");
requireText(prototypeIntegrationPlanPanel, "Required tests", "AI prototype integration plan panel must expose required tests.");
requireText(prototypeIntegrationPlanPanel, "Blocked shortcuts", "AI prototype integration plan panel must expose blocked shortcuts.");
requireText(prototypeWrapperAdapterReview, "sampleAiPrototypeWrapperAdapterReviews", "AI prototype wrapper adapter review data must exist.");
requireText(prototypeWrapperAdapterReview, "prototype_wrapper_adapter_review", "AI prototype wrapper adapter review must name its record.");
requireText(
  prototypeWrapperAdapterReview,
  "Parent engine owns route, scoring, mastery, progress, rewards, and assignment effects.",
  "AI prototype wrapper adapter review must keep platform state in the parent engine.",
);
requireText(
  prototypeWrapperAdapterReview,
  "Fixture input contract is explicit",
  "AI prototype wrapper adapter review must require explicit fixture input.",
);
requireText(
  prototypeWrapperAdapterReview,
  "Standard event output contract",
  "AI prototype wrapper adapter review must require standard event output.",
);
requireText(prototypeWrapperAdapterReview, "No event contract bypass", "AI prototype wrapper adapter review must block event bypass.");
requireText(prototypeWrapperAdapterReview, "No tenant hard-coding", "AI prototype wrapper adapter review must block tenant hard-coding.");
requireText(
  prototypeWrapperAdapterReview,
  "Wrapper may not own score authority",
  "AI prototype wrapper adapter review must block wrapper score authority.",
);
requireText(
  prototypeWrapperAdapterReview,
  "Support-language progress trigger",
  "AI prototype wrapper adapter review must reject support-language progress triggers.",
);
requireText(
  prototypeWrapperAdapterReviewPanel,
  "AI prototype wrapper adapter review",
  "AI prototype wrapper adapter review panel must expose heading.",
);
requireText(
  prototypeWrapperAdapterReviewPanel,
  "Parent-engine adapter boundary",
  "AI prototype wrapper adapter review panel must expose parent-engine boundary.",
);
requireText(
  prototypeWrapperAdapterReviewPanel,
  "Mode wrapper reviews",
  "AI prototype wrapper adapter review panel must expose mode wrapper reviews.",
);
requireText(
  prototypeWrapperAdapterReviewPanel,
  "Fixture input contract",
  "AI prototype wrapper adapter review panel must expose fixture input contract.",
);
requireText(
  prototypeWrapperAdapterReviewPanel,
  "Standard event output contract",
  "AI prototype wrapper adapter review panel must expose standard event output contract.",
);
requireText(
  prototypeWrapperAdapterReviewPanel,
  "State ownership",
  "AI prototype wrapper adapter review panel must expose state ownership.",
);
requireText(
  prototypeWrapperAdapterReviewPanel,
  "Rejection triggers",
  "AI prototype wrapper adapter review panel must expose rejection triggers.",
);
requireText(prototypeFixtureReplayReport, "sampleAiPrototypeFixtureReplayReports", "AI prototype fixture replay report data must exist.");
requireText(prototypeFixtureReplayReport, "prototype_fixture_replay_report", "AI prototype fixture replay report must name its record.");
requireText(prototypeFixtureReplayReport, "reviewed_unit_json_fixture", "AI prototype fixture replay report must require reviewed JSON fixtures.");
requireText(prototypeFixtureReplayReport, "No hard-coded unit text", "AI prototype fixture replay report must block hard-coded text.");
requireText(
  prototypeFixtureReplayReport,
  "Target-language text remains the only progress trigger",
  "AI prototype fixture replay report must preserve target-language progress.",
);
requireText(prototypeFixtureReplayReport, "Support-language progress trigger", "AI prototype fixture replay report must reject support-language progress.");
requireText(prototypeFixtureReplayReport, "No tenant hard-coded assets", "AI prototype fixture replay report must block tenant hard-coding.");
requireText(prototypeFixtureReplayReport, "Score or reward write inside prototype", "AI prototype fixture replay report must block score and reward writes.");
requireText(
  prototypeFixtureReplayReportPanel,
  "AI prototype fixture replay report",
  "AI prototype fixture replay report panel must expose heading.",
);
requireText(
  prototypeFixtureReplayReportPanel,
  "Reviewed JSON fixture replay",
  "AI prototype fixture replay report panel must expose fixture replay heading.",
);
requireText(
  prototypeFixtureReplayReportPanel,
  "Mode fixture replay reports",
  "AI prototype fixture replay report panel must expose mode replay reports.",
);
requireText(prototypeFixtureReplayReportPanel, "Fixture coverage", "AI prototype fixture replay report panel must expose fixture coverage.");
requireText(prototypeFixtureReplayReportPanel, "Replay evidence", "AI prototype fixture replay report panel must expose replay evidence.");
requireText(prototypeFixtureReplayReportPanel, "Failure triggers", "AI prototype fixture replay report panel must expose failure triggers.");
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
requireText(verifierSubmissionPacket, "MiniStar AI verifier packet", "MiniStar generator must expose a verifier packet.");
requireText(
  verifierSubmissionPacket,
  "ai-verifier-submission-ministar-l1-greetings-v1",
  "MiniStar verifier packet must be request-specific.",
);
requireText(
  verifierSubmissionPacket,
  "Hiragana support boundary",
  "MiniStar verifier packet must check the Foundation support-language boundary.",
);
requireText(
  verifierSubmissionPacket,
  "MiniStar media rights evidence attachments",
  "MiniStar verifier packet must keep media evidence blocked before approval.",
);
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
requireText(generatedPackageManifest, "MiniStar generated package manifest", "MiniStar generator must expose a generated package manifest.");
requireText(
  generatedPackageManifest,
  "ai-generated-package-manifest-ministar-l1-greetings-v1",
  "MiniStar generated package manifest must be request-specific.",
);
requireText(
  generatedPackageManifest,
  "MiniStar media rights not attached",
  "MiniStar generated package manifest must keep media rights missing until evidence exists.",
);
requireText(
  generatedPackageManifest,
  "MiniStar teacher approval not captured",
  "MiniStar generated package manifest must keep teacher approval missing until reviewer evidence exists.",
);
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
  generatedPackagePromotionChecklist,
  "sampleAiGeneratedPackagePromotionChecklists",
  "AI generated package promotion checklist data must exist.",
);
requireText(
  generatedPackagePromotionChecklist,
  "Draft-to-playable package pathway",
  "AI generated package promotion checklist must name the promotion pathway.",
);
requireText(
  generatedPackagePromotionChecklist,
  "No promote generated package button",
  "AI generated package promotion checklist must block direct promotion.",
);
requireText(
  generatedPackagePromotionChecklist,
  "No generated route registry write",
  "AI generated package promotion checklist must block route registry writes.",
);
requireText(
  generatedPackagePromotionChecklist,
  "No generated playlist write",
  "AI generated package promotion checklist must block playlist writes.",
);
requireText(
  generatedPackagePromotionChecklist,
  "No generated assignment write",
  "AI generated package promotion checklist must block assignment writes.",
);
requireText(
  generatedPackagePromotionChecklist,
  "No student-ready marker from promotion checklist",
  "AI generated package promotion checklist must block student-ready markers.",
);
requireText(
  generatedPackagePromotionChecklist,
  "No Japanese support-language promotion",
  "MiniStar promotion checklist must block support-language promotion.",
);
requireText(
  generatedPackagePromotionChecklist,
  "English is the target-language trigger",
  "MiniStar promotion checklist must preserve English target-language progression.",
);
requireText(
  generatedPackagePromotionChecklistPanel,
  "AI generated package promotion checklist",
  "AI generated package promotion panel must expose heading.",
);
requireText(
  generatedPackagePromotionChecklistPanel,
  "Draft-to-playable package pathway",
  "AI generated package promotion panel must expose pathway heading.",
);
requireText(
  generatedPackagePromotionChecklistPanel,
  "Promotion review only",
  "AI generated package promotion panel must expose review-only status.",
);
requireText(
  generatedPackagePromotionChecklistPanel,
  "Promotion checklist steps",
  "AI generated package promotion panel must expose checklist steps.",
);
requireText(
  generatedPackagePromotionChecklistPanel,
  "Blocked promotion actions",
  "AI generated package promotion panel must expose blocked actions.",
);
requireText(
  generatedPackagePromotionChecklistPanel,
  "Next promotion records",
  "AI generated package promotion panel must expose next records.",
);
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
requireText(
  generatedPackageReleaseCandidate,
  "sampleAiGeneratedPackageReleaseCandidates",
  "AI generated package release candidate data must exist.",
);
requireText(
  generatedPackageReleaseCandidate,
  "Private tenant library handoff blocked",
  "AI generated release candidate must keep private library handoff blocked.",
);
requireText(
  generatedPackageReleaseCandidate,
  "package_release_candidate",
  "AI generated release candidate must name package release candidate records.",
);
requireText(
  generatedPackageReleaseCandidate,
  "tenant_library_item",
  "AI generated release candidate must name tenant library item records.",
);
requireText(
  generatedPackageReleaseCandidate,
  "ai_generated_package_promotion_checklist",
  "AI generated release candidate must depend on promotion checklist records.",
);
requireText(
  generatedPackageReleaseCandidate,
  "ai_generated_publish_readiness_gate",
  "AI generated release candidate must depend on publish readiness records.",
);
requireText(
  generatedPackageReleaseCandidate,
  "No generated package library publish",
  "AI generated release candidate must block library publishing.",
);
requireText(
  generatedPackageReleaseCandidate,
  "No release candidate write",
  "AI generated release candidate must block release candidate writes.",
);
requireText(
  generatedPackageReleaseCandidate,
  "No tenant library item write",
  "AI generated release candidate must block tenant library writes.",
);
requireText(
  generatedPackageReleaseCandidate,
  "No student-facing release",
  "AI generated release candidate must block student-facing release.",
);
requireText(
  generatedPackageReleaseCandidate,
  "No Japanese support-language release",
  "MiniStar generated release candidate must block Japanese support-language release.",
);
requireText(
  generatedPackageReleaseCandidatePanel,
  "AI generated package release candidate",
  "AI generated release candidate panel must expose heading.",
);
requireText(
  generatedPackageReleaseCandidatePanel,
  "Private-library handoff preview",
  "AI generated release candidate panel must expose private-library handoff preview.",
);
requireText(
  generatedPackageReleaseCandidatePanel,
  "Review-only candidate",
  "AI generated release candidate panel must expose review-only state.",
);
requireText(
  generatedPackageReleaseCandidatePanel,
  "Release candidate signals",
  "AI generated release candidate panel must expose release candidate signals.",
);
requireText(
  generatedPackageReleaseCandidatePanel,
  "Blocked release actions",
  "AI generated release candidate panel must expose blocked release actions.",
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
requireText(lineageMap, "sampleAiGeneratorLineageMaps", "AI generator lineage map data must exist.");
requireText(lineageMap, "request-to-review lineage", "AI generator lineage map must name request-to-review lineage.");
requireText(lineageMap, "MiniStar request-to-review lineage", "MiniStar AI generator lineage must be request-specific.");
requireText(lineageMap, "No live generation from lineage map", "AI generator lineage map must block live generation.");
requireText(lineageMap, "No student assignment from lineage map", "AI generator lineage map must block assignment.");
requireText(lineageMap, "No Japanese support-language unlock from lineage map", "MiniStar lineage must block support-language progression.");
requireText(lineageMapPanel, "AI generator lineage map", "AI generator lineage panel must expose heading.");
requireText(lineageMapPanel, "Request-to-review chain", "AI generator lineage panel must expose request-to-review chain.");
requireText(lineageMapPanel, "Blocked lineage actions", "AI generator lineage panel must expose blocked lineage actions.");
requireText(lineageMapPanel, "Release boundary", "AI generator lineage panel must expose release boundaries.");
requireText(teacherDraftPackages, "AI-generated MiniStar greetings draft preview", "MiniStar AI generated draft must enter draft package data.");
requireText(
  teacherDraftPackages,
  "Japanese support remains hiragana-only and support-only.",
  "MiniStar AI generated draft must preserve support-language boundaries.",
);
requireText(
  teacherDraftReviewQueue,
  "queue-ai-draft-ministar-l1-greetings-v1",
  "MiniStar AI generated draft must enter the normal teacher review queue.",
);
requireText(
  teacherDraftReviewQueue,
  "Submit MiniStar AI draft to verifier",
  "MiniStar AI generated draft review queue must block verifier submission.",
);
requireText(
  teacherDraftReviewQueue,
  "MiniStar AI support language ready",
  "MiniStar AI generated draft review queue must expose hiragana support-language review.",
);
requireText(
  teacherDraftReviewQueue,
  "Assign MiniStar generated draft to students",
  "MiniStar AI generated draft review queue must block student assignment.",
);
requireText(route, "AiGameGeneratorPlanPanel", "Generator route must render the generator panel.");
requireText(route, "AiGeneratorTenantCoveragePanel", "Generator route must render the tenant coverage panel.");
requireText(route, "AiGeneratorLineageMapPanel", "Generator route must render the lineage map panel.");
requireText(route, "AiEngineBindingPlanPanel", "Generator route must render the engine binding panel.");
requireText(route, "AiGeneratedGameBuildBriefPanel", "Generator route must render the generated game build brief panel.");
requireText(route, "AiPrototypeReturnReviewPanel", "Generator route must render the prototype return review panel.");
requireText(route, "AiPrototypeIntegrationPlanPanel", "Generator route must render the prototype integration plan panel.");
requireText(route, "AiPrototypeWrapperAdapterReviewPanel", "Generator route must render the prototype wrapper adapter review panel.");
requireText(route, "AiPrototypeFixtureReplayReportPanel", "Generator route must render the prototype fixture replay report panel.");
requireText(route, "AiPromptPackagePlanPanel", "Generator route must render the prompt package plan panel.");
requireText(route, "AiGeneratorCostEntitlementGatePanel", "Generator route must render the cost entitlement gate panel.");
requireText(route, "AiGenerationRequestBuilderPanel", "Generator route must render the request builder panel.");
requireText(route, "AiGeneratorAudioCoveragePlanPanel", "Generator route must render the audio coverage plan panel.");
requireText(route, "AiGamificationMappingPanel", "Generator route must render the gamification mapping panel.");
requireText(route, "AiRewardReadinessGatePanel", "Generator route must render the reward readiness gate panel.");
requireText(route, "AiVerifierSubmissionPacketPanel", "Generator route must render the verifier submission packet panel.");
requireText(route, "AiModeRecommendationPanel", "Generator route must render the mode recommendation panel.");
requireText(route, "AiGeneratedPackageManifestPanel", "Generator route must render the generated package manifest panel.");
requireText(
  route,
  "AiGeneratedPackagePromotionChecklistPanel",
  "Generator route must render the generated package promotion checklist panel.",
);
requireText(route, "AiGeneratedPublishReadinessGatePanel", "Generator route must render the generated publish readiness gate panel.");
requireText(route, "AiGeneratedDraftPayloadPreviewPanel", "Generator route must render the draft payload preview panel.");
requireText(route, "AiDraftCorrectionQueuePanel", "Generator route must render the draft correction queue panel.");
requireText(route, "sampleAiGameGeneratorPlan", "Generator route must use the sample generator plan.");
requireText(route, "sampleAiGeneratorTenantCoverage", "Generator route must use tenant coverage data.");
requireText(route, "sampleAiGeneratorLineageMaps", "Generator route must use lineage map data.");
requireText(route, "sampleAiEngineBindingPlans", "Generator route must use the sample engine binding plan data.");
requireText(route, "sampleAiGeneratedGameBuildBriefPackets", "Generator route must use generated game build brief data.");
requireText(route, "sampleAiPrototypeReturnReviewPackets", "Generator route must use prototype return review data.");
requireText(route, "sampleAiPrototypeIntegrationPlans", "Generator route must use prototype integration plan data.");
requireText(route, "sampleAiPrototypeWrapperAdapterReviews", "Generator route must use prototype wrapper adapter review data.");
requireText(route, "sampleAiPrototypeFixtureReplayReports", "Generator route must use prototype fixture replay report data.");
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
  "sampleAiGeneratedPackagePromotionChecklists",
  "Generator route must use the sample generated package promotion checklist data.",
);
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
