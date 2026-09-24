import {
  getUnitKey,
  type AudioCue,
  type AudioCueKind,
  type ContentPackage,
  type UnitAssistLanguagePlan,
} from "@living-textbook/content-model";
import { sampleMultimediaContentPackage } from "./sampleMultimediaPackage";
import { samplePartnerContentPackage } from "./samplePartnerPackage";

export type AssistLanguageAudioEvidenceStatus =
  | "not-configured"
  | "missing"
  | "cue-only"
  | "metadata-captured"
  | "rights-review";

export interface AssistLanguageAudioEvidenceItem {
  itemId: string;
  kind: Extract<AudioCueKind, "term" | "sentence" | "instruction">;
  sourceText: string;
  glossText: string;
  audioCueId?: string;
  mediaAssetId?: string;
  status: AssistLanguageAudioEvidenceStatus;
  blockers: string[];
}

export interface AssistLanguageAudioEvidencePacket {
  packetId: string;
  tenantId: string;
  packageId: string;
  unitKey?: string;
  assistLanguage?: string;
  targetLanguage?: string;
  reviewStatus: "review-only";
  items: AssistLanguageAudioEvidenceItem[];
  missingEvidence: string[];
  blockedActions: string[];
}

const blockedActions = [
  "No support-language progression trigger",
  "No assist-audio asset promotion",
  "No student-facing assist audio",
  "No speech API billing",
  "No raw learner recording or transcript storage",
];

export const sampleAssistLanguageAudioEvidencePackets = [
  buildAssistLanguageAudioEvidencePacket(sampleMultimediaContentPackage),
  buildAssistLanguageAudioEvidencePacket(samplePartnerContentPackage),
];

export function buildAssistLanguageAudioEvidencePacket(contentPackage: ContentPackage): AssistLanguageAudioEvidencePacket {
  const plan = contentPackage.assistLanguagePlans?.[0];

  if (!plan) {
    return {
      packetId: `assist-audio-evidence-${contentPackage.meta.packageId}-none`,
      tenantId: contentPackage.meta.tenantId,
      packageId: contentPackage.meta.packageId,
      targetLanguage: contentPackage.meta.targetLanguage,
      reviewStatus: "review-only",
      items: [],
      missingEvidence: ["No optional assist-language plan is configured."],
      blockedActions: [...blockedActions],
    };
  }

  const unit = contentPackage.units.find((candidate) => getUnitKey(candidate.unitMeta) === plan.unitKey) ?? contentPackage.units[0];
  if (!unit) {
    throw new Error(`Assist-language audio packet has no matching unit: ${plan.unitKey}`);
  }

  const items: AssistLanguageAudioEvidenceItem[] = [
    ...unit.pedagogicalPayload.vocabularyTerms.map((term) => buildItem({
      packetId: contentPackage.meta.packageId,
      kind: "term",
      sourceText: term,
      glossText: plan.vocabularyGlosses[term] ?? "",
      plan,
      contentPackage,
    })),
    ...unit.pedagogicalPayload.targetSentences.map((sentence, index) => buildItem({
      packetId: contentPackage.meta.packageId,
      kind: "sentence",
      sourceText: sentence,
      glossText: plan.sentenceGlosses[index] ?? "",
      plan,
      contentPackage,
    })),
    ...Object.entries(plan.instructionGlosses ?? {}).map(([instruction, gloss]) => buildItem({
      packetId: contentPackage.meta.packageId,
      kind: "instruction",
      sourceText: instruction,
      glossText: gloss,
      plan,
      contentPackage,
    })),
  ];

  return {
    packetId: `assist-audio-evidence-${contentPackage.meta.packageId}-${plan.unitKey}`,
    tenantId: contentPackage.meta.tenantId,
    packageId: contentPackage.meta.packageId,
    unitKey: plan.unitKey,
    assistLanguage: plan.assistLanguage,
    targetLanguage: plan.targetLanguage,
    reviewStatus: "review-only",
    items,
    missingEvidence: [...new Set(items.flatMap((item) => item.blockers))],
    blockedActions: [...blockedActions],
  };
}

function buildItem({
  packetId,
  kind,
  sourceText,
  glossText,
  plan,
  contentPackage,
}: {
  packetId: string;
  kind: Extract<AudioCueKind, "term" | "sentence" | "instruction">;
  sourceText: string;
  glossText: string;
  plan: UnitAssistLanguagePlan;
  contentPackage: ContentPackage;
}): AssistLanguageAudioEvidenceItem {
  const itemId = `${packetId}:${kind}:${sourceText}`;
  const blockers: string[] = [];

  if (glossText.trim().length === 0) {
    blockers.push("Reviewed assist-language gloss is missing.");
    return { itemId, kind, sourceText, glossText, status: "missing", blockers };
  }

  const cue = (contentPackage.audioCues ?? []).find(
    (candidate) => candidate.tenantId === contentPackage.meta.tenantId
      && candidate.unitKey === plan.unitKey
      && candidate.kind === kind
      && languageMatches(candidate.language, plan.assistLanguage)
      && normalize(candidate.text) === normalize(glossText),
  );

  if (!cue) {
    blockers.push("No assist-language audio cue is bound to this reviewed gloss.");
    return { itemId, kind, sourceText, glossText, status: "missing", blockers };
  }

  const mediaAsset = cue.mediaAssetId
    ? (contentPackage.mediaAssets ?? []).find((asset) => asset.mediaAssetId === cue.mediaAssetId)
    : undefined;

  if (!mediaAsset) {
    blockers.push("Audio cue exists, but no audio media asset is bound.");
    return { itemId, kind, sourceText, glossText, audioCueId: cue.audioCueId, status: "cue-only", blockers };
  }

  if (mediaAsset.kind !== "audio") {
    blockers.push("Bound media asset is not an audio asset.");
    return { itemId, kind, sourceText, glossText, audioCueId: cue.audioCueId, mediaAssetId: mediaAsset.mediaAssetId, status: "rights-review", blockers };
  }

  if (mediaAsset.rightsStatus === "unknown") blockers.push("Audio asset rights status is unknown.");
  if (!mediaAsset.sourceUri && !mediaAsset.localBundlePath) blockers.push("Audio asset has no hosted or local delivery reference.");

  return {
    itemId,
    kind,
    sourceText,
    glossText,
    audioCueId: cue.audioCueId,
    mediaAssetId: mediaAsset.mediaAssetId,
    status: blockers.length > 0 ? "rights-review" : "metadata-captured",
    blockers,
  };
}

function languageMatches(value: string, expected: string): boolean {
  const actual = value.trim().toLowerCase();
  const target = expected.trim().toLowerCase();
  return actual === target || actual.startsWith(`${target}-`) || target.startsWith(`${actual}-`);
}

function normalize(value: string): string {
  return value.trim().replace(/\s+/gu, " ").toLocaleLowerCase();
}
