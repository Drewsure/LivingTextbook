import type { EvidencePacketFlow } from "./sampleEvidencePacketFlows";
import {
  sampleLabelledDiagramEvidencePacketFlow,
  sampleMediaEvidencePacketFlow,
  sampleUploadEvidencePacketFlow,
} from "./sampleEvidencePacketFlows";

export interface EvidencePacketReviewSource {
  sourceId: string;
  label: string;
  href: string;
  sourceRecord: string;
  storageRecord: string;
  flow: EvidencePacketFlow;
  nextEvidenceNeeded: string[];
  protectedLiveActions: string[];
}

export interface EvidencePacketReviewIndex {
  indexId: string;
  tenantId: string;
  label: string;
  summary: string;
  reviewStatus: "review-only" | "blocked";
  sources: EvidencePacketReviewSource[];
  storageContractRecords: string[];
  standingRules: string[];
}

export const samplePublisherEvidencePacketReviewIndex: EvidencePacketReviewIndex = {
  indexId: "sample-publisher-evidence-packet-review-index",
  tenantId: "sample-publisher",
  label: "Tenant evidence packet command center",
  summary:
    "Evidence packet review index for upload, Labelled Diagram, and media asset workspaces. This is a reviewer rollup only: it does not upload evidence, capture signatures, approve packages, publish assets, create routes, or assign students.",
  reviewStatus: "review-only",
  storageContractRecords: [
    "evidence_packet",
    "upload_intake_asset",
    "upload_review_decision",
    "upload_promotion_gate",
    "game_asset_manifest",
    "label_anchor_record",
    "media_manifest",
    "media_playlist_binding",
    "background_media_policy_binding",
    "local_media_bundle_entry",
    "release_control_packet",
  ],
  standingRules: [
    "No live evidence upload",
    "No signed approval capture",
    "No approve or publish action",
    "No upload-to-assignment shortcut",
    "No local folder activation",
    "No playlist creation from uploaded media",
    "No live label editor",
    "No student-facing use from evidence packets alone",
  ],
  sources: [
    {
      sourceId: "upload-evidence-source",
      label: "Upload evidence source",
      href: "/teacher/uploads/sample-publisher",
      sourceRecord: "upload_intake_asset + upload_review_decision + upload_promotion_gate",
      storageRecord: "evidence_packet",
      flow: sampleUploadEvidencePacketFlow,
      nextEvidenceNeeded: [
        "production uploader identity",
        "signed or stored rights proof",
        "real scan service",
        "object storage quarantine path",
        "reviewer identity provider",
        "release-state persistence",
      ],
      protectedLiveActions: [
        "No live upload button",
        "No upload progress bar",
        "No approve or publish action",
        "No assignment route from uploaded file",
      ],
    },
    {
      sourceId: "labelled-diagram-evidence-source",
      label: "Labelled Diagram evidence source",
      href: "/teacher/assets/labelled-diagram/sample-publisher-l1-u1-labelled-diagram",
      sourceRecord: "game_asset_manifest + label_anchor_record",
      storageRecord: "evidence_packet",
      flow: sampleLabelledDiagramEvidencePacketFlow,
      nextEvidenceNeeded: [
        "stored image metadata",
        "reviewer identity",
        "coordinate editor storage",
        "label audio files",
        "accessibility review signoff",
        "live approver signoff",
      ],
      protectedLiveActions: [
        "No live label editor",
        "No coordinate editor",
        "No student-facing image game",
        "No assignment route from uploaded image",
      ],
    },
    {
      sourceId: "media-evidence-source",
      label: "Media evidence source",
      href: "/teacher/assets/media/sample-publisher-l1-u1-routines-media",
      sourceRecord: "media_manifest + media_playlist_binding + background_media_policy_binding + local_media_bundle_entry",
      storageRecord: "evidence_packet",
      flow: sampleMediaEvidencePacketFlow,
      nextEvidenceNeeded: [
        "stored rights proof",
        "object storage reference",
        "caption file",
        "fallback activity mapping",
        "session setting persistence",
        "local bundle export job",
      ],
      protectedLiveActions: [
        "No live media upload",
        "No automatic transcode-to-publish",
        "No playlist creation from uploaded media",
        "No media-only progress",
      ],
    },
  ],
};
