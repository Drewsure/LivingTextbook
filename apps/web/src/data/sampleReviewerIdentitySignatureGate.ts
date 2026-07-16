export type ReviewerIdentitySignatureLaneStatus = "blocked" | "planned";

export interface ReviewerIdentitySignatureLane {
  laneId: string;
  label: string;
  status: ReviewerIdentitySignatureLaneStatus;
  ownerRole: string;
  purpose: string;
  requiredBeforeApproval: string[];
  blockedActions: string[];
}

export interface ReviewerIdentitySignatureGate {
  gateId: string;
  tenantId: string;
  label: string;
  summary: string;
  identityStatus: string;
  signatureStatus: string;
  approvalCaptureStatus: string;
  evidenceRoute: string;
  handoffRoute: string;
  lanes: ReviewerIdentitySignatureLane[];
  minimumApprovalRecord: string[];
  policyRules: string[];
  blockedActions: string[];
}

export const sampleReviewerIdentitySignatureGate: ReviewerIdentitySignatureGate = {
  gateId: "sample-publisher-reviewer-identity-signature-gate",
  tenantId: "sample-publisher",
  label: "Reviewer identity and signature gate",
  summary:
    "Review-only gate for authenticated reviewer identity, approval intent, signature policy, revocation, and audit rules before any signed approval capture or release-state movement exists.",
  identityStatus: "Reviewer identity blocked",
  signatureStatus: "Signed approval capture blocked",
  approvalCaptureStatus: "Approval intent preview only",
  evidenceRoute: "/teacher/evidence/sample-publisher",
  handoffRoute: "/teacher/evidence/sample-publisher/handoff",
  lanes: [
    {
      laneId: "identity-provider-lane",
      label: "Authenticated reviewer identity lane",
      status: "blocked",
      ownerRole: "Platform operator",
      purpose: "Confirms the human reviewer is known before evidence can become approval proof.",
      requiredBeforeApproval: [
        "identity provider selected",
        "reviewer account id",
        "tenant role binding",
        "multi-school role boundary",
        "session re-authentication rule",
      ],
      blockedActions: ["No anonymous approval", "No shared teacher login approval", "No chat-only identity proof"],
    },
    {
      laneId: "approval-intent-lane",
      label: "Approval intent lane",
      status: "blocked",
      ownerRole: "School or publisher approver",
      purpose: "Captures exactly what the reviewer intends to approve without changing release state.",
      requiredBeforeApproval: [
        "package version id",
        "evidence packet version id",
        "approval scope",
        "timestamped approval intent",
        "cannot approve while list accepted",
      ],
      blockedActions: ["No approve button", "No release-state mutation", "No packet version freeze from intent"],
    },
    {
      laneId: "signature-policy-lane",
      label: "Signature policy lane",
      status: "planned",
      ownerRole: "Tenant admin",
      purpose: "Defines whether a tenant uses typed attestation, platform account approval, or external signature proof.",
      requiredBeforeApproval: [
        "signature method policy",
        "signature revocation policy",
        "evidence attachment policy",
        "retention and deletion policy",
        "export recipient policy",
      ],
      blockedActions: ["No typed signature", "No external signature attachment", "No signed PDF packet"],
    },
    {
      laneId: "audit-and-retention-lane",
      label: "Audit and retention lane",
      status: "blocked",
      ownerRole: "Platform and tenant owner",
      purpose: "Keeps approval evidence traceable, exportable, and deletable without exposing student data.",
      requiredBeforeApproval: [
        "audit log retention",
        "evidence export scope",
        "delete/export policy",
        "PII minimization check",
        "release-control binding",
      ],
      blockedActions: ["No audit record write", "No evidence download", "No retention clock start"],
    },
  ],
  minimumApprovalRecord: [
    "reviewer_identity_id",
    "tenant_id",
    "role_at_approval",
    "package_id",
    "package_version_id",
    "evidence_packet_version_id",
    "approval_scope",
    "approval_intent_text",
    "timestamp",
    "revocation_policy_id",
    "release_control_state_before",
    "release_control_state_after",
  ],
  policyRules: [
    "Approval capture must be optional per white-label tenant until the tenant buys or accepts the package.",
    "Typed or account-based approval can never replace missing rights, scan, audio, accessibility, storage, or launch evidence.",
    "Support-language evidence can explain a decision but cannot unlock progress or release state.",
    "Any future signature attachment must use the evidence attachment storage contract, not a chat transcript.",
    "Local deployments must name the school or publisher backup and restore owner before signatures are accepted.",
  ],
  blockedActions: [
    "No signed approval capture",
    "No approve button",
    "No release-state mutation",
    "No packet version freeze",
    "No audit record write",
    "No signature attachment upload",
    "No signed PDF packet",
    "No evidence download",
    "No student assignment from approval",
  ],
};
