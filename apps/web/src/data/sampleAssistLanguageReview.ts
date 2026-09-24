import {
  getAssistLanguageAudioCoverage,
  getUnitKey,
  validateAssistLanguageScriptPolicy,
  type ContentPackage,
  type UnitAssistLanguagePlan,
} from "@living-textbook/content-model";
import { sampleMultimediaContentPackage } from "./sampleMultimediaPackage";
import { samplePartnerContentPackage } from "./samplePartnerPackage";

export type AssistLanguageReviewPacketStatus =
  | "reviewed-text"
  | "review-required"
  | "not-configured"
  | "blocked";

export interface AssistLanguageReviewPacket {
  packetId: string;
  tenantId: string;
  packageId: string;
  unitKey?: string;
  label: string;
  status: AssistLanguageReviewPacketStatus;
  targetLanguage: string;
  assistLanguage?: string;
  source?: string;
  reviewStatus?: string;
  studentVisibility?: string;
  scriptPolicy?: string;
  levelBand?: string;
  vocabularyGlossCount: number;
  sentenceGlossCount: number;
  instructionGlossCount: number;
  assistAudioCueCount: number;
  assistAudioCoverage: {
    terms: string;
    sentences: string;
    instructions: string;
    ready: boolean;
  };
  allowLiveAiFallback: boolean;
  reviewEvidence: string[];
  openItems: string[];
  blockedActions: string[];
}

const reviewedStatuses = new Set(["reviewed", "verified", "approved"]);

export const sampleAssistLanguageReviewPackets: AssistLanguageReviewPacket[] = [
  buildAssistLanguageReviewPacket(sampleMultimediaContentPackage),
  buildAssistLanguageReviewPacket(samplePartnerContentPackage),
];

export function buildAssistLanguageReviewPacket(contentPackage: ContentPackage): AssistLanguageReviewPacket {
  const plans = contentPackage.assistLanguagePlans ?? [];
  const plan = plans[0];
  const packageId = contentPackage.meta.packageId;
  const tenantId = contentPackage.meta.tenantId;

  if (!plan) {
    return {
      packetId: `assist-review-${packageId}-none`,
      tenantId,
      packageId,
      label: `${contentPackage.meta.sourceDocumentName ?? packageId} support-language review`,
      status: "not-configured",
      targetLanguage: contentPackage.meta.targetLanguage ?? "declared in unit",
      vocabularyGlossCount: 0,
      sentenceGlossCount: 0,
      instructionGlossCount: 0,
      assistAudioCueCount: 0,
      assistAudioCoverage: { terms: "0 / 0", sentences: "0 / 0", instructions: "0 / 0", ready: false },
      allowLiveAiFallback: false,
      reviewEvidence: ["No optional assist-language plan is configured for this package."],
      openItems: ["A tenant owner must supply and review support-language content before student visibility is considered."],
      blockedActions: getBlockedActions(),
    };
  }

  return buildPlanReviewPacket(contentPackage, plan);
}

function buildPlanReviewPacket(contentPackage: ContentPackage, plan: UnitAssistLanguagePlan): AssistLanguageReviewPacket {
  const scriptErrors = validateAssistLanguageScriptPolicy(plan);
  const unit = contentPackage.units.find((candidate) => getUnitKey(candidate.unitMeta) === plan.unitKey) ?? contentPackage.units[0];

  if (!unit) {
    throw new Error(`Assist-language review plan has no matching unit: ${plan.unitKey}`);
  }

  const assistAudioCoverage = getAssistLanguageAudioCoverage({
    unit,
    plan,
    audioCues: contentPackage.audioCues,
  });
  const reviewEvidence = [
    `${plan.source} source with ${plan.reviewStatus} review status.`,
    `${plan.studentVisibility} student visibility; target-language activity remains the progression trigger.`,
    `${plan.vocabularyGlosses ? Object.keys(plan.vocabularyGlosses).length : 0} vocabulary glosses and ${plan.sentenceGlosses.length} sentence glosses are present.`,
    `Script policy is declared as ${plan.scriptPolicy ?? "not declared"} for the ${plan.levelBand ?? "tenant-defined"} band.`,
  ];
  const openItems = [...scriptErrors];

  if (!assistAudioCoverage.ready) {
    openItems.push(`Assist-language audio coverage is incomplete: ${assistAudioCoverage.missingTerms.length} term(s), ${assistAudioCoverage.missingSentences.length} sentence(s), and ${assistAudioCoverage.missingInstructions.length} instruction(s) remain.`);
  }

  if (plan.allowLiveAiFallback) {
    openItems.push("Live AI assist fallback is declared; tenant policy review is required before any student-facing use.");
  }

  if (!reviewedStatuses.has(plan.reviewStatus)) {
    openItems.push("Student-visible support text must reach reviewed, verified, or approved status before assignment.");
  }

  return {
    packetId: `assist-review-${contentPackage.meta.packageId}-${plan.unitKey}`,
    tenantId: contentPackage.meta.tenantId,
    packageId: contentPackage.meta.packageId,
    unitKey: plan.unitKey,
    label: `${contentPackage.meta.sourceDocumentName ?? contentPackage.meta.packageId} support-language review`,
    status: scriptErrors.length > 0 ? "blocked" : reviewedStatuses.has(plan.reviewStatus) ? "reviewed-text" : "review-required",
    targetLanguage: plan.targetLanguage,
    assistLanguage: plan.assistLanguage,
    source: plan.source,
    reviewStatus: plan.reviewStatus,
    studentVisibility: plan.studentVisibility,
    scriptPolicy: plan.scriptPolicy,
    levelBand: plan.levelBand,
    vocabularyGlossCount: Object.keys(plan.vocabularyGlosses).length,
    sentenceGlossCount: plan.sentenceGlosses.length,
    instructionGlossCount: Object.keys(plan.instructionGlosses ?? {}).length,
    assistAudioCueCount: assistAudioCoverage.audioCueCount,
    assistAudioCoverage: {
      terms: `${assistAudioCoverage.coveredTermCount} / ${assistAudioCoverage.requiredTermCount}`,
      sentences: `${assistAudioCoverage.coveredSentenceCount} / ${assistAudioCoverage.requiredSentenceCount}`,
      instructions: `${assistAudioCoverage.coveredInstructionCount} / ${assistAudioCoverage.requiredInstructionCount}`,
      ready: assistAudioCoverage.ready,
    },
    allowLiveAiFallback: plan.allowLiveAiFallback ?? false,
    reviewEvidence,
    openItems,
    blockedActions: getBlockedActions(),
  };
}

function getBlockedActions(): string[] {
  return [
    "No support-language progression trigger",
    "No mastery credit from assist text or audio",
    "No live translation or AI fallback",
    "No student assignment, package promotion, or QR activation",
    "No durable approval, export, or hosted write",
  ];
}
