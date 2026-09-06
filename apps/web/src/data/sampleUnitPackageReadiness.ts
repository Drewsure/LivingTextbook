import type { ContentPackage } from "@living-textbook/content-model";
import { getUnitKey, validateAssistLanguageScriptPolicy, validateContentPackage } from "@living-textbook/content-model";
import { samplePackageReleases } from "./sampleContentIntakePlan";
import { sampleMultimediaContentPackage } from "./sampleMultimediaPackage";
import { samplePartnerContentPackage } from "./samplePartnerPackage";

export type UnitPackageGateStatus = "ready" | "review" | "blocked";

export interface UnitPackageReadinessGate {
  gateId: string;
  label: string;
  status: UnitPackageGateStatus;
  blocksPilot: boolean;
  evidence: string;
  nextStep: string;
}

export interface UnitPackageReadinessSummary {
  packageId: string;
  tenantId: string;
  sourceName: string;
  reviewStatus: string;
  stableRoutePath: string;
  activeForQr: boolean;
  unitCount: number;
  termCount: number;
  sentenceCount: number;
  gameModeCount: number;
  mediaAssetCount: number;
  audioAssetCount: number;
  videoAssetCount: number;
  audioCueCount: number;
  audioCoveredGameModeCount: number;
  audioCoveredGameModes: string[];
  assistLanguageCount: number;
  assistLanguagePolicies: Array<{
    unitKey: string;
    assistLanguage: string;
    scriptPolicy: string;
    levelBand: string;
    reviewStatus: string;
  }>;
  validationErrorCount: number;
  gates: UnitPackageReadinessGate[];
}

const reviewedStatuses = new Set(["reviewed", "verified", "approved"]);

export const sampleUnitPackageReadiness = [
  buildUnitPackageReadiness(sampleMultimediaContentPackage),
  buildUnitPackageReadiness(samplePartnerContentPackage),
];

