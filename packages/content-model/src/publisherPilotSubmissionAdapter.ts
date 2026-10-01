import type { PublisherSubmissionAssetKind, PublisherSubmissionManifest } from "./publisherSubmissionManifest";
import type { PublisherPilotIntakeBrief } from "./publisherPilotIntakeBrief";
import { validatePublisherPilotIntakeBrief } from "./publisherPilotIntakeBrief";

export function createPublisherSubmissionManifestFromPilotIntake(
  brief: PublisherPilotIntakeBrief,
  packageId: string,
): PublisherSubmissionManifest {
  const briefErrors = validatePublisherPilotIntakeBrief(brief);
  if (briefErrors.length > 0) throw new Error(`Publisher pilot intake brief is not ready for manifest preview: ${briefErrors.join(" ")}`);
  if (!packageId.trim()) throw new Error("packageId is required for manifest preview.");

  const declaredKinds = new Map(brief.mediaRequests.map((request) => [request.kind, request]));
  const assets = canonicalKinds.map((kind) => {
    const request = declaredKinds.get(kind);
    return {
      assetId: `${kind}-${brief.unitKey.replace(/[^A-Za-z0-9]+/g, "-").toLowerCase().replace(/^-|-$/g, "")}`,
      kind,
      label: request ? `Publisher-declared ${kind}` : `Optional ${kind} lane not declared`,
      required: kind === "textbook-source" || request?.required === true,
      unitKey: brief.unitKey,
      acceptedTypes: acceptedTypesByKind[kind],
      rightsEvidenceRequired: true,
      accessibilityEvidenceRequired: true,
      status: "missing" as const,
      nextGate: request ? `Review ${kind} file, rights, accessibility, and mapping evidence` : `Publisher must confirm whether ${kind} is supplied or intentionally omitted`,
    };
  });

  const assetIdByPath = new Map<string, string>();
  for (const sourcePath of brief.sourceFiles) assetIdByPath.set(sourcePath, assets.find((asset) => asset.kind === "textbook-source")!.assetId);
  for (const request of brief.mediaRequests) assetIdByPath.set(request.relativePath, assets.find((asset) => asset.kind === request.kind)!.assetId);

  return {
    manifestId: `publisher-submission:${brief.tenantId}:${packageId}:${brief.version}:from-pilot-intake`,
    tenantId: brief.tenantId,
    packageId,
    edition: brief.edition,
    version: brief.version,
    targetLanguage: brief.targetLanguage,
    supportLanguages: brief.supportLanguages,
    evidenceRequests: brief.evidenceRequests.map((evidence) => ({
      referenceId: evidence.referenceId,
      kind: evidence.kind,
      relativePath: evidence.relativePath,
      appliesToAssetIds: evidence.appliesTo.map((path) => assetIdByPath.get(path) ?? "unknown-asset"),
      required: evidence.required,
      status: "missing" as const,
    })),
    reviewOnly: true,
    filePromotionAllowed: false,
    studentFacingUseAllowed: false,
    assets,
  };
}

const canonicalKinds: PublisherSubmissionAssetKind[] = [
  "textbook-source",
  "image",
  "audio",
  "video",
  "transcript",
  "font",
  "background-media",
];

const acceptedTypesByKind: Record<PublisherSubmissionAssetKind, string[]> = {
  "textbook-source": ["pdf", "docx", "txt", "md", "csv"],
  image: ["png", "jpg", "jpeg", "webp", "svg"],
  audio: ["mp3", "wav", "m4a", "ogg"],
  video: ["mp4", "webm", "mov"],
  transcript: ["txt", "vtt", "srt"],
  font: ["woff2", "woff", "ttf", "otf"],
  "background-media": ["mp3", "wav", "m4a", "ogg", "mp4", "webm", "mov"],
};
