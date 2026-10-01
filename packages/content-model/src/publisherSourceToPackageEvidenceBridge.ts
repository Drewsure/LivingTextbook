export type PublisherSourceEvidenceBridgeStatus = "present" | "preview-only" | "missing" | "blocked";

export interface PublisherSourceEvidenceBridgeLane {
  laneId: string;
  label: string;
  status: PublisherSourceEvidenceBridgeStatus;
  identity: string;
  details: string;
  nextAction: string;
}

export interface PublisherSourcePreflightEvidenceReference {
  reportId: string;
  manifestId: string;
  manifestChecksumSha256: string;
  inventoryChecksumSha256: string;
}

export interface PublisherSourceToPackageEvidenceBridge {
  recordVersion: 1;
  bridgeId: string;
  tenantId: string;
  unitKey: string;
  sourceReviewId: string;
  extractionPreviewId: string;
  extractionPacketId: string;
  authoringProposalId: string;
  sourceChecksum: string;
  preflightReference: PublisherSourcePreflightEvidenceReference | null;
  status: "blocked";
  reviewOnly: true;
  evidenceLanes: PublisherSourceEvidenceBridgeLane[];
  missingEvidence: string[];
  draftCreationAllowed: false;
  packageAssemblyAllowed: false;
  packagePromotionAllowed: false;
  qrPrintAllowed: false;
  studentFacingUseAllowed: false;
  storageWriteAllowed: false;
  mode: "review-only";
  sideEffect: "none";
}

const expectedLaneIds = ["source-provenance", "extraction-preview", "source-term-review", "sentence-approval", "target-language-audio", "media-rights", "game-verification", "package-release"] as const;

export function createPublisherSourceToPackageEvidenceBridge(input: {
  tenantId: string;
  unitKey: string;
  sourceReviewId: string;
  extractionPreviewId: string;
  extractionPacketId: string;
  authoringProposalId: string;
  sourceChecksum: string;
  preflightReference?: PublisherSourcePreflightEvidenceReference | null;
  sourceTermsReviewed: boolean;
  sentenceApprovalRecorded: boolean;
  audioEvidenceReady: boolean;
  mediaRightsReady?: boolean;
  canonicalGameEvidenceComplete?: boolean;
}): PublisherSourceToPackageEvidenceBridge {
  const missingEvidence: string[] = [];
  const sourceReviewStatus: PublisherSourceEvidenceBridgeStatus = input.sourceTermsReviewed ? "present" : "blocked";
  const sentenceStatus: PublisherSourceEvidenceBridgeStatus = input.sentenceApprovalRecorded ? "present" : "blocked";
  const audioStatus: PublisherSourceEvidenceBridgeStatus = input.audioEvidenceReady ? "present" : "blocked";
  const mediaRightsStatus: PublisherSourceEvidenceBridgeStatus = input.mediaRightsReady ? "present" : "missing";
  const gameVerificationStatus: PublisherSourceEvidenceBridgeStatus = input.canonicalGameEvidenceComplete ? "present" : "blocked";
  if (!input.sourceTermsReviewed) missingEvidence.push("teacher source-term review");
  if (!input.sentenceApprovalRecorded) missingEvidence.push("teacher approval of exactly two target sentence structures");
  if (!input.audioEvidenceReady) missingEvidence.push("reviewed English audio evidence");
  missingEvidence.push("Japanese support review", "package and release approval");
  if (!input.mediaRightsReady) missingEvidence.push("multimedia rights evidence");
  if (!input.canonicalGameEvidenceComplete) missingEvidence.push("complete canonical game evidence set");
  if (!input.preflightReference) missingEvidence.push("publisher source preflight fingerprint reconciliation");
  return {
    recordVersion: 1,
    bridgeId: `${input.unitKey}:${input.sourceReviewId}:source-package-evidence-bridge`,
    tenantId: input.tenantId,
    unitKey: input.unitKey,
    sourceReviewId: input.sourceReviewId,
    extractionPreviewId: input.extractionPreviewId,
    extractionPacketId: input.extractionPacketId,
    authoringProposalId: input.authoringProposalId,
    sourceChecksum: input.sourceChecksum,
    preflightReference: input.preflightReference ?? null,
    status: "blocked",
    reviewOnly: true,
    evidenceLanes: [
      { laneId: "source-provenance", label: "Source provenance", status: sourceReviewStatus, identity: input.sourceReviewId, details: input.preflightReference ? "The source review and publisher preflight reference are available for checksum reconciliation." : "The supplied source review remains checksum-bound and review-only, but its publisher preflight fingerprints are not linked yet.", nextAction: input.preflightReference ? "Reconcile the preflight manifest and inventory fingerprints with the submitted source before review advances." : "Attach the publisher source preflight report and reconcile its manifest and inventory fingerprints." },
      { laneId: "extraction-preview", label: "Extraction preview", status: "preview-only", identity: input.extractionPreviewId, details: "The extracted segments are evidence for review, not a draft payload.", nextAction: "Reconcile the preview against the rendered source and preserve segment provenance." },
      { laneId: "source-term-review", label: "Source-term review", status: sourceReviewStatus, identity: `${input.sourceReviewId}:terms`, details: input.sourceTermsReviewed ? "Source terms have a recorded review decision." : "The source terms have not received a recorded human review decision.", nextAction: "Record the reviewer and decision for the canonical vocabulary list." },
      { laneId: "sentence-approval", label: "Sentence approval", status: sentenceStatus, identity: input.authoringProposalId, details: "The two sentence candidates are platform-authored and are never treated as extracted source text.", nextAction: "Approve or edit exactly two sentence structures after reviewing the source terms." },
      { laneId: "target-language-audio", label: "Target-language audio", status: audioStatus, identity: `${input.unitKey}:audio-evidence`, details: input.audioEvidenceReady ? "Reviewed English audio evidence is attached." : "No reviewed term, sentence, instruction, or feedback audio is attached.", nextAction: "Attach reviewed English audio evidence before any game route can be considered." },
      { laneId: "media-rights", label: "Multimedia rights", status: mediaRightsStatus, identity: `${input.unitKey}:media-rights`, details: input.mediaRightsReady ? "Reviewed rights evidence is attached to the package evidence record." : "The source does not yet have reviewed rights evidence for images, video, music, fonts, or game background media.", nextAction: input.mediaRightsReady ? "Keep rights references aligned with the final delivery mode and release checksum." : "Supply rights owner, permitted use, captions/transcripts, and local/hosted distribution decisions." },
      { laneId: "game-verification", label: "Game verification replay", status: gameVerificationStatus, identity: `${input.unitKey}:game-verification`, details: input.canonicalGameEvidenceComplete ? "The complete canonical game evidence set is attached to the package evidence record." : "The package review has not proven the complete canonical game evidence set.", nextAction: input.canonicalGameEvidenceComplete ? "Keep replay evidence aligned with the canonical payload and release candidate." : "Bind curated activity pathways, canonical game integration, and game-audio coverage before marking game verification present." },
      { laneId: "package-release", label: "Package and release", status: "blocked", identity: `${input.unitKey}:release`, details: "No package, QR, assignment, local bundle, or hosted persistence release is authorized.", nextAction: "Complete all upstream evidence, then use the separate human release gate." },
    ],
    missingEvidence,
    draftCreationAllowed: false,
    packageAssemblyAllowed: false,
    packagePromotionAllowed: false,
    qrPrintAllowed: false,
    studentFacingUseAllowed: false,
    storageWriteAllowed: false,
    mode: "review-only",
    sideEffect: "none",
  };
}

