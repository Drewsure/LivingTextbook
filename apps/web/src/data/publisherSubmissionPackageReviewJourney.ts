import {
  validatePublisherSubmissionPackageReviewJourney,
  type PublisherSubmissionPackageReviewJourney,
  type PublisherSubmissionManifest,
} from "@living-textbook/content-model";

export function createPublisherSubmissionPackageReviewJourney(
  manifest: PublisherSubmissionManifest,
  reconciliationId: string,
): PublisherSubmissionPackageReviewJourney {
  const quarantineId = "q-00000000-0000-4000-8000-000000000001";
  const packageReviewPacketId = `${manifest.packageId}:${quarantineId}:package-review-packet`;
  return {
    journeyId: `publisher-review-journey:${manifest.tenantId}:${manifest.packageId}:sample`,
    tenantId: manifest.tenantId,
    packageId: manifest.packageId,
    manifestId: manifest.manifestId,
    reconciliationId,
    quarantineId,
    evidencePacketId: "evidence-packet-sample-publisher-unit-1-complete",
    packageReviewPacketId,
    packageEvidenceReviewId: `${manifest.packageId}:${quarantineId}:package-evidence-review`,
    sourceChecksumSha256: "a".repeat(64),
    evidenceIndexRoute: `/teacher/evidence/${manifest.tenantId}`,
    evidenceHandoffRoute: `/teacher/evidence/${manifest.tenantId}/handoff`,
    status: "blocked",
    reviewOnly: true,
    sampleDataOnly: true,
    gates: [
      {
        gateId: "manifest-received",
        label: "Publisher manifest received",
        status: "passed",
        evidence: "The tenant/package manifest defines the source and multimedia lanes without receiving files.",
        nextAction: "Keep the manifest identity bound to every downstream review record.",
      },
      {
        gateId: "evidence-lane-reconciliation",
        label: "Canonical evidence lanes reconciled",
        status: "blocked",
        evidence: "The derived reconciliation identifies the content, game, media, accessibility, and rights lanes, but reviewer references are not complete.",
        nextAction: "Attach reviewer evidence references to every canonical lane.",
      },
      {
        gateId: "quarantine-package-review",
        label: "Quarantine package review packet",
        status: "blocked",
        evidence: "The sample packet identity is reserved for controlled rehearsal; it is not a release approval.",
        nextAction: "Record an accepted source decision through the gated quarantine workflow.",
      },
      {
        gateId: "package-evidence-review",
        label: "Reviewed multimedia and game evidence",
        status: "blocked",
        evidence: "Game pathway, deterministic scoring, target-language audio, media rights, accessibility, and font evidence remain review inputs.",
        nextAction: "Complete the canonical package-evidence review without uploading through this preview.",
      },
      {
        gateId: "delivery-and-qr",
        label: "Delivery and QR review",
        status: "blocked",
        evidence: "Local, hosted, and hybrid options are available for comparison, but no delivery manifest or QR authorization is active.",
        nextAction: "Choose a delivery mode and complete release-control evidence after package review.",
      },
      {
        gateId: "teacher-rehearsal",
        label: "Teacher-led student rehearsal",
        status: "blocked",
        evidence: "The teacher/student routes exist as a controlled sample, but real learner records and classroom launch remain disabled.",
        nextAction: "Run the approved dry run and record privacy, device, audio, and recovery evidence.",
      },
    ],
    blockedActions: ["No package assembly", "No file promotion", "No QR print", "No persistence activation", "No student-facing use"],
    nextGates: [
      "Complete canonical package-evidence review.",
      "Reconcile the immutable package packet checksum and tenant identity.",
      "Complete delivery, QR, policy, rollback, and teacher rehearsal gates.",
      "Obtain explicit human release authorization before any pilot activation.",
    ],
    packageAssemblyAllowed: false,
    promotionAllowed: false,
    qrPrintAllowed: false,
    persistenceActivationAllowed: false,
    studentFacingUseAllowed: false,
  };
}

export function validatePublisherSubmissionPackageReviewJourneyPreview(
  journey: PublisherSubmissionPackageReviewJourney,
): string[] {
  return validatePublisherSubmissionPackageReviewJourney(journey);
}
