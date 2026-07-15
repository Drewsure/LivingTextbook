export type EvidenceExportReadinessStatus = "blocked-preview" | "planned";

export interface EvidenceExportFormat {
  formatId: string;
  label: string;
  status: EvidenceExportReadinessStatus;
  purpose: string;
  requiredBeforeUse: string[];
  notAllowedYet: string[];
}

export interface EvidenceExportRecipientLane {
  laneId: string;
  label: string;
  recipientRole: string;
  responsibility: string;
  requiredBeforeSend: string[];
}

export interface EvidenceExportReadinessPlan {
  planId: string;
  tenantId: string;
  label: string;
  summary: string;
  sourceHandoffRoute: string;
  exportStatus: string;
  signatureStatus: string;
  storageStatus: string;
  formats: EvidenceExportFormat[];
  recipientLanes: EvidenceExportRecipientLane[];
  identityAndSignatureGates: string[];
  retentionAndPolicyGates: string[];
  blockedActions: string[];
}

export const sampleEvidenceExportReadinessPlan: EvidenceExportReadinessPlan = {
  planId: "sample-publisher-evidence-export-readiness",
  tenantId: "sample-publisher",
  label: "Evidence export readiness",
  summary:
    "Defines what must exist before an evidence packet can be exported, signed, shared, or used to advance a package release. This is a foundation gate only; no export file, signed approval, email handoff, or release-state change is created.",
  sourceHandoffRoute: "/teacher/evidence/sample-publisher/handoff",
  exportStatus: "Evidence export blocked",
  signatureStatus: "Signed approval capture blocked",
  storageStatus: "Attachment storage and audit policy required",
  formats: [
    {
      formatId: "reviewer-summary-pdf",
      label: "Reviewer summary PDF",
      status: "blocked-preview",
      purpose: "Human-readable packet for publisher, school, or platform review meetings.",
      requiredBeforeUse: [
        "stable packet version id",
        "rendered evidence snapshot",
        "reviewer identity",
        "retention and deletion policy",
      ],
      notAllowedYet: ["No PDF generation", "No download button", "No signed approval embedded in PDF"],
    },
    {
      formatId: "machine-readable-json",
      label: "Machine-readable JSON packet",
      status: "blocked-preview",
      purpose: "Structured evidence bundle for release-control checks, audit trails, and hosted/local parity.",
      requiredBeforeUse: [
        "JSON schema version",
        "checksum for attached evidence",
        "release-control state binding",
        "policy-approved export scope",
      ],
      notAllowedYet: ["No JSON export", "No release-state mutation", "No automatic package approval"],
    },
    {
      formatId: "local-companion-manifest",
      label: "Local companion evidence manifest",
      status: "planned",
      purpose: "Offline/local handoff manifest for closed deployments that need media bundle and classroom server review.",
      requiredBeforeUse: [
        "local bundle checksum policy",
        "offline media rights approval",
        "school storage responsibility",
        "restore and backup policy",
      ],
      notAllowedYet: ["No downloadable ZIP", "No local folder activation", "No offline-ready claim"],
    },
  ],
  recipientLanes: [
    {
      laneId: "publisher-recipient",
      label: "Publisher evidence recipient",
      recipientRole: "publisher reviewer",
      responsibility: "Checks ownership, replacement files, edition changes, and year-on-year maintenance obligations.",
      requiredBeforeSend: ["publisher reviewer identity", "rights proof attachments", "source lineage snapshot"],
    },
    {
      laneId: "school-recipient",
      label: "School evidence recipient",
      recipientRole: "school approver",
      responsibility: "Checks classroom launch policy, learner data limits, reporting expectations, and local deployment needs.",
      requiredBeforeSend: ["school approver identity", "student-data policy", "report export policy"],
    },
    {
      laneId: "platform-recipient",
      label: "Platform evidence recipient",
      recipientRole: "platform operator",
      responsibility: "Checks storage adapters, release-control state, route safety, and hosted/local compatibility.",
      requiredBeforeSend: ["operator identity", "evidence storage adapter", "release-control gate result"],
    },
  ],
  identityAndSignatureGates: [
    "authenticated reviewer identity",
    "publisher reviewer identity",
    "school approver identity",
    "platform operator identity",
    "timestamped approval intent",
    "signature revocation policy",
  ],
  retentionAndPolicyGates: [
    "evidence attachment storage policy",
    "retention period",
    "export deletion policy",
    "local copy responsibility",
    "PII minimization check",
    "audit access policy",
  ],
  blockedActions: [
    "No evidence packet export",
    "No signed approval capture",
    "No PDF generation",
    "No JSON export",
    "No downloadable ZIP",
    "No email handoff",
    "No release-state mutation",
    "No student assignment from export",
  ],
};
