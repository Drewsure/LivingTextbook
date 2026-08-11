import { sampleAiDraftCorrectionQueues } from "@/data/sampleAiDraftCorrectionQueue";
import { sampleAiEngineBindingPlans } from "@/data/sampleAiEngineBindingPlan";
import { sampleAiGameGeneratorPlan, type AiGameGeneratorRequest } from "@/data/sampleAiGameGeneratorPlan";
import { sampleAiGamificationMappingPlans } from "@/data/sampleAiGamificationMappingPlan";
import { sampleAiGeneratedDraftPayloadPreviews } from "@/data/sampleAiGeneratedDraftPayloadPreview";
import { sampleAiGeneratedPackageManifests } from "@/data/sampleAiGeneratedPackageManifest";
import { sampleAiGeneratedPublishReadinessGates } from "@/data/sampleAiGeneratedPublishReadinessGate";
import { sampleAiGenerationRequestBuilders } from "@/data/sampleAiGenerationRequestBuilder";
import { sampleAiGeneratorAudioCoveragePlans } from "@/data/sampleAiGeneratorAudioCoveragePlan";
import { sampleAiGeneratorCostEntitlementGates } from "@/data/sampleAiGeneratorCostEntitlementGate";
import { sampleAiPromptPackagePlans } from "@/data/sampleAiPromptPackagePlan";
import { sampleAiRewardReadinessGates } from "@/data/sampleAiRewardReadinessGate";
import { sampleAiVerifierSubmissionPackets } from "@/data/sampleAiVerifierSubmissionPacket";
import {
  getAiGeneratorTenantCoverageCollectionWarnings,
  validateAiGeneratorTenantCoverages,
  type AiGeneratorTenantCoverage,
  type AiGeneratorTenantCoverageLane,
  type AiGeneratorTenantCoverageStatus,
} from "@living-textbook/content-model/src/aiGeneratorTenantCoverage";

export type { AiGeneratorTenantCoverage, AiGeneratorTenantCoverageLane, AiGeneratorTenantCoverageStatus };

export const sampleAiGeneratorTenantCoverage: AiGeneratorTenantCoverage[] =
  sampleAiGameGeneratorPlan.requests.map(createAiGeneratorTenantCoverage);

export const sampleAiGeneratorTenantCoverageErrors =
  validateAiGeneratorTenantCoverages(sampleAiGeneratorTenantCoverage);

export const sampleAiGeneratorTenantCoverageWarnings =
  getAiGeneratorTenantCoverageCollectionWarnings(sampleAiGeneratorTenantCoverage);

export function filterAiGeneratorTenantCoverageByTenant(
  coverage: AiGeneratorTenantCoverage[],
  tenantId: string,
): AiGeneratorTenantCoverage[] {
  return coverage.filter((item) => item.tenantId === tenantId);
}

