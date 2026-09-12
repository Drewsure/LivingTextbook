import { validatePedagogicalTextFields } from "@living-textbook/content-model";
import {
  getGameModeContract,
  isSupportedGameModeId,
  isSupportedParentEngine,
} from "@living-textbook/content-model";
import type {
  AssistLanguageLevelBand,
  AssistLanguageScriptPolicy,
  GameModeId,
  ParentEngine,
} from "@living-textbook/content-model";

export type AiGenerationServiceStatus = "review-only" | "provider-dispatch-ready";
export type AiGenerationServiceReviewStatus = "draft" | "reviewed" | "verified" | "approved" | "rejected";

export interface AiGenerationServiceSupportLanguagePolicy {
  progressionAllowed: false;
  scriptPolicy?: AssistLanguageScriptPolicy;
  levelBand?: AssistLanguageLevelBand;
}

export interface AiGenerationServiceRequest {
  requestId: string;
  tenantId: string;
  contentPackageId: string;
  sourceReviewStatus: AiGenerationServiceReviewStatus;
  targetLanguage: string;
  assistLanguage?: string;
  level: number;
  theme: string;
  gameMode: GameModeId;
  engineId: ParentEngine;
  vocabularyTerms: string[];
  targetSentences: [string, string];
  sourceEvidencePacketId: string;
  activityCompatibilitySnapshotId: string;
  audioCoverageRequirementId: string;
  mediaRightsManifestId: string;
  premiumAiCostGateId: string;
  supportLanguagePolicy: AiGenerationServiceSupportLanguagePolicy;
  targetLanguageAudioReady: boolean;
  mediaRightsReady: boolean;
  teacherApprovalReady: boolean;
  premiumCostPolicyReady: boolean;
}

export interface AiGenerationServiceResult {
  requestId: string;
  status: AiGenerationServiceStatus;
  validationErrors: string[];
  reviewWarnings: string[];
  blockedActions: string[];
  providerDispatchAllowed: false;
}

const blockedActions = [
  "No provider model call",
  "No provider billing",
  "No uploaded source write",
  "No generated package write",
  "No verifier submission",
  "No route or playlist write",
  "No assignment activation",
  "No support-language progression",
] as const;

export function validateAiGenerationServiceRequest(request: AiGenerationServiceRequest): string[] {
  const errors: string[] = [];

  if (!request.requestId.trim()) errors.push("requestId is required");
  if (!request.tenantId.trim()) errors.push("tenantId is required");
  if (!request.contentPackageId.trim()) errors.push("contentPackageId is required");
  if (!request.targetLanguage.trim()) errors.push("targetLanguage is required");
  if (!request.theme.trim()) errors.push("theme is required");
  if (request.level < 1 || request.level > 8) errors.push("level must be between 1 and 8");
  if (request.assistLanguage?.trim().toLowerCase() === request.targetLanguage.trim().toLowerCase()) {
    errors.push("assistLanguage must differ from targetLanguage; assist language is support-only");
  }
  if (!isSupportedGameModeId(request.gameMode)) errors.push(`gameMode ${request.gameMode} is not supported by the curated game catalog`);
  if (!isSupportedParentEngine(request.engineId)) errors.push(`engineId ${request.engineId} is not supported by the engine catalog`);
  const gameModeContract = getGameModeContract(request.gameMode);
  if (gameModeContract && request.engineId !== gameModeContract.engineId) {
    errors.push(`gameMode ${request.gameMode} is not compatible with engineId ${request.engineId}; expected ${gameModeContract.engineId}`);
  }
  if (gameModeContract && !gameModeContract.supportedLevels.includes(request.level)) {
    errors.push(`gameMode ${request.gameMode} is not available for level ${request.level}`);
  }
  for (const [label, value] of [
    ["sourceEvidencePacketId", request.sourceEvidencePacketId],
    ["activityCompatibilitySnapshotId", request.activityCompatibilitySnapshotId],
    ["audioCoverageRequirementId", request.audioCoverageRequirementId],
    ["mediaRightsManifestId", request.mediaRightsManifestId],
    ["premiumAiCostGateId", request.premiumAiCostGateId],
  ] as const) {
    if (!value.trim()) errors.push(`${label} is required`);
  }
  if (request.supportLanguagePolicy.progressionAllowed !== false) {
    errors.push("supportLanguagePolicy.progressionAllowed must be false");
  }
  if (request.vocabularyTerms.length < 8 || request.vocabularyTerms.length > 12) {
    errors.push("vocabularyTerms must contain between 8 and 12 terms");
  }
  if (request.targetSentences.length !== 2) errors.push("targetSentences must contain exactly 2 structures");
  errors.push(...validatePedagogicalTextFields({
    vocabularyTerms: request.vocabularyTerms,
    targetSentences: request.targetSentences,
  }));
  if (request.sourceReviewStatus === "rejected") errors.push("rejected source content cannot enter generation review");
  if (request.sourceReviewStatus === "draft") errors.push("source content must be reviewed before generation review");
  if (!request.targetLanguageAudioReady) errors.push("target-language audio coverage is required");
  if (!request.mediaRightsReady) errors.push("media rights evidence is required");

  return errors;
}

export function prepareReviewOnlyAiGenerationRequest(request: AiGenerationServiceRequest): AiGenerationServiceResult {
  const validationErrors = validateAiGenerationServiceRequest(request);
  const reviewWarnings: string[] = [];

  if (!request.assistLanguage) {
    reviewWarnings.push("No assist language configured; this is optional and does not block target-language work.");
  } else {
    reviewWarnings.push("Assist language is comprehension support only and cannot satisfy scoring, mastery, or progression.");
  }
  if (!request.teacherApprovalReady) reviewWarnings.push("Teacher approval evidence is still required before any live handoff.");
  if (!request.premiumCostPolicyReady) reviewWarnings.push("Premium AI cost policy is not approved; provider billing remains blocked.");

  return {
    requestId: request.requestId,
    status: "review-only",
    validationErrors,
    reviewWarnings,
    blockedActions: [...blockedActions],
    providerDispatchAllowed: false,
  };
}
