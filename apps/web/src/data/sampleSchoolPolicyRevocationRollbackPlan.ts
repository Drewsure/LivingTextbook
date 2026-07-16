import {
  sampleSchoolPolicyAcceptanceRecordPreview,
  type SchoolPolicyAcceptanceRecordPreview,
} from "@/data/sampleSchoolPolicyAcceptanceRecordPreview";

export type SchoolPolicyRollbackLaneStatus = "blocked" | "needs-policy" | "future-required";
export type SchoolPolicyRollbackOwner = "school" | "publisher" | "platform" | "teacher" | "shared";

export interface SchoolPolicyRollbackLane {
  laneId: string;
  label: string;
  status: SchoolPolicyRollbackLaneStatus;
  owner: SchoolPolicyRollbackOwner;
  trigger: string;
  requiredPolicy: string[];
  blockedEffects: string[];
}

export interface SchoolPolicyRollbackStorageContract {
  entityId: string;
  categoryId: string;
  durableRecordId: string;
  schemaPrimaryKey: string;
  hostedWriteIntentId: string;
  localWriteIntentId: string;
  blockedLiveActions: string[];
}

export interface SchoolPolicyRevocationRollbackPlan {
  planId: string;
  label: string;
  tenantId: string;
  packageId: string;
  releaseCandidate: string;
  sourceOfTruth: string;
  statusLabel: string;
  summary: string;
  storageContract: SchoolPolicyRollbackStorageContract;
  lanes: SchoolPolicyRollbackLane[];
  minimumRollbackRecordFields: string[];
  blockedActions: string[];
  reviewRules: string[];
}

export const sampleSchoolPolicyRevocationRollbackPlan = createSchoolPolicyRevocationRollbackPlan({
  acceptancePreview: sampleSchoolPolicyAcceptanceRecordPreview,
});

