import type { PublisherSubmissionManifest } from "@living-textbook/content-model";

export function createPublisherSubmissionManifestTemplate({
  tenantId,
  packageId,
  targetLanguage,
  supportLanguages,
}: {
  tenantId: string;
  packageId: string;
  targetLanguage: string;
  supportLanguages: string[];
}): PublisherSubmissionManifest {
  const unitKey = `${tenantId}:pilot:L1:U1`;
  const manifestId = `publisher-submission:${tenantId}:${packageId}:draft`;
  return {
    manifestId,
    tenantId,
    packageId,
    edition: "Publisher pilot intake",
    version: "draft",
    targetLanguage,
    supportLanguages,
    reviewOnly: true,
    filePromotionAllowed: false,
    studentFacingUseAllowed: false,
    assets: [
      asset("textbook-source", "Textbook source document", true, unitKey, ["pdf", "docx", "txt", "md", "csv"], "Source, scan, and mapping review"),
      asset("image", "Labelled diagrams and unit images", false, unitKey, ["png", "jpg", "jpeg", "webp", "svg"], "Image rights, labels, and accessibility review"),
      asset("audio", "Learning audio and music tracks", false, unitKey, ["mp3", "wav", "m4a", "ogg"], "Rights, transcript, cue, and audio-coverage review"),
      asset("video", "Unit video", false, unitKey, ["mp4", "webm", "mov"], "Rights, captions, poster image, and delivery review"),
      asset("transcript", "Transcripts and captions", false, unitKey, ["txt", "vtt", "srt"], "Accessibility and language review"),
      asset("font", "Approved learner font package", false, unitKey, ["woff2", "woff", "ttf", "otf"], "Font license, script coverage, and rendering review"),
      asset("background-media", "Optional game background media", false, unitKey, ["mp3", "wav", "m4a", "ogg", "mp4", "webm", "mov"], "Background-media policy and learning-audio priority review"),
    ],
  };
}

function asset(
  kind: PublisherSubmissionManifest["assets"][number]["kind"],
  label: string,
  required: boolean,
  unitKey: string,
  acceptedTypes: string[],
  nextGate: string,
) {
  return {
    assetId: `${kind}-${unitKey.replace(/[^A-Za-z0-9]+/g, "-").toLowerCase()}`,
    kind,
    label,
    required,
    unitKey,
    acceptedTypes,
    rightsEvidenceRequired: true,
    accessibilityEvidenceRequired: true,
    status: "missing" as const,
    nextGate,
  };
}