export function validatePublisherSourceToPackageEvidenceBridge(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Publisher source-to-package evidence bridge must be an object."];
  if (value.recordVersion !== 1) errors.push("Publisher source-to-package evidence bridge recordVersion must be 1.");
  for (const field of ["bridgeId", "tenantId", "unitKey", "sourceReviewId", "extractionPreviewId", "extractionPacketId", "authoringProposalId"] as const) if (!isNonEmptyString(value[field])) errors.push(`Publisher source-to-package evidence bridge ${field} must be non-empty.`);
  if (!/^sha256:[0-9a-f]{64}$/i.test(String(value.sourceChecksum ?? ""))) errors.push("Publisher source-to-package evidence bridge checksum must use sha256:<64 hexadecimal characters>.");
  if (value.preflightReference !== null && value.preflightReference !== undefined) {
    if (!isRecord(value.preflightReference)) errors.push("Publisher source-to-package evidence bridge preflightReference must be an object or null.");
    else {
      for (const field of ["reportId", "manifestId"] as const) if (!isNonEmptyString(value.preflightReference[field])) errors.push(`Publisher source-to-package evidence bridge preflightReference ${field} must be non-empty.`);
      for (const field of ["manifestChecksumSha256", "inventoryChecksumSha256"] as const) if (!/^sha256:[0-9a-f]{64}$/i.test(String(value.preflightReference[field] ?? ""))) errors.push(`Publisher source-to-package evidence bridge preflightReference ${field} must use sha256:<64 hexadecimal characters>.`);
    }
  }
  if (value.status !== "blocked" || value.reviewOnly !== true || value.mode !== "review-only" || value.sideEffect !== "none") errors.push("Publisher source-to-package evidence bridge must remain blocked, review-only, and side-effect-free.");
  if (!Array.isArray(value.evidenceLanes) || value.evidenceLanes.length !== expectedLaneIds.length) errors.push("Publisher source-to-package evidence bridge must contain the eight required evidence lanes.");
  const seen = new Set<string>();
  for (const item of Array.isArray(value.evidenceLanes) ? value.evidenceLanes : []) {
    if (!isRecord(item)) { errors.push("Publisher source-to-package evidence bridge lanes must be objects."); continue; }
    const laneId = String(item.laneId ?? "");
    if (!isNonEmptyString(item.laneId) || seen.has(laneId)) errors.push("Publisher source-to-package evidence bridge lane ids must be unique and non-empty.");
    seen.add(laneId);
    for (const field of ["label", "identity", "details", "nextAction"] as const) if (!isNonEmptyString(item[field])) errors.push(`Publisher source-to-package evidence bridge lane ${field} must be non-empty.`);
    if (!["present", "preview-only", "missing", "blocked"].includes(String(item.status))) errors.push("Publisher source-to-package evidence bridge lane status is unsupported.");
  }
  for (const laneId of expectedLaneIds) if (!seen.has(laneId)) errors.push(`Publisher source-to-package evidence bridge is missing lane ${laneId}.`);
  if (!Array.isArray(value.missingEvidence) || value.missingEvidence.some((item) => !isNonEmptyString(item))) errors.push("Publisher source-to-package evidence bridge missingEvidence must contain non-empty strings.");
  for (const field of ["draftCreationAllowed", "packageAssemblyAllowed", "packagePromotionAllowed", "qrPrintAllowed", "studentFacingUseAllowed", "storageWriteAllowed"] as const) if (value[field] !== false) errors.push(`${field} must remain false.`);
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function isNonEmptyString(value: unknown): value is string { return typeof value === "string" && value.trim().length > 0; }
