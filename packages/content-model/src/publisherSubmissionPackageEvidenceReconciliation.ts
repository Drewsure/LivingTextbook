export type PublisherSubmissionPackageEvidenceLane =
  | "content"
  | "game"
  | "audio"
  | "video"
  | "image"
  | "font"
  | "accessibility"
  | "rights";

export const PUBLISHER_SUBMISSION_PACKAGE_EVIDENCE_LANES: readonly PublisherSubmissionPackageEvidenceLane[] = [
  "content",
  "game",
  "audio",
  "video",
  "image",
  "font",
  "accessibility",
  "rights",
] as const;

export const CANONICAL_GAME_DERIVED_EVIDENCE_RECORD_IDS = [
  "curated_activity_pathway_packet",
  "canonical_game_integration_packet",
  "package_game_audio_coverage",
] as const;

export function hasCompleteCanonicalGameEvidenceRecordIds(value: readonly string[] | null | undefined): boolean {
  return Boolean(
    value
      && value.length === CANONICAL_GAME_DERIVED_EVIDENCE_RECORD_IDS.length
      && CANONICAL_GAME_DERIVED_EVIDENCE_RECORD_IDS.every((recordId) => value.includes(recordId)),
  );
}

export type PublisherSubmissionPackageEvidenceLaneStatus = "missing" | "review-pending";

export interface PublisherSubmissionPackageEvidenceLaneRecord {
  lane: PublisherSubmissionPackageEvidenceLane;
  status: PublisherSubmissionPackageEvidenceLaneStatus;
  sourceAssetIds: string[];
  publisherEvidenceRequestIds: string[];
  derivedEvidenceRecordIds: string[];
  requiredEvidence: string[];
}

export interface PublisherSubmissionPackageEvidenceReconciliation {
  reconciliationId: string;
  tenantId: string;
  packageId: string;
  manifestId: string;
  packageEvidenceReviewRecord: "upload_quarantine_package_evidence_review";
  status: "blocked";
  lanes: PublisherSubmissionPackageEvidenceLaneRecord[];
  unresolvedRequirements: string[];
  blockedActions: string[];
  nextGate: string[];
  packageAssemblyAllowed: false;
  promotionAllowed: false;
  qrPrintAllowed: false;
  studentFacingUseAllowed: false;
}

export function hasCompleteCanonicalGameEvidence(
  value: Pick<PublisherSubmissionPackageEvidenceReconciliation, "lanes"> | null | undefined,
): boolean {
  const gameLane = value?.lanes.find((lane) => lane.lane === "game");
  return Boolean(
    gameLane
      && gameLane.status === "review-pending"
      && gameLane.sourceAssetIds.length === 0
      && hasCompleteCanonicalGameEvidenceRecordIds(gameLane.derivedEvidenceRecordIds),
  );
}

