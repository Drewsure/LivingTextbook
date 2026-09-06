export type EvidencePacketHandoffStatus = "preview-ready" | "blocked";

export interface EvidencePacketHandoffSection {
  sectionId: string;
  label: string;
  status: EvidencePacketHandoffStatus;
  sourceRoute: string;
  includedRecords: string[];
  missingBeforeExport: string[];
}

export interface EvidencePacketHandoffRecipient {
  recipientId: string;
  label: string;
  responsibility: string;
  blockedUntil: string[];
}

export interface EvidencePacketHandoffPackage {
  packageId: string;
  tenantId: string;
  label: string;
  summary: string;
  reviewStatus: "handoff-preview-only";
  sourceIndexRoute: string;
  storageRecord: string;
  sections: EvidencePacketHandoffSection[];
  recipients: EvidencePacketHandoffRecipient[];
  exportBlockedActions: string[];
  nextGate: string[];
}

export const samplePublisherEvidencePacketHandoffPackage: EvidencePacketHandoffPackage = {
  packageId: "sample-publisher-evidence-packet-handoff-preview",
  tenantId: "sample-publisher",
  label: "Evidence packet handoff preview",
  summary:
    "Read-only preview of the packet a reviewer would eventually hand to a publisher, school, or platform operator. This page bundles source, rights, scan, target mapping, game asset, media, and release-control evidence without exporting files or collecting signatures.",
  reviewStatus: "handoff-preview-only",
  sourceIndexRoute: "/teacher/evidence/sample-publisher",
  storageRecord: "evidence_packet",
  sections: [
    {
      sectionId: "unit-package-readiness-handoff",
      label: "Unit package readiness evidence",
      status: "preview-ready",
      sourceRoute: "/teacher/intake",
      includedRecords: [
        "unit_package_readiness_packet",
        "payload_validation_packet",
        "target_language_audio_coverage_packet",
        "assist_language_script_policy_packet",
        "curated_activity_pathway_packet",
      ],
      missingBeforeExport: [
        "authenticated reviewer identity",
        "versioned package snapshot",
        "signed teacher release decision",
        "retention and export policy",
      ],
    },
    {
      sectionId: "upload-intake-handoff",
      label: "Upload intake evidence",
      status: "preview-ready",
      sourceRoute: "/teacher/uploads/sample-publisher",
      includedRecords: [
        "source_lineage_packet",
        "rights_proof_packet",
        "scan_and_file_policy_packet",
        "target_mapping_packet",
        "upload_review_decision_packet",
        "release_control_packet",
      ],
      missingBeforeExport: [
        "authenticated reviewer identity",
        "stored evidence attachments",
        "malware scan provider result",
        "signed rights proof",
      ],
    },
    {
      sectionId: "labelled-diagram-handoff",
      label: "Labelled Diagram evidence",
      status: "blocked",
      sourceRoute: "/teacher/assets/labelled-diagram/sample-publisher-l1-u1-labelled-diagram",
      includedRecords: [
        "game_asset_manifest_packet",
        "label_anchor_record_packet",
        "audio_coverage_packet",
        "accessibility_packet",
        "release_control_packet",
      ],
      missingBeforeExport: [
        "stored image asset checksum",
        "reviewed label anchor coordinates",
        "label audio file references",
        "accessibility signoff",
      ],
    },
    {
      sectionId: "media-handoff",
      label: "Media evidence",
      status: "blocked",
      sourceRoute: "/teacher/assets/media/sample-publisher-l1-u1-routines-media",
      includedRecords: [
        "media_manifest_packet",
        "caption_transcript_packet",
        "background_media_policy_packet",
        "local_bundle_checksum_packet",
        "release_control_packet",
      ],
      missingBeforeExport: [
        "stored media rights proof",
        "caption or transcript file",
        "background media teacher setting snapshot",
        "local bundle export checksum",
      ],
    },
  ],
  recipients: [
    {
      recipientId: "publisher",
      label: "Publisher reviewer",
      responsibility: "Confirms source ownership, replacement assets, and year-on-year update obligations.",
      blockedUntil: ["signed rights proof exists", "source lineage is stored"],
    },
    {
      recipientId: "school",
      label: "School approver",
      responsibility: "Confirms classroom use, learner data policy, reporting expectations, and local deployment requirements.",
      blockedUntil: ["student data policy is accepted", "teacher report export policy is accepted"],
    },
    {
      recipientId: "platform",
      label: "Platform operator",
      responsibility: "Confirms storage adapter readiness, release-control state, and route assignment boundaries.",
      blockedUntil: ["evidence storage adapter exists", "release-control gate passes"],
    },
  ],
  exportBlockedActions: [
    "No evidence packet export",
    "No signed approval capture",
    "No publish action",
    "No upload promotion",
    "No route creation",
    "No playlist creation",
    "No assignment route from evidence",
  ],
  nextGate: [
    "Add authenticated reviewer identity",
    "Choose evidence attachment storage",
    "Define retention and export policy",
    "Connect release-control state machine",
    "Verify hosted and local handoff compatibility",
  ],
};
