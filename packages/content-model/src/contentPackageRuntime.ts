import type { ContentPackage, ContentReviewStatus } from "./index";
import { getUnitKey, validateAssistLanguageScriptPolicy, validateContentPackage } from "./index";

export type ContentPackageRuntimeMode = "review-only" | "hosted-managed" | "local-classroom" | "hybrid";

export interface ContentPackageRuntimeRequest {
  tenantId: string;
  packageId: string;
  targetLanguage: string;
  contentPackage: ContentPackage;
  curatedPathwayReviewed: boolean;
  storagePolicyAccepted: boolean;
  persistenceReady: boolean;
  teacherReleaseApproved: boolean;
  studentFacingUseRequested: boolean;
  qrActivationRequested: boolean;
}

export interface ContentPackageRuntimeDecision {
  allowed: boolean;
  mode: ContentPackageRuntimeMode;
  reasonCode: string;
  reasons: string[];
  contentReviewStatus: ContentReviewStatus;
}

export interface ContentPackageRuntimeResult {
  request: ContentPackageRuntimeRequest;
  decision: ContentPackageRuntimeDecision;
  sideEffect: "none" | "read-only";
}

export interface ContentPackageRuntimeAdapter {
  readonly mode: ContentPackageRuntimeMode;
  evaluate(request: ContentPackageRuntimeRequest): ContentPackageRuntimeDecision;
  execute(request: ContentPackageRuntimeRequest): ContentPackageRuntimeResult;
}

export const reviewOnlyContentPackageBlockedActions = [
  "No package write",
  "No student-ready marker",
  "No QR activation",
  "No assignment or route activation",
  "No playlist or game-mode mutation",
] as const;

export function validateContentPackageRuntimeRequest(request: ContentPackageRuntimeRequest): string[] {
  const errors: string[] = [];
  const contentPackage = request.contentPackage;
  const units = contentPackage.units;
  const unitKeys = units.map((unit) => getUnitKey(unit.unitMeta));
  const targetLanguage = request.targetLanguage.trim().toLowerCase();

  if (!request.tenantId.trim()) errors.push("tenantId is required");
  if (!request.packageId.trim()) errors.push("packageId is required");
  if (!targetLanguage) errors.push("targetLanguage is required");
  if (contentPackage.meta.tenantId !== request.tenantId) errors.push("content package tenant must match runtime tenantId");
  if (contentPackage.meta.packageId !== request.packageId) errors.push("content package id must match runtime packageId");
  if (!request.curatedPathwayReviewed) errors.push("curated activity pathway review is required");

  errors.push(...validateContentPackage(contentPackage));

  if (request.studentFacingUseRequested || request.qrActivationRequested) {
    if (contentPackage.meta.reviewStatus !== "approved") {
      errors.push("student-facing package use requires approved content review status");
    }
    if (!request.storagePolicyAccepted) errors.push("accepted tenant or school storage policy is required");
    if (!request.persistenceReady) errors.push("package persistence readiness is required");
    if (!request.teacherReleaseApproved) errors.push("teacher or tenant release approval is required");
  }

  if (request.qrActivationRequested && !request.studentFacingUseRequested) {
    errors.push("QR activation requires student-facing package use to be requested");
  }

  for (const unit of units) {
    const unitKey = getUnitKey(unit.unitMeta);
    const audioPlan = contentPackage.audioSupportPlans?.find((plan) => plan.unitKey === unitKey);

    if (!audioPlan) continue;

    const targetCueIds = [
      ...audioPlan.vocabularyAudioCueIds,
      ...audioPlan.sentenceAudioCueIds,
      ...(audioPlan.instructionAudioCueIds ?? []),
      ...(audioPlan.feedbackAudioCueIds ?? []),
      ...(audioPlan.gameModeAudioCueIds ? Object.values(audioPlan.gameModeAudioCueIds).flat() : []),
    ];
    const targetCues = targetCueIds
      .map((cueId) => contentPackage.audioCues?.find((cue) => cue.audioCueId === cueId))
      .filter((cue): cue is NonNullable<typeof cue> => Boolean(cue));
    const missingTargetLanguageCues = targetCues.filter((cue) => !languageMatches(cue.language, targetLanguage));

    if (missingTargetLanguageCues.length > 0) {
      errors.push(`Unit ${unitKey} audio support must keep every learner-facing cue in the target language ${request.targetLanguage}.`);
    }
  }

  const assistPlans = contentPackage.assistLanguagePlans ?? [];
  for (const plan of assistPlans) {
    errors.push(...validateAssistLanguageScriptPolicy(plan));
    if (plan.studentVisibility !== "teacher-only" && !["reviewed", "verified", "approved"].includes(plan.reviewStatus)) {
      errors.push(`Student-visible assist language plan for ${plan.unitKey} must be reviewed before package use.`);
    }
  }

  if (unitKeys.length === 0) errors.push("content package must contain at least one unit");
  return [...new Set(errors)];
}

export function createReviewOnlyContentPackageRuntimeAdapter(): ContentPackageRuntimeAdapter {
  return {
    mode: "review-only",
    evaluate(request) {
      const validationErrors = validateContentPackageRuntimeRequest(request);
      const reasons = [
        ...validationErrors,
        ...reviewOnlyContentPackageBlockedActions,
        "No content package runtime adapter has been selected for live use",
      ];

      return {
        allowed: false,
        mode: "review-only",
        reasonCode: validationErrors.length > 0 ? "invalid-content-package-runtime-request" : "review-only-content-package-runtime",
        reasons: [...new Set(reasons)],
        contentReviewStatus: request.contentPackage.meta.reviewStatus,
      };
    },
    execute(request) {
      return {
        request,
        decision: this.evaluate(request),
        sideEffect: "none",
      };
    },
  };
}

function languageMatches(value: string, targetLanguage: string): boolean {
  const language = value.trim().toLowerCase();
  return language === targetLanguage || language.startsWith(`${targetLanguage}-`) || targetLanguage.startsWith(`${language}-`);
}
