import {
  PUBLISHER_SUBMISSION_PACKAGE_EVIDENCE_LANES,
  validatePublisherSubmissionPackageEvidenceReconciliation,
  type PublisherSubmissionPackageEvidenceLane,
  type PublisherSubmissionPackageEvidenceReconciliation,
  type PublisherSubmissionManifest,
} from "@living-textbook/content-model";

const assetKindsByLane: Record<PublisherSubmissionPackageEvidenceLane, PublisherSubmissionManifest["assets"][number]["kind"][]> = {
  content: ["textbook-source"],
  game: [],
  audio: ["audio", "background-media"],
  video: ["video", "background-media"],
  image: ["image"],
  font: ["font"],
  accessibility: ["textbook-source", "image", "audio", "video", "transcript", "font", "background-media"],
  rights: ["textbook-source", "image", "audio", "video", "transcript", "font", "background-media"],
};

const derivedEvidenceRecordIdsByLane: Partial<Record<PublisherSubmissionPackageEvidenceLane, string[]>> = {
  game: ["curated_activity_pathway_packet", "canonical_game_integration_packet", "package_game_audio_coverage"],
};

export function createPublisherSubmissionPackageEvidenceReconciliation(
  manifest: PublisherSubmissionManifest,
): PublisherSubmissionPackageEvidenceReconciliation {
  const lanes = PUBLISHER_SUBMISSION_PACKAGE_EVIDENCE_LANES.map((lane) => {
    const sourceAssetIds = manifest.assets
      .filter((asset) => assetKindsByLane[lane].includes(asset.kind))
      .map((asset) => asset.assetId);
    const derivedEvidenceRecordIds = derivedEvidenceRecordIdsByLane[lane] ?? [];
    const requiredEvidence = lane === "game"
      ? ["Curated activity pathway", "Deterministic scoring and progression replay", "Target-language audio coverage"]
      : lane === "accessibility"
        ? ["Accessible text and interaction review", "Target/support language script review", "Transcript, caption, or visual alternative evidence"]
        : lane === "rights"
          ? ["Publisher ownership or license evidence", "Permitted delivery scope", "Year-on-year update responsibility"]
          : ["Manifest asset identity", "Checksum or source lineage", "Reviewer evidence reference"];
    return {
      lane,
      status: sourceAssetIds.length > 0 || derivedEvidenceRecordIds.length > 0 ? "review-pending" as const : "missing" as const,
      sourceAssetIds,
      derivedEvidenceRecordIds,
      requiredEvidence,
    };
  });
  const unresolvedRequirements = lanes.flatMap((lane) => [
    ...(lane.status === "missing"
      ? [`${lane.lane} evidence has no mapped manifest asset or derived evidence record.`]
      : [`${lane.lane} evidence is awaiting reviewer references.`]),
    ...lane.requiredEvidence.map((evidence) => `${lane.lane}: ${evidence}`),
  ]);
  return {
    reconciliationId: `package-evidence-reconciliation:${manifest.tenantId}:${manifest.packageId}:draft`,
    tenantId: manifest.tenantId,
    packageId: manifest.packageId,
    manifestId: manifest.manifestId,
    packageEvidenceReviewRecord: "upload_quarantine_package_evidence_review",
    status: "blocked",
    lanes,
    unresolvedRequirements,
    blockedActions: ["No package assembly", "No file promotion", "No QR print", "No student-facing use"],
    nextGate: [
      "Attach reviewer evidence references to every canonical lane",
      "Reconcile the package review packet checksum with quarantine",
      "Complete teacher, publisher, and accessibility review",
      "Keep release, delivery, and persistence as separate gates",
    ],
    packageAssemblyAllowed: false,
    promotionAllowed: false,
    qrPrintAllowed: false,
    studentFacingUseAllowed: false,
  };
}

export function validatePublisherSubmissionPackageEvidenceReconciliationPreview(
  reconciliation: PublisherSubmissionPackageEvidenceReconciliation,
  manifest: PublisherSubmissionManifest,
): string[] {
  return validatePublisherSubmissionPackageEvidenceReconciliation(reconciliation, manifest);
}
