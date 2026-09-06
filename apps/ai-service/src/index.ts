import type { GameModeId, ParentEngine } from "@living-textbook/content-model";

export type AiGenerationServiceStatus = "review-only" | "provider-dispatch-ready";
export type AiGenerationServiceReviewStatus = "draft" | "reviewed" | "verified" | "approved" | "rejected";

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
  if (request.vocabularyTerms.length < 8 || request.vocabularyTerms.length > 12) {
    errors.push("vocabularyTerms must contain between 8 and 12 terms");
  }
  if (request.targetSentences.length !== 2) errors.push("targetSentences must contain exactly 2 structures");
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
