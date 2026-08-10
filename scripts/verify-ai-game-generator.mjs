import { readFileSync } from "node:fs";

const plan = readSource("../apps/web/src/data/sampleAiGameGeneratorPlan.ts");
const tenantCoverage = readSource("../apps/web/src/data/sampleAiGeneratorTenantCoverage.ts");
const lineageMap = readSource("../apps/web/src/data/sampleAiGeneratorLineageMap.ts");
const reviewSummary = readSource("../apps/web/src/data/sampleAiGeneratorReviewSummary.ts");
const reviewerRunbook = readSource("../apps/web/src/data/sampleAiGeneratorReviewerRunbook.ts");
const responsibilityMatrix = readSource("../apps/web/src/data/sampleAiGeneratorResponsibilityMatrix.ts");
const engineBindingPlan = readSource("../apps/web/src/data/sampleAiEngineBindingPlan.ts");
const promptPackagePlan = readSource("../apps/web/src/data/sampleAiPromptPackagePlan.ts");
const costEntitlementGate = readSource("../apps/web/src/data/sampleAiGeneratorCostEntitlementGate.ts");
const requestBuilderData = readSource("../apps/web/src/data/sampleAiGenerationRequestBuilder.ts");
const audioCoveragePlan = readSource("../apps/web/src/data/sampleAiGeneratorAudioCoveragePlan.ts");
const gamificationMappingPlan = readSource("../apps/web/src/data/sampleAiGamificationMappingPlan.ts");
const rewardReadinessGate = readSource("../apps/web/src/data/sampleAiRewardReadinessGate.ts");
const generatedGameBuildBrief = readSource("../apps/web/src/data/sampleAiGeneratedGameBuildBrief.ts");
const externalPrototypeTaskPacket = readSource("../apps/web/src/data/sampleAiExternalPrototypeTaskPacket.ts");
const externalPrototypeTaskExportReadinessGate = readSource(
  "../apps/web/src/data/sampleAiExternalPrototypeTaskExportReadinessGate.ts",
);
const prototypeReturnReview = readSource("../apps/web/src/data/sampleAiPrototypeReturnReview.ts");
const prototypeIntegrationPlan = readSource("../apps/web/src/data/sampleAiPrototypeIntegrationPlan.ts");
const prototypeWrapperAdapterReview = readSource("../apps/web/src/data/sampleAiPrototypeWrapperAdapterReview.ts");
const prototypeFixtureReplayReport = readSource("../apps/web/src/data/sampleAiPrototypeFixtureReplayReport.ts");
const prototypeEventReplayReport = readSource("../apps/web/src/data/sampleAiPrototypeEventReplayReport.ts");
const prototypeAudioCoverageReport = readSource("../apps/web/src/data/sampleAiPrototypeAudioCoverageReport.ts");
const prototypeMobileAccessibilityReport = readSource(
  "../apps/web/src/data/sampleAiPrototypeMobileAccessibilityReport.ts",
);
const prototypeScoringReplayReport = readSource("../apps/web/src/data/sampleAiPrototypeScoringReplayReport.ts");
const prototypeCodexIntegrationDecision = readSource(
  "../apps/web/src/data/sampleAiPrototypeCodexIntegrationDecision.ts",
);
const prototypeIntegrationReadinessGate = readSource(
  "../apps/web/src/data/sampleAiPrototypeIntegrationReadinessGate.ts",
);
const prototypeAppPatchProposal = readSource("../apps/web/src/data/sampleAiPrototypeAppPatchProposal.ts");
const prototypePatchTestReadinessGate = readSource(
  "../apps/web/src/data/sampleAiPrototypePatchTestReadinessGate.ts",
);
const prototypePatchTestHarnessPlan = readSource("../apps/web/src/data/sampleAiPrototypePatchTestHarnessPlan.ts");
const prototypePatchHarnessImplementationProposal = readSource(
  "../apps/web/src/data/sampleAiPrototypePatchHarnessImplementationProposal.ts",
);
const verifierSubmissionPacket = readSource("../apps/web/src/data/sampleAiVerifierSubmissionPacket.ts");
const generatedPackageManifest = readSource("../apps/web/src/data/sampleAiGeneratedPackageManifest.ts");
const generatedPackagePromotionChecklist = readSource(
  "../apps/web/src/data/sampleAiGeneratedPackagePromotionChecklist.ts",
);
const generatedPackageReleaseCandidate = readSource("../apps/web/src/data/sampleAiGeneratedPackageReleaseCandidate.ts");
const generatedPackageAssemblyReadiness = readSource(
  "../apps/web/src/data/sampleAiGeneratedPackageAssemblyReadiness.ts",
);
const generatedPackageAssemblyDryRun = readSource("../apps/web/src/data/sampleAiGeneratedPackageAssemblyDryRun.ts");
const generatedPackageWriterPreflight = readSource("../apps/web/src/data/sampleAiGeneratedPackageWriterPreflight.ts");
const generatedPackageWriterRollbackDrill = readSource(
  "../apps/web/src/data/sampleAiGeneratedPackageWriterRollbackDrill.ts",
);
const generatedPackageWriterImplementationReadiness = readSource(
  "../apps/web/src/data/sampleAiGeneratedPackageWriterImplementationReadiness.ts",
);
const generatedPackageWriterModuleTestPlan = readSource(
  "../apps/web/src/data/sampleAiGeneratedPackageWriterModuleTestPlan.ts",
);
const generatedPackageWriterTestEvidencePacket = readSource(
  "../apps/web/src/data/sampleAiGeneratedPackageWriterTestEvidencePacket.ts",
);
const generatedPackageWriterTestHarnessPlan = readSource(
  "../apps/web/src/data/sampleAiGeneratedPackageWriterTestHarnessPlan.ts",
);
const generatedPublishReadinessGate = readSource("../apps/web/src/data/sampleAiGeneratedPublishReadinessGate.ts");
const draftPreviewData = readSource("../apps/web/src/data/sampleAiGeneratedDraftPayloadPreview.ts");
const draftPayloadValidator = readSource("../packages/content-model/src/aiGeneratedDraftPayload.ts");
const correctionQueueData = readSource("../apps/web/src/data/sampleAiDraftCorrectionQueue.ts");
const compatibilityMatrix = readSource("../apps/web/src/data/sampleActivityPathwayCompatibility.ts");
const panel = readSource("../apps/web/src/features/content-intake/AiGameGeneratorPlanPanel.tsx");
const tenantCoveragePanel = readSource("../apps/web/src/features/content-intake/AiGeneratorTenantCoveragePanel.tsx");
const lineageMapPanel = readSource("../apps/web/src/features/content-intake/AiGeneratorLineageMapPanel.tsx");
const reviewSummaryPanel = readSource("../apps/web/src/features/content-intake/AiGeneratorReviewSummaryPanel.tsx");
const reviewerRunbookPanel = readSource("../apps/web/src/features/content-intake/AiGeneratorReviewerRunbookPanel.tsx");
const responsibilityMatrixPanel = readSource(
  "../apps/web/src/features/content-intake/AiGeneratorResponsibilityMatrixPanel.tsx",
);
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
const externalPrototypeTaskPacketPanel = readSource(
  "../apps/web/src/features/content-intake/AiExternalPrototypeTaskPacketPanel.tsx",
);
const externalPrototypeTaskExportReadinessGatePanel = readSource(
  "../apps/web/src/features/content-intake/AiExternalPrototypeTaskExportReadinessGatePanel.tsx",
);
const generatorSectionNav = readSource("../apps/web/src/features/content-intake/AiGeneratorSectionNav.tsx");
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
const prototypeEventReplayReportPanel = readSource(
  "../apps/web/src/features/content-intake/AiPrototypeEventReplayReportPanel.tsx",
);
const prototypeAudioCoverageReportPanel = readSource(
  "../apps/web/src/features/content-intake/AiPrototypeAudioCoverageReportPanel.tsx",
);
const prototypeMobileAccessibilityReportPanel = readSource(
  "../apps/web/src/features/content-intake/AiPrototypeMobileAccessibilityReportPanel.tsx",
);
const prototypeScoringReplayReportPanel = readSource(
  "../apps/web/src/features/content-intake/AiPrototypeScoringReplayReportPanel.tsx",
);
const prototypeCodexIntegrationDecisionPanel = readSource(
  "../apps/web/src/features/content-intake/AiPrototypeCodexIntegrationDecisionPanel.tsx",
);
const prototypeIntegrationReadinessGatePanel = readSource(
  "../apps/web/src/features/content-intake/AiPrototypeIntegrationReadinessGatePanel.tsx",
);
const prototypeAppPatchProposalPanel = readSource(
  "../apps/web/src/features/content-intake/AiPrototypeAppPatchProposalPanel.tsx",
);
const prototypePatchTestReadinessGatePanel = readSource(
  "../apps/web/src/features/content-intake/AiPrototypePatchTestReadinessGatePanel.tsx",
);
const prototypePatchTestHarnessPlanPanel = readSource(
  "../apps/web/src/features/content-intake/AiPrototypePatchTestHarnessPlanPanel.tsx",
);
const prototypePatchHarnessImplementationProposalPanel = readSource(
  "../apps/web/src/features/content-intake/AiPrototypePatchHarnessImplementationProposalPanel.tsx",
);
const verifierSubmissionPanel = readSource("../apps/web/src/features/content-intake/AiVerifierSubmissionPacketPanel.tsx");
const generatedPackageManifestPanel = readSource("../apps/web/src/features/content-intake/AiGeneratedPackageManifestPanel.tsx");
const generatedPackagePromotionChecklistPanel = readSource(
  "../apps/web/src/features/content-intake/AiGeneratedPackagePromotionChecklistPanel.tsx",
);
const generatedPackageReleaseCandidatePanel = readSource(
  "../apps/web/src/features/content-intake/AiGeneratedPackageReleaseCandidatePanel.tsx",
);
const generatedPackageAssemblyReadinessPanel = readSource(
  "../apps/web/src/features/content-intake/AiGeneratedPackageAssemblyReadinessPanel.tsx",
);
const generatedPackageAssemblyDryRunPanel = readSource(
  "../apps/web/src/features/content-intake/AiGeneratedPackageAssemblyDryRunPanel.tsx",
);
const generatedPackageWriterPreflightPanel = readSource(
  "../apps/web/src/features/content-intake/AiGeneratedPackageWriterPreflightPanel.tsx",
);
const generatedPackageWriterRollbackDrillPanel = readSource(
  "../apps/web/src/features/content-intake/AiGeneratedPackageWriterRollbackDrillPanel.tsx",
);
const generatedPackageWriterImplementationReadinessPanel = readSource(
  "../apps/web/src/features/content-intake/AiGeneratedPackageWriterImplementationReadinessPanel.tsx",
);
const generatedPackageWriterModuleTestPlanPanel = readSource(
  "../apps/web/src/features/content-intake/AiGeneratedPackageWriterModuleTestPlanPanel.tsx",
);
const generatedPackageWriterTestEvidencePacketPanel = readSource(
  "../apps/web/src/features/content-intake/AiGeneratedPackageWriterTestEvidencePacketPanel.tsx",
);
const generatedPackageWriterTestHarnessPlanPanel = readSource(
  "../apps/web/src/features/content-intake/AiGeneratedPackageWriterTestHarnessPlanPanel.tsx",
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
requireText(externalPrototypeTaskPacket, "sampleAiExternalPrototypeTaskPackets", "AI external prototype task packet data must exist.");
requireText(externalPrototypeTaskPacket, "External builder task handoff / Z.ai", "AI external task packet must identify external builder handoff.");
requireText(externalPrototypeTaskPacket, "Copy-ready task brief preview", "AI external task packet must remain copy-ready preview only.");
requireText(externalPrototypeTaskPacket, "Drewsure/ministar-lab only", "AI external task packet must scope output to ministar-lab.");
requireText(externalPrototypeTaskPacket, "Phaser wrapper candidate", "AI external task packet must preserve Phaser wrapper candidates.");
requireText(externalPrototypeTaskPacket, "DOM reference required", "AI external task packet must preserve DOM reference tasks.");
requireText(externalPrototypeTaskPacket, "Event log evidence required", "AI external task packet must require event evidence.");
requireText(externalPrototypeTaskPacket, "Audio cue coverage required", "AI external task packet must require audio evidence.");
requireText(externalPrototypeTaskPacket, "Codex integration review required", "AI external task packet must require Codex review.");
requireText(externalPrototypeTaskPacket, "No live handoff", "AI external task packet must block live handoff.");
requireText(externalPrototypeTaskPacket, "No app file writes", "AI external task packet must block app file writes.");
requireText(externalPrototypeTaskPacket, "No scoring authority", "AI external task packet must block scoring authority.");
requireText(externalPrototypeTaskPacket, "No student assignment", "AI external task packet must block student assignment.");
requireText(
  externalPrototypeTaskPacket,
  "No Japanese support-language progress",
  "MiniStar external task packet must block Japanese support-language progress.",
);
requireText(
  externalPrototypeTaskPacketPanel,
  "AI external prototype task packet",
  "AI external prototype task packet panel must expose heading.",
);
requireText(
  externalPrototypeTaskPacketPanel,
  "Copy-ready task brief preview",
  "AI external prototype task packet panel must expose copy-ready preview title.",
);
requireText(
  externalPrototypeTaskPacketPanel,
  "External builder task handoff",
  "AI external prototype task packet panel must expose external task handoff.",
);
requireText(
  externalPrototypeTaskPacketPanel,
  "Drewsure/ministar-lab only",
  "AI external prototype task packet panel must expose repository scope.",
);
requireText(
  externalPrototypeTaskPacketPanel,
  "No live handoff",
  "AI external prototype task packet panel must block live handoff.",
);
requireText(
  externalPrototypeTaskPacketPanel,
  "Blocked task actions",
  "AI external prototype task packet panel must show blocked task actions.",
);
requireText(
  externalPrototypeTaskExportReadinessGate,
  "sampleAiExternalPrototypeTaskExportReadinessGates",
  "AI external task export readiness gate data must exist.",
);
requireText(
  externalPrototypeTaskExportReadinessGate,
  "AI external task export readiness gate",
  "AI external task export readiness gate must name the gate.",
);
requireText(
  externalPrototypeTaskExportReadinessGate,
  "Export readiness blocked",
  "AI external task export readiness gate must remain blocked.",
);
requireText(
  externalPrototypeTaskExportReadinessGate,
  "No task export",
  "AI external task export readiness gate must block task export.",
);
requireText(
  externalPrototypeTaskExportReadinessGate,
  "No prompt copy action",
  "AI external task export readiness gate must block prompt copy.",
);
requireText(
  externalPrototypeTaskExportReadinessGate,
  "No repository issue creation",
  "AI external task export readiness gate must block repository issue creation.",
);
requireText(
  externalPrototypeTaskExportReadinessGate,
  "No archive download",
  "AI external task export readiness gate must block archive download.",
);
requireText(
  externalPrototypeTaskExportReadinessGate,
  "Reviewer identity required",
  "AI external task export readiness gate must require reviewer identity.",
);
requireText(
  externalPrototypeTaskExportReadinessGate,
  "Evidence storage required",
  "AI external task export readiness gate must require evidence storage.",
);
requireText(
  externalPrototypeTaskExportReadinessGate,
  "External builder repository policy required",
  "AI external task export readiness gate must require repository policy.",
);
requireText(
  externalPrototypeTaskExportReadinessGate,
  "Codex owner confirmation required",
  "AI external task export readiness gate must require Codex owner confirmation.",
);
requireText(
  externalPrototypeTaskExportReadinessGate,
  "No Japanese support-language progress",
  "MiniStar external task export readiness gate must block Japanese support-language progress.",
);
requireText(
  externalPrototypeTaskExportReadinessGatePanel,
  "AI external task export readiness gate",
  "AI external task export readiness gate panel must expose heading.",
);
requireText(
  externalPrototypeTaskExportReadinessGatePanel,
  "Export readiness blocked",
  "AI external task export readiness gate panel must expose blocked title.",
);
requireText(
  externalPrototypeTaskExportReadinessGatePanel,
  "No task export",
  "AI external task export readiness gate panel must block task export.",
);
requireText(
  externalPrototypeTaskExportReadinessGatePanel,
  "Export channels",
  "AI external task export readiness gate panel must expose export channels.",
);
requireText(
  externalPrototypeTaskExportReadinessGatePanel,
  "Readiness checks",
  "AI external task export readiness gate panel must expose readiness checks.",
);
requireText(generatorSectionNav, "Generator route map", "AI generator route map component must expose heading.");
requireText(generatorSectionNav, "Request setup", "AI generator route map must expose request setup section.");
requireText(generatorSectionNav, "Prototype review", "AI generator route map must expose prototype review section.");
requireText(generatorSectionNav, "Integration gates", "AI generator route map must expose integration gates section.");
requireText(generatorSectionNav, "Package review", "AI generator route map must expose package review section.");
requireText(generatorSectionNav, "Draft repair", "AI generator route map must expose draft repair section.");
requireText(reviewSummary, "sampleAiGeneratorReviewSummaries", "AI generator review summary data must exist.");
requireText(reviewSummary, "sample-publisher-l1-routines-game-draft", "AI generator review summary must include sample publisher request.");
requireText(reviewSummary, "ministar-l1-greetings-game-draft", "AI generator review summary must include MiniStar request.");
requireText(reviewSummary, "codex_integration_review_decision", "AI generator review summary must require Codex decision records.");
requireText(reviewSummary, "package_publish_gate", "AI generator review summary must require package publish gate.");
requireText(reviewSummary, "No app file writes", "AI generator review summary must block app file writes.");
requireText(reviewSummary, "No student assignment", "AI generator review summary must block student assignment.");
requireText(reviewSummary, "No Japanese support-language trigger", "MiniStar review summary must block support-language triggers.");
requireText(reviewSummary, "English target-language actions", "MiniStar review summary must preserve English target-language trigger.");
requireText(reviewSummaryPanel, "AI generator review summary", "AI generator review summary panel must expose heading.");
requireText(reviewSummaryPanel, "Section readiness rollup", "AI generator review summary panel must expose rollup heading.");
requireText(reviewSummaryPanel, "No live generation", "AI generator review summary panel must block live generation.");
requireText(reviewSummaryPanel, "Primary blocker", "AI generator review summary panel must show blockers.");
requireText(reviewSummaryPanel, "Next required record", "AI generator review summary panel must show next records.");
requireText(reviewSummaryPanel, "Blocked actions", "AI generator review summary panel must show blocked actions.");
requireText(reviewSummaryPanel, "Source records", "AI generator review summary panel must show source records.");
requireText(
  checks,
  "AI generator review summary storage contract",
  "AI generator checks must mention review summary storage contract.",
);
requireText(reviewerRunbook, "sampleAiGeneratorReviewerRunbooks", "AI generator reviewer runbook data must exist.");
requireText(reviewerRunbook, "Human review order", "AI generator reviewer runbook must name human review order.");
requireText(reviewerRunbook, "Reviewer runbook is guidance only", "AI generator reviewer runbook must remain guidance only.");
requireText(reviewerRunbook, "Detailed source records remain authoritative", "AI generator reviewer runbook must keep source records authoritative.");
requireText(reviewerRunbook, "No live model call", "AI generator reviewer runbook must block live model calls.");
requireText(reviewerRunbook, "No app patch generation", "AI generator reviewer runbook must block app patch generation.");
requireText(reviewerRunbook, "No package assembly", "AI generator reviewer runbook must block package assembly.");
requireText(reviewerRunbook, "No route or playlist creation", "AI generator reviewer runbook must block route and playlist creation.");
requireText(reviewerRunbook, "No student assignment", "AI generator reviewer runbook must block student assignment.");
requireText(reviewerRunbook, "English is the target-language trigger", "MiniStar reviewer runbook must preserve English target-language trigger.");
requireText(reviewerRunbook, "No Japanese support-language trigger", "MiniStar reviewer runbook must block support-language triggers.");
requireText(reviewerRunbookPanel, "AI generator reviewer runbook", "AI generator reviewer runbook panel must expose heading.");
requireText(reviewerRunbookPanel, "Human review order", "AI generator reviewer runbook panel must expose review order.");
requireText(reviewerRunbookPanel, "Standing rules", "AI generator reviewer runbook panel must expose standing rules.");
requireText(reviewerRunbookPanel, "Evidence to review", "AI generator reviewer runbook panel must show evidence.");
requireText(reviewerRunbookPanel, "Blocked shortcuts", "AI generator reviewer runbook panel must show blocked shortcuts.");
requireText(responsibilityMatrix, "sampleAiGeneratorResponsibilityMatrices", "AI generator responsibility matrix data must exist.");
requireText(responsibilityMatrix, "Codex owns architecture and integration", "AI generator responsibility matrix must name Codex architecture ownership.");
requireText(responsibilityMatrix, "External AI builder / Z.ai", "AI generator responsibility matrix must name outside AI builder role.");
requireText(responsibilityMatrix, "No app file writes", "AI generator responsibility matrix must block app file writes.");
requireText(responsibilityMatrix, "No scoring authority", "AI generator responsibility matrix must block scoring authority.");
requireText(responsibilityMatrix, "Verifier layer", "AI generator responsibility matrix must name verifier role.");
requireText(responsibilityMatrix, "Platform admin", "AI generator responsibility matrix must name platform admin role.");
requireText(responsibilityMatrix, "Support language cannot unlock progress", "AI generator responsibility matrix must block support-language progress.");
requireText(responsibilityMatrix, "Japanese support cannot unlock progress", "MiniStar responsibility matrix must block Japanese support-language progress.");
requireText(responsibilityMatrixPanel, "AI generator responsibility matrix", "AI generator responsibility matrix panel must expose heading.");
requireText(responsibilityMatrixPanel, "Who owns each generator handoff", "AI generator responsibility matrix panel must expose ownership heading.");
requireText(responsibilityMatrixPanel, "Handoff records", "AI generator responsibility matrix panel must expose handoff records.");
requireText(responsibilityMatrixPanel, "Cannot do", "AI generator responsibility matrix panel must expose blocked owner actions.");
requireText(responsibilityMatrixPanel, "No live handoff", "AI generator responsibility matrix panel must block live handoff.");
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
requireText(
  prototypeIntegrationPlan,
  "prototype_mobile_accessibility_report",
  "AI prototype integration plan must name mobile accessibility report.",
);
requireText(
  prototypeIntegrationPlan,
  "Run deterministic scoring replay",
  "AI prototype integration plan must require deterministic scoring replay.",
);
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
requireText(prototypeEventReplayReport, "sampleAiPrototypeEventReplayReports", "AI prototype event replay report data must exist.");
requireText(prototypeEventReplayReport, "prototype_event_replay_report", "AI prototype event replay report must name its record.");
requireText(prototypeEventReplayReport, "standard_event_contract", "AI prototype event replay report must require standard event contracts.");
requireText(prototypeEventReplayReport, "progress_event_acceptance_map", "AI prototype event replay report must require progress event acceptance.");
requireText(prototypeEventReplayReport, "game_started", "AI prototype event replay report must include game_started.");
requireText(prototypeEventReplayReport, "answer_result", "AI prototype event replay report must include answer_result.");
requireText(prototypeEventReplayReport, "mastery_updated", "AI prototype event replay report must include mastery_updated.");
requireText(prototypeEventReplayReport, "No hidden local progress counter", "AI prototype event replay report must block hidden progress.");
requireText(prototypeEventReplayReport, "No direct score authority", "AI prototype event replay report must block direct score authority.");
requireText(prototypeEventReplayReport, "No reward inventory write", "AI prototype event replay report must block reward inventory writes.");
requireText(
  prototypeEventReplayReport,
  "No Japanese support-language event can unlock English progress",
  "AI prototype event replay report must block MiniStar support-language events.",
);
requireText(
  prototypeEventReplayReportPanel,
  "AI prototype event replay report",
  "AI prototype event replay report panel must expose heading.",
);
requireText(
  prototypeEventReplayReportPanel,
  "Standard event replay",
  "AI prototype event replay report panel must expose event replay heading.",
);
requireText(
  prototypeEventReplayReportPanel,
  "Mode event replay reports",
  "AI prototype event replay report panel must expose mode replay reports.",
);
requireText(prototypeEventReplayReportPanel, "Required order", "AI prototype event replay report panel must expose event order.");
requireText(
  prototypeEventReplayReportPanel,
  "Allowed payload fields",
  "AI prototype event replay report panel must expose payload field rules.",
);
requireText(
  prototypeEventReplayReportPanel,
  "Accepted effects",
  "AI prototype event replay report panel must expose accepted progress effects.",
);
requireText(prototypeAudioCoverageReport, "sampleAiPrototypeAudioCoverageReports", "AI prototype audio coverage report data must exist.");
requireText(prototypeAudioCoverageReport, "prototype_audio_coverage_report", "AI prototype audio coverage report must name its record.");
requireText(prototypeAudioCoverageReport, "audio_cue_manifest", "AI prototype audio coverage report must require audio cue manifests.");
requireText(
  prototypeAudioCoverageReport,
  "package_game_audio_coverage",
  "AI prototype audio coverage report must require package game audio coverage.",
);
requireText(
  prototypeAudioCoverageReport,
  "background_media_policy_binding",
  "AI prototype audio coverage report must require background media policy binding.",
);
requireText(prototypeAudioCoverageReport, "No target-language text without audio", "AI prototype audio coverage report must block missing target audio.");
requireText(prototypeAudioCoverageReport, "Tap-to-speak coverage", "AI prototype audio coverage report must require tap-to-speak evidence.");
requireText(prototypeAudioCoverageReport, "Submit controls have separate listen or replay controls", "AI prototype audio coverage report must require control replay.");
requireText(prototypeAudioCoverageReport, "No generated voice call", "AI prototype audio coverage report must block generated voice calls.");
requireText(prototypeAudioCoverageReport, "No voice API cost", "AI prototype audio coverage report must block voice API cost.");
requireText(prototypeAudioCoverageReport, "No media-only mastery", "AI prototype audio coverage report must block media-only mastery.");
requireText(prototypeAudioCoverageReport, "No support-language progress trigger", "AI prototype audio coverage report must block support-language progress.");
requireText(
  prototypeAudioCoverageReport,
  "No Japanese support-language audio can unlock English progress",
  "AI prototype audio coverage report must block MiniStar Japanese support-language audio progression.",
);
requireText(
  prototypeAudioCoverageReportPanel,
  "AI prototype audio coverage report",
  "AI prototype audio coverage report panel must expose heading.",
);
requireText(
  prototypeAudioCoverageReportPanel,
  "Tap-to-speak coverage",
  "AI prototype audio coverage report panel must expose tap-to-speak heading.",
);
requireText(
  prototypeAudioCoverageReportPanel,
  "Mode audio coverage reports",
  "AI prototype audio coverage report panel must expose mode audio reports.",
);
requireText(
  prototypeAudioCoverageReportPanel,
  "Target-language checks",
  "AI prototype audio coverage report panel must expose target-language checks.",
);
requireText(
  prototypeAudioCoverageReportPanel,
  "Control audio checks",
  "AI prototype audio coverage report panel must expose control audio checks.",
);
requireText(
  prototypeAudioCoverageReportPanel,
  "Support-language rules",
  "AI prototype audio coverage report panel must expose support-language rules.",
);
requireText(
  prototypeMobileAccessibilityReport,
  "sampleAiPrototypeMobileAccessibilityReports",
  "AI prototype mobile accessibility report data must exist.",
);
requireText(
  prototypeMobileAccessibilityReport,
  "prototype_mobile_accessibility_report",
  "AI prototype mobile accessibility report must name its record.",
);
requireText(
  prototypeMobileAccessibilityReport,
  "Mobile viewport smoke evidence",
  "AI prototype mobile accessibility report must require mobile viewport smoke evidence.",
);
requireText(
  prototypeMobileAccessibilityReport,
  "Touch target checks",
  "AI prototype mobile accessibility report must require touch target checks.",
);
requireText(
  prototypeMobileAccessibilityReport,
  "Keyboard and focus checks",
  "AI prototype mobile accessibility report must require keyboard and focus checks.",
);
requireText(
  prototypeMobileAccessibilityReport,
  "No text hidden inside black buttons",
  "AI prototype mobile accessibility report must block hidden black-button text.",
);
requireText(
  prototypeMobileAccessibilityReport,
  "No viewport overflow",
  "AI prototype mobile accessibility report must block viewport overflow.",
);
requireText(
  prototypeMobileAccessibilityReport,
  "No unreadable learner control",
  "AI prototype mobile accessibility report must block unreadable learner controls.",
);
requireText(
  prototypeMobileAccessibilityReport,
  "Canvas wrapper exposes DOM controls",
  "AI prototype mobile accessibility report must require accessible Phaser/canvas wrapper controls.",
);
requireText(
  prototypeMobileAccessibilityReport,
  "Foundation Japanese support remains hiragana-readable",
  "AI prototype mobile accessibility report must preserve MiniStar hiragana readability.",
);
requireText(
  prototypeMobileAccessibilityReport,
  "No student-facing preview from returned code",
  "AI prototype mobile accessibility report must block student-facing previews.",
);
requireText(
  prototypeMobileAccessibilityReportPanel,
  "AI prototype mobile accessibility report",
  "AI prototype mobile accessibility report panel must expose heading.",
);
requireText(
  prototypeMobileAccessibilityReportPanel,
  "Mobile and accessibility inspection",
  "AI prototype mobile accessibility report panel must expose mobile inspection heading.",
);
requireText(
  prototypeMobileAccessibilityReportPanel,
  "Mode mobile/accessibility reports",
  "AI prototype mobile accessibility report panel must expose mode reports.",
);
requireText(
  prototypeMobileAccessibilityReportPanel,
  "Viewport checks",
  "AI prototype mobile accessibility report panel must expose viewport checks.",
);
requireText(
  prototypeMobileAccessibilityReportPanel,
  "Touch target checks",
  "AI prototype mobile accessibility report panel must expose touch target checks.",
);
requireText(
  prototypeMobileAccessibilityReportPanel,
  "Keyboard and focus checks",
  "AI prototype mobile accessibility report panel must expose keyboard and focus checks.",
);
requireText(
  prototypeMobileAccessibilityReportPanel,
  "Readable text checks",
  "AI prototype mobile accessibility report panel must expose readable text checks.",
);
requireText(
  prototypeScoringReplayReport,
  "sampleAiPrototypeScoringReplayReports",
  "AI prototype scoring replay report data must exist.",
);
requireText(
  prototypeScoringReplayReport,
  "prototype_scoring_replay_report",
  "AI prototype scoring replay report must name its record.",
);
requireText(
  prototypeScoringReplayReport,
  "game_scoring_profile_snapshot",
  "AI prototype scoring replay report must require scoring profile snapshots.",
);
requireText(
  prototypeScoringReplayReport,
  "progress_event_acceptance_map",
  "AI prototype scoring replay report must require progress event acceptance maps.",
);
requireText(
  prototypeScoringReplayReport,
  "collection_unlock_binding",
  "AI prototype scoring replay report must preserve collection unlock boundaries.",
);
requireText(
  prototypeScoringReplayReport,
  "Deterministic scoring replay",
  "AI prototype scoring replay report must require deterministic scoring replay.",
);
requireText(prototypeScoringReplayReport, "1,000 Star Dust cap", "AI prototype scoring replay report must preserve Star Dust cap.");
requireText(prototypeScoringReplayReport, "No direct score authority", "AI prototype scoring replay report must block direct score authority.");
requireText(prototypeScoringReplayReport, "No reward inventory write", "AI prototype scoring replay report must block reward inventory writes.");
requireText(prototypeScoringReplayReport, "No random reward", "AI prototype scoring replay report must block random rewards.");
requireText(prototypeScoringReplayReport, "No media-only Star Dust", "AI prototype scoring replay report must block media-only Star Dust.");
requireText(
  prototypeScoringReplayReport,
  "No support-language-only mastery",
  "AI prototype scoring replay report must block support-language-only mastery.",
);
requireText(
  prototypeScoringReplayReport,
  "No Japanese support-language scoring or release",
  "AI prototype scoring replay report must block MiniStar Japanese support-language scoring.",
);
requireText(
  prototypeScoringReplayReportPanel,
  "AI prototype scoring replay report",
  "AI prototype scoring replay report panel must expose heading.",
);
requireText(
  prototypeScoringReplayReportPanel,
  "Deterministic scoring replay",
  "AI prototype scoring replay report panel must expose scoring replay heading.",
);
requireText(
  prototypeScoringReplayReportPanel,
  "Mode scoring replay reports",
  "AI prototype scoring replay report panel must expose mode reports.",
);
requireText(
  prototypeScoringReplayReportPanel,
  "Score replay checks",
  "AI prototype scoring replay report panel must expose score replay checks.",
);
requireText(
  prototypeScoringReplayReportPanel,
  "Mastery replay checks",
  "AI prototype scoring replay report panel must expose mastery replay checks.",
);
requireText(
  prototypeScoringReplayReportPanel,
  "Reward boundary checks",
  "AI prototype scoring replay report panel must expose reward boundary checks.",
);
requireText(
  prototypeCodexIntegrationDecision,
  "sampleAiPrototypeCodexIntegrationDecisions",
  "AI prototype Codex integration decision data must exist.",
);
requireText(
  prototypeCodexIntegrationDecision,
  "Codex integration review decision",
  "AI prototype Codex integration decision must expose manual decision records.",
);
requireText(
  prototypeCodexIntegrationDecision,
  "No decision recorded",
  "AI prototype Codex integration decision must keep decisions unrecorded until evidence passes.",
);
requireText(
  prototypeCodexIntegrationDecision,
  "No apps/web patch generation",
  "AI prototype Codex integration decision must block app patch generation.",
);
requireText(
  prototypeCodexIntegrationDecision,
  "ai_prototype_integration_readiness_gate",
  "AI prototype Codex integration decision must depend on readiness gates.",
);
requireText(
  prototypeCodexIntegrationDecision,
  "Japanese support remains support-only and hiragana-safe",
  "MiniStar prototype Codex integration decision must preserve Japanese support boundary.",
);
requireText(
  prototypeCodexIntegrationDecisionPanel,
  "Codex integration review decision",
  "AI prototype Codex integration decision panel must expose heading.",
);
requireText(
  prototypeCodexIntegrationDecisionPanel,
  "Manual decision before app patch",
  "AI prototype Codex integration decision panel must expose manual decision policy.",
);
requireText(
  prototypeCodexIntegrationDecisionPanel,
  "Reviewer decision preview",
  "AI prototype Codex integration decision panel must expose reviewer decision preview.",
);
requireText(
  prototypeCodexIntegrationDecisionPanel,
  "No decision recorded",
  "AI prototype Codex integration decision panel must expose blocked decision state.",
);
requireText(
  prototypeIntegrationReadinessGate,
  "sampleAiPrototypeIntegrationReadinessGates",
  "AI prototype integration readiness gate data must exist.",
);
requireText(
  prototypeIntegrationReadinessGate,
  "ai_prototype_scoring_replay_report",
  "AI prototype integration readiness gate must require scoring replay records.",
);
requireText(
  prototypeIntegrationReadinessGate,
  "codex_integration_review_decision",
  "AI prototype integration readiness gate must require Codex integration decisions.",
);
requireText(
  prototypeIntegrationReadinessGate,
  "All prototype evidence before integration",
  "AI prototype integration readiness gate must preserve all-evidence-before-integration policy.",
);
requireText(
  prototypeIntegrationReadinessGate,
  "Parent-engine wrapper only",
  "AI prototype integration readiness gate must preserve parent-engine wrapper policy.",
);
requireText(
  prototypeIntegrationReadinessGate,
  "No apps/web patch",
  "AI prototype integration readiness gate must block apps/web patches.",
);
requireText(
  prototypeIntegrationReadinessGate,
  "No student-facing route",
  "AI prototype integration readiness gate must block student-facing routes.",
);
requireText(
  prototypeIntegrationReadinessGate,
  "No Star Dust or reward write",
  "AI prototype integration readiness gate must block Star Dust and reward writes.",
);
requireText(
  prototypeIntegrationReadinessGate,
  "Japanese support remains hiragana-only and support-only",
  "MiniStar prototype integration readiness gate must preserve hiragana support boundary.",
);
requireText(
  prototypeIntegrationReadinessGatePanel,
  "AI prototype integration readiness gate",
  "AI prototype integration readiness gate panel must expose heading.",
);
requireText(
  prototypeIntegrationReadinessGatePanel,
  "All prototype evidence before integration",
  "AI prototype integration readiness gate panel must expose all-evidence policy.",
);
requireText(
  prototypeIntegrationReadinessGatePanel,
  "Evidence readiness checks",
  "AI prototype integration readiness gate panel must expose evidence checks.",
);
requireText(
  prototypeIntegrationReadinessGatePanel,
  "Codex decision missing",
  "AI prototype integration readiness gate panel must expose Codex decision blocker.",
);
requireText(
  prototypeAppPatchProposal,
  "sampleAiPrototypeAppPatchProposals",
  "AI prototype app patch proposal data must exist.",
);
requireText(
  prototypeAppPatchProposal,
  "codex_integration_review_decision",
  "AI prototype app patch proposal must depend on Codex integration decisions.",
);
requireText(
  prototypeAppPatchProposal,
  "No app file writes",
  "AI prototype app patch proposal must block app file writes.",
);
requireText(
  prototypeAppPatchProposal,
  "No generated route write",
  "AI prototype app patch proposal must block generated route writes.",
);
requireText(
  prototypeAppPatchProposal,
  "No scoring or reward mutation",
  "AI prototype app patch proposal must block scoring and reward mutation.",
);
requireText(
  prototypeAppPatchProposal,
  "No Japanese support-language trigger",
  "MiniStar prototype app patch proposal must block Japanese support-language triggers.",
);
requireText(
  prototypeAppPatchProposalPanel,
  "AI prototype app patch proposal",
  "AI prototype app patch proposal panel must expose heading.",
);
requireText(
  prototypeAppPatchProposalPanel,
  "Patch proposal preview only",
  "AI prototype app patch proposal panel must expose preview-only policy.",
);
requireText(
  prototypeAppPatchProposalPanel,
  "Required before patch",
  "AI prototype app patch proposal panel must expose required-before-patch gates.",
);
requireText(
  prototypeAppPatchProposalPanel,
  "Required test gates",
  "AI prototype app patch proposal panel must expose required test gates.",
);
requireText(
  prototypePatchTestReadinessGate,
  "sampleAiPrototypePatchTestReadinessGates",
  "AI prototype patch test readiness gate data must exist.",
);
requireText(
  prototypePatchTestReadinessGate,
  "Patch test harness plan",
  "AI prototype patch test readiness gate must require a patch test harness plan.",
);
requireText(
  prototypePatchTestReadinessGate,
  "Route safety smoke test",
  "AI prototype patch test readiness gate must include route safety testing.",
);
requireText(
  prototypePatchTestReadinessGate,
  "Storage contract test",
  "AI prototype patch test readiness gate must include storage contract testing.",
);
requireText(
  prototypePatchTestReadinessGate,
  "Rollback drill",
  "AI prototype patch test readiness gate must include rollback drills.",
);
requireText(
  prototypePatchTestReadinessGate,
  "No test execution from this panel",
  "AI prototype patch test readiness gate must block test execution.",
);
requireText(
  prototypePatchTestReadinessGate,
  "No support-language progress trigger",
  "AI prototype patch test readiness gate must block support-language progress triggers.",
);
requireText(
  prototypePatchTestReadinessGatePanel,
  "AI prototype patch test readiness gate",
  "AI prototype patch test readiness gate panel must expose heading.",
);
requireText(
  prototypePatchTestReadinessGatePanel,
  "Patch tests before file work",
  "AI prototype patch test readiness gate panel must expose file-work boundary.",
);
requireText(
  prototypePatchTestReadinessGatePanel,
  "Required test lanes",
  "AI prototype patch test readiness gate panel must expose required test lanes.",
);
requireText(
  prototypePatchTestHarnessPlan,
  "sampleAiPrototypePatchTestHarnessPlans",
  "AI prototype patch test harness plan data must exist.",
);
requireText(
  prototypePatchTestHarnessPlan,
  "Review-only plan; no runnable harness is exposed here.",
  "AI prototype patch test harness plan must preserve its design-before-execution boundary.",
);
requireText(
  prototypePatchTestHarnessPlan,
  "No test execution from this plan",
  "AI prototype patch test harness plan must block test execution.",
);
requireText(
  prototypePatchTestHarnessPlan,
  "Fixture replay harness",
  "AI prototype patch test harness plan must include fixture replay coverage.",
);
requireText(
  prototypePatchTestHarnessPlan,
  "Standard event harness",
  "AI prototype patch test harness plan must include standard event coverage.",
);
requireText(
  prototypePatchTestHarnessPlan,
  "Target-language audio harness",
  "AI prototype patch test harness plan must include target-language audio coverage.",
);
requireText(
  prototypePatchTestHarnessPlan,
  "Route safety harness",
  "AI prototype patch test harness plan must include route safety coverage.",
);
requireText(
  prototypePatchTestHarnessPlan,
  "Hiragana support-language harness",
  "AI prototype patch test harness plan must preserve MiniStar support-language boundary checks.",
);
requireText(
  prototypePatchTestHarnessPlanPanel,
  "AI prototype patch test harness plan",
  "AI prototype patch test harness plan panel must expose heading.",
);
requireText(
  prototypePatchTestHarnessPlanPanel,
  "Harness design before tests",
  "AI prototype patch test harness plan panel must expose design-before-test boundary.",
);
requireText(
  prototypePatchTestHarnessPlanPanel,
  "No runnable harness",
  "AI prototype patch test harness plan panel must block runnable harness behavior.",
);
requireText(
  prototypePatchHarnessImplementationProposal,
  "sampleAiPrototypePatchHarnessImplementationProposals",
  "AI prototype patch harness implementation proposal data must exist.",
);
requireText(
  prototypePatchHarnessImplementationProposal,
  "No harness implementation from this proposal",
  "AI prototype patch harness implementation proposal must block implementation.",
);
requireText(
  prototypePatchHarnessImplementationProposal,
  "No Playwright run",
  "AI prototype patch harness implementation proposal must block Playwright runs.",
);
requireText(
  prototypePatchHarnessImplementationProposal,
  "Harness implementation file-scope review",
  "AI prototype patch harness implementation proposal must require file-scope review.",
);
requireText(
  prototypePatchHarnessImplementationProposal,
  "Hiragana support-language assertion names",
  "AI prototype patch harness implementation proposal must preserve MiniStar support-language checks.",
);
requireText(
  prototypePatchHarnessImplementationProposalPanel,
  "AI prototype patch harness implementation proposal",
  "AI prototype patch harness implementation proposal panel must expose heading.",
);
requireText(
  prototypePatchHarnessImplementationProposalPanel,
  "Implementation scope before code",
  "AI prototype patch harness implementation proposal panel must expose code boundary.",
);
requireText(
  prototypePatchHarnessImplementationProposalPanel,
  "No code generation",
  "AI prototype patch harness implementation proposal panel must block code generation.",
);
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
requireText(
  generatedPackageAssemblyReadiness,
  "sampleAiGeneratedPackageAssemblyReadiness",
  "AI generated package assembly readiness data must exist.",
);
requireText(
  generatedPackageAssemblyReadiness,
  "Package assembly blocked",
  "AI generated package assembly readiness must keep package assembly blocked.",
);
requireText(
  generatedPackageAssemblyReadiness,
  "No package assembly from readiness preview",
  "AI generated package assembly readiness must block package assembly from preview.",
);
requireText(
  generatedPackageAssemblyReadiness,
  "No route registry write from readiness preview",
  "AI generated package assembly readiness must block route registry writes.",
);
requireText(
  generatedPackageAssemblyReadiness,
  "No media playlist write from readiness preview",
  "AI generated package assembly readiness must block playlist writes.",
);
requireText(
  generatedPackageAssemblyReadiness,
  "No local bundle write from readiness preview",
  "AI generated package assembly readiness must block local bundle writes.",
);
requireText(
  generatedPackageAssemblyReadiness,
  "No support-language-only assembly",
  "AI generated package assembly readiness must block support-language-only assembly.",
);
requireText(
  generatedPackageAssemblyReadiness,
  "Hiragana support boundary",
  "MiniStar package assembly readiness must expose hiragana support boundary.",
);
requireText(
  generatedPackageAssemblyReadiness,
  "English is the target-language assembly trigger.",
  "MiniStar package assembly readiness must keep English as assembly trigger.",
);
requireText(
  generatedPackageAssemblyReadinessPanel,
  "AI generated package assembly readiness",
  "AI generated package assembly readiness panel must expose heading.",
);
requireText(
  generatedPackageAssemblyReadinessPanel,
  "Assembly decision before package write",
  "AI generated package assembly readiness panel must expose decision heading.",
);
requireText(
  generatedPackageAssemblyReadinessPanel,
  "Assembly readiness lanes",
  "AI generated package assembly readiness panel must expose readiness lanes.",
);
requireText(
  generatedPackageAssemblyReadinessPanel,
  "Blocked assembly actions",
  "AI generated package assembly readiness panel must expose blocked assembly actions.",
);
requireText(
  generatedPackageAssemblyDryRun,
  "sampleAiGeneratedPackageAssemblyDryRuns",
  "AI generated package assembly dry run data must exist.",
);
requireText(
  generatedPackageAssemblyDryRun,
  "Artifact map before writes",
  "AI generated package assembly dry run must expose artifact map state.",
);
requireText(
  generatedPackageAssemblyDryRun,
  "No package JSON write from dry run",
  "AI generated package assembly dry run must block package JSON writes.",
);
requireText(
  generatedPackageAssemblyDryRun,
  "No route registry write from dry run",
  "AI generated package assembly dry run must block route writes.",
);
requireText(
  generatedPackageAssemblyDryRun,
  "No media playlist write from dry run",
  "AI generated package assembly dry run must block playlist writes.",
);
requireText(
  generatedPackageAssemblyDryRun,
  "No local bundle write from dry run",
  "AI generated package assembly dry run must block local bundle writes.",
);
requireText(
  generatedPackageAssemblyDryRun,
  "No support-language-only assembly dry run",
  "AI generated package assembly dry run must block support-language-only dry runs.",
);
requireText(
  generatedPackageAssemblyDryRunPanel,
  "AI generated package assembly dry run",
  "AI generated package assembly dry run panel must expose heading.",
);
requireText(
  generatedPackageAssemblyDryRunPanel,
  "Artifact map before writes",
  "AI generated package assembly dry run panel must expose dry run state.",
);
requireText(
  generatedPackageAssemblyDryRunPanel,
  "Dry-run artifact map",
  "AI generated package assembly dry run panel must expose artifact map.",
);
requireText(
  generatedPackageAssemblyDryRunPanel,
  "Blocked dry-run actions",
  "AI generated package assembly dry run panel must expose blocked dry-run actions.",
);
requireText(
  checks,
  "AI generated package assembly dry-run storage contract",
  "AI generator checks must mention assembly dry-run storage contract.",
);
requireText(
  generatedPackageWriterPreflight,
  "sampleAiGeneratedPackageWriterPreflights",
  "AI generated package writer preflight data must exist.",
);
requireText(
  generatedPackageWriterPreflight,
  "Writer blocked until release-control implementation",
  "AI generated package writer preflight must keep writer execution blocked.",
);
requireText(
  generatedPackageWriterPreflight,
  "Package JSON writer",
  "AI generated package writer preflight must include package JSON writer target.",
);
requireText(
  generatedPackageWriterPreflight,
  "Route registry writer",
  "AI generated package writer preflight must include route registry writer target.",
);
requireText(
  generatedPackageWriterPreflight,
  "Media playlist writer",
  "AI generated package writer preflight must include media playlist writer target.",
);
requireText(
  generatedPackageWriterPreflight,
  "Local companion writer",
  "AI generated package writer preflight must include local companion writer target.",
);
requireText(
  generatedPackageWriterPreflight,
  "Assignment shell writer",
  "AI generated package writer preflight must include assignment writer target.",
);
requireText(
  generatedPackageWriterPreflight,
  "No package writer execution",
  "AI generated package writer preflight must block writer execution.",
);
requireText(
  generatedPackageWriterPreflight,
  "No support-language-only package writer",
  "AI generated package writer preflight must block support-language-only writers.",
);
requireText(
  generatedPackageWriterPreflightPanel,
  "AI generated package writer preflight",
  "AI generated package writer preflight panel must expose heading.",
);
requireText(
  generatedPackageWriterPreflightPanel,
  "Package writer target map",
  "AI generated package writer preflight panel must expose writer target map.",
);
requireText(
  generatedPackageWriterPreflightPanel,
  "Blocked writer actions",
  "AI generated package writer preflight panel must expose blocked writer actions.",
);
requireText(
  checks,
  "AI generated package writer preflight storage contract",
  "AI generator checks must mention package writer preflight storage contract.",
);
requireText(
  generatedPackageWriterRollbackDrill,
  "sampleAiGeneratedPackageWriterRollbackDrills",
  "AI generated package writer rollback drill data must exist.",
);
requireText(
  generatedPackageWriterRollbackDrill,
  "Rollback drill blocked until writer implementation exists",
  "AI generated package writer rollback drill must keep rollback blocked.",
);
requireText(
  generatedPackageWriterRollbackDrill,
  "Pre-write package JSON snapshot",
  "AI generated package writer rollback drill must include pre-write snapshots.",
);
requireText(
  generatedPackageWriterRollbackDrill,
  "Post-write route smoke check plan",
  "AI generated package writer rollback drill must include post-write checks.",
);
requireText(
  generatedPackageWriterRollbackDrill,
  "Package JSON rollback rehearsal",
  "AI generated package writer rollback drill must include package rollback rehearsal.",
);
requireText(
  generatedPackageWriterRollbackDrill,
  "No rollback execution",
  "AI generated package writer rollback drill must block rollback execution.",
);
requireText(
  generatedPackageWriterRollbackDrill,
  "No production QR redirect mutation",
  "AI generated package writer rollback drill must block production QR redirect mutation.",
);
requireText(
  generatedPackageWriterRollbackDrill,
  "No support-language-only rollback evidence",
  "AI generated package writer rollback drill must block support-language-only rollback evidence.",
);
requireText(
  generatedPackageWriterRollbackDrillPanel,
  "AI generated package writer rollback drill",
  "AI generated package writer rollback drill panel must expose heading.",
);
requireText(
  generatedPackageWriterRollbackDrillPanel,
  "Pre-write snapshot",
  "AI generated package writer rollback drill panel must expose pre-write snapshots.",
);
requireText(
  generatedPackageWriterRollbackDrillPanel,
  "Post-write verification",
  "AI generated package writer rollback drill panel must expose post-write verification.",
);
requireText(
  generatedPackageWriterRollbackDrillPanel,
  "Blocked rollback actions",
  "AI generated package writer rollback drill panel must expose blocked rollback actions.",
);
requireText(
  checks,
  "AI generated package writer rollback drill storage contract",
  "AI generator checks must mention package writer rollback drill storage contract.",
);
requireText(
  generatedPackageWriterImplementationReadiness,
  "sampleAiGeneratedPackageWriterImplementationReadiness",
  "AI generated package writer implementation readiness data must exist.",
);
requireText(
  generatedPackageWriterImplementationReadiness,
  "Implementation readiness blocked until Codex package-writer decision",
  "AI generated package writer implementation readiness must stay blocked.",
);
requireText(
  generatedPackageWriterImplementationReadiness,
  "Content package writer module",
  "AI generated package writer implementation readiness must include package writer module.",
);
requireText(
  generatedPackageWriterImplementationReadiness,
  "Storage contract verification",
  "AI generated package writer implementation readiness must require storage contract verification.",
);
requireText(
  generatedPackageWriterImplementationReadiness,
  "Rollback drill replay",
  "AI generated package writer implementation readiness must require rollback drill replay.",
);
requireText(
  generatedPackageWriterImplementationReadiness,
  "No package writer implementation",
  "AI generated package writer implementation readiness must block package writer implementation.",
);
requireText(
  generatedPackageWriterImplementationReadiness,
  "No generated app file write",
  "AI generated package writer implementation readiness must block generated app file writes.",
);
requireText(
  generatedPackageWriterImplementationReadinessPanel,
  "AI generated package writer implementation readiness",
  "AI generated package writer implementation readiness panel must expose heading.",
);
requireText(
  generatedPackageWriterImplementationReadinessPanel,
  "Package writer module plan",
  "AI generated package writer implementation readiness panel must expose module plan.",
);
requireText(
  generatedPackageWriterImplementationReadinessPanel,
  "Required test gates",
  "AI generated package writer implementation readiness panel must expose required test gates.",
);
requireText(
  generatedPackageWriterImplementationReadinessPanel,
  "Blocked implementation actions",
  "AI generated package writer implementation readiness panel must expose blocked implementation actions.",
);
requireText(
  generatedPackageWriterModuleTestPlan,
  "sampleAiGeneratedPackageWriterModuleTestPlans",
  "AI generated package writer module test plan data must exist.",
);
requireText(
  generatedPackageWriterModuleTestPlan,
  "Module test plan blocked until storage contract and Codex implementation decision",
  "AI generated package writer module test plan must stay blocked.",
);
requireText(
  generatedPackageWriterModuleTestPlan,
  "Content package writer module tests",
  "AI generated package writer module test plan must include content package writer tests.",
);
requireText(
  generatedPackageWriterModuleTestPlan,
  "Route registry writer module tests",
  "AI generated package writer module test plan must include route registry writer tests.",
);
requireText(
  generatedPackageWriterModuleTestPlan,
  "Reviewed JSON fixture replay",
  "AI generated package writer module test plan must require reviewed JSON fixture replay.",
);
requireText(
  generatedPackageWriterModuleTestPlan,
  "Tap-to-speak audio coverage report",
  "AI generated package writer module test plan must require target-language audio evidence.",
);
requireText(
  generatedPackageWriterModuleTestPlan,
  "No app file patch",
  "AI generated package writer module test plan must block app file patches.",
);
requireText(
  generatedPackageWriterModuleTestPlan,
  "No support-language-only test pass",
  "AI generated package writer module test plan must block support-language-only test passes.",
);
requireText(
  generatedPackageWriterModuleTestPlanPanel,
  "AI generated package writer module test plan",
  "AI generated package writer module test plan panel must expose heading.",
);
requireText(
  generatedPackageWriterModuleTestPlanPanel,
  "Package writer module test plan",
  "AI generated package writer module test plan panel must expose title.",
);
requireText(
  generatedPackageWriterModuleTestPlanPanel,
  "Module test suites",
  "AI generated package writer module test plan panel must expose module test suites.",
);
requireText(
  generatedPackageWriterModuleTestPlanPanel,
  "Blocked test actions",
  "AI generated package writer module test plan panel must expose blocked test actions.",
);
requireText(
  generatedPackageWriterTestEvidencePacket,
  "sampleAiGeneratedPackageWriterTestEvidencePackets",
  "AI generated package writer test evidence packet data must exist.",
);
requireText(
  generatedPackageWriterTestEvidencePacket,
  "Evidence packet blocked until storage contract and Codex test harness decision",
  "AI generated package writer test evidence packet must stay blocked.",
);
requireText(
  generatedPackageWriterTestEvidencePacket,
  "Fixture evidence lane",
  "AI generated package writer test evidence packet must name evidence lanes.",
);
requireText(
  generatedPackageWriterTestEvidencePacket,
  "Route and QR evidence lane",
  "AI generated package writer test evidence packet must include route and QR evidence.",
);
requireText(
  generatedPackageWriterTestEvidencePacket,
  "Tap-to-speak audio coverage report",
  "AI generated package writer test evidence packet must require target-language audio evidence.",
);
requireText(
  generatedPackageWriterTestEvidencePacket,
  "No evidence upload or signed approval capture",
  "AI generated package writer test evidence packet must block live evidence upload.",
);
requireText(
  generatedPackageWriterTestEvidencePacket,
  "No app file patch",
  "AI generated package writer test evidence packet must block app file patches.",
);
requireText(
  generatedPackageWriterTestEvidencePacket,
  "No support-language-only evidence pass",
  "AI generated package writer test evidence packet must block support-language-only evidence passes.",
);
requireText(
  generatedPackageWriterTestEvidencePacketPanel,
  "AI generated package writer test evidence packet",
  "AI generated package writer test evidence packet panel must expose heading.",
);
requireText(
  generatedPackageWriterTestEvidencePacketPanel,
  "Package writer test evidence packet",
  "AI generated package writer test evidence packet panel must expose title.",
);
requireText(
  generatedPackageWriterTestEvidencePacketPanel,
  "Required test evidence lanes",
  "AI generated package writer test evidence packet panel must expose evidence lanes.",
);
requireText(
  generatedPackageWriterTestEvidencePacketPanel,
  "Blocked evidence actions",
  "AI generated package writer test evidence packet panel must expose blocked evidence actions.",
);
requireText(
  generatedPackageWriterTestHarnessPlan,
  "sampleAiGeneratedPackageWriterTestHarnessPlans",
  "AI generated package writer test harness plan data must exist.",
);
requireText(
  generatedPackageWriterTestHarnessPlan,
  "Harness plan blocked until Codex test harness implementation decision",
  "AI generated package writer test harness plan must stay blocked.",
);
requireText(
  generatedPackageWriterTestHarnessPlan,
  "Fixture replay phase",
  "AI generated package writer test harness plan must include fixture replay.",
);
requireText(
  generatedPackageWriterTestHarnessPlan,
  "Route smoke phase",
  "AI generated package writer test harness plan must include route smoke.",
);
requireText(
  generatedPackageWriterTestHarnessPlan,
  "Media policy phase",
  "AI generated package writer test harness plan must include media policy checks.",
);
requireText(
  generatedPackageWriterTestHarnessPlan,
  "Static fixture adapter",
  "AI generated package writer test harness plan must include static fixture adapter.",
);
requireText(
  generatedPackageWriterTestHarnessPlan,
  "No test harness implementation",
  "AI generated package writer test harness plan must block harness implementation.",
);
requireText(
  generatedPackageWriterTestHarnessPlan,
  "No writer mutation browser run",
  "AI generated package writer test harness plan must block mutation browser runs.",
);
requireText(
  generatedPackageWriterTestHarnessPlan,
  "No support-language-only harness pass",
  "AI generated package writer test harness plan must block support-language-only harness passes.",
);
requireText(
  generatedPackageWriterTestHarnessPlanPanel,
  "AI generated package writer test harness plan",
  "AI generated package writer test harness plan panel must expose heading.",
);
requireText(
  generatedPackageWriterTestHarnessPlanPanel,
  "Package writer test harness plan",
  "AI generated package writer test harness plan panel must expose title.",
);
requireText(
  generatedPackageWriterTestHarnessPlanPanel,
  "Future dry-run harness phases",
  "AI generated package writer test harness plan panel must expose phases.",
);
requireText(
  generatedPackageWriterTestHarnessPlanPanel,
  "Environment adapters",
  "AI generated package writer test harness plan panel must expose adapters.",
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
requireText(route, "AiGeneratorReviewSummaryPanel", "Generator route must render the review summary panel.");
requireText(route, "AiGeneratorReviewerRunbookPanel", "Generator route must render the reviewer runbook panel.");
requireText(route, "AiGeneratorResponsibilityMatrixPanel", "Generator route must render the responsibility matrix panel.");
requireText(route, "AiEngineBindingPlanPanel", "Generator route must render the engine binding panel.");
requireText(route, "AiGeneratedGameBuildBriefPanel", "Generator route must render the generated game build brief panel.");
requireText(route, "AiExternalPrototypeTaskPacketPanel", "Generator route must render the external prototype task packet panel.");
requireText(
  route,
  "AiExternalPrototypeTaskExportReadinessGatePanel",
  "Generator route must render the external prototype task export readiness gate panel.",
);
requireText(route, "AiPrototypeReturnReviewPanel", "Generator route must render the prototype return review panel.");
requireText(route, "AiPrototypeIntegrationPlanPanel", "Generator route must render the prototype integration plan panel.");
requireText(route, "AiPrototypeWrapperAdapterReviewPanel", "Generator route must render the prototype wrapper adapter review panel.");
requireText(route, "AiPrototypeFixtureReplayReportPanel", "Generator route must render the prototype fixture replay report panel.");
requireText(route, "AiPrototypeEventReplayReportPanel", "Generator route must render the prototype event replay report panel.");
requireText(route, "AiPrototypeAudioCoverageReportPanel", "Generator route must render the prototype audio coverage report panel.");
requireText(
  route,
  "AiPrototypeCodexIntegrationDecisionPanel",
  "Generator route must render the prototype Codex integration decision panel.",
);
requireText(
  route,
  "AiPrototypeIntegrationReadinessGatePanel",
  "Generator route must render the prototype integration readiness gate panel.",
);
requireText(route, "AiPrototypeAppPatchProposalPanel", "Generator route must render the prototype app patch proposal panel.");
requireText(
  route,
  "AiPrototypePatchTestReadinessGatePanel",
  "Generator route must render the prototype patch test readiness gate panel.",
);
requireText(
  route,
  "AiPrototypePatchTestHarnessPlanPanel",
  "Generator route must render the prototype patch test harness plan panel.",
);
requireText(
  route,
  "AiPrototypePatchHarnessImplementationProposalPanel",
  "Generator route must render the prototype patch harness implementation proposal panel.",
);
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
requireText(
  route,
  "AiGeneratedPackageAssemblyReadinessPanel",
  "Generator route must render the generated package assembly readiness panel.",
);
requireText(
  route,
  "AiGeneratedPackageAssemblyDryRunPanel",
  "Generator route must render the generated package assembly dry run panel.",
);
requireText(
  route,
  "AiGeneratedPackageWriterPreflightPanel",
  "Generator route must render the generated package writer preflight panel.",
);
requireText(
  route,
  "AiGeneratedPackageWriterRollbackDrillPanel",
  "Generator route must render the generated package writer rollback drill panel.",
);
requireText(
  route,
  "AiGeneratedPackageWriterImplementationReadinessPanel",
  "Generator route must render the generated package writer implementation readiness panel.",
);
requireText(
  route,
  "AiGeneratedPackageWriterModuleTestPlanPanel",
  "Generator route must render the generated package writer module test plan panel.",
);
requireText(
  route,
  "AiGeneratedPackageWriterTestEvidencePacketPanel",
  "Generator route must render the generated package writer test evidence packet panel.",
);
requireText(
  route,
  "AiGeneratedPackageWriterTestHarnessPlanPanel",
  "Generator route must render the generated package writer test harness plan panel.",
);
requireText(route, "AiGeneratedPublishReadinessGatePanel", "Generator route must render the generated publish readiness gate panel.");
requireText(route, "AiGeneratedDraftPayloadPreviewPanel", "Generator route must render the draft payload preview panel.");
requireText(route, "AiDraftCorrectionQueuePanel", "Generator route must render the draft correction queue panel.");
requireText(route, "sampleAiGameGeneratorPlan", "Generator route must use the sample generator plan.");
requireText(route, "sampleAiGeneratorTenantCoverage", "Generator route must use tenant coverage data.");
requireText(route, "sampleAiGeneratorLineageMaps", "Generator route must use lineage map data.");
requireText(route, "sampleAiGeneratorReviewSummaries", "Generator route must use review summary data.");
requireText(route, "sampleAiGeneratorReviewerRunbooks", "Generator route must use reviewer runbook data.");
requireText(route, "sampleAiGeneratorResponsibilityMatrices", "Generator route must use responsibility matrix data.");
requireText(route, "sampleAiEngineBindingPlans", "Generator route must use the sample engine binding plan data.");
requireText(route, "sampleAiGeneratedGameBuildBriefPackets", "Generator route must use generated game build brief data.");
requireText(route, "sampleAiExternalPrototypeTaskPackets", "Generator route must use external prototype task packet data.");
requireText(
  route,
  "sampleAiExternalPrototypeTaskExportReadinessGates",
  "Generator route must use external prototype task export readiness gate data.",
);
requireText(route, "sampleAiPrototypeReturnReviewPackets", "Generator route must use prototype return review data.");
requireText(route, "sampleAiPrototypeIntegrationPlans", "Generator route must use prototype integration plan data.");
requireText(route, "sampleAiPrototypeWrapperAdapterReviews", "Generator route must use prototype wrapper adapter review data.");
requireText(route, "sampleAiPrototypeFixtureReplayReports", "Generator route must use prototype fixture replay report data.");
requireText(route, "sampleAiPrototypeEventReplayReports", "Generator route must use prototype event replay report data.");
requireText(route, "sampleAiPrototypeAudioCoverageReports", "Generator route must use prototype audio coverage report data.");
requireText(
  route,
  "sampleAiPrototypeCodexIntegrationDecisions",
  "Generator route must use prototype Codex integration decision data.",
);
requireText(
  route,
  "sampleAiPrototypeIntegrationReadinessGates",
  "Generator route must use prototype integration readiness gate data.",
);
requireText(route, "sampleAiPrototypeAppPatchProposals", "Generator route must use prototype app patch proposal data.");
requireText(
  route,
  "sampleAiPrototypePatchTestReadinessGates",
  "Generator route must use prototype patch test readiness gate data.",
);
requireText(
  route,
  "sampleAiPrototypePatchTestHarnessPlans",
  "Generator route must use prototype patch test harness plan data.",
);
requireText(
  route,
  "sampleAiPrototypePatchHarnessImplementationProposals",
  "Generator route must use prototype patch harness implementation proposal data.",
);
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
  "sampleAiGeneratedPackageAssemblyReadiness",
  "Generator route must use the sample generated package assembly readiness data.",
);
requireText(
  route,
  "sampleAiGeneratedPackageAssemblyDryRuns",
  "Generator route must use the sample generated package assembly dry run data.",
);
requireText(
  route,
  "sampleAiGeneratedPackageWriterPreflights",
  "Generator route must use the sample generated package writer preflight data.",
);
requireText(
  route,
  "sampleAiGeneratedPackageWriterRollbackDrills",
  "Generator route must use the sample generated package writer rollback drill data.",
);
requireText(
  route,
  "sampleAiGeneratedPackageWriterImplementationReadiness",
  "Generator route must use the sample generated package writer implementation readiness data.",
);
requireText(
  route,
  "sampleAiGeneratedPackageWriterModuleTestPlans",
  "Generator route must use the sample generated package writer module test plan data.",
);
requireText(
  route,
  "sampleAiGeneratedPackageWriterTestEvidencePackets",
  "Generator route must use the sample generated package writer test evidence packet data.",
);
requireText(
  route,
  "sampleAiGeneratedPackageWriterTestHarnessPlans",
  "Generator route must use the sample generated package writer test harness plan data.",
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
