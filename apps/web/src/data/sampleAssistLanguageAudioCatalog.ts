import {
  createReviewOnlyAssistLanguageAudioCatalogRecord,
  type AssistLanguageAudioCatalogDecision,
  type AssistLanguageAudioCatalogEvidenceStatus,
  type AssistLanguageAudioCatalogKind,
  type AssistLanguageAudioCatalogRecord,
  type ContentPackage,
} from "@living-textbook/content-model";
import { sampleAssistLanguageAudioEvidencePackets } from "./sampleAssistLanguageAudioEvidence";
import { sampleMultimediaContentPackage } from "./sampleMultimediaPackage";
import { samplePartnerContentPackage } from "./samplePartnerPackage";

const packages = [sampleMultimediaContentPackage, samplePartnerContentPackage];

export const sampleAssistLanguageAudioCatalogRecords = sampleAssistLanguageAudioEvidencePackets.flatMap((packet) => {
  const contentPackage = packages.find((candidate) => candidate.meta.packageId === packet.packageId);
  return contentPackage ? buildCatalogRecords(packet, contentPackage) : [];
});

function buildCatalogRecords(
  packet: (typeof sampleAssistLanguageAudioEvidencePackets)[number],
  contentPackage: ContentPackage,
): AssistLanguageAudioCatalogRecord[] {
  return packet.items.map((item) => {
    const cue = item.audioCueId
      ? contentPackage.audioCues?.find((candidate) => candidate.audioCueId === item.audioCueId)
      : undefined;
    const asset = item.mediaAssetId
      ? contentPackage.mediaAssets?.find((candidate) => candidate.mediaAssetId === item.mediaAssetId)
      : undefined;
    const sourceLineageRef = contentPackage.meta.sourceDocumentHash
      ?? contentPackage.meta.sourceDocumentName
      ?? `${contentPackage.meta.packageId}:teacher-review`;
    const transcriptStatus = evidenceStatus(cue?.transcript);
    const spokenTextMatch: AssistLanguageAudioCatalogEvidenceStatus = cue?.transcript && normalize(cue.transcript) === normalize(item.glossText)
      ? "reviewed"
      : cue?.transcript
        ? "captured"
        : "missing";
    const fallbackStatus = deliveryEvidenceStatus(cue?.sourceUri || cue?.localBundlePath || asset?.sourceUri || asset?.localBundlePath);
    const blockers = [...item.blockers];

    if (!asset?.checksum) blockers.push("Checksum evidence is not captured.");
    if (asset?.rightsStatus === "unknown" || !asset?.rightsStatus) blockers.push("Rights evidence is not reviewed.");
    if (transcriptStatus === "missing") blockers.push("Transcript evidence is not captured.");
    if (spokenTextMatch !== "reviewed") blockers.push("Spoken-text match is not verified against the reviewed gloss.");
    if (fallbackStatus !== "reviewed") blockers.push("Local/hosted delivery fallback evidence is not reviewed.");

    const decision: AssistLanguageAudioCatalogDecision = blockers.length === 0
      ? "admission-ready"
      : item.audioCueId && item.mediaAssetId
        ? "needs-review"
        : "blocked";

    return createReviewOnlyAssistLanguageAudioCatalogRecord({
      catalogRecordId: `assist-audio-catalog-${item.itemId}`,
      tenantId: packet.tenantId,
      packageId: packet.packageId,
      unitKey: packet.unitKey ?? "unassigned-unit",
      itemId: item.itemId,
      kind: item.kind as AssistLanguageAudioCatalogKind,
      sourceText: item.sourceText,
      glossText: item.glossText,
      language: packet.assistLanguage ?? "und",
      audioCueId: item.audioCueId,
      mediaAssetId: item.mediaAssetId,
      checksum: asset?.checksum,
      transcript: cue?.transcript,
      rightsStatus: asset?.rightsStatus,
      sourceLineageRef,
      accessibility: {
        transcript: transcriptStatus,
        spokenTextMatch,
        fallback: fallbackStatus,
      },
      delivery: {
        hostedReference: asset?.sourceUri ?? cue?.sourceUri,
        localBundlePath: asset?.localBundlePath ?? cue?.localBundlePath,
      },
      decision,
      blockers: [...new Set(blockers)],
      blockedActions: [],
      promotionAllowed: false,
      studentFacingAllowed: false,
      mode: "review-only",
      sideEffect: "none",
    });
  });
}

function evidenceStatus(value: string | undefined): AssistLanguageAudioCatalogEvidenceStatus {
  return value?.trim() ? "captured" : "missing";
}

function deliveryEvidenceStatus(value: string | undefined): AssistLanguageAudioCatalogEvidenceStatus {
  return value?.trim() ? "captured" : "missing";
}

function normalize(value: string): string {
  return value.trim().replace(/\s+/gu, " ").toLocaleLowerCase();
}
