import { sampleSchoolPolicyRevocationRollbackPlan } from "@/data/sampleSchoolPolicyRevocationRollbackPlan";

export type RollbackImpactStatus = "blocked" | "needs-policy" | "future-required";
export type RollbackImpactScope =
  | "release"
  | "qr-route"
  | "learner-data-report"
  | "media-local-package"
  | "premium-feature"
  | "support-operations";
export type RollbackImpactOwner = "school" | "publisher" | "platform" | "teacher" | "shared";

export interface SchoolPolicyRollbackImpactRow {
  rowId: string;
  scope: RollbackImpactScope;
  label: string;
  owner: RollbackImpactOwner;
  status: RollbackImpactStatus;
  affectedRecords: string[];
  requiredEvidence: string[];
  blockedActions: string[];
}

export interface SchoolPolicyRollbackImpactMatrix {
  matrixId: string;
  label: string;
  sourcePlanId: string;
  statusLabel: string;
  summary: string;
  rows: SchoolPolicyRollbackImpactRow[];
  matrixRules: string[];
}

export const sampleSchoolPolicyRollbackImpactMatrix: SchoolPolicyRollbackImpactMatrix = {
  matrixId: `${sampleSchoolPolicyRevocationRollbackPlan.planId}-impact-matrix`,
  label: "School rollback impact matrix",
  sourcePlanId: sampleSchoolPolicyRevocationRollbackPlan.planId,
  statusLabel: "Impact matrix blocked",
  summary:
    "This matrix names what a future school policy revocation or rollback would touch across releases, printed QR routes, learner-data/reporting, media/local packages, premium features, and support operations. It is a read-only evidence map, not a rollback workflow.",
  rows: [
    {
      rowId: "release-state-impact",
      scope: "release",
      label: "Release state impact",
      owner: "platform",
      status: "blocked",
      affectedRecords: ["package_release_candidate", "package_publish_gate", "package_approval_ledger"],
      requiredEvidence: [
        "Release candidate version affected by revocation",
        "Open publish gates and approval ledger state",
        "Rollback completion owner before any state change",
      ],
      blockedActions: ["No release-state mutation", "No package downgrade", "No launch-ready status change"],
    },
    {
      rowId: "printed-qr-route-impact",
      scope: "qr-route",
      label: "Printed QR route impact",
      owner: "shared",
      status: "needs-policy",
      affectedRecords: ["route_alias", "edition_qr_alias", "local_companion_release_gate"],
      requiredEvidence: [
        "Printed QR id and route alias inventory",
        "Safe fallback route policy for revoked packages",
        "Local companion route behavior for cached or installed use",
      ],
      blockedActions: ["No production QR redirect mutation", "No route alias shutdown", "No local deep-link change"],
    },
    {
      rowId: "learner-data-report-impact",
      scope: "learner-data-report",
      label: "Learner data and report impact",
      owner: "school",
      status: "blocked",
      affectedRecords: ["launch_session", "progress_event", "teacher_report_package"],
      requiredEvidence: [
        "School retention and deletion policy",
        "Teacher report access after revocation",
        "Anonymized aggregate evidence rules",
      ],
      blockedActions: ["No learner-data deletion workflow", "No report export", "No real learner data collection"],
    },
    {
      rowId: "media-local-package-impact",
      scope: "media-local-package",
      label: "Media and local package impact",
      owner: "publisher",
      status: "needs-policy",
      affectedRecords: ["media_manifest", "media_playlist_binding", "local_media_bundle_entry"],
      requiredEvidence: [
        "Media rights version affected by rollback",
        "Playlist replacement or pause policy",
        "Local bundle update, disable, or archive procedure",
      ],
      blockedActions: ["No media replacement", "No playlist mutation", "No local bundle deactivation"],
    },
    {
      rowId: "premium-feature-impact",
      scope: "premium-feature",
      label: "Premium feature impact",
      owner: "shared",
      status: "blocked",
      affectedRecords: ["tenant", "launch_session", "teacher_session_settings"],
      requiredEvidence: [
        "AI Tutor and microphone opt-in status",
        "Usage cap and billing stop policy",
        "Transcript and speech scoring policy, if ever enabled",
      ],
      blockedActions: ["No AI Tutor entitlement change", "No microphone scoring", "No model-call entitlement change"],
    },
    {
      rowId: "support-operations-impact",
      scope: "support-operations",
      label: "Support operations impact",
      owner: "platform",
      status: "future-required",
      affectedRecords: ["evidence_packet", "evidence_attachment", "school_policy_revocation_rollback_preview"],
      requiredEvidence: [
        "Evidence packet version and attachment readiness",
        "Authorized school approver or revoker identity method",
        "Support handoff wording for teachers and schools",
      ],
      blockedActions: ["No evidence export", "No signed approval capture", "No live classroom shutdown workflow"],
    },
  ],
  matrixRules: [
    "No impact row can mutate release, route, media, local package, report, learner-data, premium entitlement, or classroom state.",
    "Target-language performance remains the only progression trigger; support language remains support-only.",
    "AI Tutor, microphone, and speech scoring stay optional premium features and cannot be changed by a rollback preview.",
    "Printed QR behavior after revocation must remain safe before any production QR redirect can exist.",
    "Local deployment rollback must be designed with backup, update, and school support procedures before activation.",
  ],
};
