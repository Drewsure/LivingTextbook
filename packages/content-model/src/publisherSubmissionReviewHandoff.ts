import type { PublisherSubmissionManifest } from "./publisherSubmissionManifest";

export type PublisherSubmissionReviewHandoffStatus = "review-only";

export interface PublisherSubmissionEvidenceLane {
  laneId: string;
  assetId: string;
  label: string;
  sourceRoute: string;
  evidenceRequestIds: string[];
  requiredEvidence: string[];
  status: "awaiting-evidence";
}

export interface PublisherSubmissionReviewHandoff {
  handoffId: string;
  tenantId: string;
  packageId: string;
  manifestId: string;
  sourceManifestRoute: string;
  evidenceIndexRoute: string;
  evidenceHandoffRoute: string;
  status: PublisherSubmissionReviewHandoffStatus;
  lanes: PublisherSubmissionEvidenceLane[];
  blockedActions: string[];
  nextGate: string[];
}

export function validatePublisherSubmissionReviewHandoff(
  handoff: PublisherSubmissionReviewHandoff,
  manifest: PublisherSubmissionManifest,
): string[] {
  const errors: string[] = [];
  for (const [field, value] of Object.entries(handoff)) {
    if (["lanes", "blockedActions", "nextGate", "status"].includes(field)) continue;
    if (typeof value !== "string" || value.trim().length === 0) errors.push(`${field} is required.`);
  }
  if (handoff.status !== "review-only") errors.push("Submission review handoff must remain review-only.");
  if (handoff.tenantId !== manifest.tenantId) errors.push("Submission review handoff must match manifest tenant.");
  if (handoff.packageId !== manifest.packageId) errors.push("Submission review handoff must match manifest package.");
  if (handoff.manifestId !== manifest.manifestId) errors.push("Submission review handoff must match manifest identity.");
  for (const [field, value] of Object.entries({
    sourceManifestRoute: handoff.sourceManifestRoute,
    evidenceIndexRoute: handoff.evidenceIndexRoute,
    evidenceHandoffRoute: handoff.evidenceHandoffRoute,
  })) {
    if (!isInternalPath(value)) errors.push(`${field} must be an internal route.`);
  }

  const lanes = Array.isArray(handoff.lanes) ? handoff.lanes : [];
  if (lanes.length !== manifest.assets.length) errors.push("Every manifest asset must have exactly one evidence lane.");
  const assetIds = new Set<string>();
  for (const lane of lanes) {
    if (!lane.laneId.trim() || !lane.assetId.trim() || !lane.label.trim()) errors.push("Every evidence lane needs identity and label text.");
    if (assetIds.has(lane.assetId)) errors.push(`Duplicate evidence lane asset id: ${lane.assetId}.`);
    assetIds.add(lane.assetId);
    if (!isInternalPath(lane.sourceRoute)) errors.push(`Evidence lane ${lane.laneId} must use an internal route.`);
    if (lane.status !== "awaiting-evidence") errors.push(`Evidence lane ${lane.laneId} must remain awaiting-evidence.`);
    if (!Array.isArray(lane.evidenceRequestIds) || lane.evidenceRequestIds.some((referenceId) => !referenceId.trim())) errors.push(`Evidence lane ${lane.laneId} needs evidence request ids.`);
    if (!Array.isArray(lane.requiredEvidence) || lane.requiredEvidence.length === 0) errors.push(`Evidence lane ${lane.laneId} needs required evidence.`);
  }
  for (const asset of manifest.assets) {
    if (!assetIds.has(asset.assetId)) errors.push(`Manifest asset ${asset.assetId} has no evidence lane.`);
  }
  const evidenceIds = new Set(manifest.evidenceRequests.map((evidence) => evidence.referenceId));
  const coveredEvidenceIds = new Set<string>();
  for (const lane of lanes) {
    for (const referenceId of lane.evidenceRequestIds) {
      if (!evidenceIds.has(referenceId)) errors.push(`Evidence lane ${lane.laneId} references unknown evidence request ${referenceId}.`);
      coveredEvidenceIds.add(referenceId);
    }
  }
  for (const evidence of manifest.evidenceRequests) if (!coveredEvidenceIds.has(evidence.referenceId)) errors.push(`Manifest evidence request ${evidence.referenceId} has no review handoff lane.`);

  for (const action of [
    "No file promotion",
    "No evidence packet export",
    "No signed approval capture",
    "No QR print",
    "No student-facing use",
  ]) {
    if (!handoff.blockedActions.includes(action)) errors.push(`Submission review handoff must include: ${action}.`);
  }
  if (!Array.isArray(handoff.nextGate) || handoff.nextGate.length === 0) errors.push("Submission review handoff must include a next gate.");
  return [...new Set(errors)];
}

export function createPublisherSubmissionReviewHandoff(
  manifest: PublisherSubmissionManifest,
  routes: {
    sourceManifestRoute: string;
    evidenceIndexRoute: string;
    evidenceHandoffRoute: string;
  },
): PublisherSubmissionReviewHandoff {
  return {
    handoffId: `publisher-submission-review:${manifest.tenantId}:${manifest.packageId}:draft`,
    tenantId: manifest.tenantId,
    packageId: manifest.packageId,
    manifestId: manifest.manifestId,
    ...routes,
    status: "review-only",
    lanes: manifest.assets.map((asset) => ({
      ...(() => {
        const evidenceRequestIds = manifest.evidenceRequests.filter((evidence) => evidence.appliesToAssetIds.includes(asset.assetId)).map((evidence) => evidence.referenceId);
        return { evidenceRequestIds };
      })(),
      laneId: `evidence-lane:${asset.assetId}`,
      assetId: asset.assetId,
      label: asset.label,
      sourceRoute: routes.sourceManifestRoute,
      requiredEvidence: [
        "Publisher source or asset identity",
        "Rights or permission evidence",
        "Accessibility and language evidence",
        asset.nextGate,
      ],
      status: "awaiting-evidence",
    })),
    blockedActions: [
      "No file promotion",
      "No evidence packet export",
      "No signed approval capture",
      "No QR print",
      "No student-facing use",
    ],
    nextGate: [
      "Attach evidence to each manifest lane",
      "Reconcile the package with quarantine review",
      "Complete teacher and publisher review",
      "Pass release-control and delivery policy gates",
    ],
  };
}

function isInternalPath(value: unknown): value is string {
  return typeof value === "string" && value.startsWith("/") && !/^(?:\/\/|file:|https?:\/\/|[A-Za-z]:)/i.test(value);
}
