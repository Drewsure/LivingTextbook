import { validatePedagogicalTextFields } from "@living-textbook/content-model";
import {
  getGameModeContract,
  languageMatches,
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
  audioCoverageTargetLanguage: string;
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

export function validateAiGenerationServiceRequest(request: AiGenerationServiceRequest): string[];
export function validateAiGenerationServiceRequest(request: unknown): string[];
export function validateAiGenerationServiceRequest(request: unknown): string[] {
  const errors: string[] = [];

  if (typeof request !== "object" || request === null) {
    return ["request must be an object"];
  }

  const candidate = request as Record<string, unknown>;
  const readString = (key: string): string | undefined =>
    typeof candidate[key] === "string" ? candidate[key] as string : undefined;
  const requireString = (key: string): string => {
    const value = readString(key);
    if (!value?.trim()) errors.push(`${key} is required`);
    return value ?? "";
  };

  requireString("requestId");
  requireString("tenantId");
  requireString("contentPackageId");
  const targetLanguage = requireString("targetLanguage");
  requireString("theme");
  const level = typeof candidate.level === "number" ? candidate.level : NaN;
  if (!Number.isInteger(level) || level < 1 || level > 8) errors.push("level must be an integer between 1 and 8");
  const assistLanguage = readString("assistLanguage");
  if (candidate.assistLanguage !== undefined && assistLanguage === undefined) {
    errors.push("assistLanguage must be a string when configured");
  }
  if (assistLanguage?.trim().toLowerCase() === targetLanguage.trim().toLowerCase()) {
    errors.push("assistLanguage must differ from targetLanguage; assist language is support-only");
  }
  const gameMode = readString("gameMode") ?? "";
  const engineId = readString("engineId") ?? "";
  if (!gameMode) errors.push("gameMode is required");
  if (!engineId) errors.push("engineId is required");
  if (gameMode && !isSupportedGameModeId(gameMode)) errors.push(`gameMode ${gameMode} is not supported by the curated game catalog`);
  if (engineId && !isSupportedParentEngine(engineId)) errors.push(`engineId ${engineId} is not supported by the engine catalog`);
  const gameModeContract = getGameModeContract(gameMode);
  if (gameModeContract && engineId !== gameModeContract.engineId) {
    errors.push(`gameMode ${gameMode} is not compatible with engineId ${engineId}; expected ${gameModeContract.engineId}`);
  }
  if (gameModeContract && !gameModeContract.supportedLevels.includes(level)) {
    errors.push(`gameMode ${gameMode} is not available for level ${level}`);
  }
  for (const [label, value] of [
    ["sourceEvidencePacketId", requireString("sourceEvidencePacketId")],
    ["activityCompatibilitySnapshotId", requireString("activityCompatibilitySnapshotId")],
    ["audioCoverageRequirementId", requireString("audioCoverageRequirementId")],
    ["mediaRightsManifestId", requireString("mediaRightsManifestId")],
    ["premiumAiCostGateId", requireString("premiumAiCostGateId")],
    ["audioCoverageTargetLanguage", requireString("audioCoverageTargetLanguage")],
  ] as const) {
    if (!value.trim() && !errors.includes(`${label} is required`)) errors.push(`${label} is required`);
  }
  const audioCoverageTargetLanguage = readString("audioCoverageTargetLanguage") ?? "";
  if (audioCoverageTargetLanguage.trim() && targetLanguage.trim() && !languageMatches(audioCoverageTargetLanguage, targetLanguage)) {
    errors.push(`audioCoverageTargetLanguage ${audioCoverageTargetLanguage} must match targetLanguage ${targetLanguage}`);
  }
  const supportLanguagePolicy = candidate.supportLanguagePolicy;
  if (typeof supportLanguagePolicy !== "object" || supportLanguagePolicy === null) {
    errors.push("supportLanguagePolicy is required");
  } else if ((supportLanguagePolicy as { progressionAllowed?: unknown }).progressionAllowed !== false) {
    errors.push("supportLanguagePolicy.progressionAllowed must be false");
  }
  const vocabularyTerms = candidate.vocabularyTerms;
  const targetSentences = candidate.targetSentences;
  const validVocabularyTerms = Array.isArray(vocabularyTerms) && vocabularyTerms.every((term) => typeof term === "string");
  const validTargetSentences = Array.isArray(targetSentences) && targetSentences.every((sentence) => typeof sentence === "string");
  if (!Array.isArray(vocabularyTerms)) errors.push("vocabularyTerms must be an array");
  if (Array.isArray(vocabularyTerms) && !validVocabularyTerms) errors.push("vocabularyTerms must contain only strings");
  if (!Array.isArray(targetSentences)) errors.push("targetSentences must be an array");
  if (Array.isArray(targetSentences) && !validTargetSentences) errors.push("targetSentences must contain only strings");
  const safeVocabularyTerms = validVocabularyTerms ? vocabularyTerms as string[] : [];
  const safeTargetSentences = validTargetSentences ? targetSentences as string[] : [];
  if (safeVocabularyTerms.length < 8 || safeVocabularyTerms.length > 12) {
    errors.push("vocabularyTerms must contain between 8 and 12 terms");
  }
  if (safeTargetSentences.length !== 2) errors.push("targetSentences must contain exactly 2 structures");
  if (validVocabularyTerms && validTargetSentences) errors.push(...validatePedagogicalTextFields({
    vocabularyTerms: safeVocabularyTerms,
    targetSentences: [safeTargetSentences[0] ?? "", safeTargetSentences[1] ?? ""],
  }));
  const sourceReviewStatus = readString("sourceReviewStatus");
  if (!sourceReviewStatus || !["draft", "reviewed", "verified", "approved", "rejected"].includes(sourceReviewStatus)) {
    errors.push("sourceReviewStatus must be a supported review status");
  } else if (sourceReviewStatus === "rejected") {
    errors.push("rejected source content cannot enter generation review");
  } else if (sourceReviewStatus === "draft") {
    errors.push("source content must be reviewed before generation review");
  }
  if (candidate.targetLanguageAudioReady !== true) errors.push("target-language audio coverage is required");
  if (candidate.mediaRightsReady !== true) errors.push("media rights evidence is required");

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
