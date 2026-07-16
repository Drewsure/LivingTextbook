export type EvidencePacketAssemblyLaneStatus = "preview-ready" | "blocked";

export interface EvidencePacketAssemblyLane {
  laneId: string;
  label: string;
  status: EvidencePacketAssemblyLaneStatus;
  ownerRole: string;
  sourceRoute: string;
  packetKeys: string[];
  requiredBeforeRelease: string[];
}

export interface EvidencePacketAssemblyGate {
  gateId: string;
  tenantId: string;
  label: string;
  summary: string;
  assemblyStatus: string;
  packetVersionStatus: string;
  sourceReviewRoute: string;
  handoffPreviewRoute: string;
  exportReadinessStatus: string;
  storageAdapterStatus: string;
  lanes: EvidencePacketAssemblyLane[];
  releasePreconditions: string[];
  reviewerInstructions: string[];
  blockedActions: string[];
}

export const sampleEvidencePacketAssemblyGate: EvidencePacketAssemblyGate = {
  gateId: "sample-publisher-evidence-packet-assembly-gate",
  tenantId: "sample-publisher",
  label: "Evidence packet assembly gate",
  summary:
    "Review-only assembly gate with Release readiness lanes that combine upload, Labelled Diagram, media, and release-control evidence into one go/no-go view before any export, approval, QR promotion, route promotion, storage write, or student assignment exists.",
  assemblyStatus: "Assembly blocked",
  packetVersionStatus: "Packet version not frozen",
  sourceReviewRoute: "/teacher/evidence/sample-publisher",
  handoffPreviewRoute: "/teacher/evidence/sample-publisher/handoff",
  exportReadinessStatus: "Evidence export blocked",
  storageAdapterStatus: "Storage adapter selection blocked",
  lanes: [
    {
      laneId: "upload-intake-assembly-lane",
      label: "Upload intake assembly lane",
      status: "blocked",
      ownerRole: "Teacher reviewer",
      sourceRoute: "/teacher/uploads/sample-publisher",
      packetKeys: [
        "source_lineage_packet",
        "rights_proof_packet",
        "scan_and_file_policy_packet",
        "target_mapping_packet",
        "upload_review_decision_packet",
      ],
      requiredBeforeRelease: [
        "authenticated reviewer identity",
        "rights proof attached",
        "scan provider result",
        "durable target mapping write",
      ],
    },
    {
      laneId: "labelled-diagram-assembly-lane",
      label: "Labelled Diagram assembly lane",
      status: "blocked",
      ownerRole: "Asset reviewer",
      sourceRoute: "/teacher/assets/labelled-diagram/sample-publisher-l1-u1-labelled-diagram",
      packetKeys: [
        "game_asset_manifest_packet",
        "label_anchor_record_packet",
        "audio_coverage_packet",
        "accessibility_packet",
      ],
      requiredBeforeRelease: [
        "stored image checksum",
        "label anchor review",
        "audio coverage verified",
        "accessibility signoff",
      ],
    },
    {
      laneId: "media-assembly-lane",
      label: "Media assembly lane",
      status: "blocked",
      ownerRole: "Media reviewer",
      sourceRoute: "/teacher/assets/media/sample-publisher-l1-u1-routines-media",
      packetKeys: [
        "media_manifest_packet",
        "caption_transcript_packet",
        "background_media_policy_packet",
        "local_bundle_checksum_packet",
      ],
      requiredBeforeRelease: [
        "stored media rights proof",
        "caption or transcript file",
        "background media teacher setting snapshot",
        "local bundle checksum",
      ],
    },
    {
      laneId: "release-control-assembly-lane",
      label: "Release-control assembly lane",
      status: "blocked",
      ownerRole: "Tenant approver",
      sourceRoute: "/teacher/intake",
      packetKeys: ["release_control_packet", "pilot_evidence_packet", "classroom_launch_gate"],
      requiredBeforeRelease: [
        "release control state machine connected",
        "evidence storage adapter selected",
        "attachment metadata complete",
        "classroom launch gate passed",
      ],
    },
  ],
  releasePreconditions: [
    "Authenticated reviewer identity",
    "Evidence storage adapter selected",
    "Attachment metadata complete",
    "Rights proof attached",
    "Scan provider result",
    "Audio coverage verified",
    "Accessibility signoff",
    "Release control state machine connected",
    "Teacher dry-run evidence accepted",
    "Classroom launch gate accepted",
  ],
  reviewerInstructions: [
    "Open each source route and resolve missing evidence before requesting approval.",
    "Treat support-language material as explanation only; target-language evidence controls progress readiness.",
    "Keep media optional unless it is learning audio required for visible text.",
    "Do not freeze a packet version until storage, export, and release-control gates are selected and verified.",
  ],
  blockedActions: [
    "No packet version freeze",
    "No approval capture",
    "No release state mutation",
    "No student assignment",
    "No export generation",
    "No QR promotion",
    "No route promotion",
    "No local bundle activation",
    "No storage write",
    "No evidence download",
  ],
};
