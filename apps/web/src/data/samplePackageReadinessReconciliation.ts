import {
  PACKAGE_READINESS_BLOCKED_ACTIONS,
  validatePackageReadinessSourceAssemblyBinding,
  validatePackageReadinessReconciliations,
  type PackageReadinessLane,
  type PackageReadinessReconciliation,
} from "@living-textbook/content-model";
import { sampleSourcePackageAssemblyPackets } from "@/data/sampleSourcePackageAssembly";

export const samplePackageReadinessReconciliations: PackageReadinessReconciliation[] = sampleSourcePackageAssemblyPackets.map((packet) => {
  const miniStar = packet.tenantId === "ministar";
  const mediaRightsStatus = packet.mediaRightsReviewed ? "ready-preview" : "blocked";
  const lanes: PackageReadinessLane[] = [
    {
      laneId: "source-assembly",
      label: "Source assembly",
      status: packet.status === "blocked" ? "blocked" : "ready-preview",
      sourceRecord: "source_package_assembly_packet",
      referenceId: packet.packetId,
      evidence: `${packet.candidateUnitKeys.length} candidate unit(s) and ${packet.candidateMediaAssetIds.length} candidate media asset(s) are mapped.`,
      blocksRelease: packet.status === "blocked",
    },
    {
      laneId: "approval-ledger",
      label: "Approval ledger",
      status: packet.approvalLedgerLinked ? "ready-preview" : "blocked",
      sourceRecord: "package_approval_ledger",
      referenceId: packet.approvalLedgerId,
      evidence: packet.approvalLedgerLinked ? "Evidence-only approval ledger is linked; no approval capture is enabled." : "No approval ledger is linked.",
      blocksRelease: !packet.approvalLedgerLinked,
    },
    {
      laneId: "verifier-evidence",
      label: "Verifier evidence",
      status: "blocked",
      sourceRecord: "ai_verifier_result_evidence_packet",
      referenceId: `verifier-${packet.tenantId}-l1-u1-review`,
      evidence: "Verifier evidence remains a review requirement before a canonical package can advance.",
      blocksRelease: true,
    },
    {
      laneId: "target-language-audio",
      label: "Target-language audio approval",
      status: "blocked",
      sourceRecord: "target_language_audio_approval",
      referenceId: `audio-approval-${packet.tenantId}-l1-u1-review`,
      evidence: miniStar ? "English term, sentence, instruction, feedback, and game-control audio still require approval." : "Target-language audio coverage still requires teacher and publisher review.",
      blocksRelease: true,
    },
    {
      laneId: "media-rights",
      label: "Media rights evidence",
      status: mediaRightsStatus,
      sourceRecord: "media_rights_evidence_attachment",
      referenceId: `media-rights-${packet.tenantId}-l1-u1-review`,
      evidence: mediaRightsStatus === "ready-preview" ? "Media rights evidence is present for review." : "Real media files and rights proof remain unresolved.",
      blocksRelease: mediaRightsStatus !== "ready-preview",
    },
    {
      laneId: "publish-gate",
      label: "Package publish gate",
      status: "blocked",
      sourceRecord: "package_publish_gate",
      referenceId: `${packet.targetPackageId}-publish-gate`,
      evidence: "Release-blocking publish conditions remain open.",
      blocksRelease: true,
    },
    {
      laneId: "assignment-rollout",
      label: "Assignment rollout",
      status: "blocked",
      sourceRecord: "teacher_assignment_rollout_gate",
      referenceId: `${packet.targetPackageId}-assignment-rollout-gate`,
      evidence: "Student assignment remains blocked until package release and policy gates pass.",
      blocksRelease: true,
    },
  ];

  return {
    reconciliationId: `package-readiness-${packet.packetId}`,
    tenantId: packet.tenantId,
    packageId: packet.targetPackageId,
    releaseCandidate: `${packet.targetPackageId}-review-candidate`,
    label: miniStar ? "MiniStar package readiness reconciliation" : "Sample publisher package readiness reconciliation",
    summary: "One review-only status joins source, approval, verifier, audio, media rights, publish, and assignment evidence without authorizing promotion.",
    mode: "review-only",
    status: "blocked",
    sourceAssemblyPacketId: packet.packetId,
    sourceExtractionPreviewId: packet.extractionPreviewId,
    sourceAssemblyChecksum: packet.sourceChecksum,
    approvalLedgerId: packet.approvalLedgerId,
    verifierEvidencePacketId: `verifier-${packet.tenantId}-l1-u1-review`,
    targetLanguageAudioApprovalId: `audio-approval-${packet.tenantId}-l1-u1-review`,
    mediaRightsEvidenceId: `media-rights-${packet.tenantId}-l1-u1-review`,
    publishGateId: `${packet.targetPackageId}-publish-gate`,
    assignmentRolloutGateId: `${packet.targetPackageId}-assignment-rollout-gate`,
    targetLanguageProgressionRule: "Target-language activity drives progress; support language can assist comprehension but cannot unlock progression.",
    lanes,
    blockedActions: [...PACKAGE_READINESS_BLOCKED_ACTIONS],
    promotionAllowed: false,
    studentFacingActivationAllowed: false,
  };
});

export const samplePackageReadinessReconciliationErrors = [
  ...validatePackageReadinessReconciliations(samplePackageReadinessReconciliations),
  ...samplePackageReadinessReconciliations.flatMap((reconciliation) => {
    const assembly = sampleSourcePackageAssemblyPackets.find((packet) => packet.packetId === reconciliation.sourceAssemblyPacketId);
    return validatePackageReadinessSourceAssemblyBinding(reconciliation, assembly);
  }),
];
