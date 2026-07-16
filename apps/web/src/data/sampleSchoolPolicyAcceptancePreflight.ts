import { sampleReviewerIdentitySignatureGate } from "@/data/sampleReviewerIdentitySignatureGate";
import {
  sampleSchoolPolicyHandoffPacket,
  type SchoolPolicyHandoffPacket,
} from "@/data/sampleSchoolPolicyHandoffPacket";

export type SchoolPolicyAcceptancePreflightStatus = "blocked" | "needs-policy" | "ready-for-review";
export type SchoolPolicyAcceptancePreflightOwner = "school" | "publisher" | "platform" | "teacher" | "shared";

export interface SchoolPolicyAcceptancePreflightLane {
  laneId: string;
  label: string;
  status: SchoolPolicyAcceptancePreflightStatus;
  owner: SchoolPolicyAcceptancePreflightOwner;
  source: string;
  purpose: string;
  missingBeforeAcceptance: string[];
  blockedActions: string[];
}

export interface SchoolPolicyAcceptancePreflight {
  preflightId: string;
  label: string;
  tenantId: string;
  packageId: string;
  releaseCandidate: string;
  sourceOfTruth: string;
  acceptanceStatus: string;
  summary: string;
  lanes: SchoolPolicyAcceptancePreflightLane[];
  minimumAcceptanceRecord: string[];
  operatingRules: string[];
}

export const sampleSchoolPolicyAcceptancePreflight = createSchoolPolicyAcceptancePreflight({
  packet: sampleSchoolPolicyHandoffPacket,
});

export function createSchoolPolicyAcceptancePreflight({
  packet,
}: {
  packet: SchoolPolicyHandoffPacket;
}): SchoolPolicyAcceptancePreflight {
  return {
    preflightId: `${packet.packetId}-acceptance-preflight`,
    label: "School policy acceptance preflight",
    tenantId: packet.tenantId,
    packageId: packet.packageId,
    releaseCandidate: packet.releaseCandidate,
    sourceOfTruth: "Source of truth: school policy handoff packet and reviewer identity/signature gate",
    acceptanceStatus: "Acceptance blocked",
    summary:
      "This preflight names what must exist before a future school policy acceptance workflow is allowed. It is not an accept button, signature flow, evidence export, launch approval, or release mutation.",
    lanes: [
      {
        laneId: "authenticated-school-approver",
        label: "Authenticated school approver",
        status: "blocked",
        owner: "school",
        source: sampleReviewerIdentitySignatureGate.gateId,
        purpose: "Confirms that the person accepting policy is known, authorized, and tied to the school and tenant.",
        missingBeforeAcceptance: [
          "Named school approver account",
          "Tenant and school role binding",
          "Session re-authentication rule",
          "Approval role at time of acceptance",
          "Revocation owner",
        ],
        blockedActions: [
          "No accept button",
          "No anonymous approval",
          "No shared-login approval",
          "No chat-only identity proof",
        ],
      },
      {
        laneId: "policy-text-and-scope",
        label: "Policy text and scope",
        status: "blocked",
        owner: "school",
        source: "school-policy-handoff-packet",
        purpose: "Defines exactly what the school would accept, including package version, retention, reporting, optional features, and local deployment scope.",
        missingBeforeAcceptance: [
          "Policy text version",
          "Package and release candidate scope",
          "Privacy, retention, report, and access-control wording",
          "Microphone, AI Tutor, and cost-visible optional feature wording",
          "Hosted, local, or hybrid deployment wording",
        ],
        blockedActions: [
          "No broad verbal acceptance",
          "No package-wide consent from meeting notes",
          "No AI Tutor activation",
          "No launch-ready status",
        ],
      },
      {
        laneId: "evidence-and-attachment-readiness",
        label: "Evidence packet and attachment readiness",
        status: "blocked",
        owner: "platform",
        source: "evidence-packet-and-attachment-gates",
        purpose: "Ensures acceptance can point to durable evidence without depending on screenshots, chat logs, or unmanaged files.",
        missingBeforeAcceptance: [
          "Evidence packet version freeze policy",
          "Evidence attachment storage adapter",
          "Checksum and malware-scan policy",
          "Delete/export policy",
          "Signed proof method policy",
        ],
        blockedActions: [
          "No evidence export",
          "No signed PDF packet",
          "No signature attachment upload",
          "No evidence download",
        ],
      },
      {
        laneId: "release-control-binding",
        label: "Release-control binding",
        status: "blocked",
        owner: "platform",
        source: "package-publish-gate-and-approval-ledger",
        purpose: "Binds any future acceptance to the exact release candidate, gate state, and rollback policy.",
        missingBeforeAcceptance: [
          "Release candidate id",
          "School launch policy gate version",
          "School policy handoff packet version",
          "Release-state mutation rule",
          "Rollback and route promotion rule",
        ],
        blockedActions: [
          "No release-state mutation",
          "No launch-ready override",
          "No production QR promise",
          "No route promotion",
        ],
      },
      {
        laneId: "child-safety-and-progression",
        label: "Child safety and progression boundaries",
        status: "needs-policy",
        owner: "shared",
        source: "launch-safety-and-progress-rules",
        purpose: "Keeps learning progression tied to target-language activity and keeps premium or sensitive features opt-in.",
        missingBeforeAcceptance: [
          "Target-language-only progress trigger policy",
          "Support-language support-only policy",
          "Microphone consent and default-off policy",
          "AI Tutor package entitlement and cost policy",
          "Media-only progress block",
        ],
        blockedActions: [
          "No support-language-only progression",
          "No media-only mastery",
          "No microphone scoring by default",
          "No AI Tutor activation",
        ],
      },
      {
        laneId: "hosted-local-deployment-readiness",
        label: "Hosted, local, and rollback readiness",
        status: "needs-policy",
        owner: "shared",
        source: "backend-storage-and-local-companion-gates",
        purpose: "Prevents a school policy acceptance from promising hosted or closed/local behavior that has not been selected and tested.",
        missingBeforeAcceptance: [
          "Backend adapter selection",
          "Local backup and restore owner",
          "Local update and yearly replacement owner",
          "Evidence export permission",
          "Offline QR or deep-link fallback rule",
        ],
        blockedActions: [
          "No storage adapter selected",
          "No local folder activation",
          "No object storage write",
          "No local deployment activation",
        ],
      },
    ],
    minimumAcceptanceRecord: [
      "school_policy_acceptance_id",
      "tenant_id",
      "school_id",
      "approver_identity_id",
      "approver_role_at_acceptance",
      "package_id",
      "release_candidate_id",
      "policy_text_version",
      "school_launch_policy_gate_id",
      "school_policy_handoff_packet_id",
      "evidence_packet_version_id",
      "accepted_scope",
      "timestamp",
      "revocation_policy_id",
      "release_control_state_before",
      "release_control_state_after",
    ],
    operatingRules: [
      "The preflight is required before any future accept button exists.",
      "Acceptance cannot override missing media rights, storage, evidence, route, audio, accessibility, or release-control gates.",
      "A school acceptance cannot turn support-language activity into mastery evidence.",
      "AI Tutor, microphone scoring, report export, and local deployment remain separate opt-in policy choices.",
      "Acceptance must be versioned, revocable, exportable, and tied to a known release candidate.",
      "No live classroom workflow can start from this preflight.",
    ],
  };
}