function createAiGeneratorTenantCoverage(request: AiGameGeneratorRequest): AiGeneratorTenantCoverage {
  const lanes: AiGeneratorTenantCoverageLane[] = [
    {
      laneId: "generator-request",
      label: "Generator request preview",
      recordType: "ai_game_generator_request",
      status: "covered",
      evidence: `${request.requestId} exists in the teacher/admin generator plan.`,
      nextStep: "Keep the request draft-only until the rest of its tenant records are present.",
    },
    requestRecordLane(
      request,
      "prompt-package",
      "Prompt package",
      "ai_prompt_package",
      sampleAiPromptPackagePlans,
      "Create a versioned tenant prompt package before any live model call.",
    ),
    requestRecordLane(
      request,
      "cost-entitlement-gate",
      "AI cost and entitlement gate",
      "premium_ai_cost_gate",
      sampleAiGeneratorCostEntitlementGates,
      "Create tenant and school cost approval records before model billing or AI Tutor use.",
    ),
    tenantBuilderLane(request),
    requestRecordLane(
      request,
      "audio-coverage-plan",
      "Audio coverage plan",
      "ai_audio_coverage_plan",
      sampleAiGeneratorAudioCoveragePlans,
      "Create term, sentence, instruction, feedback, support, and background-media audio coverage records.",
    ),
    requestRecordLane(
      request,
      "gamification-mapping",
      "Gamification mapping",
      "ai_gamification_mapping_plan",
      sampleAiGamificationMappingPlans,
      "Create deterministic Star Dust, event, mastery, and collection unlock bindings.",
    ),
    requestRecordLane(
      request,
      "reward-readiness-gate",
      "Reward readiness gate",
      "ai_reward_readiness_gate",
      sampleAiRewardReadinessGates,
      "Create reward readiness checks before reward publishing, inventory writes, or assignment.",
    ),
    requestRecordLane(
      request,
      "engine-binding",
      "Engine binding",
      "ai_engine_binding_plan",
      sampleAiEngineBindingPlans,
      "Bind the request to existing parent engines, mode configs, scoring profiles, and event contracts.",
    ),
    requestRecordLane(
      request,
      "verifier-submission",
      "Verifier submission packet",
      "ai_verifier_submission_packet",
      sampleAiVerifierSubmissionPackets,
      "Create verifier packets before package review, route creation, playlist creation, or assignment.",
    ),
    requestRecordLane(
      request,
      "generated-package-manifest",
      "Generated package manifest",
      "ai_generated_package_manifest",
      sampleAiGeneratedPackageManifests,
      "Create a manifest linking prompt, draft, audio, engine, gamification, verifier, and review records.",
    ),
    requestRecordLane(
      request,
      "generated-publish-readiness",
      "Generated publish readiness gate",
      "ai_generated_publish_readiness_gate",
      sampleAiGeneratedPublishReadinessGates,
      "Create publish readiness records before route, playlist, assignment, or student-ready writes.",
    ),
    requestRecordLane(
      request,
      "draft-json-preview",
      "Draft JSON preview",
      "ai_generated_draft_payload_preview",
      sampleAiGeneratedDraftPayloadPreviews,
      "Create a schema-guarded Draft JSON preview before correction queue or verifier work.",
    ),
    requestRecordLane(
      request,
      "draft-correction-queue",
      "Draft correction queue",
      "ai_draft_correction_queue",
      sampleAiDraftCorrectionQueues,
      "Create schema, audio, progress, and rights repair lanes before package review.",
    ),
  ];

  const coveredCount = lanes.filter((lane) => lane.status === "covered").length;
  const partialCount = lanes.filter((lane) => lane.status === "partial").length;
  const missingCount = lanes.filter((lane) => lane.status === "missing").length;
  const status: AiGeneratorTenantCoverageStatus =
    missingCount === 0 && partialCount === 0 ? "covered" : coveredCount === 0 ? "missing" : "partial";
  const missingLabels = lanes.filter((lane) => lane.status === "missing").map((lane) => lane.label);
  const partialLabels = lanes.filter((lane) => lane.status === "partial").map((lane) => lane.label);

  return {
    coverageId: `ai-generator-tenant-coverage-${request.requestId}`,
    tenantId: request.tenantId,
    requestId: request.requestId,
    label: `${request.label} coverage`,
    summary:
      missingCount > 0
        ? "Missing generator preview records remain visible and block submission, verifier, package, route, playlist, assignment, and student-ready work."
        : partialCount > 0
          ? "Partial generator preview records remain visible until request-specific bindings are completed."
          : "Tenant-specific generator preview records are present for this request, while live actions still remain blocked.",
    status,
    coveredCount,
    partialCount,
    missingCount,
    lanes,
    blockedActions: [
      "No generator request submission",
      "No live model call",
      "No verifier submission",
      "No package assembly",
      "No route or playlist creation",
      "No student assignment",
    ],
    nextRequirements: [
      ...(missingLabels.length > 0
        ? [`Missing generator preview records: ${missingLabels.join(", ")}`]
        : ["Confirm all tenant-specific generator records before enabling a live request."]),
      ...(partialLabels.length > 0 ? [`Request-specific bindings still partial: ${partialLabels.join(", ")}`] : []),
      "Keep premium AI, speech scoring, and AI Tutor features disabled unless the tenant and school have approved the package.",
    ],
  };
}

function requestRecordLane(
  request: AiGameGeneratorRequest,
  laneId: string,
  label: string,
  recordType: string,
  records: Array<{ tenantId: string; requestId: string }>,
  nextStep: string,
): AiGeneratorTenantCoverageLane {
  const exists = records.some((record) => record.tenantId === request.tenantId && record.requestId === request.requestId);

  return {
    laneId,
    label,
    recordType,
    status: exists ? "covered" : "missing",
    evidence: exists ? `${recordType} is present for ${request.requestId}.` : `${recordType} is missing for ${request.requestId}.`,
    nextStep,
  };
}

function tenantBuilderLane(request: AiGameGeneratorRequest): AiGeneratorTenantCoverageLane {
  const builder = sampleAiGenerationRequestBuilders.find(
    (item) => item.tenantId === request.tenantId && item.requestId === request.requestId,
  );

  return {
    laneId: "request-builder",
    label: "Generation request builder",
    recordType: "ai_generation_request_packet",
    status: builder ? "covered" : "missing",
    evidence: builder
      ? `${builder.builderId} is present for ${request.requestId}.`
      : `ai_generation_request_packet is missing for ${request.requestId}.`,
    nextStep: "Create a request-specific disabled builder binding before generate, cost-estimate, submit, or model-billing actions exist.",
  };
}
