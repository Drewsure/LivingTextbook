import {
  sampleAiGeneratedPackageAssemblyDryRuns,
  type AiGeneratedPackageAssemblyDryRun,
} from "@/data/sampleAiGeneratedPackageAssemblyDryRun";

export type AiGeneratedPackageWriterPreflightStatus = "blocked" | "review-only";
export type AiGeneratedPackageWriterTargetStatus = "blocked" | "needs-review";

export interface AiGeneratedPackageWriterTarget {
  targetId: string;
  label: string;
  writerType: string;
  status: AiGeneratedPackageWriterTargetStatus;
  sourceArtifact: string;
  requiredEvidence: string[];
  blockedWrites: string[];
}

export interface AiGeneratedPackageWriterPreflight {
  preflightId: string;
  tenantId: string;
  requestId: string;
  dryRunId: string;
  label: string;
  summary: string;
  status: AiGeneratedPackageWriterPreflightStatus;
  preflightState: string;
  packageIdPreview: string;
  writerTargets: AiGeneratedPackageWriterTarget[];
  allowedReviewActions: string[];
  blockedWriterActions: string[];
  nextRequiredRecords: string[];
  supportLanguageBoundary: string[];
}

export const sampleAiGeneratedPackageWriterPreflights: AiGeneratedPackageWriterPreflight[] =
  sampleAiGeneratedPackageAssemblyDryRuns.map((dryRun) => createPreflight(dryRun));

export function filterAiGeneratedPackageWriterPreflightsByTenant(
  preflights: AiGeneratedPackageWriterPreflight[],
  tenantId: string,
): AiGeneratedPackageWriterPreflight[] {
  return preflights.filter((preflight) => preflight.tenantId === tenantId);
}

function createPreflight(dryRun: AiGeneratedPackageAssemblyDryRun): AiGeneratedPackageWriterPreflight {
  const isMiniStar = dryRun.tenantId === "ministar";

  return {
    preflightId: `ai-generated-package-writer-preflight-${dryRun.requestId}`,
    tenantId: dryRun.tenantId,
    requestId: dryRun.requestId,
    dryRunId: dryRun.dryRunId,
    label: isMiniStar ? "MiniStar generated package writer preflight" : "AI generated package writer preflight",
    summary:
      "Review-only preflight for the future package writer. It names the writer targets and evidence required before any generated package JSON, route, playlist, local companion, assignment shell, or rollback map can be written.",
    status: "blocked",
    preflightState: "Writer blocked until release-control implementation",
    packageIdPreview: dryRun.packageIdPreview,
    writerTargets: [
      {
        targetId: `${dryRun.packageIdPreview}-json-writer`,
        label: "Package JSON writer",
        writerType: "content_package_writer",
        status: "blocked",
        sourceArtifact: "Generated package JSON",
        requiredEvidence: [
          dryRun.dryRunId,
          "ai_generated_package_assembly_readiness",
          "package_approval_ledger",
          "package_publish_gate",
        ],
        blockedWrites: ["No package writer execution", "No package JSON commit"],
      },
      {
        targetId: `${dryRun.packageIdPreview}-route-writer`,
        label: "Route registry writer",
        writerType: "route_registry_writer",
        status: "blocked",
        sourceArtifact: "Route registry entry",
        requiredEvidence: [dryRun.dryRunId, "classroom_launch_gate", "school_launch_policy_gate"],
        blockedWrites: ["No route registry mutation", "No QR target mutation"],
      },
      {
        targetId: `${dryRun.packageIdPreview}-playlist-writer`,
        label: "Media playlist writer",
        writerType: "media_playlist_writer",
        status: "blocked",
        sourceArtifact: "Media playlist binding",
        requiredEvidence: [dryRun.dryRunId, "media_rights_manifest", "package_game_audio_coverage"],
        blockedWrites: ["No media playlist creation", "No background media override"],
      },
      {
        targetId: `${dryRun.packageIdPreview}-local-writer`,
        label: "Local companion writer",
        writerType: "local_companion_writer",
        status: "blocked",
        sourceArtifact: "Local companion artifact",
        requiredEvidence: [dryRun.dryRunId, "local_companion_release_gate", "local_companion_handoff"],
        blockedWrites: ["No local bundle packaging", "No local folder activation"],
      },
      {
        targetId: `${dryRun.packageIdPreview}-assignment-writer`,
        label: "Assignment shell writer",
        writerType: "teacher_assignment_writer",
        status: "blocked",
        sourceArtifact: "Assignment shell",
        requiredEvidence: [dryRun.dryRunId, "teacher_assignment_rollout_gate", "class_roster_plan"],
        blockedWrites: ["No assignment activation", "No real learner data capture"],
      },
      {
        targetId: `${dryRun.packageIdPreview}-rollback-writer`,
        label: "Rollback map writer",
        writerType: "release_rollback_writer",
        status: "blocked",
        sourceArtifact: "Release rollback map",
        requiredEvidence: [dryRun.dryRunId, "school_policy_rollback_impact_matrix", "school_rollback_safe_fallback_plan"],
        blockedWrites: ["No rollback map write", "No production QR redirect mutation"],
      },
    ],
    allowedReviewActions: [
      "Inspect package writer targets",
      "Compare writer targets against dry-run artifacts",
      "Identify missing release-control, policy, approval, media, and local records",
      "Return generated package for correction before writer design",
    ],
    blockedWriterActions: [
      "No package writer execution",
      "No package JSON commit",
      "No route registry mutation",
      "No media playlist creation",
      "No local bundle packaging",
      "No assignment activation",
      "No student-ready marker from writer preflight",
      "No support-language-only package writer",
    ],
    nextRequiredRecords: [
      "ai_generated_package_assembly_dry_run",
      "package_publish_gate",
      "package_approval_ledger",
      "classroom_launch_gate",
      "media_rights_manifest",
      "local_companion_release_gate",
      "teacher_assignment_rollout_gate",
      "school_policy_rollback_impact_matrix",
    ],
    supportLanguageBoundary: dryRun.supportLanguageBoundary,
  };
}