function buildUnitPackageReadiness(contentPackage: ContentPackage): UnitPackageReadinessSummary {
  const release = samplePackageReleases.find((record) => record.packageId === contentPackage.meta.packageId);
  const validationErrors = validateContentPackage(contentPackage);
  const mediaAssets = contentPackage.mediaAssets ?? [];
  const audioAssets = mediaAssets.filter((asset) => asset.kind === "audio");
  const videoAssets = mediaAssets.filter((asset) => asset.kind === "video");
  const audioSupportPlans = contentPackage.audioSupportPlans ?? [];
  const audioCoveredGameModes = Array.from(
    new Set(audioSupportPlans.flatMap((plan) => Object.keys(plan.gameModeAudioCueIds ?? {}))),
  ).sort();
  const assistLanguagePlans = contentPackage.assistLanguagePlans ?? [];
  const assistLanguagePolicies = assistLanguagePlans.map((plan) => ({
    unitKey: plan.unitKey,
    assistLanguage: plan.assistLanguage,
    scriptPolicy: plan.scriptPolicy ?? "Not declared",
    levelBand: plan.levelBand ?? "Tenant-defined",
    reviewStatus: plan.reviewStatus,
  }));
  const assistLanguageScriptErrors = assistLanguagePlans.flatMap((plan) => validateAssistLanguageScriptPolicy(plan));
  const termCount = contentPackage.units.reduce((total, unit) => total + unit.pedagogicalPayload.vocabularyTerms.length, 0);
  const sentenceCount = contentPackage.units.reduce((total, unit) => total + unit.pedagogicalPayload.targetSentences.length, 0);
  const unitKeys = contentPackage.units.map((unit) => getUnitKey(unit.unitMeta));
  const audioSupportReady = unitKeys.every((unitKey) => audioSupportPlans.some((plan) => plan.unitKey === unitKey));
  const mediaRightsReady = mediaAssets.length > 0 && mediaAssets.every((asset) => asset.rightsStatus !== "unknown");
  const releaseReviewed = release?.status === "reviewed" || release?.status === "active";

  return {
    packageId: contentPackage.meta.packageId,
    tenantId: contentPackage.meta.tenantId,
    sourceName: contentPackage.meta.sourceDocumentName ?? contentPackage.meta.sourceType,
    reviewStatus: contentPackage.meta.reviewStatus,
    stableRoutePath: release?.stableRoutePath ?? "Not routed",
    activeForQr: release?.activeForQr ?? false,
    unitCount: contentPackage.units.length,
    termCount,
    sentenceCount,
    gameModeCount: release?.gameModeCount ?? inferGameModeCount(contentPackage),
    mediaAssetCount: mediaAssets.length,
    audioAssetCount: audioAssets.length,
    videoAssetCount: videoAssets.length,
    audioCueCount: contentPackage.audioCues?.length ?? 0,
    audioCoveredGameModeCount: audioCoveredGameModes.length,
    audioCoveredGameModes,
    assistLanguageCount: assistLanguagePlans.length,
    assistLanguagePolicies,
    validationErrorCount: validationErrors.length,
    gates: [
      {
        gateId: "content-review",
        label: "Reviewed source package",
        status: reviewedStatuses.has(contentPackage.meta.reviewStatus) ? "ready" : "review",
        blocksPilot: !reviewedStatuses.has(contentPackage.meta.reviewStatus),
        evidence: `${contentPackage.meta.sourceType} package marked ${contentPackage.meta.reviewStatus}`,
        nextStep: "Keep human review before student assignment.",
      },
      {
        gateId: "payload-validation",
        label: "Validated unit payload",
        status: validationErrors.length === 0 ? "ready" : "blocked",
        blocksPilot: validationErrors.length > 0,
        evidence: validationErrors.length === 0 ? "No package validation errors" : `${validationErrors.length} validation issue(s)`,
        nextStep: validationErrors[0] ?? "Maintain 8-12 terms, exactly 2 sentences, audio support, and visual blacklist checks.",
      },
      {
        gateId: "audio-support",
        label: "Audio-first learner support",
        status: audioSupportReady && (contentPackage.audioCues?.length ?? 0) > 0 && audioCoveredGameModes.length > 0 ? "ready" : "blocked",
        blocksPilot: !audioSupportReady || (contentPackage.audioCues?.length ?? 0) === 0 || audioCoveredGameModes.length === 0,
        evidence: `${audioSupportPlans.length} support plan(s), ${contentPackage.audioCues?.length ?? 0} cue(s), ${audioCoveredGameModes.length} covered mode(s)`,
        nextStep: "Every student-facing term, sentence, instruction, feedback item, critical control, and active game mode needs a cue plan.",
      },
      {
        gateId: "media-assets",
        label: "Media assets and rights",
        status: mediaRightsReady ? "review" : "blocked",
        blocksPilot: !mediaRightsReady,
        evidence: `${audioAssets.length} audio asset(s), ${videoAssets.length} video asset(s)`,
        nextStep: "Replace placeholders with owned, licensed, or partner-provided files before production assignment.",
      },
      {
        gateId: "route-and-games",
        label: "Route and game coverage",
        status: release && release.gameModeCount > 0 ? "ready" : "blocked",
        blocksPilot: !release || release.gameModeCount === 0,
        evidence: release ? `${release.gameModeCount} mode(s) through ${release.stableRoutePath}` : "No release route record",
        nextStep: "Keep front-door entry, flashcards, Match Up, Label It, Memory Match, Balloon Pop, and Speak It routes aligned to the package.",
      },
      {
        gateId: "assist-language",
        label: "Assist-language review",
        status:
          assistLanguagePlans.length === 0
            ? "review"
            : assistLanguageScriptErrors.length > 0
              ? "blocked"
              : assistLanguagePlans.every((plan) => reviewedStatuses.has(plan.reviewStatus))
                ? "ready"
                : "review",
        blocksPilot: false,
        evidence:
          assistLanguagePlans.length === 0
            ? "No optional assist-language plan configured"
            : `${assistLanguagePlans.length} assist-language plan(s); ${assistLanguageScriptErrors.length} script-policy issue(s)`,
        nextStep:
          assistLanguageScriptErrors[0] ??
          "Support language remains optional comprehension support and never unlocks target-language progression.",
      },
      {
        gateId: "teacher-release",
        label: "Teacher release approval",
        status: releaseReviewed && release.activeForQr ? "ready" : "review",
        blocksPilot: !releaseReviewed,
        evidence: release ? `${release.status}; QR active: ${release.activeForQr ? "yes" : "no"}` : "No release record",
        nextStep: "Teacher or tenant owner must approve release state before printed QR or live class use.",
      },
    ],
  };
}

function inferGameModeCount(contentPackage: ContentPackage): number {
  const modes = new Set(contentPackage.units.map((unit) => unit.unitMeta.gameMode));

  for (const cue of contentPackage.audioCues ?? []) {
    if (cue.gameMode) {
      modes.add(cue.gameMode);
    }
  }

  return modes.size;
}
