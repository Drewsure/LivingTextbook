export type EvidenceAttachmentStorageStatus = "blocked-preview" | "planned";

export interface EvidenceAttachmentStorageCandidate {
  candidateId: string;
  label: string;
  status: EvidenceAttachmentStorageStatus;
  deploymentFit: "hosted" | "local" | "hybrid";
  purpose: string;
  requiredBeforeUse: string[];
  blockedActions: string[];
}

export interface EvidenceAttachmentStorageReadinessPlan {
  planId: string;
  tenantId: string;
  label: string;
  summary: string;
  sourceExportGate: string;
  storageStatus: string;
  candidates: EvidenceAttachmentStorageCandidate[];
  requiredMetadata: string[];
  storagePolicyGates: string[];
  blockedStorageActions: string[];
}

export const sampleEvidenceAttachmentStorageReadinessPlan: EvidenceAttachmentStorageReadinessPlan = {
  planId: "sample-publisher-evidence-attachment-storage-readiness",
  tenantId: "sample-publisher",
  label: "Evidence attachment storage readiness",
  summary:
    "Defines where reviewed evidence attachments could live later for hosted, closed local, and hybrid deployments. This is an attachment storage blocked preview only; no evidence file upload, object write, local folder write, download, signed approval attachment, release-state mutation, or student-facing attachment is enabled.",
  sourceExportGate: "/teacher/intake#evidence-export-readiness",
  storageStatus: "Attachment storage blocked",
  candidates: [
    {
      candidateId: "hosted-object-storage",
      label: "Hosted object storage candidate",
      status: "blocked-preview",
      deploymentFit: "hosted",
      purpose:
        "Future hosted PWA storage lane for publisher review evidence, rights proof, scan results, and signed packet attachments after the backend adapter is selected.",
      requiredBeforeUse: [
        "storage adapter selected",
        "tenant-scoped bucket or container",
        "quarantine path",
        "checksum required",
        "malware scan status",
        "retention period",
        "delete/export policy",
        "access-control policy accepted",
      ],
      blockedActions: ["No object storage write", "No evidence file upload", "No attachment download"],
    },
    {
      candidateId: "closed-local-evidence-folder",
      label: "Closed local evidence folder candidate",
      status: "blocked-preview",
      deploymentFit: "local",
      purpose:
        "Future closed-school or publisher-local folder lane for evidence attachments that must remain in a local companion installation.",
      requiredBeforeUse: [
        "approved local root",
        "relative evidence path",
        "local backup responsibility",
        "checksum required",
        "malware scan status",
        "retention period",
        "delete/export policy",
        "restore test evidence",
      ],
      blockedActions: ["No local folder write", "No local folder activation", "No student-facing attachment"],
    },
    {
      candidateId: "hybrid-export-archive",
      label: "Hybrid export archive candidate",
      status: "planned",
      deploymentFit: "hybrid",
      purpose:
        "Future portable archive lane for moving a reviewed evidence packet between hosted and local deployments without changing the canonical package release state.",
      requiredBeforeUse: [
        "archive manifest schema",
        "attachment checksum manifest",
        "reviewer identity binding",
        "retention period",
        "delete/export policy",
        "import quarantine path",
        "release-control state binding",
      ],
      blockedActions: ["No downloadable ZIP", "No signed approval attachment", "No release-state mutation"],
    },
  ],
  requiredMetadata: [
    "attachment id",
    "evidence packet id",
    "tenant scope",
    "source packet key",
    "quarantine path",
    "checksum required",
    "malware scan status",
    "retention period",
    "delete/export policy",
    "reviewer identity binding",
  ],
  storagePolicyGates: [
    "storage adapter selected",
    "access-control policy accepted",
    "encryption policy accepted",
    "local backup responsibility accepted",
    "audit log retention accepted",
    "student-facing attachment policy accepted",
    "release-control mutation policy accepted",
  ],
  blockedStorageActions: [
    "No evidence file upload",
    "No object storage write",
    "No local folder write",
    "No attachment download",
    "No signed approval attachment",
    "No release-state mutation",
    "No student-facing attachment",
  ],
};