export function validatePublisherSubmissionPackageEvidenceReconciliation(
  reconciliation: PublisherSubmissionPackageEvidenceReconciliation,
  manifest: {
    manifestId: string;
    tenantId: string;
    packageId: string;
    assets: Array<{ assetId: string }>;
    evidenceRequests: Array<{ referenceId: string; appliesToAssetIds: string[] }>;
  },
): string[] {
  const errors: string[] = [];
  for (const field of ["reconciliationId", "tenantId", "packageId", "manifestId"] as const) {
    if (typeof reconciliation[field] !== "string" || reconciliation[field].trim().length === 0) errors.push(`${field} is required.`);
  }
  if (reconciliation.tenantId !== manifest.tenantId) errors.push("Package evidence reconciliation must match manifest tenant.");
  if (reconciliation.packageId !== manifest.packageId) errors.push("Package evidence reconciliation must match manifest package.");
  if (reconciliation.manifestId !== manifest.manifestId) errors.push("Package evidence reconciliation must match manifest identity.");
  if (reconciliation.packageEvidenceReviewRecord !== "upload_quarantine_package_evidence_review") errors.push("Package evidence reconciliation must bind the canonical package evidence review record.");
  if (reconciliation.status !== "blocked") errors.push("Package evidence reconciliation must remain blocked.");
  if (reconciliation.lanes.length !== PUBLISHER_SUBMISSION_PACKAGE_EVIDENCE_LANES.length) errors.push("Package evidence reconciliation must include every canonical lane.");
  const laneIds = new Set<string>();
  for (const lane of reconciliation.lanes) {
    if (!PUBLISHER_SUBMISSION_PACKAGE_EVIDENCE_LANES.includes(lane.lane)) errors.push(`Unsupported package evidence lane: ${lane.lane}.`);
    if (laneIds.has(lane.lane)) errors.push(`Duplicate package evidence lane: ${lane.lane}.`);
    laneIds.add(lane.lane);
    if (!Array.isArray(lane.sourceAssetIds) || lane.sourceAssetIds.some((assetId) => !assetId.trim())) errors.push(`Package evidence lane ${lane.lane} has invalid source assets.`);
    if (!Array.isArray(lane.publisherEvidenceRequestIds) || lane.publisherEvidenceRequestIds.some((referenceId) => !referenceId.trim())) errors.push(`Package evidence lane ${lane.lane} has invalid publisher evidence references.`);
    if (!Array.isArray(lane.derivedEvidenceRecordIds) || lane.derivedEvidenceRecordIds.some((recordId) => !recordId.trim())) errors.push(`Package evidence lane ${lane.lane} has invalid derived evidence records.`);
    if (lane.lane === "game") {
      if (lane.sourceAssetIds.length > 0) errors.push("Package evidence game lane must not claim publisher source assets.");
      for (const recordId of CANONICAL_GAME_DERIVED_EVIDENCE_RECORD_IDS) if (!lane.derivedEvidenceRecordIds.includes(recordId)) errors.push(`Package evidence game lane must include derived evidence record ${recordId}.`);
    } else if (lane.derivedEvidenceRecordIds.length > 0) {
      errors.push(`Package evidence ${lane.lane} lane must not claim platform-derived evidence records.`);
    }
    if (!Array.isArray(lane.requiredEvidence) || lane.requiredEvidence.length === 0) errors.push(`Package evidence lane ${lane.lane} needs required evidence.`);
    if (lane.status !== "missing" && lane.status !== "review-pending") errors.push(`Package evidence lane ${lane.lane} has an unsupported status.`);
  }
  for (const lane of PUBLISHER_SUBMISSION_PACKAGE_EVIDENCE_LANES) if (!laneIds.has(lane)) errors.push(`Missing canonical package evidence lane: ${lane}.`);
  const assetIds = new Set(manifest.assets.map((asset) => asset.assetId));
  for (const lane of reconciliation.lanes) for (const assetId of lane.sourceAssetIds) if (!assetIds.has(assetId)) errors.push(`Package evidence reconciliation references unknown manifest asset ${assetId}.`);
  const evidenceIds = new Set(manifest.evidenceRequests.map((evidence) => evidence.referenceId));
  const mappedEvidenceIds = new Set<string>();
  for (const lane of reconciliation.lanes) for (const referenceId of lane.publisherEvidenceRequestIds) {
    if (!evidenceIds.has(referenceId)) errors.push(`Package evidence lane ${lane.lane} references unknown publisher evidence ${referenceId}.`);
    mappedEvidenceIds.add(referenceId);
  }
  for (const evidence of manifest.evidenceRequests) if (!mappedEvidenceIds.has(evidence.referenceId)) errors.push(`Publisher evidence ${evidence.referenceId} has no package reconciliation lane.`);
  for (const action of ["No package assembly", "No file promotion", "No QR print", "No student-facing use"]) if (!reconciliation.blockedActions.includes(action)) errors.push(`Package evidence reconciliation must include: ${action}.`);
  if (!Array.isArray(reconciliation.unresolvedRequirements) || reconciliation.unresolvedRequirements.length === 0) errors.push("Package evidence reconciliation must state unresolved requirements.");
  if (!Array.isArray(reconciliation.nextGate) || reconciliation.nextGate.length === 0) errors.push("Package evidence reconciliation must include a next gate.");
  for (const field of ["packageAssemblyAllowed", "promotionAllowed", "qrPrintAllowed", "studentFacingUseAllowed"] as const) if (reconciliation[field] !== false) errors.push(`${field} must remain false.`);
  return [...new Set(errors)];
}
