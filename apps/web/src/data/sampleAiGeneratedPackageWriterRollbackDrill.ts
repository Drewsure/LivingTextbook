import {
  sampleAiGeneratedPackageWriterPreflights,
  type AiGeneratedPackageWriterPreflight,
} from "@/data/sampleAiGeneratedPackageWriterPreflight";

export type AiGeneratedPackageWriterRollbackDrillStatus = "blocked" | "review-only";
export type AiGeneratedPackageWriterRollbackStepStatus = "blocked" | "needs-evidence";

export interface AiGeneratedPackageWriterRollbackStep {
  stepId: string;
  label: string;
  scope: string;
  status: AiGeneratedPackageWriterRollbackStepStatus;
  requiredSnapshot: string;
  verificationCheck: string;
  blockedActions: string[];
}

export interface AiGeneratedPackageWriterRollbackDrill {
  drillId: string;
  tenantId: string;
  requestId: string;
  preflightId: string;
  label: string;
  summary: string;
  status: AiGeneratedPackageWriterRollbackDrillStatus;
  drillState: string;
  packageIdPreview: string;
  preWriteSnapshots: string[];
  postWriteVerification: string[];
  rollbackSteps: AiGeneratedPackageWriterRollbackStep[];
  allowedReviewActions: string[];
  blockedRollbackActions: string[];
  nextRequiredRecords: string[];
  supportLanguageBoundary: string[];
}

export const sampleAiGeneratedPackageWriterRollbackDrills: AiGeneratedPackageWriterRollbackDrill[] =
  sampleAiGeneratedPackageWriterPreflights.map((preflight) => createRollbackDrill(preflight));

export function filterAiGeneratedPackageWriterRollbackDrillsByTenant(
  drills: AiGeneratedPackageWriterRollbackDrill[],
  tenantId: string,
): AiGeneratedPackageWriterRollbackDrill[] {
  return drills.filter((drill) => drill.tenantId === tenantId);
}

function createRollbackDrill(
  preflight: AiGeneratedPackageWriterPreflight,
): AiGeneratedPackageWriterRollbackDrill {
  const isMiniStar = preflight.tenantId === "ministar";

  return {
    drillId: `ai-generated-package-writer-rollback-drill-${preflight.requestId}`,
    tenantId: preflight.tenantId,
    requestId: preflight.requestId,
    preflightId: preflight.preflightId,
    label: isMiniStar
      ? "MiniStar generated package writer rollback drill"
      : "AI generated package writer rollback drill",
    summary:
      "Review-only rollback drill for a future generated package writer. It names the snapshots, post-write checks, and rollback rehearsal steps needed before any writer can mutate packages, routes, playlists, local bundles, assignments, or student-ready state.",
    status: "blocked",
    drillState: "Rollback drill blocked until writer implementation exists",
    packageIdPreview: preflight.packageIdPreview,
    preWriteSnapshots: [
      "Pre-write package JSON snapshot",
      "Pre-write route registry snapshot",
      "Pre-write media playlist snapshot",
      "Pre-write local companion manifest snapshot",
      "Pre-write assignment shell snapshot",
      "Pre-write release-control snapshot",
    ],
    postWriteVerification: [
      "Post-write route smoke check plan",
      "Post-write playlist binding check plan",
      "Post-write local bundle inventory check plan",
      "Post-write assignment safety check plan",
      "Post-write support-language boundary check plan",
      "Post-write rollback map check plan",
    ],
    rollbackSteps: [
      {
        stepId: `${preflight.packageIdPreview}-rollback-package-json`,
        label: "Package JSON rollback rehearsal",
        scope: "Generated content package record",
        status: "blocked",
        requiredSnapshot: "Pre-write package JSON snapshot",
        verificationCheck: "Package id, tenant id, target-language audio, and curated pathway must restore exactly.",
        blockedActions: ["No package JSON rollback execution", "No package writer execution"],
      },
      {
        stepId: `${preflight.packageIdPreview}-rollback-route-registry`,
        label: "Route registry rollback rehearsal",
        scope: "Launch and QR route registry",
        status: "blocked",
        requiredSnapshot: "Pre-write route registry snapshot",
        verificationCheck: "Stable QR/front-door aliases must remain unchanged unless a reviewed release-control plan exists.",
        blockedActions: ["No route registry rollback", "No production QR redirect mutation"],
      },
      {
        stepId: `${preflight.packageIdPreview}-rollback-playlist`,
        label: "Media playlist rollback rehearsal",
        scope: "Audio, music, video, and background media bindings",
        status: "blocked",
        requiredSnapshot: "Pre-write media playlist snapshot",
        verificationCheck: "Target-language learning audio must remain primary after restore.",
        blockedActions: ["No media playlist rollback", "No background media override"],
      },
      {
        stepId: `${preflight.packageIdPreview}-rollback-local-companion`,
        label: "Local companion rollback rehearsal",
        scope: "Closed local package manifest",
        status: "blocked",
        requiredSnapshot: "Pre-write local companion manifest snapshot",
        verificationCheck: "Local companion inventory must restore without changing learner identity or reports.",
        blockedActions: ["No local bundle rollback", "No local folder activation"],
      },
      {
        stepId: `${preflight.packageIdPreview}-rollback-assignment`,
        label: "Assignment shell rollback rehearsal",
        scope: "Teacher assignment preview shell",
        status: "blocked",
        requiredSnapshot: "Pre-write assignment shell snapshot",
        verificationCheck: "Assignment preview must restore without real learner data, report export, or student-ready state.",
        blockedActions: ["No assignment rollback", "No real learner data mutation"],
      },
    ],
    allowedReviewActions: [
      "Inspect package writer rollback drill",
      "Confirm every writer target has a pre-write snapshot",
      "Compare rollback steps against release-control and school policy records",
      "Return writer design for correction before implementation",
    ],
    blockedRollbackActions: [
      "No rollback execution",
      "No package writer execution",
      "No package JSON rollback execution",
      "No route registry rollback",
      "No media playlist rollback",
      "No local bundle rollback",
      "No assignment rollback",
      "No production QR redirect mutation",
      "No support-language-only rollback evidence",
    ],
    nextRequiredRecords: [
      "ai_generated_package_writer_preflight",
      "release_rollback_map",
      "school_policy_rollback_impact_matrix",
      "school_rollback_safe_fallback_preflight",
      "package_publish_gate",
      "classroom_launch_gate",
      "local_companion_release_gate",
    ],
    supportLanguageBoundary: isMiniStar
      ? [
          ...preflight.supportLanguageBoundary,
          "English remains the target-language rollback reference.",
          "Japanese hiragana support cannot satisfy rollback verification.",
        ]
      : preflight.supportLanguageBoundary,
  };
}