export function createSchoolPolicyRevocationRollbackPlan({
  acceptancePreview,
}: {
  acceptancePreview: SchoolPolicyAcceptanceRecordPreview;
}): SchoolPolicyRevocationRollbackPlan {
  return {
    planId: `${acceptancePreview.previewId}-revocation-rollback-plan`,
    label: "School policy revocation and rollback preview",
    tenantId: acceptancePreview.tenantId,
    packageId: acceptancePreview.packageId,
    releaseCandidate: acceptancePreview.releaseCandidate,
    sourceOfTruth: "Source of truth: future school acceptance record preview",
    statusLabel: "Rollback policy blocked",
    summary:
      "This preview names the rollback and revocation decisions that must exist before school acceptance can ever affect launch readiness. It cannot revoke, approve, roll back, export, or mutate a release.",
    storageContract: {
      entityId: "school_policy_revocation_rollback_preview",
      categoryId: "school-policy-revocation-rollback-preview",
      durableRecordId: "school-policy-revocation-rollback-preview-record",
      schemaPrimaryKey: "school_policy_revocation_rollback_preview_id",
      hostedWriteIntentId: "hosted-school-policy-revocation-rollback-preview-write",
      localWriteIntentId: "local-school-policy-revocation-rollback-preview-write",
      blockedLiveActions: [
        "Revocation action",
        "Rollback button",
        "Release-state mutation",
        "Production QR redirect mutation",
        "Learner-data deletion workflow",
        "Report export",
        "Media replacement",
        "Local bundle deactivation",
        "AI Tutor entitlement change",
        "Live classroom shutdown workflow",
      ],
    },
    lanes: [
      {
        laneId: "revocation-request-authority",
        label: "Revocation request authority",
        status: "future-required",
        owner: "school",
        trigger: "School approver or authorized school admin withdraws consent",
        requiredPolicy: [
          "Who can revoke school acceptance",
          "How identity and role are verified",
          "Whether teacher notice is required before classroom access changes",
          "How revocation is logged without exposing learner data",
        ],
        blockedEffects: [
          "No revocation action",
          "No school account lockout",
          "No live session shutdown",
        ],
      },
      {
        laneId: "release-rollback-scope",
        label: "Release rollback scope",
        status: "needs-policy",
        owner: "platform",
        trigger: "School revocation, policy mismatch, media rights issue, or release defect",
        requiredPolicy: [
          "Which package release or route aliases are affected",
          "Whether rollback returns to a previous reviewed release",
          "How teacher reports and event history remain auditable",
          "Who approves rollback completion",
        ],
        blockedEffects: [
          "No release-state mutation",
          "No package downgrade",
          "No launch-ready status change",
        ],
      },
      {
        laneId: "printed-qr-route-effect",
        label: "Printed QR and route effect",
        status: "needs-policy",
        owner: "shared",
        trigger: "Printed textbook QR must stop pointing to a revoked or unsafe release",
        requiredPolicy: [
          "Whether QR resolves to pause notice, teacher contact, or safe fallback",
          "How cached installed PWA and local companion routes are handled",
          "How students are prevented from entering revoked live sessions",
          "How support pages avoid exposing private school data",
        ],
        blockedEffects: [
          "No production QR redirect mutation",
          "No route alias shutdown",
          "No local deep-link change",
        ],
      },
      {
        laneId: "learner-data-report-effect",
        label: "Learner data and report effect",
        status: "blocked",
        owner: "school",
        trigger: "School withdraws permission for learner data or report processing",
        requiredPolicy: [
          "Retention, export, deletion, and audit rules after revocation",
          "Who can still view historical teacher reports",
          "Whether anonymized aggregate evidence can remain",
          "How support-language and microphone records are handled",
        ],
        blockedEffects: [
          "No real learner data collection",
          "No report export",
          "No deletion workflow",
        ],
      },
      {
        laneId: "publisher-media-local-package-effect",
        label: "Publisher media and local package effect",
        status: "needs-policy",
        owner: "publisher",
        trigger: "Media license or local package permission changes after school review",
        requiredPolicy: [
          "Whether media playlists are paused or replaced",
          "Whether local bundles must be updated, disabled, or archived",
          "How year-on-year publisher changes are communicated",
          "How evidence packets preserve the replaced media version",
        ],
        blockedEffects: [
          "No playlist mutation",
          "No local bundle deactivation",
          "No media replacement",
        ],
      },
      {
        laneId: "premium-feature-effect",
        label: "Microphone and AI Tutor effect",
        status: "blocked",
        owner: "shared",
        trigger: "School revokes optional premium features or usage cap terms",
        requiredPolicy: [
          "Whether microphone, speech scoring, and AI Tutor are disabled immediately",
          "How model-call usage caps and billing stop",
          "How transcript policy is enforced when transcripts are never enabled",
          "How the platform keeps non-AI gameplay usable",
        ],
        blockedEffects: [
          "No AI Tutor activation",
          "No microphone scoring",
          "No model-call entitlement change",
        ],
      },
    ],
    minimumRollbackRecordFields: [
      "revocation_rollback_plan_id",
      "acceptance_record_preview_id",
      "school_id",
      "tenant_id",
      "package_id",
      "release_candidate_id",
      "authorized_revoker_role",
      "affected_release_scope",
      "affected_qr_route_scope",
      "learner_data_report_effect",
      "media_local_package_effect",
      "premium_feature_effect",
      "audit_retention_rule",
      "rollback_completion_owner",
    ],
    blockedActions: [
      "No revocation action",
      "No rollback button",
      "No release-state mutation",
      "No production QR redirect mutation",
      "No learner data deletion workflow",
      "No report export",
      "No media replacement",
      "No local bundle deactivation",
      "No AI Tutor entitlement change",
      "No live classroom shutdown workflow",
    ],
    reviewRules: [
      "A future acceptance workflow must have a matching revocation and rollback policy.",
      "Rollback must name affected release, route, media, local package, report, and premium feature scopes.",
      "Revocation must not erase audit records needed for school, publisher, or platform accountability.",
      "Production QR behavior after revocation must be safe for printed textbook use.",
      "A rollback preview cannot mutate release state, delete learner data, export reports, or disable local packages.",
    ],
  };
}
